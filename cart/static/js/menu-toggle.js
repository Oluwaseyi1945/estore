document.addEventListener("DOMContentLoaded", function () {

    const navbar = document.querySelector(".navbar");
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelectorAll(".nav-link");

    if (!navbar || !menuToggle) {
        return;
    }

    menuToggle.addEventListener("click", function () {

        const isOpen = navbar.classList.toggle("menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

    });


    // Close menu after clicking a link
    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navbar.classList.remove("menu-open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

});