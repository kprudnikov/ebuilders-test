function addEvent (node, eventName, handler) {
  'use strict';
  if (node.addEventListener) {
    node.addEventListener(eventName, handler, false);
  } else if (node.attachEvent) {
    node.attachEvent('on' + eventName, function (event) {
      handler.call(node, event);
    });
  }
}

function toString (object) {
  'use strict';
  return Object.prototype.toString.call(object).slice(8, -1).toLowerCase();
}

function getWidth (node) {
  'use strict';
  return node.offsetWidth;
}

function toArray (list) {
  'use strict';
  var ar = [];
  for (var i=0; i<list.length; i++) {
    ar.push(list[i]);
  }

  return ar;
}

function hasTransform () {
  'use strict';
  var body = document.body || document.documentElement;
  var style = body.style;
  var prop = 'transform';
  var vendors = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];

  if (typeof style[prop] == 'string') { return true; }

  prop = prop.charAt(0).toUpperCase() + prop.substr(1);

  for (var i=0; i<vendors.length; i++) {
    if (typeof style[vendors[i] + prop] == 'string') { return true; }
  }

  return false;
}

function addTransition () {

}

function extend (to, from) {
  'use strict';
  for (var key in from) {
    if (from.hasOwnProperty(key) && !to[key]) {
      to[key] = from[key];
    }
  }

  return to;
}

function hasClass (element, className) {
  'use strict';
  var classesString = " " + element.className + " ";
  return classesString.indexOf(className) > -1;
}

function addClass (element, className) {
  'use strict';
  if (!hasClass(element, className)) {
    element.className = (element.className + ' ' + className).trim();
  }

  return element;
}

function removeClass (element, className) {
  'use strict';
  if (hasClass(element, className)) {
    element.className = element.className.replace(className, '').trim();
  }
}

function toggleClass (element, className) {
  'use strict';

}

function closestWithClass (element, className) {
  'use strict';

  var parent = element;
  while (parent && !hasClass(parent, className)) {
    parent = parent.parentNode;
  }

  return parent;
}