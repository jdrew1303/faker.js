if (typeof module !== 'undefined') {
    var assert  = require('assert');
    var _       = require('lodash');
    var faker   = require('../index');
}

var CARDS = _.keys(faker.creditcard);

describe("creditCard.js", function () {

  _.times(1, function(){ // we can use this to run thousands of tests to make sure we cover edge cases.

  // we use metaprogramming to generate the tests for each card type. This allows
  // us to have tests generated for a new card type just by addinging it to the
  // CARD_SCHEMAS.
  _.forEach(CARDS, function(CARD){
    describe("We are using a "+ CARD +" credit card", function () {
      var creditCardNumber;

      beforeEach(function(){
        creditCardNumber = faker.creditcard[CARD].number();
      });

      it("conforms to the basic "+ CARD +" regex.", function () {
        var REGEX = faker.creditcard[CARD].regex();
        var cardAdhearsToRegex = REGEX.test(creditCardNumber);
        assert.ok(cardAdhearsToRegex);
      });

      it("passes the Luhn algorithm check.", function () {
        var hasCorrectCheckDigit = luhnAlgorithmCheck(creditCardNumber);
        assert.ok(hasCorrectCheckDigit);
      });

      // This is not a very robust measure of correctness but when taken with the rest of the tests gives us a 'good enough' approximation of correctness.
      it("is the correct length for the card type.", function () {
        var CARD_DIGIT_COUNT = faker.creditcard[CARD].length();
        var LENGTH_CHECKS = _.map(CARD_DIGIT_COUNT, function (DIGIT_COUNT) {
          return (creditCardNumber.length == DIGIT_COUNT);
        });
        var hasCorrectLength = _.contains(LENGTH_CHECKS, true);
        assert.ok(hasCorrectLength);
      });
    });
  });
});
});

// The Luhn algorithm is used to calculate the check digit for a credit
// card. This allows us to see if the credit card is in fact a 'genuine'
// number.
function luhnAlgorithmCheck(number){
    var digit = parseInt(number.charAt(number.length -1));
    number = number.substring(0, number.length - 1);
    var luhnLookup    = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
    var runningTotal  = 0;
    var index         = number.length;
    var isOdd         = false;
    // start at the end of the chain. You could also reverse the String.
    while(index--) {
        // we toggle is odd
        isOdd = !isOdd;
        // this it the current number we're looking at from the card number.
        var currentValue = parseInt(number.charAt(index));
        // if its odd we double the value. If the value of the doubling
        // is above 9 we sum the two numbers together. We use the lookup
        // instead of performing the operation to simplify the code and
        // to speed it up. There is only a small finite set of answers
        // so we take advantage of that.
        var current = isOdd ? luhnLookup[currentValue]
                            : currentValue;
        // We add it to the current total or 0 as a default value.
        runningTotal += current;
    }
    // the Luhn algorithm is a modulous 10 algorithm. This means that for
    // it to be correct the remainder should equal 0 when divided by 10.
    return (((runningTotal + digit) % 10) == 0);
}
