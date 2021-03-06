(function(){

const canvas = document.querySelector("#whiteboard");
const context = canvas.getContext("2d");


var $force = document.querySelectorAll('#force')[0]
var $touches = document.querySelectorAll('#touches')[0]
var lineWidth = 0
var isMousedown = false
var points = []

;['touchstart', 'mousedown'].forEach(function (ev) {
  canvas.addEventListener(ev, function (e) {
    var pressure = 0.1
    var x, y
    if (e.touches && e.touches[0] && typeof e.touches[0]["force"] !== "undefined") {
      if (e.touches[0]["force"] > 0) {
        pressure = e.touches[0]["force"]
      }
      x = e.touches[0].pageX
      y = e.touches[0].pageY
    } else {
      pressure = 1.0
      x = e.pageX
      y = e.pageY
    }

    isMousedown = true

    // lineWidth = (pressure * 50 * 0.8 + lineWidth * 0.2)
    context.lineWidth = lineWidth// pressure * 50;
    context.strokeStyle = 'black'
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.beginPath()
    context.moveTo(x, y)

    points.push({
      x, y, lineWidth
    })
  })
})

;['touchmove', 'mousemove'].forEach(function (ev) {
  canvas.addEventListener(ev, function (e) {
    if (!isMousedown) return

    var pressure = 0.1
    var x, y
    if (e.touches && e.touches[0] && typeof e.touches[0]["force"] !== "undefined") {
      if (e.touches[0]["force"] > 0) {
        pressure = e.touches[0]["force"]
      }
      x = e.touches[0].pageX
      y = e.touches[0].pageY
    } else {
      pressure = 1.0
      x = e.pageX
      y = e.pageY
    }

    lineWidth = (Math.log(pressure + 1) * 40 * 0.4 + lineWidth * 0.6)
    points.push({
      x, y, lineWidth
    })

    context.strokeStyle = 'black'
    context.lineCap = 'round'
    context.lineJoin = 'round'

    if (points.length >= 3) {
      var l = points.length - 1
      var xc = (points[l].x + points[l - 1].x) / 2
      var yc = (points[l].y + points[l - 1].y) / 2
      context.lineWidth = points[l - 1].lineWidth
      context.quadraticCurveTo(points[l - 1].x, points[l - 1].y, xc, yc)
      context.stroke()
      context.beginPath()
      context.moveTo(xc, yc)
    }

    e.preventDefault()
  })
})

;['touchend', 'touchleave', 'mouseup'].forEach(function (ev) {
  canvas.addEventListener(ev, function (e) {
    var pressure = 0.1
    var x, y

    if (e.touches && e.touches[0] && typeof e.touches[0]["force"] !== "undefined") {
      if (e.touches[0]["force"] > 0) {
        pressure = e.touches[0]["force"]
      }
      x = e.touches[0].pageX
      y = e.touches[0].pageY
    } else {
      pressure = 1.0
      x = e.pageX
      y = e.pageY
    }

    isMousedown = false

    context.strokeStyle = 'black'
    context.lineCap = 'round'
    context.lineJoin = 'round'

    if (points.length >= 3) {
      var l = points.length - 1
      context.quadraticCurveTo(points[l].x, points[l].y, x, y)
      context.stroke()
    }

    points = []
    lineWidth = 0
  })
})

})();
