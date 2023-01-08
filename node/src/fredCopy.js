/**
 * @class FredCopy
 * @constructor
 * @param {Object} fred An instance of the fred-api class
 * @param {Object} Model The Mongoose schema
 */
FredCopy = function(Model, fred, fredGetMethod, endpoint)
{
    'use strict';
    this.Model = Model;
	this.fred = fred;
	this.fredGetMethod = fredGetMethod;
	this.endpoint = endpoint;
};

// sync api to database and database to api
FredCopy.prototype.sync = function()
{
	const sync = this; // meaning of "this" changes below
	this.getDataMaps().then(function(data)
	{
		const apiDataMap = data.api;
		const databaseDataMap = data.database;

		// console.log(apiDataMap);

		sync.insertUpdateFredData(apiDataMap, databaseDataMap);
		sync.deleteOldFredData(apiDataMap, databaseDataMap);
	});
}

FredCopy.prototype.getDataMaps = function()
{
	return Promise.all(
		[
			this.getApiDataMap(),
			this.getDatabaseDataMap()
		]
	).then(function(data, error)
	{
		if(error)
		{
			throw new Error(error);
		}

		return {
			'api' : data[0],
			'database' : data[1]
		};
	});
}

// convert api JSON to map
FredCopy.prototype.getApiDataMap = function()
{
	const apiDataMap = {};
	return this.getApiData().then(function(apiData)
	{
		for(const apiModelData of apiData)
		{
			apiDataMap[apiModelData.id] = apiModelData;
		}

		return apiDataMap;
	});
}

// get data for this model from FRED API
FredCopy.prototype.getApiData = function()
{
	const fred = this.fred;
	const fredGetMethod = this.fredGetMethod;
	const endpoint = this.endpoint;

	return new Promise(
		function(resolve, reject)
		{
			fredGetMethod.call(fred, {}, function(error, result){
				if(error)
				{
					return reject(error);
				}
				return resolve(result[endpoint]);
			});
		}
	);
}

// convert database JSON to map
FredCopy.prototype.getDatabaseDataMap = function()
{
	const databaseDataMap = {};
	return this.getDatabaseData().then(function(databaseData)
	{
		for(const databaseModelData of databaseData)
		{
			databaseDataMap[databaseModelData.id] = databaseModelData;
		}

		return databaseDataMap;
	});
}

// get database data for this model
FredCopy.prototype.getDatabaseData = function()
{
	const Model = this.Model;

	return new Promise(
		function(resolve, reject)
		{
			Model.find((error, result) => {
				if(error)
				{
					return reject(error);
				}
				return resolve(result);
			});
		}
	);
}

// insert new FRED data into Mongo db
FredCopy.prototype.insertUpdateFredData = function(apiDataMap, databaseDataMap)
{
	const scope = this;
	const Model = this.Model;

	// iterate over IDs in API data
	for(apiDataId in apiDataMap)
	{
		if(!apiDataMap.hasOwnProperty(apiDataId))
		{
			continue;
		}

		const apiModelData = apiDataMap[apiDataId];

		// if the database has data with that ID, then update it
		if(apiDataId in databaseDataMap)
		{
			Model.updateOne({id: apiDataId}, apiModelData, function(error, apiModel) {
				// console.log(apiModel);
				if(error)
				{
					scope.handleDatabaseError(error, {
						'apiDataId': apiDataId,
						'apiModelData': apiModelData
					});
				}
				// saved!
			});
		}
		// if not, add that data to the database
		else
		{
			Model.create(apiModelData, function(error, apiModel) {
				// console.log(apiModel);
				if(error)
				{
					scope.handleDatabaseError(error, {
						'apiDataId': apiDataId,
						'apiModelData': apiModelData
					});
				}
				// saved!
			});
		}
	}
}

// delete Mongo db data that is no longer in FRED
FredCopy.prototype.deleteOldFredData = function(apiDataMap, databaseDataMap)
{
	const Model = this.Model;

	// iterate over IDs in database data
	for(databaseModelId in databaseDataMap)
	{
		if(!databaseDataMap.hasOwnProperty(databaseModelId))
		{
			continue;
		}

		// if the API no longer has a model with this ID, then delete that data from the database
		if(!databaseModelId in apiDataMap)
		{
			Model.deleteOne({id: databaseModelData.id});
		}
	}
}

// delete Mongo db data that is no longer in FRED
FredCopy.prototype.clear = function()
{
	const Model = this.Model;
	Model.deleteMany();
}

// delete Mongo db data that is no longer in FRED
FredCopy.prototype.handleDatabaseError = function(error, data)
{
	console.log(data);
	throw new Error(error);
}

module.exports = FredCopy;
