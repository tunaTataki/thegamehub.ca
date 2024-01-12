// /var/www/html/bytebloom.tech/express/public/js/index.js

document.addEventListener("DOMContentLoaded", function () {
    const openSidebarMenu = document.querySelector("#openSidebarMenu");
    const overlay = document.querySelector("#overlay");

    // Event listener for the menu toggle checkbox
    openSidebarMenu.addEventListener("change", function () {
        if (this.checked) {
        // Menu is open, show the overlay
        overlay.style.display = "block";
        } else {
        // Menu is closed, hide the overlay
        overlay.style.display = "none";
        }
    });

    // Event listener for clicks on the overlay (outside the menu)
    overlay.addEventListener("click", function () {
        // Close the menu when clicking outside
        openSidebarMenu.checked = false;
        overlay.style.display = "none";
    });
});
