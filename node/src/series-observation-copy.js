const FredCopy = require('./fred-copy');

/**
 * @class SeriesObservationCopy
 * @constructor
 * @param {Object} fred An instance of the fred-api class
 * @param {Object} Model The Mongoose schema
 */
class SeriesObservationCopy extends FredCopy
{
	constructor(Model, fred, fredGetMethod, endpoint, primaryKey = 'id', series_id)
	{
		super(Model, fred, fredGetMethod, endpoint, primaryKey);
		this.series_id = series_id;
		this.where = {
			'series_id' : series_id
		};
	}

	modifyApiData(apiData)
	{
		let apiDataModified = [];
		for(const apiModelData of apiData)
		{
			// console.log(apiModelData)
			apiModelData.series_id = this.series_id;
			apiDataModified.push(apiModelData);
		}
		return apiDataModified;
	}
}

module.exports = SeriesObservationCopy;