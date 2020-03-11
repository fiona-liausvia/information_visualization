var date_list       = ["1/22/20", "1/23/20", "1/24/20", "1/25/20",  "1/26/20", "1/27/20", "1/28/20", "1/29/20", "1/30/20", "1/31/20", "2/1/20", "2/2/20", "2/3/20", "2/4/20", "2/5/20", "2/6/20", "2/7/20", "2/8/20", "2/9/20", "2/10/20", "2/11/20", "2/12/20", "2/13/20", "2/14/20", "2/15/20", "2/16/20", "2/17/20", "2/18/20", "2/19/20", "2/20/20"]                                                      
continents                = {}
provinces                 = []
provinces_no_hubei        = []
countries                 = []
wuhan_bar_data            = {}
wuhan_bar_data_no_hubei   = {}
country_bar_data          = {}

wuhan_margin              = {top: 20, right: 40, bottom: 30, left: 70},
width                     = 1200 - wuhan_margin.left - wuhan_margin.right,
height                    = 600 - wuhan_margin.top - wuhan_margin.bottom;

var bar;
var bar_text;
var bar_no_hubei;
var bar_text_no_hubei;
var bar_country;
var bar_text_country;

play_button_wuhan         = d3.select("#play-button-wuhan")
sort_button_wuhan         = d3.select("#sort-button-wuhan")

play_button_wuhan_no_hubei= d3.select("#play-button-wuhan-no-hubei")
sort_button_wuhan_no_hubei= d3.select("#sort-button-wuhan-no-hubei")
sort_recovered_button_wuhan_no_hubei  = d3.select("#sort-recovered-button-wuhan-no-hubei")
sort_death_button_wuhan_no_hubei      = d3.select("#sort-death-button-wuhan-no-hubei")

play_button_country           = d3.select("#play-button-country")
sort_button_country           = d3.select("#sort-button-country")
sort_recovered_button_country = d3.select("#sort-recovered-button-country")
sort_death_button_country     = d3.select("#sort-death-button-country")

var infected_data   = {}
var recovered_data  = {}
var deaths_data     = {}

speed = 200

