function CreditCard (faker) {
    var self = this;

    // This is basic information on the different credit card types.
    var CARD_SCHEMAS = {
        VISA : {
          PREFIX : [
            "4539",
            "4556",
            "4916",
            "4532",
            "4929",
            "40240071",
            "4485",
            "4716",
            "4"
          ],
          DIGIT_COUNT : [13, 16],
          CVC_DIGIT_COUNT : 3,
          REGEX : /^4[0-9]{12}(?:[0-9]{3})?$/
        },

        MASTERCARD : {
          PREFIX : [
            "51",
            "52",
            "53",
            "54",
            "55"
          ],
          DIGIT_COUNT : [16],
          CVC_DIGIT_COUNT : 3,
          REGEX : /^5[1-5][0-9]{14}$/
        },

        AMEX : {
          PREFIX : [
            "34",
            "37"
          ],
          DIGIT_COUNT : [15],
          CVC_DIGIT_COUNT : 4,
          REGEX : /^3[47][0-9]{13}$/
        },

        DISCOVER : {
          PREFIX : [
            "6011"
          ],
          DIGIT_COUNT : [16],
          CVC_DIGIT_COUNT : 3,
          REGEX : /^6(5|011|4[4-9]|22)/
        },

        DINERS_CLUB : {
          PREFIX : [
            "300",
            "301",
            "302",
            "303",
            "36",
            "38"
          ],
          DIGIT_COUNT : [14, 16],
          CVC_DIGIT_COUNT : 3,
          REGEX : /^(3[6-9]|30([0-5]|9))/
        },

        EN_ROUTE : {
          PREFIX : [
            "2014",
            "2149"
          ],
          DIGIT_COUNT : [16],
          CVC_DIGIT_COUNT : 3,
          REGEX : /^2(014|149)[0-9]{12}$/
        },

        JCB : {
          PREFIX : [
            "35"
          ],
          DIGIT_COUNT : [15, 16],
          CVC_DIGIT_COUNT : 3,
          REGEX : /^35[0-9]{13}(?:[0-9])?$/   // /^35(2[89]|[3-8][0-9])/
        },

        VOYAGER : {
          PREFIX : [
            "8699"
          ],
          DIGIT_COUNT : [16],
          CVC_DIGIT_COUNT : 3,
          REGEX : /^8699[0-9]{12}$/
        },

        MAESTRO : {
          PREFIX : [
            "5018",
            "502",
            "503",
            "56",
            "58",
            "6304",
            "67"
          ],
          DIGIT_COUNT : [12, 19],
          CVC_DIGIT_COUNT : 3,
          REGEX : /^50(18|2|3)|5[68]|6(304|7)/
        }
    };

    // This is the main generate method for credit card numbers.
    function generate (cardType) {
        var schema = CARD_SCHEMAS[cardType] || CARD_SCHEMAS["MASTERCARD"];
        return creditCardNumberGenerator(schema);
    }

    function generateCVC (cardType) {
        var schema = CARD_SCHEMAS[cardType] || CARD_SCHEMAS["MASTERCARD"];
        return padNumbers("", schema.CVC_DIGIT_COUNT);
    }

    function creditCardNumberGenerator(schema) {
        var prefixList = schema.PREFIX;
        var length = schema.DIGIT_COUNT[0]; //TODO
        var randomPrefixIndex = Math.floor(Math.random() * prefixList.length);
        var prefix = prefixList[ randomPrefixIndex ];
        return padNumbers(prefix, length);
    }

    function padNumbers(prefix, length) {
        var ccnumber = prefix;
        while ( ccnumber.length < (length - 1) ) {
            ccnumber += Math.floor(Math.random()*10);
        }
        return ccnumber + calculateCheckDigit(ccnumber);
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
      // calculate check digit. TODO need to double check this part.
      // return 10 - (runningTotal % 10);
      return ( ( Math.floor(runningTotal/10) + 1 ) * 10 - runningTotal ) % 10;
    }



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
        }

        metaCard.length = function () {
          return CARD_SCHEMAS[card].DIGIT_COUNT;
        }
    });

    return self;
};


module['exports'] = CreditCard;
