

continents = {}

function get_continent(a, b) {
	if (a in b) {
		return b[a]
	}
	else {
		return "others"
	}
}

d3.csv("data/covid/country_continent.csv", function(error, d) {	
	for (var i = 0; i < d.length; i++) {
		continent = d[i]["Continent_Name"]
		country 	= d[i]["Country_Name"]
		window.continents[country] = continent
	}
})

var data = [{"salesperson":"Bob","sales":33},{"salesperson":"Robin","sales":12},{"salesperson":"Anne","sales":41},{"salesperson":"Mark","sales":16},{"salesperson":"Joe","sales":59},{"salesperson":"Eve","sales":38},{"salesperson":"Karen","sales":21},{"salesperson":"Kirsty","sales":25},{"salesperson":"Chris","sales":30},{"salesperson":"Lisa","sales":47},{"salesperson":"Tom","sales":5},{"salesperson":"Stacy","sales":20},{"salesperson":"Charles","sales":13},{"salesperson":"Mary","sales":29}];

// set the dimensions and margins of the graph
margin 	= {top: 20, right: 30, bottom: 30, left: 50},
width 	= 960 - margin.left - margin.right,
height 	= 500 - margin.top - margin.bottom;
y 			= d3.scaleBand().range([height, 0]).padding(0.1).domain(data.map(function(d) { return d.salesperson; }));
x 			= d3.scaleLinear().range([0, width]).domain([0, d3.max(data, function(d){ return d.sales; })]).nice();
          
svg 		= d3.select("#wuhan_bar_chart").append("svg")
						.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom)
						.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.selectAll(".bar")
   .data(data)
   .enter().append("rect")
   .attr("class", "bar")
   .attr("fill", "#B34742")
   //.attr("x", function(d) { return x(d.sales); })
   .attr("width", function(d) {return x(d.sales); } )
   .attr("y", function(d) { return y(d.salesperson); })
   .attr("height", y.bandwidth());

svg.selectAll(".bar_recovered")
   .data(data)
   .enter().append("rect")
   .attr("class", "bar_recovered")
   .attr("fill", "#60B380")
   //.attr("x", function(d) { return x(d.sales); })
   .attr("width", function(d) {return x(d.sales/10); } )
   .attr("y", function(d) { return y(d.salesperson); })
   .attr("height", y.bandwidth());
   
svg.append("g").attr("class", "axis_white").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));
svg.append("g").attr("class", "axis_white").call(d3.axisLeft(y));

