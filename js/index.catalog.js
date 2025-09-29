let productsData = [];
let productsRendered = 0;
let productsPerClick = 6;

const showMoreBtn = document.querySelector(".products__more-btn");

async function initProducts() {
    try {
        const res = await fetch('./data.json');
        const data = await res.json();

        return data.products;   
    } catch (error) {
        console.error('Error loading products: ', error);
        
        return [];
    }
}

async function initCategories() {
    try {
        const res = await fetch('./db.json');
        const data = await res.json();

        return data.categories;   
    } catch (error) {
        console.error('Error loading categories: ', error);
        
        return [];
    }
}

function renderProducts(products) {
    const productsList = document.querySelector(".products__list");

    if (!productsList) return;

    const productsToShow = products.slice(productsRendered, productsRendered + productsPerClick);

    productsToShow.forEach(product => {
        const oldPrice = Number(product.price.old).toFixed(2);
        const newPrice = Number(product.price.new).toFixed(2);

        let htmlOfPriceBlock = ""; 
        if (newPrice !== oldPrice) {
            htmlOfPriceBlock = `
                <p class="product__price-old">$${oldPrice} USD</p>
                <p class="product__price-new">$${newPrice} USD</p>
            `;
        } else {
            htmlOfPriceBlock = `<p class="product__price-new">$${newPrice} USD</p>`;
        }

        const badges = [];
        if (product.isNew) badges.push("New");
        if (product.isOnSale) badges.push("Sale");
        if (product.isLimited) badges.push("Limited");
        if (product.isBestseller) badges.push("Bestseller");

        let htmlOfBadges = "";
        for (let i = 0; i < badges.length; i++) {
            htmlOfBadges += `
                <span class="product__badge">${badges[i]}</span>
            ` 
        }
        
        productsList.innerHTML += `
            <article class="products__item product">
                <a href="#" class="product__link">
                <div class="product__media">
                    <img src="${product.photo}" alt="${product.name}" class="product__img">
                    
                    ${htmlOfBadges}
                </div>

                <h4 class="product__title">${product.name}</h4>

                <div class="product__price">
                    ${htmlOfPriceBlock}
                </div>
                </a>
            
                <button class="product__button">Buy Now</button>
            </article>
        `;
    });

    productsRendered += productsPerClick;

    if (productsRendered >= products.length && showMoreBtn) {
        showMoreBtn.style.display = "none";
    }
}

const products = await initProducts();
renderProducts(products);

if (showMoreBtn) {
    showMoreBtn.addEventListener("click", () => {
        renderProducts(products);
    });
}