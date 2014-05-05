  var Slider = require('../slider.js')
    , assert = require('assert')
    , $ = require('jquery')

describe('Slider', function () {

  it('inits', function (done) {
    var slider1 = new Slider
    assert.equal(slider1.value, 0)
    assert.equal(slider1.min, 0)
    assert.equal(slider1.max, 100)
    assert.equal(slider1.step, 1)
    assert.equal(slider1.distance, 101)

    var slider2 = new Slider({step: 5, value: 45})
    assert.equal(slider2.value, 45)
    assert.equal(slider2.step, 5)

    slider2.handle.position = function (pos) {
      assert.equal(parseInt(pos * 100, 10), 45)
      done()
    }

    $('#container').append(slider2.render().el)
  })

  it('publishes slide events', function () {
    var slider = new Slider().render()
      , start = false
      , slide = false
      , stop = false

    slider.on('startSlide', function () {
      start = true
    })

    slider.on('slide', function () {
      slide = true
    })

    slider.on('stopSlide', function () {
      stop = true
    })

    slider.handle.$el.trigger($.Event('mousedown'))
    assert(start)

    $(document).trigger($.Event('mousemove', {pageX: 451}))
    assert(slide)

    $(document).trigger($.Event('mouseup'))
    assert(stop)
  })

  it('fires change event when value changes', function () {
    var slider = new Slider
      , calls = 0

    $('#container').append(slider.render().el)

    assert.equal(slider.value, 0)

    slider.on('change', function () {
      calls++
    })

    slider.handle.$el.parent().width = function () { return 1500 }

    slider.handle.$el.trigger($.Event('mousedown'))
    $(document).trigger($.Event('mousemove', {pageX: 451}))
    $(document).trigger($.Event('mouseup'))

    assert.equal(calls, 1)

    slider.handle.$el.trigger($.Event('mousedown'))
    $(document).trigger($.Event('mousemove', {pageX: 452}))
    $(document).trigger($.Event('mouseup'))

    assert.equal(calls, 1)
  })

  it('slides', function () {
    var slider = new Slider
    $('#container').append(slider.render().el)
    assert.equal(slider.value, 0)

    slider.$el.find('.slider-bar').width(1593)
    slider.handle.$el.parent().width = function () { return 1500 }

    slider.handle.$el.trigger($.Event('mousedown'))
    $(document).trigger($.Event('mousemove', {pageX: 410}))
    $(document).trigger($.Event('mouseup'))

    console.log(slider.value)
    assert.equal(slider.value, 26)
  })

  it('renders', function () {
    var slider = new Slider

    $('#container').append(slider.render().$el)

    assert.equal($('#container .slider').size(), 1)
    assert.equal($('#container .slider .slider-small').size(), 1)
    assert.equal($('#container .slider .slider-bar-wrapper').size(), 1)
    assert.equal($('#container .slider .slider-big').size(), 1)

    // And the handle
    assert.equal($('#container .slider .slider-bar-wrapper .slider-handle').size(), 1)

    assert.equal(parseInt($('#container .slider .slider-bar-wrapper .slider-handle').css('left')), 0)
  })

  afterEach(function () {
    $('#container').empty()
  })

})
