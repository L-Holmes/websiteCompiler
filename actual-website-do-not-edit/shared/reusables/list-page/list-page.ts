//================================================================================================================================= 
//================================================================================================================================= 
//================================================================================================================================= 
//================================================================================================================================= 

// Define constants for CSS selectors and classes for better maintainability.
const SELECTED_FILTER_CLASS: string = 'selected';
const FILTERABLE_ITEM_SELECTOR: string = '[data-tag]';
const DATA_TAG_ATTRIBUTE: string = 'data-tag';
const DATA_FILTER_ATTRIBUTE: string = 'data-filter';


// NEW AIMS
// --> Where possible, all state is stored by the html.
// --> Now, this can be more efficient, having to re-check through everything...
//     but it keeps our code simpler.

/**
 * Handles the logic when a filter button is clicked.
 * It toggles the button's selected state and shows/hides items that contain the corresponding tag.
 * Note: This function's logic is a direct conversion of the provided JS and handles one filter's
 * state at a time, rather than combinations of multiple active filters.
 *
 * --> SO basically;
 * By default it hides everything 
 * If a filter is applied, it unhides any items that have that tag.
 * If a filter is unapplied, it 
 *
 * @param filterButtonElement The HTML button element that was clicked.
 * @param tag The tag associated with the filter button.
 */
function handleFilterClicked(filterButtonElement: HTMLElement, tag: string): void {
	console.log("					...");
    console.log("Filter clicked::::", tag);


    // --------------------------------------------
    // Determine selected state of button
    // --------------------------------------------
    const isFilterCurrentlySelected: boolean = filterButtonElement.className.indexOf(SELECTED_FILTER_CLASS) !== -1;
    console.log(`Is '${filterButtonElement.className}' selected? ${isFilterCurrentlySelected}`);

    // --------------------------------------------
    // Toggle the 'selected' class on the button.
    // --------------------------------------------
	let isFilterTurnedOn: boolean;
    if (isFilterCurrentlySelected) {
		// NOW WE ARE UN-APPLYING THIS FILTER
        // If it was selected, remove the class.
        filterButtonElement.className = filterButtonElement.className.replace(SELECTED_FILTER_CLASS, "").trim();
        console.log("Unselecting filter for tag:", tag);
		isFilterTurnedOn= false;
    } else {
		// NOW WE ARE APPLYING THIS FILTER
        // If it was not selected, add the class, ensuring a space separator.
        filterButtonElement.className += ` ${SELECTED_FILTER_CLASS}`;
        console.log("Selecting filter for tag:", tag);
		isFilterTurnedOn= true;
    }

	applyFilter(tag, isFilterTurnedOn);
}

