(function () {
    var mongoose = require('../node_modules/mongoose')
      , Schema = mongoose.Schema
      , githubusersSchema = new Schema({
        login: {type: String,required:true},
        id: {type: String,required:true},
        node_id: {type: String,required:true},
        avatar_url: {type: String,required:true},
        url: {type: String,required:true},
        type: {type: String,required:true},
        site_admin: {type: String,required:true},
    })
    exports.githubusers = mongoose.model('githubusers', githubusersSchema, 'githubusers');
}).call(this);
