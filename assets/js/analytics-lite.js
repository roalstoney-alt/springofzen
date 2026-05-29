(function () {
  const queue = [];

  function trackSozEvent(eventName, payload = {}) {
    const event = {
      eventName,
      payload,
      timestamp: new Date().toISOString(),
      path: window.location.pathname,
      search: window.location.search,
      referrer: document.referrer
    };

    queue.push(event);
    console.log("[SOZ_EVENT]", event);
    return event;
  }

  window.SozAnalytics = {
    queue,
    track: trackSozEvent
  };

  window.trackSozEvent = trackSozEvent;
})();
