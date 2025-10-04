// ===============================================
// RULES & CHECKS
// - The names of the images of all filters must be contained as keys in the 'filterTiers' map here. 
// - The names of the images of all items must be contained as keys in the 'itemsToTags' map here. 
// '.filter-header-main-wrapper' 
// '.filter-main-wrapper'       
// ".table-entry"                                   
// ".item-images"                                     
// ".filter-sticker"
// ===============================================
// ===============================================
// ===============================================
const ALL_CATEGORY_NAME = "all";
const filters_being_shown = ALL_CATEGORY_NAME;
const HEADER_FILTERS = []; //holds the parent filters for whatever tier of filter is currently being shown the user. E.g. if the user is choosing which colours to filter, after sub-filtering: vehicles -> cars -> colours, this queue would hold: [vehicles,cars]
const HEADER_FILTER_TILE_HTML_WRAPPER_CLASS = '.filter-header-main-wrapper'; // HTML 'class' of the div that wraps: a header filter
const REGULAR_FILTER_TILE_HTML_WRAPPER_CLASS = '.filter-tile'; // HTML 'class' of the div that wraps: A filter element
const ITEM_WRAPPER_CLASS = ".table-entry"; // HTML 'class' of the div that wraps: An item that the user may buy.
const ITEM_IMAGE_CLASS = ".item-images"; // HTML 'class' of the img that: contains the item's image
const REGULAR_ITEM_SELECT_WRAPPER_CLASS = ".filter-tile";
const FILTER_BUTTON_CLASS = ".filter-search-button";
const RESULT_ITEM_IMAGE_CLASS = ".item-images";
const FILTER_TILE_IMAGE_CLASS = ".filter-icon";
//----------------------------------------------------------------------------------
/**
 * A record of available filter tiers and their selection state.
 * Each key represents a filter name in dot notation.
 */
