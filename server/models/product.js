const { Schema, model } = require("mongoose");

const productSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		price: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},

		quantity: {
			type: Number,
			required: true,
			unique: true,

		},
		category: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
			required: true
		  }
	},
	{
		toJSON: {
			virtuals: true,
			getters: true,
		},
		id: false,
	}
);

productSchema.virtual("imageLength").get(function () {
    return this.image.length;
});

const Product = model("Product", productSchema);

module.exports = Product;
