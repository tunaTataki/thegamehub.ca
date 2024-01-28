// /var/www/html/bytebloom.tech/express/public/js/store.js

// Cart items
let cart = [];

function centsToDollars(cents) {
    // Make sure that cents is a number
    if (typeof cents !== 'number') {
        throw new Error('Input must be a number representing cents.');
    }

    // Convert cents to dollars and round to two decimal places
    const dollars = (cents / 100).toFixed(2);

    return dollars;
}

document.addEventListener("DOMContentLoaded", function () {
    const openSidebarMenu = document.querySelector("#openSidebarMenu");
    const overlay = document.querySelector("#overlay");
    const addToCartButtons = document.querySelectorAll("button.add-to-cart");
    const cartButton = document.querySelector("#cart");
    const cartOverlay = document.querySelector("#cart-overlay");
    const cartOverlayCloseButton = document.querySelector("button.close");

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
        cartOverlay.classList.add("hidden");
    });

    // Loop for adding IDs to all the products, dynamically changes with # of products
    for(let i = 0; i < addToCartButtons.length; i++) {
        cart.push([0, i]); // Pre-load cart array with arrays, product ID is added as index
        addToCartButtons[i].classList.add("" + i); // Adding product ID as element class
    }

    // Event listener for adding products to cart, loop for each button on page, flash checkmark
    for(let i = 0; i < addToCartButtons.length; i++) {
        addToCartButtons[i].addEventListener("click", function() {
            cart[i][0]++; // Inner arrays property legend: quantity, item ID

            // Flash checkmark
            const checkmark = document.querySelectorAll(".checkmark")[i];
            checkmark.classList.toggle("hidden");
            setTimeout(function() { checkmark.classList.toggle("hidden"); }, "500");

            // API call to update server-side cart session
            fetch("/push-cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "cart": cart, }),
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
            .catch(function(error) {
                console.error("Bigg Error: ", error);
            });
        });
    }

    // Event listener for showing and hiding the cart overlay
    cartButton.addEventListener("click", function() {
        updateCartOverlay(); // Order important here?

        if(cartOverlay.classList.contains("hidden")) {
            cartOverlay.classList.remove("hidden");
            cartOverlay.classList.add("flex-cart");
        } else {
/*          cartOverlay.classList.remove("flex-cart"); */ // Unused?
            cartOverlay.classList.add("hidden");
        }
    });

    // Event listener for the cart overlay's close button
    cartOverlayCloseButton.addEventListener("click", function() {
        cartOverlay.classList.add("hidden");
    });

    // Used by "updateCartOverlay" function below
    function createCartOverlayItem(quantity, productId) {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-overlay-item');

        const itemName = document.createElement('span');
        itemName.textContent = `Product ID: ${productId}, Quantity: ${quantity}`;
        cartItem.appendChild(itemName);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add("cart-item-delete");
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            // Remove the corresponding cart item element from the DOM
            cartItem.remove();
            cart[productId][0] = 0;

            // Sync database cart when cart items are deleted
            fetch("/push-cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "cart": cart, }),
            })
            .then(function(res) {
                // Check if the response is okay; if not, throw an error
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                // Parse the response body as JSON and return a promise
                return res.json();
            })
            .then(function(parsedData) {
                // Handle the parsed data from the JSON response
                console.log(parsedData);
            })
            .catch(function(error) {
                console.error("Bigg Error: ", error);
            });
        });
        cartItem.appendChild(deleteButton);

        return cartItem;
    }

    // Used in Event Listener for opening the cart overlay
    function updateCartOverlay() {
        const cartContent = document.querySelector("div.cart-items-container");

        cartContent.innerHTML = "";

        for(let i = 0; i < cart.length; i++) {
            if(cart[i][0] > 0) {
                const quantity = cart[i][0];
                const productId = cart[i][1];

                const cartItem = createCartOverlayItem(quantity, productId);
                cartContent.appendChild(cartItem);
            }
        }

        // Empty cart
        if(cartContent.childElementCount === 0) {
            const emptyCartMessage = document.createElement('div'); // Create "Empty cart" div and span
            emptyCartMessage.classList.add('cart-overlay-item');

            const message = document.createElement('span');
            message.textContent = `Nothing yet!`;
            emptyCartMessage.appendChild(message);

            message.classList.add("empty-message");

            cartContent.appendChild(emptyCartMessage);

            document.querySelector("button.checkout").disabled = true; // Also disable checkout button
        }
    }
});

// Send request to /pull-cart, fetch existing cart for unique user, also pulls items
fetch("/pull-cart", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(cart), // Unused in /pull-cart
})
.then(function(res) {
    return res.json();
})
.then(function(data) { // The magic, populate store products with live data from Stripe's dashboard
    console.log(data);

    // Postgresql query check
    if(!data.postgresResult.hasOwnProperty("POST /pull-cart: ")) { // Row matched
        cart = data.postgresResult.cart_contents;
    } else {
        console.log(data.postgresResult);
    }

    // Stripe API call check
    if(!data.stripeProducts.hasOwnProperty("error") && !data.stripePrices.hasOwnProperty("error")) {
        // Successful API calls

        // Arrays of elements to substitute
        let images = document.querySelectorAll("img.item-image");
        let titles = document.querySelectorAll("h2.item-title");
        let prices = document.querySelectorAll("h3.item-price");
        let descriptions = document.querySelectorAll("p.item-description");

        // This needs to be re-written to generate whole store items
        for(let i = 0; i < data.stripeProducts.data.length; i++) {
            images[i].src = data.stripeProducts.data[i].images[0];
            titles[i].textContent = data.stripeProducts.data[i].name;
            const dollars = centsToDollars(data.stripePrices.data[i].unit_amount);
            prices[i].textContent = `CAD $ ${dollars}`; // centsToDollars only accepts a number
            descriptions[i].textContent = data.stripeProducts.data[i].description;
        }
    } else {
        // Unsuccessful API calls
        console.log(`Logged from else clause of API call check, in fetch(\"pull-cart\"), stripePrices & stripeProducts:\n${data.stripePrices}\n${data.stripeProducts}`);
    }
})
.catch(function(error) {
    console.error(`Logged from .catch() in fetch(\"/pull-cart\"), error: ${error}`);
});
