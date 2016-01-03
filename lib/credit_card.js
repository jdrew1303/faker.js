function CreditCard (faker) {
    this.CARDS_SCHEMAS = {
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
          REGEX : /^5[1-5][0-9]{14}$/
        }
    };
}

module['exports'] = CreditCard;
