function CreditCard (faker) {
    require('randexp').sugar();
    var self = this;

    var CARD_SCHEMAS = {
        VISA : {
          PREFIX : [
            /^4539[0-9]{8}(?:[0-9]{3})?$/,
            /^4556[0-9]{8}(?:[0-9]{3})?$/,
            /^4916[0-9]{8}(?:[0-9]{3})?$/,
            /^4532[0-9]{8}(?:[0-9]{3})?$/,
            /^4929[0-9]{8}(?:[0-9]{3})?$/,
            /^40240071[0-9]{4}(?:[0-9]{3})?$/,
            /^4485[0-9]{8}(?:[0-9]{3})?$/,
            /^4716[0-9]{8}(?:[0-9]{3})?$/,
            /^4[0-9]{11}(?:[0-9]{3})?$/
          ],
          CVC : /^[0-9]{3}$/,
          REGEX : /^4[0-9]{12}(?:[0-9]{3})?$/
        },
        MASTERCARD : {
          PREFIX : [
            /^5[1-5][0-9]{13}$/
          ],
          DIGIT_COUNT : [16],
          CVC : /^[0-9]{3}$/,
          REGEX : /^5[1-5][0-9]{14}$/
        }
    };

    // This is the main generate method for credit card numbers.
    function generate (cardType) {
        var prefixList = CARD_SCHEMAS[cardType].PREFIX;
        var regex = faker.random.arrayElement(prefixList);
        var baseNumber = regex.gen();
        return baseNumber + calculateCheckDigit(baseNumber);
    }

    function generateCVC (cardType) {
        var cvc = CARD_SCHEMAS[cardType].CVC;
        return cvc.gen();
    }

    function calculateCheckDigit(number){
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
      // calculate check digit.
      return ( ( Math.floor(runningTotal/10) + 1 ) * 10 - runningTotal ) % 10;
    }

    // We generate the functions for each of the card types at runtime.
    Object.keys(CARD_SCHEMAS).map(function (card) {
        var metaCard = self[card] = {};

        metaCard.number = function () {
          return generate(card);
        };

        metaCard.cvc = function(){
          return generateCVC(card);
        };

        metaCard.regex = function() {
          return CARD_SCHEMAS[card].REGEX;
        };
    });

    return self;
};


module['exports'] = CreditCard;
