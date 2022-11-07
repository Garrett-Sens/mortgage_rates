const Fred = require('fred-api');
const fred = new Fred(process.env.FRED_KEY);

// const mongoose = require('mongoose');
// const Category = require('../models/category');

// fred.getSeries({series_id: 'GNPCA'}, function(error, result) {
// 	console.log(result)
// });

// fred.getSeriesObservations({
// 	aggregation_method: 'avg',
// 	frequency: 'weth',
// 	limit: 100,
// 	observation_start: '2022-07-18',
// 	observation_end: '2022-07-25',
// 	series_id: 'MORTGAGE30US',
// 	file_type: 'json',
// }, function(error, result){
// 	console.log( 'Fred1' );
// 	console.log(result)
// });

// const url = "https://mortgageapi.zillow.com/getCurrentRates?partnerId=[your partnerId]&queries.1.propertyBucket.location.stateAbbreviation=WA&queries.1.propertyBucket.propertyValue=500000&queries.1.propertyBucket.loanAmount=400000";
// const url = "https://api.stlouisfed.org/fred/series/observations?series_id=MORTGAGE30US&limit=100&frequency=weth&aggregation_method=avg&observation_start=2022-01-01&observation_end=2022-07-25&api_key=81f55ba49398734ff8d41db450786518";

module.exports = fred;
