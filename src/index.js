'use strict';

var Chart = require('chart.js');
Chart = typeof Chart === 'function' ? Chart : window.Chart;

require('./scale.financialLinear.js')(Chart);

require('./element.financial.js')(Chart);
require('./element.minmaxrange.js')(Chart);

require('./controller.financial.js')(Chart);
require('./controller.minmaxrange.js')(Chart);
