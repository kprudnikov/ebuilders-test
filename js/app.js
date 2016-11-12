(function () {
  'use strict';

  var carouselContainer = document.getElementById('carousel');
  var carousel = new Carousel(carouselContainer, {
    containerClass: 'slides-container',
    wrapperClass: 'slides-wrapper',
    paginationClass: 'pagination-container',
  });

})();