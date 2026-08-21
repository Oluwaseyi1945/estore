document.addEventListener("DOMContentLoaded", function () {

    const categoriesList =
        document.getElementById("categories-list");

    const prevButton =
        document.querySelector(".category-prev");

    const nextButton =
        document.querySelector(".category-next");


    /* =========================
       LOAD CATEGORIES
    ========================= */

    async function loadCategories() {

        try {

            const response =
                await fetch(
                    "https://dummyjson.com/products/categories"
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP error: ${response.status}`
                );

            }


            const categories =
                await response.json();


            categoriesList.innerHTML = "";


            for (const category of categories) {

                const productResponse =
                    await fetch(
                        `https://dummyjson.com/products/category/${category.slug}?limit=1`
                    );


                const productData =
                    await productResponse.json();


                if (
                    !productData.products ||
                    productData.products.length === 0
                ) {
                    continue;
                }


                const product =
                    productData.products[0];


                /* CREATE CATEGORY CARD */

                const card =
                    document.createElement("a");


                card.classList.add(
                    "category-card"
                );


                card.href = "#";


                card.innerHTML = `

                    <div class="category-image">

                        <img
                            src="${product.thumbnail}"
                            alt="${category.name}"
                        >

                    </div>


                    <h3>
                        ${category.name}
                    </h3>


                    <p>
                        ${productData.total} Products
                    </p>

                `;


                /* =========================
                   CATEGORY CLICK
                ========================= */

                card.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();


                        console.log(
                            "Category clicked:",
                            category.name
                        );


                        console.log(
                            "Slug:",
                            category.slug
                        );


                        /*
                        Send category
                        to products.js
                        */

                        if (
                            typeof loadProducts ===
                            "function"
                        ) {

                            loadProducts(
                                category.slug
                            );

                        } else {

                            console.error(
                                "loadProducts() not found"
                            );

                        }

                    }
                );


                categoriesList.appendChild(
                    card
                );

            }


            startCarousel();


        } catch (error) {

            console.error(
                "Category error:",
                error
            );

        }

    }


    /* =========================
       CAROUSEL
    ========================= */

    function getScrollAmount() {

        const card =
            categoriesList.querySelector(
                ".category-card"
            );


        if (!card) {

            return 200;

        }


        return card.offsetWidth + 12;

    }


    function moveNext() {

        categoriesList.scrollBy({

            left:
                getScrollAmount(),

            behavior:
                "smooth"

        });

    }


    function movePrevious() {

        categoriesList.scrollBy({

            left:
                -getScrollAmount(),

            behavior:
                "smooth"

        });

    }


    /* =========================
       ARROWS
    ========================= */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            moveNext
        );

    }


    if (prevButton) {

        prevButton.addEventListener(
            "click",
            movePrevious
        );

    }


    /* =========================
       AUTO CAROUSEL
    ========================= */

    let carouselInterval;


    function startCarousel() {

        clearInterval(
            carouselInterval
        );


        carouselInterval =
            setInterval(function () {

                const maxScroll =
                    categoriesList.scrollWidth -
                    categoriesList.clientWidth;


                if (maxScroll <= 0) {

                    return;

                }


                if (
                    categoriesList.scrollLeft >=
                    maxScroll - 5
                ) {

                    categoriesList.scrollTo({

                        left: 0,

                        behavior: "smooth"

                    });

                } else {

                    moveNext();

                }

            }, 2500);

    }


    /* =========================
       START
    ========================= */

    loadCategories();

});