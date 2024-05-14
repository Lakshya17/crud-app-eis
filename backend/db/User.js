const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    gender: String,
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    selectedCountry: String,
    selectedState: String,
    selectedCity: String,
    zipCode: Number,
    checkedItems: Array,
    image: String
})


UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

UserSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
};

    
module.exports = mongoose.model('users', UserSchema);