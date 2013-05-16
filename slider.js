var Backbone = require('backbone')
  , _ = require('lodash')

function pageX(e) {
  return e.type === 'touchmove' || e.type == 'touchstart' ? e.originalEvent.touches[0].pageX : e.pageX
}

function pageY(e) {
  return e.type === 'touchmove'|| e.type == 'touchstart' ? e.originalEvent.touches[0].pageY : e.pageY
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
  },

  move: function (e) {
    e.stopPropagation()
    var percentage = (pageX(e) - this.$el.parent().offset().left) / this.$el.parent().width()
    if (percentage > 0 && percentage < 1) {
      this.$el.css('left', parseInt(percentage * 100, 10) + '%')
      this.trigger('change', percentage)
    }
  },

  end: function (e) {
    e.preventDefault()
    $(document).off('mousemove touchmove gesturechange', this.move)
    $(document).off('mouseup touchend gestureend', this.end)
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

  render: function () {
    this.$el.html(this.template)
    var handle = new Handle()

    handle.on('change', function (percentage) {
      this.trigger('change', percentage)
    }, this)

    this.$('.slider-bar').append(handle.el)
    if (this.options.percentage) {
      handle.$el.css('left', (this.options.percentage * 100 + '%'))
    }
    return this
  }

})

module.exports = Slider
