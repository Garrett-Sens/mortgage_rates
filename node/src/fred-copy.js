/**
 * @class FredCopy
 * @constructor
 * @param {Object} fred An instance of the fred-api class
 * @param {Object} Model The Mongoose schema
 */
class FredCopy
{
	constructor(Model, fred, fredGetMethod, endpoint, primaryKey = 'id')
	{
		this.Model = Model;
		this.fred = fred;
		this.fredGetMethod = fredGetMethod;
		this.endpoint = endpoint;
		this.primaryKey = primaryKey;
		this.where = {};
	}

	// sync api to database and database to api
	sync()
	{
		const scope = this; // meaning of "this" changes inside "then" below
		this.getDataMaps().then(function(data)
		{
			const apiDataMap = data.api;
			const databaseDataMap = data.database;

			// console.log(apiDataMap);
			console.log(Object.keys(apiDataMap).length + " objects in api");
			console.log(Object.keys(databaseDataMap).length + " objects in database before sync");

			scope.insertUpdateFredData(apiDataMap, databaseDataMap);
			scope.deleteOldFredData(apiDataMap, databaseDataMap);

			console.log(Object.keys(databaseDataMap).length + " objects in database after sync"); // @todo this seems to be printing before syncing is finished
		});
	}

	async getDataMaps()
	{
		const data = await Promise.all(
			[
				this.getApiDataMap(),
				this.getDatabaseDataMap()
			]
		);
		return {
			'api': data[0],
			'database': data[1]
		};
	}

	// convert api JSON to map
	async getApiDataMap()
	{
		const apiDataMap = {};
		const apiData = await this.getApiData(this.where);

		// console.log(apiData);
		for(const apiModelData of apiData)
		{
			// console.log(apiModelData)
			apiDataMap[apiModelData[this.primaryKey]] = apiModelData;
		}
		// console.log(apiDataMap);
		return apiDataMap;
	}

	// get data for this model from FRED API
	getApiData(where)
	{
		const scope = this;

		return new Promise(
			function(resolve, reject)
			{
				scope.fredGetMethod.call(scope.fred, where, function(error, result)
				{
					// console.log(result);
					if(error)
					{
						return reject(error);
					}

					if( result[scope.endpoint] )
					{
						return resolve(result[scope.endpoint]);
					}
					
					return resolve([result]);
				});
			}
		).then(function(apiData)
		{
			return scope.modifyApiData(apiData);
		}).catch(function(err)
		{
			console.error(err);
			if(err.status && err.message)
			{
				throw new Error(err.status + ", " + err.message);
			}
			throw new Error(err);
		});
	}

	modifyApiData(apiData)
	{
		return apiData;
	}

	// convert database JSON to map
	async getDatabaseDataMap()
	{
		const databaseDataMap = {};
		const databaseData = await this.getDatabaseData();
		for(const databaseModelData of databaseData)
		{
			databaseDataMap[databaseModelData[this.primaryKey]] = databaseModelData;
		}
		return databaseDataMap;
	}

	// get database data for this model
	getDatabaseData()
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
		).catch(function(err)
		{
			console.error(err);
			if(err.status && err.message)
			{
				throw new Error(err.status + ", " + err.message);
			}
			throw new Error(err);
		});
	}

	// insert new FRED data into Mongo db
	insertUpdateFredData(apiDataMap, databaseDataMap)
	{
		const scope = this;
		const Model = this.Model;

		// iterate over IDs in API data
		for(const apiDataId in apiDataMap)
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
	deleteOldFredData(apiDataMap, databaseDataMap)
	{
		const Model = this.Model;

		// iterate over IDs in database data
		for(const databaseModelId in databaseDataMap)
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
	clear()
	{
		const Model = this.Model;
		Model.deleteMany(this.where).then(function(data){
			console.log("Data deleted"); // Success
			console.log(data);
		}).catch(function(error){
			console.log(error); // Failure
		});
	}

	// delete Mongo db data that is no longer in FRED
	handleDatabaseError(error, data)
	{
		console.error(data);
		throw new Error(error);
	}
}

module.exports = FredCopy;
