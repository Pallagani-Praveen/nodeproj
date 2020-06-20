const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:String,
    password:String,
    email:String,
    salt:String,
});

const envelopSchema = new Schema({
    username:String,
    toaddress:String,
    key:String,
    secretkey:String,
    salt:String
});

const contactSchema = new Schema({
    username:String,
    name:String,
    email:String,
    subject:String,
    message:String
});

userSchema.plugin(findOrCreate);

const User = mongoose.model('user',userSchema);
const Envelop = mongoose.model('envelop',envelopSchema);
const Contact = mongoose.model('contact',contactSchema);

module.exports = {
    User:User,
    Envelop:Envelop,
    Contact:Contact
}