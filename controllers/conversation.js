var ConversationCollection = require('../models/conversation').conversation;

//Notice how the constructors or the class name starts with an uppercase letter.
//Thats the best practice.

function Conversation() {}
Conversation.prototype.getallConversations = function(callback){
    ConversationCollection.find().exec(function(err,result){
        callback(err,result);
    });
}
Conversation.prototype.getallConversationsForUser=function(userName,callback){
    ConversationCollection.find({userName:userName}).exec(function(err,result){
        callback(err,result);
    })
}

function Conversation() {}
Conversation.prototype.storeConversation = function(data,callback){

    var conversationObj = new ConversationCollection({
        userName: data.userName,
        fullname: data.fullname,
        emailid: data.emailid,
        password: data.password,
        registeredDate: new Date()

    })


conversationObj.save(function(err,result){
    if(err){
        console.log("Something went wrong");
        result = "Something went wrong while saving the user"
    }

    callback(err,result)
});

}

Conversation.prototype.getallConversationscount=function(callback){

    var aggregationPipeline = [
        {
            $project: {
                text: 1,
                date: 1,
                month:{ $month: "$date"}
            }
        },
       
    ]
    ConversationCollection
    .aggregate(aggregationPipeline)
    .exec(function(err,result){
        callback(err,result);
    })
}

Conversation.prototype.getallConversationsbymonth=function(date,callback){

    var aggregationPipeline = [
        {
            $match:{
                date:{$gte:new Date(date)}
            }
        },
        {
            $project: {
                text: 1,
                date: 1,
                month:{ $month: "$date"},
                year:{ $year:"$date"}
            }
        },
        {
            $group: {
                _id :{
                    month:"$month",
                    year: "$year"

                } ,
                totalmesseges: {$sum: 1},
                messeges: {
                    $push:{
                        text:"$text",
                        date:"$date"
                    } 
                }
            }
          }
       
    ]
    ConversationCollection
    .aggregate(aggregationPipeline)
    .exec(function(err,result){
        callback(err,result);
    })
}

Conversation.prototype.getallConversationsbymonthpush=function(date,callback){

    var aggregationPipeline = [];

    var findquery={
        $match:{
            date:{$gte:new Date(date)}
        }
    }
    var projection ={
        $project: {
            text: 1,
            date: 1,
            month:{ $month: "$date"},
            year:{ $year:"$date"}
        }
    }
    var group = {
        $group: {
            _id :{
                month:"$month",
                year: "$year"

            } ,
            totalmesseges: {$sum: 1},
            messeges: {
                $push:{
                    text:"$text",
                    date:"$date"
                } 
            }
        }
      }
    if(date){
        aggregationPipeline.push(findquery);
    }
    aggregationPipeline.push(projection)
    aggregationPipeline.push(group)


    ConversationCollection
    .aggregate(aggregationPipeline)
    .exec(function(err,result){
        callback(err,result);
    })
}

Conversation.prototype.updateUserName=function(oldUserName,newUserName,callback){
    ConversationCollection
    .update({userName:oldUserName},{$set:{userName:newUserName}},{multi:true})
     
    .exec(function(err,result){
        callback(err,result);
    })
}
Conversation.prototype.searchConversationsForUser=function(userName,searchStr,callback){

    console.log(typeof userName);
    console.log(typeof callback);


    ConversationCollection.find({
        userName:userName,
        text:new RegExp(searchStr,"i")
    }) 
    .exec(function(err,result){
        callback(err,result);
    })
}

Conversation.prototype.searchConversationsForUserWithDate=function(userName,searchStr,date,callback){

    ConversationCollection.find({
        userName:userName,
        text:new RegExp(searchStr,"i"),
        date:{$gte: new Date(date)}
    }) 
    .exec(function(err,result){
        callback(err,result);
    })
}

Conversation.prototype.getallConversationsafterdate=function(date,callback){

    ConversationCollection.find({
        date:{$gte: new Date(date)}
    }) 
    .exec(function(err,result){
        callback(err,result);
    })
}
Conversation.prototype.searchConversationsForUserBetweenDates=function(userName,searchStr,date1,date2,callback){
 console.log(date1,date2);
    ConversationCollection.find({
        userName:userName,
        text:new RegExp(searchStr,"i"),
        date1:{$gte: new Date(date1)},
        date2:{$lte: new Date(date2)}
    })
    .exec(function(err,result){
        callback(err,result);
    })
}
Conversation.prototype.storeConversation = function(data,callback){
    //Observe how we are referencing the Conversatoon Schema 
    // to create the conversation object before storing it.
    //  This ensures all the properties are filled in as required;
    
    var conversationObj = new ConversationCollection({
        userName: data.UserName,
        text: data.text,
        date1: new Date(),
        date2: new Date()
    });

    
    conversationObj.save(function(err,result){
        if(err){
            console.log("Something went wrong");
            result = "Something went wrong while saving the conversation"
        }

        callback(err,result)
    });

}

module.exports = Conversation;

//module.exports is the object that's actually returned as the result of a require call.