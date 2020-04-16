var slider_svg            = d3.select("#slider_svg");
var playButton            = d3.select("#play-button")
var slider_margin_left    = 12
var slider_margin_right   = 30
var slider_width   				= slider_svg.attr("width") - slider_margin_right;
var slider_height  				= slider_svg.attr("height");
var slider_target  				= 0; 
var slider_actual  				= 0;
var slider_prev_target 		= 0;
var slider_alpha          = 0.2;
var slider_step_timer;
var slider_moving         = true;
var slider_max_val       	= 80;
var slider_trail_length   = 5;
var slider_timer  				= d3.timer(updateTween);
var slider_x 							= d3.scaleLinear().domain([0, slider_max_val]).range([0, slider_width]).clamp(true); 
var slider_date 					= new Date(2020, 0, 22); //COVID19_open_line_list 

// DATA
var date_list 			= ["2020-01-22",
"2020-01-23",
"2020-01-24",
"2020-01-25",
"2020-01-26",
"2020-01-27",
"2020-01-28",
"2020-01-29",
"2020-01-30",
"2020-01-31",
"2020-02-01",
"2020-02-02",
"2020-02-03",
"2020-02-04",
"2020-02-05",
"2020-02-06",
"2020-02-07",
"2020-02-08",
"2020-02-09",
"2020-02-10",
"2020-02-11",
"2020-02-12",
"2020-02-13",
"2020-02-14",
"2020-02-15",
"2020-02-16",
"2020-02-17",
"2020-02-18",
"2020-02-19",
"2020-02-20",
"2020-02-21",
"2020-02-22",
"2020-02-23",
"2020-02-24",
"2020-02-25",
"2020-02-26",
"2020-02-27",
"2020-02-28",
"2020-02-29",
"2020-03-01",
"2020-03-02",
"2020-03-03",
"2020-03-04",
"2020-03-05",
"2020-03-06",
"2020-03-07",
"2020-03-08",
"2020-03-09",
"2020-03-10",
"2020-03-11",
"2020-03-12",
"2020-03-13",
"2020-03-14",
"2020-03-15",
"2020-03-16",
"2020-03-17",
"2020-03-18",
"2020-03-19",
"2020-03-20",
"2020-03-21",
"2020-03-22",
"2020-03-23",
"2020-03-24",
"2020-03-25",
"2020-03-26",
"2020-03-27",
"2020-03-28",
"2020-03-29",
"2020-03-30",
"2020-03-31",
"2020-04-01",
"2020-04-02",
"2020-04-03",
"2020-04-04",
"2020-04-05",
"2020-04-06",
"2020-04-07",
"2020-04-08",
"2020-04-09",
"2020-04-10"
]
var map_circle 			= []	
/*var infected_data 	= {}
d3.csv("data/covid/time_series_covid_19_confirmed.csv", function(error, d) {	

//  console.log(d)

	for (var j=0; j < date_list.length; j++) {
		infected_data[j] = []
		for (var i=0; i < d.length; i++) {
			infected_data[j].push({
				"lat": d[i]["Lat"],
				"lng": d[i]["Long"],
				"r": get_radius(d[i][date_list[j]]),
				"size": d[i][date_list[j]],
				"id": j + "_" + i,
				"country": d[i]["Country/Region"],
				"province": d[i]["Province/State"],				
				"date": date_list[j]
			}) 
		}    
	}

  console.log("infected_data")
  console.log(infected_data)
  data = [
      [{lat:, lng:, r:, size:, id:, country:, date: }]
  ]
  
});
*/
var infected_data   = {}
d3.csv("data/exam/DATASET-3.csv", function(error, d) {  

  console.log(d)

  for (var j = 0; j < d.length; j++) {
    infected_data[j] = []
    infected_data[j].push({
      "lat": "35.8617",
      "lng": "104.1954",
      "r": get_radius(d[j]["China"]),
      "size": d[j]["China"],
      "id": j + "_0",
      "country": "China",
      "province": "China",       
      "date": d[j].Date
    })

    infected_data[j].push({
      "lat": "37.0902",
      "lng": "-95.7129",
      "r": get_radius(d[j]["US"]),
      "size": d[j]["US"],
      "id": j + "_1",
      "country": "US",
      "province": "US",       
      "date": d[j].Date
    })

    infected_data[j].push({
      "lat": "55.3781",
      "lng": "3.4360",
      "r": get_radius(d[j]["United_Kingdom"]),
      "size": d[j]["United_Kingdom"],
      "id": j + "_2",
      "country": "United_Kingdom",
      "province": "United_Kingdom",       
      "date": d[j].Date
    })

    infected_data[j].push({
      "lat": "41.8719",
      "lng": "12.5674",
      "r": get_radius(d[j]["Italy"]),
      "size": d[j]["Italy"],
      "id": j + "_3",
      "country": "Italy",
      "province": "Italy",       
      "date": d[j].Date
    })

    infected_data[j].push({
      "lat": "46.2276",
      "lng": "2.2137",
      "r": get_radius(d[j]["France"]),
      "size": d[j]["France"],
      "id": j + "_4",
      "country": "France",
      "province": "France",       
      "date": d[j].Date
    })

    infected_data[j].push({
      "lat": "51.1657",
      "lng": "10.4515",
      "r": get_radius(d[j]["Germany"]),
      "size": d[j]["Germany"],
      "id": j + "_5",
      "country": "Germany",
      "province": "Germany",       
      "date": d[j].Date
    })

    infected_data[j].push({
      "lat": "40.4637",
      "lng": "3.7492",
      "r": get_radius(d[j]["Spain"]),
      "size": d[j]["Spain"],
      "id": j + "_6",
      "country": "Spain",
      "province": "Spain",       
      "date": d[j].Date
    })

    infected_data[j].push({
      "lat": "32.4279",
      "lng": "53.6880",
      "r": get_radius(d[j]["Iran"]),
      "size": d[j]["Iran"],
      "id": j + "_7",
      "country": "Iran",
      "province": "Iran",       
      "date": d[j].Date
    })
  }

  console.log("final")
  console.log(infected_data)

});


