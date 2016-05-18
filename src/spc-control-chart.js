var { Component, Container, AbsoluteLayout, Model } = scene

const LABEL_WIDTH = 25
const LABEL_HEIGHT = 25

function rgba(r, g, b, a) {
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export default class SpcControlChart extends Container {

  constructor(model, context) {

    super(model, context)

  }

  _calcPointXCoord(label) {

    let xAxes = this.get('xAxes')

    return xAxes.points[label]

  }

  _calcPointYCoord(value) {

    let yAxes = this.get('yAxes')

    let originY = yAxes.points.origin

    return originY - (yAxes.axisLength / yAxes.maxValue) * value
  }

  _drawPointsToXAxis(context) {

    var xAxes = this.get('xAxes')
    var yAxes = this.get('yAxes')

    let series = this.get('series')
    let data = this.get('data')

    let xAxisLength = xAxes.axisLength
    let pointSpacing = xAxisLength / (data.length + 1)

    series.forEach(s => {

      data.forEach((d, i) => {

        let x = xAxes.points.origin + (pointSpacing * (i + 1))
        let y = yAxes.points.origin
        context.beginPath()
        context.moveTo(x, y-5)
        context.lineTo(x, y+5)
        context.stroke()
        context.closePath()

        context.font = '9px'

        let textMeasured = context.measureText(d[s.labelField])
        let textWidth = textMeasured.width/2
        let textHeight = 14

        context.fillText(d[s.labelField], x-(textWidth), y + textHeight)

        xAxes['points'][d[s.labelField]] = x

      })

    })

    this.set('xAxes', xAxes)
  }

  _drawPointsToYAxis(context) {

    var xAxes = this.get('xAxes')
    var yAxes = this.get('yAxes')

    let series = this.get('series')
    let data = this.get('data')

    let yAxisLength = yAxes.axisLength

    var maxValue = yAxes.max || 0
    var minValue = yAxes.min || 0

    series.forEach(s => {

      data.forEach((d, i) => {

        if(d[s.valueField] > maxValue)
          maxValue = d[s.valueField]

      })

    })

    yAxes.maxValue = maxValue
    this.set('yAxes', yAxes)

    let pointSpacing = yAxisLength / (maxValue - minValue)
    let valueStep = Math.ceil((maxValue - minValue) / 10)
    var currPoint = yAxes.points.origin

    for (var i = 1; i < 11; i ++) {

      var pointVal = valueStep * i

      let x = xAxes.points.origin
      let y = this._calcPointYCoord(pointVal)

      context.beginPath()
      context.moveTo(x-5, y)
      context.lineTo(x+5, y)
      context.stroke()
      context.font = '9px'

      let textMeasured = context.measureText(pointVal)
      let textWidth = textMeasured.width + 10
      let textHeight = 4.5

      context.fillText(pointVal, x-(textWidth), y + textHeight)
      context.closePath()

      yAxes['points'][pointVal] = y

    }

    this.set('yAxes', yAxes)
  }

  _drawAxes(context) {

    this._drawXAxis(context)
    this._drawYAxis(context)
    this._drawPointsToXAxis(context)
    this._drawPointsToYAxis(context)

  }

  _drawXAxis(context) {

    var xAxes = this.get('xAxes')

    let series = this.get('series')
    let data = this.get('data')

    var { left, top, width, height } = this.model

    left = 30
    top = 30

    var right = left + width - 60;
    var bottom = top + height - 60;

    let xAxisLength = right - (left+20)

    if(!xAxes['points'])
      xAxes['points'] = {}

    xAxes['points']['origin'] = left + 20
    xAxes["axisLength"] = xAxisLength

    context.beginPath()

    context.moveTo(left, bottom-20)
    context.lineTo(right, bottom-20)

    context.stroke()

    context.closePath()

    this.set('xAxes', xAxes)

  }

  _drawYAxis(context) {

    var yAxes = this.get('yAxes')
    let series = this.get('series')
    let data = this.get('data')

    var { left, top, height } = this.model

    left = 30
    top = 30

    var bottom = top + height - 60

    let yAxisLength = (bottom-20) - top

    if(!yAxes['points'])
      yAxes['points'] = {}

    yAxes['points']['origin'] = bottom - 20
    yAxes["axisLength"] = yAxisLength


    context.beginPath()

    context.moveTo(left+20, top)
    context.lineTo(left+20, bottom)

    context.stroke()

    context.closePath()

    this.set('yAxes', yAxes)


  }

  _drawSeries(context) {

    let xAxes = this.get('xAxes')
    let yAxes = this.get('yAxes')
    let series = this.get('series')
    let data = this.get('data')

    let originX = xAxes['points']['origin']
    let originY = yAxes['points']['origin']
    let xLength = xAxes['axisLength']
    let yLength = yAxes['axisLength']

    series.forEach(s => {

      context.beginPath()

      context.lineCap = "round"
      context.lineJoin = "round"

      context.strokeStyle = rgba(100, 100, 100, 1)
      if(s.styles && s.styles.background)
        context.strokeStyle = s.styles.background

      context.lineWidth = 1
      if(s.styles && s.styles.background)
        context.lineWidth = s.styles.lineWidth

      let self = this

      context.moveTo(originX, originY)
      data.forEach(d => {

        let label = d[s.labelField]
        let value = d[s.valueField]

        let x = xAxes.points[label]
        let y = self._calcPointYCoord(value)

        context.lineTo(x, y)

      })
      context.stroke()
      context.closePath()

    })

  }

  _drawSpcLimits(context) {

    let spcLimit = this.get('spcLimit')

    if(!spcLimit)
      return

    let specLimit = spcLimit.specLimit

    if(!specLimit)
      return

    this._drawSpecLimit(context)

    let controlLimit = spcLimit.controlLimit

    if(!controlLimit)
      return

    this._drawControlLimit(context)
  }

  _drawSpcLines(context, fromX, toX, uVal, lVal) {

    context.beginPath()

    context.strokeStyle = rgba(100, 255, 100, 1)

    var y = this._calcPointYCoord(lVal)

    context.moveTo(fromX, y)
    context.lineTo(toX, y)

    context.stroke()

    y = this._calcPointYCoord(uVal)

    context.moveTo(fromX, y)
    context.lineTo(toX, y)

    context.stroke()

    context.closePath()

  }

  _drawSpecLimit(context) {

    let spcLimit = this.get('spcLimit')
    let specLimit = spcLimit.specLimit

    let upperLimit = specLimit.upper
    let lowerLimit = specLimit.lower

    if(!upperLimit || !lowerLimit)
      return

    let upperField = upperLimit.fieldName
    let lowerField = lowerLimit.fieldName

    if(!upperField || !lowerField)
      return

    let data = this.get('data')
    let xAxes = this.get('xAxes')
    let yAxes = this.get('yAxes')

    let originX = xAxes.points.origin
    let originY = yAxes.points.origin

    let self = this

    data.forEach(d => {
      let uVal = d[upperField]
      let lVal = d[lowerField]

      let fromX = originX - 10
      let toX = originX+xAxes.axisLength


      self._drawSpcLines(context, fromX, toX, uVal, lVal)

    })

  }

  _drawControlLimit(context) {

    let spcLimit = this.get('spcLimit')
    let controlLimit = spcLimit.controlLimit

    let self = this

    let data = this.get('data')
    let xAxes = this.get('xAxes')
    let yAxes = this.get('yAxes')
    let series = this.get('series')

    var xLabelWidth = 0

    data.forEach((d, i) => {

      if (xLabelWidth === 0) {
        xLabelWidth = self._calcPointXCoord(Object.keys(xAxes.points)[1]) - xAxes.points.origin

      }

      var currX = self._calcPointXCoord(d[series[0].labelField])

      controlLimit.forEach(cLimit => {

        let upperLimit = cLimit.upper
        let lowerLimit = cLimit.lower

        if(!upperLimit || !lowerLimit)
          return

        let upperField = upperLimit.fieldName
        let lowerField = lowerLimit.fieldName

        if(!upperField || !lowerField)
          return


        let originX = xAxes.points.origin
        let originY = yAxes.points.origin

        let uVal = d[upperField]
        let lVal = d[lowerField]

        let fromX = currX - xLabelWidth / 2
        let toX = currX + xLabelWidth / 2

        self._drawSpcLines(context, fromX, toX, uVal, lVal)

      })

    })

  }

  _draw(context) {

    super._draw(context)

    this._drawAxes(context)
    this._drawSeries(context)
    this._drawSpcLimits(context)

  }

  contains(x, y) {

    if(super.contains(x, y))
      return true

    var { left, top, width } = this.bounds;

    var right = left + width;

    var h = LABEL_HEIGHT * (this.components.length + 1)

    return (x < Math.max(right + LABEL_WIDTH, right ) && x > Math.min(right + LABEL_WIDTH, right)
      && y < Math.max(top + h, top) && y > Math.min(top + h, top));
  }

  onmouseup(e) {
    var down_point = this.__down_point
    delete this.__down_point

    if(!down_point
      || down_point.x != e.offsetX
      || down_point.y != e.offsetY) {
      return
    }

    var point = this.transcoordC2S(e.offsetX, e.offsetY);

    var { left, top, width} = this.model

    var right = left + width;

    var x = point.x - right
    var y = point.y - top

    if(x < 0)
      return

    y /= LABEL_HEIGHT
    y = Math.floor(y)

    if(!this.layoutConfig)
      this.layoutConfig = {}

  }

  onmousedown(e) {
    this.__down_point = {
      x: e.offsetX,
      y: e.offsetY
    }
  }

}

Component.register('spc-control-chart', SpcControlChart)
