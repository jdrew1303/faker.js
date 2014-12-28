if (typeof module !== 'undefined') {
    var assert = require('assert');
    var faker = require('../index');
}

describe('credit_card.js', function() {
    describe('number', function() {

        /**
         * Variant of Avraham Plotnitzky's String.prototype method mixed with the "fast" version
         * see: https://sites.google.com/site/abapexamples/javascript/luhn-validation
         * @author ShirtlessKirk. Copyright (c) 2012.
         * Licensed under WTFPL (http://www.wtfpl.net/txt/copying)
         *
         * See http://en.wikipedia.org/wiki/Luhn_algorithm for more details.
         **/
        var ISO_IEC_7812_LUHN  = function (number) {
            var len = number.length,
                mul = 0,
                prodArr = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]],
                sum = 0;
            while (len--) {
                sum += prodArr[mul][parseInt(number.charAt(len), 10)];
                mul ^= 1;
            }
            return sum % 10 === 0 && sum > 0;
        };

        ['Visa', 'MasterCard', 'American Express', 'Discovery'].map(function(type){
            it('generates a valid ' + type + ' credit card number', function() {
                var number = faker.creditCard.number(type);
                var creditCardNumberIsValid = ISO_IEC_7812_LUHN(number);
                assert(creditCardNumberIsValid).is(true);
            })
        })
    })

});