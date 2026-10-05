(() => {
  "use strict";

  const sharedStates = ["entry", "awaken", "discover", "interact", "story", "wind_down", "sleep", "return"];

  const worlds = {
    ocean: {
      world_id: "OCEAN_LUMISEA",
      name: "Lumisea",
      label: "Ocean world",
      lead: "Milo",
      support: ["Nini", "Pip", "Moon Ray"],
      availability: "HERO_L0",
      palette: ["#061a38", "#087f9c", "#54d3d0", "#b7f5e9"],
      entry_scene: "The room waits beneath a quiet midnight tide.",
      return_trigger: "Come back tomorrow to discover what Milo found beyond the reef.",
      bedtime_phrase: "The moon sea is quiet. Milo is nearby. The reef can rest now.",
      daily_events: ["Meet Milo", "Find the Hidden Shell", "Help Pip Cross the Reef", "Moon Jellyfish Night", "Whale Song"],
      states: {
        entry: ["The sea is sleeping", "Enter when you are ready. Nothing moves until the world is invited."],
        awaken: ["Lumisea wakes", "Water light crosses the room and Milo arrives slowly from the reef."],
        discover: ["A shell is hiding", "Look across the reef. One shell glows when the room becomes still."],
        interact: ["Guide Pip home", "Use the large left and right controls to guide Pip. Movement stays slow and predictable."],
        story: ["Milo and the moon current", "A short character-led story begins. The room keeps the same geography and familiar sounds."],
        wind_down: ["The tide is slowing", "Motion, brightness, and sound reduce together. Nini marks the path toward bed."],
        sleep: ["Moon Sea", "Near-static light and low ocean ambience remain. No play prompts continue through sleep."],
        return: ["Tomorrow beyond the reef", "Milo leaves one question for tomorrow: where did the silver shell come from?"]
      },
      share_moment: {
        name: "Milo crosses the room",
        duration_seconds: 10,
        prompt: "Milo crosses wall, ceiling, and bed area in one slow, recognizable movement."
      }
    },
    forest: {
      world_id: "FOREST_MOSSWOOD",
      name: "Mosswood",
      label: "Forest world",
      lead: "Momo",
      support: ["Kiko", "Oru", "Grand Tree"],
      availability: "SKELETON_L0",
      palette: ["#071d18", "#225b3d", "#87bf71", "#e8d681"],
      entry_scene: "The Grand Tree is quiet and the leaves wait for footsteps.",
      return_trigger: "Come back tomorrow to find three new fireflies with Momo.",
      bedtime_phrase: "The forest becomes quieter as the room becomes quieter.",
      daily_events: ["Meet Momo", "Find Three Fireflies", "Wake the Grand Tree", "Rainy Forest", "Oru's Moon Night"],
      states: {
        entry: ["Mosswood is listening", "The forest remains calm until the child chooses to enter."],
        awaken: ["Leaves begin to move", "Momo appears beside the Grand Tree and Kiko lights one safe path."],
        discover: ["Find three fireflies", "Three slow lights appear in different parts of the room."],
        interact: ["Help the forest grow", "Each large control wakes one plant; no rapid flashing or surprise motion."],
        story: ["Momo's moon-leaf story", "Momo follows a leaf home while Oru watches from the canopy."],
        wind_down: ["Oru arrives", "The fireflies dim and the forest responds to quiet with less movement."],
        sleep: ["Grand Tree at rest", "Oru closes their eyes. Only a faint canopy glow remains."],
        return: ["A light for tomorrow", "One firefly stays near the Grand Tree as tomorrow's return cue."]
      },
      share_moment: { name: "Firefly gathering", duration_seconds: 10, prompt: "Hundreds of slow fireflies gather around the Grand Tree." }
    },
    space: {
      world_id: "SPACE_NOVANEST",
      name: "NovaNest",
      label: "Space world",
      lead: "Orbit",
      support: ["Nova", "Comet", "Luna"],
      availability: "SKELETON_L0",
      palette: ["#080b2a", "#323985", "#a07cf0", "#f2d58f"],
      entry_scene: "The room waits in orbit above a quiet blue planet.",
      return_trigger: "Come back tomorrow to see where Orbit's map leads next.",
      bedtime_phrase: "Mission complete. Time to rest.",
      daily_events: ["Meet Orbit", "Catch a Comet", "Visit Mars", "Repair Orbit", "Moon Mission"],
      states: {
        entry: ["NovaNest is in standby", "Stars remain still until the mission begins."],
        awaken: ["Orbit comes online", "A slow horizon appears and Orbit welcomes the room crew."],
        discover: ["A planet is waiting", "Point together toward one large planet and give it a mission name."],
        interact: ["Guide the comet", "Use the large controls to move one comet across the room."],
        story: ["Orbit's missing star map", "Nova and Orbit follow a familiar route through three quiet constellations."],
        wind_down: ["Return to moon base", "The mission ends, movement slows, and Luna guides the room home."],
        sleep: ["Moon-base night", "The galaxy becomes nearly still with a low, steady horizon glow."],
        return: ["Next mission queued", "Orbit saves one unopened destination for tomorrow."]
      },
      share_moment: { name: "Ceiling galaxy launch", duration_seconds: 10, prompt: "A slow rocket trail crosses the wall and opens a ceiling galaxy." }
    }
  };

  for (const world of Object.values(worlds)) {
    world.state_order = sharedStates;
    Object.freeze(world.states);
    Object.freeze(world.daily_events);
    Object.freeze(world);
  }

  window.MYNEST_WORLDS = Object.freeze(worlds);
})();
