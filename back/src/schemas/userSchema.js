const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    doc: String,
    phone: String,
    recieve_sms: Boolean,
    recieve_email: Boolean,
    recieve_call: Boolean,
    show_sensitive_data: Boolean,
    term_accept: Boolean,
    term_accept_version: Number,
    created_at: Date,
    updated_at: Date
});
                                
module.exports = mongoose.model('Users', UserSchema);