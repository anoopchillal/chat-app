const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const ConversationClass = require('./controllers/conversation.js');
const conversationObj = new ConversationClass();
const UserClass = require('./controllers/user');
const userObj = new UserClass();
const UserConversation = require('./controllers/userconversation');
const userconvObj = new UserConversation();
const githubusersClass = require('./controllers/githubusers');
const githubusersObj = new githubusersClass();

var cookieParser= require ('cookie-parser');
var session= require('express-session');

mongoose.connect("mongodb://localhost/chat-app?poolSize=100",{ useNewUrlParser: true },function(error){
    if(error){
        console.log("MongoDb connection failed");
        console.log(error);
    } else {
        console.log("MongoDb connection successful");
    }
});

app.use(bodyParser.json());
app.use(userObj.checkuserNameExists);

app.use(cookieParser());

app.use(session({
    key: 'user_abc',
    secret: 'asecretkey',
    resave: false,
    saveUninitialised: true
}));

function checkSession(req,res,next){
    if (req.session && req.session.user){
        return next();
    } else{
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
}

app.get('/download/github/users',checkSession,function(req, res) {
   
    userconvObj.DownloadgithubUsers(function(err,result){
        res.send({
            err:err,
            result:result,
        })
    })
    });
app.post('/login/user',function(req,res) { 
console.log(req.body);
    userObj.findusernamebyuserNameandPassword(req.body,function(err,user){
        console.log(user);
        if(!err && user){
            req.session.user = user.userName;
            res.send('/');
        } else{
            res.send("password and username did not match")
        }        
    })
    });
app.get('/login/user', function(req, res) {
    res.render('login.ejs');
});
app.get('/', function(req, res) {
    res.render('index.ejs');
});
app.get('/edit/UserName', function(req, res) {
    res.render('usersettings.ejs');
});

app.post('/get/downloadgithub', function(req, res) {
    console.log(req.body);

    githubusersObj.storegithubusers(req.body,function(err,result){
        res.send({
            err:err,
            result:result,
        })
    })
});

app.post('/save/UserName', function(req, res) {
    console.log(req.body);

    userObj.storeUser(req.body,function(err,result){
        res.send({
            err:err,
            result:result,
        })
    })
});

app.get('/get/all/analytics2', function(req, res) {
   
    userconvObj.getanalytics2(function(err,result){
        res.send({
            err:err,
            result:result,
        })
    })
    }); 

app.get('/get/all/analytics', function(req, res) {
   
    userconvObj.getanalytics(function(err,result){
        res.send({
            err:err,
            result:result,
        })
    })
    });
    app.get('/get/all/analytics1', function(req, res) {
   
        userconvObj.getanalytics1(function(err,result){
            res.send({
                err:err,
                result:result,
            })
        })
        });    
          
app.get('/get/all/messeges', function(req, res) {
   
conversationObj.getallConversations(function(err,data){
    res.send(data);
})
});

app.get('/get/all/messeges/count/username', function(req, res) {
   
    conversationObj.getallConversationscount(function(err,data){
        res.send(data);
    })
    });
    app.get('/get/all/messeges/count/username/monthname', function(req, res) {
   
        conversationObj.getallConversationsbymonth(req.query.date,function(err,data){

            var monthNames =["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

            data.forEach(function(el){
                el.month = monthNames[el._id.month-1]
                el.monthYear = monthNames[el._id.month-1]+" "+ el._id.year
                
            })
            res.send(data);
        })
        });
    
        app.get('/get/all/messeges/count/username/monthname/push', function(req, res) {
   
            conversationObj.getallConversationsbymonthpush(req.query.date,function(err,data){
    
                var monthNames =["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
    
                data.forEach(function(el){
                    el.month = monthNames[el._id.month-1]
                    el.monthYear = monthNames[el._id.month-1]+" "+ el._id.year
                    
                })
                res.send(data);
            })
            });
    app.get('/get/all/messeges/count/username/text', function(req, res) {
   
        conversationObj.getallConversationscounttext(function(err,data){
            res.send(data);
        })
        });
app.get('/get/messeges/count/by/user', function(req, res) {
   
    conversationObj.getallConversations(function(err,data){
        var result ={
        
        }
    if(!err && data && data.length>0){
        data.forEach(function(el,index){
            if (result[el.userName]){
                result[el.userName]++
            } else{
                result[el.userName] = 1
            };
            
        });
    }
        res.send(result);
    })
    });
    app.get('/get/all/messeges/count/by/user', function(req, res) {
   
        conversationObj.getallConversations(function(err,data){
            var result ={
            
            }
        if(!err && data && data.length>0){
            data.forEach(function(el,index){
                if (result[el.userName]){
                    result[el.userName].count++;
                    result[el.userName].messages.push(el)
                } else{
                    result[el.userName] = {
                        count: 1,
                        messages:[el]
                    }
                };
                
            });
        }
            res.send(result);
        })
        });
        app.get('/get/messeges/all/count/by/user', function(req, res) {

   
            conversationObj.getallConversations(function(err,data){
                var result ={}
                var date1 = req.query.date1;
                var date2 = req.query.date2;

            if(!err && data && data.length>0){
                data.forEach(function(el,index){
                    if (result[el.userName]){
                        if(new Date(el.date)>=new Date(date1) && new Date(el.date)<=new Date(date2)){
                        result[el.userName].count++;
                        result[el.userName].messages.push(el)
                        }
                    } else{
                        if(new Date(el.date)>=new Date(date1) && new Date(el.date)<=new Date(date2)){
                        result[el.userName] = {
                            count: 1,
                            messages:[el]
                        };
                        }
                    };
                    
                })
            }
                res.send(result);
            })
            });       
app.get('/get/all/messeges/for/user', function(req, res) {
    console.log("---req.query");
    console.log(req.query);

    conversationObj.getallConversationsForUser(req.query.userName,function(err,data){
        res.send(data);
    })

    })
    
app.get('/get/all/messeges/for/user/:id/:age/:place', function(req, res) {
    console.log("---req.params");
    console.log(req.params);

    conversationObj.getallConversationsForUser(req.query.userName,function(err,data){
        res.send(data);
    })

    })

    app.get('/get/messeges/all/after/date', function(req, res) {
        
        var date1 = req.query.date1;
   
        conversationObj.getallConversationsafterdate(date1,function(err,data){
            var result ={}
            
        if(!err && data && data.length>0){
            data.forEach(function(el,index){
                if (result[el.userName]){  
                    result[el.userName].count++;
                    result[el.userName].messages.push(el)
                    
                } else{                  
                    result[el.userName] = {
                        count: 1,
                        messages:[el]
                    };                    
                };
                
            })
        }
            res.send(result);
        })
        }); 

    app.get('/update/username', function(req, res) {

        var oldUserName = req.query.oldUserName;
        var newUserName = req.query.newUserName;
        
       console.log(req.query);
        conversationObj.updateUserName(oldUserName,newUserName,function(err,data){
            res.send(data);
        })
    
        })
        app.get('/search/all/messeges/for/user/:id', function(req, res) {

            var searchStr = req.query.searchStr;
            var userName = req.params.id;
            var date = req.query.date;
           
            conversationObj.searchConversationsForUserWithDate(userName,searchStr,date,function(err,data){
                res.send(data);
            })
        
            })    
        app.get('/search/all/messeges/for/user/between/:id', function(req, res) {

            var searchStr = req.query.searchStr;
            var userName = req.params.id;
            var date1 = req.query.date1;
            var date2 = req.query.date2;
            console.log(date1,date2);
            
           conversationObj.searchConversationsForUserBetweenDates(userName,searchStr,date1,date2,function(err,data){
                res.send(data);
            })
        
            })
        app.get('/search/all/messeges/for/user/:id', function(req, res) {

            var searchStr = req.query.searchStr;
            var userName = req.params.id;
           
            conversationObj.searchConversationsForUser(userName,searchStr,function(err,data){
                res.send(data);
            })
        
            })
            
io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', ' <i>' + socket.username + ' joined the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', ' <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        conversationObj.storeConversation({
            userName:socket.username,
            text:message
        },function(err,result){

        });
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});

const server = http.listen(7000, function() {
    console.log('listening on *:7000');
});