  var Slider = require('../slider.js')
    , assert = require('assert')

describe('Slider', function () {

  it('renders', function () {
    var slider = new Slider

    $('#container').append(slider.render().el)

    assert.equal($('#container .slider').size(), 1)
    assert.equal($('#container .slider .slider-small').size(), 1)
    assert.equal($('#container .slider .slider-bar-wrapper').size(), 1)
    assert.equal($('#container .slider .slider-big').size(), 1)

    // And the handle
    assert.equal($('#container .slider .slider-bar-wrapper .slider-handle').size(), 1)
  })

})
