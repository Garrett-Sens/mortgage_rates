/**
 * @class Sync
 * @constructor
 * @param {Object} fred An instance of the fred-api class
 * @param {Object} Model The Mongoose schema
 */
Sync = function(fred, Model, fredMethodName, endpoint)
{
    'use strict';
    this.Model = Model;
	this.fred = fred;
	this.fredMethodName = fredMethodName;
	this.endpoint = endpoint;
};

// get data for this model from FRED API
Sync.prototype.getApiData = function()
{
	const fred = this.fred;
	const fredMethodName = this.fredMethodName;
	const endpoint = this.endpoint;

	return new Promise(
		function(resolve, reject)
		{
			fred[fredMethodName]({}, function(error, result){
				if(error)
				{
					return reject(error);
				}
				return resolve(result[endpoint]);
			});
		}
	);
}

// get database data for this model
Sync.prototype.getDatabaseData = function()
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

Sync.prototype.getSyncData = function()
{
	return Promise.all(
		[
			this.getApiData(),
			this.getDatabaseData()
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

Sync.prototype.sync = function()
{
	this.getSyncData().then(function(data)
	{
		const apiData = data.api;
		const databaseData = data.database;

		console.log(apiData);
		console.log(databaseData);

		this.syncApiWithDatabase(apiData, databaseData);
		this.syncDatabaseWithApi(databaseData, apiData);
	});
}

Sync.prototype.syncApiWithDatabase = function(apiData, databaseData)
{
	const Model = this.Model;

	apiData.forEach(apiModelData => {
		databaseData.forEach(databaseModelData => {
			if(apiModelData.id === databaseModelData.id)
			{
				return true;
			}
		});

		// add new API model to database
		Model.create(apiModelData, function(error, apiModel) {
			// console.log( apiModel );
			if(error)
			{
				throw new Error(error);
			}
			// saved!
		});
	});
}

// get all models from mongodb
Sync.prototype.syncDatabaseWithApi = function(databaseData, apiData)
{
	const Model = this.Model;

	databaseData.forEach(databaseModelData => {
		apiData.forEach(apiModelData => {
			if(databaseModelData.id === apiModelData.id)
			{
				return true;
			}
		});

		// delete model from mongodb that is no longer in FRED
		Model.deleteOne({id: databaseModel.id});
	});
}

module.exports = Sync;