const filterTiers = {
    "all": false,
    "shoe": false,
    "boot": false,
    "table": false,
    "colours": false,
    "colours.red": false,
    "colours.orange": false,
    "colours.black": false,
    "colours.brown": false,
    "colours.purple": false,
};
/*
Every item that the user may choose
*/
const itemsToTags = {
    "sapp-boot": ["shoe", "boot", "colours.brown::colours.black"],
    "boot": ["shoe", "boot", "colours.brown::colours.black"],
    "table": ["table", "colours.brown"],
};
//----------------------------------------------------------------------------------
// ======================
// INITIALISATION
// ======================
document.addEventListener("DOMContentLoaded", () => {
    initialiseFilters();
    _updateFilterHeader();
});
function initialiseFilters() {
    /*
       to be called when the filters first load onto the page
       */
    _showOnlyTopTierFilters();
}
function _showOnlyTopTierFilters() {
    /*
    Sets all filter tiles that aren't part of the 'top level filters' (i.e. entries with not '.'s in the filterTiers), to have display:none
   e.g. if filterTiers is:
   {
      "all": true,
      "shoes": true,
      "boots": true,
      "tables": true,
      "tables.colours": true,
      "tables.colours.red": true,
      "tables.colours.blue": true,
      "tables.colours.yellow": true,
      "tables.colours.orange": true,
    };
    then only 'shoes', 'boots', 'tables' will be shown. The rest will be hidden
   */
    // Get all top-level filter categories (no dots in name)
    const topLevelTiers = Object.keys(filterTiers).filter(key => !key.includes('.'));
    const filterTiles = _get_fresh_filter_tiles(REGULAR_FILTER_TILE_HTML_WRAPPER_CLASS);
    // Show only the tiles that match the top-level tiers
    filterTiles.forEach((tile) => {
        const category = _getFilterCategory(tile);
        if (category && topLevelTiers.indexOf(category) !== -1) {
            tile.style.display = ''; // Reset to default display value
        }
    });
}
//========================================================
// HANDLE THE FILTER TEST TUBE BEING CLICKED
//========================================================
function handleFilterTileClicked(element, isSelected) {
    /*
       @param element = the html element of the tile that was clicked
       @param isSelected = True if we are updating this tile to become 'selected'; False if this tile is to become 'unselected'; undefined if we don't know the next state (i.e. this is NOT a parent being updated)


       TO NOTE:
       Q) Why would 'nextImg' be none?
           If isSelected is undefined, that means that this is just a regular tile click
           Therefore, we need to manually determine what the next state is, and set the image accordingly.

           Conversly, if the isSelected is true/false, that means that this filter tile hasn't been directly clicked, but rather, one of its parents / ancestors has, and so we are updating
           it to match its parent / ancestor.
           Basically, if you have just selected 'none' on the parent filter, all of its children and their children etc. will have a nextImg of the Empty test tube, since they are all now 'none'/empty!
           Essentially, this function is reused for the recursive calls of updating parents.. just because the logic is the same...
           ... Yes, we know, that means that the function name 'handleFilterTileClicked' doesn't make sense when cascading down the descdents.. We apologise!

    @What it does:
    - If the filter tile is 'unselected':
        - Make that item 'selected' (applies that filter)
            - The outline becomes bold, and white
            - The items list is updated; it's filtered by that filter selection
        - Update all of its parents to be 'selected'*

    *If a filter tile is selected;
    - All of their ancestral parents become selected.
    - That is because, you wouldn't filter shoes.colours.brown if you didn't want shoes to show.
        -> If a user suddenly has that thought 'i want brown shoes', they don't have to add shoes, then filter to colours, then brown.
        -> They cut out the click of adding shoes, and go straight to the sub-filters.
        
    */
    console.log("&&&&&&&&& Handle filter tile clicked");
    let tileStateNow = _updateTheFilterImage(element, isSelected);
    _updateSelectedState(element, isSelected);
    if (isSelected === undefined) {
        _updateDescendentsAndAncestors(element, tileStateNow);
    }
}
function _updateTheFilterImage(element, isSelectedState) {
    /*
    Update background of the filter tile to represent it being selected/unselected
    i.e. Changes the background image
    @param isSelectedState = undefined if we don't know; True if we are setting the tile to be 'selected'; False if we are setting the tile to be 'unselected'
    @return True if we have just set this tile to be 'selected'; False otherwise
   */
    /*
    -----------------
    update the image
    -----------------
    */
    if (isSelectedState === undefined) {
        // if next img is none, that means that this is just a regular tile click
        // Therefore, we need to determine what the next state is and set the image accordingly.
        // Conversly, if the next image is an actual image page, that means that this filter tile hasn't been directly clicked, but rather, one of its parents / ancestors has, and so we are updating
        // if to match its parent / ancestor.
        // NEW NEW NEW
        const isSelectedState = _isFilterTileSelected(element);
    }
    if (!isSelectedState) {
        _updateFilterTileToLookSelected(element);
    }
    else {
        _updateFilterTileToLookUnselected(element);
    }
    return isSelectedState;
}
/*
Updates the appearance of the given tile to show that it is now selected
*/
function _updateFilterTileToLookSelected(element) {
    element.classList.add('selected');
}
/*
Updates the appearance of the given tile to show that it is now unselected
*/
function _updateFilterTileToLookUnselected(element) {
    element.classList.remove('selected');
}
/*
@return True if the filter is currently selected; False otherwise
*/
function _isFilterTileSelected(element) {
    return element.classList.contains('selected');
}
/**
 * Updates the selection state (i.e. true for selected; false for not selected) of a filter
 * i.e. Updates the 'filterTiers' map.
 * @param element - The HTML element representing a filter tile.


 Updates the local lists in this javascript which store the states of everything
 */
