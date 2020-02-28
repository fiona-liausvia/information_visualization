var express    	= require('express');
var app        	= express();
var ejs 	   		= require("ejs");
var bodyParser 	= require("body-parser");
var http 				= require("http");
var path 				= require('path')
var fs 					= require('fs');    
var csv 				= require('csv-parser');

app.use(express.static('public'))
app.use(express.static('data'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

require('./router/main')(app);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// ######################################## CCF 2019 #######################################

function ccf_category() {
	// CONFERENCE ID - Initial
	/*
	{ PPoPP: 0,
		FAST: 1,
		DAC: 2,
		HPCA: 3,
		MICRO: 4,
		SC: 5,
		ASPLOS: 6,
		ISCA: 7,
		USENIX: 8,
		SIGCOMM: 9,
		MobiCom: 10,
		INFOCOM: 11,
		NSDI: 12,
		CCS: 13,
		EUROCRYPT: 14,
		'S&P': 15,
		CRYPTO: 16,
		PLDI: 17,
		POPL: 18,
		'FSE/ESEC': 19,
		SOSP: 20,
		OOPSLA: 21,
		ASE: 22,
		ICSE: 23,
		ISSTA: 24,
		OSDI: 25,
		SIGMOD: 26,
		SIGKDD: 27,
		ICDE: 28,
		SIGIR: 29,
		VLDB: 30,
		STOC: 31,
		SODA: 32,
		CAV: 33,
		FOCS: 34,
		LICS: 35,
		'ACM MM': 36,
		SIGGRAPH: 37,
		VR: 38,
		'IEEE VIS': 39,
		AAAI: 40,
		NeurIPS: 41,
		ACL: 42,
		CVPR: 43,
		ICCV: 44,
		ICML: 45,
		IJCAI: 46,
		CSCW: 47,
		CHI: 48,
		UbiComp: 49 }
	*/

	category = { 
		'Computer Architecture / Parallel and Distributed Computing / Storage Systems': 0,
		'Computer Network': 1,
		'Network and Information Security': 2,
		'Software Engineering / System Software / Programming Language': 3,
		'Database / Data Mining / Information Retrieval': 4,
		'Computer Science Theory': 5,
		'Computer Graphics and Multimedia': 6,
		'Artificial Intelligence': 7,
		'Human-Computer Interaction and Pervasive Computing': 8,
		'Cross Field / Emerging Technology': 9
	}

	var category_json = JSON.stringify(category);
	fs.writeFileSync('data/category.json', category_json);

	return category
}

// #################################### DATA VISUAL 1 ######################################

function generate_data_visual_1() {
	category = ccf_category();

	name_category = {};
	name_cat_idx = 0;

	co_occurrence_matrix = { "nodes": [], "links": [] }
	ccf_path = path.join(__dirname, '/data/') + "ccf2019_r4.csv"
	if (fs.existsSync(ccf_path)) {
		loaded = fs.readFileSync(ccf_path, "utf8").split("\n")
	
		for (i in loaded) {
			new_data = loaded[i].split(",");
			// Filter rank A only
			if (new_data[4] == 'A' && new_data[3] != 'Cross Field / Emerging Technology') {

				if (new_data[0] in name_category) {}
				else {
					name_category[new_data[0]] = name_cat_idx
					name_cat_idx++						
				}

				co_occurrence_matrix["nodes"].push({
					"name"	: new_data[0],
					"group" : category[new_data[3]]
				})
			}
		}
	}

	max_value = 0
	jaccard_path = path.join(__dirname, '/data/') + "jaccard2019_r4.csv"
	if (fs.existsSync(jaccard_path)) {
		loaded = fs.readFileSync(jaccard_path, "utf8").split("\n")

		for (i in loaded) {
			new_data = loaded[i].split(",");
			if (new_data[0] in name_category && new_data[1] in name_category) {

				co_occurrence_matrix["links"].push({
					"source": name_category[new_data[0]],
					"target": name_category[new_data[1]],
					"value"	: parseFloat(new_data[2]) //parseInt(parseFloat(new_data[2]) * MAX_SCALE)
				})

				max_value = Math.max(max_value, parseFloat(new_data[2]))
			}
		}
	}

	//console.log("max_value", max_value)
	var co_occurrence_matrix_json = JSON.stringify(co_occurrence_matrix);
	fs.writeFileSync('data/co_occurence_matrix.json', co_occurrence_matrix_json);
}

// #################################### DATA VISUAL 2 ######################################

function generate_data_visual_2(year) {
	data = {
		"name": "conferences",
		"children": [
			{"name": "A", "children": [] },
			{"name": "B", "children": [] },
			{"name": "C", "children": [] }			
		]
	}

	conf_rank = {}
	ccf_path = path.join(__dirname, '/data/') + "ccf2019_r4.csv"
	if (fs.existsSync(ccf_path)) {
		loaded = fs.readFileSync(ccf_path, "utf8").split("\n")

		for (i in loaded) {
			new_data = loaded[i].split(",");
			conf_rank[new_data[0]] = new_data[4]
		}
	}

	dblp_path = path.join(__dirname, '/data/') + "dblp2019.csv";
	conf_year = {};
	if (fs.existsSync(dblp_path)) {
		loaded = fs.readFileSync(dblp_path, "utf8").split("\n");

		//console.log(loaded[0])

		for (i in loaded) {
			new_data = loaded[i].split(",");
			if (new_data[1] != year) continue;

			key = new_data[0];			
			if (key in conf_year) { conf_year[key] += 1; }
			else { conf_year[key] = 1; }
		}

		for (key in conf_year) {
			if (conf_rank[key] == "A") data["children"][0]["children"].push({ "name": key, "size": conf_year[key] }) 
			if (conf_rank[key] == "B") data["children"][1]["children"].push({ "name": key, "size": conf_year[key] }) 
			if (conf_rank[key] == "C") data["children"][2]["children"].push({ "name": key, "size": conf_year[key] }) 
		}

		var data_json = JSON.stringify(data);
		fs.writeFileSync('data/conf_treemap_' + year + '.json', data_json);
	}
}

// #################################### DATA VISUAL 3 ######################################

function generate_data_visual_3() {

	json_output = {
		"nodes": [],
		"links": []
	}

	fs.createReadStream('data/stack_network_links.csv')
	  .pipe(csv())
	  .on('data', (row) => {
	  	json_output["links"].push(row)
	  })
	  .on('end', () => {

		fs.createReadStream('data/stack_network_nodes.csv')
		  .pipe(csv())
		  .on('data', (row) => {
		  	json_output["nodes"].push({"id": row["name"], "group": row["group"], "size": row["nodesize"]})
		  })
		  .on('end', () => {

		    var data_json = JSON.stringify(json_output);
			fs.writeFileSync('data/stack_overflow.json', data_json);
		  });
	  });


}

var server     =    app.listen(3000,function(){
	console.log("Express is running on port 3000");

	// CCF2019
	//generate_data_visual_1();
	//generate_data_visual_2('2018');
	//generate_data_visual_2('2019');
	generate_data_visual_3();

});