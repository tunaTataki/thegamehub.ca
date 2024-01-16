// /var/www/html/bytebloom.tech/express/public/js/store.js

// Cart items
let cart = [];

document.addEventListener("DOMContentLoaded", function () {
    const openSidebarMenu = document.querySelector("#openSidebarMenu");
    const overlay = document.querySelector("#overlay");
    const addToCartButtons = document.querySelectorAll("button.add-to-cart");
    const cartButton = document.querySelector("#cart");
    const cartOverlay = document.querySelector("#cart-overlay");
    const cartOverlayCloseButton = document.querySelector("button.close");
    /* --- Stripe --- */
    const checkoutButton = document.querySelector("button.checkout");

    // Close slide-menu on refresh
    if(openSidebarMenu.checked == true) {
        openSidebarMenu.checked = false; 
    }

    // Event listener for the menu toggle checkbox
    openSidebarMenu.addEventListener("change", function() {
        if (this.checked) {
            // Menu is open, show the overlay
            overlay.style.display = "block";
        } else {
            // Menu is closed, hide the overlay
            overlay.style.display = "none";
        }
    });

    // Event listener for clicks on the overlay (outside the slide menu)
    overlay.addEventListener("click", function() {
        // Close the menu when clicking outside
        openSidebarMenu.checked = false;
        overlay.style.display = "none";
    });

    // Loop for adding IDs to all the products
    for(let i = 0; i < addToCartButtons.length; i++) {
        cart.push([0, i]); // Pre-load cart array with arrays
        addToCartButtons[i].classList.add("" + i); // Just use string template?
    }

    // Event listener for adding products to cart, loop for each button on page
    for(let i = 0; i < addToCartButtons.length; i++) {
        addToCartButtons[i].addEventListener("click", function() {
            cart[i][0]++; // Array property legend: quantity, item ID
        });
    }

    // Event listener for showing and hiding the cart overlay
    cartButton.addEventListener("click", function() {
        if(cartOverlay.classList.contains("hidden")) {
            cartOverlay.classList.remove("hidden");
            cartOverlay.classList.add("flex-cart");
        } else {
            cartOverlay.classList.remove("flex-cart"); // Order seems important here
            cartOverlay.classList.add("hidden");
        }
    });

    // Event listener for the cart overlay's close button
    cartOverlayCloseButton.addEventListener("click", function() {
        cartOverlay.classList.add("hidden");
    });

    // Test if cookies are disabled, might need a more robust solution
    if(document.cookie.length === 0) {
        window.alert("Cookies seem to be disabled.\nYour shopping cart might not work correctly.\n\nTo ensure no errors occur,\nplease enable cookies in your browser settings.\n\nThank you!"); 
    }

    // Event listener for creating a Stripe checkout API call
    checkoutButton.addEventListener("click", function() {
        fetch("/createCheckoutSession", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ /* cart data */ }), // <-- should be comma?
        })
        .then(function() {
            window.alert(" Non-network Error"); 
        })
        .catch(function() {
            window.alert("Network Error.");
        });
    });
});







// The shame pit






/* 
    fetch("/api/disabledCookies", {
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

}
*/
