let allProducts = []; 
let visibleProducts = [];
let allCategories = {};
let productsRendered = 0;
let productsPerClick = 6;
let appliedOrderCounter = 0;

const productsList = document.querySelector(".products__list");
const showMoreBtn = document.querySelector(".products__more-btn");
const appliedFiltersBox = document.querySelector('.applied-filters');

const filtersForm = document.querySelector('.filters__form');
const filtersModal = document.querySelector('.filters-modal');
const filtersToggle = document.querySelector('.filters__toggle-inner');
const filtersSections = document.querySelectorAll(".filters__section");

const priceMinInput = document.getElementById('minRange');
const priceMaxInput = document.getElementById('maxRange');
const priceSliderElement = document.querySelector('.filters__slider');
const priceTrackElement = document.querySelector('.filters__slider--track');
const priceActiveRange = document.querySelector('.filters__slider--active');
const priceMinThumbElement = document.querySelector('.filters__slider--thumb-min');
const priceMaxThumbElement = document.querySelector('.filters__slider--thumb-max');
const priceMinValueElement = document.querySelector('.filters__values [data-role="min"]');
const priceMaxValueElement = document.querySelector('.filters__values [data-role="max"]');

/* ---------- Data loading ---------- */
async function loadJson(url) {
    const res = await fetch(url);

    if (res.ok) {
        return res.json();
    } else {
        throw new Error(`Failed to load ${url} (${res.status})`);
    }

}

function loadProducts() {
    return loadJson('./api/products.json');
}

function loadCategories() {
    return loadJson('./api/categories.json')
}
/* ---------- Data loading ---------- */


/* ---------- Utils ---------- */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function formatPrice(number) { 
    return Number(number).toFixed(2); 
}