// Data Preprocessing
d3.csv("data/covid/time_series_covid_19_confirmed.csv", function(error, d) {  
  for (var j=0; j < date_list.length; j++) {
    infected_data[j] = []
    for (var i=0; i < d.length; i++) {
      infected_data[j].push({
        "size": d[i][date_list[j]],
        "country": d[i]["Country/Region"],
        "province": d[i]["Province/State"]
      }) 
    }
  }

  d3.csv("data/covid/time_series_covid_19_recovered.csv", function(error, dd) {  
    for (var j=0; j < date_list.length; j++) {
      recovered_data[j] = []
      for (var i=0; i < dd.length; i++) {
        recovered_data[j].push({
          "size": dd[i][date_list[j]],
          "country": dd[i]["Country/Region"],
          "province": dd[i]["Province/State"]
        }) 
      }
    }

    d3.csv("data/covid/time_series_covid_19_deaths.csv", function(error, ddd) { 
      for (var j=0; j < date_list.length; j++) {
        deaths_data[j] = []
        for (var i=0; i < ddd.length; i++) {
          deaths_data[j].push({
            "size": ddd[i][date_list[j]],
            "country": ddd[i]["Country/Region"],
            "province": ddd[i]["Province/State"]
          }) 
        }
      }

      for (day_th in infected_data) {
        wuhan_bar_data[day_th] = []
        wuhan_bar_data_no_hubei[day_th] = []
        country_bar_data[day_th] = []

        for (var i = 0; i < infected_data[day_th].length; i++) {
          if (infected_data[day_th][i]["country"] == "Mainland China") {
            wuhan_bar_data[day_th].push({
              "province": infected_data[day_th][i]["province"], 
              "confirmed": infected_data[day_th][i]["size"],
              "recovered": recovered_data[day_th][i]["size"],
              "deaths": deaths_data[day_th][i]["size"]
            })

            if (infected_data[day_th][i]["province"] != "Hubei") {
              wuhan_bar_data_no_hubei[day_th].push({
                "province": infected_data[day_th][i]["province"], 
                "confirmed": infected_data[day_th][i]["size"],
                "recovered": recovered_data[day_th][i]["size"],
                "deaths": deaths_data[day_th][i]["size"]
              })
            }
          }
          else {
            if (infected_data[day_th][i]["country"] == "US" || 
                infected_data[day_th][i]["country"] == "Canada" ||
                infected_data[day_th][i]["country"] == "Australia" ) {
              cidx = find_country_data_idx(infected_data[day_th][i]["country"], country_bar_data[day_th])
              if (cidx != -1) {
                country_bar_data[day_th][cidx].confirmed += parseInt(infected_data[day_th][i]["size"])
                country_bar_data[day_th][cidx].recovered += parseInt(recovered_data[day_th][i]["size"])
                country_bar_data[day_th][cidx].deaths += parseInt(deaths_data[day_th][i]["size"])
              }
              else {
                country_bar_data[day_th].push({
                  "province": infected_data[day_th][i]["country"], 
                  "confirmed": parseInt(infected_data[day_th][i]["size"]),
                  "recovered": parseInt(recovered_data[day_th][i]["size"]),
                  "deaths": parseInt(deaths_data[day_th][i]["size"])
                })                  
              }
            }
            else if (infected_data[day_th][i]["country"] != "Others") {
              country_bar_data[day_th].push({
                "province": infected_data[day_th][i]["country"], 
                "confirmed": infected_data[day_th][i]["size"],
                "recovered": recovered_data[day_th][i]["size"],
                "deaths": deaths_data[day_th][i]["size"]
              })            
            }
          }
        }

        temp = wuhan_bar_data[day_th][0]
        wuhan_bar_data[day_th][0] = wuhan_bar_data[day_th][12]
        wuhan_bar_data[day_th][12] = temp
      }

      for (var i = 0; i < infected_data[0].length; i++) {
        if (infected_data[day_th][i]["country"] == "Mainland China") {
          provinces.push(infected_data[0][i]["province"])

          if (infected_data[day_th][i]["province"] != "Hubei") {
            provinces_no_hubei.push(infected_data[0][i]["province"])
          }
        }
        else {
          if (infected_data[day_th][i]["country"] != "Others") {
            countries.push(infected_data[0][i]["country"])          
          }
        }
      }
      temp          = provinces[0]
      provinces[0]  = provinces[12]
      provinces[12] = temp

      // Wuhan 
      y       = d3.scaleBand().padding(0.2).domain(provinces).range([0, height]);
      x       = d3.scaleLinear().range([0, width]).domain([0, 65000]);
      svg     = d3.select("#wuhan_bar_chart").append("svg")
              .attr("width", width + wuhan_margin.left + wuhan_margin.right)
              .attr("height", height + wuhan_margin.top + wuhan_margin.bottom)
              .append("g").attr("transform", "translate(" + wuhan_margin.left + "," + wuhan_margin.top + ")");
      svg.append("g").attr("class", "axis_white").call(d3.axisTop(x));
      svg.append("g")
        .attr("id", "y-axis")
        .attr("class", "axis_white")
        .call(d3.axisLeft(y));
        
      bar = svg.selectAll(".bar_confirmed").data(wuhan_bar_data[0]).enter()
        .append("rect")  
        .attr("class", "bar_confirmed")
        .attr("fill", "#B34742")
        .attr("y", function(d) { return y(d.province); })
        .attr("height", y.bandwidth())
        .attr("width", 0)

      bar_text = svg.selectAll(".bar_text").data(wuhan_bar_data[0]).enter()
        .append("text")
        .attr("fill", "white")
        .attr("x", function(d) { return x(d.confirmed) + 5; })
        .attr("y", function(d) { return y(d.province); })    
        .attr("font-size", "0.7em")
        .text("")

      play_button_wuhan.on("click", play_wuhan)  
      sort_button_wuhan.on("click", sort_wuhan)  

      // Wuhan - Without Hubei
      y_no_hubei       = d3.scaleBand().padding(0.2).domain(provinces_no_hubei).range([0, height]);
      x_no_hubei       = d3.scaleLinear().range([0, width]).domain([0, 1500]);
      svg_no_hubei     = d3.select("#wuhan_no_hubei_bar_chart").append("svg")
              .attr("width", width + wuhan_margin.left + wuhan_margin.right)
              .attr("height", height + wuhan_margin.top + wuhan_margin.bottom)
              .append("g").attr("transform", "translate(" + wuhan_margin.left + "," + wuhan_margin.top + ")");
      svg_no_hubei.append("g").attr("class", "axis_white").call(d3.axisTop(x_no_hubei));
      svg_no_hubei.append("g")
        .attr("id", "y-axis-nohubei")
        .attr("class", "axis_white")
        .call(d3.axisLeft(y_no_hubei));
        
      bar_no_hubei = svg_no_hubei.selectAll(".bar_confirmed").data(wuhan_bar_data_no_hubei[0]).enter()
        .append("rect")  
        .attr("class", "bar_confirmed")
        .attr("fill", "#B34742")
        .attr("y_no_hubei", function(d) { return y_no_hubei(d.province); })
        .attr("height", y_no_hubei.bandwidth())
        .attr("width", 0)

      bar_recovered_no_hubei = svg_no_hubei.selectAll(".bar_recovered").data(wuhan_bar_data_no_hubei[0]).enter()
        .append("rect")  
        .attr("class", "bar_recovered")
        .attr("fill", "#30E9FF")
        .attr("y_no_hubei", function(d) { return y_no_hubei(d.province); })
        .attr("height", y_no_hubei.bandwidth())
        .attr("width", 0)      

      bar_deaths_no_hubei = svg_no_hubei.selectAll(".bar_deaths").data(wuhan_bar_data_no_hubei[0]).enter()
        .append("rect")  
        .attr("class", "bar_deaths")
        .attr("fill", "#BD00A9")
        .attr("y_no_hubei", function(d) { return y_no_hubei(d.province); })
        .attr("height", y_no_hubei.bandwidth())
        .attr("width", 0)               

      bar_text_no_hubei = svg_no_hubei.selectAll(".bar_text_no_hubei").data(wuhan_bar_data_no_hubei[0]).enter()
        .append("text")
        .attr("fill", "white")
        .attr("x", function(d) { return x_no_hubei(d.confirmed) + 5; })
        .attr("y", function(d) { return y_no_hubei(d.province); })    
        .attr("font-size", "0.7em")
        .text("")

      bar_text_recovered_no_hubei = svg_no_hubei.selectAll(".bar_text_no_hubei").data(wuhan_bar_data_no_hubei[0]).enter()
        .append("text")
        .attr("fill", "white")
        .attr("x", function(d) { return x_no_hubei(d.recovered) + 5; })
        .attr("y", function(d) { return y_no_hubei(d.province); })    
        .attr("font-size", "0.7em")
        .text("")

      bar_text_deaths_no_hubei = svg_no_hubei.selectAll(".bar_text_no_hubei").data(wuhan_bar_data_no_hubei[0]).enter()
        .append("text")
        .attr("fill", "black")
        .attr("x", function(d) { return x_no_hubei(d.deaths) + 5; })
        .attr("y", function(d) { return y_no_hubei(d.province); })    
        .attr("font-size", "0.7em")
        .text("")        

      play_button_wuhan_no_hubei.on("click", play_wuhan_no_hubei)  
      sort_button_wuhan_no_hubei.on("click", sort_wuhan_no_hubei)  
      sort_recovered_button_wuhan_no_hubei.on("click", sort_recovered_wuhan_no_hubei)  
      sort_death_button_wuhan_no_hubei.on("click", sort_death_wuhan_no_hubei)  

      // Country
      y_country       = d3.scaleBand().padding(0.2).domain(countries).range([0, height]);
      x_country       = d3.scaleLinear().range([0, width]).domain([0, 110]);
      svg_country     = d3.select("#country_bar_chart").append("svg")
              .attr("width", width + wuhan_margin.left + wuhan_margin.right)
              .attr("height", height + wuhan_margin.top + wuhan_margin.bottom)
              .append("g").attr("transform", "translate(" + wuhan_margin.left + "," + wuhan_margin.top + ")");
      svg_country.append("g").attr("class", "axis_white").call(d3.axisTop(x_country));
      svg_country.append("g")
        .attr("id", "y-country-axis")
        .attr("class", "axis_white")
        .call(d3.axisLeft(y_country));
        
      bar_country = svg_country.selectAll(".bar_confirmed_country").data(country_bar_data[0]).enter()
        .append("rect")  
        .attr("class", "bar_confirmed_country")
        .attr("fill", "#B34742")
        .attr("y", function(d) { return y_country(d.province); })
        .attr("height", y_country.bandwidth())
        .attr("width", 0)

      bar_recovered_country = svg_country.selectAll(".bar_recovered_country").data(country_bar_data[0]).enter()
        .append("rect")  
        .attr("class", "bar_recovered_country")
        .attr("fill", "#30E9FF")
        .attr("y", function(d) { return y_country(d.province); })
        .attr("height", y_country.bandwidth())
        .attr("width", 0)      

      bar_deaths_country = svg_country.selectAll(".bar_deaths_country").data(country_bar_data[0]).enter()
        .append("rect")  
        .attr("class", "bar_deaths_country")
        .attr("fill", "#BD00A9")
        .attr("y", function(d) { return y_country(d.province); })
        .attr("height", y_country.bandwidth())
        .attr("width", 0)               

      bar_text_country = svg_country.selectAll(".bar_text_country").data(country_bar_data[0]).enter()
        .append("text")
        .attr("fill", "white")
        .attr("x", function(d) { return x_country(d.confirmed) + 5; })
        .attr("y", function(d) { return y_country(d.province); })    
        .attr("font-size", "0.7em")
        .text("")

      bar_text_recovered_country = svg_country.selectAll(".bar_text_country").data(country_bar_data[0]).enter()
        .append("text")
        .attr("fill", "white")
        .attr("x", function(d) { return x_country(d.recovered) + 5; })
        .attr("y", function(d) { return y_country(d.province); })    
        .attr("font-size", "0.7em")
        .text("")

      bar_text_deaths_country = svg_country.selectAll(".bar_text_country").data(country_bar_data[0]).enter()
        .append("text")
        .attr("fill", "black")
        .attr("x", function(d) { return x_country(d.deaths) + 5; })
        .attr("y", function(d) { return y_country(d.province); })    
        .attr("font-size", "0.7em")
        .text("")        

      play_button_country.on("click", play_country)  
      sort_button_country.on("click", sort_country)  
      sort_recovered_button_country.on("click", sort_recovered_country)  
      sort_death_button_country.on("click", sort_death_country)  
    });
  });
});

