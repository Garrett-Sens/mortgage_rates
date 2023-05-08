/**
 * @class FredCopy
 * @constructor
 * @param {Object} fredApi An instance of the fred-api class
 * @param {Object} Model The Mongoose schema
 */
class FredCopy
{
	constructor(Model, fredApi, fredGetMethod, endpoint, primaryKey = 'id')
	{
		this.Model = Model;
		this.fredApi = fredApi;
		this.fredGetMethod = fredGetMethod;
		this.endpoint = endpoint;
		this.primaryKey = primaryKey;
		this.where = {};
	}

	// sync api to database and database to api
	async sync()
	{
		console.log("sync: ");
		const scope = this; // meaning of "this" changes inside "then" below
		let data = await this.getDataMaps();
		const apiDataMap = data.api;
		const databaseDataMap = data.database;
		console.log("sync: " + Object.keys(apiDataMap).length + " objects in api map");
		console.log("sync: " + Object.keys(databaseDataMap).length + " objects in database map");
		// console.log(apiDataMap);
		
		scope.insertUpdateFredData(apiDataMap, databaseDataMap);

		// const databaseData = await this.getDatabaseData();
		// console.log(databaseData.length + " objects in database");

		// databaseDataMap = await scope.getDatabaseDataMap();
		// console.log(Object.keys(databaseDataMap).length + " objects in database map after insertUpdateFredData");

		// scope.deleteOldFredData(apiDataMap, databaseDataMap);

		// databaseDataMap = scope.getDatabaseDataMap();
		// console.log(Object.keys(databaseDataMap).length + " objects in database map after deleteOldFredData");

		// console.log(Object.keys(databaseDataMap).length + " objects in database map after sync"); // @todo this seems to be printing before syncing is finished
	}

	async getDataMaps()
	{
		console.log("getDataMaps: ");
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
		console.log("getApiDataMap: ");
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
	async getApiData(where)
	{
		console.log("getApiData: ");
		const scope = this;

		return new Promise(
			function(resolve, reject)
			{
				scope.fredGetMethod.call(scope.fredApi, where, function(error, result)
				{
					// console.log(result);
					if(error)
					{
						return reject(error);
					}

					if(result[scope.endpoint])
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
		console.log("getDatabaseDataMap: "); // Docker Desktop logs are not in order. Not my fault. 
		const databaseDataMap = {};
		const databaseData = await this.getDatabaseData();
		console.log("getDatabaseDataMap: " + databaseData.length + " objects in database");
		for(const databaseModelData of databaseData)
		{
			databaseDataMap[databaseModelData[this.primaryKey]] = databaseModelData;
		}
		return databaseDataMap;
	}

	// get database data for this model
	async getDatabaseData()
	{
		console.log("getDatabaseData: ");
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
	async insertUpdateFredData(apiDataMap, databaseDataMap)
	{
		console.log("insertUpdateFredData: ");
		const scope = this;
		const Model = this.Model;

		// iterate over IDs in API data
		console.log("insertUpdateFredData: " + Object.keys(databaseDataMap).length + " objects in database map before FOR");
		console.log("insertUpdateFredData: " + Object.keys(apiDataMap).length + " objects in api map before FOR");
		let i = 1;
		for(const apiDataId in apiDataMap)
		{
			// temp
			if(i > 100)
			{
				break;
			}

			console.log(apiDataId);
			if(!apiDataMap.hasOwnProperty(apiDataId))
			{
				console.log("Skipping: " + apiDataId);
				i++;
				continue;
			}

			const apiModelData = apiDataMap[apiDataId];

			console.log(apiDataId + " exists in database? " + (apiDataId in databaseDataMap));

			// if the database has data with that ID, then update it
			if(apiDataId in databaseDataMap)
			{
				console.log("Updating: " + apiDataId);
				Model.updateOne({id: apiDataId}, apiModelData, function(error, apiModel) {
					// console.log(apiModel);
					if(error)
					{
						console.error(error);
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
				console.log("Creating: " + apiDataId);
				Model.create(apiModelData, function(error, apiModel) {
					// console.log(apiModel);
					if(error)
					{
						console.error(error);
						scope.handleDatabaseError(error, {
							'apiDataId': apiDataId,
							'apiModelData': apiModelData
						});
					}
					// saved!
				});
			}

			i++;

			// temp
			const databaseData = await this.getDatabaseData();
			console.log("i: " + i);
			console.log("getDatabaseDataMap: " + databaseData.length + " objects in database");
		}
	}

	// delete Mongo db data that is no longer in FRED
	deleteOldFredData(apiDataMap, databaseDataMap)
	{
		console.log("deleteOldFredData: ");
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

	// delete Mongo db data
	async clear()
	{
		console.log("clear: ");
		const scope = this;
		const Model = this.Model;
		let response = await Model.deleteMany(this.where);
		let databaseDataMap = await scope.getDatabaseDataMap();
		console.log(Object.keys(databaseDataMap).length + " objects in database map after clear");
		return response;
	}

	// delete Mongo db data that is no longer in FRED
	handleDatabaseError(error, data)
	{
		console.error(data);
		throw new Error(error);
	}
}

module.exports = FredCopy;
