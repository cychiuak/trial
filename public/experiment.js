const experiment = (function() {
    // This stores the current signed-in user
    let user = null;
    const setUser = function(user1){
        user = user1;
    }
    // This function gets the signed-in user
    const getUser = function() {
        return user;
    }
    return { getUser,setUser };
})();