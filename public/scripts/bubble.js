var height = parseInt(d3.select("#bubble").attr("height"));
var width = parseInt(d3.select("#bubble").attr("width"));
var margin = 40;


// TODO: create in server nodejs
// y-axis: recovery rate = total recovered / total confirmed
// x-axis: wvdp value

var data =[];
for(var i = 0; i < 42; i++) {
	data.push({
    x: Math.random() * 100,
    y: Math.random() * 100,
    c: Math.round(Math.random() * 5), // region
    size: Math.random() * 200,
  });
}

var labelX = 'X';
var labelY = 'Y';
var svg    = d3.select('#bubble')            
            .append('svg')
            .attr('class', 'chart')
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin + "," + margin + ")");

y         = d3.scaleLinear().range([0, height]).domain([0, 150]);
x         = d3.scaleLinear().range([0, width]).domain([0, 150]);
svg       = d3.select("#bubble").append("svg")
        .attr("width", width + margin + margin)
        .attr("height", height + margin + margin)
        .append("g").attr("transform", "translate(" + margin + "," + margin + ")");

var scale   = d3.scaleSqrt().domain([d3.min(data, function (d) { return d.size; }), d3.max(data, function (d) { return d.size; })]).range([1, 20]);
var opacity = d3.scaleSqrt().domain([d3.min(data, function (d) { return d.size; }), d3.max(data, function (d) { return d.size; })]).range([1, .5]);                    
var color   = d3.scale.category10();

svg.append("g").attr("class", "axis_white").call(d3.axisTop(x));
svg.append("g").attr("class", "axis_white").call(d3.axisLeft(y));


var circle = svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", function (d) { return x(d.x); })
  .attr("cy", function (d) { return y(d.y); })
  .attr("opacity", function (d) { return opacity(d.size); })
  .attr("r", function (d) { return scale(d.size); })
  .style("fill", function (d) { return color(d.c); })
  .on('mouseover', function (d, i) {
      fade(d.c, .1);
  })
  .on('mouseout', function (d, i) {
     fadeOut();
  })  
                           
function fade(c, opacity) {
  circle.filter(function (d) {
    return d.c != c;
  })
  .transition()
  .style("opacity", opacity);
}

function fadeOut() {
  circle.style("opacity", function (d) { opacity(d.size); });
}