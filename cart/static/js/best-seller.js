console.log("Best sellers JS loaded");

const container = document.getElementById("best-sellers-container");

async function loadBestSellers() {

    try {

        const response = await fetch(
            "https://dummyjson.com/products?limit=8"
        );

        console.log("API response:", response);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        console.log("Products:", data.products);

        data.products.forEach(product => {

            container.innerHTML += `
                <div class="product-card">

                    <div class="product-image-box">

                        <img
                            src="${product.thumbnail}"
                            alt="${product.title}"
                        >

                    </div>

                    <div class="product-details">

                        <h3>${product.title}</h3>

                        <div class="product-price">
                            $${product.price}
                        </div>

                        <div class="product-rating">

                            <span class="stars">
                                ★★★★★
                            </span>

                            <span class="review-count">
                                (${product.rating})
                            </span>

                        </div>

                        <button class="add-cart-btn">
                            Add to Cart
                        </button>

                    </div>

                </div>
            `;

        });

    } catch (error) {

        console.error("ERROR:", error);

    }

}

loadBestSellers();