function _updateSelectedState(element, isSelected) {
    // getting the name of the thing being filtered for
    const thingBeingFilteredFor = _getFilterCategory(element);
    // Update the filter tiers map
    filterTiers[thingBeingFilteredFor] = isSelected;
}
function _updateDescendentsAndAncestors(element, isSelected) {
    /*
    Updates the children / grandchildren etc. of the thing clicked.

    E.g. If 'colours' was clicked, and set to state: 'show all',
    Then this function would go through all descendents (e.g. colours.orange, colours.red, colours.orange.tangerine, etc),
    and set each of them to the 'show all' state.


    NEW:
    only update the parent if the filter's state was set to 'True'!!!!
    always update all children's state
   */
    // Then, parse the map to get all of the children and children's children etc. and set all of their values to be equal to that of the common parent.
    // -> To note, for each of those, will need to update the 'background image' in the html, and the map itself
    // get the parent filter that was clicked (e.g. 'colours.orange')
    const whatThatTileFiltersFor = _getFilterCategory(element);
    // get a list of every item in the 'filterTiers' map that is a descendent
    let descendents = _getAllDescendants(whatThatTileFiltersFor);
    // For each descendant, find its corresponding HTML element and call the handler
    for (const filterName of descendents) {
        const element = _findFilterElementByName(filterName);
        if (element) {
            handleFilterTileClicked(element, isSelected);
        }
        else {
            console.warn(`Could not find HTML element for filter: ${filterName}`);
        }
    }
    if (isSelected) {
        let ancestors = _getAllAncestors(whatThatTileFiltersFor);
        for (const filterName of ancestors) {
            const element = _findFilterElementByName(filterName);
            if (element) {
                handleFilterTileClicked(element, isSelected);
            }
            else {
                console.warn(`Could not find HTML element for filter: ${filterName}`);
            }
        }
    }
    // Updates / Filters the actual results list that the user sees (only on desktop)
    _applyAutomaticFilterIfNeeded();
    function _getAllDescendants(parentFilterThatWasClicked) {
        // get all entries from filterTiers that have the parentFilterThatWasClicked as an ancestor
        // i.e. all entries which start with parentFilterThatWasClicked, regardless of nesting level
        // @return an array of the descendant's names
        // e.g. if 'tables.colours' was the parent, then it will return:  
        // const descendantTiers = ["tables.colours.red",
        // 						   "tables.colours.blue", 
        // 						   "tables.colours.yellow",
        // 						   "tables.colours.orange",
        // 						   "tables.colours.blue.lightblue",
        // 						   "tables.colours.orange.tangerine",
        // 						   "tables.colours.orange.tangerine.juicy"]
        let descendantTiers;
        if (parentFilterThatWasClicked === "all") {
            // Show all filters except 'all' itself
            descendantTiers = Object.keys(filterTiers).filter(key => {
                return key !== 'all';
            });
        }
        else {
            // Show all descendants (any level deeper)
            descendantTiers = Object.keys(filterTiers).filter(key => {
                return key.startsWith(parentFilterThatWasClicked + '.');
            });
        }
        return descendantTiers;
    }
    function _getAllAncestors(parentFilterThatWasClicked) {
        // get all entries from filterTiers that have the parentFilterThatWasClicked as a descendant
        // @return an array of the ancestor's names
        // e.g. if 'tables.colours.orange.tangerine.juicy' was the parent, then it will return:  
        // const descendantTiers = [
        //						   "tables",
        //						   "tables.colours",
        // 						   "tables.colours.orange",
        // 						   "tables.colours.orange.tangerine",
        // @ return empty is if there is none (e.g. 'tables' has no dots in the same, thus it has no ancestors
        // If there are no dots, there are no ancestors
        if (parentFilterThatWasClicked.indexOf('.') === -1)
            return [];
        const parts = parentFilterThatWasClicked.split('.');
        const ancestors = [];
        // Build prefixes: "a", "a.b", "a.b.c", ... up to second-last segment
        for (let i = 1; i < parts.length; i++) {
            const prefix = parts.slice(0, i).join('.');
            // Only include if present in global filterTiers
            ancestors.push(prefix);
        }
        return ancestors;
    }
    /*
    - Finds the element in the html with the class FILTER_BUTTON_CLASS
    - Determines whether display:none is set on it.
    ---> If display:none; call the function filterItems()
    */
    function _applyAutomaticFilterIfNeeded() {
        var _a, _b;
        // determine whether display:none; is set on the filter button 
        const el = document.querySelector(FILTER_BUTTON_CLASS);
        if (!el)
            return false;
        const computed = window.getComputedStyle(el);
        const display = (_b = (_a = computed === null || computed === void 0 ? void 0 : computed.display) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) !== null && _b !== void 0 ? _b : '';
        if (display === 'none') {
            filterItems();
        }
        return false;
    }
}
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
// jump! (up to here)
// =====================================
// HANDLE THE FILTER ICON BEING CLICKED
// ====================================
function filterIconClicked(element) {
    /*
       Activated when the user clicks the small filter icon, which is present underneath one of the filter tiles.
       This icon is used to filter down the sub categories of a filter (e.g. if the filter icon is underneath the 'all colours' option, then after clicking,
       It will show the seperate colours (red; blue; green; etc), for you to filter.
       */
    // e.g. lets assume that the filter of the tile with name "all.colours.orange" was clicked
    // GET THE FILTER THAT WAS CLICKED
    // ====================
    const parentFilterThatWasClicked = _getFilterCategoryFromUnderFilter(element); //e.g. "all.colours.orange"
    // UPDATE THE HEADERS TO SHOW THE THING THAT WAS CLICKED
    // ====================
    HEADER_FILTERS.push(parentFilterThatWasClicked); //e.g. after running, HEADER_FILTERS=["all.colours", "all.colours.orange"]
    // GET THE CHILDREN TIERS
    // ====================
    let childTiers = _getAllChildren(parentFilterThatWasClicked); //e.g. ["all.colours.orange.tangerine", "all.colours.orange.tangerine"]
    // if there are no child tiers, we should throw an error, as the filter icon should only be visible when child tiers are available!
    if (childTiers.length === 0) {
        console.warn("ERROR! The filter icon should not have been clickable as there are no child tiers available!");
        return null;
    }
    // HIDE CURRENT TILES, AND THEN UNHIDE EACH OF THE CHILDREN
    //=========================================================
    _updateVisibleFilterTiles(childTiers);
    // UPDATE THE HEADER
    //=========================================================
    _updateFilterHeader();
}
function _getAllChildren(parentFilterThatWasClicked) {
    // get all entries from filterTiers that have the parentFilterThatWasClicked as a parent
    // i.e. the entries which have a key, which is equal to parentFilterThatWasClicked, but with one extra dot and word at the end (and not more than one extra dot; no grandchildren!)
    // e.g. if 'tables.colours' was the parent, then the tier may be:  
    // const childTiers = ["tables.colours.red",
    // 						"tables.colours.blue",
    // 						"tables.colours.yellow",
    // 						"tables.colours.orange]
    // but 'tables.colours.blue.lightblue' or 'tables.colours.orange.tangerine.juicy' wouldn't.
    let childTiers;
    if (parentFilterThatWasClicked === "all") {
        // Show only top-level filters (no dots), excluding 'all' itself
        childTiers = Object.keys(filterTiers).filter(key => {
            return !key.includes('.') && key !== 'all';
        });
    }
    else {
        // Show direct children (one level deeper)
        const parentParts = parentFilterThatWasClicked.split('.');
        childTiers = Object.keys(filterTiers).filter(key => {
            const keyParts = key.split('.');
            return key.startsWith(parentFilterThatWasClicked + '.') &&
                keyParts.length === parentParts.length + 1;
        });
    }
    return childTiers;
}
// ===========================================
// REVERSE REVERSE 
// ===========================================
function _getPairedTileOrNone(element) {
    const thingBeingFilteredFor = _getFilterCategory(element);
    // Get all filter sticker elements
    const filterElements = document.querySelectorAll(REGULAR_ITEM_SELECT_WRAPPER_CLASS);
    // Track if we've seen the original element yet
    let seenOriginal = false;
    for (const el of filterElements) {
        const elFilterName = _getFilterCategory(el);
        if (el === element) {
            // We've found the original element, skip it and continue
            seenOriginal = true;
            continue;
        }
        if (elFilterName === thingBeingFilteredFor) {
            // If the filter name matches and it's not the original element
            return el;
        }
    }
    console.log(`Could not find a paired tile for: ${thingBeingFilteredFor}`);
    return null;
}
function _findFilterElementByName(filterName) {
    /*
    Find the HTML element that corresponds to a given filter name
    This is the reverse of _getFilterCategory - instead of getting the name from the element,
    we're finding the element from the name
    */
    // Get all filter sticker elements
    const filterElements = document.querySelectorAll(REGULAR_ITEM_SELECT_WRAPPER_CLASS);
    // Check each element to see if it matches our target filter name
    for (const element of filterElements) {
        const elementFilterName = _getFilterCategory(element);
        if (elementFilterName === filterName) {
            return element;
        }
    }
    console.log(`ahhhhh! ${filterName} could not be found!`);
    // If we get here, no matching element was found
    return null;
}
// ===========================================
// SHOW THE APPROPRIATE PARENTS IN THE HEADER 
// ===========================================
function _updateFilterHeader() {
    /*
    Shows the appropriate parents in the header

    When we click the filter img, we expect for the assoiated filter (e.g. 'all colours') to be pushed onto a queue.
    so we just hide everything that isn't in that queue.
    if the queue is empty, just show 'all' (hide everything apart from all, since we are at the top tier)

    to note: This functions expects that the html of the header tiles (in the html) are in order of tier. If they are in tier-order, they should always show up in the header in order as well.

   */
    var HEADER_FILTERSPointer = 0; //represents the element in the queue we are currently looking at
    // ------------------------------------------
    // If empty: hide everything apart from 'all'
    // ------------------------------------------
    if (HEADER_FILTERS.length === 0) {
        HEADER_FILTERS.push(ALL_CATEGORY_NAME);
    }
    // ------------------------------------------
    // Show everything in the HEADER_FILTERS
    // ------------------------------------------
    // Hide all tiles and get the tiles list
    const filterTiles = _get_fresh_filter_tiles(HEADER_FILTER_TILE_HTML_WRAPPER_CLASS);
    for (let i = 0; i < filterTiles.length; i++) {
        const tile = filterTiles[i];
        const category = _getFilterCategory(tile); //e.g. tables.colours.orange
        // Since the tiles are in order, we can just check whether each is equal to the current sub filter element
        if (category === HEADER_FILTERS[HEADER_FILTERSPointer]) {
            tile.style.display = ''; // Change it from displaying 'none' to displaying
            HEADER_FILTERSPointer++;
            if (HEADER_FILTERSPointer === HEADER_FILTERS.length) {
                break;
            }
        }
    }
    return;
}
// ================================
// HEADER RETURN TO PARENT CLICKED
// ================================
function filterHeaderReturnToParentClicked(element) {
    /*
       --- update filter header ---
       1) Remove all headers from the category_filter's HEADER_FILTERS queue that come after the header that was clicked. (e.g. if 'all_colours' clicked, remove 'all_colours.orange' and 'all_colours.orange.tangerine etc.'
       --- update tiles being shown / the filter headers ---
       3) Call the category_filter's filterIconClicked() method, passing the header that was clicked as the element (e.g. pass 'all_colours')
       */
    // e.g. the 'return back to "all_colours" was clicked" => headerClicked="all_colours"
    const headerClicked = _getFilterCategoryFromUnderFilter(element);
    if (HEADER_FILTERS.indexOf(headerClicked) === -1) { // header not found
        console.warn("CLICKED HEADER FILTER 'return/move up to this tier' NOT FOUND IN THE HEADERS LIST!", HEADER_FILTERS);
        return; // or handle accordingly
    }
    // (1) Update the queue that represents what is being shown in the header
    // e.g. Lets say we were showing everything under 'all_colours.orange.tangerine' when the 'return to parent: all_colours', was clicked
    while (true) {
        let headerFilterRemoved = HEADER_FILTERS.pop(); // e.g. on the first iteration, remove 'all_colours.orange', leaving just 'all_colours'
        if (headerFilterRemoved === headerClicked) {
            //don't need to add it back as the filter icon clicked later on will do that.
            break;
        }
        if (HEADER_FILTERS.length === 0)
            break; //prevent infinite loop
    }
    // (2) Act as if we just clicked that header. E.g. act as if we were looking at 'all' filters, and the user just clicked the 'all_colours' filter.
    //     This will essentially achieve our same goal of showing the children of the 'all_colours' filter.
    filterIconClicked(element);
}
// ============================
// OTHER FILTER-RELATED THINGS
// ============================
/**
 * Function to hide all filter tiles and then show only those matching childTiers
 * Pseudocode:
 * --------------------------------------------------
 * for tileOnScreen in filterTilesCurrentlyOnScreen:
 * 	theHtml[tileOnScreen].display = none;
 *
 * for tileToShow in childTiers:
 * 	theHtml[tileToShow].display = True;
 */
