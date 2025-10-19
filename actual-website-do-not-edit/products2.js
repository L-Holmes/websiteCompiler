// ===================================================
// PROCESSING THE URL PARAMETERS  
// ===================================================
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    // Parent categories
    const category = (params.get('category') || '').toLowerCase();
    const categoryMap = {
        products: 'cat-products',
        blogs: 'cat-blogs'
    };
    if (categoryMap[category]) {
        const el = document.getElementById(categoryMap[category]);
        if (el)
            el.checked = true;
    }
    // Mapping subcategory ID → parent checkbox ID
    const subToParent = {
        shoes: 'cat-products',
        boots: 'cat-products',
        tables: 'cat-products',
        article: 'cat-blogs',
        video: 'cat-blogs',
        newsub: 'cat-blogs',
        fourth: 'cat-blogs',
    };
    // Check subcategories
    const typeParam = params.get('type');
    if (typeParam) {
        typeParam.split(',').map(s => s.trim().toLowerCase()).forEach(sub => {
            const el = document.getElementById('type-' + sub);
            if (el)
                el.checked = true;
            // Check parent based on mapping
            const parentId = subToParent[sub];
            if (parentId) {
                const parentEl = document.getElementById(parentId);
                if (parentEl)
                    parentEl.checked = true;
            }
        });
    }
});
//================================================================================================================================= 
//================================================================================================================================= 
//================================================================================================================================= 
//================================================================================================================================= 
// Define constants for CSS selectors and classes for better maintainability.
const SELECTED_FILTER_CLASS = 'selected';
const FILTERABLE_ITEM_SELECTOR = '[data-tag]';
const DATA_TAG_ATTRIBUTE = 'data-tag';
/**
 * Handles the logic when a filter button is clicked.
 * It toggles the button's selected state and shows/hides items that contain the corresponding tag.
 * Note: This function's logic is a direct conversion of the provided JS and handles one filter's
 * state at a time, rather than combinations of multiple active filters.
 *
 * @param filterButtonElement The HTML button element that was clicked.
 * @param tag The tag associated with the filter button.
 */
function handleFilterClicked(filterButtonElement, tag) {
    console.log("Filter clicked:", tag);
    // --------------------------------------------
    // Determine selected state of button
    // --------------------------------------------
    const isFilterCurrentlySelected = filterButtonElement.className.indexOf(SELECTED_FILTER_CLASS) !== -1;
    console.log("Is it selected? ", isFilterCurrentlySelected);
    // --------------------------------------------
    // Toggle the 'selected' class on the button.
    // --------------------------------------------
    if (isFilterCurrentlySelected) {
        // If it was selected, remove the class.
        filterButtonElement.className = filterButtonElement.className.replace(SELECTED_FILTER_CLASS, "").trim();
        console.log("Unselecting filter for tag:", tag);
    }
    else {
        // If it was not selected, add the class, ensuring a space separator.
        filterButtonElement.className += ` ${SELECTED_FILTER_CLASS}`;
        console.log("Selecting filter for tag:", tag);
    }
    // --------------------------------------------
    // Iterate through each filterable item to decide whether to show or hide it.
    // --------------------------------------------
    // Get all HTML elements that have the data-tag attribute.
    // This returns a NodeListOf<Element>, which we can iterate over.
    const filterableItems = document.querySelectorAll(FILTERABLE_ITEM_SELECTOR);
    console.log("Found", filterableItems.length, "filterable items on the page.");
    for (let i = 0; i < filterableItems.length; i++) {
        const currentItem = filterableItems[i];
        const tagsAttribute = currentItem.getAttribute(DATA_TAG_ATTRIBUTE);
        // Ensure the item has tags before proceeding.
        if (tagsAttribute) {
            const currentItemTags = tagsAttribute.split(/\s+/);
            // Check if the current item has the tag associated with the clicked filter.
            // Using indexOf for compatibility with older TypeScript/JavaScript environments.
            if (currentItemTags.indexOf(tag) !== -1) {
                // Now, toggle the display based on the button's state *before* it was clicked.
                if (isFilterCurrentlySelected) {
                    // The button *was* selected, so now it's unselected. Hide the item.
                    currentItem.style.display = "none";
                    console.log("Hiding item with tag:", tag);
                }
                else {
                    // The button *was not* selected, so now it is. Show the item.
                    currentItem.style.display = ""; // Reset to default display (e.g., 'block', 'flex', etc.)
                    console.log("Showing item with tag:", tag);
                }
            }
        }
    }
}
