var Backbone = require('backbone')
  , _ = require('lodash')

function pageX(e) {
  return e.type === 'touchmove' || e.type == 'touchstart' ? e.originalEvent.touches[0].pageX : e.pageX
}

var Handle = Backbone.View.extend({

  className: 'slider-handle',

  events: {
    'mousedown': 'start',
    'touchstart': 'start',
    'click': 'click'
  },

  initialize: function () {
    _.bindAll(this, 'move', 'end')
  },

  start: function (e) {
    e.preventDefault()
    e.stopPropagation()

    $(document).on('mousemove touchmove', this.move)
    $(document).on('mouseup touchend', this.end)

    this.trigger('start')
  },

  move: function (e) {
    e.stopPropagation()
    var percentage = (pageX(e) - this.$el.parent().offset().left) / this.$el.parent().width()

    percentage = Math.max(0, percentage)
    percentage = Math.min(1, percentage)
    if (percentage >= 0 && percentage <= 1) {
      this.trigger('change', percentage)
    }
  },

  position: function (value) {
    this.$el.css('left', parseInt(value * 100, 10) + '%')
  },

  end: function (e) {
    e.preventDefault()
    $(document).off('mousemove touchmove gesturechange', this.move)
    $(document).off('mouseup touchend gestureend', this.end)
    this.trigger('end')
  },

  click: function (e) {
    e.preventDefault()
  }

})

var Slider = Backbone.View.extend({

  className: 'slider',

  template: '<div class="slider-small"></div>' +
            '<div class="slider-bar-wrapper">' +
            '  <div class="slider-bar"></div>' +
            '</div>' +
            '<div class="slider-big"></div>',

  initialize: function () {
    this.min = _.isUndefined(this.options.min) ? 0 : this.options.min
    this.max = _.isUndefined(this.options.max) ? 100 : this.options.max
    this.value = _.isUndefined(this.options.value) ? this.min : this.options.value
    this.distance = this.max - this.min + 1
    this.step = _.isUndefined(this.options.step) ? 1 : this.options.step
    this.handle = new Handle
    this.handle.on('change', this.change, this)
    this.handle.on('start', this.startSlide, this)
    this.handle.on('end', this.stopSlide, this)

    if (this.min > this.max) {
      throw new Error('Unsupported range')
    }
  },

  render: function () {
    this.$el.html(this.template)
    this.$('.slider-bar').append(this.handle.el)
    this.change((this.value - this.min) * (1 / (this.max - this.min)))
    return this
  },

  startSlide: function () {
    this.trigger('startSlide')
  },

  stopSlide: function () {
    this.trigger('stopSlide')
  },

  change: function (percentage) {
    var prev = this.value
    this.value = percentage / (1 / (this.max - this.min)) + this.min

    if (this.step) {
      this.value = Math.round(this.value / this.step) * this.step
    }

    this.handle.position((this.value - this.min) * (1 / (this.max - this.min)))

    if (prev !== this.value) {
      this.trigger('change', this.value)
    }

    this.trigger('slide')
  }

})

module.exports = Slider
