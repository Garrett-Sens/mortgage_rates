const fred = require('./fred'); // local "fred.js" file
const Category = require('../models/category');

// get all categories from FRED
fred.getCategory({}, function(error, result){
	console.log( 'FRED Category' );
	console.log( result );
	result.categories.forEach(category => {
		// search mongodb for category with the same id
		Category.find({id : category.id}, (err, matches) => {
			if (err) return handleError(err);
			console.log( matches );

			// insert missing categories from fred into mongo database
			if( !matches )
			{
				Category.create({
					id: category.id,
					name: category.name,
					parentId: category.parent_id
				}, function (err, model) {
					console.log( model );
					if(err)
					{
						console.error( err );
					}
					// saved!
				});
			}
		});
	});
});

// get all categories from mongodb
Category.find((err, categories) => {
	if (err) return handleError(err);
	console.log( categories );

	// check if FRED still has that category
	categories.forEach(category => {
		fred.getCategory({id : category.id}, function(error, result){
			console.log( categories );

			// delete categories from mongodb that are no longer in FRED
			if( !result.categories )
			{
				Category.deleteOne({id: category.id});
			}
		});
	});
});