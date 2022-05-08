const express = require("express");

const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");
let pairing = null;
// Create the Express app
const app = express();
let user1;
let user2;
//lab6
const onlineUsers = {};
const availableUsers = {};
let user1button;
let user2button;

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

const { createServer } = require("http");
const { Server } = require("socket.io");
const { SocketAddress } = require("net");
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const httpServer = createServer(app);
const io = new Server(httpServer);
// Use the session middleware to maintain sessions
const chatSession = session({
    secret: "game",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 300000 }
});
app.use(chatSession);

io.use((socket, next) => {
    chatSession(socket.request, {}, next);
});
// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}

// Handle the /register endpoint
app.post("/register", (req, res) => {
    // Get the JSON data from the body
    const { username, name, password } = req.body;
    console.log("username is", username,"end");
    //
    // D. Reading the users.json file
    //
    if(!username){
        res.json({ status: "error",error: "username can't be empty" });
        return;
    }
    if(!name){
        res.json({ status: "error",error: "name can't be empty" });
        return;
    }
    if(!password){
        res.json({ status: "error",error: "password can't be empty" });
        return;
    }

    const users = JSON.parse(fs.readFileSync("data/users.json"));
    //console.log("why is it not showing?");
    //console.log("1234",users);
    if(users[username]){
        //console.log(username);
        res.json({ status: "error",error: "User already exists." });
        return;
    }
    //
    // E. Checking for the user data correctness
    //
    console.log("suername[0] is",username[0]);
    for(let i=0;i<username.length;i++){
        if(username[i] == " "){
            res.json({ status: "error",error: "username should contain words and char only" });
            return;
        }
    }
    if(!containWordCharsOnly(username)){
        res.json({ status: "error",error: "username should contain words and char only" });
        return;
    }
    if(!containWordCharsOnly(name)){
        res.json({ status: "error",error: "name should contain words and char only" });
        return;
    }
    if(!containWordCharsOnly(password)){
        res.json({ status: "error",error: "password  should contain words and char only" });
        return;
    }
    //
    // G. Adding the new user account
    //
    
    const password1 = bcrypt.hashSync(password, 10);
    users[username] = {username:username,name:name,password:password1};
    fs.writeFileSync("data/users.json",JSON.stringify(users,null," "));
    res.json({success:true})
    //
    // H. Saving the users.json file
    //

    //
    // I. Sending a success response to the browser
    //

    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
    // Get the JSON data from the body
    const { username, password } = req.body;

    //
    // D. Reading the users.json file
    //
    const users = JSON.parse(fs.readFileSync("data/users.json"));
    //
    // E. Checking for username/password
    //
    if(!(username in users)){
        res.json({ status: "error",error: "user doesn't exist" });
        return;
    }

    const hashedpassword = users[username].password;
    //console.log(users[username].name);
    //console.log(users[username].password);
    //console.log(hashedpassword);
    //console.log(bcrypt.compareSync(password, hashedpassword));
    if (!bcrypt.compareSync(password, hashedpassword)) {
        res.json({ status: "error",error: "wrong password" });
        return;
    }
    //
    // G. Sending a success response with the user account
    //
    const name = users[username].name;
    const user2 = {username:username,name:name}
    req.session.name = username;
    //console.log(req.session.name);
    res.json({ status: "success", user: JSON.stringify(user2)/* the user object */ });
    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {

    //
    // B. Getting req.session.user
    //
    
    const users = JSON.parse(fs.readFileSync("data/users.json"));

    
    if (req.session.name){
        const username = req.session.name;
        const name = users[username].name;
        console.log("in validate",req.session.name,username,name);
        res.json({ status:"success",user:{username: username,name:name} });
    }
    else
        res.json({ status: "error",error:"An error has occured"});
    //
    // D. Sending a success response with the user account
    //
 
    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /signout endpoint
app.get("/signout", (req, res) => {

    //
    // Deleting req.session.user
    //
    const name = req.session.name;
    console.log(name);
    if (req.session.name)
        delete req.session.name;
    res.json({ status:"success" });
    //
    // Sending a success response
    //
 
    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented." });
});


//
// ***** Please insert your Lab 6 code here *****
//
let userobject;
let users = new Map();
let opponents = new Map();
let opponents2 = [];
let numopponent2 = 0;
let userarray = [];
let userlength = 0;
let ready_queue = []; //using for users who press Ready Button
let lock = 0;
let lock2 = 0;
let lock3 = 0;
io.on("connection", (socket) => {
    // Add a new user to the online user list
    //console.log("outside the if statement",onlineUsers);
    //console.log("Outside the if statement",socket.request.session.name);
    if(socket.request.session.name){
        //console.log("socket.request.session.name",socket.request.session.name);
        const username = socket.request.session.name;
        const users = JSON.parse(fs.readFileSync("data/users.json"));
        const currentuser = {name:users[username].name};
        onlineUsers[username] = currentuser;
        const currentuser_tobesent =  {username:username,name:users[username].name};
        io.emit("add user", JSON.stringify(currentuser_tobesent));
        
        //console.log(currentuser);
        //onlineUsers.push(socket.request.session.user);
        //console.log("added something",onlineUsers);
    }
    socket.on("signinuser",()=>{
        userobject = {username:socket.request.session.name,socketid:socket.id};
        // for(let i = 0;i<userlength;i++){
        //     if( userarray[i]){
        //         if(!userarray[i].username){
        //         userarray.splice(i,1);
        //         userlength--;
        //         continue;}
        //
        //     if(userarray[i].username == socket.request.session.name){
        //         userarray.splice(i,1);
        //         userlength--;
        //     }}
        // }
        //hi
        // userarray.push(userobject);
        // userlength++;
        users.set(socket.request.session.name, socket.id);
        //console.log(userarray)
        //console.log("signing user with socket.request.session.name %s",socket.request.session.name);
        socket.emit("curuser",JSON.stringify(socket.request.session.name));
    });
    socket.on("getopponent",(username) => {
        //TODO what happens when userlength==1?
        if(!ready_queue.includes(username))
            ready_queue.push(username);
        // let index;
        // for(let j=0;j<userlength;j++){
        //     if(userarray[j]){
        //     if(userarray[j].username == socket.request.session.name){
        //         index =j;
        //     }
        // }
        // }
        if(ready_queue.length >=2) {
            io.to(users.get(ready_queue[0])).emit("returnopponent", ready_queue[1]);
            io.to(users.get(ready_queue[1])).emit("returnopponent", ready_queue[0]);
            io.to(users.get(ready_queue[0])).emit("getposition","1");
            io.to(users.get(ready_queue[1])).emit("getposition","2");
            /*let opponentdatas = {username: ready_queue[0],opponent:ready_queue[1],position:"P1"};
            opponents2.push(opponentdatas);
            opponentdatas = {username: ready_queue[1],opponent:ready_queue[0],position:"P2"};
            opponents2.push(opponentdatas);
            numopponent2 = numopponent2 + 2;*/
            opponents.set(ready_queue[0], ready_queue[1]);
            opponents.set(ready_queue[1], ready_queue[0]);
            ready_queue.splice(0,2);
        }
        // for(let i=0;i<userlength;i++){
        //     if(userarray[i]){
        //     if(userarray[i].username != socket.request.session.name){
        //         //TODO maintain socketid in server.js not in finale
        //         socket.emit("returnopponent",userarray[i].socketid);
        //         io.to(userarray[i].socketid).emit("returnopponent",userarray[index].socketid);
        //         userarray.splice(i,1);
        //         userarray.splice(index,1);
        //         break;
        //     }
        // }
        // }
    });
    socket.on("sendhi",(opponentid)=>{
        io.to(opponentid).emit("hi",opponentid);
    });
    socket.on("get users", () => {
        

        socket.emit("users",JSON.stringify(onlineUsers));
        //console.log("in get user function the online user is",onlineUsers);
        //console.log("get users");
        // Send the online users to the browser
        
    });
    /*socket.on("setplayer1", (user) => {
        
        user1 = JSON.parse(user);
        io.emit("user1",JSON.stringify(user1));
        console.log("in set player1 the user1 is",user1);
        console.log("get users");
        // Send the online users to the browser
        
    });
    socket.on("setplayer2", (user) => {
        
        user2 = JSON.parse(user);
        io.emit("user2",JSON.stringify(user2));
        console.log("in set player2 the user2 is",user2);
        console.log("get users");
        // Send the online users to the browser
        
    });*/
    socket.on("user1 button",(button)=>{
        /*while(lock == 1){

        }
        lock = 1;*/
        let opponentname = opponents.get(socket.request.session.name);
        let username = opponents.get(opponentname);
        //console.log("opponent name is",opponentname);
        let opponentid = users.get(opponentname);
        let userid = users.get(username);
        //console.log("opponent id is", opponentid);
        //console.log(button);
        io.to(opponentid).emit("p1button",button);
        io.to(userid).emit("p1button",button);
        //lock = 0;
    });
    socket.on("user2 button",(button)=>{
        /*while(lock2 == 1){}
        lock2 = 1;*/
        let opponentname = opponents.get(socket.request.session.name);
        let username = opponents.get(opponentname);
        console.log("opponent name is",opponentname);
        let opponentid = users.get(opponentname);
        let userid = users.get(username);
        //console.log("opponent id is", opponentid);
        //console.log(button);
        io.to(opponentid).emit("p2button",button);
        io.to(userid).emit("p2button",button);
        //lock2 = 0;
    });
    
    socket.on("disconnect", () => {
        // Remove the user from the online user list
        const username = socket.request.session.name;
        //console.log("disconnect",username);
        io.to(users.get(opponents.get(username))).emit("opponent_gone");
        opponents.delete(opponents.get(username));
        opponents.delete(username);
        /*console.log("in disconnect, before delete,", opponents2);
        for(let i=0;i<numopponent2;i++){
            if(opponents2.username == username){
                opponents2.splice(i,1);
                numopponent2 = numopponent2 - 1;
            }
        }
        console.log("After delete",opponent2);*/
        users.delete(username);
        const remove_user = {username:username};
        //console.log("remove_user is ",remove_user);
        io.emit("remove user", JSON.stringify(remove_user));
        //delete onlineUsers["cychiuak"];
        delete onlineUsers[username];
        
        //console.log(onlineUsers);
    });
    socket.on("requestUFO",(cvWidth)=>{
        /*while(lock3 == 1){}
        lock3 = 1;*/
        let hi = JSON.parse(cvWidth);
        console.log("hi is",hi);
        let x = Math.floor(Math.random() * (parseInt(hi,10)-50))
        let opponentname = opponents.get(socket.request.session.name);
        let username = opponents.get(opponentname);
        //console.log("opponent name is",opponentname);
        let opponentid = users.get(opponentname);
        let userid = users.get(username);
        //console.log("opponent id is", opponentid);
        //console.log(button);
        console.log("UFOx is",x);
        io.to(opponentid).emit("UFOx",JSON.stringify(x));
        io.to(userid).emit("UFOx",JSON.stringify(x));
        //lock3 = 0;
    });
    
    // socket.on("pairing", (jsonuser) => {
    //     console.log("pairing");
    //
    //     let user = JSON.parse(jsonuser);
    //     console.log(user);
    //     if(!pairing){
    //         console.log("called pairing");
    //         user = pairing
    //         opponents = {opponent:null,successful:false};
    //         socket.emit("paired",JSON.stringify(opponents));
    //     }
    //
    //     else if(pairing == user){
    //         console.log("called pairing == user");
    //
    //         opponents = {opponent:null,successful:false};
    //         socket.emit("paired",JSON.stringify(opponents));
    //     }
    //     else{
    //         opponents = {opponent:pairing,successful:true};
    //         socket.emit("paired",JSON.stringify(opponents));
    //     }
    //
    // });


    
});

// Use a web server to listen at port 8000
httpServer.listen(8000, () => {
    console.log("The game server has started...");
});
