import mongoose from "mongoose";

let Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    tags: [String],
    stock: { type: Number, required: true },
    discount: { type: Number, default: 0 }
});


// Virtual to calculate the discounted price
productSchema.virtual('discountedPrice')
    .get(function () {
        return this.price * ((100 - this.discount) / 100);
    });


// Usage
// const product = new productsCollection({ name: "Laptop", price: 1000, discount: 10 });
// console.log(product.discountedPrice); // Output: 900



export default productSchema;
