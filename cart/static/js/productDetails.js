document.addEventListener(
"DOMContentLoaded",
function () {

    const productDetails =
        document.getElementById(
            "productDetails"
        );


    // ==================================
    // GET PRODUCT ID FROM URL
    // ==================================

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    // Get product ID from URL first
    // If there is no ID in URL, get the last selected product
    // from localStorage

    let productId =
        urlParams.get("id") ||
        localStorage.getItem(
            "selectedProductId"
        );


    if (productId) {

        localStorage.setItem(
            "selectedProductId",
            productId
        );

    }


    // ==================================
    // CHECK PRODUCT ID
    // ==================================

    if (!productId) {

        productDetails.innerHTML = `

            <div class="product-error">

                <h2>
                    Product not found
                </h2>

                <p>
                    No product was selected.
                </p>

                <a href="/category/">
                    Back to Products
                </a>

            </div>

        `;

        return;

    }


    // ==================================
    // FETCH PRODUCT
    // ==================================

    fetch(
        `https://dummyjson.com/products/${productId}`
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Product not found"
            );

        }

        return response.json();

    })

    .then(product => {

        console.log(
            "PRODUCT DETAILS:",
            product
        );

        displayProduct(product);

        displayProductTabs(product);

    })

    .catch(error => {

        console.error(
            "Error:",
            error
        );

        productDetails.innerHTML = `

            <div class="product-error">

                <h2>
                    Unable to load product
                </h2>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

    });


    // ==================================
    // DISPLAY PRODUCT
    // ==================================

    function displayProduct(product) {

        productDetails.innerHTML = `

            <!-- PRODUCT IMAGES -->

            <div class="product-gallery">

                <div class="product-thumbnails">

                    ${product.images
                        .map(
                            (image, index) => `

                                <button
                                    class="thumbnail ${
                                        index === 0
                                            ? "active"
                                            : ""
                                    }"
                                    data-image="${image}"
                                >

                                    <img
                                        src="${image}"
                                        alt="${product.title}"
                                    >

                                </button>

                            `
                        )
                        .join("")
                    }

                </div>


                <div class="main-product-image">

                    <img
                        id="mainProductImage"
                        src="${product.images[0]}"
                        alt="${product.title}"
                    >

                </div>

            </div>


            <!-- PRODUCT INFORMATION -->

            <div class="product-information">

                <div class="product-category">

                    ${product.category}

                </div>


                <h1>
                    ${product.title}
                </h1>


                <div class="product-rating">

                    <span class="stars">
                        ★★★★★
                    </span>

                    <span>
                        ${product.rating}
                    </span>

                    <span>
                        (${product.reviews?.length || 0}
                        Reviews)
                    </span>

                </div>


                <div class="product-price">

                    ₦${Number(
                        product.price
                    ).toLocaleString()}

                </div>


                <p class="product-description">

                    ${product.description}

                </p>


                <div class="product-stock">

                    <strong>
                        Availability:
                    </strong>

                    ${product.availabilityStatus}

                </div>


                <div class="product-brand">

                    <strong>
                        Brand:
                    </strong>

                    ${product.brand || "N/A"}

                </div>


                <!-- QUANTITY -->

                <div class="quantity-section">

                    <label>
                        Quantity
                    </label>

                    <div class="quantity-control">

                        <button
                            id="decreaseQuantity"
                        >
                            −
                        </button>

                        <input
                            type="number"
                            id="quantity"
                            value="1"
                            min="1"
                        >

                        <button
                            id="increaseQuantity"
                        >
                            +
                        </button>

                    </div>

                </div>


                <!-- ACTIONS -->

                <div class="product-actions-details">

                    <button
                        class="add-cart-details"
                        id="addToCart"
                    >
                        Add to Cart
                    </button>


                    <button
                        class="wishlist-details"
                    >
                        ♡
                    </button>

                </div>


                <!-- PRODUCT INFO -->

                <div class="product-meta">

                    <div>
                        <strong>SKU:</strong>
                        ${product.sku || "N/A"}
                    </div>

                    <div>
                        <strong>Stock:</strong>
                        ${product.stock}
                    </div>

                    <div>
                        <strong>Weight:</strong>
                        ${product.weight || "N/A"}
                    </div>

                </div>

            </div>

        `;


        setupProductInteractions(
            product
        );

    }


    // ==================================
    // PRODUCT INTERACTIONS
    // ==================================

    function setupProductInteractions(
        product
    ) {

        const mainImage =
            document.getElementById(
                "mainProductImage"
            );


        // ===============================
        // THUMBNAILS
        // ===============================

        const thumbnails =
            document.querySelectorAll(
                ".thumbnail"
            );


        thumbnails.forEach(
            thumbnail => {

                thumbnail.addEventListener(
                    "click",
                    function () {

                        const image =
                            this.dataset.image;


                        mainImage.src =
                            image;


                        thumbnails.forEach(
                            item => {

                                item.classList
                                    .remove(
                                        "active"
                                    );

                            }
                        );


                        this.classList.add(
                            "active"
                        );

                    }
                );

            }
        );


        // ===============================
        // QUANTITY
        // ===============================

        const quantity =
            document.getElementById(
                "quantity"
            );


        const decrease =
            document.getElementById(
                "decreaseQuantity"
            );


        const increase =
            document.getElementById(
                "increaseQuantity"
            );


        decrease.addEventListener(
            "click",
            function () {

                let value =
                    Number(
                        quantity.value
                    );


                if (value > 1) {

                    quantity.value =
                        value - 1;

                }

            }
        );


        increase.addEventListener(
            "click",
            function () {

                let value =
                    Number(
                        quantity.value
                    );


                quantity.value =
                    value + 1;

            }
        );


        // ===============================
        // ADD TO CART
        // ===============================

        const addToCart =
            document.getElementById(
                "addToCart"
            );


        addToCart.addEventListener(
            "click",
            function () {

                const selectedQuantity =
                    Number(
                        quantity.value
                    ) || 1;


                // Get existing cart
                let cart =
                    JSON.parse(
                        localStorage.getItem(
                            "cart"
                        )
                    ) || [];


                // UPDATE CART BADGE
const cartCount =
    document.getElementById("cart-count");

if (cartCount) {

    let totalQuantity = 0;

    cart.forEach(function (item) {

        totalQuantity +=
            Number(item.quantity) || 0;

    });

    cartCount.textContent =
        totalQuantity;

}


                // Check whether product
                // is already in cart

                const existingProduct =
                    cart.find(
                        item =>
                            item.id ===
                            product.id
                    );


                if (existingProduct) {

                    // Product already exists.
                    // Increase quantity.

                    existingProduct.quantity +=
                        selectedQuantity;

                } else {

                    // New product.
                    // Add it to the cart.

                    cart.push({

                        id: product.id,

                        title: product.title,

                        price: product.price,

                        thumbnail:
                            product.thumbnail,

                        brand:
                            product.brand || "",

                        quantity:
                            selectedQuantity

                    });

                }


                // Save cart

                localStorage.setItem(
                    "cart",
                    JSON.stringify(cart)
                );


              const notification =
document.createElement("div");

notification.className =
"cart-notification";

notification.innerHTML = `

<div class="cart-notification-icon">
    ✓
</div>

<div class="cart-notification-content">

    <strong>
        Added to Cart
    </strong>

    <span>
        ${product.title}
    </span>

</div>

`;

document.body.appendChild(notification);

// Show notification

setTimeout(() => {

notification.classList.add(
    "show"
);

}, 10);

// Remove notification after 3 seconds

setTimeout(() => {

notification.classList.remove(
    "show"
);

setTimeout(() => {

    notification.remove();

}, 300);

}, 3000);


                console.log(
                    "CURRENT CART:",
                    cart
                );

            }
        );

    }

}

);

// ==========================================
// PRODUCT TABS
// ==========================================

function displayProductTabs(product) {

// ==========================
// DESCRIPTION
// ==========================

const description =
    document.getElementById(
        "productDescription"
    );


if (description) {

    description.textContent =
        product.description;

}


// ==========================
// REVIEW COUNT
// ==========================

const reviewCount =
    document.getElementById(
        "reviewCount"
    );


if (reviewCount) {

    reviewCount.textContent =
        product.reviews?.length || 0;

}


// ==========================
// KEY FEATURES
// ==========================

const keyFeatures =
    document.getElementById(
        "keyFeatures"
    );


if (keyFeatures) {

    keyFeatures.innerHTML = `

        <li>
            Category: ${product.category}
        </li>

        <li>
            Brand: ${product.brand || "N/A"}
        </li>

        <li>
            Availability:
            ${product.availabilityStatus}
        </li>

        <li>
            Stock:
            ${product.stock}
        </li>

        <li>
            Minimum Order:
            ${product.minimumOrderQuantity || 1}
        </li>

    `;

}


// ==========================
// WHAT'S IN THE BOX
// ==========================

const boxContents =
    document.getElementById(
        "boxContents"
    );


if (boxContents) {

    boxContents.innerHTML = `

        <li>
            ${product.title}
        </li>

        <li>
            Product packaging
        </li>

        <li>
            User information
        </li>

    `;

}


// ==========================
// SPECIFICATIONS
// ==========================

const specifications =
    document.getElementById(
        "specificationsList"
    );


if (specifications) {

    specifications.innerHTML = `

        <div class="spec-row">

            <strong>Brand</strong>

            <span>
                ${product.brand || "N/A"}
            </span>

        </div>


        <div class="spec-row">

            <strong>Category</strong>

            <span>
                ${product.category}
            </span>

        </div>


        <div class="spec-row">

            <strong>SKU</strong>

            <span>
                ${product.sku || "N/A"}
            </span>

        </div>


        <div class="spec-row">

            <strong>Weight</strong>

            <span>
                ${product.weight || "N/A"}
            </span>

        </div>


        <div class="spec-row">

            <strong>Stock</strong>

            <span>
                ${product.stock}
            </span>

        </div>


        <div class="spec-row">

            <strong>Warranty</strong>

            <span>
                ${product.warrantyInformation || "N/A"}
            </span>

        </div>


        <div class="spec-row">

            <strong>Shipping</strong>

            <span>
                ${product.shippingInformation || "N/A"}
            </span>

        </div>


        <div class="spec-row">

            <strong>Return Policy</strong>

            <span>
                ${product.returnPolicy || "N/A"}
            </span>

        </div>

    `;

}


// ==========================
// REVIEWS
// ==========================

const reviewsList =
    document.getElementById(
        "reviewsList"
    );


if (reviewsList) {

    if (
        !product.reviews ||
        product.reviews.length === 0
    ) {

        reviewsList.innerHTML = `

            <p>
                No reviews available.
            </p>

        `;

    } else {

        reviewsList.innerHTML =
            product.reviews.map(
                review => `

                <div class="review">

                    <div class="review-header">

                        <strong>
                            ${review.reviewerName}
                        </strong>

                        <span class="review-stars">

                            ${"★".repeat(
                                Math.round(
                                    review.rating
                                )
                            )}

                        </span>

                    </div>


                    <p>
                        ${review.comment}
                    </p>


                    <small>
                        ${review.date}
                    </small>

                </div>

            `
            ).join("");

    }

}


setupTabs();

}

// ==========================================
// SETUP TABS
// ==========================================

function setupTabs() {

const tabs =
    document.querySelectorAll(
        ".product-tab"
    );


const contents =
    document.querySelectorAll(
        ".tab-content"
    );


tabs.forEach(tab => {

    tab.addEventListener(
        "click",
        function () {

            const target =
                this.dataset.tab;


            // Remove active from tabs

            tabs.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            // Remove active from content

            contents.forEach(content => {

                content.classList.remove(
                    "active"
                );

            });


            // Activate clicked tab

            this.classList.add(
                "active"
            );


            const targetContent =
                document.getElementById(
                    `${target}Tab`
                );


            if (targetContent) {

                targetContent.classList.add(
                    "active"
                );

            }

        }
    );

});

}