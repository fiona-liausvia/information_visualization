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
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.get('/',function(req,res){
	res.render('index.html', { 
    	title: "Visualization 1: Co-occurence Matrix" 
    })
});

app.get('/v2',function(req,res){
	res.render('vis2.html', { 
    	title: "Visualization 2: Conferences by Rank and Number of Papers Published" 
    })
});
