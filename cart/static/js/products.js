document.addEventListener("DOMContentLoaded", function () {

    const productsContainer =
        document.getElementById("products-container");


    /* =========================
       CATEGORY MAP
    ========================= */

    const categoryMap = {

        all: null,

        clothing: "mens-shirts",

        accessories: "womens-jewellery",

        electronics: "laptops"

    };


    /* =========================
       LOAD PRODUCTS
    ========================= */

    window.loadProducts = async function (category = "all") {

        try {

            let url;


            /* ALL PRODUCTS */

            if (category === "all") {

                url =
                    "https://dummyjson.com/products?limit=8";

            }


            /* SPECIFIC CATEGORY */

            else {

                const apiCategory =
                    categoryMap[category];

                url =
                    `https://dummyjson.com/products/category/${apiCategory}?limit=8`;

            }


            console.log("Loading:", url);


            const response =
                await fetch(url);


            if (!response.ok) {

                throw new Error(
                    `HTTP error: ${response.status}`
                );

            }


            const data =
                await response.json();


            console.log(
                "Products loaded:",
                data.products
            );


            productsContainer.innerHTML = "";


            data.products.forEach(function (product, index) {

                const productCard =
                    document.createElement("div");


                productCard.classList.add(
                    "shop-product-card",
                    "block"
                );

                productCard.style.animationDelay =
                 `${index * 0.08}s`;


                productCard.innerHTML = `

                    <div class="shop-product-image">

                        <img
                            src="${product.thumbnail}"
                            alt="${product.title}"
                        >

                    </div>


                    <div class="shop-product-details">

                        <h3>
                            ${product.title}
                        </h3>


                        <div class="shop-price">

                            $${product.price}

                        </div>


                        <div class="shop-rating">

                            <span>
                                ★★★★★
                            </span>

                            <small>
                                (${product.rating})
                            </small>

                        </div>


                        <button
                            class="add-cart-btn"
                            type="button"
                        >
                            Add to Cart
                        </button>

                    </div>

                `;


                productsContainer.appendChild(
                    productCard
                );

            });


        } catch (error) {

            console.error(
                "Product error:",
                error
            );

        }

    };


    /* =========================
       INITIAL PRODUCTS
    ========================= */

    loadProducts("all");

});