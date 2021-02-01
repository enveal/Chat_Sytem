const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content : String,
    name:String,
},{
    timestampS:true,
});

module.exports = mongoose.model('Message', messageSchema);