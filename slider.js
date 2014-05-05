var $ = require('jquery')

function isUndefined(val) {
  return typeof val == 'undefined'
}

function pageX(e) {
  return e.type === 'touchmove' || e.type == 'touchstart' ? e.originalEvent.touches[0].pageX : e.pageX
}

var EventEmitter = function () {}

EventEmitter.prototype.init = function () {
  this.jq = $(this)
}

EventEmitter.prototype.emit = EventEmitter.prototype.trigger = function (evt, data) {
 !this.jq && this.init()
 this.jq.trigger(evt, data)
}

EventEmitter.prototype.once = function (evt, fn, context) {
  !this.jq && this.init()
  if (context) {
    this.jq.one(evt, fn.bind(context))
  } else {
    this.jq.one(evt, fn)
  }
}

EventEmitter.prototype.on = function (evt, fn, context) {
  !this.jq && this.init()
  if (context) {
    this.jq.on(evt, fn.bind(context))
  } else {
    this.jq.on(evt, fn)
  }
}

EventEmitter.prototype.off = function (evt, fn) {
 !this.jq && this.init()
 this.jq.unbind(evt, fn)
}

var Handle = function () {
  var self = this
  this.$el = $('<div>').addClass(this.className)
  this.$el.on('mousedown', this.mousedDown.bind(this))
  this.$el.on('touchstart', this.mousedDown.bind(this))
  this.$el.on('click', this.clickHandle.bind(this))
}

Handle.prototype.className = 'slider-handle'

Handle.prototype.mousedDown = function (e) {
  e.preventDefault()
  e.stopPropagation()

  $(document).on('mousemove touchmove', this.moved.bind(this))
  $(document).on('mouseup touchend', this.mousedUp.bind(this))

  this.trigger('start')
}

Handle.prototype.moved = function (e) {
  e.stopPropagation()
  var percentage = (pageX(e) - this.$el.parent().offset().left) / this.$el.parent().width()

  percentage = Math.max(0, percentage)
  percentage = Math.min(1, percentage)

  if (percentage >= 0 && percentage <= 1) {
    this.trigger('change', percentage)
  }
}

Handle.prototype.position = function (value) {
  this.$el.css('left', parseInt(value * 100, 10) + '%')
}

Handle.prototype.mousedUp = function (e) {
  $(document).off('mousemove touchmove gesturechange')
  $(document).off('mouseup touchend gestureend')
  this.trigger('end')
}

Handle.prototype.clickHandle = function (e) {
  e.preventDefault()
}

$.extend(Handle.prototype, new EventEmitter)

var Slider = function (options) {
  options = options || {}

  this.$el = $('<div>').addClass(this.className)
  this.min = isUndefined(options.min) ? 0 : options.min
  this.max = isUndefined(options.max) ? 100 : options.max
  this.value = isUndefined(options.value) ? this.min : options.value
  this.distance = this.max - this.min + 1
  this.step = isUndefined(options.step) ? 1 : options.step

  this.handle = new Handle
  this.handle.on('change', this.update, this)
  this.handle.on('start', this.start, this)
  this.handle.on('end', this.stop, this)

  if (this.min > this.max) {
    throw new Error('Unsupported range')
  }
}

Slider.prototype.className = 'slider'

Slider.prototype.template = '<div class="slider-small"></div>' +
                            '<div class="slider-bar-wrapper">' +
                            '  <div class="slider-bar"></div>' +
                            '</div>' +
                            '<div class="slider-big"></div>'

Slider.prototype.render = function () {
  this.$el.html(this.template)
  this.$el.find('.slider-bar').append(this.handle.$el)
  this.update(null, (this.value - this.min) * (1 / (this.max - this.min)))
  return this
}

Slider.prototype.start = function () {
  this.trigger('startSlide')
}

Slider.prototype.stop = function () {
  this.trigger('stopSlide')
}

Slider.prototype.update = function (e, percentage) {
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

$.extend(Slider.prototype, new EventEmitter)

module.exports = Slider