function _updateVisibleFilterTiles(childTiers) {
    // Get all filter tiles
    const filterTiles = document.querySelectorAll(REGULAR_FILTER_TILE_HTML_WRAPPER_CLASS);
    // First, hide all filter tiles
    filterTiles.forEach((tile) => {
        tile.style.display = 'none';
    });
    // Then, show only the tiles that match the childTiers
    filterTiles.forEach((tile) => {
        const category = _getFilterCategory(tile);
        if (category && childTiers.indexOf(category) !== -1) {
            tile.style.display = ''; // Reset to default display value
        }
    });
}
function _getFilterState(element) {
    /*
       @return the image path of the filter; return null if the image url couldn't be processed

       i.e. Either full (selected); partial (some of the sub categories are selected) or empty (none)

       e.g. May return: /shared/images/filtering/test-tube-half.avif
       */
    console.log("getting filter state");
    const style = window.getComputedStyle(element);
    const backgroundImage = style.backgroundImage; //e.g. https://localhost:8000/static/img/shared/images/filtering/test-tube-half.avif
    // strip the https://localhost:8000/ from the start
    const urlMatch = backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (!(urlMatch && urlMatch[1])) {
        console.warn("No background image URL found.");
        return null;
    }
    const fullUrl = urlMatch[1];
    const urlObj = new URL(fullUrl, window.location.origin); // handles relative or absolute
    // Get only the pathname (e.g., /shared/images/filtering/test-tube-half.avif)
    const currentImg = urlObj.pathname;
    return currentImg;
}
function _getFilterCategory(element) {
    /*
    returns the id, used in the filter_tiers map, that corresponds to the image shown by this partricular filter tile

    e.g. The user may see a tile showing a shoe.
        This function will get that tile, find its image path , and from that determine it is a shoes.
        It will then return "shoes" as that is the correponding key in the filter_tiers map
    
    e.g.2. may return "tables.colours.orange"
    */
    const imageName = _getElementsImageName(element, FILTER_TILE_IMAGE_CLASS, "Filter icon");
    if (!(imageName in filterTiers)) {
        console.warn(`Filter ${imageName} is not present within the filter tiers: ${JSON.stringify(filterTiers)}!`);
        return null;
    }
    return imageName;
}
/**
 * Gets the filter category when clicked from a filter-under-filter element
 * This function navigates up to the parent filter-main-wrapper and then uses
 * the existing _getFilterCategory function
 * @param element - The filter-under-filter-wrapper element that was clicked
 * @returns The filter category name or null if not found. e.g. "tables.colours.orange"
 */