function escapeForSelector(val) {
  return (window.CSS && CSS.escape) ? CSS.escape(val) : String(val).replace(/["\\]/g, '\\$&');
}

function clearProductsList() {
    if (productsList) {
        productsList.innerHTML = '';
    }
}

function toggleShowMore(products) {
    if (!showMoreBtn) return;

    const shouldShow = products.length > productsPerClick && productsRendered < products.length;
    showMoreBtn.style.display = shouldShow ? '' : 'none';
}
/* ---------- Utils ---------- */


/* ---------- Rendering products ---------- */
function buildProductCard(product) {
    return `
        <article class="products__item product">
            <a href="#" class="product__link">
                <div class="product__media">
                    <img src="${product.photo}" alt="${product.name}" class="product__img">

                    ${product.isNew ? '<span class="product__badge">New</span>' : ''}
                    ${product.isOnSale ? '<span class="product__badge">Sale</span>' : ''}
                    ${product.isLimited ? '<span class="product__badge">Limited</span>' : ''}
                    ${product.isBestseller ? '<span class="product__badge">Bestseller</span>' : ''}
                </div>

                <h4 class="product__title">${product.name}</h4>

                <div class="product__price">
                    ${product.price.old !== product.price.new ? `<p class="product__price-old">$${formatPrice(product.price.old)} USD</p>` : ''}

                    <p class="product__price-new">$${formatPrice(product.price.new)} USD</p>
                </div>
            </a>

            <button class="product__button">Buy Now</button>
        </article>
    `;
}

function renderProducts(products) {
    if (!productsList) return;

    const productsToShow = products.slice(productsRendered, productsRendered + productsPerClick);

    const createdProducts = productsToShow.map(productToShow => buildProductCard(productToShow)).join('');
    productsList.insertAdjacentHTML('beforeend', createdProducts);

    productsRendered += productsPerClick;

    toggleShowMore(products);
}

function resetAndRender(products) {
    productsRendered = 0;

    clearProductsList();
    renderProducts(products);
}
/* ---------- Rendering products ---------- */


/* ---------- Rendering applied chips ---------- */
function buildAppliedFilterChip(chip) {
    return `
        <div class="applied-filters__item" data-type="${chip.type}" data-group="${chip.groupName}" data-value="${chip.value}">
            <span class="applied-filters__label">${chip.groupLabel}: </span>
            <span class="applied-filters__value">&nbsp;${chip.label}</span>
            
            <button class="applied-filters__close" type="button">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="applied-filters__close-icon">
                    <path d="M9.85 9.15C10.05 9.35 10.05 9.65 9.85 9.85C9.75 9.95 9.65 10 9.5 10C9.35 10 9.25 9.95 9.15 9.85L6 6.7L2.85 9.85C2.65 10.05 2.35 10.05 2.15 9.85C2.05 9.75 2 9.65 2 9.5C2 9.35 2.05 9.25 2.15 9.15L5.3 6L2.15 2.85C1.95 2.65 1.95 2.35 2.15 2.15C2.35 1.95 2.65 1.95 2.85 2.15L6 5.3L9.15 2.15C9.35 1.95 9.65 1.95 9.85 2.15C10.05 2.35 10.05 2.65 9.85 2.85L6.7 6L9.85 9.15Z" fill="currentColor"></path>
                </svg>
            </button>
        </div>
    `;
}

function markOptionSelectionOrder(inputElement, checked) {
    if (checked) {
        inputElement.dataset.appliedOrder = String(++appliedOrderCounter);
    } else {
        delete inputElement.dataset.appliedOrder;
    }
}

function collectAppliedFilterItems() {
    if (!filtersForm || !appliedFiltersBox) return [];

    const groupLabel = {
        'color[]': 'Color',
        'material[]': 'Material',
        'style[]': 'Style',
        'usage[]': 'Usage'
    };

    const items = [];

    ['color[]', 'material[]', 'style[]', 'usage[]'].forEach(groupName => {
        const checked = filtersForm.querySelectorAll(`input[name="${groupName}"]:checked`);
        
        checked.forEach(inputElement => {
            const labelElement = inputElement.closest('label')?.querySelector('.filters__label-text');
            
            items.push({
                type: 'option',
                groupName,
                groupLabel: groupLabel[groupName],
                value: inputElement.value,
                label: labelElement ? labelElement.textContent.trim() : inputElement.value,
                order: Number(inputElement.dataset.appliedOrder)
            });
        });
    });

    items.sort((a, b) => a.order - b.order);

    if (priceMinInput && priceMaxInput) {
        const defaultPriceMin = Number(priceMinInput.min);
        const defaultPriceMax = Number(priceMaxInput.max);
        const currentPriceMin = Number(priceMinInput.value);
        const currentPriceMax = Number(priceMaxInput.value);

        if (!Number.isNaN(currentPriceMin) && !Number.isNaN(currentPriceMax) && (currentPriceMin > defaultPriceMin || currentPriceMax < defaultPriceMax)) {
            items.push({
                type: 'price',
                groupName: 'price',
                groupLabel: 'Price',
                value: `${currentPriceMin}-${currentPriceMax}`,
                label: `${formatPrice(currentPriceMin)} - ${formatPrice(currentPriceMax)}`
            });
        }
    }

    return items;
}

function renderAppliedFilters() {
    if (!appliedFiltersBox) return;

    const items = collectAppliedFilterItems();
    const chipsHtml = items.map(chip => buildAppliedFilterChip(chip)).join('');
    const clearBtnHtml = items.length ? `<button class="applied-filters__clear" type="button">Clear all</button>` : '';

    appliedFiltersBox.innerHTML = chipsHtml + clearBtnHtml;

    initAppliedChipsHandlers();
}
/* ---------- Rendering applied chips ---------- */


/* ---------- Filters options by category ---------- */
function updateAllowedOptionsByCatagory(groupName, allowedValues) {  
    if (!filtersForm) return;

    const allowedOptions = allowedValues || [];
    const filterOptionInputs = filtersForm.querySelectorAll(`input[name="${groupName}"]`);

    filterOptionInputs.forEach(optionInput => {
        const optionItem = optionInput.closest('.filters__item');

        if (!allowedOptions.includes(optionInput.value)) {
            optionItem.style.display = 'none';
        } else {
            optionItem.style.display = 'block';
        }
    });
}

function clearAllOptionSelections() {
    if (!filtersForm) return;

    filtersForm.querySelectorAll('input[type="checkbox"]').forEach(optionInput => {
        optionInput.checked = false;
    });
}

function updateFilterOptionsForCategory(categoryKey) {
    const categoryConfig = allCategories[categoryKey];
  
    if (!categoryConfig) {
        return;
    }

    clearAllOptionSelections();
    updateAllowedOptionsByCatagory('usage[]', categoryConfig.usage);
    updateAllowedOptionsByCatagory('color[]', categoryConfig.colors);
    updateAllowedOptionsByCatagory('style[]', categoryConfig.styles);
    updateAllowedOptionsByCatagory('material[]', categoryConfig.materials);
}
/* ---------- Filters options by category ---------- */


/* ---------- Products filter by category and option ---------- */
function hasAnyIntersection(productValues, selectedValues) {
    if (!selectedValues || selectedValues.length === 0) return true; 
    if (!Array.isArray(productValues)) return false;

    return productValues.some(productValue => selectedValues.includes(productValue));
}

function filterProductsByOption() {
    const currentCategory = document.querySelector('input[name="category"]:checked')?.value || 'all';

    const selectedUsage = Array.from(filtersForm.querySelectorAll('input[name="usage[]"]:checked')).map(element => element.value);
    const selectedColors = Array.from(filtersForm.querySelectorAll('input[name="color[]"]:checked')).map(element => element.value);
    const selectedStyles = Array.from(filtersForm.querySelectorAll('input[name="style[]"]:checked')).map(element => element.value);
    const selectedMaterials = Array.from(filtersForm.querySelectorAll('input[name="material[]"]:checked')).map(element => element.value);

    const { minPrice, maxPrice } = getActivePriceRange();   

    const base = (currentCategory === "all") ? allProducts : allProducts.filter(product => product.category === currentCategory);

    return base.filter(product => {
        const price = Number((product.price && (product.price.new ?? product.price.old)) ?? 0);
        const byPrice = !Number.isNaN(price) && price >= minPrice && price <= maxPrice;

        return (byPrice && hasAnyIntersection(product.color, selectedColors) && hasAnyIntersection(product.material, selectedMaterials) && hasAnyIntersection(product.style, selectedStyles) && hasAnyIntersection(product.usage, selectedUsage));
    });
}
/* ---------- Products filter by category and option ---------- */


/* ---------- Products filter by price ---------- */
function getActivePriceRange() {
    if (!priceMinInput || !priceMaxInput) {
        return { 
            minPrice: 0, 
            maxPrice: Number.POSITIVE_INFINITY, 
            absoluteMinPrice: 0, 
            absoluteMaxPrice: Number.POSITIVE_INFINITY 
        };
    }

    const absoluteMinPrice = Number(priceMinInput.min);
    const absoluteMaxPrice = Number(priceMaxInput.max);

    let minPrice = Number(priceMinInput.value);
    let maxPrice = Number(priceMaxInput.value);

    minPrice = Math.max(absoluteMinPrice, Math.min(minPrice, absoluteMaxPrice));
    maxPrice = Math.max(absoluteMinPrice, Math.min(maxPrice, absoluteMaxPrice));
    
    if (minPrice > maxPrice) {
        maxPrice = minPrice;
    }

    return { minPrice, maxPrice, absoluteMinPrice, absoluteMaxPrice };
}

function updatePriceSliderUI() {
    if (!priceMinInput || !priceMaxInput) return;

    const { minPrice, maxPrice, absoluteMinPrice, absoluteMaxPrice } = getActivePriceRange();

    if (priceMinValueElement) priceMinValueElement.textContent = formatPrice(minPrice).replace('.', ',');
    if (priceMaxValueElement) priceMaxValueElement.textContent = formatPrice(maxPrice).replace('.', ',');

    const priceSpan = absoluteMaxPrice - absoluteMinPrice || 1;
    const minPercent = ((minPrice - absoluteMinPrice) / priceSpan) * 100;
    const maxPercent = ((maxPrice - absoluteMinPrice) / priceSpan) * 100;
    
    if (!priceSliderElement || !priceTrackElement) return;

    const railWidthPx = priceTrackElement.clientWidth || priceSliderElement.clientWidth || 1;

    const minThumbWidthPx = priceMinThumbElement?.offsetWidth || 16;
    const maxThumbWidthPx = priceMaxThumbElement?.offsetWidth || 16;

    const minThumbWidthPct = (minThumbWidthPx / railWidthPx) * 100;
    const maxThumbWidthPct = (maxThumbWidthPx / railWidthPx) * 100;

    let minThumbLeftPct = minPercent - (minThumbWidthPct / 2);
    let maxThumbLeftPct = maxPercent - (maxThumbWidthPct / 2);

    minThumbLeftPct = Math.max(0, Math.min(minThumbLeftPct, 100 - minThumbWidthPct));
    maxThumbLeftPct = Math.max(0, Math.min(maxThumbLeftPct, 100 - maxThumbWidthPct));

    if (priceMinThumbElement) priceMinThumbElement.style.left = `${minThumbLeftPct}%`;
    if (priceMaxThumbElement) priceMaxThumbElement.style.left = `${maxThumbLeftPct}%`;

    if (priceActiveRange) {
        const leftPct = Math.min(minPercent, maxPercent);
        const widthPct = Math.max(0, Math.abs(maxPercent - minPercent));
        priceActiveRange.style.left = `${leftPct}%`;
        priceActiveRange.style.width = `${widthPct}%`;
    }

    const splitPercent = (minPercent + maxPercent) / 2;

    priceMinInput.style.position = 'absolute';
    priceMaxInput.style.position = 'absolute';

    priceMinInput.style.left  = `0px`;
    priceMinInput.style.right = `${100 - splitPercent}%`;

    priceMaxInput.style.left  = `${splitPercent}%`;
    priceMaxInput.style.right = `0px`;

    priceMinInput.style.zIndex = '2';
    priceMaxInput.style.zIndex = '2';
}

function handleMinPriceChange(event) {
    if (!priceMinInput || !priceMaxInput) return;

    const currentMaxValue = Number(priceMaxInput.value);
    const clampedMinValue = Math.min(Number(priceMinInput.value), currentMaxValue);

    if (Number(priceMinInput.value) !== clampedMinValue) {
        priceMinInput.value = String(clampedMinValue);
    }

    updatePriceSliderUI();

    visibleProducts = filterProductsByOption();
    resetAndRender(visibleProducts);
    
    if (event && event.type === 'change') {
        renderAppliedFilters();
    }
}

function handleMaxPriceChange(event) {
    if (!priceMinInput || !priceMaxInput) return;

    const currentMinValue = Number(priceMinInput.value);
    const clampedMaxValue = Math.max(Number(priceMaxInput.value), currentMinValue);

    if (Number(priceMaxInput.value) !== clampedMaxValue) {
        priceMaxInput.value = String(clampedMaxValue);
    }

    updatePriceSliderUI();

    visibleProducts = filterProductsByOption();
    resetAndRender(visibleProducts);
    
    if (event && event.type === 'change') {
        renderAppliedFilters();
    }
}

function updatePriceLimitsForCategory(categoryKey) {
    const categoryConfig = (allCategories && typeof allCategories === 'object') ? allCategories[categoryKey] : null;

    if (!categoryConfig || !categoryConfig.price || !priceMinInput || !priceMaxInput) return;

    const minAllowedPrice = Number(categoryConfig.price.min);
    const maxAllowedPrice = Number(categoryConfig.price.max);

    priceMinInput.min = String(minAllowedPrice);
    priceMinInput.max = String(maxAllowedPrice);
    priceMaxInput.min = String(minAllowedPrice);
    priceMaxInput.max = String(maxAllowedPrice);

    priceMinInput.value = String(minAllowedPrice);
    priceMaxInput.value = String(maxAllowedPrice);

    updatePriceSliderUI();

    visibleProducts = filterProductsByOption();
    resetAndRender(visibleProducts);

    renderAppliedFilters();
}
/* ---------- Products filter by price ---------- */


/* ---------- Event bindings ---------- */
function initShowMore() {
    if (!showMoreBtn) return;
    
    showMoreBtn.addEventListener('click', () => {
        renderProducts(visibleProducts)
    });
}

function initShowModal() {
    if (!filtersToggle && !filtersModal) return;

    filtersToggle.addEventListener('click', () => {
        filtersModal.style.display = 'flex';
    });
}

function initPriceFilter() {
    if (!priceMinInput || !priceMaxInput) return;

    priceMinInput.addEventListener('input', handleMinPriceChange);
    priceMinInput.addEventListener('change', handleMinPriceChange);
    priceMaxInput.addEventListener('input', handleMaxPriceChange);
    priceMaxInput.addEventListener('change', handleMaxPriceChange);

    updatePriceSliderUI();
}

function initOptionChange() {
    const optionGroups = ['color[]', 'material[]', 'style[]', 'usage[]'];

    optionGroups.forEach(groupName => {
        const optionInputs = filtersForm.querySelectorAll(`input[name="${groupName}"]`);

        optionInputs.forEach(optionInput => {
            optionInput.addEventListener('change', () => {
                markOptionSelectionOrder(optionInput, optionInput.checked);

                visibleProducts = filterProductsByOption();
                
                resetAndRender(visibleProducts);

                renderAppliedFilters();
            });
        });
    });
}

function initCategoryChange() {
    const categoryRadios = document.querySelectorAll(`input[name="category"]`);
    
    categoryRadios.forEach(categoryRadio => {
        categoryRadio.addEventListener('change', (event) => {
            const category = event.target.value;

            updatePriceLimitsForCategory(category);
            updateFilterOptionsForCategory(category);
            visibleProducts = filterProductsByOption();
            
            resetAndRender(visibleProducts);

            renderAppliedFilters();
        });
    });
}

function initFiltersAccordion() {
    filtersSections.forEach(filterSection => {
        const filtersContent = filterSection.querySelector('.filters__content');
        const filtersIcon = filterSection.querySelector('.filters__header-icon');
        
        if (!filtersIcon || !filtersContent) return;

        filtersContent.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        filterSection.addEventListener("click", () => {
            filterSection.classList.toggle("filters__section-active");
            filtersContent.classList.toggle("filters__content-active");
            filtersIcon.classList.toggle("filters__header-icon-active");
        });
    });
}

function initAppliedChipsHandlers() {
    if (!appliedFiltersBox) return;

    const appliedClearButton  = appliedFiltersBox.querySelector('.applied-filters__clear');
    const appliedCloseButtons = appliedFiltersBox.querySelectorAll('.applied-filters__close');

    if (appliedClearButton) {
        appliedClearButton.addEventListener('click', (event) => {
            event.preventDefault();

            clearAllOptionSelections();

            const currentCategory = document.querySelector('input[name="category"]:checked')?.value || 'all';
            updatePriceLimitsForCategory(currentCategory);

            appliedOrderCounter = 0;

            visibleProducts = filterProductsByOption();
            resetAndRender(visibleProducts);
            
            renderAppliedFilters();
        });
    }

    if (appliedCloseButtons && appliedCloseButtons.length) {
        appliedCloseButtons.forEach((btn) => {
            btn.addEventListener('click', (event) => {
                event.preventDefault();

                const chipElement = btn.parentElement;
                if (!chipElement || !chipElement.classList.contains('applied-filters__item')) return;

                const { type, group, value } = chipElement.dataset;

                if (type === 'option' && filtersForm) {
                    const safeVal = escapeForSelector(value);
                    const input = filtersForm.querySelector(`input[name="${group}"][value="${safeVal}"]`);
                    
                    if (input) {
                        input.checked = false;
                    }
                } else if (type === 'price') {
                    const currentCategory = document.querySelector('input[name="category"]:checked')?.value || 'all';
                    
                    updatePriceLimitsForCategory(currentCategory);
                }

                visibleProducts = filterProductsByOption();
                resetAndRender(visibleProducts);

                renderAppliedFilters();
            });
        });
  }
}
/* ---------- Event bindings ---------- */


/* ---------- Init ---------- */
async function initCatalog() {
    try {
        allProducts = await loadProducts();
        allCategories = await loadCategories();
    } catch (error) {
        console.error(error);

        allProducts = [];
        allCategories = {};
    }

    visibleProducts = allProducts;

    initFiltersAccordion();
    initShowMore();
    initShowModal();
    initPriceFilter();
    initOptionChange();
    initCategoryChange();
    renderAppliedFilters();
    renderProducts(visibleProducts);
}
/* ---------- Init ---------- */

initCatalog();