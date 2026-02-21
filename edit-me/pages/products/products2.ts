// // ===================================================
// // PROCESSING THE URL PARAMETERS  
// // ===================================================
// document.addEventListener('DOMContentLoaded', () => {
	// const params = new URLSearchParams(window.location.search);
	// 
	// // Parent categories
	// const category = (params.get('category') || '').toLowerCase();
	// const categoryMap: Record<string, string> = { 
		// products: 'cat-products', 
		// blogs: 'cat-blogs' 
	// };
	// 
	// if (categoryMap[category]) {
		// const el = document.getElementById(categoryMap[category]) as HTMLInputElement;
		// if (el) el.checked = true;
	// }
	// 
	// // Mapping subcategory ID → parent checkbox ID
	// const subToParent: Record<string, string> = {
		// shoes: 'cat-products',
		// boots: 'cat-products',
		// tables: 'cat-products',
		// article: 'cat-blogs',
		// video: 'cat-blogs',
		// newsub: 'cat-blogs',
		// fourth: 'cat-blogs',
	// };
	// 
	// // Check subcategories
	// const typeParam = params.get('type');
	// if (typeParam) {
		// typeParam.split(',').map(s => s.trim().toLowerCase()).forEach(sub => {
			// const el = document.getElementById('type-' + sub) as HTMLInputElement;
			// if (el) el.checked = true;
			// 
			// // Check parent based on mapping
			// const parentId = subToParent[sub];
			// if (parentId) {
				// const parentEl = document.getElementById(parentId) as HTMLInputElement;
				// if (parentEl) parentEl.checked = true;
			// }
		// });
	// }
// });
// 
// //================================================================================================================================= 
// //================================================================================================================================= 
// //================================================================================================================================= 
// //================================================================================================================================= 
// 
// // Define constants for CSS selectors and classes for better maintainability.
// const SELECTED_FILTER_CLASS: string = 'selected';
// const FILTERABLE_ITEM_SELECTOR: string = '[data-tag]';
// const DATA_TAG_ATTRIBUTE: string = 'data-tag';
// 
// /**
 // * Handles the logic when a filter button is clicked.
 // * It toggles the button's selected state and shows/hides items that contain the corresponding tag.
 // * Note: This function's logic is a direct conversion of the provided JS and handles one filter's
 // * state at a time, rather than combinations of multiple active filters.
 // *
 // * @param filterButtonElement The HTML button element that was clicked.
 // * @param tag The tag associated with the filter button.
 // */
// function handleFilterClicked(filterButtonElement: HTMLElement, tag: string): void {
    // console.log("Filter clicked:", tag);
// 
    // // --------------------------------------------
    // // Determine selected state of button
    // // --------------------------------------------
    // const isFilterCurrentlySelected: boolean = filterButtonElement.className.indexOf(SELECTED_FILTER_CLASS) !== -1;
    // console.log("Is it selected? ", isFilterCurrentlySelected);
// 
    // // --------------------------------------------
    // // Toggle the 'selected' class on the button.
    // // --------------------------------------------
    // if (isFilterCurrentlySelected) {
        // // If it was selected, remove the class.
        // filterButtonElement.className = filterButtonElement.className.replace(SELECTED_FILTER_CLASS, "").trim();
        // console.log("Unselecting filter for tag:", tag);
    // } else {
        // // If it was not selected, add the class, ensuring a space separator.
        // filterButtonElement.className += ` ${SELECTED_FILTER_CLASS}`;
        // console.log("Selecting filter for tag:", tag);
    // }
// 
    // // --------------------------------------------
    // // Iterate through each filterable item to decide whether to show or hide it.
    // // --------------------------------------------
// 
    // // Get all HTML elements that have the data-tag attribute.
    // // This returns a NodeListOf<Element>, which we can iterate over.
    // const filterableItems: NodeListOf<Element> = document.querySelectorAll(FILTERABLE_ITEM_SELECTOR);
    // console.log("Found", filterableItems.length, "filterable items on the page.");
	// let hiddenCount: number = 0; // <--- add this counter before the loop
// 
	// for (let i = 0; i < filterableItems.length; i++) {
		// const currentItem: HTMLElement = filterableItems[i] as HTMLElement;
		// const tagsAttribute: string | null = currentItem.getAttribute(DATA_TAG_ATTRIBUTE);
// 
		// if (tagsAttribute) {
			// const currentItemTags: string[] = tagsAttribute.split(/\s+/);
// 
			// if (currentItemTags.indexOf(tag) !== -1) {
// 
				// if (isFilterCurrentlySelected) {
					// currentItem.style.display = "none";
					// hiddenCount++; // <--- increment when something is hidden
					// console.log("Hiding item with tag:", tag);
				// } else {
					// currentItem.style.display = "";
					// console.log("Showing item with tag:", tag);
				// }
			// }
		// }
	// }
// 
	// // --------------------------------------------
	// // If everything got hidden, show all again
	// // --------------------------------------------
	// if (hiddenCount === filterableItems.length) {
		// console.log("All items hidden — resetting.");
		// for (let i = 0; i < filterableItems.length; i++) {
			// (filterableItems[i] as HTMLElement).style.display = "";
		// }
	// }
// 
// 
// 
	// updateFilterParams(); // <-- keep the URL in sync with current filters
// 
// }
// 
// 
// /**
 // * Updates the URL's query string so it always reflects which filters are active.
 // * Keeps other params (like big_text, dyslexia_font) intact.
 // */
// function updateFilterParams(): void {
    // var selectedButtons: NodeListOf<Element> = document.querySelectorAll('[data-filter].selected');
    // var selectedTags: string[] = [];
// 
    // for (var i = 0; i < selectedButtons.length; i++) {
        // var btn: HTMLElement = selectedButtons[i] as HTMLElement;
        // var tag: string | null = btn.getAttribute('data-filter');
        // if (tag) {
            // selectedTags.push(tag);
        // }
    // }
// 
    // // Merge-safe: preserve any other params
    // var params: URLSearchParams = new URLSearchParams(window.location.search);
    // params.delete('filters'); // remove old filters param
// 
    // if (selectedTags.length > 0) {
        // params.set('filters', selectedTags.join(','));
    // }
// 
    // var newUrl: string =
        // window.location.pathname +
        // (params.toString() ? '?' + params.toString() : '') +
        // window.location.hash;
// 
    // if (window.history && window.history.replaceState) {
        // window.history.replaceState({}, '', newUrl);
    // }
// }
// 
// /**
 // * Reads the ?filters=tag1,tag2 param on page load,
 // * finds matching filter buttons, and re-applies them.
 // */
// function restoreFiltersFromParams(): void {
    // var query: string = window.location.search;
    // if (query.indexOf('filters=') === -1) {
        // return;
    // }
// 
    // var match: RegExpMatchArray | null = query.match(/filters=([^&]+)/);
    // if (!match || !match[1]) {
        // return;
    // }
// 
    // var tagList: string[] = decodeURIComponent(match[1]).split(',');
// 
    // for (var i = 0; i < tagList.length; i++) {
        // var tag: string = tagList[i];
        // var btn: HTMLElement | null = document.querySelector('[data-filter="' + tag + '"]');
        // if (btn) {
            // // reuse your existing filter logic
            // handleFilterClicked(btn, tag);
        // }
    // }
// }
// 
// document.addEventListener('DOMContentLoaded', function () {
    // restoreFiltersFromParams();
// });
