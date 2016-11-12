var Carousel = (function () {
  'use strict';

  function Carousel (container, config) {
    var defaultConfig = {
      wrapperClass: 'carousel-wrapper',
      slideClass: 'slide',
      backwards: false,
      speed: 2000,
      onStart: noop,
      onStop: noop,
      onSlideChange: noop,

    };

    if (toString(config) !== 'object') {
      config = {};
    }

    if (typeof container !== 'string') {
      this.container = container;
    } else {
      this.container = document.querySelector(container);
    }

    this.config = extend(config, defaultConfig);
    this.timer = 0;
    this.slideWidth = getWidth(this.container);
    this.wrapper = this.container.querySelector('.'+this.config.wrapperClass);
    this.slides = toArray(this.container.querySelectorAll('.'+this.config.slideClass));
    this.currentSlideIndex = 1;
    this.isRunning = false;
    this.willStop = false;

    this.init();
    this.start();
  }

  Carousel.prototype.init = function() {
    var self = this;
    self.wrapper.style.width = (self.slideWidth*self.slides.length) + 'px';

    addEvent(self.container, 'mouseenter', function () {
      if (self.isRunning) {
        console.log('STOP');
        self.stop();
      }
    });

    addEvent(self.container, 'mouseout', function () {
      self.willStop = false;

      if (!self.isRunning) {
        console.log('START');
        self.start();
      }
    });

  };

  Carousel.prototype.start = function() {
    var self = this;
    var direction = self.config.backwards ? '' : '-';
    self.isRunning = true;
    self.willStop = false;

    self.config.onStart();

    if (hasTransitions) {
      self.timer = setInterval(function () {
        if (self.isRunning && !self.willStop) {
          if (self.currentSlideIndex >= self.slides.length) {
            self.currentSlideIndex = 0;
          }
          self.config.onSlideChange(self.currentSlideIndex, self.slides[self.currentSlideIndex]);
          self.wrapper.style.transform = 'translateX(' + direction + self.slideWidth * self.currentSlideIndex++ + 'px)';
        } else {
          clearInterval(self.timer);
          self.isRunning = false;
          self.willStop = false;
          self.config.onStop();
        }
      }, self.config.speed)
    } else {
      console.log('no transitions no fun');
    }
  };

  Carousel.prototype.stop = function() {
    this.willStop = true;
  };

  function noop () {};

  return Carousel;

})();