(function () {
    var mongoose = require('../node_modules/mongoose')
      , Schema = mongoose.Schema
      , userSchema = new Schema({
        userName: {type: String,required:true},
        fullname: {type: String,required:true},
        emailid: {type: String,required:true},
        password: {type: String,required:true},
        mobile: {type: String,required:true},
        registeredDate: {type: Date,required:true}
    })
    exports.user = mongoose.model('user', userSchema, 'user');
}).call(this);
