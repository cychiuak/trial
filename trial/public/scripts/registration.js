const Registration = (function() {
    // This function sends a register request to the server
    // * `username`  - The username for the sign-in
    // * `name`      - The name of the user
    // * `password`  - The password of the user
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const register = function(username, name, password, onSuccess, onError) {

        //
        // A. Preparing the user data
        //
        const data = {username:username,name:name,password:password};
        //
        // B. Sending the AJAX request to the server
        console.log("the username in the browser side is",username,"end");
        //
        fetch("/register",{
            method:"POST",
            headers:{"Content-type":"application/json"},
            body: JSON.stringify(data)
        })
        .then((response)=> response.json())
        .then((result)=>{
            console.log(result);
            console.log("success");
            if(result.success == true){
                console.log("hihihi");
                onSuccess();
            }
            else if(result.status == "error"){
                console.log("hihihi");
                onError(result.error);
            }

            
        }).catch((error)=>{
            console.log("error");
        })
        //
        // F. Processing any error returned by the server
        //

        //
        // J. Handling the success response from the server
        //
 
        // Delete when appropriate
        //if (onError) onError("This function is not yet implemented.");
    };

    return { register };
})();
