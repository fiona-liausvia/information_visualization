

// BUTTON HERE
var button1 = d3.select("#button1")

// MAIN PARAM HERE
var height  = parseInt(d3.select("#barchart").attr("height"));
var width   = parseInt(d3.select("#barchart").attr("width"));
var margin  = 70;

function draw_legend(legend_label) {
    var legend_color    = d3.scale.category10(); // or category20
    //var legend_label    = ["1", "2", "3", "4"]

    d3.select("#legend").append("g").attr("id", "legend_rectangles")
    for (var i = 0; i < legend_label.length; i++) {
      d3.select("#legend_rectangles")
        .append("rect")
        .attr("height", 20)
        .attr("width", 20)
        .attr("x", 120 * i + 20)
        .attr("y", 30)
        .attr("fill", legend_color(i))
      d3.select("#legend_rectangles")
        .append("text")
        .attr("x", 120 * i + 50)
        .attr("y", 40)
        .attr("dy", ".35em")
        .attr("font-size", "13px")
        .attr("fill", "white")
        .text(legend_label[i])
    }
}

function dashboard(row_data) {
    
    // LEGEND HERE
    legend_label = []
    for (var i = 0; i < row_data.length; i++) {
        if (!legend_label.includes(row_data[i].profile)) {
            legend_label.push(row_data[i].profile)
        }
    }
    draw_legend(legend_label)

    // DRAWING BOARD
    svg = d3.select("#barchart")
        .append("svg")
        .attr("id", "svg-bar")
        .attr("width", width + margin + margin)
        .attr("height", height + margin + margin)
        .append("g").attr("transform", "translate(" + margin + "," + margin + ")");

    // DRAW X
    x_axis_height = height - margin - margin

    // Quantitative  
/*    x_label = "quality"
    x_domain = [0, 0] // bar chart always start from 0 
    for (var i = 0; i < row_data.length; i++) { x_domain[1] = Math.max(row_data[i][x_label], x_domain[0]) }
    
    x = d3.scaleLinear().range([0, width - margin - margin]).domain([x_domain[0], x_domain[1]]).nice(); 
*/    
    // Categorical
    x_label = "method"
    x_domain = [""];
    for (var i = 0; i < row_data.length; i++) { if (!x_domain.includes(row_data[i][x_label])) { x_domain.push(row_data[i][x_label]) } }

    x_range = [0]; x_interval = width / x_domain.length; 
    for (var i = 1; i <= x_domain.length; i++) { x_range.push(i * x_interval) }

    x = d3.scaleOrdinal().range(x_range).domain(x_domain);

    svg.append("g")
      .attr("id", "bar-x-axis")
     .attr("transform", "translate(0," + x_axis_height + ")") // x height 
      .attr("class", "axis_white").call(d3.axisBottom(x))      
      .append("text")
        .attr("x", 100)
        .attr("y", 20)
        .attr("dy", "2em")
        .attr("font-size", "2em")
        .style("text-anchor", "end")
        .text(x_label);      

    // DRAW Y
    y_label = "quality"

    y_range = [0, 0] // bar chart always start from 0 
    for (var i = 0; i < row_data.length; i++) { y_range[1] = Math.max(row_data[i][y_label], y_range[0]) }
    y       = d3.scaleLinear().range([0, height - margin - margin]).domain([y_range[1], y_range[0]]);

    svg.append("g")
      .attr("id", "bar-y-axis")
      .attr("transform", "translate(0,0)") 
      .attr("class", "axis_white").call(d3.axisLeft(y))      
      .append("text")
        .attr("x", -10)
        .attr("y", 10)
        .attr("dy", "2em")
        .attr("font-size", "2em")
        .style("text-anchor", "end")
        .text(y_label);      

    // DRAW BAR
    
}

// DATASET HERE
dataset_link = "data/exam/results.csv"

var row_data;
d3.csv(dataset_link, function(data){
    row_data = data.map(function(d) {
        return d
    });
    dashboard(row_data)
});

