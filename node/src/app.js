// docker run -p 80:8080 -d --name node-dev -itv "/home/garrett/programming/mortgage_releases/node:/usr/src/app" --network network-dev garrettsens/mortgage 
// docker run -d -p 27017:27017 --name mongo-dev --network network-dev mongo:latest

// to run the server, run 

	// node src/app.js

// from the web_server directory, or

	// nodemon src/app.js -e "js, hbs"

// if you don't want to stop and restart it every time you make changes
// the "-e js, hbs" part tells nodemon to restart every time a file with those extensions is saved

// console.logs from this file are shown in terminal, not browser

// 
// LIBRARIES
// 

'use strict';

const express = require('express');
const path = require('path'); // file paths
let hbs = require('express-hbs');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
let extend = require('handlebars-extend-block');
require('./console-override.js'); // adds file and line number to console output

// 
// ENVIRONMENT
// 

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';

// 
// DATABASE
// 

// const DB_HOST = process.env.DB_HOST || '0.0.0.0';
const DB_HOST = process.env.DB_HOST || 'mongo-dev';
// const APP_PORT = process.env.APP_PORT || 8080;
const DB_PORT = process.env.DB_PORT || 27017;
const DB_URL = `${DB_HOST}:${DB_PORT}`;
// console.log( DB_URL );
mongoose.connect('mongodb://' + DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}); //Set up default mongoose connection
const db = mongoose.connection; //Get the default connection
db.on('error', console.error.bind(console, 'MongoDB connection error:')); //Bind connection to error event (to get notification of connection errors)

//
// FRED API
//

// require('./sync-categories.js');

//
// FRED API
//
// require('./sync-categories.js');
require('./fred-copy').default; // syncs FRED categories with mongo db

const fredApi = require('./fred-api'); // "./" means "local file"
const FredCopy = require('./fred-copy');

//
// sync Categories
//

// const Category = require('../models/category');
// let categoryCopy = new FredCopy(Category, fredApi, fredApi.getCategory, 'categories');
// categoryCopy.clear();
// categoryCopy.sync();

// const CategoryChild = require('../models/category_child');
// let categoryChildCopy = new FredCopy(CategoryChild, fredApi, fredApi.getCategoryChildren, 'categories');
// categoryChildCopy.clear();
// categoryChildCopy.sync();

// const Series = require('../models/series');
// let seriesCopy = new FredCopy(Series, fredApi, fredApi.getSeries, {
// 	series_id: "MORTGAGE30US"
// }, 'seriess');
// seriesCopy.sync();

// const SeriesObservationCopy = require('./series-observation-copy');
// const SeriesObservation = require('../models/series_observation');
// let seriesObservationCopy = new SeriesObservationCopy(
// 	SeriesObservation, // Model
// 	fredApi, // FRED library instance
// 	fredApi.getSeriesObservations, // fredGetMethod
// 	'observations', // api endpoint
// 	'date', // primaryKey
// 	'MORTGAGE30US' // series_id
// );
// await seriesObservationCopy.clear();
// await seriesObservationCopy.sync();

//
// sync Releases
//

// const Release = require('../models/release');
// let releaseSync = new FredCopy(Release, fred, fred.getReleases, 'releases');
// releaseSync.clear();
// releaseSync.sync();

// 
// APP
// 

// const APP_PORT = 8080;
// const APP_PORT = process.env.APP_PORT || 8080;
// const APP_HOST = '0.0.0.0';
const APP_HOST = process.env.APP_HOST || '0.0.0.0';
// const APP_PORT = process.env.APP_PORT || 8080;
const APP_PORT = process.env.APP_PORT || 8080;
const app = express();

const pathPublicDirectory = path.join( __dirname, '../public' );
const pathViews = path.join( __dirname, '../views' );
const pathLayouts = path.join( __dirname, '../views/layouts' );
const pathPartials = path.join( __dirname, '../views/partials' );
// console.log( pathLayouts );

app.set('views', pathViews); // if you don't want to name your templates directory the default "views", then you have to add this line
app.engine('hbs', hbs.express4({
	// extname: '.hbs',
	defaultLayout: pathLayouts + '/layout.hbs',
	layoutsDir: pathLayouts,
	partialsDir: pathPartials
	// helpers: {
	// 	json: (context) => JSON.stringify(context) // allows you to use {{{json ...}}} helper in view to print JSON
	// }
}));
// hbs.registerPartials( pathPartials ); // point hbs to partials dir
hbs.registerHelper('json', (context) => JSON.stringify(context));

app.set('view engine', 'hbs'); // point express to handlebars, a templating engine
app.use( express.static( pathPublicDirectory ) ); // this makes the public directory the web root. all pages inside public can now be accessed from the root url

hbs = extend(hbs);

// 
// ROUTES 
// 

const indexRouter = require('../routes/index');
const seriesRouter = require('../routes/series');
const seriesObservationsRouter = require('../routes/series_observations');
const releasesRouter = require('../routes/releases');
const categoriesRouter = require('../routes/categories');
const { hasUncaughtExceptionCaptureCallback } = require('process');
// …
app.use('/', indexRouter);
app.use('/series', seriesRouter);
app.use('/series_observations', seriesObservationsRouter);
app.use('/releases', releasesRouter);
app.use('/categories', categoriesRouter);

app.get( '*', function( req, res ) // match anything that hasn't been matched so far
	{
		// res.render(
		// 	'404',
		// 	{
		// 		title: '404',
		// 		// name: 'Garrett Sens',
		// 		errorMessage: 'Page not found'
		// 	}
		// );
		// console.log( req );
		res.send( "404 Page not found" );
	}
);

// 
// SERVE 
// 

app.listen(APP_PORT, APP_HOST, function(error)
{
	if(error)
	{
		console.error(error);
	}

	console.log(`Running on http://${APP_HOST}:${APP_PORT}`); // console.log output appears in terminal after running "npm run dev"
});