function play_wuhan() {
  y.domain(provinces)
  svg.select("#y-axis").remove()
  svg.append("g")
    .attr("id", "y-axis")
    .attr("class", "axis_white")
    .call(d3.axisLeft(y));

  wuhan_bar_step = 0
  var t = d3.interval(function() {
    new_data = wuhan_bar_data[wuhan_bar_step]

    bar = bar.data(new_data);

    bar.transition().duration(300)
      //.attr("y", function(d) { return y(d.province); })
      .attr("width", function(d) { return x(d.confirmed); })

    bar_text = bar_text.data(wuhan_bar_data[wuhan_bar_step]); // , function(d) { return d; }

    bar_text.transition().duration(300)
      .attr("x", function(d) { return x(d.confirmed); })
      .attr("y", function(d) { return y(d.province) + 10; })    
      .text(function(d) { return d.confirmed; })

    wuhan_bar_step++;
    if (wuhan_bar_step == Object.keys(wuhan_bar_data).length) t.stop();
  }, speed)
}

function sort_wuhan() {
  last_idx = Object.keys(wuhan_bar_data).length - 1

  new_data = JSON.parse(JSON.stringify(wuhan_bar_data[last_idx]))

  new_data.sort(function(a, b) { return b.confirmed - a.confirmed; })

  sorted_provinces = []
  for (var i = 0; i < new_data.length; i++) 
    sorted_provinces.push(new_data[i].province)

  y.domain(sorted_provinces)
  svg.select("#y-axis").remove()
  svg.append("g")
    .attr("id", "y-axis")
    .attr("class", "axis_white").call(d3.axisLeft(y));

  bar = bar.data(new_data);

  bar.transition().duration(300)
    //.attr("y", function(d) { return y(d.province); })
    .attr("width", function(d) { return x(d.confirmed); })

  bar_text = bar_text.data(new_data); // , function(d) { return d; }

  bar_text.transition().duration(300)
    .attr("x", function(d) { return x(d.confirmed); })
    .attr("y", function(d) { return y(d.province) + 10; })    
    .text(function(d) { return d.confirmed; })
}

