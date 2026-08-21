document.addEventListener("DOMContentLoaded", function () {

    const filterButtons =
        document.querySelectorAll(".filter-btn");


    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            /* Get category from data-filter */

            const category =
                button.getAttribute("data-filter");


            console.log(
                "Category clicked:",
                category
            );


            /* Remove active from all buttons */

            filterButtons.forEach(function (btn) {

                btn.classList.remove("active");

            });


            /* Add active to clicked button */

            button.classList.add("active");


            /* Load selected category */

            loadProducts(category);

        });

    });

});