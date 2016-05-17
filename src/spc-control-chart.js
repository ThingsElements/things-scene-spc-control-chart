var { Component, Container, AbsoluteLayout, Model } = scene

const LABEL_WIDTH = 25
const LABEL_HEIGHT = 25

function rgba(r, g, b, a) {
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export default class SpcControlChart extends Container {

  constructor(model, context) {
    super(model, context)
    // Object.assign(this, options)
  }

  _drawAxes(context) {

    var { left, top, width, height, fillStyle } = this.model

    left = 30
    top = 30

    var right = left + width - 30
    var bottom = top + height - 30


    let series = this.get('series')
    let xAxis = this.get('xAxes')
    let data = this.get('data')

    this._drawXAxis(context)
    this._drawYAxis(context)
  }

  _drawXAxis(context) {

    var xAxes = this.get('xAxes')

    let series = this.get('series')
    let data = this.get('data')

    var { left, top, width, height, fillStyle } = this.model

    left = 30
    top = 30

    var right = left + width - 60;
    var bottom = top + height - 60;

    let xAxisLength = right - (left+20)

    if(!xAxes['points'])
      xAxes['points'] = {}

    xAxes['points']['origin'] = left + 20
    xAxes["axisLength"] = xAxisLength

    let pointSpacing = xAxisLength / (data.length + 1)

    context.beginPath()
    context.moveTo(left, bottom-20)

    context.lineTo(right, bottom-20)

    context.stroke()

    context.closePath()



    series.forEach(s => {
      data.forEach((d, i) => {
        let x = xAxes.points.origin + (pointSpacing * (i + 1))
        let y = bottom-20
        context.beginPath()
        context.moveTo(x, y-5)
        context.lineTo(x, y+5)
        context.stroke()
        context.closePath()

        xAxes['points'][d[s.labelField]] = x
      })
    })


    this.set('xAxes', xAxes)

  }

  _drawYAxis(context) {

    var yAxes = this.get('yAxes')
    let series = this.get('series')
    let data = this.get('data')

    var { left, top, width, height, fillStyle } = this.model

    left = 30
    top = 30

    var right = left + width - 60
    var bottom = top + height - 60

    let yAxisLength = top - (bottom-20)

    if(!yAxes['points'])
      yAxes['points'] = {}

    yAxes['points']['origin'] = bottom - 20
    yAxes["axisLength"] = yAxisLength

    let pointSpacing = yAxisLength / (data.length + 1)


    context.beginPath()

    context.moveTo(left+20, top)

    context.lineTo(left+20, bottom)

    context.stroke()

    context.closePath()

    var maxValue = yAxes.max || 0
    var minValue = yAxes.min || 0

    series.forEach(s => {
      data.forEach((d, i) => {
        if(d[s.valueField] > maxValue)
          maxValue = d[s.valueField]

        let x = left + 20
        let y = yAxes.points.origin + (pointSpacing * (i + 1))
        // context.beginPath()
        // context.moveTo(x-5, y)
        // context.lineTo(x+5, y)
        // context.stroke()
        // context.closePath()
        //
        // yAxes['points'][d[s.valueField]] = y
      })
    })

    yAxes.maxValue = maxValue

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

    console.log("orgin", originX, originY)

    series.forEach(s => {
      context.beginPath()
      context.moveTo(originX, originY)
      data.forEach(d => {
        let label = d[s.labelField]
        let value = d[s.valueField]

        let x = xAxes.points[label]
        let y = originY + (yAxes.axisLength / yAxes.maxValue) * value


        context.lineTo(x, y)

        console.log(x, y)
      })
      context.stroke()
      context.closePath()
    })

  }

  _draw(context) {

    super._draw(context)

    this._drawAxes(context)
    this._drawSeries(context)

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
