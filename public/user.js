const User = function(theuser){
    let user = theuser;
    const getUser = function(){
        return user;
    }
    const setUser = function(theuser){
        user = theuser;
    }
    return {getUser,setUser};
}