var url 	= require('url');    
var fs 		= require('fs');    
var path 	= require('path')

video_info = {}

module.exports = function(app)
{
/*
	function home_page(res) {
    	video_info = {}

		var video_dir = path.join(__dirname, '/../data/videos');
		var vidid_dir = path.join(__dirname, '/../data/videoids');
		var annot_dir = path.join(__dirname, '/../data/annotations');
		fs.readdir(video_dir, function(err, items) {		 
		    for (var i = 0; i < items.length; i++) {

		    	id = items[i].split(".")[0]

		    	if (i == 0) { prev_id = "NA" }
		    	else { prev_id = items[i - 1].split(".")[0] }

		    	if (i == items.length - 1) { next_id = "NA" }
		    	else { next_id = items[i + 1].split(".")[0] }

		    	video_info[id] = {
		    		"id": id,
		    		"prev_id": prev_id,
		    		"next_id": next_id,
		    		"status": "new",
		    		"vid_data": [],
		    		"pid": -1,
		    		"comment": ""
		    	}

		    	annot_path = annot_dir + "/" + id + ".json"
		    	if (fs.existsSync(annot_path)) {
		    		video_info[id]["status"] = "annotated"

		    		loaded = fs.readFileSync(annot_path);
		    		video_info[id]["vid_data"] = JSON.stringify(JSON.parse(loaded))
		    	}

		    	comment_path = annot_dir + "/" + id
		    	if (fs.existsSync(comment_path)) {
		    		loaded = fs.readFileSync(comment_path);
		    		video_info[id]["comment"] = loaded
		    	}

		    	vidid_path = vidid_dir + "/" + id
		    	person_id = fs.readFileSync(vidid_path);
		    	video_info[id]["pid"] = person_id

		    }

	    	res.render('index.html', { 
	    		title: "Home", 
	    		video_info: video_info })
		});    		
	}
*/

    app.get('/',function(req,res){
    	res.render('index.html', { 
	    	title: "Visualization 1: Co-occurence Matrix" 
	    })
    });

    app.get('/vis2',function(req,res){
    	res.render('vis2.html', { 
	    	title: "Visualization 2" 
	    })
    });

    app.get('/vis3',function(req,res){
    	res.render('vis3.html', { 
	    	title: "Visualization 3" 
	    })
    });

    app.get('/vis4',function(req,res){
    	res.render('vis4.html', { 
	    	title: "Visualization 4" 
	    })
    });

    app.get('/vis5',function(req,res){
    	res.render('vis5.html', { 
	    	title: "Visualization 5" 
	    })
    });

    app.get('/vis6',function(req,res){
    	res.render('vis6.html', { 
	    	title: "Visualization 6" 
	    })
    });

}