/*var recovered_data 	= {}
d3.csv("data/covid/time_series_covid_19_recovered.csv", function(error, d) {	
	for (var j=0; j < date_list.length; j++) {
		recovered_data[j] = []
		for (var i=0; i < d.length; i++) {
			recovered_data[j].push({
				"lat": d[i]["Lat"],
				"lng": d[i]["Long"],
				"r": get_radius(d[i][date_list[j]]),
				"size": d[i][date_list[j]],
				"id": j + "_" + i
			}) 
		}
	}
});

var deaths_data 	= {}
d3.csv("data/covid/time_series_covid_19_deaths.csv", function(error, d) {	
	for (var j=0; j < date_list.length; j++) {
		deaths_data[j] = []
		for (var i=0; i < d.length; i++) {
			deaths_data[j].push({
				"lat": d[i]["Lat"],
				"lng": d[i]["Long"],
				"r": get_radius(d[i][date_list[j]]),
				"size": d[i][date_list[j]],
				"id": j + "_" + i
			}) 
		}
	}
});
*/
// MAP SLIDER
var slider 						= slider_svg.append("g")
  .attr("class", "slider")
  .attr("transform", "translate(" + slider_margin_left + ", " + slider_height / 2 + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", slider_x.range()[0])
    .attr("x2", slider_x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", () => slider.interrupt())
        .on("start drag", () => update(slider_x.invert(d3.event.x))));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(slider_x.ticks(20)).enter()
  .append("text")
    .attr("x", slider_x)
    .attr("text-anchor", "middle")
    .text(d => convertToDate(d))
    .style('fill', 'white')

var slider_handle 		= slider.insert("circle", ".track-overlay").attr("class", "handle").attr("r", 9);
d3.select(window).on("keydown", keydowned);
playButton.on("click", paused).each(paused);

// MAP
var map         = d3.select("#map_svg");
var projection  = d3.geo.mercator();
var path        = d3.geo.path().projection(projection);

// Load Map Data
d3.json("https://unpkg.com/world-atlas@1/world/110m.json", function(error, world) {
  if (error) throw error;

  map.selectAll("path")
     .data(topojson.feature(world,world.objects.countries).features)
     .enter().append("path")
     .attr("d", path);
});

function get_radius(r) {
	if (r > 5000) return 25
	if (r > 2000) return 20
	if (r > 1000) return 15
	if (r > 500) return 10
	if (r > 200) return 9
	if (r > 100) return 8
	if (r > 25) return 7
	if (r > 10) return 6
	if (r > 5) return 5
	else return 2
}

function update_circle() {
  var circ;
  var circ_enter;

  circ = map.selectAll("circle").data(map_circle)

  circ_enter = circ.enter()
      .append("circle")
      .attr("class", "site")
      .attr("cx", function(d) {
        return projection([d.lng, d.lat])[0];
      })
      .attr("cy", function(d) {
        return projection([d.lng, d.lat])[1];
      })
 	    //.attr("r", 1)
     	//.transition().duration(200)
      .attr("r", function(d) { return d.r })
      .attr("id", function(d) { return d.id })
      .attr("country", function(d) { return d.country } )
      .attr("province", function(d) { return d.province } )   
      .attr("date", function(d) { return d.date } )            
      .on("click", circle_clicked)

  circ.exit()
  	//.transition().duration(200)
    //.attr("r",1)
  	.remove();  
}

function convertToDate(d) {
	var new_dt = new Date(2020, 0, 22);
	new_dt.setDate(new_dt.getDate() + d)

	output = new_dt.getDate() + "/" + (new_dt.getMonth() + 1)
	return output
}

function update(d) {	
  slider_target = d;
  slider_moving = true;
  slider_timer.restart(updateTween);
}

function updateTween() {
  // This is where color are changed - connect to map 
  var diff = slider_target - slider_actual;
  
  if (Math.abs(diff) < 1e-3) {
    slider_actual = slider_target; 
    slider_timer.stop();
  }
  else slider_actual += diff * slider_alpha;
  
  slider_handle.attr("cx", slider_x(slider_actual));

  day_th = Math.round(slider_actual)
  
  if (slider_prev_target != day_th) {
	  if (day_th in window.infected_data) {
	  	map_circle = []
	  	update_circle()
	  	map_circle = window.infected_data[day_th]
	  	update_circle()
	  }
	}

	slider_prev_target = day_th
}

function keydowned() {
  let currentValue = slider_actual;
  if (d3.event.metaKey || d3.event.altKey) return;
  switch (d3.event.keyCode) {
    case 37: currentValue = Math.max(slider_x.domain()[0], slider_actual - slider_trail_length / 10); break;
    case 39: currentValue = Math.min(slider_x.domain()[1], slider_actual + slider_trail_length / 10); break;
    default: return;
  }
  update(currentValue);
  paused();
}

function paused() {
  if (slider_moving) {
    slider.interrupt();
    clearInterval(slider_step_timer);
    slider_moving = false;
    playButton.text("Play");
  } else {
    if (slider_actual > slider_max_val) slider_actual = 0;
    slider_step_timer = setInterval(step, 100);
    slider_moving = true;
    playButton.text("Pause");
  }
}

function step() {
  if (slider_actual > slider_max_val) paused();
  else update(slider_actual + slider_trail_length / 10);
}

function circle_clicked() {
	id 					= this.id.split("_")
	day_idx 		= id[0]
	country_idx = id[1]  

	country_info = this.getAttribute("country")
	province_info = ""
	if (this.getAttribute("province") != null) {
		province_info = this.getAttribute("province")
	}

	d3.select("#confirmed_text")
    .attr("fill", "red")
    .text("Confirmed")
	d3.select("#recovered_text").text("Recovered")
	d3.select("#death_text").text("Deaths")

	d3.select("#date_map").text(this.getAttribute("date"))
	d3.select("#country_map").text(country_info)
	d3.select("#province_map").text(province_info)
	d3.select("#confirmed_map").text(infected_data[day_idx][country_idx].size)
/*	d3.select("#recovered_map").text(recovered_data[day_idx][country_idx].size)
	d3.select("#deaths_map").text(deaths_data[day_idx][country_idx].size)
*/
}