function play_wuhan_no_hubei() {
  y_no_hubei.domain(provinces_no_hubei)
  svg_no_hubei.select("#y-axis-nohubei").remove()
  svg_no_hubei.append("g")
    .attr("id", "y-axis-nohubei")
    .attr("class", "axis_white")
    .call(d3.axisLeft(y_no_hubei));

  wuhan_no_hubei_bar_step = 0
  var t = d3.interval(function() {
    bar_no_hubei = bar_no_hubei.data(wuhan_bar_data_no_hubei[wuhan_no_hubei_bar_step]);
    bar_no_hubei.transition().duration(300)
      .attr("y", function(d) { return y_no_hubei(d.province); })
      .attr("width", function(d) {
        return x_no_hubei(d.confirmed); 
      })
    bar_text_no_hubei = bar_text_no_hubei.data(wuhan_bar_data_no_hubei[wuhan_no_hubei_bar_step]); // , function(d) { return d; }

    bar_recovered_no_hubei = bar_recovered_no_hubei.data(wuhan_bar_data_no_hubei[wuhan_no_hubei_bar_step]);
    bar_recovered_no_hubei.transition().duration(300)
      .attr("y", function(d) { return y_no_hubei(d.province); })
      .attr("width", function(d) {
        return x_no_hubei(d.recovered); 
      })
    bar_text_recovered_no_hubei = bar_text_recovered_no_hubei.data(wuhan_bar_data_no_hubei[wuhan_no_hubei_bar_step]); // , function(d) { return d; }

    bar_deaths_no_hubei = bar_deaths_no_hubei.data(wuhan_bar_data_no_hubei[wuhan_no_hubei_bar_step]);
    bar_deaths_no_hubei.transition().duration(300)
      .attr("y", function(d) { return y_no_hubei(d.province); })
      .attr("width", function(d) {
        return x_no_hubei(d.deaths); 
      })
    bar_text_deaths_no_hubei = bar_text_deaths_no_hubei.data(wuhan_bar_data_no_hubei[wuhan_no_hubei_bar_step]); // , function(d) { return d; }


    bar_text_no_hubei.transition().duration(300)
      .attr("x", function(d) { return x_no_hubei(d.confirmed); })
      .attr("y", function(d) { 
        return y_no_hubei(d.province) + 13; 
      })    
      .text(function(d) { 
        return d.confirmed; 
      })

    bar_text_recovered_no_hubei.transition().duration(300)
      .attr("x", function(d) { return x_no_hubei(d.recovered); })
      .attr("y", function(d) { 
        return y_no_hubei(d.province) + 13; 
      })    
      .text(function(d) { 
        return d.recovered; 
      })

    bar_text_deaths_no_hubei.transition().duration(300)
      .attr("x", function(d) { return x_no_hubei(d.deaths); })
      .attr("y", function(d) { 
        return y_no_hubei(d.province) + 13; 
      })    
      .text(function(d) { 
        return d.deaths; 
      })

    wuhan_no_hubei_bar_step++;
    if (wuhan_no_hubei_bar_step == 30) t.stop();
  }, speed)  
}

