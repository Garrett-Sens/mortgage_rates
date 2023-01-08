const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
	id: {
		// type: Schema.Types.ObjectId,
		type: Number,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true,
		unique: true
		// ref: "id"
		// maxLength: 100
		// enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    	// default: Date.now,
    	// default: "Maintenance",
	},
	parent_id: {
		type: Number,
		required: true
	},
});

// // Virtual for author's full name
// AuthorSchema.virtual("name").get(function () {
// 	// To avoid errors in cases where an author does not have either a family name or first name
// 	// We want to make sure we handle the exception by returning an empty string for that case
// 	let fullname = "";
// 	if (this.first_name && this.family_name) {
// 	  fullname = `${this.family_name}, ${this.first_name}`;
// 	}
// 	if (!this.first_name || !this.family_name) {
// 	  fullname = "";
// 	}
// 	return fullname;
//   });

// // Virtual for bookinstance's URL
// BookInstanceSchema.virtual("url").get(function () {
// 	// We don't use an arrow function as we'll need the this object
// 	return `/catalog/bookinstance/${this._id}`;
//   });

module.exports = mongoose.model("Category", CategorySchema);
