// to run the server, run 

	// node src/app.js

// from the web_server directory, or

	// nodemon src/app.js -e "js, hbs"

// if you don't want to stop and restart it every time you make changes
// the "-e js, hbs" part tells nodemon to restart every time a file with those extensions is saved

'use strict';

const express = require( 'express' );
const path = require( 'path' ); // file paths
const hbs = require( 'hbs' );
const dotenv = require('dotenv').config();
const fredData = require('./fred');


// Constants
// const PORT = 8080;
// const PORT = process.env.PORT || 8080;
// const HOST = '0.0.0.0';
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || '0.0.0.0';
// const PORT = process.env.PORT || 8080;
const PORT = process.env.PORT || 8080;

// App
const app = express();

const pathPublicDirectory = path.join( __dirname, '../public' );
const pathViews = path.join( __dirname, '../views' );
const pathPartials = path.join( __dirname, '../views/partials' );


app.set( 'view engine', 'hbs' ); // point express to handlebars, a templating engine
// app.set( 'views', pathViews ); // if you don't want to name your templates directory the default "views", then you have to add this line
app.use( express.static( pathPublicDirectory ) ); // this makes the public directory the web root. all pages inside public can now be accessed from the root url

hbs.registerPartials( pathPartials ); // point hbs to partials dir

// home page
app.get( '/', function( req, res )
	{
		res.render(
			'home', // web_server/views/home.hbs
			{
				fred_key: process.env.FRED_KEY,
				title: 'Home'
				// name: 'Garrett Sens'
				
			}
		); 
	}
);

// app.get('/test', (req, res) => {
// 	res.send('Hello World');
// });

// static html page. does not use Handlebars view engine from line 36
app.get( '/static', function( req, res )
	{
		res.sendFile(pathViews + '/static.html'); 
	}
);

app.get( '*', function( req, res ) // match anything that hasn't been matched so far
	{
		res.render(
			'404',
			{
				title: '404',
				// name: 'Garrett Sens',
				errorMessage: 'Page not found'
			}
		);
	}
);

app.listen(PORT, HOST, function(error)
{
	if(error)
	{
		console.error(error);
	}

	console.log(`Running on http://${HOST}:${PORT}`); // console.log output appears in terminal after running "npm run dev"
});

