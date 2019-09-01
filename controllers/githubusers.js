var githubusersCollection = require('../models/githubusers').githubusers;
var http = require('http');





function githubusers() {}
githubusers.prototype.downloadgithubusers = function(data,callback){
    var options = {
        host: 'api.github.com',
        path:'https://api.github.com/users',
        method: {'user-agent': 'node.js'}
    }

    

    var githubusersObj = new githubusersCollection({
        
    })




githubusersObj.save(function(err,result){
    if(err){
        console.log("Something went wrong");
        result = "Something went wrong while saving the githubusers"
    }

    callback(err,result)
});

}

module.exports = githubusers;