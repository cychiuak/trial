const Authentication = (function() {
    // This stores the current signed-in user
    let user = null;

    // This function gets the signed-in user
    const getUser = function() {
        return user;
    }

    // This function sends a sign-in request to the server
    // * `username`  - The username for the sign-in
    // * `password`  - The password of the user
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const signin = function(username, password, onSuccess, onError) {

        //
        // A. Preparing the user data
        //
        const data = {username:username,password:password};
        //
        // B. Sending the AJAX request to the server
        //
        fetch("/signin",{
            method:"POST",
            headers:{"Content-type":"application/json"},
            body: JSON.stringify(data)
        })
        .then((response)=> response.json())
        .then((result)=>{
            console.log("result is",result);
            //console.log(getUser());
            console.log("resutlt.status is",result.status);
            
            if(result.status == "success"){
                user = JSON.parse(result.user);
                onSuccess();
                
            }
            
            else if(result.status == "error"){
                console.log(" result.status == error is called");
                onError(result.error); 
            }
            
            /*console.log("success");
            if(onError){onError(result.error);}
            (onSuccess){onSuccess()}*/
            
        }).catch((error)=>{
            console.log("error");
        })
        //
        // F. Processing any error returned by the server
        //

        //
        // H. Handling the success response from the server
        //

        // Delete when appropriate
        //if (onError) onError("This function is not yet implemented.");
    };

    // This function sends a validate request to the server
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const validate = function(onSuccess, onError) {

        //
        // A. Sending the AJAX request to the server
        //
        fetch("/validate")
            .then((response) => response.json())
            .then((data) => {
                if (data.status == "success") {
                    console.log(data);
                    user = data.user;
                    console.log(user);
                    onSuccess();
                }
                else if(data.status == "error"){
                    onError(data.error);
                    return ;
                }
            })
            .catch((error) => {
                console.log(error);
            });
        
        //
        // C. Processing any error returned by the server
        //

        //
        // E. Handling the success response from the server
        //

        // Delete when appropriate
        //if (onError) onError("This function is not yet implemented.");
    };

    // This function sends a sign-out request to the server
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const signout = function(onSuccess, onError) {
        fetch("/signout")
        .then((response) => response.json())
        .then((data) => {
            user = null;
            onSuccess();
            //window.location.reload();
            //onError("signed out");
        })
        .catch((error) => {
            console.log(error);
        });
        // Delete when appropriate
        //if (onError) onError("This function is not yet implemented.");
    };

    return { getUser, signin, validate, signout };
})();
