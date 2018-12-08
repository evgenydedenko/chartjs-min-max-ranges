var data = [
	{
		price: 10, 
		radius: 6,
		minPrice: 10,
		maxPrice: 50,
		t: moment().valueOf()
	},
	{
		radius: 6,
		minPrice: 10,
		maxPrice: 50,
		t: moment().add(1, 'M').valueOf()
	},
	{
		price: 5, 
		radius: 6,
		minPrice: 10,
		maxPrice: 50,
		t: moment().add(2, 'M').valueOf()
	},
	{
		price: null, 
		radius: 6,
		minPrice: null,
		maxPrice: 100,
		t: moment().add(3, 'M').valueOf()
	},
	{
		price: null, 
		radius: 6,
		minPrice: 3,
		maxPrice: null,
		t: moment().add(4, 'M').valueOf()
	},
	{
		price: 10, 
		radius: 6,
		minPrice: 10,
		maxPrice: 50,
		t: moment().add(5, 'M').valueOf()
	},
];

var ctx = document.getElementById("chart1").getContext("2d");
ctx.canvas.width = 1000;
ctx.canvas.height = 250;
var candlestickChart = new Chart(ctx, {
	type: 'minMaxRange',
	data: {
		datasets: [{
			label: "Min Max",
			data: data,
			fractionalDigitsCount: 2,
			fill: true,
			hoverBackgroundColor: "rgba(142, 94, 162, 0.6)",
			backgroundColor: "rgba(142, 94, 162, 0.4)",
			borderColor: "rgba(142, 94, 162, 0.6)"
		}]
	},
	options: {
		tooltips: {
			position: 'nearest',
			mode: 'index',
		},
		scales: {
			xAxes: [{
				ticks: {
					padding: 4
				}
			}]
		},
	},
});

console.log(data);