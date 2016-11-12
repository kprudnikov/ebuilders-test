var Carousel = (function () {
  'use strict';

  function Carousel (mainContainer, config) {
    var defaultConfig = {
      containerClass: 'carousel-container',
      wrapperClass: 'carousel-wrapper',
      slideClass: 'slide',
      backwards: false,
      speed: 2000,
      onStart: noop,
      onStop: noop,
      onSlideChange: noop,
      paginationHide: true,
      paginationClass: 'pagination',
      paginationBulletClass: 'pagination-bullet',
      activeBulletClass: 'active',
      contolerButtonClass: 'carousel-control',
      nextButtonClass: 'carousel-next',
      prevButtonClass: 'carousel-prev',
      supportsTransform: false
    };

    if (toString(config) !== 'object') {
      config = {};
    }

    if (toString(mainContainer).match(/html/i) || toString(mainContainer).match(/object/i)) {
      this.container = mainContainer;
    } else if (typeof mainContainer !== 'string') {
      this.container = document.querySelector(mainContainer);
    } else {
      throw new TypeError('Carousel container must be either a dom element or a selector string');
    }

    this.config = extend(config, defaultConfig);

    // elements
    this.bullets = [];
    this.paginationContainer = this.container.querySelector('.'+this.config.paginationClass);
    this.carouselContainer = this.container.querySelector('.'+this.config.containerClass);
    this.wrapper = this.container.querySelector('.'+this.config.wrapperClass);
    this.slides = toArray(this.container.querySelectorAll('.'+this.config.slideClass));
    this.nextButton = this.container.querySelector('.' + this.config.nextButtonClass);
    this.prevButton = this.container.querySelector('.' + this.config.prevButtonClass);

    // data
    this.timer = 0;
    this.slideWidth = getWidth(this.carouselContainer);

    //state
    this.currentSlideIndex = this.config.backwards ? this.slides.length - 1 : 0;
    this.isRunning = false;
    this.willStop = false;

    this.init();
    this.start();
    if (this.paginationContainer) {
      this.addPaginationBullets(this.slides, this.paginationContainer, this.config.paginationBulletClass, this.config.activeBulletClass); // array, container, class, activeClass
    }
  }

  Carousel.prototype.init = function() {
    var self = this;
    self.wrapper.style.width = (self.slideWidth*self.slides.length) + 'px';
    self.config.supportsTransform = hasTransform();

    if (self.config.backwards) {
      if (self.config.supportsTransform) {
        self.wrapper.style.transform = 'translateX(-' + self.slideWidth * self.currentSlideIndex + 'px)';
      } else {
        self.wrapper.style.position = 'absolute';
        self.wrapper.style.left = '-' + self.slideWidth * self.currentSlideIndex + 'px';
      }
    }

    addEvent(self.wrapper, 'mouseenter', function () {
      if (self.isRunning) {
        self.stop();
      }
    });

    addEvent(self.wrapper, 'mouseleave', function () {
      self.willStop = false;

      if (!self.isRunning) {
        self.start();
      }
    });

    addEvent(self.nextButton, 'click', function () {
      _stop(self);
      self.goNext();
      self.start();
    });

    addEvent(self.prevButton, 'click', function () {
      _stop(self);
      self.goBack();
      self.start();
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
    self.timer = setInterval(function () {
      if (self.isRunning && !self.willStop) {
        if (self.config.backwards) {
          self.goBack();
        } else {
          self.goNext();
        }
      } else {
        _stop(self);
        self.config.onStop();
      }
    }, self.config.speed)
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
      var activeIndex = self.config.backwards ? slidesArray.length - 1 : 0;

      bullet.className = index === activeIndex ? bulletClass + ' ' + activeClass : bulletClass;
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
    removeClass(this.bullets[previousIndex], 'active');
    addClass(this.bullets[nextIndex], 'active');

    this.config.onSlideChange(nextIndex, slides[nextIndex]);

    if (this.config.supportsTransform) {
      this.wrapper.style.transform = 'translateX(' + '-' + this.slideWidth * nextIndex + 'px)';
    } else {
      this.wrapper.style.position = 'absolute';
      this.wrapper.style.left = '-' + this.slideWidth * nextIndex + 'px';
    }
    this.currentSlideIndex = nextIndex;
  };

  Carousel.prototype.goNext = function() {
    var previousIndex = this.currentSlideIndex;
    var nextIndex;

    nextIndex = (previousIndex >= this.slides.length - 1) ? 0 : previousIndex + 1;
    this.goToSlide(this.slides, nextIndex, previousIndex);
  };

  Carousel.prototype.goBack = function() {
    var previousIndex = this.currentSlideIndex;
    var nextIndex;

    nextIndex = previousIndex <= 0 ? this.slides.length - 1 : previousIndex - 1;

    this.goToSlide(this.slides, nextIndex, previousIndex);
  };

  function noop () {};

  function _stop (carouselObject) {
    clearInterval(carouselObject.timer);
    carouselObject.isRunning = false;
    carouselObject.willStop = false;
  }

  return Carousel;

})();