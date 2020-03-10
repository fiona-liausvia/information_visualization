

continents      = {}
province_china  = {}
provinces       = []
wuhan_bar_data  = {}

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

function get_days_diff(date1, date2) {

  // Jan 19 2020 to Feb 27 2020
  var Difference_In_Time = date2.getTime() - date1.getTime();     
  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
  
  return Difference_In_Days  
}

d3.csv("data/covid/COVID19_open_line_list.csv", function(error, d) { 
  //var min_dt = new Date(2020, 11, 10);
  //var max_dt = new Date(2000, 11, 10);
  var date_default_china = new Date(2020, 0, 19)
  var max_h = 0
  var max_confirmed = 0
  var new_data = {}

  for (var i = 0; i < 40; i++) {
    wuhan_bar_data[i] = []
    new_data[i] = {}
  }

  for (var i = 0; i < d.length; i++) {
    if (d[i]["country"] == "China") {
      province = d[i]["province"]
      dt = d[i]["date_confirmation"].split(".")      
      date_confirmation = new Date(dt[2], dt[1] - 1, dt[0]);
      day_th = get_days_diff(date_default_china, date_confirmation)
      if (isNaN(day_th)) continue; 

      if (province in new_data[day_th]) {
        new_data[day_th][province] += 1
      }
      else {
        new_data[day_th][province] = 1
      }
    }  
  }

  for (day in new_data) {
    for (prov in new_data[day]) {
      wuhan_bar_data[day].push({
        "province": prov, 
        "confirmed": new_data[day][prov]
      })
      province_china[prov] = 1
    }
  }      
 
  for (prov in province_china) {
    provinces.push(prov)
  }

  // set the dimensions and margins of the graph
  margin  = {top: 20, right: 40, bottom: 30, left: 70},
  width   = 960 - margin.left - margin.right,
  height  = 500 - margin.top - margin.bottom;
  var y   = d3.scaleBand().padding(0.2).domain(provinces).range([0, height]);
  x       = d3.scaleLinear().range([0, width]).domain([0, 300]).nice();
  svg     = d3.select("#wuhan_bar_chart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g").attr("class", "axis_white").call(d3.axisTop(x));
  svg.append("g").attr("class", "axis_white").call(d3.axisLeft(y));

  var bar = svg.selectAll(".bar_confirmed").data(wuhan_bar_data[0]).enter()
    .append("rect")
    .attr("class", "bar_confirmed")
    .attr("fill", "#B34742")
    .attr("y", function(d) { return y(d.province); })
    .attr("height", y.bandwidth())
    .attr("width", 0)

  bar.transition().duration(500).attr("width", function(d) { return x(d.confirmed); } )

  wuhan_bar_step = 0
  var t = d3.interval(function() {
    bar = bar.data(wuhan_bar_data[wuhan_bar_step]);
    bar.transition().duration(500)
      .attr("width", function(d) { return x(d.confirmed); } )

    bar.enter().append("rect")
      .attr("class", "bar_confirmed")
      .attr("fill", "#B34742")
      .attr("y", function(d) { return y(d.province); })
      .attr("height", y.bandwidth())
      .attr("width", 0 ).transition().duration(500).attr("width", function(d) { return x(d.confirmed); } )

    wuhan_bar_step++;
    if (wuhan_bar_step == 40) t.stop();
  }, 1000)

})
