var validate = (function () {
  'use strict';

 // {value: '[string|number]',
 //  node: '[HTMLnode]',
 //  rules: [{
 //    key: 'required',
 //    message: 'This field is required'
 //  },
 //  {
 //    key: 'email',
 //    message: 'Please enter valid email'
 //  },
 //  {
 //    key: minlength,
 //    value: 5,
 //    message: 'Should be at least 5 symbols'
 //  }
 // ]}

  return function validate (data) {
    var value = data.value;
    var result = {
      valid: true
    };

    data.rules.forEach(function (rule) {
      switch (rule.key) {
        case 'required':
          if (!value.length) {
            result.valid = false;
            result.message = rule.message;
          }
        break;
        case 'email':
          if (!isEmail(value)) {
            result.valid = false;
            result.message = rule.message;
          }
        break;
      }
    });

    return result;
  }

  function isEmail (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !!re.test(email);
  }
})();