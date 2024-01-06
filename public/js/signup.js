// /home/nick/projects/theGameHub.Express/js/signup.js

function sanitize_inputs(email, password) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^.{6,20}$/;

    if(emailRegex.test(email) && passwordRegex.test(password)) {
        return true;
    }

    return false;
}

function send_to_server(data) {

    fetch("http://localhost:3000/signupRequest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => {

        // Check if the response is okay; if not, throw an error
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the response body as JSON and return a promise
        return response.json();
    })
    .then(parsedData => {

        // Handle the parsed data from the JSON response
        console.log(parsedData);
    })
    .catch(error => {

        // Handle any errors that occurred during the fetch operation
        console.error('Error:', error);
    });
}

document.querySelector("#signup-button").addEventListener("click", function(e) {

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    if(!sanitize_inputs(email, password)) {
        // Fail state if user enters improper email || password format
        // TODO
        console.log("Sanitization failed.")
    }

    send_to_server({email: email, password: password,});
    console.log("Request sent to server.")

});
