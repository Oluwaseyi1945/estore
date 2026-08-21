document.addEventListener("DOMContentLoaded", function () {

    const searchInput =
        document.getElementById("product-search");

    const searchButton =
        document.getElementById("search-button");

    const searchResults =
        document.getElementById("search-results");


    let products = [];


    // ==========================================
    // LOAD PRODUCTS FROM SAME API
    // ==========================================

    async function loadProducts() {

        try {

            const response =
                await fetch("https://dummyjson.com/products");

            if (!response.ok) {
                throw new Error("Unable to load products");
            }

            const data =
                await response.json();

            products = data.products;

            console.log(
                "SEARCH PRODUCTS:",
                products
            );

        }

        catch (error) {

            console.error(
                "Product API Error:",
                error
            );

        }

    }


    // ==========================================
    // SEARCH PRODUCTS
    // ==========================================

    function searchProducts() {

        const keyword =
            searchInput.value
                .trim()
                .toLowerCase();


        searchResults.innerHTML = "";


        // Nothing typed
        if (!keyword) {

            searchResults.style.display =
                "none";

            return;

        }


        // ======================================
        // FILTER PRODUCTS
        // ======================================

        const filteredProducts =
            products.filter(product => {

                return (

                    product.title
                        ?.toLowerCase()
                        .includes(keyword)

                    ||

                    product.description
                        ?.toLowerCase()
                        .includes(keyword)

                    ||

                    product.category
                        ?.toLowerCase()
                        .includes(keyword)

                    ||

                    product.brand
                        ?.toLowerCase()
                        .includes(keyword)

                );

            });


        // ======================================
        // NO RESULTS
        // ======================================

        if (filteredProducts.length === 0) {

            searchResults.innerHTML = `

                <div class="no-results">

                    No products found for
                    "<strong>${keyword}</strong>"

                </div>

            `;

            searchResults.style.display =
                "block";

            return;

        }


        // ======================================
        // SHOW PRODUCTS
        // ======================================

        filteredProducts
            .slice(0, 8)
            .forEach(product => {

                const productItem =
                    document.createElement("a");


                productItem.className =
                    "search-product";


                // Product details page

                productItem.href =
                    `/product-details/?id=${product.id}`;


                productItem.innerHTML = `

                    <div class="search-product-image">

                        <img
                            src="${product.thumbnail}"
                            alt="${product.title}"
                        >

                    </div>


                    <div class="search-product-info">

                        <strong>
                            ${product.title}
                        </strong>


                        <span>
                            ₦${Number(
                                product.price
                            ).toLocaleString()}
                        </span>


                    </div>

                `;


                searchResults.appendChild(
                    productItem
                );

            });


        // Show dropdown

        searchResults.style.display =
            "block";

    }


    // ==========================================
    // SEARCH AS USER TYPES
    // ==========================================

    searchInput.addEventListener(
        "input",
        searchProducts
    );


    // ==========================================
    // SEARCH BUTTON
    // ==========================================

    searchButton.addEventListener(
        "click",
        function () {

            searchProducts();

        }
    );


    // ==========================================
    // ENTER KEY
    // ==========================================

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                searchProducts();

            }

        }
    );


    // ==========================================
    // CLOSE SEARCH DROPDOWN
    // ==========================================

    document.addEventListener(
        "click",
        function (event) {

            if (
                !event.target.closest(
                    ".search-container"
                )
            ) {

                searchResults.style.display =
                    "none";

            }

        }
    );


    // ==========================================
    // START
    // ==========================================

    loadProducts();

});