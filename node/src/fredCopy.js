/**
 * @class FredCopy
 * @constructor
 * @param {Object} fred An instance of the fred-api class
 * @param {Object} Model The Mongoose schema
 */
class FredCopy
{
	constructor(Model, fred, fredGetMethod, where = {}, endpoint)
	{
		this.Model = Model;
		this.fred = fred;
		this.fredGetMethod = fredGetMethod;
		this.where = where;
		this.endpoint = endpoint;
	}

	// sync api to database and database to api
	sync()
	{
		const scope = this; // meaning of "this" changes below
		this.getDataMaps().then(function(data)
		{
			const apiDataMap = data.api;
			const databaseDataMap = data.database;

			// console.log(apiDataMap);
			// console.log(databaseDataMap);

			// scope.insertUpdateFredData(apiDataMap, databaseDataMap);
			// scope.deleteOldFredData(apiDataMap, databaseDataMap);
		});
	}

	async getDataMaps()
	{
		const scope = this;
		try {
			const data = await Promise.all(
				[
					this.getApiDataMap(scope.where),
					this.getDatabaseDataMap()
				]
			);
			return {
				'api': data[0],
				'database': data[1]
			};
		} catch (err) {
			console.error(err);
			if(err.status && err.message) {
				throw new Error(err.status + ", " + err.message);
			}
			throw new Error(err);
		}
	}

	// convert api JSON to map
	async getApiDataMap()
	{
		const apiDataMap = {};
		const apiData = await this.getApiData(this.where);
		console.log(apiData);
		for(const apiModelData of apiData)
		{
			apiDataMap[apiModelData.id] = apiModelData;
		}
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
					console.log(result);
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
		);
	}

	// convert database JSON to map
	async getDatabaseDataMap()
	{
		const databaseDataMap = {};
		const databaseData = await this.getDatabaseData();
		for(const databaseModelData of databaseData)
		{
			databaseDataMap[databaseModelData.id] = databaseModelData;
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
		);
	}

	// insert new FRED data into Mongo db
	insertUpdateFredData(apiDataMap, databaseDataMap)
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
	deleteOldFredData(apiDataMap, databaseDataMap)
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
	clear()
	{
		const Model = this.Model;
		Model.deleteMany();
	}

	// delete Mongo db data that is no longer in FRED
	handleDatabaseError(error, data)
	{
		console.error(data);
		throw new Error(error);
	}
}

module.exports = FredCopy;