function sort_wuhan_no_hubei() {
  last_idx = Object.keys(wuhan_bar_data_no_hubei).length - 1

  new_data = JSON.parse(JSON.stringify(wuhan_bar_data_no_hubei[last_idx]))

  new_data.sort(function(a, b) { return b.confirmed - a.confirmed; })

  sorted_provinces_no_hubei = []
  for (var i = 0; i < new_data.length; i++) 
    sorted_provinces_no_hubei.push(new_data[i].province)

  y_no_hubei.domain(sorted_provinces_no_hubei)
  svg_no_hubei.select("#y-axis-nohubei").remove()
  svg_no_hubei.append("g")
    .attr("id", "y-axis-nohubei")
    .attr("class", "axis_white").call(d3.axisLeft(y_no_hubei));

  bar_no_hubei = bar_no_hubei.data(new_data);
  bar_no_hubei.transition().duration(300)
    .attr("y", function(d) { return y_no_hubei(d.province); })
    .attr("width", function(d) {
      return x_no_hubei(d.confirmed); 
    })
  bar_text_no_hubei = bar_text_no_hubei.data(new_data); // , function(d) { return d; }

  bar_recovered_no_hubei = bar_recovered_no_hubei.data(new_data);
  bar_recovered_no_hubei.transition().duration(300)
    .attr("y", function(d) { return y_no_hubei(d.province); })
    .attr("width", function(d) {
      return x_no_hubei(d.recovered); 
    })
  bar_text_recovered_no_hubei = bar_text_recovered_no_hubei.data(new_data); // , function(d) { return d; }

  bar_deaths_no_hubei = bar_deaths_no_hubei.data(new_data);
  bar_deaths_no_hubei.transition().duration(300)
    .attr("y", function(d) { return y_no_hubei(d.province); })
    .attr("width", function(d) {
      return x_no_hubei(d.deaths); 
    })
  bar_text_deaths_no_hubei = bar_text_deaths_no_hubei.data(new_data); // , function(d) { return d; }

  bar_text_no_hubei.transition().duration(300)
    .attr("x", function(d) { return x_no_hubei(d.confirmed); })
    .attr("y", function(d) { 
      return y_no_hubei(d.province) + 13; 
    })    
    .text(function(d) { 
      return d.confirmed; 
    })

  bar_text_recovered_no_hubei.transition().duration(300)
    .attr("x", function(d) { return x_no_hubei(d.recovered); })
    .attr("y", function(d) { 
      return y_no_hubei(d.province) + 13; 
    })    
    .text(function(d) { 
      return d.recovered; 
    })

  bar_text_deaths_no_hubei.transition().duration(300)
    .attr("x", function(d) { return x_no_hubei(d.deaths); })
    .attr("y", function(d) { 
      return y_no_hubei(d.province) + 13; 
    })    
    .text(function(d) { 
      return d.deaths; 
    })
}

function sort_recovered_wuhan_no_hubei() {
  last_idx = Object.keys(wuhan_bar_data_no_hubei).length - 1

  new_data = JSON.parse(JSON.stringify(wuhan_bar_data_no_hubei[last_idx]))

  new_data.sort(function(a, b) { return b.recovered - a.recovered; })

  sorted_provinces_no_hubei = []
  for (var i = 0; i < new_data.length; i++) 
    sorted_provinces_no_hubei.push(new_data[i].province)

  y_no_hubei.domain(sorted_provinces_no_hubei)
  svg_no_hubei.select("#y-axis-nohubei").remove()
  svg_no_hubei.append("g")
    .attr("id", "y-axis-nohubei")
    .attr("class", "axis_white").call(d3.axisLeft(y_no_hubei));

  bar_no_hubei = bar_no_hubei.data(new_data);
  bar_no_hubei.transition().duration(300)
    .attr("y", function(d) { return y_no_hubei(d.province); })
    .attr("width", function(d) {
      return x_no_hubei(d.confirmed); 
    })
  bar_text_no_hubei = bar_text_no_hubei.data(new_data); // , function(d) { return d; }

  bar_recovered_no_hubei = bar_recovered_no_hubei.data(new_data);
  bar_recovered_no_hubei.transition().duration(300)
    .attr("y", function(d) { return y_no_hubei(d.province); })
    .attr("width", function(d) {
      return x_no_hubei(d.recovered); 
    })
  bar_text_recovered_no_hubei = bar_text_recovered_no_hubei.data(new_data); // , function(d) { return d; }

  bar_deaths_no_hubei = bar_deaths_no_hubei.data(new_data);
  bar_deaths_no_hubei.transition().duration(300)
    .attr("y", function(d) { return y_no_hubei(d.province); })
    .attr("width", function(d) {
      return x_no_hubei(d.deaths); 
    })
  bar_text_deaths_no_hubei = bar_text_deaths_no_hubei.data(new_data); // , function(d) { return d; }

  bar_text_no_hubei.transition().duration(300)
    .attr("x", function(d) { return x_no_hubei(d.confirmed); })
    .attr("y", function(d) { 
      return y_no_hubei(d.province) + 13; 
    })    
    .text(function(d) { 
      return d.confirmed; 
    })

  bar_text_recovered_no_hubei.transition().duration(300)
    .attr("x", function(d) { return x_no_hubei(d.recovered); })
    .attr("y", function(d) { 
      return y_no_hubei(d.province) + 13; 
    })    
    .text(function(d) { 
      return d.recovered; 
    })

  bar_text_deaths_no_hubei.transition().duration(300)
    .attr("x", function(d) { return x_no_hubei(d.deaths); })
    .attr("y", function(d) { 
      return y_no_hubei(d.province) + 13; 
    })    
    .text(function(d) { 
      return d.deaths; 
    })
}

