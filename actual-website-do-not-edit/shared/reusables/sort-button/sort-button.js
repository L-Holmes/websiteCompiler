// ===================================================
// SORTING 
// ===================================================
// const ITEM_WRAPPER_CLASS:string=".table-entry"                                   // HTML 'class' of the div that wraps: An item that the user may buy.
const ITEM_WRAPPER_CLASS = ".single-item"; // HTML 'class' of the div that wraps: An item that the user may buy.
function getHighLowDesiredOrder() {
    console.log("~~~~~~~~~~~~~~~~~~");
    var items = getItems();
    var sortedItems = sortItemsByPrice(items, 'desc');
    var sortedNames = sortedItems.map(function (item) { return item.text; });
    console.log("Sorted names:", sortedNames);
    return sortedNames;
}
function getLowHighDesiredOrder() {
    console.log("~~~~~~~~~~~~~~~~~~");
    var items = getItems();
    var sortedItems = sortItemsByPrice(items, 'asc');
    var sortedNames = sortedItems.map(function (item) { return item.text; });
    console.log("Sorted names:", sortedNames);
    return sortedNames;
}
function getOldestNewestOrder() {
    console.log("~~~~~~~~~~~~~~~~~~");
    var items = getItems();
    var sortedItems = sortItemsByDate(items, 'asc');
    var sortedNames = sortedItems.map(function (item) { return item.text; });
    console.log("Sorted names:", sortedNames);
    return sortedNames;
}
function getNewestOldestOrder() {
    console.log("~~~~~~~~~~~~~~~~~~");
    var items = getItems();
    var sortedItems = sortItemsByDate(items, 'desc');
    var sortedNames = sortedItems.map(function (item) { return item.text; });
    console.log("Sorted names:", sortedNames);
    return sortedNames;
}
// --------------------------------------------------------------------------------------------
function sortItemsByPrice(items, direction) {
    // Make a copy so original order isn't affected
    var sorted = items.slice();
    console.log("Sorting items...");
    console.log("Before sorting:", sorted);
    sorted.sort(function (a, b) {
        console.log("Comparing:", a.text, "£" + a.price, "vs", b.text, "£" + b.price);
        if (direction === 'asc') {
            // Lowest price first
            return a.price - b.price;
        }
        else {
            // Highest price first
            return b.price - a.price;
        }
    });
    console.log("After sorting:", sorted);
    return sorted;
}
function sortItemsByDate(items, direction) {
    // Make a copy so original order isn't affected
    var sorted = items.slice();
    console.log("Sorting items by date...");
    console.log("Before sorting:", sorted);
    sorted.sort(function (a, b) {
        console.log("Comparing dates:", a.text, a.date, "vs", b.text, b.date);
        if (direction === 'asc') {
            // Oldest first (smallest epoch)
            return a.date - b.date;
        }
        else {
            // Newest first (largest epoch)
            return b.date - a.date;
        }
    });
    console.log("After sorting:", sorted);
    return sorted;
}
// --------------------------------------------------------------------------------------------
/**
 * Safely converts a NodeList to an array in older TypeScript/JS.
 */
function nodeListToArray(list) {
    var arr = [];
    for (var i = 0; i < list.length; i++) {
        arr.push(list[i]);
    }
    return arr;
}
function getItems() {
    var list = document.querySelectorAll('.single-item');
    var elements = nodeListToArray(list);
    var items = [];
    for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        var text = el.getAttribute('data-text') || '';
        var priceString = el.getAttribute('data-price') || '0';
        var price = parseFloat(priceString);
        var dateString = el.getAttribute('data-date-epoch') || '0';
        var dateEpoch = parseInt(dateString);
        items.push({
            text: text,
            price: price,
            date: dateEpoch,
            element: el
        });
    }
    return items;
}
// ----------------------------------------------------------------------------------------------------
function reorderItemsWithFlexbox(desiredOrder) {
    // 1. Define your desired order using unique keywords from the image sources.
    // const desiredOrder: string[] = ['table', 'boot', 'sapp-boot'];
    console.log("redoredering with desired order:", desiredOrder);
    // 2. Grab all the elements you want to sort.
    const nodeList = document.querySelectorAll(ITEM_WRAPPER_CLASS);
    const items = Array.from(nodeList).map(el => el);
    console.log("items");
    // If there's nothing to sort, we can stop.
    if (items.length === 0) {
        console.error(`OOh dear! no items found when attempting reorder`);
        return;
    }
    // 3. Get the parent container and apply flexbox styles directly.
    // This turns on the flexbox layout, enabling the `order` property to work.
    const container = document.getElementById('items');
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
        console.log("just moved:", itemName, " to have the order:", order.toString());
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
    const overlay = document.getElementById('sort-overlay');
    if (overlay) {
        overlay.style.display = 'block';
    }
}
// Hide the sort overlay
function closeSortOverlay() {
    console.log("closing sort overlay");
    const toggle = document.getElementById('sortToggle');
    const overlay = document.getElementById('sort-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
    else {
        console.warn("sort toggle not found! cannot close!");
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
    var desiredOrder = getHighLowDesiredOrder();
    console.log("got desired order:", desiredOrder);
    reorderItemsWithFlexbox(desiredOrder);
}
function handleLowHighClicked() {
    console.log("handle low high clicked");
    closeSortOverlay();
    // Add your sort logic here
    var desiredOrder = getLowHighDesiredOrder();
    console.log("got desired order:", desiredOrder);
    reorderItemsWithFlexbox(desiredOrder);
}
function handleDateOldNewClicked() {
    console.log("handle date added clicked");
    closeSortOverlay();
    // Add your sort logic here
    var desiredOrder = getOldestNewestOrder();
    console.log("got desired order:", desiredOrder);
    reorderItemsWithFlexbox(desiredOrder);
}
function handleDateNewOldClicked() {
    console.log("handle date added clicked");
    closeSortOverlay();
    // Add your sort logic here
    var desiredOrder = getNewestOldestOrder();
    console.log("got desired order:", desiredOrder);
    reorderItemsWithFlexbox(desiredOrder);
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
window.handleDateOldNewClicked = handleDateOldNewClicked;
window.handleDateNewOldClicked = handleDateNewOldClicked;
