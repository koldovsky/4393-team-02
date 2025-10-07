let allProducts = []; 
let visibleProducts = [];
let allCategories = {};
let productsRendered = 0;
let productsPerClick = 6;
let appliedOrderCounter = 0;

const productsList = document.querySelector('.products__list');
const showMoreBtn = document.querySelector('.products__more-btn');
const appliedFiltersBox = document.querySelector('.applied-filters');

const filtersForm = document.querySelector('.filters__form');
const filtersModal = document.querySelector('.filters-modal');
const filtersToggle = document.querySelector('.filters__toggle-inner');
const filtersModalClearBtn = document.querySelector('.filters-modal__clear');
const filtersModalApplyBtn = document.querySelector('.filters-modal__apply');
const filtersModalClose = document.querySelector('.filters-modal__hero-close');

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
function formatPrice(number) { 
    return Number(number).toFixed(2); 
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

    if (!products.length) {
        productsRendered = 0;

        showEmptyState();
    } else {
        hideEmptyState();
    }

    const productsToShow = products.slice(productsRendered, productsRendered + productsPerClick);

    const createdProducts = productsToShow.map(productToShow => buildProductCard(productToShow)).join('');
    productsList.insertAdjacentHTML('beforeend', createdProducts);

    productsRendered += productsToShow.length;

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
    if (!appliedFiltersBox) return [];

    const labelByGroup = {
        'color[]': 'Color',
        'material[]': 'Material',
        'style[]': 'Style',
        'usage[]': 'Usage'
    };

    const chips = [];
    const seenKeys = new Set();
    const optionGroups = ['color[]', 'material[]', 'style[]', 'usage[]'];

    optionGroups.forEach(groupName => {
        const checkedInputs = document.querySelectorAll(`input[name="${groupName}"]:checked`);
        
        checkedInputs.forEach(inputElement => {
            const dedupKey = `${groupName}|${inputElement.value}`;

            if (seenKeys.has(dedupKey)) return;
            
            const labelElement = inputElement.closest('label')?.querySelector('.filters__label-text, .filters-modal__label-text');
            
            const orderNum = Number(inputElement.dataset.appliedOrder);
            const applyOrder = Number.isFinite(orderNum) ? orderNum : Number.MAX_SAFE_INTEGER;

            chips.push({
                type: 'option',
                groupName,
                groupLabel: labelByGroup[groupName],
                value: inputElement.value,
                label: labelElement ? labelElement.textContent.trim() : inputElement.value,
                order: applyOrder
            });

            seenKeys.add(dedupKey);
        });
    });

    chips.sort((a, b) => a.order - b.order);

    const rangePairs = [
        { minElement: document.getElementById('minRange'), maxElement: document.getElementById('maxRange') },
        { minElement: document.getElementById('mobile-minRange'), maxElement: document.getElementById('mobile-maxRange') },
    ].filter(pair => pair.minElement && pair.maxElement);

    if (rangePairs.length) {
        const defaultMins = rangePairs.map(pair => Number(pair.minElement.min)).filter(Number.isFinite);
        const defaultMaxs = rangePairs.map(pair => Number(pair.maxElement.max)).filter(Number.isFinite);

        if (defaultMins.length && defaultMaxs.length) {
            const defaultMin = Math.min(...defaultMins);
            const defaultMax = Math.max(...defaultMaxs);

            const currentMins = rangePairs.map(pair => Number(pair.minElement.value)).filter(Number.isFinite);
            const currentMaxs = rangePairs.map(pair => Number(pair.maxElement.value)).filter(Number.isFinite);

            if (currentMins.length && currentMaxs.length) {
                let effectiveMin = Math.max(...currentMins);
                let effectiveMax = Math.min(...currentMaxs);

                effectiveMin = Math.max(defaultMin, Math.min(effectiveMin, defaultMax));
                effectiveMax = Math.max(effectiveMin, Math.min(effectiveMax, defaultMax));

                const priceChanged = (effectiveMin > defaultMin) || (effectiveMax < defaultMax);

                if (priceChanged) {
                    chips.push({
                        type: 'price',
                        groupName: 'price',
                        groupLabel: 'Price',
                        value: `${effectiveMin}-${effectiveMax}`,
                        label: `${formatPrice(effectiveMin)} - ${formatPrice(effectiveMax)}`
                    });
                }
            }
        }
    }

    return chips;
}