function sort_death_wuhan_no_hubei() {
  last_idx = Object.keys(wuhan_bar_data_no_hubei).length - 1

  new_data = JSON.parse(JSON.stringify(wuhan_bar_data_no_hubei[last_idx]))

  new_data.sort(function(a, b) { 
    if (b.deaths == a.deaths) {
      return b.recovered - a.recovered
    }
    return b.deaths - a.deaths; 
  })

  sorted_provinces_no_hubei = []
  for (var i = 0; i < new_data.length; i++) 
    sorted_provinces_no_hubei.push(new_data[i].province)

  y_no_hubei.domain(sorted_provinces_no_hubei)
  svg_no_hubei.select("#y-axis-nohubei").remove()
  svg_no_hubei.append("g")
    .attr("id", "y-axis-nohubei")
    .attr("class", "axis_white").call(d3.axisLeft(y_no_hubei));

  bar_no_hubei = bar_no_hubei.data(new_data);
  bar_no_hubei.transition().duration(300)
    .attr("y", function(d) { return y_no_hubei(d.province); })
    .attr("width", function(d) {
      return x_no_hubei(d.confirmed); 
    })
  bar_text_no_hubei = bar_text_no_hubei.data(new_data); // , function(d) { return d; }

  bar_recovered_no_hubei = bar_recovered_no_hubei.data(new_data);
  bar_recovered_no_hubei.transition().duration(300)
    .attr("y", function(d) { return y_no_hubei(d.province); })
    .attr("width", function(d) {
      return x_no_hubei(d.recovered); 
    })
  bar_text_recovered_no_hubei = bar_text_recovered_no_hubei.data(new_data); // , function(d) { return d; }

  bar_deaths_no_hubei = bar_deaths_no_hubei.data(new_data);
  bar_deaths_no_hubei.transition().duration(300)
    .attr("y", function(d) { return y_no_hubei(d.province); })
    .attr("width", function(d) {
      return x_no_hubei(d.deaths); 
    })
  bar_text_deaths_no_hubei = bar_text_deaths_no_hubei.data(new_data); // , function(d) { return d; }

  bar_text_no_hubei.transition().duration(300)
    .attr("x", function(d) { return x_no_hubei(d.confirmed); })
    .attr("y", function(d) { 
      return y_no_hubei(d.province) + 13; 
    })    
    .text(function(d) { 
      return d.confirmed; 
    })

  bar_text_recovered_no_hubei.transition().duration(300)
    .attr("x", function(d) { return x_no_hubei(d.recovered); })
    .attr("y", function(d) { 
      return y_no_hubei(d.province) + 13; 
    })    
    .text(function(d) { 
      return d.recovered; 
    })

  bar_text_deaths_no_hubei.transition().duration(300)
    .attr("x", function(d) { return x_no_hubei(d.deaths); })
    .attr("y", function(d) { 
      return y_no_hubei(d.province) + 13; 
    })    
    .text(function(d) { 
      return d.deaths; 
    })
}

function find_country_data_idx(country, dt) {
  for (var i = 0; i < dt.length; i++) {
    if (dt[i].province == country) {
      console.log("FOUND", dt[i].province, country)
      return i;
    }
  }
  return -1;
}

