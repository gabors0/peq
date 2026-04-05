// https://github.com/jherrm/knobs - demo/asset/ui.js
const activeKnobs = {};

function getPlatform() {
  if (typeof navigator.userAgentData !== 'undefined' && navigator.userAgentData != null) {
    return navigator.userAgentData.platform;
  }
  if (typeof navigator.platform !== 'undefined') {
    if (typeof navigator.userAgent !== 'undefined' && /android/.test(navigator.userAgent.toLowerCase())) {
      return 'android';
    }
    return navigator.platform;
  }
  return 'unknown';
}

export function setupKnob(knob, container) {
  knob.setPosition(container.offsetLeft, container.offsetTop);
  knob.setDimensions(container.clientWidth, container.clientHeight);

  if ('ontouchstart' in window) {
    container.addEventListener('touchstart', function(e) {
      knob.setPosition(container.offsetLeft, container.offsetTop);
      const timeStamp = e.timeStamp.getTime ? e.timeStamp.getTime() : e.timeStamp;
      activeKnobs[e.targetTouches[0].identifier] = knob;
      knob.doTouchStart(e.targetTouches, timeStamp);
      e.preventDefault();
    }, false);

    document.addEventListener('touchmove', function(e) {
      const timeStamp = e.timeStamp.getTime ? e.timeStamp.getTime() : e.timeStamp;
      for (let i = 0, l = e.changedTouches.length; i < l; i++) {
        const k = activeKnobs[e.changedTouches[i].identifier];
        if (typeof k !== "undefined") {
          k.doTouchMove([e.changedTouches[i]], timeStamp, e.scale);
        }
      }
    }, false);

    document.addEventListener('touchend', function(e) {
      const timeStamp = e.timeStamp.getTime ? e.timeStamp.getTime() : e.timeStamp;
      knob.doTouchEnd(timeStamp);
    }, false);

    document.addEventListener('touchcancel', function(e) {
      const timeStamp = e.timeStamp.getTime ? e.timeStamp.getTime() : e.timeStamp;
      knob.doTouchEnd(timeStamp);
    }, false);

  } else {
    let mousedown = false;
    const naturalScrolling = !/win|linux/.test(getPlatform().toLowerCase());

    container.addEventListener('mousedown', function(e) {
      knob.setPosition(container.offsetLeft, container.offsetTop);
      knob.doTouchStart([{
        pageX: e.pageX,
        pageY: e.pageY
      }], e.timeStamp);
      mousedown = true;
    }, false);

    document.addEventListener('mousemove', function(e) {
      if (!mousedown) { return; }
      knob.doTouchMove([{
        pageX: e.pageX,
        pageY: e.pageY
      }], e.timeStamp);
      mousedown = true;
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;
    }, false);

    document.addEventListener('mouseup', function(e) {
      if (!mousedown) { return; }
      knob.doTouchEnd(e.timeStamp);
      mousedown = false;
    }, false);

    container.addEventListener('mousewheel', function(e) {
      knob.setPosition(container.offsetLeft, container.offsetTop);
      const delta = naturalScrolling ? e.wheelDelta : -e.wheelDelta;
      knob.doMouseScroll(delta, e.timeStamp, e.pageX, e.pageY);
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;
    }, false);

    container.addEventListener('DOMMouseScroll', function(e) {
      knob.setPosition(container.offsetLeft, container.offsetTop);
      let delta = -4 * e.detail;
      delta = naturalScrolling ? -delta : -delta;
      knob.doMouseScroll(delta, e.timeStamp, e.pageX, e.pageY);
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;
    }, false);
  }
}