function renderAppliedFilters() {
    if (!appliedFiltersBox) return;

    const items = collectAppliedFilterItems();
    const chipsHtml = items.map(chip => buildAppliedFilterChip(chip)).join('');
    const clearBtnHtml = items.length ? `<button class="applied-filters__clear" type="button">Clear all</button>` : '';

    appliedFiltersBox.innerHTML = chipsHtml + clearBtnHtml;

    initAppliedChipsHandlers();

    initModalApplyCount();
}
/* ---------- Rendering applied chips ---------- */


/* ---------- Rendering empty state ---------- */
function buildEmptyState() {
    return `
        <div class="products__list-empty" role="status" aria-live="polite">
            <div class="products__list-empty-illustration" aria-hidden="true">
                <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M125.571 125.769V70.7692M24.4286 70.7692V125.769M16 130H134M108.311 20H41.6887C35.9494 20 30.7658 23.1731 28.5375 28.0543L17.1326 53.0529C13.2923 61.4642 19.6691 70.994 29.5621 71.2981H30.0889C38.3594 71.2981 45.0628 64.6399 45.0628 57.4873C45.0628 64.6267 51.7688 71.2981 60.0393 71.2981C68.3098 71.2981 75 65.1159 75 57.4873C75 64.6267 81.7033 71.2981 89.9739 71.2981C98.2444 71.2981 104.95 65.1159 104.95 57.4873C104.95 65.1159 111.654 71.2981 119.924 71.2981H120.438C130.331 70.9887 136.708 61.4589 132.867 53.0529L121.463 28.0543C119.234 23.1731 114.051 20 108.311 20Z" stroke="#C5CBD6" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M49.7267 111.677C48.444 112.933 48.4218 114.99 49.6773 116.273C50.9328 117.556 52.9905 117.578 54.2733 116.323L49.7267 111.677ZM94.0999 116.191C95.3102 117.517 97.3658 117.61 98.6914 116.4C100.017 115.19 100.11 113.134 98.9001 111.809L94.0999 116.191ZM54.2733 116.323C57.8459 112.826 64.1932 108.636 71.4221 107.431C78.4226 106.263 86.4709 107.836 94.0999 116.191L98.9001 111.809C89.7291 101.764 79.444 99.5032 70.3529 101.019C61.4901 102.497 53.9875 107.507 49.7267 111.677Л54.2733 116.323Z" fill="#C5CBD6"></path>
                    <circle cx="93" cy="89" r="6" fill="#C5CBD6"></circle>
                    <circle cx="57" cy="89" r="6" fill="#C5CBD6"></circle>
                </svg>
            </div>
        </div>
    `;
}

function showEmptyState() {
    if (!productsList) return;

    productsList.innerHTML = '';
    productsList.insertAdjacentHTML('beforeend', buildEmptyState());
}

function hideEmptyState() {
    if (!productsList) return;

    const element = productsList.querySelector('.products__list-empty');
    
    if (element) {
        element.remove();
    }
}
/* ---------- Rendering empty state ---------- */


/* ---------- Filters options by category ---------- */
function updateAllowedOptionsByCatagory(groupName, allowedValues) {  
    const allowedOptions = Array.isArray(allowedValues) ? allowedValues : [];
    const optionInputs = document.querySelectorAll(`input[name="${groupName}"]`);

    optionInputs.forEach(optionInput => {
        const optionItem = optionInput.closest('.filters__item, .filters-modal__item');

        if (!optionItem) return;

        const isAllowed = allowedOptions.includes(optionInput.value);
        optionItem.style.display = isAllowed ? '' : 'none';

        if (!isAllowed) {
            optionInput.checked = false;
            delete optionInput.dataset.appliedOrder;
        }
    });
}