function play_country() {
  y_country.domain(countries)
  svg_country.select("#y-country-axis").remove()
  svg_country.append("g")
    .attr("id", "y-country-axis")
    .attr("class", "axis_white")
    .call(d3.axisLeft(y_country));

  wuhan_bar_step = 0
  var t = d3.interval(function() {
    new_data = country_bar_data[wuhan_bar_step]

    bar_country = bar_country.data(new_data);
    bar_country.transition().duration(300)
      .attr("y", function(d) { return y_country(d.province); })
      .attr("width", function(d) { return x_country(d.confirmed); })
    bar_text_country = bar_text_country.data(new_data); // , function(d) { return d; }

    bar_recovered_country = bar_recovered_country.data(country_bar_data[wuhan_bar_step]);
    bar_recovered_country.transition().duration(300)
      .attr("y", function(d) { return y_country(d.province); })
      .attr("width", function(d) {
        return x_country(d.recovered); 
      })
    bar_text_recovered_country = bar_text_recovered_country.data(country_bar_data[wuhan_bar_step]); // , function(d) { return d; }

    bar_deaths_country = bar_deaths_country.data(country_bar_data[wuhan_bar_step]);
    bar_deaths_country.transition().duration(300)
      .attr("y", function(d) { return y_country(d.province); })
      .attr("width", function(d) {
        return x_country(d.deaths); 
      })
    bar_text_deaths_country = bar_text_deaths_country.data(country_bar_data[wuhan_bar_step]); // , function(d) { return d; }

    bar_text_country.transition().duration(300)
      .attr("x", function(d) { return x_country(d.confirmed); })
      .attr("y", function(d) { 
        return y_country(d.province) + 13; 
      })    
      .text(function(d) { 
        return d.confirmed; 
      })

    bar_text_recovered_country.transition().duration(300)
      .attr("x", function(d) { return x_country(d.recovered); })
      .attr("y", function(d) { 
        return y_country(d.province) + 13; 
      })    
      .text(function(d) { 
        return d.recovered; 
      })

    bar_text_deaths_country.transition().duration(300)
      .attr("x", function(d) { return x_country(d.deaths); })
      .attr("y", function(d) { 
        return y_country(d.province) + 13; 
      })    
      .text(function(d) { 
        return d.deaths; 
      })

    wuhan_bar_step++;
    if (wuhan_bar_step == Object.keys(country_bar_data).length) t.stop();
  }, speed)
}

function sort_country() {
  last_idx = Object.keys(country_bar_data).length - 1

  new_data = JSON.parse(JSON.stringify(country_bar_data[last_idx]))

  new_data.sort(function(a, b) { return b.confirmed - a.confirmed; })

  sorted_provinces = []
  for (var i = 0; i < new_data.length; i++) 
    sorted_provinces.push(new_data[i].province)

  y_country.domain(sorted_provinces)
  svg_country.select("#y-country-axis").remove()
  svg_country.append("g")
    .attr("id", "y-country-axis")
    .attr("class", "axis_white").call(d3.axisLeft(y_country));

  bar_country = bar_country.data(new_data);

  bar_country.transition().duration(300)
    .attr("y", function(d) { return y_country(d.province); })
    .attr("width", function(d) { return x_country(d.confirmed); })
  bar_text_country = bar_text_country.data(new_data); // , function(d) { return d; }

  bar_recovered_country = bar_recovered_country.data(new_data);
  bar_recovered_country.transition().duration(300)
    .attr("y", function(d) { return y_country(d.province); })
    .attr("width", function(d) {
      return x_country(d.recovered); 
    })
  bar_text_recovered_country = bar_text_recovered_country.data(new_data); // , function(d) { return d; }

  bar_deaths_country = bar_deaths_country.data(new_data);
  bar_deaths_country.transition().duration(300)
    .attr("y", function(d) { return y_country(d.province); })
    .attr("width", function(d) {
      return x_country(d.deaths); 
    })
  bar_text_deaths_country = bar_text_deaths_country.data(new_data); // , function(d) { return d; }


  bar_text_country.transition().duration(300)
    .attr("x", function(d) { return x_country(d.confirmed); })
    .attr("y", function(d) { return y_country(d.province) + 10; })    
    .text(function(d) { return d.confirmed; })

  bar_text_recovered_country.transition().duration(300)
    .attr("x", function(d) { return x_country(d.recovered); })
    .attr("y", function(d) { 
      return y_country(d.province) + 13; 
    })    
    .text(function(d) { 
      return d.recovered; 
    })

  bar_text_deaths_country.transition().duration(300)
    .attr("x", function(d) { return x_country(d.deaths); })
    .attr("y", function(d) { 
      return y_country(d.province) + 13; 
    })    
    .text(function(d) { 
      return d.deaths; 
    })
}