function applyFilter(tag: string, isFilterTurnedOn:boolean){
	// --------------------------------------------
	// Get the list of filterable items 
	// --------------------------------------------
    // Get all HTML elements that have the data-tag attribute.
    // This returns a NodeListOf<Element>, which we can iterate over.
    const filterableItems: NodeListOf<Element> = document.querySelectorAll(FILTERABLE_ITEM_SELECTOR);
    console.log("Found", filterableItems.length, "filterable items on the page.");


	// --------------------------------------------
	// If user has just unselected the last filter, then there are no filters active; show all
	// --------------------------------------------
	const TEMP_DEBUG_NUM_SELECTED = _getListOfSelectedTags().length;
	console.log(`DEBUG: is filter for: '${tag}' turned on: ${isFilterTurnedOn}`);
	console.log(`DEBUG: what is the number of currently selected tags: ${TEMP_DEBUG_NUM_SELECTED}`);
    if (!isFilterTurnedOn) {
		// If user just unselected this filter, it is possible that now there are no filters selected.
		// If so, we want to unhide everything

		if (_getListOfSelectedTags().length === 0) {

			console.log("!!! unhiding all");
			_applyToAllItemsNewDisplayValue(filterableItems, "");

			updateFilterParams(); // <-- keep the URL in sync with current filters
			return;
		}
	}

	// --------------------------------------------
	// If this is the first time a filter is being applied, hide everything 
	// --------------------------------------------
    if (isFilterTurnedOn) {
		if (_getListOfSelectedTags().length === 1) {
			console.log("!!! initial call, hiding all");
			_applyToAllItemsNewDisplayValue(filterableItems, "none");
		}
	}


    // --------------------------------------------
    // Iterate through each filterable item to decide whether to show or hide it.
    // --------------------------------------------

	if (isFilterTurnedOn) {
		// Filter has been TURNED ON
		for (let i = 0; i < filterableItems.length; i++) {

			const currentItem: HTMLElement = filterableItems[i] as HTMLElement;
			const doesItemHaveThatTag = _itemHasTagBeingFilteredFor(currentItem, tag);

			if(!doesItemHaveThatTag){
				continue; // keep hidden if it doesn't have the tag
			}
			currentItem.style.display = "";
			console.log("!!! Showing item with tag:", tag);
		}
	}else{
		// Filter has been TURNED OFF

		// find all new active filters (i.e. anything that has 'selected'
		var selectedTags: string[] = _getListOfSelectedTags();

		// reset everything, and freshly apply those filters.
		_applyToAllItemsNewDisplayValue(filterableItems, "none");
		for(let selectedIndex = 0; selectedIndex < selectedTags.length; selectedIndex++) {
			let selectedTag : string = selectedTags[selectedIndex];
			console.log(`DEBUG ==> Unhiding the selected thing: ${selectedTag}`);
			applyFilter(selectedTag, true)
		}
	}



	updateFilterParams(); // <-- keep the URL in sync with current filters

	// ------------------------------------------------------------------------------------
	
	function _applyToAllItemsNewDisplayValue(allItems: NodeListOf<Element>, newDisplayValue: string){
		for (let i = 0; i < allItems.length; i++) {
			(allItems[i] as HTMLElement).style.display = newDisplayValue;
		}
	}

	function _itemHasTagBeingFilteredFor(currentItem:HTMLElement, tagBeingFilteredFor:string):boolean{

		const tagsAttribute: string | null = currentItem.getAttribute(DATA_TAG_ATTRIBUTE);

		if (!tagsAttribute) {
			return false;
		}

		// get the tags for the item we are currently looking at 
		const currentItemTags: string[] = tagsAttribute.split(/\s+/);

		if (currentItemTags.indexOf(tagBeingFilteredFor) === -1) {
			return false;
		}
		return true
	}
}


function _getListOfSelectedTags(): string[]{
	var selectedButtons: NodeListOf<Element> = document.querySelectorAll('.selected');
    var selectedTags: string[] = [];

    for (var i = 0; i < selectedButtons.length; i++) {
        var btn: HTMLElement = selectedButtons[i] as HTMLElement;
        var tag: string | null = btn.getAttribute(`${DATA_FILTER_ATTRIBUTE}`);
        if (tag) {
            selectedTags.push(tag);

			console.log("~~~> pushed:", tag);
        }
    }

	return selectedTags
}


/**
 * Updates the URL's query string so it always reflects which filters are active.
 * Keeps other params (like big_text, dyslexia_font) intact.
 */
function updateFilterParams(): void {
    console.log("~~~ updating filter params");

    var selectedTags: string[] = _getListOfSelectedTags();

    // Merge-safe: preserve any other params
    var params: URLSearchParams = new URLSearchParams(window.location.search);
    params.delete('filters'); // remove old filters param

    if (selectedTags.length > 0) {
        params.set('filters', selectedTags.join(','));
    }

    var newUrl: string = window.location.pathname + (params.toString() ? '?' + params.toString() : '') + window.location.hash;

    if (window.history && window.history.replaceState) {
        window.history.replaceState({}, '', newUrl);
    }

	console.log("~~~> done:", newUrl);

}

/**
 * Reads the ?filters=tag1,tag2 param on page load,
 * finds matching filter buttons, and re-applies them.
 */
