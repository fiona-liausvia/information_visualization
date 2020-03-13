var height  = parseInt(d3.select("#bubble").attr("height"));
var width   = parseInt(d3.select("#bubble").attr("width"));
var margin  = 50;

var health_button     = d3.select("#health-button")
var gini_button       = d3.select("#GINI-button")
var happy_idx_button  = d3.select("#happy-idx-button")
var human_dev_button  = d3.select("#human-dev-button")
var seda_button       = d3.select("#SEDA-button")
var gdp_button        = d3.select("#GDP-button")
var education_button  = d3.select("#education-button")

gini_button.on("click", onclick_gini)  
happy_idx_button.on("click", onclick_happy_idx)  
health_button.on("click", onclick_health)  
human_dev_button.on("click", onclick_human_dev)  
seda_button.on("click", onclick_SEDA)  
gdp_button.on("click", onclick_GDP)  
education_button.on("click", onclick_education)  

region = {}
region["Asia"] = 0
region["North America"] = 1
region["Europe"] = 2
region["Oceania"] = 3

var legend_color   = d3.scale.category10();
var legend_label = ["Asia", "North America", "Europe", "Oceania"]

d3.select("#legend")
  .append("g")
  .attr("id", "rectangles")

for (var i = 0; i < 4; i++) {
  d3.select("#rectangles")
    .append("rect")
    .attr("height", 20)
    .attr("width", 20)
    .attr("x", 120 * i + 20)
    .attr("y", 30)
    .attr("fill", legend_color(i))
  d3.select("#rectangles")
    .append("text")
    .attr("x", 120 * i + 40)
    .attr("y", 40)
    .attr("dy", ".35em")
    .attr("font-size", "13px")
    .attr("fill", "white")
    .text(legend_label[i])
}

function onclick_health() {
  y_index = "health_exp"
  d3.select("#svg-bubble").remove()
  d3.select("#bubble-x-axis").remove()
  d3.select("#bubble-y-axis").remove()
  reload(y_index)
}

function onclick_gini() {
  y_index = "GINI"
  d3.select("#svg-bubble").remove()
  d3.select("#bubble-x-axis").remove()
  d3.select("#bubble-y-axis").remove()
  reload(y_index)
}

function onclick_happy_idx() {
  y_index = "happy_idx"
  d3.select("#svg-bubble").remove()
  d3.select("#bubble-x-axis").remove()
  d3.select("#bubble-y-axis").remove()
  reload(y_index)
}

function onclick_human_dev() {
  y_index = "human_dev_idx"
  d3.select("#svg-bubble").remove()
  d3.select("#bubble-x-axis").remove()
  d3.select("#bubble-y-axis").remove()
  reload(y_index)
}

function onclick_SEDA() {
  y_index = "SEDA"
  d3.select("#svg-bubble").remove()
  d3.select("#bubble-x-axis").remove()
  d3.select("#bubble-y-axis").remove()
  reload(y_index)
}

function onclick_GDP() {
  y_index = "GDP"
  d3.select("#svg-bubble").remove()
  d3.select("#bubble-x-axis").remove()
  d3.select("#bubble-y-axis").remove()
  reload(y_index)
}

function onclick_education() {
  y_index = "educ_exp"
  d3.select("#svg-bubble").remove()
  d3.select("#bubble-x-axis").remove()
  d3.select("#bubble-y-axis").remove()
  reload(y_index)
}

pretty_text = {}
pretty_text["health_exp"] = "Health Expenditure"
pretty_text["GINI"] = "GINI Index"
pretty_text["happy_idx"] = "World Happiness Index"
pretty_text["human_dev_idx"] = "Human Development Index"
pretty_text["SEDA"] = "SEDA"
pretty_text["GDP"] = "GDP"
pretty_text["educ_exp"] = "Education Expenditure"

function reload(y_index) {
  d3.json("data/covid/correlation_data.json", function(error, d) {
    data = []

    max_x = 0, max_y = 0
    min_x = 100000000000, min_y = 10000000000

    for (country in d) {
      if (isNaN(d[country][y_index]) || d[country][y_index] == null) continue;

      if (d[country]["recovered"][29] == 0 && d[country]["confirmed"][29] == 0) {
        recovery_rate = 0
      }
      else {
        recovery_rate = parseFloat(d[country]["recovered"][29] / d[country]["confirmed"][29])
      }

      min_x = Math.min(min_x, d[country][y_index])
      max_x = Math.max(max_x, d[country][y_index])
      min_y = Math.min(min_y, recovery_rate)
      max_y = Math.max(max_y, recovery_rate)

      data.push({
        country: country,
        x: d[country][y_index],
        y: recovery_rate,
        c: region[d[country]["region"]],
        size: d[country]["population"]
      })    
    }

    var labelX = pretty_text[y_index];
    var labelY = "Recovery Rate";

    y         = d3.scaleLinear().range([0, height - margin - margin]).domain([min_y, max_y]);
    x         = d3.scaleLinear().range([0, width - margin - margin]).domain([min_x, max_x]);
    svg       = d3.select("#bubble")
            .append("svg")
            .attr("id", "svg-bubble")
            .attr("width", width + margin + margin)
            .attr("height", height + margin + margin)
            .append("g").attr("transform", "translate(" + margin + "," + margin + ")");

    var scale   = d3.scaleSqrt().domain([d3.min(data, function (d) { return d.size; }), d3.max(data, function (d) { return d.size; })]).range([1, 50]);
    var opacity = d3.scaleSqrt().domain([d3.min(data, function (d) { return d.size; }), d3.max(data, function (d) { return d.size; })]).range([1, .5]);                    
    var color   = d3.scale.category10();

    svg.append("g")
      .attr("id", "bubble-x-axis")
      .attr("class", "axis_white").call(d3.axisTop(x))
      .append("text")
        .attr("x", 100)
        .attr("y", -50)
        .attr("dy", "2em")
        .style("text-anchor", "end")
        .text(labelX);      

    svg.append("g")
      .attr("id", "bubble-y-axis")
      .attr("class", "axis_white").call(d3.axisLeft(y))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -50)
        .attr("y", -50)
        .attr("dy", "2em")
        .style("text-anchor", "end")
        .text(labelY);

    var circle_text = svg.selectAll("circle")
      .data(data)
      .enter()
      .append("text")
      .attr("x", function (d) { return x(d.x) + scale(d.size) })
      .attr("y", function (d) { return y(d.y); })
      .attr("fill", "grey")
      .text(function (d) { return d.country })

    var circle = svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d.x); })
      .attr("cy", function (d) { return y(d.y); })
      .attr("opacity", function (d) { return opacity(d.size); })
      .attr("r", function (d) { return scale(d.size); })
      .style("fill", function (d) { return color(d.c); })      
      
    circle.on('mouseover', function (d, i) {
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
  })
}