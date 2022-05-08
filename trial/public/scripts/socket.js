const Socket = (function() {
    // This stores the current Socket.IO socket
    let socket = null;
    //let persontyping = 0;
    // This function gets the socket from the module
    const getSocket = function() {
        return socket;
    };

    // This function connects the server and initializes the socket
    const connect = function() {
        socket = io();

        // Wait for the socket to connect successfully
        socket.on("connect", () => {
            // Get the online user list

            socket.emit("get users");
        });

        // Set up the users event
        socket.on("users", (onlineUsers) => {
            onlineUsers = JSON.parse(onlineUsers);

            // Show the online users
            OnlineUsersPanel.update(onlineUsers);
        });

        // Set up the add user event
        socket.on("add user", (user) => {
            user = JSON.parse(user);

            // Add the online user
            OnlineUsersPanel.addUser(user);
        });

        // Set up the remove user event
        socket.on("remove user", (user) => {
            user = JSON.parse(user);

            // Remove the online user
            OnlineUsersPanel.removeUser(user);
        });

        let prevtimeout = null;
        socket.on("persontyping",(username) => {
            if(prevtimeout){clearTimeout(prevtimeout);}
            typingdisplay.usertyping(username);
            console.log(typingdisplay.gettimeout());
            console.log(typingdisplay.getusername());
            prevtimeout = typingdisplay.gettimeout();
            //display the person
        });
    };

    // This function disconnects the socket from the server
    const disconnect = function() {
        socket.disconnect();
        socket = null;
    };

    return { getSocket, connect, disconnect};
})();
