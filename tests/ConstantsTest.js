var Constants = require('../shared/Constants');

describe('The Constants constructor', function() {
  it('should throw an error', function() {
    expect(function() {
      var constants = new Constants();
    }).toThrow();
  });
});
