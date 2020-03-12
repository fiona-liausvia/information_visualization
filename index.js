const express 	= require('express')
const path 		= require('path')
const PORT 		= process.env.PORT || 5000
const app       = express();
const ejs 	   	= require("ejs");
const bodyParser= require("body-parser");
const http 		= require("http");
const fs 		= require('fs');    
const csv 		= require('csv-parser');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.static(path.join(__dirname, 'data')))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/v2', (req, res) => res.render('pages/v2'))
  .get('/v3', (req, res) => res.render('pages/v3'))
  .get('/v4', (req, res) => res.render('pages/v4'))
  .get('/v5', (req, res) => res.render('pages/v5'))
  .get('/covid', (req, res) => res.render('pages/v6'))
  .get('/covidstats', (req, res) => res.render('pages/v7'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


// TODO: copy get continent code to here
/*
Create file for this - spend at most 2 hour. 
make everything nice-nice - spend at most 2 hour.
write report - spend at most 3 hour. 

wvdp a, wvdp b, wvdp c, .. wvdp f, country, region (color) - cluster, recovery rate

// TODO: create in server nodejs
// y-axis: recovery rate = total recovered / total confirmed
// x-axis: wvdp value

var data =[];
for(var i = 0; i < 42; i++) {
  data.push({
    x: Math.random() * 100,
    y: Math.random() * 100,
    c: Math.round(Math.random() * 5), // region
    size: Math.random() * 200,  // population
  });
}

*/

function get_days_diff(date1, date2) {

  // Jan 19 2020 to Feb 27 2020
  var Difference_In_Time = date2.getTime() - date1.getTime();     
  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
  
  return Difference_In_Days  
}

function get_continent(a, b) {
  if (a in b) {
    return b[a]
  }
  else {
    return "others"
  }
}

continents = {}
country_file = "public/data/covid/country_continent.csv"
if (fs.existsSync(country_file)) {
	loaded = fs.readFileSync(country_file, "utf8").split("\n");

	for (var i = 1; i < loaded.length; i++) {
		list = loaded[i].split(",");
		continents[list[2]] = list[0]
	}
}

correlation_data = {}
wdvp_file = "public/data/covid/WDVP.csv"
if (fs.existsSync(wdvp_file)) {
	loaded = fs.readFileSync(wdvp_file, "utf8").split("\n");

	for (var i = 19; i < loaded.length; i++) {
		list = loaded[i].split(";");
		country 				= list[0] 
		region 					= continents[country]
		population 			= parseInt(list[2])
		surface_area		= parseFloat(list[3])
		GINI 						= parseInt(list[5])
		happy_idx 			= parseFloat(list[6])
		human_dev_idx 	= parseFloat(list[7])
		world_happy			= parseFloat(list[8])
		SEDA 						= parseFloat(list[9])
		GDP 						= parseFloat(list[11])
		correlation_data[country] = {
			"region": region,
			"population": population,
			"surface_area": surface_area,
			"GINI": GINI,
			"happy_idx": happy_idx,
			"human_dev_idx": human_dev_idx,
			"world_happy": world_happy,
			"SEDA": SEDA,
			"GDP": GDP
		}
		// ... 
		//console.log(country, population, surface_area, GINI, happy_idx, human_dev_idx)
	}
}

covid_file = "public/data/covid/time_series_covid_19_confirmed_2.csv"
if (fs.existsSync(covid_file)) {
	loaded = fs.readFileSync(covid_file, "utf8").split("\n");

	for (var i = 1; i < loaded.length; i++) {
		list = loaded[i].split(";");

		country = list[1]
		console.log(country, continents[country])
		// TODO: continue
	}
}

/*
dblp_path = path.join(__dirname, '/data/') + "dblp2019.csv";
conf_year = {};
if (fs.existsSync(dblp_path)) {
	loaded = fs.readFileSync(dblp_path, "utf8").split("\n");

d3.csv("data/covid/country_continent.csv", function(error, d) { 
  for (var i = 0; i < d.length; i++) {
    continent = d[i]["Continent_Name"]
    country   = d[i]["Country_Name"]
    window.continents[country] = continent
  }

	d3.csv("data/covid/wdvp.csv", function(error, wdvp_d) { 
		for (var i = 5; i < wdvp_d.length; i++) {
			console.log(wdvp_d[i])
			break;
		}
	})
})
*/
