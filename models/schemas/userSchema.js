import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number},
    address: {
        street: String,
        city: String,
        zipcode: String,
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    files: [{ size: Number }] // size in MB
});



// Create a virtual property `fullName` with a getter and setter.
userSchema.virtual('fullName').
    get(function () { return `${this.firstName} ${this.lastName}`; })
    .set(function (v) {
        // `v` is the value being set, so use the value to set
        // `firstName` and `lastName`.
        const firstName = v.substring(0, v.indexOf(' '));
        const lastName = v.substring(v.indexOf(' ') + 1);
        this.set({ firstName, lastName });
    });


// Virtual to calculate total storage used
userSchema.virtual('totalStorageUsed').get(function () {
    return this.files.reduce((total, file) => total + file.size, 0);
});

// Usage
// const user = new User({ files: [{ size: 5 }, { size: 10 }, { size: 15 }] });
// console.log(user.totalStorageUsed); // Output: 30 (MB)



// Virtual to generate profile URL
userSchema.virtual('profileUrl').get(function () {
    return `/users/${this.username}`;
});

// Usage
// const user = new User({ username: 'john_doe' });
// console.log(user.profileUrl); // Output: "/users/john_doe"


export default userSchema