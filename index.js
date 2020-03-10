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
