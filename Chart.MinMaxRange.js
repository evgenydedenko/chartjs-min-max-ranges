/*!
 * chartjs-chart-financial
 * Version: 0.1.0
 *
 * Copyright 2017 chartjs-chart-financial contributors
 * Released under the MIT license
 * https://github.com/chartjs/chartjs-chart-financial/blob/master/LICENSE.md
 */
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.defaults.financial = {
		label: '',

		hover: {
			mode: 'label'
		},

		scales: {
			xAxes: [{
				type: 'time',
				distribution: 'series',
				categoryPercentage: 0.8,
				barPercentage: 0.9,
				ticks: {
					source: 'data'
				}
			}],
			yAxes: [{
				type: 'financialLinear'
			}]
		},

		tooltips: {
			callbacks: {
				label: function(tooltipItem, data) {
					var minPrice = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].minPrice;
					var maxPrice = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].maxPrice;
					var price = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].price;
					var fractionalDigitsCount = data.datasets[tooltipItem.datasetIndex].fractionalDigitsCount;
					if (fractionalDigitsCount !== undefined) {
						fractionalDigitsCount = Math.max(0, Math.min(100, fractionalDigitsCount));
						minPrice = minPrice ? minPrice.toFixed(fractionalDigitsCount) : "";
						maxPrice = maxPrice ? maxPrice.toFixed(fractionalDigitsCount) : "";
						price = price ? price.toFixed(fractionalDigitsCount) : "";
					}
					if (price) return " Price " + price; 
					var label = "";	
					if (minPrice)
						label += ' Min Price: ' + minPrice;
					if (maxPrice)
						label += ' Max Price ' + maxPrice;
					return label;
				}
			}
		}
	};

	var _validate = function(value) {
		return value !== null && value !== undefined && !isNaN(value);
	}

	var validator = function (data) {
		var price = data.price;
		if (_validate(price))
			return true;
		var minPrice =  data.minPrice;
		var maxPrice = data.maxPrice;
		if (_validate(minPrice) || _validate(maxPrice))
			return true;
		return false;
	}

	/**
	 * This class is based off controller.bar.js from the upstream Chart.js library
	 */
	Chart.controllers.financial = Chart.controllers.bar.extend({

		dataElementType: Chart.elements.Financial,

		/**
		 * @private
		 */
		updateElementGeometry: function(element, index, reset) {
			var me = this;
			var model = element._model;
			var vscale = me.getValueScale();
			var base = vscale.getBasePixel();
			var horizontal = vscale.isHorizontal();
			var ruler = me._ruler || me.getRuler();
			var vpixels = me.calculateBarValuePixels(me.index, index);
			var ipixels = me.calculateBarIndexPixels(me.index, index, ruler);
			var chart = me.chart;
			var datasets = chart.data.datasets;
			var indexData = datasets[me.index].data[index];

			model.horizontal = horizontal;
			model.base = reset ? base : vpixels.base;
			model.x = horizontal ? reset ? base : vpixels.head : ipixels.center;
			model.y = horizontal ? ipixels.center : reset ? base : vpixels.head;
			model.height = horizontal ? ipixels.size : undefined;
			model.width = horizontal ? undefined : ipixels.size;
			model.minPrice = _validate(indexData.minPrice) ? vscale.getPixelForValue(Number(indexData.minPrice)) : null;
			model.maxPrice = _validate(indexData.maxPrice) ? vscale.getPixelForValue(Number(indexData.maxPrice)) : null;
			model.price = _validate(indexData.price) ? vscale.getPixelForValue(Number(indexData.price)) : null;
			model.radius = indexData.radius || 6;
			if (datasets[me.index].backgroundColor)
				model.backgroundColor = datasets[me.index].backgroundColor;
			if (datasets[me.index].hoverBackgroundColor)
				model.hoverBackgroundColor = datasets[me.index].hoverBackgroundColor;
		},

		draw: function() {
			var ctx = this.chart.chart.ctx;
			var elements = this.getMeta().data;
			var dataset = this.getDataset();
			var ilen = elements.length;
			var i = 0;

			Chart.canvasHelpers.clipArea(ctx, this.chart.chartArea);

			for (; i < ilen; ++i) {
				if (validator(dataset.data[i])) {
					elements[i].draw();
				}
			}

			Chart.canvasHelpers.unclipArea(ctx);
		},

	});
};

},{}],3:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.defaults.minMaxRange = Object.assign({}, Chart.defaults.financial);
	Chart.defaults.minMaxRange.scales = {
		xAxes: [Object.assign({}, Chart.defaults.financial.scales.xAxes[0])],
		yAxes: [Object.assign({}, Chart.defaults.financial.scales.yAxes[0])]
	};

	Chart.controllers.minMaxRange = Chart.controllers.financial.extend({
		dataElementType: Chart.elements.MinMaxRange,

		updateElement: function(element, index, reset) {
			var me = this;
			var meta = me.getMeta();
			var dataset = me.getDataset();

			element._xScale = me.getScaleForId(meta.xAxisID);
			element._yScale = me.getScaleForId(meta.yAxisID);
			element._datasetIndex = me.index;
			element._index = index;

			element._model = {
				datasetLabel: dataset.label || '',
				// label: '', // to get label value please use dataset.data[index].label

				// Appearance
				color: dataset.color,
				borderColor: dataset.borderColor,
				borderWidth: dataset.borderWidth,
			};

			me.updateElementGeometry(element, index, reset);

			element.pivot();
		},

	});

};

},{}],4:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var globalOpts = Chart.defaults.global;

	globalOpts.elements.financial = {
		color: {
			up: 'rgba(142, 94, 162, 1)',
			down: 'rgba(142, 94, 162, 1)',
			unchanged: 'rgba(142, 94, 162, 1)',
		},
		fractionalDigitsCount: undefined,
	};

	function isVertical(bar) {
		return bar._view.width !== undefined;
	}

	var _validate = function(value) {
		return (value || value == 0)
	}

	var getY = function(vm) {
		var y = 0;
		if (_validate(vm.price)) {
			y = vm.price;
		} else if (_validate(vm.minPrice) && _validate(vm.maxPrice)) {
			y = vm.maxPrice - ((vm.maxPrice - vm.minPrice) / 2);
		} else if (_validate(vm.minPrice) && !_validate(vm.maxPrice)) {
			y = vm.minPrice;
		} else if (!_validate(vm.minPrice) && _validate(vm.maxPrice)) {
			y = vm.maxPrice;
		}
		return y;
	}

	/**
	 * Helper function to get the bounds of the candle
	 * @private
	 * @param bar {Chart.Element.financial} the bar
	 * @return {Bounds} bounds of the bar
	 */
	function getBarBounds(candle) {
		var vm = candle._view;
		var x1, x2, y1, y2;

		var halfWidth = vm.radius;
		x1 = vm.x - halfWidth;
		x2 = vm.x + halfWidth;
		if (_validate(vm.price)) {
			y1 = vm.price - halfWidth;
			y2 = vm.price + halfWidth;
		} else if (_validate(vm.minPrice) && _validate(vm.maxPrice)) {
			y1 = vm.maxPrice - halfWidth;
			y2 = vm.minPrice + halfWidth;
		} else if (_validate(vm.minPrice) && !_validate(vm.maxPrice)) {
			y1 = vm.minPrice - halfWidth;
			y2 = vm.minPrice + halfWidth;
		} else if (!_validate(vm.minPrice) && _validate(vm.maxPrice)) {
			y1 = vm.maxPrice - halfWidth;
			y2 = vm.maxPrice + halfWidth;
		}

		return {
			left: x1,
			top: y1,
			right: x2,
			bottom: y2
		};
	}

	Chart.elements.Financial = Chart.Element.extend({

		height: function() {
			var vm = this._view;
			
			return vm.base - getY(vm);
		},
		inRange: function(mouseX, mouseY) {
			var inRange = false;

			if (this._view) {
				var bounds = getBarBounds(this);
				inRange = mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
			}

			return inRange;
		},
		inLabelRange: function(mouseX, mouseY) {
			var me = this;
			if (!me._view) {
				return false;
			}

			var inRange = false;
			var bounds = getBarBounds(me);

			if (isVertical(me)) {
				inRange = mouseX >= bounds.left && mouseX <= bounds.right;
			} else {
				inRange = mouseY >= bounds.top && mouseY <= bounds.bottom;
			}

			return inRange;
		},
		inXRange: function(mouseX) {
			var bounds = getBarBounds(this);
			return mouseX >= bounds.left && mouseX <= bounds.right;
		},
		inYRange: function(mouseY) {
			var bounds = getBarBounds(this);
			return mouseY >= bounds.top && mouseY <= bounds.bottom;
		},
		getCenterPoint: function() {
			var vm = this._view;
			var x, y;

			var halfWidth = vm.width;
			x = vm.x - halfWidth;
			y = getY(vm);

			return {x: x, y: y};
		},
		getArea: function() {
			var vm = this._view;
			var y = getY(vm);
			return vm.width * Math.abs(y - vm.base);
		},
		tooltipPosition: function() {
			var vm = this._view;
			var y = getY(vm);
			return {
				x: vm.x,
				y: y
			};
		}
	});

};


},{}],5:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	var globalOpts = Chart.defaults.global;

	globalOpts.elements.minMaxRange = Object.assign(globalOpts.elements.financial, {
		borderColor: globalOpts.elements.financial.color.unchanged,
		borderWidth: 1,
	});

	var _validate = function(value) {
		return (value || value == 0)
	}

	Chart.elements.MinMaxRange = Chart.elements.Financial.extend({
		draw: function() {
			var ctx = this._chart.ctx;
			var vm = this._view;

			var x = vm.x;
			var price = vm.price;
			var minPrice = vm.minPrice;
			var maxPrice = vm.maxPrice;
			var radius = vm.radius;

			var borderColors = vm.borderColor;

			if (typeof borderColors === 'string') {
				borderColors = {
					up: borderColors,
					down: borderColors,
					unchanged: borderColors
				};
			}

			var borderColor = helpers.getValueOrDefault(vm.borderColor, globalOpts.elements.minMaxRange.color.unchanged);
			ctx.fillStyle = helpers.getValueOrDefault(vm.backgroundColor, globalOpts.elements.minMaxRange.color.unchanged);

			ctx.lineWidth = helpers.getValueOrDefault(vm.borderWidth, globalOpts.elements.minMaxRange.borderWidth);
			ctx.strokeStyle = helpers.getValueOrDefault(borderColor, globalOpts.elements.minMaxRange.borderColor);

			
			if (_validate(price)) {
				ctx.beginPath();
				ctx.arc(x, price, radius,0,2*Math.PI);
				ctx.fill();
				ctx.stroke();
				ctx.closePath();
			} else if (_validate(minPrice) && _validate(maxPrice)) {
				ctx.beginPath();
				ctx.arc(x, minPrice, radius,0,2*Math.PI);
				ctx.moveTo(x, minPrice + radius/2);
				ctx.moveTo(x + radius, maxPrice);
				ctx.arc(x, maxPrice, radius,0,2*Math.PI);
				ctx.fill();
				ctx.moveTo(x, maxPrice + radius);
				ctx.lineTo(x, minPrice - radius);
				ctx.stroke();
				ctx.closePath();
			}
			else if (_validate(minPrice) && !_validate(maxPrice)) {
				ctx.beginPath();
				ctx.arc(x, minPrice, radius,0,2*Math.PI);
				ctx.fill();
				ctx.stroke();
				ctx.closePath();
			} else if (!_validate(minPrice) && _validate(maxPrice)) {
				ctx.beginPath();
				ctx.arc(x, maxPrice, radius,0,2*Math.PI);
				ctx.fill();
				ctx.stroke();
				ctx.closePath();
			}
			
		},
	});
};

},{}],6:[function(require,module,exports){
'use strict';

var Chart = require('chart.js');
Chart = typeof Chart === 'function' ? Chart : window.Chart;

require('./scale.financialLinear.js')(Chart);

require('./element.financial.js')(Chart);
require('./element.minmaxrange.js')(Chart);

require('./controller.financial.js')(Chart);
require('./controller.minmaxrange.js')(Chart);

},{"./controller.financial.js":2,"./controller.minmaxrange.js":3,"./element.financial.js":4,"./element.minmaxrange.js":5,"./scale.financialLinear.js":7,"chart.js":1}],7:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	var defaultConfig = {
		position: 'left',
		ticks: {
			callback: Chart.Ticks.formatters.linear
		}
	};

	var FinancialLinearScale = Chart.scaleService.getScaleConstructor('linear').extend({

		determineDataLimits: function() {
			var me = this;
			var chart = me.chart;
			var data = chart.data;
			var datasets = data.datasets;
			var isHorizontal = me.isHorizontal();

			function IDMatches(meta) {
				return isHorizontal ? meta.xAxisID === me.id : meta.yAxisID === me.id;
			}

			// First Calculate the range
			me.min = null;
			me.max = null;

			// Regular charts use x, y values
			// For the financial chart we have rawValue.h (hi) and rawValue.l (low) for each point
			helpers.each(datasets, function(dataset, datasetIndex) {
				var meta = chart.getDatasetMeta(datasetIndex);
				if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
					helpers.each(dataset.data, function(rawValue) {
						var high = rawValue.maxPrice;
						var low = rawValue.minPrice;

						if (me.min === null) {
							me.min = low;
						} else if (low < me.min) {
							me.min = low;
						}

						if (me.max === null) {
							me.max = high;
						} else if (high > me.max) {
							me.max = high;
						}
					});
				}
			});

			// Add whitespace around bars. Axis shouldn't go exactly from min to max
			var space = (me.max - me.min) * 0.05;
			me.min -= space;
			me.max += space;

			// Common base implementation to handle ticks.min, ticks.max, ticks.beginAtZero
			this.handleTickRangeOptions();
		}
	});
	Chart.scaleService.registerScaleType('financialLinear', FinancialLinearScale, defaultConfig);

};

},{}]},{},[6]);