function restoreFiltersFromParams(): void {
	console.log("++++ restoring filter params");
    var query: string = window.location.search;
    if (query.indexOf('filters=') === -1) {
        return;
    }

    var match: RegExpMatchArray | null = query.match(/filters=([^&]+)/);
    if (!match || !match[1]) {
        return;
    }

    var tagList: string[] = decodeURIComponent(match[1]).split(',');


	console.log("++++> got the tag list;", tagList);

    for (var i = 0; i < tagList.length; i++) {
        var tag: string = tagList[i];
        var btn: HTMLElement | null = document.querySelector(`[${DATA_FILTER_ATTRIBUTE}="` + tag + '"]');
        if (btn) {
			console.log("++++> handling filter tag clicked;", tag);
            handleFilterClicked(btn, tag);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    restoreFiltersFromParams();
});


// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================

// Global constants
const LIST_PAGE_WRAPPER = ".list-page-wrapper";
const ALL_FILTERS_WRAPPER = ".all-filters-wrapper";
const KEY_WRAPPER = ".key-wrapper"; // new
const MAIN_FILTERS_WRAPPER = ".flow-wrapper";

/**
 * Open all filters side content
 */
function openAllFilters() {
  document.querySelectorAll(LIST_PAGE_WRAPPER).forEach((el) => {
    (el as HTMLElement).style.display = "none";
  });

  document.querySelectorAll(ALL_FILTERS_WRAPPER).forEach((el) => {
    (el as HTMLElement).style.display = "inline-flex";
  });

  history.pushState({ filtersOpen: true }, "", "#all-filters");
}

/**
 * Close all filters side content
 */
function closeAllFilters() {
  document.querySelectorAll(LIST_PAGE_WRAPPER).forEach((el) => {
    (el as HTMLElement).style.display = "block";
  });

  document.querySelectorAll(ALL_FILTERS_WRAPPER).forEach((el) => {
    const element = el as HTMLElement;
    if (!element.classList.contains(SELECTED_FILTER_CLASS)) {
      element.style.display = "none";
    }
  });

  history.pushState({ filtersOpen: false }, "", "#list-page");
}

/**
 * Open key side content
 */
function openKey() {
  document.querySelectorAll(LIST_PAGE_WRAPPER).forEach((el) => {
    (el as HTMLElement).style.display = "none";
  });

  document.querySelectorAll(MAIN_FILTERS_WRAPPER).forEach((el) => {
    (el as HTMLElement).style.display = "none";
  });

  document.querySelectorAll(KEY_WRAPPER).forEach((el) => {
    (el as HTMLElement).style.display = "inline-flex";
  });

  history.pushState({ keyOpen: true }, "", "#key");
}

/**
 * Close key side content
 */
function closeKey() {
  document.querySelectorAll(LIST_PAGE_WRAPPER).forEach((el) => {
    (el as HTMLElement).style.display = "block";
  });
  

  document.querySelectorAll(MAIN_FILTERS_WRAPPER).forEach((el) => {
    (el as HTMLElement).style.display = "flex";
  });

  document.querySelectorAll(KEY_WRAPPER).forEach((el) => {
    const element = el as HTMLElement;
    if (!element.classList.contains(SELECTED_FILTER_CLASS)) {
      element.style.display = "none";
    }
  });

  history.pushState({ keyOpen: false }, "", "#list-page");
}

/**
 * Restore view on back/forward navigation
 */
window.addEventListener("popstate", (event) => {
  const mainWrapper = document.querySelector(LIST_PAGE_WRAPPER) as HTMLElement | null;
  const sideContentWrapper = document.querySelector(ALL_FILTERS_WRAPPER) as HTMLElement | null;
  const keyWrapper = document.querySelector(KEY_WRAPPER) as HTMLElement | null;

  if (event.state?.filtersOpen) {
    if (mainWrapper) mainWrapper.style.display = "none";
    if (sideContentWrapper) sideContentWrapper.style.display = "inline-flex";
    if (keyWrapper) keyWrapper.style.display = "none";
  } else if (event.state?.keyOpen) {
    if (mainWrapper) mainWrapper.style.display = "none";
    if (sideContentWrapper) sideContentWrapper.style.display = "none";
    if (keyWrapper) keyWrapper.style.display = "inline-flex";
  } else {
    if (mainWrapper) mainWrapper.style.display = "grid";
    if (sideContentWrapper) sideContentWrapper.style.display = "none";
    if (keyWrapper) keyWrapper.style.display = "none";
  }
});


//================================================================================================================================= 
//================================================================================================================================= 
//================================================================================================================================= 
//================================================================================================================================= 
// CLEARING FILTERS

function clearFilters(): void {
    // Get all selected filter buttons
    const selectedButtons: NodeListOf<Element> = document.querySelectorAll('.' + SELECTED_FILTER_CLASS);

    // Unselect each one visually
    selectedButtons.forEach((btnEl: Element) => {
        btnEl.classList.remove(SELECTED_FILTER_CLASS);
    });

    // Show all filterable items
    const filterableItems: NodeListOf<Element> = document.querySelectorAll(FILTERABLE_ITEM_SELECTOR);
    filterableItems.forEach((item: Element) => {
        (item as HTMLElement).style.display = "";
    });

    // Update URL so it no longer has ?filters=
    updateFilterParams();
}
