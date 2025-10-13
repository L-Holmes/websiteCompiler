
// ===================================================
// PROCESSING THE URL PARAMETERS  
// ===================================================
document.addEventListener('DOMContentLoaded', () => {
	const params = new URLSearchParams(window.location.search);
	
	// Parent categories
	const category = (params.get('category') || '').toLowerCase();
	const categoryMap: Record<string, string> = { 
		products: 'cat-products', 
		blogs: 'cat-blogs' 
	};
	
	if (categoryMap[category]) {
		const el = document.getElementById(categoryMap[category]) as HTMLInputElement;
		if (el) el.checked = true;
	}
	
	// Mapping subcategory ID → parent checkbox ID
	const subToParent: Record<string, string> = {
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
			const el = document.getElementById('type-' + sub) as HTMLInputElement;
			if (el) el.checked = true;
			
			// Check parent based on mapping
			const parentId = subToParent[sub];
			if (parentId) {
				const parentEl = document.getElementById(parentId) as HTMLInputElement;
				if (parentEl) parentEl.checked = true;
			}
		});
	}
});



// ===================================================
// SORTING 
// ===================================================

const ITEM_WRAPPER_CLASS:string=".table-entry"                                   // HTML 'class' of the div that wraps: An item that the user may buy.


//----------------------------------

function reorderItemsWithFlexbox(): void {

	// 1. Define your desired order using unique keywords from the image sources.
	const desiredOrder: string[] = ['table', 'boot', 'sapp-boot'];

	// 2. Grab all the elements you want to sort.
	const nodeList = document.querySelectorAll(ITEM_WRAPPER_CLASS);
	const items: HTMLElement[] = Array.from(nodeList).map(el => el as HTMLElement);

	// If there's nothing to sort, we can stop.
	if (items.length === 0) {
		return;
	}

	// 3. Get the parent container and apply flexbox styles directly.
	// This turns on the flexbox layout, enabling the `order` property to work.
	const container: HTMLElement | null = document.getElementById('products-wrapper');
	if (!container) {
		console.error('Container not found');
		return;
	}

	container.style.display = 'flex';
	container.style.flexDirection = 'column';

	// 4. Loop through all the items found on the page.
	for (let i = 0; i < items.length; i++) {
		const item: HTMLElement = items[i];

		const itemName:string = _getCategoryOfClickedItem(item); //e.g. 'sapp-boot'

		// Find the position of this item in our desiredOrder array.
		const order: number = desiredOrder.indexOf(itemName);

		// 5. Apply the order directly to the element's style.
		// If an item isn't in our list, we can give it a high order number to send it to the end.
		if (order === -1) {
			item.style.order = '99'; // Put unsorted items last
			console.error(`OOh dear! no order found for: ${itemName} to ${order}`);
			continue
		}

		item.style.order = order.toString();
	}

}


function _getCategoryOfClickedItem(element){
	/*
	e.g. If a html element is tagged with the file 'colours.orange.png'
	This will return 'colours.orange'
   */

	// == GET THE TEXT IN THE DIV ==
	const filename = element.dataset.text; // e.g. colours.orange.png

	// == remove the file extension ==
    const headerClicked = filename.replace(/\.[^/.]+$/, ''); //e.g. colours.orange

	return headerClicked
}



// Show the sort overlay
function handleSortClickedNew(): void {
	console.log("handle sort clicked new clicked");
	const overlay: HTMLElement | null = document.getElementById('sortOverlay');
	if (overlay) {
		overlay.style.display = 'block';
	}
}

// Hide the sort overlay
function closeSortOverlay(): void {
	const overlay: HTMLElement | null = document.getElementById('sortOverlay');
	if (overlay) {
		overlay.style.display = 'none';
	}
}

// Handle clicking on the overlay backdrop (close if clicked outside the box)
function handleOverlayClick(event: MouseEvent): void {
	const target = event.target as HTMLElement;
	if (target && target.classList.contains('sort-overlay')) {
		closeSortOverlay();
	}
}

// Sort option handlers
function handleHighLowClicked(): void {
	console.log("handle high low clicked");
	closeSortOverlay();
	// Add your sort logic here

	reorderItemsWithFlexbox();
}

function handleLowHighClicked(): void {
	console.log("handle low high clicked");
	closeSortOverlay();
	// Add your sort logic here
	reorderItemsWithFlexbox();
}

function handleDateAddedClicked(): void {
	console.log("handle date added clicked");
	closeSortOverlay();
	// Add your sort logic here
	reorderItemsWithFlexbox();
}

// Close overlay with Escape key
document.addEventListener('keydown', function(event: KeyboardEvent): void {
	if (event.key === 'Escape') {
		closeSortOverlay();
	}
});

// Make functions available globally for onclick handlers
(window as any).handleOverlayClick = handleOverlayClick;
(window as any).handleHighLowClicked = handleHighLowClicked;
(window as any).handleLowHighClicked = handleLowHighClicked;
(window as any).handleDateAddedClicked = handleDateAddedClicked;
