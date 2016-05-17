(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _spcControlChart = require('./spc-control-chart');

Object.defineProperty(exports, 'SpcControlChart', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_spcControlChart).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./spc-control-chart":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _scene = scene;
var Component = _scene.Component;
var Container = _scene.Container;
var AbsoluteLayout = _scene.AbsoluteLayout;
var Model = _scene.Model;


var LABEL_WIDTH = 25;
var LABEL_HEIGHT = 25;

function rgba(r, g, b, a) {
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
}

var SpcControlChart = function (_Container) {
  _inherits(SpcControlChart, _Container);

  function SpcControlChart(model, context) {
    _classCallCheck(this, SpcControlChart);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(SpcControlChart).call(this, model, context));
    // Object.assign(this, options)
  }

  _createClass(SpcControlChart, [{
    key: '_drawAxes',
    value: function _drawAxes(context) {
      var _model = this.model;
      var left = _model.left;
      var top = _model.top;
      var width = _model.width;
      var height = _model.height;
      var fillStyle = _model.fillStyle;


      left = 30;
      top = 30;

      var right = left + width - 30;
      var bottom = top + height - 30;

      var series = this.get('series');
      var xAxis = this.get('xAxes');
      var data = this.get('data');

      this._drawXAxis(context);
      this._drawYAxis(context);
    }
  }, {
    key: '_drawXAxis',
    value: function _drawXAxis(context) {

      var xAxes = this.get('xAxes');

      var series = this.get('series');
      var data = this.get('data');

      var _model2 = this.model;
      var left = _model2.left;
      var top = _model2.top;
      var width = _model2.width;
      var height = _model2.height;
      var fillStyle = _model2.fillStyle;


      left = 30;
      top = 30;

      var right = left + width - 60;
      var bottom = top + height - 60;

      var xAxisLength = right - (left + 20);

      if (!xAxes['points']) xAxes['points'] = {};

      xAxes['points']['origin'] = left + 20;
      xAxes["axisLength"] = xAxisLength;

      var pointSpacing = xAxisLength / (data.length + 1);

      context.beginPath();
      context.moveTo(left, bottom - 20);

      context.lineTo(right, bottom - 20);

      context.stroke();

      context.closePath();

      series.forEach(function (s) {
        data.forEach(function (d, i) {
          var x = xAxes.points.origin + pointSpacing * (i + 1);
          var y = bottom - 20;
          context.beginPath();
          context.moveTo(x, y - 5);
          context.lineTo(x, y + 5);
          context.stroke();
          context.closePath();

          xAxes['points'][d[s.labelField]] = x;
        });
      });

      this.set('xAxes', xAxes);
    }
  }, {
    key: '_drawYAxis',
    value: function _drawYAxis(context) {

      var yAxes = this.get('yAxes');
      var series = this.get('series');
      var data = this.get('data');

      var _model3 = this.model;
      var left = _model3.left;
      var top = _model3.top;
      var width = _model3.width;
      var height = _model3.height;
      var fillStyle = _model3.fillStyle;


      left = 30;
      top = 30;

      var right = left + width - 60;
      var bottom = top + height - 60;

      var yAxisLength = top - (bottom - 20);

      if (!yAxes['points']) yAxes['points'] = {};

      yAxes['points']['origin'] = bottom - 20;
      yAxes["axisLength"] = yAxisLength;

      var pointSpacing = yAxisLength / (data.length + 1);

      context.beginPath();

      context.moveTo(left + 20, top);

      context.lineTo(left + 20, bottom);

      context.stroke();

      context.closePath();

      var maxValue = yAxes.max || 0;
      var minValue = yAxes.min || 0;

      series.forEach(function (s) {
        data.forEach(function (d, i) {
          if (d[s.valueField] > maxValue) maxValue = d[s.valueField];

          var x = left + 20;
          var y = yAxes.points.origin + pointSpacing * (i + 1);
          // context.beginPath()
          // context.moveTo(x-5, y)
          // context.lineTo(x+5, y)
          // context.stroke()
          // context.closePath()
          //
          // yAxes['points'][d[s.valueField]] = y
        });
      });

      yAxes.maxValue = maxValue;

      this.set('yAxes', yAxes);
    }
  }, {
    key: '_drawSeries',
    value: function _drawSeries(context) {

      var xAxes = this.get('xAxes');
      var yAxes = this.get('yAxes');
      var series = this.get('series');
      var data = this.get('data');

      var originX = xAxes['points']['origin'];
      var originY = yAxes['points']['origin'];
      var xLength = xAxes['axisLength'];
      var yLength = yAxes['axisLength'];

      console.log("orgin", originX, originY);

      series.forEach(function (s) {
        context.beginPath();
        context.moveTo(originX, originY);
        data.forEach(function (d) {
          var label = d[s.labelField];
          var value = d[s.valueField];

          var x = xAxes.points[label];
          var y = originY + yAxes.axisLength / yAxes.maxValue * value;

          context.lineTo(x, y);

          console.log(x, y);
        });
        context.stroke();
        context.closePath();
      });
    }
  }, {
    key: '_draw',
    value: function _draw(context) {

      _get(Object.getPrototypeOf(SpcControlChart.prototype), '_draw', this).call(this, context);

      this._drawAxes(context);
      this._drawSeries(context);
    }
  }, {
    key: 'contains',
    value: function contains(x, y) {

      if (_get(Object.getPrototypeOf(SpcControlChart.prototype), 'contains', this).call(this, x, y)) return true;

      var _bounds = this.bounds;
      var left = _bounds.left;
      var top = _bounds.top;
      var width = _bounds.width;


      var right = left + width;

      var h = LABEL_HEIGHT * (this.components.length + 1);

      return x < Math.max(right + LABEL_WIDTH, right) && x > Math.min(right + LABEL_WIDTH, right) && y < Math.max(top + h, top) && y > Math.min(top + h, top);
    }
  }, {
    key: 'onmouseup',
    value: function onmouseup(e) {
      var down_point = this.__down_point;
      delete this.__down_point;

      if (!down_point || down_point.x != e.offsetX || down_point.y != e.offsetY) {
        return;
      }

      var point = this.transcoordC2S(e.offsetX, e.offsetY);

      var _model4 = this.model;
      var left = _model4.left;
      var top = _model4.top;
      var width = _model4.width;


      var right = left + width;

      var x = point.x - right;
      var y = point.y - top;

      if (x < 0) return;

      y /= LABEL_HEIGHT;
      y = Math.floor(y);

      if (!this.layoutConfig) this.layoutConfig = {};
    }
  }, {
    key: 'onmousedown',
    value: function onmousedown(e) {
      this.__down_point = {
        x: e.offsetX,
        y: e.offsetY
      };
    }
  }]);

  return SpcControlChart;
}(Container);

exports.default = SpcControlChart;


Component.register('spc-control-chart', SpcControlChart);

},{}]},{},[1,2]);