function _getFilterCategoryFromUnderFilter(element) {
    // Navigate up to the parent filter-main-wrapper
    // Assume it is a regular tile first, search html above to check if it is a regular tile
    let mainWrapper = element.closest(REGULAR_FILTER_TILE_HTML_WRAPPER_CLASS);
    if (!mainWrapper) {
        // Assume that if we can find the html line indicating that it is a regular tile, assume it is a header tile
        mainWrapper = element.closest(HEADER_FILTER_TILE_HTML_WRAPPER_CLASS);
    }
    if (!mainWrapper) {
        // if we still haven't found what it is, throw error
        console.warn("Could not find parent filter-main-wrapper element.");
        return null;
    }
    // Find the filter-sticker element (which contains the filter icon)
    const filterSticker = mainWrapper.querySelector(REGULAR_ITEM_SELECT_WRAPPER_CLASS);
    if (!filterSticker) {
        console.warn("Filter sticker not found within the main wrapper.");
        return null;
    }
    // Use the existing function to get the category from the filter sticker
    return _getFilterCategory(filterSticker);
}
// 	/*
//    - hides all of the filter tiles
//    - @returns the filter tiles
//    */
// 
// 	// Get all filter tiles
// 	const filterTiles = document.querySelectorAll(html_wrapper_class);
// 
// 	// Hide all filter tiles first
// 	filterTiles.forEach((tile) => {
// 		(tile as HTMLElement).style.display = 'none'; 
// 	});
// 
// 	return filterTiles
// }
function _get_fresh_filter_tiles(html_wrapper_class) {
    /*
    - hides all of the filter tiles
    - @returns the filter tiles
    */
    // Get all filter tiles
    const filterTiles = document.querySelectorAll(html_wrapper_class);
    // Convert NodeList to HTMLElement array
    const filterTilesArray = Array.from(filterTiles).map(tile => tile);
    // Hide all filter tiles first
    filterTilesArray.forEach((tile) => {
        tile.style.display = 'none';
    });
    return filterTilesArray;
}
function _getElementsImageName(element, imgsHtmlClass, textNameOfElement) {
    /*
    @param imgsHtmlClass
            e.g. imgsHtmlClass = .filter-icon
    @param textNameOfElement = descriptive plain text name to represent the element
        e.g. "Filter icon" // "item"
    @return the image path of the image element within that html block.
    */
    console.log(`${textNameOfElement} being searched for. Looking for ${imgsHtmlClass}`);
    // Get the icon representing what is being filtered
    const itemsHtmlImgElement = element.querySelector(imgsHtmlClass);
    if (!itemsHtmlImgElement) {
        console.warn(`${textNameOfElement} image not found`);
        return null;
    }
    // Get the src attribute from the image element
    const imagePath = itemsHtmlImgElement.getAttribute('src');
    if (!imagePath) {
        console.warn(`${textNameOfElement} image path not found`);
        return null;
    }
    const filename = imagePath.split('/').pop();
    if (!filename) {
        console.warn(`${textNameOfElement} src attribute not found`);
        return null;
    }
    const nameWithoutExtension = filename.replace(/\.[^/.]+$/, '');
    return nameWithoutExtension;
}
function isValidImagePath(path) {
    return (typeof path === "string" &&
        path.trim() !== "" &&
        /\.(png|jpe?g|gif|svg|webp|avif)$/.test(path));
}
// ============================================================================
// ============================================================================
// ============================================================================
// ITEMS STUFF
function filterItems() {
    /*
   Changes which items are shown on screen, based on the filters that the user has selected.

   Technical info:
   - Simply hides items which aren't meant to be seen, by setting display:none;
   */
    // 1) filterTiers
    const allHtmlItemElements = _get_fresh_filter_tiles(ITEM_WRAPPER_CLASS);
    for (const item of allHtmlItemElements) {
        const itemName = _getElementsImageName(item, RESULT_ITEM_IMAGE_CLASS, "Item image"); // e.g. 'SappBoot'
        const allTagsForItem = itemsToTags[itemName]; //e.g. ['shoes', 'materials.leather', 'colours.brown::colours.black']
        if (!allTagsForItem) {
            console.error(`[ERROR] No Item tag found for '${itemName}'`);
            console.error('Available item keys:');
            console.error(`${JSON.stringify(itemsToTags)}`);
            continue; // No tags found for this item
        }
        let hidden = false;
        for (const itemTagsGroup of allTagsForItem) {
            // e.g. itemTagsGroup = 'shoes' // 'colours.brown::colours.black' // etc.
            const itemTags = itemTagsGroup.split("::"); // e.g. If we want to apply 'OR' for a group of tags, we join with '::'
            // -- if any in the group are selected, don't hide! --
            // -- if none in the group are selected, hide! --
            let shouldHide = true;
            for (const itemTag of itemTags) {
                // E.g. a tag may be 'furniture' or 'made of wood' etc.
                if (filterTiers[itemTag] !== false) {
                    // If any of these are true, we want to show.
                    shouldHide = false;
                    break;
                }
            }
            if (shouldHide) {
                hidden = true;
            }
        }
        // If none of the tags are filtered out, reset visibility
        if (!hidden) {
            item.style.display = ""; // Reset to default display
        }
    }
}
// ===================================================
// SORTING 
// ===================================================
// ===============================================
// ===============================================
// ===============================================
// Sorting  
// const filterOptions= [ "price_high_to_low", "price_low_to_high", "date_added" ];
function handleSortClicked() {
    reorderItemsWithFlexbox();
    // Get all of the items on screen (by getting blocks wrapped by 'table-entry')
    // through some abosolute magic, rearrange those blocks.
}
//----------------------------------
function reorderItemsWithFlexbox() {
    console.log("reordering items");
    // 1. Define your desired order using unique keywords from the image sources.
    const desiredOrder = ['table', 'boot', 'sapp-boot'];
    // 2. Grab all the elements you want to sort.
    const nodeList = document.querySelectorAll(ITEM_WRAPPER_CLASS);
    const itemsToTags = Array.from(nodeList).map(el => el);
    // If there's nothing to sort, we can stop.
    if (itemsToTags.length === 0) {
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
    for (let i = 0; i < itemsToTags.length; i++) {
        const item = itemsToTags[i];
        const itemName = _getElementsImageName(item, ".item-images", "Item image"); // e.g. 'sapp-boot'
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
        console.log(`Just set the order of ${itemName} to ${order}`);
    }
    console.log("reordered items");
}
// Show the sort overlay
function handleSortClickedNew() {
    console.log("handle sort new clicked..");
    const overlay = document.getElementById('sortOverlay');
    if (overlay) {
        overlay.style.display = 'block';
    }
}
// Hide the sort overlay
function closeSortOverlay() {
    const overlay = document.getElementById('sortOverlay');
    if (overlay) {
        overlay.style.display = 'none';
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
    closeSortOverlay();
    console.log('Price high to low selected');
    // Add your sort logic here
}
function handleLowHighClicked() {
    closeSortOverlay();
    console.log('Price low to high selected');
    // Add your sort logic here
}
function handleDateAddedClicked() {
    closeSortOverlay();
    console.log('Date added selected');
    // Add your sort logic here
}
// Close overlay with Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeSortOverlay();
    }
});
// Make functions available globally for onclick handlers
window.handleSortClicked = handleSortClicked;
window.handleOverlayClick = handleOverlayClick;
window.handleHighLowClicked = handleHighLowClicked;
window.handleLowHighClicked = handleLowHighClicked;
window.handleDateAddedClicked = handleDateAddedClicked;
