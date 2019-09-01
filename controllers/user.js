var UserCollection = require('../models/user').user;


User.prototype.checkuserNameExists = checkuserNameExists;
function checkuserNameExists(req,res, next){
    var userName = req.query?req.query.userName:req.body.userName;

    if(userName){
        UserCollection.findOne({userName:userName}).lean().exec(function(err,user){
            if(user && user.userName){
                console.log("userName Found!");
            } else{
                console.log("userName not Found!");
            }
            next();
        });
    } else {
        next();
        console.log("no params found for querying");
    }
}
function User() {}
User.prototype.findusernamebyuserNameandPassword = function(data,callback){
    if(User){
        UserCollection.findOne({userName:data.userName,password:data.password}).exec(function(err,user){
            if(user && user.userName){
                console.log("user Found!");
            } else{
                console.log("user not Found!");
            }
        });
    } else {
        console.log("no params found for querying");
    }

}

function User() {}
User.prototype.storeUser = function(data,callback){

    var userObj = new UserCollection({
        userName: data.userName,
        fullname: data.fullname,
        emailid: data.emailid,
        password: data.password,
        mobile: data.mobile,
        registeredDate: new Date()

    })



userObj.save(function(err,result){
    if(err){
        console.log("Something went wrong");
        result = "Something went wrong while saving the user"
    }

    callback(err,result)
});

}

module.exports = User;