function sort_recovered_country() {
  last_idx = Object.keys(country_bar_data).length - 1

  new_data = JSON.parse(JSON.stringify(country_bar_data[last_idx]))

  new_data.sort(function(a, b) { return b.recovered - a.recovered; })

  sorted_provinces = []
  for (var i = 0; i < new_data.length; i++) 
    sorted_provinces.push(new_data[i].province)

  y_country.domain(sorted_provinces)
  svg_country.select("#y-country-axis").remove()
  svg_country.append("g")
    .attr("id", "y-country-axis")
    .attr("class", "axis_white").call(d3.axisLeft(y_country));

  bar_country = bar_country.data(new_data);

  bar_country.transition().duration(300)
    .attr("y", function(d) { return y_country(d.province); })
    .attr("width", function(d) { return x_country(d.confirmed); })
  bar_text_country = bar_text_country.data(new_data); // , function(d) { return d; }

  bar_recovered_country = bar_recovered_country.data(new_data);
  bar_recovered_country.transition().duration(300)
    .attr("y", function(d) { return y_country(d.province); })
    .attr("width", function(d) {
      return x_country(d.recovered); 
    })
  bar_text_recovered_country = bar_text_recovered_country.data(new_data); // , function(d) { return d; }

  bar_deaths_country = bar_deaths_country.data(new_data);
  bar_deaths_country.transition().duration(300)
    .attr("y", function(d) { return y_country(d.province); })
    .attr("width", function(d) {
      return x_country(d.deaths); 
    })
  bar_text_deaths_country = bar_text_deaths_country.data(new_data); // , function(d) { return d; }


  bar_text_country.transition().duration(300)
    .attr("x", function(d) { return x_country(d.confirmed); })
    .attr("y", function(d) { return y_country(d.province) + 10; })    
    .text(function(d) { return d.confirmed; })

  bar_text_recovered_country.transition().duration(300)
    .attr("x", function(d) { return x_country(d.recovered); })
    .attr("y", function(d) { 
      return y_country(d.province) + 13; 
    })    
    .text(function(d) { 
      return d.recovered; 
    })

  bar_text_deaths_country.transition().duration(300)
    .attr("x", function(d) { return x_country(d.deaths); })
    .attr("y", function(d) { 
      return y_country(d.province) + 13; 
    })    
    .text(function(d) { 
      return d.deaths; 
    })
}

function sort_death_country() {
  last_idx = Object.keys(country_bar_data).length - 1

  new_data = JSON.parse(JSON.stringify(country_bar_data[last_idx]))

  new_data.sort(function(a, b) { 
    if (b.deaths == a.deaths) {
      return b.recovered - a.recovered
    }
    return b.deaths - a.deaths; 
  })

  sorted_provinces = []
  for (var i = 0; i < new_data.length; i++) 
    sorted_provinces.push(new_data[i].province)

  y_country.domain(sorted_provinces)
  svg_country.select("#y-country-axis").remove()
  svg_country.append("g")
    .attr("id", "y-country-axis")
    .attr("class", "axis_white").call(d3.axisLeft(y_country));

  bar_country = bar_country.data(new_data);

  bar_country.transition().duration(300)
    .attr("y", function(d) { return y_country(d.province); })
    .attr("width", function(d) { return x_country(d.confirmed); })
  bar_text_country = bar_text_country.data(new_data); // , function(d) { return d; }

  bar_recovered_country = bar_recovered_country.data(new_data);
  bar_recovered_country.transition().duration(300)
    .attr("y", function(d) { return y_country(d.province); })
    .attr("width", function(d) {
      return x_country(d.recovered); 
    })
  bar_text_recovered_country = bar_text_recovered_country.data(new_data); // , function(d) { return d; }

  bar_deaths_country = bar_deaths_country.data(new_data);
  bar_deaths_country.transition().duration(300)
    .attr("y", function(d) { return y_country(d.province); })
    .attr("width", function(d) {
      return x_country(d.deaths); 
    })
  bar_text_deaths_country = bar_text_deaths_country.data(new_data); // , function(d) { return d; }


  bar_text_country.transition().duration(300)
    .attr("x", function(d) { return x_country(d.confirmed); })
    .attr("y", function(d) { return y_country(d.province) + 10; })    
    .text(function(d) { return d.confirmed; })

  bar_text_recovered_country.transition().duration(300)
    .attr("x", function(d) { return x_country(d.recovered); })
    .attr("y", function(d) { 
      return y_country(d.province) + 13; 
    })    
    .text(function(d) { 
      return d.recovered; 
    })

  bar_text_deaths_country.transition().duration(300)
    .attr("x", function(d) { return x_country(d.deaths); })
    .attr("y", function(d) { 
      return y_country(d.province) + 13; 
    })    
    .text(function(d) { 
      return d.deaths; 
    })
}

/*
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
    country   = d[i]["Country_Name"]
    window.continents[country] = continent
  }
})

function get_days_diff(date1, date2) {

  // Jan 19 2020 to Feb 27 2020
  var Difference_In_Time = date2.getTime() - date1.getTime();     
  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
  
  return Difference_In_Days  
}*/



/*d3.csv("data/covid/COVID19_open_line_list.csv", function(error, d) { 
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

  for (day in new_data) { for (prov in new_data[day]) { province_china[prov] = 1 } }      
  for (prov in province_china) { provinces.push( { "provinces": prov, "confirmed": 0 } ) }
/*
      wuhan_bar_data[day].push({
        "province": prov, 
        "confirmed": new_data[day][prov]
      })
*/
/*

*/