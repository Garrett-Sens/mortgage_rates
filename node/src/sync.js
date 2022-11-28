/**
 * @class Sync
 * @constructor
 * @param {Object} Model The Mongoose schema
 */
Sync = function(Model) {
    'use strict';
    this.Model = Model;
};

// get all models from FRED
Sync.prototype.apiWithDatabase = function( apiModels )
{
	apiModels.forEach(apiModel => {
		// search mongodb for model with the same id
		this.Model.find({id : apiModel.id}, (err, matches) => {
			if (err) return handleError(err);
			console.log( matches );

			// insert missing models from fred into mongo database
			if( !matches.length )
			{
				this.Model.create(apiModel, function (err, apiModel) {
					console.log( apiModel );
					if(err)
					{
						console.error( err );
					}
					// saved!
				});
			}
		});
	});
}

// get all models from mongodb
Sync.prototype.databaseWithApi = function( databaseModels )
{
	this.Model.find((err, apiModels) => {
		if (err) return handleError(err);
		console.log( apiModels );

		databaseModels.forEach(databaseModel => {
			// check if FRED still has that model
			fred.getCategory({id : model.id}, function(error, result){
				console.log( result.categories );

				// delete model from mongodb that is no longer in FRED
				if( !result.categories.length )
				{
					this.Model.deleteOne({id: model.id});
				}
			});
		});
	});
}

module.exports = Sync;
