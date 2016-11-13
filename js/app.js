(function () {
  'use strict';

  var carouselContainer = document.getElementById('carousel');
  var carousel = new Carousel(carouselContainer, {
    containerClass: 'slides-container',
    wrapperClass: 'slides-wrapper',
    paginationClass: 'pagination-container',
  });

  // validation
  var commentForm = document.getElementById('comment-form');
  var usernameField = document.getElementById('username');
  var emailField = document.getElementById('email');
  var commentField = document.getElementById('comment');
  var fieldsArray = [usernameField, emailField, commentField];
  // TODO should we maybe wrap it in some kind of config object?
  var requiredMessage = 'This field is required';
  var emailMessage = 'Please enter valid email';
  var inputParentClassName = 'input-wrapper';
  var invalidClassName = 'invalid';

  addEvent(commentForm, 'submit', function (event) {
    var isFormValid = true;
    var data = [];

    data.push({
      node: usernameField,
      value: usernameField.value,
      rules: [{
        key: 'required',
        message: requiredMessage
      }]
    });

    data.push({
      node: emailField,
      value: emailField.value,
      rules: [{
          key: 'required', message: requiredMessage
        },{
          key: 'email', message: emailMessage
        }]
    });

    data.push({
      node: commentField,
      value: commentField.value,
      rules: [{
        key: 'required',
        message: requiredMessage
      }]
    })

    data.forEach(function (field) {
      var validationResult = validate(field);
      var parent = closestWithClass(field.node, inputParentClassName);
      if (!parent) {
        throw new Error ('Cannot find parent with specified class');
      }

      if (!validationResult.valid) {
        isFormValid = validationResult.valid;
        addClass(parent, invalidClassName);
      } else {
        removeClass(parent, invalidClassName);
      }
    });

    preventDefault(event);

    if (isFormValid) {
      alert('Form is valid, let\'s submit it!');
    }
  });

  fieldsArray.forEach(function (field) {
    addEvent(field, 'focus', function () {
      var parent;
      parent = closestWithClass(field, inputParentClassName);
      if (parent) {
        removeClass(parent, invalidClassName);
      }
    });

    addEvent(field, 'blur', function () {
      var parent = closestWithClass(field, inputParentClassName);
      if (!parent) return;

      if (field.value ) {
        addClass(parent, 'has-value');
      } else {
        removeClass(parent, 'has-value');
      }
    });

  });

})();