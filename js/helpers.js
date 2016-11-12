function addEvent (node, eventName, handler) {
  if (node.addEventListener) {
    node.addEventListener(eventName, handler, false);
  } else if (node.attachEvent) {
    node.attachEvent('on' + eventName, function (event) {
      handler.call(node, event);
    });
  }
}

function toString (object) {
  return Object.prototype.toString.call(object).slice(8, -1).toLowerCase();
}

function getWidth (node) {
  return node.offsetWidth;
}

function toArray (list) {
  return Array.prototype.slice.call(list);
}

function hasTransitions () {
  return true;
}

function extend (to, from) {
  for (key in from) {
    if (from.hasOwnProperty(key) && !to[key]) {
      to[key] = from[key];
    }
  }

  return to;
}