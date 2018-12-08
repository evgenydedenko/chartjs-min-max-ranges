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
