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
      paginationHide: true,
      pagination: '.pagination',
      paginationBulletClass: 'pagination-bullet',
      activeBulletClass: 'active'
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
    this.paginationContainer = null;
    this.bullets = [];

    if (this.config.pagination) {
      if (toString(this.config.pagination) === 'string') {
        this.paginationContainer = this.container.querySelector(this.config.pagination);
      } else {
        this.paginationContainer = this.pagination;
      }
    }

    this.timer = 0;
    this.slideWidth = getWidth(this.container);
    this.wrapper = this.container.querySelector('.'+this.config.wrapperClass);
    this.slides = toArray(this.container.querySelectorAll('.'+this.config.slideClass));
    this.currentSlideIndex = 0;
    this.isRunning = false;
    this.willStop = false;

    this.init();
    this.start();
    if (this.config.pagination) {
      this.addPaginationBullets(this.slides, this.paginationContainer, this.config.paginationBulletClass, this.config.activeBulletClass); // array, container, class, activeClass
    }
  }

  Carousel.prototype.init = function() {
    var self = this;
    self.wrapper.style.width = (self.slideWidth*self.slides.length) + 'px';

    addEvent(self.container, 'mouseenter', function () {
      if (self.isRunning) {
        self.stop();
      }
    });

    addEvent(self.container, 'mouseleave', function () {
      self.willStop = false;

      if (!self.isRunning) {
        self.start();
      }
    });

    addEvent(self.paginationContainer, 'click', function (event) {
      var bullet = event.target || event.srcElement;
      if (!hasClass(bullet, self.config.paginationBulletClass)) { // not a bullet but parent container
        event.stopPropagation();
        return;
      }

      var index = parseInt(bullet.getAttribute('data-index'));

      if (isNaN(index)) {
        return;
      }

      self.goToSlide(self.slides, index, self.currentSlideIndex);
      self.currentSlideIndex = index;
      _stop(self);
      self.start();
    });
  };

  Carousel.prototype.start = function() {
    var self = this;
    self.isRunning = true;
    self.willStop = false;

    self.config.onStart();

    if (hasTransitions) {
      self.timer = setInterval(function () {
        if (self.isRunning && !self.willStop) {
          var previousIndex = self.currentSlideIndex;
          var nextIndex;
          if (previousIndex >= self.slides.length-1) {
            nextIndex = 0;
          } else {
            nextIndex = self.currentSlideIndex + 1;
          }

          self.goToSlide(self.slides, nextIndex, previousIndex);
          self.currentSlideIndex = nextIndex;
        } else {
          _stop(self);
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

  Carousel.prototype.addPaginationBullets = function(slidesArray, paginationContainer, bulletClass, activeClass) {
    var bullets = document.createDocumentFragment();
    var self = this;
    slidesArray.forEach(function (slide, index) {
      var bullet = document.createElement('button');
      var span = document.createElement('span');
      var bulletText = 'Go to slide ' + (index + 1);
      bullet.className = index === 0 ? bulletClass + ' ' + activeClass : bulletClass;
      bullet.setAttribute('title', bulletText);
      bullet.setAttribute('data-index', index);
      span.className = 'sr-only';
      span.textContent = bulletText;
      bullet.appendChild(span);
      bullets.appendChild(bullet);
      self.bullets.push(bullet);
    });


    paginationContainer.appendChild(bullets);
  };

  Carousel.prototype.goToSlide = function(slides, nextIndex, previousIndex) {
    var direction = this.config.backwards ? '' : '-';
    removeClass(this.bullets[previousIndex], 'active');
    addClass(this.bullets[nextIndex], 'active');

    this.config.onSlideChange(nextIndex, slides[nextIndex]);
    this.wrapper.style.transform = 'translateX(' + direction + this.slideWidth * nextIndex + 'px)';
  };

  function noop () {};

  function _stop (carouselObject) {
    clearInterval(carouselObject.timer);
    carouselObject.isRunning = false;
    carouselObject.willStop = false;
  }

  return Carousel;

})();