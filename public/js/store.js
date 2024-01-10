// /var/www/html/bytebloom.tech/express/public/js/store.js

// Cart items
let cart = [];

// Event handlers that add items to the cart
const addToCartButtons = document.querySelectorAll("div.add-to-cart");
for(i = 0; i < addToCartButtons.length; i++) {
    addToCartButtons[i].addEventListener("click", function() {
        // clean up header, add sliding side menu 
    });
}

// Test if cookies are disabled
if(document.cookie.length === 0) {

    window.alert("Cookies seem to be disabled.\nYour shopping cart might not work correctly.\n\nTo ensure no errors occur,\nplease enable cookies in your browser settings.\n\nThank you!"); 

// Don't need?
/* 
    fetch("/api/disabledCookies" {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "cookiesDisabled": "true", "page": "/store",  });
    })
    .then(function() {
        window.alert("Cookies seem to be disabled.\nYour shopping cart might not work correctly.\n\nTo ensure no errors occur,\nplease enable cookies in your browser settings.\n\nThank you!"); 
    })
    .catch(function() {
        window.alert("Network Error.");
    });
*/

}
