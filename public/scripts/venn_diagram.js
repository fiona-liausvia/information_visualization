



d3.csv("data/covid/COVID19_open_line_list.csv", function(error, d) {  

	s_list = {}
	
	for (var i = 0; i < d.length; i++) {
		list = d[i].symptoms.split(";").join(', ').split(',');
		if (list.length == 0) {
			if ("no_symptoms" in s_list) s_list["no_symptoms"]++
			else s_list["no_symptoms"] = 1
		}
		
		list.sort()	
		group = ""
		for (var j = 0; j < list.length; j++) {
			word = list[j].trim()
			group += word + ","
			if (word in s_list) s_list[word]++
			else s_list[word] = 1
		}
		if (list.length > 1) {
			group = group.substring(0, group.length - 1);
			if (group in s_list) s_list[group] += 1
			else s_list[group] = 1
		}
	}

	var other_subset = new Set()
	for (key in s_list) {
		keys = key.split(",")
		if (keys.length == 2 && keys.includes("fever")) {
			other_subset.add(keys[0])
			other_subset.add(keys[1])
		}
	}

	other_subset = Array.from(other_subset)

	var sets = []
	for (key in s_list) {
		if (key == "") continue;
		keys = key.split(",")

		if (keys.length == 1 && keys[0] == "fever") {
			sets.push({
				"sets": keys,
				"size": s_list[key]
			})
		}

		for (var k = 0; k < other_subset.length; k++) {
			if (keys.length == 2 &&
				((keys[0] == "fever" && keys[1] == other_subset[k]) ||
				 (keys[0] == other_subset[k] && keys[1] == "fever") 
				))
				{
				sets.push({
					"sets": keys,
					"size": s_list[key]
				})
			}

			if (keys.length == 1 && keys[0] == other_subset[k]) {
				sets.push({
					"sets": keys,
					"size": s_list[key]
				})
			}
		}

	}

	// draw venn diagram
	var div = d3.select("#venn");
	div.datum(sets).call(venn.VennDiagram().width(800).height(800));

    d3.selectAll("#venn .venn-circle path")
        .style("fill-opacity", .8);

    d3.selectAll("#venn text").style("fill", "white");

	// add a tooltip
	var tooltip = d3.select("body").append("div")
	    .attr("class", "venntooltip");

	// add listeners to all the groups to display tooltip on mouseover
	div.selectAll("g")
	    .on("mouseover", function(d, i) {
	        // sort all the areas relative to the current item
	        venn.sortAreas(div, d);

	        // Display a tooltip with the current size
	        tooltip.transition().duration(200).style("opacity", .9);
	        tooltip.text("[" + d.sets + "] " + d.size + " patients");
	        
	        // highlight the current path
	        var selection = d3.select(this).transition("tooltip").duration(400);
	        selection.select("path")
	            .style("stroke-width", 3)
	            //.style("fill-opacity", d.sets.length == 1 ? .1 : .1)
	            .style("stroke-opacity", 1);
	    })

	    .on("mousemove", function() {
	        tooltip.style("left", (d3.event.pageX) + "px")
	               .style("top", (d3.event.pageY - 28) + "px");
	    })
	    
	    .on("mouseout", function(d, i) {
	        tooltip.transition().duration(400).style("opacity", 0);
	        var selection = d3.select(this).transition("tooltip").duration(500);
	        selection.select("path")
	            .style("stroke-width", 0)
	            //.style("fill-opacity", d.sets.length == 1 ? 0 : .0)
	            .style("stroke-opacity", 0);
	    });
});