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
  .get('/covidstats2', (req, res) => res.render('pages/v8'))
  .get('/bar', (req, res) => res.render('pages/bar'))
  .get('/bar2', (req, res) => res.render('pages/bar2'))
  .get('/bar3', (req, res) => res.render('pages/bar3'))
  .get('/bargroup', (req, res) => res.render('pages/bargroup'))
  .get('/scatterplot', (req, res) => res.render('pages/scatterplot'))  
  .get('/linegraph', (req, res) => res.render('pages/linegraph'))  
  .get('/piechart', (req, res) => res.render('pages/piechart'))  
  .get('/bargroup_practice', (req, res) => res.render('pages/bargroup_practice'))  
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


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
    health_exp      = parseFloat(list[14])
    educ_exp        = parseFloat(list[18])

		correlation_data[country] = {
			"region": region,
			"population": population,
			"surface_area": surface_area,
			"GINI": GINI,
			"happy_idx": happy_idx,
			"human_dev_idx": human_dev_idx,
			"world_happy": world_happy,
			"SEDA": SEDA,
			"GDP": GDP,
      "health_exp": health_exp,
      "educ_exp": educ_exp,
      "confirmed": [],
      "recovered": [],
      "death": []
		}
    for (var j = 0; j < 30; j++) {
      correlation_data[country]["confirmed"].push(0)
      correlation_data[country]["recovered"].push(0)
      correlation_data[country]["death"].push(0)
    }
	}
}

filter_country = new Set()
covid_file = "public/data/covid/time_series_covid_19_confirmed_2.csv"
if (fs.existsSync(covid_file)) {
	loaded = fs.readFileSync(covid_file, "utf8").split("\n");

	for (var i = 1; i < loaded.length; i++) {
		list = loaded[i].split(";");

		country = list[1]
    filter_country.add(country)
		//console.log(country, continents[country], list.length)

    if (!(country in correlation_data)) {
      if (country == "Macau" || country == "Hong Kong") {
        for (var j = 4; j < list.length; j++) {
          correlation_data["Mainland China"]["confirmed"][j - 4] += parseInt(list[j])
        }
      }
    }
    else {
      for (var j = 4; j < list.length; j++) {
        correlation_data[country]["confirmed"][j - 4] += parseInt(list[j])
      }
    }
	}
}

covid_file = "public/data/covid/time_series_covid_19_recovered_2.csv"
if (fs.existsSync(covid_file)) {
  loaded = fs.readFileSync(covid_file, "utf8").split("\n");

  for (var i = 1; i < loaded.length; i++) {
    list = loaded[i].split(";");

    country = list[1]
    //console.log(country, continents[country], list.length)

    if (!(country in correlation_data)) {
      if (country == "Macau" || country == "Hong Kong") {
        for (var j = 4; j < list.length; j++) {
          correlation_data["Mainland China"]["recovered"][j - 4] += parseInt(list[j])
        }
      }
    }
    else {
      for (var j = 4; j < list.length; j++) {
        correlation_data[country]["recovered"][j - 4] += parseInt(list[j])
      }
    }
  }
}

output_json = {}
filter_country = Array.from(filter_country)
for (var i = 0; i < filter_country.length; i++) {
  output_json[filter_country[i]] = correlation_data[filter_country[i]]
}

var correlation_data_json = JSON.stringify(output_json);
fs.writeFileSync('public/data/covid/correlation_data.json', correlation_data_json);