function clearAllOptionSelections() {
    const optionInputs = document.querySelectorAll('.filters__form input[type="checkbox"], .filters-modal__form input[type="checkbox"]');

    optionInputs.forEach(optionInput => {
        optionInput.checked = false;
        delete optionInput.dataset.appliedOrder;
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

function getCheckedValuesAcrossForms(name) {
  const nodes = document.querySelectorAll(`.filters__form input[name="${name}"]:checked, .filters-modal__form input[name="${name}"]:checked`);

  return [...new Set([...nodes].map(el => el.value))];
}

function getActivePriceRangeFromAllForms() {
    const minInput = [...document.querySelectorAll('#minRange, #mobile-minRange')];
    const maxInput = [...document.querySelectorAll('#maxRange, #mobile-maxRange')];

    if (!minInput.length || !maxInput.length) {
        return {
            minPrice: 0,
            maxPrice: Number.POSITIVE_INFINITY,
            absoluteMinPrice: 0,
            absoluteMaxPrice: Number.POSITIVE_INFINITY
        };
    }

    const absMins = minInput.map(element => Number(element.min)).filter(Number.isFinite);
    const absMaxs = maxInput.map(element => Number(element.max)).filter(Number.isFinite);

    const absoluteMinPrice = Math.min(...absMins);
    const absoluteMaxPrice = Math.max(...absMaxs);

    const mins = minInput.map(element => Number(element.value)).filter(Number.isFinite);
    const maxs = maxInput.map(element => Number(element.value)).filter(Number.isFinite);

    let minPrice = Math.max(absoluteMinPrice, Math.min(Math.max(...mins), absoluteMaxPrice));
    let maxPrice = Math.max(absoluteMinPrice, Math.min(Math.min(...maxs), absoluteMaxPrice));
    
    if (minPrice > maxPrice) maxPrice = minPrice;

    return { minPrice, maxPrice, absoluteMinPrice, absoluteMaxPrice };
}

function filterProductsByOption() {
    const categoryElement = document.querySelector('.filters__form input[name="category"]:checked, .filters-modal__form input[name="category"]:checked');
    const currentCategory = categoryElement?.value || 'all';

    const selectedUsage = getCheckedValuesAcrossForms('usage[]');
    const selectedColors = getCheckedValuesAcrossForms('color[]');
    const selectedStyles = getCheckedValuesAcrossForms('style[]');
    const selectedMaterials = getCheckedValuesAcrossForms('material[]');

    const { minPrice, maxPrice } = getActivePriceRangeFromAllForms();   

    const base = (currentCategory === "all") ? allProducts : allProducts.filter(product => product.category === currentCategory);

    return base.filter(product => {
        const price = Number((product.price && (product.price.new ?? product.price.old)) ?? 0);
        const byPrice = !Number.isNaN(price) && price >= minPrice && price <= maxPrice;

        return (byPrice && hasAnyIntersection(product.color, selectedColors) && hasAnyIntersection(product.material, selectedMaterials) && hasAnyIntersection(product.style, selectedStyles) && hasAnyIntersection(product.usage, selectedUsage));
    });
}
/* ---------- Products filter by category and option ---------- */


/* ---------- Products filter by price ---------- */
function updatePriceSliderUI() {
    const forms = document.querySelectorAll('.filters__form, .filters-modal__form');

    forms.forEach(root => {
        const isModal = root.classList.contains('filters-modal__form');

        const priceMinInput  = root.querySelector(isModal ? '#mobile-minRange' : '#minRange');
        const priceMaxInput  = root.querySelector(isModal ? '#mobile-maxRange' : '#maxRange');
        const priceSliderElement  = root.querySelector(isModal ? '.filters-modal__slider' : '.filters__slider');
        const priceTrackElement   = root.querySelector(isModal ? '.filters-modal__slider--track' : '.filters__slider--track');
        const priceActiveRange  = root.querySelector(isModal ? '.filters-modal__slider--active' : '.filters__slider--active');
        const priceMinThumbElement  = root.querySelector(isModal ? '.filters-modal__slider--thumb-min' : '.filters__slider--thumb-min');
        const priceMaxThumbElement  = root.querySelector(isModal ? '.filters-modal__slider--thumb-max' : '.filters__slider--thumb-max');
        const priceMinValueElement  = root.querySelector(isModal ? '.filters-modal__values [data-role="min"]' : '.filters__values [data-role="min"]');
        const priceMaxValueElement  = root.querySelector(isModal ? '.filters-modal__values [data-role="max"]' : '.filters__values [data-role="max"]');

        if (!priceMinInput || !priceMaxInput || !priceSliderElement || !priceTrackElement) return;

        const absoluteMinPrice = Number(priceMinInput.min);
        const absoluteMaxPrice = Number(priceMaxInput.max);

        let minPrice = Number(priceMinInput.value);
        let maxPrice = Number(priceMaxInput.value);

        minPrice = Math.max(absoluteMinPrice, Math.min(minPrice, absoluteMaxPrice));
        maxPrice = Math.max(absoluteMinPrice, Math.min(maxPrice, absoluteMaxPrice));

        if (minPrice > maxPrice) {
            maxPrice = minPrice;
        }

        if (String(priceMinInput.value) !== String(minPrice)) priceMinInput.value = String(minPrice);
        if (String(priceMaxInput.value) !== String(maxPrice)) priceMaxInput.value = String(maxPrice);

        if (priceMinValueElement) priceMinValueElement.textContent = formatPrice(minPrice).replace('.', ',');
        if (priceMaxValueElement) priceMaxValueElement.textContent = formatPrice(maxPrice).replace('.', ',');

        const priceSpan = absoluteMaxPrice - absoluteMinPrice || 1;
        const minPercent = ((minPrice - absoluteMinPrice) / priceSpan) * 100;
        const maxPercent = ((maxPrice - absoluteMinPrice) / priceSpan) * 100;

        const railWidthPx = priceTrackElement.getBoundingClientRect().width || 0;
        if (!railWidthPx) return;

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
    });
}

function handleMinPriceChange(event) { 
    const target = event?.target || null;
    if (!target) return;

    const root = target.closest('.filters__form, .filters-modal__form');
    if (!root) return;

    const isModal = root.classList.contains('filters-modal__form');

    const priceMinInput  = root.querySelector(isModal ? '#mobile-minRange' : '#minRange');
    const priceMaxInput  = root.querySelector(isModal ? '#mobile-maxRange' : '#maxRange');

    if (!priceMinInput || !priceMaxInput) return;

    const currentMaxValue = Number(priceMaxInput.value);
    const clampedMinValue = Math.min(Number(priceMinInput.value), currentMaxValue);

    if (Number(priceMinInput.value) !== clampedMinValue) {
        priceMinInput.value = String(clampedMinValue);
    }

    const otherRoot = isModal ? document.querySelector('.filters__form') : document.querySelector('.filters-modal__form');

    if (otherRoot) {
        const otherMin = otherRoot.querySelector('#minRange, #mobile-minRange');

        if (otherMin) otherMin.value = priceMinInput.value;
    }

    updatePriceSliderUI();

    visibleProducts = filterProductsByOption();
    resetAndRender(visibleProducts);

    initModalApplyCount();
    
    if (event && event.type === 'change') {
        renderAppliedFilters();
    }
}

function handleMaxPriceChange(event) { 
    const target = event?.target || null;
    if (!target) return;

    const root = target.closest('.filters__form, .filters-modal__form');
    if (!root) return;

    const isModal = root.classList.contains('filters-modal__form');

    const priceMinInput  = root.querySelector(isModal ? '#mobile-minRange' : '#minRange');
    const priceMaxInput  = root.querySelector(isModal ? '#mobile-maxRange' : '#maxRange');

    if (!priceMinInput || !priceMaxInput) return;

    const currentMinValue = Number(priceMinInput.value);
    const clampedMaxValue = Math.max(Number(priceMaxInput.value), currentMinValue);

    if (Number(priceMaxInput.value) !== clampedMaxValue) {
        priceMaxInput.value = String(clampedMaxValue);
    }

    const otherRoot = isModal ? document.querySelector('.filters__form') : document.querySelector('.filters-modal__form');
    if (otherRoot) {
        const otherMax = otherRoot.querySelector('#maxRange, #mobile-maxRange');

        if (otherMax) otherMax.value = priceMaxInput.value;
    }

    updatePriceSliderUI();

    visibleProducts = filterProductsByOption();
    resetAndRender(visibleProducts);

    initModalApplyCount();
    
    if (event && event.type === 'change') {
        renderAppliedFilters();
    }
}

function updatePriceLimitsForCategory(categoryKey) { 
    const forms = document.querySelectorAll('.filters__form, .filters-modal__form');

    const categoryConfig = (allCategories && typeof allCategories === 'object') ? allCategories[categoryKey] : null;
    if (!categoryConfig || !categoryConfig.price) return;

    forms.forEach(root => {
        const isModal = root.classList.contains('filters-modal__form');
        const priceMinInput  = root.querySelector(isModal ? '#mobile-minRange' : '#minRange');
        const priceMaxInput  = root.querySelector(isModal ? '#mobile-maxRange' : '#maxRange');
        
        if (!priceMinInput || !priceMaxInput) return;

        const minAllowedPrice = Number(categoryConfig.price.min);
        const maxAllowedPrice = Number(categoryConfig.price.max);

        priceMinInput.min = String(minAllowedPrice);
        priceMinInput.max = String(maxAllowedPrice);
        priceMaxInput.min = String(minAllowedPrice);
        priceMaxInput.max = String(maxAllowedPrice);

        priceMinInput.value = String(minAllowedPrice);
        priceMaxInput.value = String(maxAllowedPrice);
    });

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
    if (!filtersToggle || !filtersModal) return;

    filtersToggle.addEventListener('click', () => {
        filtersModal.style.display = 'flex';
    });
}

function initCloseModal() {
    if (!filtersModalClose || !filtersModal) return;

    filtersModalClose.addEventListener('click', () => {
        filtersModal.style.display = 'none';
    });
}

function initPriceFilter() { 
    const priceMinInput = document.querySelectorAll('#minRange, #mobile-minRange');
    const priceMaxInput = document.querySelectorAll('#maxRange, #mobile-maxRange');

    if (!priceMinInput.length || !priceMaxInput.length) return;

    priceMinInput.forEach(input => {
        input.addEventListener('input', handleMinPriceChange);
        input.addEventListener('change', handleMinPriceChange);
    });

    priceMaxInput.forEach(input => {
        input.addEventListener('input', handleMaxPriceChange);
        input.addEventListener('change', handleMaxPriceChange);
    });

    updatePriceSliderUI();
}

function initOptionChange() {
    const optionGroups = ['color[]', 'material[]', 'style[]', 'usage[]'];

    optionGroups.forEach(groupName => {
        const optionInputs = document.querySelectorAll(`.filters__form input[name="${groupName}"], .filters-modal__form input[name="${groupName}"]`);

        optionInputs.forEach(optionInput => {
            optionInput.addEventListener('change', () => {
                const mirrors = document.querySelectorAll(`.filters__form input[name="${groupName}"][value="${optionInput.value}"], .filters-modal__form input[name="${groupName}"][value="${optionInput.value}"]`);
                mirrors.forEach(mirror => { if (mirror !== optionInput) mirror.checked = optionInput.checked; });
                
                if (optionInput.type === 'checkbox') {
                    if (optionInput.checked) {
                        markOptionSelectionOrder(optionInput, true);

                        const order = optionInput.dataset.appliedOrder;
                        mirrors.forEach(mirror => { if (mirror !== optionInput) mirror.dataset.appliedOrder = order; });
                    } else {
                        delete optionInput.dataset.appliedOrder;

                        mirrors.forEach(mirror => { if (mirror !== optionInput) delete mirror.dataset.appliedOrder; });
                    }
                }

                visibleProducts = filterProductsByOption();
                resetAndRender(visibleProducts);

                renderAppliedFilters();
            });
        });
    });
}

function initCategoryChange() { 
    const categoryRadios = document.querySelectorAll(`.filters__form input[name="category"], .filters-modal__form input[name="category"]`);
    
    categoryRadios.forEach(categoryRadio => {
        categoryRadio.addEventListener('change', (event) => {
            const category = event.target.value;

            const categoryMirrors = document.querySelectorAll(`.filters__form input[name="category"][value="${category}"], .filters-modal__form input[name="category"][value="${category}"]`);
            
            categoryMirrors.forEach((mirrorRadio) => { 
                if (mirrorRadio !== event.target) {
                    mirrorRadio.checked = true;
                }
            });

            updatePriceLimitsForCategory(category);
            updateFilterOptionsForCategory(category);

            visibleProducts = filterProductsByOption();
            resetAndRender(visibleProducts);

            renderAppliedFilters();
        });
    });
}

function initModalApplyCount() {
    if (!filtersModalApplyBtn || !filtersModal) return;

    const count = collectAppliedFilterItems().length;
    filtersModalApplyBtn.textContent = `Apply filters: ${count}`;

    filtersModalApplyBtn.addEventListener('click', () => {
        filtersModal.style.display = 'none';
    });
}

function initClearAllOptions() {
    if (!filtersModalClearBtn) return;

    filtersModalClearBtn.addEventListener('click', () => {
        clearAllOptionSelections();

        const currentCategory = (document.querySelector('.filters__form input[name="category"]:checked') || document.querySelector('.filters-modal__form input[name="category"]:checked')) ?.value || 'all';
        updatePriceLimitsForCategory(currentCategory);

        appliedOrderCounter = 0;

        visibleProducts = filterProductsByOption();
        resetAndRender(visibleProducts);
            
        renderAppliedFilters();
    });
}

function initFiltersAccordion() {
    const sections = document.querySelectorAll('.filters__section, .filters-modal__section');

    sections.forEach(section => {
        const content = section.querySelector('.filters__content, .filters-modal__content');
        const icon = section.querySelector('.filters__header-icon, .filters-modal__header-icon');
        
        if (!icon || !content) return;

        content.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        section.addEventListener("click", () => {
            const isModal = section.classList.contains('filters-modal__section');

            section.classList.toggle(isModal ? 'filters-modal__section-active' : 'filters__section-active');
            content.classList.toggle(isModal ? 'filters-modal__content-active' : 'filters__content-active');
            icon.classList.toggle(isModal ? 'filters-modal__header-icon-active' : 'filters__header-icon-active');
        });
    });
}

function initPriceLayoutObserver() { 
    const rails = document.querySelectorAll('.filters__slider, .filters-modal__slider');
    if (!rails.length) return;

    const ro = new ResizeObserver(() => {
        updatePriceSliderUI();
    });

    rails.forEach(rail => ro.observe(rail));
}

function initAppliedChipsHandlers() { 
    if (!appliedFiltersBox) return;

    const appliedClearButton  = appliedFiltersBox.querySelector('.applied-filters__clear');
    const appliedCloseButtons = appliedFiltersBox.querySelectorAll('.applied-filters__close');

    if (appliedClearButton) {
        appliedClearButton.addEventListener('click', (event) => {
            event.preventDefault();

            clearAllOptionSelections();

            const currentCategory = (document.querySelector('.filters__form input[name="category"]:checked') || document.querySelector('.filters-modal__form input[name="category"]:checked')) ?.value || 'all';
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
                    const mirrors = document.querySelectorAll(`.filters__form input[name="${group}"][value="${value}"], .filters-modal__form input[name="${group}"][value="${value}"]`);
                    mirrors.forEach(i => { i.checked = false; i.removeAttribute('data-applied-order'); });
                } else if (type === 'price') {
                    const currentCategory = (document.querySelector('.filters__form input[name="category"]:checked') || document.querySelector('.filters-modal__form input[name="category"]:checked')) ?.value || 'all';
                    
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

    initShowMore();
    initShowModal();
    initCloseModal();
    initPriceFilter();
    initOptionChange();
    initCategoryChange();
    initModalApplyCount();
    initClearAllOptions();
    initFiltersAccordion();
    initPriceLayoutObserver();
    renderAppliedFilters();
    renderProducts(visibleProducts);
}
/* ---------- Init ---------- */

initCatalog();