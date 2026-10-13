(() => {
  "use strict";

  const MISSION_PHASES = Object.freeze(["cabin", "wake", "launch", "earth", "warp", "deep-space", "galaxy", "return", "sleep"]);
  const PHASE_TIMINGS = Object.freeze({ wake: 2000, launch: 4000, earth: 5000, warp: 3000, "deep-space": 3000 });
  const RETURN_DURATION = 7000;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;
  const stage = document.querySelector("[data-room-stage]");
  const canvas = document.querySelector("[data-mission-canvas]");
  const controls = [...document.querySelectorAll("[data-command]")];
  const soundButton = document.querySelector("[data-sound-toggle]");
  const kicker = document.querySelector("[data-state-kicker]");
  const title = document.querySelector("[data-state-title]");
  const copy = document.querySelector("[data-state-copy]");
  const roomAlt = document.querySelector("[data-room-alt]");
  const missionAssetSources = [...document.querySelectorAll("[data-srcset]")];
  const missionAssetImages = [...document.querySelectorAll("img[data-src]")];
  let missionAssetsRequested = false;

  function loadMissionAssets() {
    if (missionAssetsRequested) return;
    missionAssetsRequested = true;
    missionAssetSources.forEach((source) => { source.srcset = source.dataset.srcset; });
    missionAssetImages.forEach((image) => { image.src = image.dataset.src; });
  }

  const STATE_COPY = {
    cabin: ["Cabin idle", "Your spacecraft is ready", "The cockpit is quiet until the pilot chooses to begin."],
    wake: ["Pod wake", "Cockpit online", "Orbit is awake. A local sphere is forming at the emitter."],
    launch: ["Launch", "The room is opening", "The route grows from the cockpit across the wall and ceiling."],
    earth: ["Earth orbit", "Beside our planet", "The curve of Earth is larger than the room."],
    warp: ["Scale jump", "Course locked", "Space stretches gently as Orbit confirms the route."],
    "deep-space": ["Deep space", "Between destinations", "Movement slows. The field opens into distance."],
    galaxy: ["Galaxy scale", "The Milky Way", "Move nearby and the local star field will notice you."],
    return: ["Return home", "Cabin light returning", "Space is folding back into the pod emitter."],
    sleep: ["Sleep", "Mission complete", "Orbit is docked. The room is quiet."]
  };

  const ALT_COPY = {
    cabin: "A future spacecraft cabin with an open, sleepable Command Pod, reachable inner console, Orbit charging in a wall dock, and a warm Navigation Beacon.",
    wake: "The pod control ring and Orbit wake while a small local holographic sphere forms above the Command Pod emitter.",
    launch: "A route expands from the pod emitter as the window darkens and the wall and ceiling begin opening into space.",
    earth: "A vast blue Earth horizon extends beyond the room while the Command Pod remains visible in the foreground.",
    warp: "Stars lengthen gently around the physical Command Pod as the cabin crosses into deep space.",
    "deep-space": "A quiet layered star field and distant nebula create depth behind the visible Command Pod.",
    galaxy: "A huge cropped Milky Way fills the wall and ceiling behind the Command Pod; nearby stars respond subtly to pointer or touch movement.",
    return: "The galaxy recedes, Earth passes by, and the route contracts into the pod emitter as warm cabin light returns.",
    sleep: "The clean room rests in low amber light with Orbit docked, the Navigation Beacon dim, and no galaxy visible."
  };

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smooth = (value) => {
    const x = clamp(value);
    return x * x * (3 - 2 * x);
  };
  const progress = (time, start, duration) => smooth((time - start) / duration);

  class MissionAudio {
    constructor(button) {
      this.button = button;
      this.enabled = false;
      this.context = null;
      this.master = null;
      this.hum = null;
      button.addEventListener("click", () => this.toggle());
    }

    async toggle() {
      this.enabled = !this.enabled;
      this.button.setAttribute("aria-pressed", String(this.enabled));
      this.button.setAttribute("aria-label", this.enabled ? "Turn mission sound off" : "Turn mission sound on");
      this.button.querySelector("b").textContent = this.enabled ? "Sound on" : "Sound off";
      if (!this.enabled) {
        this.stopHum();
        return;
      }
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.context ||= new AudioContext();
        await this.context.resume();
        this.master ||= this.context.createGain();
        this.master.gain.value = .035;
        this.master.connect(this.context.destination);
        this.tone(220, .65, .07);
      } catch {
        this.enabled = false;
        this.button.setAttribute("aria-pressed", "false");
        this.button.setAttribute("aria-label", "Turn mission sound on");
        this.button.querySelector("b").textContent = "Sound off";
      }
    }

    tone(frequency, duration = .4, level = .045) {
      if (!this.enabled || !this.context || !this.master) return;
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, this.context.currentTime);
      gain.gain.linearRampToValueAtTime(level, this.context.currentTime + .08);
      gain.gain.exponentialRampToValueAtTime(.0001, this.context.currentTime + duration);
      oscillator.connect(gain).connect(this.master);
      oscillator.start();
      oscillator.stop(this.context.currentTime + duration + .05);
    }

    startHum(frequency = 48) {
      if (!this.enabled || !this.context || !this.master || this.hum) return;
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.value = .018;
      oscillator.connect(gain).connect(this.master);
      oscillator.start();
      this.hum = { oscillator, gain };
    }

    setPhase(phase) {
      if (!this.enabled) return;
      if (["launch", "earth", "warp", "deep-space", "galaxy"].includes(phase)) this.startHum(phase === "warp" ? 58 : 46);
      if (phase === "wake") this.tone(260, .75, .08);
      if (phase === "earth") this.tone(116, 1.4, .035);
      if (phase === "warp") this.tone(72, 2.2, .055);
      if (phase === "galaxy") this.tone(174, 1.8, .025);
      if (phase === "return") this.tone(132, 1.2, .035);
      if (["cabin", "sleep"].includes(phase)) this.stopHum();
    }

    stopHum() {
      if (!this.hum) return;
      try {
        const now = this.context.currentTime;
        this.hum.gain.gain.exponentialRampToValueAtTime(.0001, now + .5);
        this.hum.oscillator.stop(now + .55);
      } catch {}
      this.hum = null;
    }
  }

  class SpaceRenderer {
    constructor(target, host) {
      this.canvas = target;
      this.host = host;
      this.context = target?.getContext?.("2d", { alpha: true });
      if (!this.context) throw new Error("Canvas 2D unavailable");
      this.width = 0;
      this.height = 0;
      this.dpr = 1;
      this.pointer = { x: 0, y: 0, active: false };
      this.tilt = { x: 0, y: 0 };
      this.stars = this.makeStars(260, 17);
      this.nearStars = this.makeStars(52, 71);
      this.galaxyDust = this.makeGalaxy(620, 113);
      this.resize = this.resize.bind(this);
      this.onPointer = this.onPointer.bind(this);
      this.onOrientation = this.onOrientation.bind(this);
      this.resize();
      window.addEventListener("resize", this.resize, { passive: true });
      host.addEventListener("pointermove", this.onPointer, { passive: true });
      host.addEventListener("pointerdown", this.onPointer, { passive: true });
      if (!reduceMotion) window.addEventListener("deviceorientation", this.onOrientation, { passive: true });
    }

    random(seed) {
      let value = seed >>> 0;
      return () => {
        value = (value * 1664525 + 1013904223) >>> 0;
        return value / 4294967296;
      };
    }

    makeStars(count, seed) {
      const random = this.random(seed);
      return Array.from({ length: count }, () => ({
        x: random(),
        y: random() * .82,
        z: .25 + random() * .75,
        size: .35 + random() * 1.7,
        twinkle: random() * Math.PI * 2
      }));
    }

    makeGalaxy(count, seed) {
      const random = this.random(seed);
      return Array.from({ length: count }, (_, index) => {
        const arm = index % 3;
        const radius = Math.pow(random(), .7);
        const angle = radius * 7.2 + arm * Math.PI * 2 / 3 + (random() - .5) * .48;
        return { radius, angle, depth: random(), size: .35 + random() * 1.45, warm: random() > .72 };
      });
    }

    resize() {
      const rect = this.host.getBoundingClientRect();
      this.width = Math.max(1, rect.width);
      this.height = Math.max(1, rect.height);
      this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    onPointer(event) {
      const rect = this.host.getBoundingClientRect();
      this.pointer.x = clamp((event.clientX - rect.left) / rect.width, 0, 1) * 2 - 1;
      this.pointer.y = clamp((event.clientY - rect.top) / rect.height, 0, 1) * 2 - 1;
      this.pointer.active = true;
      if (body.dataset.missionPhase === "galaxy" && body.dataset.interaction !== "noticed") {
        body.dataset.interaction = "noticed";
        title.textContent = "The universe noticed you";
        copy.textContent = "Nearby stars bend gently and one navigation marker wakes.";
      }
    }

    onOrientation(event) {
      if (typeof event.gamma !== "number" || typeof event.beta !== "number") return;
      this.tilt.x = clamp(event.gamma / 45, -.22, .22);
      this.tilt.y = clamp((event.beta - 45) / 60, -.16, .16);
    }

    emitter() {
      return this.width <= 680 ? { x: this.width * .64, y: this.height * .43 } : { x: this.width * .66, y: this.height * .43 };
    }

    clear() {
      this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.context.clearRect(0, 0, this.width, this.height);
    }

    drawSpaceBase(alpha, cool = 1) {
      const ctx = this.context;
      const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
      gradient.addColorStop(0, `rgba(2, 5, 17, ${.96 * alpha})`);
      gradient.addColorStop(.68, `rgba(${cool ? 4 : 10}, 8, 24, ${.88 * alpha})`);
      gradient.addColorStop(.82, `rgba(8, 10, 22, ${.46 * alpha})`);
      gradient.addColorStop(1, "rgba(8, 9, 15, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    drawStars(alpha, time, streak = 0, parallax = 0) {
      const ctx = this.context;
      const center = this.emitter();
      const px = reduceMotion ? 0 : (this.pointer.x * .8 + this.tilt.x) * parallax;
      const py = reduceMotion ? 0 : (this.pointer.y * .65 + this.tilt.y) * parallax;
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const star of this.stars) {
        const x = star.x * this.width + px * (1 - star.z) * 34;
        const y = star.y * this.height + py * (1 - star.z) * 24;
        const pulse = .72 + Math.sin(time * .00045 + star.twinkle) * .16;
        ctx.strokeStyle = `rgba(185, 220, 255, ${alpha * pulse * star.z})`;
        ctx.fillStyle = ctx.strokeStyle;
        ctx.lineWidth = Math.max(.45, star.size * star.z);
        if (streak > .02 && !reduceMotion) {
          const dx = x - center.x;
          const dy = y - center.y;
          const length = streak * (18 + star.z * 58);
          const mag = Math.max(1, Math.hypot(dx, dy));
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + dx / mag * length, y + dy / mag * length);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, star.size * star.z, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    drawHologram(alpha, scale = 1) {
      const ctx = this.context;
      const source = this.emitter();
      const radius = Math.min(this.width, this.height) * .04 * scale;
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const glow = ctx.createRadialGradient(source.x, source.y, 0, source.x, source.y, radius * 2.8);
      glow.addColorStop(0, `rgba(110, 226, 255, ${.72 * alpha})`);
      glow.addColorStop(.3, `rgba(64, 164, 255, ${.22 * alpha})`);
      glow.addColorStop(1, "rgba(30, 80, 255, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(source.x, source.y, radius * 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(146, 236, 255, ${.8 * alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(source.x, source.y, radius * 1.25, radius * .44, -.25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(source.x, source.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    drawRoute(alpha, extent = 1, returnProgress = 0) {
      const ctx = this.context;
      const source = this.emitter();
      const mobile = this.width <= 680;
      const end = { x: this.width * (mobile ? .36 : .22), y: this.height * .2 };
      const control = { x: this.width * .54, y: this.height * .15 };
      const interactionShift = body.dataset.interaction === "noticed" && !reduceMotion ? this.pointer.x * 22 : 0;
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.strokeStyle = `rgba(95, 213, 255, ${.7 * alpha})`;
      ctx.lineWidth = 1.35;
      ctx.setLineDash([4, 8]);
      ctx.lineDashOffset = -performance.now() * .015;
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      const targetX = source.x + (end.x + interactionShift - source.x) * extent * (1 - returnProgress);
      const targetY = source.y + (end.y - source.y) * extent * (1 - returnProgress);
      ctx.quadraticCurveTo(control.x, control.y, targetX, targetY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = `rgba(154, 238, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(targetX, targetY, 3.2 + (body.dataset.interaction === "noticed" ? 2 : 0), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    drawEarth(alpha, scale = 1, recede = 0) {
      const ctx = this.context;
      const mobile = this.width <= 680;
      const radius = (mobile ? this.height * .58 : this.height * .72) * scale * (1 - recede * .45);
      const x = (mobile ? -this.width * .36 : -this.width * .06) - recede * this.width * .18;
      const y = this.height * .5;
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const atmosphere = ctx.createRadialGradient(x + radius * .3, y - radius * .18, radius * .08, x, y, radius * 1.08);
      atmosphere.addColorStop(0, `rgba(95, 188, 255, ${.9 * alpha})`);
      atmosphere.addColorStop(.58, `rgba(12, 72, 150, ${.86 * alpha})`);
      atmosphere.addColorStop(.88, `rgba(4, 24, 74, ${.94 * alpha})`);
      atmosphere.addColorStop(.985, `rgba(82, 199, 255, ${.86 * alpha})`);
      atmosphere.addColorStop(1, "rgba(78, 184, 255, 0)");
      ctx.fillStyle = atmosphere;
      ctx.beginPath();
      ctx.arc(x, y, radius * 1.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgba(5, 16, 44, ${.5 * alpha})`;
      ctx.beginPath();
      ctx.arc(x - radius * .08, y + radius * .04, radius * .92, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    drawNebula(alpha, parallax = 0) {
      const ctx = this.context;
      const shiftX = reduceMotion ? 0 : (this.pointer.x + this.tilt.x) * parallax * 24;
      const shiftY = reduceMotion ? 0 : (this.pointer.y + this.tilt.y) * parallax * 12;
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const nebula = ctx.createRadialGradient(this.width * .77 + shiftX, this.height * .22 + shiftY, 0, this.width * .72 + shiftX, this.height * .24 + shiftY, this.width * .55);
      nebula.addColorStop(0, `rgba(100, 75, 210, ${.24 * alpha})`);
      nebula.addColorStop(.32, `rgba(44, 81, 175, ${.16 * alpha})`);
      nebula.addColorStop(.68, `rgba(114, 42, 116, ${.1 * alpha})`);
      nebula.addColorStop(1, "rgba(5, 5, 20, 0)");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, this.width, this.height * .82);
      ctx.restore();
    }

    drawGalaxy(alpha, time, scale = 1) {
      const ctx = this.context;
      const mobile = this.width <= 680;
      const parallaxX = reduceMotion ? 0 : (this.pointer.x * .7 + this.tilt.x) * 22;
      const parallaxY = reduceMotion ? 0 : (this.pointer.y * .45 + this.tilt.y) * 12;
      const centerX = this.width * (mobile ? .43 : .68) + parallaxX;
      const centerY = this.height * (mobile ? .19 : .23) + parallaxY;
      const radius = Math.max(this.width * (mobile ? .82 : .68), this.height * .62) * scale;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-.22 + Math.sin(time * .000025) * .008);
      ctx.scale(1, .38);
      ctx.globalCompositeOperation = "screen";
      const core = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * .48);
      core.addColorStop(0, `rgba(255, 240, 203, ${.78 * alpha})`);
      core.addColorStop(.08, `rgba(220, 209, 255, ${.5 * alpha})`);
      core.addColorStop(.42, `rgba(100, 105, 220, ${.18 * alpha})`);
      core.addColorStop(1, "rgba(30, 30, 90, 0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(0, 0, radius * .52, 0, Math.PI * 2);
      ctx.fill();
      for (const particle of this.galaxyDust) {
        const armWave = Math.sin(particle.angle * 2.2) * .11;
        const r = radius * particle.radius;
        const x = Math.cos(particle.angle) * r;
        const y = Math.sin(particle.angle) * r * (1 + armWave);
        ctx.fillStyle = particle.warm
          ? `rgba(255, 220, 174, ${alpha * (.3 + particle.depth * .6)})`
          : `rgba(164, 194, 255, ${alpha * (.2 + particle.depth * .66)})`;
        ctx.beginPath();
        ctx.arc(x, y, particle.size * (1 + particle.depth), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.save();
      ctx.fillStyle = `rgba(216, 231, 255, ${.72 * alpha})`;
      ctx.font = `${Math.max(10, this.width * .008)}px ${getComputedStyle(body).fontFamily}`;
      ctx.letterSpacing = "2px";
      ctx.fillText("MILKY WAY  ·  ~100,000 LIGHT-YEARS", this.width * (mobile ? .08 : .73), this.height * (mobile ? .12 : .16));
      ctx.restore();
    }

    drawInteraction(alpha) {
      const ctx = this.context;
      const pointerX = (this.pointer.x + 1) * .5 * this.width;
      const pointerY = (this.pointer.y + 1) * .5 * this.height;
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const star of this.nearStars) {
        let x = star.x * this.width;
        let y = star.y * this.height;
        if (this.pointer.active && !reduceMotion) {
          const dx = x - pointerX;
          const dy = y - pointerY;
          const distance = Math.max(1, Math.hypot(dx, dy));
          const influence = clamp(1 - distance / 150);
          x += dx / distance * influence * 18;
          y += dy / distance * influence * 18;
        }
        ctx.fillStyle = `rgba(188, 232, 255, ${alpha * star.z})`;
        ctx.beginPath();
        ctx.arc(x, y, star.size * 1.35, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    drawFloorReflection(alpha, time) {
      const ctx = this.context;
      const gradient = ctx.createLinearGradient(0, this.height * .72, 0, this.height);
      gradient.addColorStop(0, `rgba(68, 163, 255, ${.11 * alpha})`);
      gradient.addColorStop(1, "rgba(20, 45, 90, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, this.height * .72, this.width, this.height * .28);
      ctx.strokeStyle = `rgba(90, 190, 255, ${.16 * alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const drift = Math.sin(time * .0003) * this.width * .02;
      ctx.moveTo(this.width * .44 + drift, this.height);
      ctx.lineTo(this.width * .56, this.height * .74);
      ctx.stroke();
    }

    render(phase, phaseProgress, time, returnProgress = 0, returnOrigin = "galaxy") {
      this.clear();
      if (phase === "cabin" || phase === "sleep") return;
      const reducedTransition = reduceMotion ? smooth(phaseProgress) : phaseProgress;
      if (phase === "wake") {
        this.drawHologram(.95, .65 + reducedTransition * .35);
        this.drawRoute(.3 * reducedTransition, .18);
        return;
      }
      if (phase === "launch") {
        const level = .12 + reducedTransition * .78;
        this.drawSpaceBase(level);
        this.drawStars(level, time, 0, reducedTransition * .15);
        this.drawHologram(1, 1 + reducedTransition * .3);
        this.drawRoute(1, .2 + reducedTransition * .8);
        this.drawFloorReflection(reducedTransition * .4, time);
        return;
      }
      if (phase === "earth") {
        this.drawSpaceBase(.94);
        this.drawStars(.8, time, 0, .18);
        this.drawEarth(.96, .72 + reducedTransition * .28);
        this.drawRoute(.72, 1);
        this.drawFloorReflection(.7, time);
        return;
      }
      if (phase === "warp") {
        this.drawSpaceBase(1);
        this.drawNebula(.3 + reducedTransition * .25, .2);
        this.drawStars(1, time, reducedTransition, .2);
        this.drawRoute(.8, 1);
        this.drawFloorReflection(.45, time);
        return;
      }
      if (phase === "deep-space") {
        this.drawSpaceBase(1);
        this.drawNebula(.45 + reducedTransition * .35, .45);
        this.drawStars(.92, time, 0, .35);
        this.drawRoute(.66, 1);
        this.drawFloorReflection(.3, time);
        return;
      }
      if (phase === "galaxy") {
        this.drawSpaceBase(1);
        this.drawNebula(.85, .6);
        this.drawStars(.82, time, 0, .45);
        this.drawGalaxy(.95, time, .74 + reducedTransition * .26);
        this.drawInteraction(.72);
        this.drawRoute(.58, 1);
        this.drawFloorReflection(.32, time);
        return;
      }
      if (phase === "return") {
        const intensity = 1 - returnProgress;
        this.drawSpaceBase(intensity);
        const fromDeepSpace = ["galaxy", "deep-space", "warp"].includes(returnOrigin);
        if (fromDeepSpace) {
          this.drawNebula(intensity * (1 - smooth(returnProgress * 1.8)), .25);
          if (returnProgress < .34) {
            this.drawStars(intensity, time, reduceMotion ? 0 : returnProgress * .45, .1);
            this.drawGalaxy((1 - returnProgress / .34) * .9, time, 1 - returnProgress * .8);
          } else if (returnProgress < .72) {
            const earthReturn = progress(returnProgress, .34, .18) * (1 - progress(returnProgress, .58, .14));
            this.drawStars(intensity * .72, time, 0, 0);
            this.drawEarth(earthReturn, 1, progress(returnProgress, .58, .14));
          }
        } else if (returnOrigin === "earth") {
          this.drawStars(intensity * .72, time, 0, 0);
          this.drawEarth(intensity, 1, smooth(returnProgress));
        } else {
          this.drawStars(intensity * .38, time, 0, 0);
        }
        this.drawRoute(intensity, 1, smooth(returnProgress));
        this.drawHologram(intensity, 1 - returnProgress * .45);
        this.drawFloorReflection(intensity * .25, time);
      }
    }
  }

  class MissionEngine {
    constructor(renderer, audio) {
      this.renderer = renderer;
      this.audio = audio;
      this.mode = "cabin";
      this.phase = "cabin";
      this.startedAt = 0;
      this.returnStartedAt = 0;
      this.frame = 0;
      this.restartLocked = false;
      this.tick = this.tick.bind(this);
      this.setPhase("cabin");
    }

    updateControls(command) {
      controls.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.command === command));
        button.disabled = button.dataset.command === "explore" && (this.mode === "return" || this.restartLocked);
      });
    }

    setPhase(phase) {
      if (this.phase === phase && phase !== "cabin") return;
      this.phase = phase;
      body.dataset.missionPhase = phase;
      const [nextKicker, nextTitle, nextCopy] = STATE_COPY[phase];
      kicker.textContent = nextKicker;
      title.textContent = nextTitle;
      copy.textContent = nextCopy;
      roomAlt.textContent = ALT_COPY[phase];
      this.audio.setPhase(phase);
    }

    setEnvironment(level, cool = level) {
      const nextLevel = clamp(level);
      const nextCool = clamp(cool);
      body.style.setProperty("--mission-level", String(nextLevel));
      body.style.setProperty("--mission-cool", String(nextCool));
      body.style.setProperty("--room-brightness", String(1 - nextLevel * .58));
      body.style.setProperty("--room-saturate", String(1 - nextLevel * .18));
      body.style.setProperty("--anchor-brightness", String(1 - nextLevel * .52));
      body.style.setProperty("--anchor-saturate", String(1 - nextCool * .04));
      body.style.setProperty("--mission-hue", `${nextCool * 9}deg`);
    }

    wake() {
      cancelAnimationFrame(this.frame);
      this.mode = "cabin";
      this.restartLocked = false;
      delete body.dataset.interaction;
      body.dataset.roomState = "idle";
      this.setEnvironment(0, 0);
      this.setPhase("cabin");
      this.updateControls("wake");
      this.renderer.clear();
    }

    start() {
      if (this.mode === "return" || this.restartLocked) return;
      loadMissionAssets();
      cancelAnimationFrame(this.frame);
      this.mode = "mission";
      this.startedAt = performance.now();
      delete body.dataset.interaction;
      body.dataset.roomState = "mission";
      this.setPhase("wake");
      this.setEnvironment(.06, .16);
      this.updateControls("explore");
      this.frame = requestAnimationFrame(this.tick);
    }

    home() {
      if (this.mode === "return" || this.mode === "sleep") return;
      cancelAnimationFrame(this.frame);
      this.mode = "return";
      this.returnOrigin = this.phase;
      this.returnStartedAt = performance.now();
      body.dataset.roomState = "return";
      this.setPhase("return");
      if (this.returnOrigin === "earth") {
        copy.textContent = "Earth recedes as the route narrows into the pod emitter.";
        roomAlt.textContent = "Earth recedes without introducing another destination; the route contracts into the pod emitter as warm cabin light returns.";
      } else if (["wake", "launch"].includes(this.returnOrigin)) {
        copy.textContent = "The opening route folds directly back into the pod.";
        roomAlt.textContent = "The partial route contracts into the pod emitter before the cabin returns to low warm light.";
      }
      this.updateControls("home");
      this.frame = requestAnimationFrame(this.tick);
    }

    sleep() {
      cancelAnimationFrame(this.frame);
      this.mode = "sleep";
      this.restartLocked = true;
      body.dataset.roomState = "sleep";
      this.setEnvironment(0, 0);
      this.setPhase("sleep");
      this.updateControls("home");
      this.renderer.clear();
    }

    missionPhase(elapsed) {
      let cursor = 0;
      for (const phase of ["wake", "launch", "earth", "warp", "deep-space"]) {
        const duration = PHASE_TIMINGS[phase];
        if (elapsed < cursor + duration) return { phase, phaseProgress: progress(elapsed, cursor, duration) };
        cursor += duration;
      }
      return { phase: "galaxy", phaseProgress: progress(elapsed, cursor, reduceMotion ? 3500 : 1800) };
    }

    tick(now) {
      if (this.mode === "mission") {
        const elapsed = now - this.startedAt;
        const current = this.missionPhase(elapsed);
        this.setPhase(current.phase);
        const environment = current.phase === "wake" ? .06 + current.phaseProgress * .08
          : current.phase === "launch" ? .14 + current.phaseProgress * .78
            : .94;
        this.setEnvironment(environment, current.phase === "earth" ? .92 : environment);
        this.renderer.render(current.phase, current.phaseProgress, now);
        this.frame = requestAnimationFrame(this.tick);
        return;
      }
      if (this.mode === "return") {
        const returnProgress = clamp((now - this.returnStartedAt) / RETURN_DURATION);
        this.setEnvironment(1 - returnProgress, 1 - returnProgress);
        this.renderer.render("return", returnProgress, now, returnProgress, this.returnOrigin);
        if (returnProgress >= 1) this.sleep();
        else this.frame = requestAnimationFrame(this.tick);
      }
    }
  }

  class StaticFallbackEngine {
    constructor(audio) {
      this.audio = audio;
      this.mode = "cabin";
      this.timer = 0;
      this.restartLocked = false;
      body.classList.add("is-static-fallback");
      this.setPhase("cabin", "wake");
    }

    setPhase(phase, command) {
      this.mode = phase;
      body.dataset.missionPhase = phase;
      body.dataset.roomState = phase === "cabin" ? "idle" : phase === "galaxy" ? "mission" : phase;
      const [nextKicker, nextTitle, nextCopy] = STATE_COPY[phase];
      kicker.textContent = nextKicker;
      title.textContent = nextTitle;
      copy.textContent = nextCopy;
      roomAlt.textContent = ALT_COPY[phase];
      controls.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.command === command));
        button.disabled = button.dataset.command === "explore" && (phase === "return" || this.restartLocked);
      });
      this.audio.setPhase(phase);
    }

    wake() {
      clearTimeout(this.timer);
      this.restartLocked = false;
      this.setPhase("cabin", "wake");
    }

    start() {
      if (this.restartLocked || this.mode === "return") return;
      clearTimeout(this.timer);
      this.setPhase("galaxy", "explore");
    }

    home() {
      if (this.mode === "return" || this.mode === "sleep") return;
      this.setPhase("return", "home");
      this.timer = window.setTimeout(() => {
        this.restartLocked = true;
        this.setPhase("sleep", "home");
      }, reduceMotion ? 1600 : 4200);
    }
  }

  const audio = new MissionAudio(soundButton);
  let engine;
  try {
    engine = new MissionEngine(new SpaceRenderer(canvas, stage), audio);
  } catch {
    engine = new StaticFallbackEngine(audio);
  }

  controls.forEach((button) => {
    button.addEventListener("click", () => {
      const command = button.dataset.command;
      if (command === "wake") engine.wake();
      if (command === "explore") engine.start();
      if (command === "home") engine.home();
    });
  });

  window.MyNestSpaceMission = Object.freeze({
    version: "0.3",
    phases: MISSION_PHASES,
    renderStack: "Canvas 2D layered compositing",
    reducedMotion: reduceMotion,
    start: () => engine.start(),
    home: () => engine.home(),
    wake: () => engine.wake(),
    forceFallback: () => {
      if (engine instanceof MissionEngine) {
        engine.wake();
        engine = new StaticFallbackEngine(audio);
      }
    },
    get state() { return engine.mode; },
    get phase() { return engine.phase || engine.mode; }
  });
})();
