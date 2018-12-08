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

