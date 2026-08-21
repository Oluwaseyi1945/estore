document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // GET CART
    // ==========================================

    function getCart() {

        return JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    }

// ==========================================
// UPDATE NAVBAR CART COUNT
// ==========================================

function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");

    if (!cartCount) {
        return;
    }

    const cart = getCart();

    // Number of different products
    const productCount = cart.length;


    if (productCount > 0) {

        cartCount.textContent =
            productCount;

        cartCount.style.display =
            "flex";

    } else {

        // Hide badge when cart is empty
        cartCount.style.display =
            "none";

    }

}


    // ==========================================
    // FORMAT PRICE
    // ==========================================

    function formatPrice(price) {

        return `₦${Number(price).toLocaleString()}`;

    }


    // ==========================================
    // CART PAGE ELEMENTS
    // ==========================================

    const cartItemsContainer =
        document.getElementById("cartItems");

    const subtotalElement =
        document.getElementById("subtotal");

    const shippingElement =
        document.getElementById("shipping");

    const taxElement =
        document.getElementById("tax");

    const discountElement =
        document.getElementById("discount");

    const totalElement =
        document.getElementById("cartTotal");

    const clearCartButton =
        document.getElementById("clearCart");


    // ==========================================
    // UPDATE SUMMARY
    // ==========================================

    function updateSummary() {

        if (
            !subtotalElement ||
            !shippingElement ||
            !taxElement ||
            !discountElement ||
            !totalElement
        ) {
            return;
        }

        const cart = getCart();

        let subtotal = 0;

        cart.forEach(function (item) {

            subtotal +=
                Number(item.price) *
                Number(item.quantity);

        });

        const shipping =
            subtotal > 0 ? 2500 : 0;

        const tax =
            subtotal * 0.075;

        const discount = 0;

        const total =
            subtotal +
            shipping +
            tax -
            discount;


        subtotalElement.textContent =
            formatPrice(subtotal);

        shippingElement.textContent =
            formatPrice(shipping);

        taxElement.textContent =
            formatPrice(tax);

        discountElement.textContent =
            formatPrice(discount);

        totalElement.textContent =
            formatPrice(total);

    }


    // ==========================================
    // DISPLAY CART
    // ==========================================

    function displayCart() {

        const cart = getCart();

        // ALWAYS UPDATE NAVBAR
        updateCartCount();


        // Not the cart page
        if (!cartItemsContainer) {
            return;
        }


        cartItemsContainer.innerHTML = "";


        if (cart.length === 0) {

            cartItemsContainer.innerHTML = `
                <p id="emptyCart">
                    Your cart is empty.
                </p>
            `;

            updateSummary();

            return;

        }


        cart.forEach(function (item, index) {

            const cartItem =
                document.createElement("div");

            cartItem.className =
                "cart-item";


            const itemTotal =
                Number(item.price) *
                Number(item.quantity);


            cartItem.innerHTML = `

                <div class="cart-product">

                    <img
                        src="${item.thumbnail}"
                        alt="${item.title}"
                    >

                    <div>

                        <h4>
                            ${item.title}
                        </h4>

                        <small>
                            ${item.brand || "N/A"}
                        </small>

                        <button
                            class="remove-item"
                            data-index="${index}"
                        >
                            Remove
                        </button>

                    </div>

                </div>


                <div>
                    ${formatPrice(item.price)}
                </div>


                <div class="cart-quantity">

                    <button
                        class="decrease-quantity"
                        data-index="${index}"
                    >
                        −
                    </button>

                    <input
                        type="number"
                        value="${item.quantity}"
                        min="1"
                        class="quantity-input"
                        data-index="${index}"
                    >

                    <button
                        class="increase-quantity"
                        data-index="${index}"
                    >
                        +
                    </button>

                </div>


                <div>

                    <strong>
                        ${formatPrice(itemTotal)}
                    </strong>

                </div>

            `;


            cartItemsContainer.appendChild(
                cartItem
            );

        });


        setupCartEvents();

        updateSummary();

    }


    // ==========================================
    // CART EVENTS
    // ==========================================

    function setupCartEvents() {

        const cart = getCart();


        // INCREASE

        document
            .querySelectorAll(".increase-quantity")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                this.dataset.index
                            );

                        cart[index].quantity++;

                        localStorage.setItem(
                            "cart",
                            JSON.stringify(cart)
                        );

                        displayCart();

                    }
                );

            });


        // DECREASE

        document
            .querySelectorAll(".decrease-quantity")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                this.dataset.index
                            );


                        if (
                            cart[index].quantity > 1
                        ) {

                            cart[index].quantity--;

                        }


                        localStorage.setItem(
                            "cart",
                            JSON.stringify(cart)
                        );

                        displayCart();

                    }
                );

            });


        // MANUAL QUANTITY

        document
            .querySelectorAll(".quantity-input")
            .forEach(function (input) {

                input.addEventListener(
                    "change",
                    function () {

                        const index =
                            Number(
                                this.dataset.index
                            );

                        let quantity =
                            Number(this.value);


                        if (
                            quantity < 1 ||
                            isNaN(quantity)
                        ) {

                            quantity = 1;

                        }


                        cart[index].quantity =
                            quantity;


                        localStorage.setItem(
                            "cart",
                            JSON.stringify(cart)
                        );

                        displayCart();

                    }
                );

            });


        // REMOVE

        document
            .querySelectorAll(".remove-item")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                this.dataset.index
                            );

                        cart.splice(index, 1);


                        localStorage.setItem(
                            "cart",
                            JSON.stringify(cart)
                        );

                        displayCart();

                    }
                );

            });

    }

// ==========================================
// CLEAR CART CONFIRMATION MODAL
// ==========================================

const clearCartModal =
    document.getElementById("clearCartModal");

const cancelClearCart =
    document.getElementById("cancelClearCart");

const confirmClearCart =
    document.getElementById("confirmClearCart");


// OPEN MODAL

if (clearCartButton) {

    clearCartButton.addEventListener(
        "click",
        function () {

            const cart = getCart();

            // Don't show modal if cart is empty
            if (cart.length === 0) {
                return;
            }

            clearCartModal.classList.add("show");

        }
    );

}


// CANCEL

if (cancelClearCart) {

    cancelClearCart.addEventListener(
        "click",
        function () {

            clearCartModal.classList.remove("show");

        }
    );

}


// CONFIRM CLEAR CART

if (confirmClearCart) {

    confirmClearCart.addEventListener(
        "click",
        function () {

            localStorage.removeItem("cart");

            clearCartModal.classList.remove("show");

            displayCart();

        }
    );

}


// CLOSE WHEN CLICKING OUTSIDE

if (clearCartModal) {

    clearCartModal.addEventListener(
        "click",
        function (event) {

            if (event.target === clearCartModal) {

                clearCartModal.classList.remove("show");

            }

        }
    );

}

    // ==========================================
    // START
    // ==========================================

    updateCartCount();

    displayCart();


    // ==========================================
    // WATCH LOCAL STORAGE
    // ==========================================

    window.addEventListener(
        "storage",
        function (event) {

            if (event.key === "cart") {

                updateCartCount();

            }

        }
    );

});