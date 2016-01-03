if (typeof module !== 'undefined') {
    var assert = require('assert');
    var _ = require('lodash');
    var faker = require('../index');
}

var credit_card = faker.creditcard;

var CARD_SCHEMAS  = faker.creditcard.CARDS_SCHEMAS

describe("creditCard.js", function () {
  it("has a schema", function () {
    var numberOfCards = _.size(_.keys(CARD_SCHEMAS));
    assert.ok(numberOfCards == 2);
  })
})
