const mongoose = require('mongoose');

const HistoricSchema = new mongoose.Schema({
    user_id: String,
    term_version_accept: String,
    created_at: Date,
    conditions_accept: Array
});
                                
module.exports = mongoose.model('Historic', HistoricSchema);