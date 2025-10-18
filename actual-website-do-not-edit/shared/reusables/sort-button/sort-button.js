// ===================================================
// SORTING 
// ===================================================
const ITEM_WRAPPER_CLASS = ".table-entry"; // HTML 'class' of the div that wraps: An item that the user may buy.
//----------------------------------
function reorderItemsWithFlexbox() {
    // 1. Define your desired order using unique keywords from the image sources.
    const desiredOrder = ['table', 'boot', 'sapp-boot'];
    // 2. Grab all the elements you want to sort.
    const nodeList = document.querySelectorAll(ITEM_WRAPPER_CLASS);
    const items = Array.from(nodeList).map(el => el);
    // If there's nothing to sort, we can stop.
    if (items.length === 0) {
        return;
    }
    // 3. Get the parent container and apply flexbox styles directly.
    // This turns on the flexbox layout, enabling the `order` property to work.
    const container = document.getElementById('products-wrapper');
    if (!container) {
        console.error('Container not found');
        return;
    }
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    // 4. Loop through all the items found on the page.
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemName = _getCategoryOfClickedItem(item); //e.g. 'sapp-boot'
        // Find the position of this item in our desiredOrder array.
        const order = desiredOrder.indexOf(itemName);
        // 5. Apply the order directly to the element's style.
        // If an item isn't in our list, we can give it a high order number to send it to the end.
        if (order === -1) {
            item.style.order = '99'; // Put unsorted items last
            console.error(`OOh dear! no order found for: ${itemName} to ${order}`);
            continue;
        }
        item.style.order = order.toString();
    }
}
function _getCategoryOfClickedItem(element) {
    /*
    e.g. If a html element is tagged with the file 'colours.orange.png'
    This will return 'colours.orange'
   */
    // == GET THE TEXT IN THE DIV ==
    const filename = element.dataset.text; // e.g. colours.orange.png
    // == remove the file extension ==
    const headerClicked = filename.replace(/\.[^/.]+$/, ''); //e.g. colours.orange
    return headerClicked;
}
// Show the sort overlay
function handleSortClickedNew() {
    console.log("handle sort clicked new clicked");
    const overlay = document.getElementById('sortOverlay');
    if (overlay) {
        overlay.style.display = 'block';
    }
}
// Hide the sort overlay
function closeSortOverlay() {
    const toggle = document.getElementById('sortToggle');
    if (toggle) {
        toggle.checked = false; // uncheck -> overlay closes
    }
    else {
        console.warn("closeSortOverlay: #sortToggle not found in DOM");
    }
}
// Handle clicking on the overlay backdrop (close if clicked outside the box)
function handleOverlayClick(event) {
    const target = event.target;
    if (target && target.classList.contains('sort-overlay')) {
        closeSortOverlay();
    }
}
// Sort option handlers
function handleHighLowClicked() {
    console.log("handle high low clicked");
    closeSortOverlay();
    // Add your sort logic here
    reorderItemsWithFlexbox();
}
function handleLowHighClicked() {
    console.log("handle low high clicked");
    closeSortOverlay();
    // Add your sort logic here
    reorderItemsWithFlexbox();
}
function handleDateAddedClicked() {
    console.log("handle date added clicked");
    closeSortOverlay();
    // Add your sort logic here
    reorderItemsWithFlexbox();
}
// Close overlay with Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeSortOverlay();
    }
});
// Make functions available globally for onclick handlers
window.handleOverlayClick = handleOverlayClick;
window.handleHighLowClicked = handleHighLowClicked;
window.handleLowHighClicked = handleLowHighClicked;
window.handleDateAddedClicked = handleDateAddedClicked;
