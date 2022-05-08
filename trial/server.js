const express = require("express");

const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

// Create the Express app
const app = express();

//lab6
const onlineUsers = {};
const availableUsers ={};

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

const { createServer } = require("http");
const { Server } = require("socket.io");
const { SocketAddress } = require("net");
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

io.on("connection", (socket) => {
    // Add a new user to the online user list
    //console.log("outside the if statement",onlineUsers);
    //console.log("Outside the if statement",socket.request.session.name);
    if(socket.request.session.name){
        console.log("socket.request.session.name",socket.request.session.name);
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

    socket.on("get users", () => {
        

        socket.emit("users",JSON.stringify(onlineUsers));
        console.log("in get user function the online user is",onlineUsers);
        console.log("get users");
        // Send the online users to the browser
        
    });
    socket.on("disconnect", () => {
        // Remove the user from the online user list
        const username = socket.request.session.name;
        console.log("disconnect",username);
        const remove_user = {username:username};
        console.log("remove_user is ",remove_user);
        io.emit("remove user", JSON.stringify(remove_user));
        //delete onlineUsers["cychiuak"];
        delete onlineUsers[username];
        
        console.log(onlineUsers);
    });


    
});

// Use a web server to listen at port 8000
httpServer.listen(8000, () => {
    console.log("The game server has started...");
});
