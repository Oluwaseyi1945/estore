document.addEventListener("DOMContentLoaded", function () {

    let products = [];
    let filteredProducts = [];

    let search = "";
    let selectedCategory = "";
    let selectedMinPrice = 0;
    let selectedMaxPrice = Infinity;
    let selectedBrand = "";

    let currentPage = 1;
    const productsPerPage = 6;


    // ==========================================
    // HTML ELEMENTS
    // ==========================================

    const productsGrid = document.getElementById("productsGrid");
    const categoryList = document.getElementById("categoryList");
    const productSearch = document.getElementById("productSearch");
    const productCount = document.getElementById("productCount");
    const noProducts = document.getElementById("noProducts");

    const priceFilter = document.getElementById("priceFilter");
    const sortProducts = document.getElementById("sortProducts");

    const minPrice = document.getElementById("minPrice");
    const maxPrice = document.getElementById("maxPrice");
    const applyFilter = document.getElementById("applyFilter");

    const brandSearch = document.getElementById("brandSearch");

    const selectedCategoryText =
        document.getElementById("selectedCategory");

    const pagination =
    document.getElementById("pagination");


    // ==========================================
    // API CALL
    // ==========================================

    async function loadProducts() {

        try {

            const response =
                await fetch("https://dummyjson.com/products");

            if (!response.ok) {
                throw new Error("Failed to load products");
            }

            const data = await response.json();

            console.log("API DATA:", data);

            // DummyJSON returns:
            // { products: [...], total: ..., skip: ..., limit: ... }

            products = data.products;

            filteredProducts = products;

            createCategories();

            displayProducts(filteredProducts);

        } catch (error) {

            console.error("Error loading products:", error);

            productsGrid.innerHTML =
                "<p>Unable to load products.</p>";

        }

    }


    // ==========================================
    // CREATE CATEGORIES
    // ==========================================

    function createCategories() {

        const categories = [
            ...new Set(
                products.map(product => product.category)
            )
        ];

        categories.forEach(category => {

            const button =
                document.createElement("button");

            button.textContent = category;

            button.dataset.category = category;


            button.addEventListener("click", function () {

                selectedCategory = category;

                document
                    .querySelectorAll("#categoryList button")
                    .forEach(btn => {
                        btn.classList.remove("active");
                    });

                button.classList.add("active");

                selectedCategoryText.textContent =
                    category;

                filterProducts();

            });


            categoryList.appendChild(button);

        });


        // ALL PRODUCTS BUTTON

        const allProductsButton =
            categoryList.querySelector(
                '[data-category=""]'
            );


        allProductsButton.addEventListener(
            "click",
            function () {

                selectedCategory = "";

                selectedCategoryText.textContent = "";

                document
                    .querySelectorAll("#categoryList button")
                    .forEach(btn => {
                        btn.classList.remove("active");
                    });

                allProductsButton.classList.add("active");

                filterProducts();

            }
        );

    }


    // ==========================================
    // FILTER PRODUCTS
    // ==========================================

    function filterProducts() {

        filteredProducts = products.filter(product => {

            // SEARCH
            const matchesSearch =
                product.title
                    ?.toLowerCase()
                    .includes(search.toLowerCase());


            // CATEGORY
            const matchesCategory =
                !selectedCategory ||
                product.category === selectedCategory;


            // PRICE
            const matchesPrice =
                product.price >= selectedMinPrice &&
                product.price <= selectedMaxPrice;


            // BRAND
            const matchesBrand =
                !selectedBrand ||
                product.brand
                    ?.toLowerCase()
                    .includes(selectedBrand.toLowerCase());


            return (
                matchesSearch &&
                matchesCategory &&
                matchesPrice &&
                matchesBrand
            );

        });


        sortFilteredProducts();

        displayProducts(filteredProducts);

    }


    // ==========================================
    // SORT PRODUCTS
    // ==========================================

    function sortFilteredProducts() {

        const sortValue =
            sortProducts.value;


        if (sortValue === "low") {

            filteredProducts.sort(
                (a, b) => a.price - b.price
            );

        }


        if (sortValue === "high") {

            filteredProducts.sort(
                (a, b) => b.price - a.price
            );

        }


        if (sortValue === "newest") {

            filteredProducts.sort(
                (a, b) => b.id - a.id
            );

        }


        if (sortValue === "featured") {

            filteredProducts.sort(
                (a, b) => b.rating - a.rating
            );

        }

    }


    // ==========================================
    // DISPLAY PRODUCTS
    // ==========================================
function displayProducts() {

    productsGrid.innerHTML = "";

    // Total number of products
    productCount.textContent =
        `${filteredProducts.length} Products`;


    // No products
    if (filteredProducts.length === 0) {

        noProducts.style.display = "block";

        pagination.innerHTML = "";

        return;
    }


    noProducts.style.display = "none";


    // ==============================
    // PAGINATION CALCULATION
    // ==============================

    const totalPages = Math.ceil(
        filteredProducts.length / productsPerPage
    );


    // Make sure current page is valid
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }


    const startIndex =
        (currentPage - 1) * productsPerPage;

    const endIndex =
        startIndex + productsPerPage;


    // Get ONLY products for current page
    const productsToDisplay =
        filteredProducts.slice(
            startIndex,
            endIndex
        );


    // ==============================
    // DISPLAY PRODUCTS
    // ==============================

    productsToDisplay.forEach(product => {

        const productCard =
            document.createElement("div");

        productCard.addEventListener("click", function (event) {

    if (
        event.target.closest(".add-to-cart-btn") ||
        event.target.closest(".action-btn")
    ) {
        return;
    }

    localStorage.setItem(
        "selectedProductId",
        product.id
    );

    window.location.href =
        `/product-details/?id=${product.id}`;

});

        productCard.className =
            "product-card";


        productCard.innerHTML = `

               <div class="product-image">

        <img
            src="${product.thumbnail}"
            alt="${product.title}"
        >

        <div class="product-badge">
            New Season
        </div>

        <div class="product-actions">

            <button class="action-btn" title="Add to Wishlist">
                ♡
            </button>

            <button class="action-btn" title="Compare">
                ⟳
            </button>

            <button class="action-btn" title="Quick View">
                ◉
            </button>

        </div>

        <div class="add-to-cart-overlay">

            <button
                class="add-to-cart-btn"
                data-product-id="${product.id}"
            >
                Add to Cart
            </button>

        </div>

    </div>


    <div class="product-info">

                <h4>
                    ${product.title}
                </h4>

                <div class="price">
                    ₦${Number(product.price).toLocaleString()}
                </div>

                <div class="rating">
                    ★★★★★
                    <span>
                        ${product.rating}
                    </span>
                </div>

                <div class="product-colors">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

            </div>

        `;

        productsGrid.appendChild(productCard);


 const addToCartButton =
    productCard.querySelector(".add-to-cart-btn");

addToCartButton.addEventListener("click", function (event) {

    event.stopPropagation();

    const productId =
        this.dataset.productId;

        
     localStorage.setItem(
        "selectedProductId",
        productId
    );

    window.location.href =
        `/product-details/?id=${productId}`;

});

    });


    // CREATE PAGINATION
    createPagination(totalPages);

}

function createPagination(totalPages) {

    pagination.innerHTML = "";

    // If only one page, don't show pagination
    if (totalPages <= 1) {
        return;
    }


    // ==============================
    // PREVIOUS
    // ==============================

    const previousButton =
        document.createElement("button");

    previousButton.textContent = "‹";

    previousButton.className =
        "pagination-btn";

    previousButton.disabled =
        currentPage === 1;


    previousButton.addEventListener(
        "click",
        function () {

            if (currentPage > 1) {

                currentPage--;

                displayProducts();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }
    );


    pagination.appendChild(
        previousButton
    );


    // ==============================
    // PAGE NUMBERS
    // ==============================

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const pageButton =
            document.createElement("button");

        pageButton.textContent = page;

        pageButton.className =
            "pagination-btn";


        if (page === currentPage) {

            pageButton.classList.add(
                "active"
            );

        }


        pageButton.addEventListener(
            "click",
            function () {

                currentPage = page;

                displayProducts();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


        pagination.appendChild(
            pageButton
        );

    }


    // ==============================
    // NEXT
    // ==============================

    const nextButton =
        document.createElement("button");

    nextButton.textContent = "›";

    nextButton.className =
        "pagination-btn";

    nextButton.disabled =
        currentPage === totalPages;


    nextButton.addEventListener(
        "click",
        function () {

            if (currentPage < totalPages) {

                currentPage++;

                displayProducts();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }
    );


    pagination.appendChild(
        nextButton
    );
}
    // ==========================================
    // SEARCH
    // ==========================================

    productSearch.addEventListener(
        "input",
        function () {

            search = this.value;

            filterProducts();

        }
    );


    // ==========================================
    // PRICE DROPDOWN
    // ==========================================

    priceFilter.addEventListener(
        "change",
        function () {

            const value = this.value;


            if (!value) {

                selectedMinPrice = 0;
                selectedMaxPrice = Infinity;

            }


            else if (value === "0-50000") {

                selectedMinPrice = 0;
                selectedMaxPrice = 50000;

            }


            else if (value === "50000-100000") {

                selectedMinPrice = 50000;
                selectedMaxPrice = 100000;

            }


            else if (value === "100000+") {

                selectedMinPrice = 100000;
                selectedMaxPrice = Infinity;

            }


            filterProducts();

        }
    );


    // ==========================================
    // CUSTOM PRICE
    // ==========================================

    applyFilter.addEventListener(
        "click",
        function () {

            selectedMinPrice =
                Number(minPrice.value) || 0;

            selectedMaxPrice =
                Number(maxPrice.value) || Infinity;

            filterProducts();

        }
    );


    // ==========================================
    // SORT
    // ==========================================

    sortProducts.addEventListener(
        "change",
        function () {

            currentPage = 1;

            sortFilteredProducts();

            displayProducts(filteredProducts);

        }
    );


    // ==========================================
    // BRAND SEARCH
    // ==========================================

    brandSearch.addEventListener(
        "input",
        function () {

            selectedBrand = this.value;

            filterProducts();

        }
    );


    // ==========================================
    // START
    // ==========================================

    loadProducts();

});