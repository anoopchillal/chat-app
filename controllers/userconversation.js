var UserCollection = require('../models/user').user;
var ConversationCollection = require('../models/conversation').conversation;


function UserConversation() {}
UserConversation.prototype.getanalytics = function(callback){
    getuserData(function(err_user,users){
        getconversationData(function(err_conv,conversations){
            callback({
                err:null,
                result:combineData(users,conversations)
            });
        })
    })

}
function UserConversation() {}
UserConversation.prototype.getanalytics1= function(callback){
    getuserData(function(err_user,users){
        getconversationData(function(err_conv,conversations){
            callback({
                err:null,
                result:getHashMap(users,conversations)
            });
        })
    })

}
function UserConversation() {}
UserConversation.prototype.getanalytics2= function(callback){
    getuserData(function(err_user,users){
        getconversationData(function(err_conv,conversations){
            callback({
                err:null,
                result:combineDatausingforloop(users,conversations)
            });
        })
    })

}
function combineDatausingforloop(users,conversations){
    var data =[];

    users.forEach(function(user){
        var messeges =[];

    conversations.forEach(function(conv) {
       if (conv.userName == user.userName){
            messeges.push(conv)
           }
      
       });          
            data.push({
                "userName": user.userName,
                "fullname": user.fullname,
                "emailid": user.emailid,
                "password": user.password,
                "mobile":user.mobile,
                "registeredDate": user.registeredDate,
                messeges:messeges
        
            })
       
    })
    console.log(data.length)
    return data;

}
function getHashMap(users,conversations){
    var convHashMap ={};
    var userHashMap = {};
    conversations.forEach(function(el) {
        if(convHashMap[el.userName]){
            convHashMap[el.userName].push(el)
        } else{
            convHashMap[el.userName] = [el]

        }
        });

    users.forEach(function(el){

        if(userHashMap[el.userName]){
            userHashMap[el.userName].push(el)
        } else{
            userHashMap[el.userName] = [el]

        }
    });
    return{
        userHashMap:userHashMap,
        convHashMap:convHashMap
    }
}

    function getconversationData(callback){
    ConversationCollection.find().exec(callback)
       
    }

    function getuserData(callback){
        UserCollection.find().exec(callback)
           
        }

        function combineData(users,conversations){
            var data =[];
            var convHashMap = {};
            conversations.forEach(function(conv) {
                if(convHashMap[conv.UserName]){
                    convHashMap[conv.UserName].push(conv)
                } else{
                    convHashMap[conv.UserName] = [conv]
                }
                });

            users.forEach(function(user){

                console.log(user.UserName);

                if( convHashMap[conv.UserName]){
                    data.push({
                        "UserName": user.UserName,
                        "fullname": user.fullname,
                        "emailid": user.emailid,
                        "password": user.password,
                        "mobile":user.mobile,
                        "registeredDate": user.registeredDate,
                        messeges:convHashMap[user.UserName]
                
                    })
                } else{
                    data.push({
                        "UserName": user.UserName,
                        "fullname": user.fullname,
                        "emailid": user.emailid,
                        "password": user.password,
                        "mobile":user.mobile,
                        "registeredDate": user.registeredDate,
                        messeges:[]
                })
            }
            })
            return data;
        }
        
        module.exports = UserConversation;