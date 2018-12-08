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
