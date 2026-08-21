document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // GET ELEMENTS
    // ==========================================

    const checkoutProducts =
        document.getElementById("checkoutProducts");

    const checkoutItemCount =
        document.getElementById("checkoutItemCount");

    const checkoutSubtotal =
        document.getElementById("checkoutSubtotal");

    const checkoutShipping =
        document.getElementById("checkoutShipping");

    const checkoutTax =
        document.getElementById("checkoutTax");

    const checkoutTotal =
        document.getElementById("checkoutTotal");

    const placeOrderTotal =
        document.getElementById("placeOrderTotal");


    // ==========================================
    // GET CART
    // ==========================================

    function getCart() {

        return JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    }


    // ==========================================
    // FORMAT PRICE
    // ==========================================

    function formatPrice(price) {

        return `₦${Number(price).toLocaleString()}`;

    }


    // ==========================================
    // DISPLAY CHECKOUT
    // ==========================================

    function displayCheckout() {

        const cart = getCart();

        checkoutProducts.innerHTML = "";


        // ==========================================
        // EMPTY CART
        // ==========================================

        if (cart.length === 0) {

            checkoutProducts.innerHTML = `
                <p class="empty-cart">
                    Your cart is empty.
                </p>
            `;

            checkoutItemCount.textContent = "0 items";

            updateTotals();

            return;

        }


        // ==========================================
        // ITEM COUNT
        // ==========================================

        let totalQuantity = 0;

        cart.forEach(function (item) {

            totalQuantity +=
                Number(item.quantity);

        });


        checkoutItemCount.textContent =
            `${totalQuantity} item${totalQuantity !== 1 ? "s" : ""}`;


        // ==========================================
        // DISPLAY PRODUCTS
        // ==========================================

        cart.forEach(function (item) {

            const quantity =
                Number(item.quantity);

            const price =
                Number(item.price);

            const itemTotal =
                price * quantity;


            const product =
                document.createElement("div");

            product.className =
                "summary-product";


            product.innerHTML = `

                <img
                    src="${item.thumbnail}"
                    alt="${item.title}"
                >

                <div class="product-info">

                    <h3>
                        ${item.title}
                    </h3>

                    <p>
                        Quantity: ${quantity}
                    </p>

                    <strong>
                        ${quantity} ×
                        ${formatPrice(price)}
                    </strong>

                    <strong>
                        ${formatPrice(itemTotal)}
                    </strong>

                </div>

            `;


            checkoutProducts.appendChild(
                product
            );

        });


        updateTotals();

    }


    // ==========================================
    // UPDATE TOTALS
    // ==========================================

    function updateTotals() {

        const cart = getCart();

        let subtotal = 0;


        cart.forEach(function (item) {

            subtotal +=
                Number(item.price) *
                Number(item.quantity);

        });


        // SHIPPING

        const shipping =
            subtotal > 0 ? 2500 : 0;


        // TAX

        const tax =
            subtotal * 0.075;


        // DISCOUNT

        const discount = 0;


        // TOTAL

        const total =
            subtotal +
            shipping +
            tax -
            discount;


        checkoutSubtotal.textContent =
            formatPrice(subtotal);

        checkoutShipping.textContent =
            formatPrice(shipping);

        checkoutTax.textContent =
            formatPrice(tax);

        checkoutTotal.textContent =
            formatPrice(total);

        placeOrderTotal.textContent =
            formatPrice(total);

    }


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    displayCheckout();

});