// TODO:
// - continue with filterItems. Convert pseudocode into typescript.
// - update the allTagsForItem group to use the new map instead...
// -~~ yeah for the new item name thing, just split on the last dot...
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
const HEADER_FILTER_TILE_HTML_WRAPPER_CLASS = '.filter-top-bar-option'; // HTML 'class' of the div that wraps: a header filter
const REGULAR_FILTER_TILE_HTML_WRAPPER_CLASS = '.filter-tile'; // HTML 'class' of the div that wraps: A filter element
const ITEM_WRAPPER_CLASS = ".table-entry"; // HTML 'class' of the div that wraps: An item that the user may buy.
const ITEM_IMAGE_CLASS = ".item-images"; // HTML 'class' of the img that: contains the item's image
const REGULAR_ITEM_SELECT_WRAPPER_CLASS = ".filter-tile";
const FILTER_TILE_IMAGE_CLASS = ".filter-icon";
const FILTER_BUTTON_CLASS = ".filter-search-button";
//----------------------------------------------------------------------------------
/**
 * A record of available filter tiers and their selection state.
 * Each key represents a filter name in dot notation.
 */
// const filterTiers: Record<string, boolean> = {
// "all": false,
// "shoe": false,
// "boot": false,
// "table": false,
// "boot.ski_boot":false,
// };
const filterTiersNew = {
    "": {
        "all": false,
        "shoe": false,
        "boot": false,
        "table": false,
        "colours": false,
    },
    "colours": {
        "red": false,
        "orange": false,
        "black": false,
        "brown": false,
        "purple": false,
    }
};
const itemsToTagsNew = {
    'sapp-boot': {
        '': ['shoe', 'boot'], //represents 'shoe', 'boot'
        'colours': ['red', 'orange'], //represents 'colours.red', 'colours.orange'
    },
    'boot': {
        '': ["shoe", "boot"],
        'colours': ["brown", "black"],
    },
    'table': {
        '': ['table'],
        'colours': ['brown']
    }
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
    const topLevelTiers = Object.keys(filterTiersNew['']); // e.g. [shoes,boots,tables]
    const filterTiles = _get_fresh_filter_tiles(REGULAR_FILTER_TILE_HTML_WRAPPER_CLASS);
    // Show only the tiles that match the top-level tiers
    filterTiles.forEach((tile) => {
        const category = _getCategoryOfClickedItem(tile); //e.g. colours.orange
        if (category && topLevelTiers.indexOf(category) !== -1) {
            const deleteme_category = _getCategoryOfClickedItem(tile); //e.g. colours.orange
            console.log(`....showing(2) : ${deleteme_category}`);
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
    console.log(`\n\n.....`);
    let newTileState = _updateTheFilterImage(element, isSelected); //e.g. 'false' if the tile was 'unselected' when it was initially clicked
    _updateSelectedState(element, newTileState);
    // i.e. If this is the first click; NOT part of a cascading update... perform the cascading update...
    if (isSelected === undefined) {
        _updateDescendentsAndAncestors(element, newTileState);
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
    console.log(`updating the filter image`);
    if (isSelectedState === undefined) {
        // if next img is none, that means that this is just a regular tile click
        // Therefore, we need to determine what the next state is and set the image accordingly.
        // Conversly, if the next image is an actual image page, that means that this filter tile hasn't been directly clicked, but rather, one of its parents / ancestors has, and so we are updating
        // if to match its parent / ancestor.
        // NEW NEW NEW
        isSelectedState = _isFilterTileSelected(element);
        console.log(`--> UNDEFINED) filter state is undefinined... but has current status: ${isSelectedState}`);
        isSelectedState = !isSelectedState;
    }
    if (isSelectedState) {
        console.log(`			true, so making the element look selected...`);
        _updateFilterTileToLookSelected(element);
    }
    else {
        console.log(`			false, so making the element look unselected...`);
        _updateFilterTileToLookUnselected(element);
    }
    console.log(`returning the selected state: ${isSelectedState}`);
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
    let containsSelected = element.classList.contains('selected');
    return containsSelected;
}
/**
 * Updates the selection state (i.e. true for selected; false for not selected) of a filter
 * i.e. Updates the 'filterTiers' map.
 * @param element - The HTML element representing a filter tile.


 Updates the local lists in this javascript which store the states of everything
 */
function _updateSelectedState(element, isSelected) {
    // getting the name of the thing being filtered for
    const thingBeingFilteredFor = _getCategoryOfClickedItem(element); //e.g. colours.orange
    // -- seperate into before and after the last dot --
    const lastDotIndex = thingBeingFilteredFor.lastIndexOf('.');
    const parentGroupKey = lastDotIndex === -1 ? '' : thingBeingFilteredFor.substring(0, lastDotIndex); // If no dot is found (returns -1), the parent group is '', otherwise it's the part before the dot
    const childKey = lastDotIndex === -1 ? thingBeingFilteredFor : thingBeingFilteredFor.substring(lastDotIndex + 1);
    if (!filterTiersNew[parentGroupKey]) {
        filterTiersNew[parentGroupKey] = {};
    }
    // -- update the map --
    console.log(`(bbbbbbbbb) Updating the value of ${parentGroupKey} -> ${thingBeingFilteredFor} to ${isSelected}.. `);
    filterTiersNew[parentGroupKey][childKey] = isSelected;
    console.log(`Here is the udpated map: ${JSON.stringify(filterTiersNew)}`);
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
    const whatThatTileFiltersFor = _getCategoryOfClickedItem(element); //e.g. colours.orange
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
        // get all entries from filterTiersNew that have the parentFilterThatWasClicked as an ancestor
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
        if (parentFilterThatWasClicked === "all") {
            // --- Start of Updated Code ---
            // Replaced Object.values().flatMap() with a compatible Object.keys().reduce()
            // to flatten all keys from the inner objects into a single array.
            const allTiers = Object.keys(filterTiersNew).reduce((accumulator, key) => {
                return accumulator.concat(Object.keys(filterTiersNew[key]));
            }, []);
            // --- End of Updated Code ---
            return allTiers.filter(key => key !== 'all');
        }
        // const descendantTiers: string[] = [];
        // const prefix = parentFilterThatWasClicked + '.';
        // 
        // // Iterate over the parent groups in the new structure
        // for (const groupKey in filterTiersNew) {
        // // A group contains descendants if its own key IS the parent we're looking for,
        // // OR if its key STARTS WITH the parent's prefix (for deeper nesting).
        // if (groupKey === parentFilterThatWasClicked || groupKey.startsWith(prefix)) {
        // // Add all the full-path keys from this matching descendant group
        // descendantTiers.push(...Object.keys(filterTiersNew[groupKey]));
        // }
        // }
        // 
        // return descendantTiers;
        const descendantTiers = [];
        const prefix = parentFilterThatWasClicked + '.';
        // Iterate over the parent groups in the new structure
        for (const groupKey in filterTiersNew) {
            // A group contains descendants if its own key IS the parent we're looking for,
            // OR if its key STARTS WITH the parent's prefix (for deeper nesting).
            if (groupKey === parentFilterThatWasClicked || groupKey.startsWith(prefix)) {
                const childGroup = filterTiersNew[groupKey];
                // For each child key, reconstruct the full path
                for (const childKey in childGroup) {
                    // If groupKey is empty string, don't add a dot prefix
                    const fullKey = groupKey === '' ? childKey : `${groupKey}.${childKey}`;
                    descendantTiers.push(fullKey);
                }
            }
        }
        return descendantTiers;
    }
    function _getAllAncestors(childFilterThatWasClicked) {
        // get all entries from filterTiersNew that have the childFilterThatWasClicked as a descendant
        // @return an array of the ancestor's names
        // If there are no dots, there are no ancestors
        if (childFilterThatWasClicked.indexOf('.') === -1) {
            return [];
        }
        const parts = childFilterThatWasClicked.split('.');
        const ancestors = [];
        // Build potential ancestor prefixes: "a", "a.b", "a.b.c", ...
        // We loop up to length - 1 because the full string itself is not an ancestor.
        for (let i = 1; i < parts.length; i++) {
            const potentialAncestor = parts.slice(0, i).join('.');
            // --- Start of updated logic ---
            // Now, we check if this potential ancestor actually exists in our new map.
            const lastDotIndex = potentialAncestor.lastIndexOf('.');
            const parentGroupKey = lastDotIndex === -1
                ? ''
                : potentialAncestor.substring(0, lastDotIndex);
            // Check if the parent group exists and if the key is defined within that group.
            if (filterTiersNew[parentGroupKey] && filterTiersNew[parentGroupKey][potentialAncestor] !== undefined) {
                ancestors.push(potentialAncestor);
            }
            // --- End of updated logic ---
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
// =====================================
// HANDLE THE FILTER ICON BEING CLICKED
// ====================================
function filterFurtherClicked(element) {
    /*
       Activated when the user clicks the small filter icon, which is present underneath one of the filter tiles.
       This icon is used to filter down the sub categories of a filter (e.g. if the filter icon is underneath the 'all colours' option, then after clicking,
       It will show the seperate colours (red; blue; green; etc), for you to filter.
       */
    event.stopPropagation(); // Prevent the click from bubbling to parent
    // e.g. lets assume that the filter of the tile with name "all.colours.orange" was clicked
    // GET THE FILTER THAT WAS CLICKED
    // ====================
    const categoryBeingFilteredFurther = _getCategoryOfClickedItem(element); //e.g. colours.orange
    // UPDATE THE HEADERS TO SHOW THE THING THAT WAS CLICKED
    // ====================
    HEADER_FILTERS.push(categoryBeingFilteredFurther); //e.g. after running, HEADER_FILTERS=["all.colours", "all.colours.orange"]
    // GET THE CHILDREN TIERS
    // ====================
    let childTiers = _getAllChildren(categoryBeingFilteredFurther); //e.g. ["all.colours.orange.tangerine", "all.colours.orange.tangerine"]
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
    // get all entries from filterTiersNew that have the parentFilterThatWasClicked as a parent
    // (i.e., direct children, not grandchildren)
    // e.g. if 'tables.colours' was the parent, then the tier may be:  
    // const childTiers = ["tables.colours.red",
    // 						"tables.colours.blue",
    // 						"tables.colours.yellow",
    // 						"tables.colours.orange]
    // but 'tables.colours.blue.lightblue' or 'tables.colours.orange.tangerine.juicy' wouldn't.
    if (parentFilterThatWasClicked === "all") {
        // The "children" of "all" are the top-level filters.
        // In the new structure, these are the keys of the object at the '' key.
        // We also need to exclude 'all' itself from the list.
        const topLevelGroup = filterTiersNew[''];
        // Return the keys, filtered, or an empty array if the group doesn't exist.
        return topLevelGroup ? Object.keys(topLevelGroup).filter(key => key !== 'all') : [];
    }
    else {
        // For any other parent, its direct children are the keys of the object
        // stored at the parent's own key.
        const childGroup = filterTiersNew[parentFilterThatWasClicked];
        if (!childGroup) {
            return [];
        }
        // Reconstruct full keys by prepending the parent with a dot
        return Object.keys(childGroup).map(childKey => `${parentFilterThatWasClicked}.${childKey}`);
    }
}
// ===========================================
// REVERSE REVERSE 
// ===========================================
function _findFilterElementByName(filterName) {
    /*
    Find the HTML element that corresponds to a given filter name
    This is the reverse of _findFilterElementByName - instead of getting the name from the element,
    we're finding the element from the name
    */
    // Get all filter sticker elements
    const filterElements = document.querySelectorAll(REGULAR_ITEM_SELECT_WRAPPER_CLASS);
    // Check each element to see if it matches our target filter name
    for (const element of filterElements) {
        const elementFilterName = _getCategoryOfClickedItem(element); //e.g. colours.orange
        if (elementFilterName === filterName) {
            return element;
        }
    }
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
        const category = _getCategoryOfClickedItem(tile); //e.g. colours.orange
        // Since the tiles are in order, we can just check whether each is equal to the current sub filter element
        let currentHeaderFilter = HEADER_FILTERS[HEADER_FILTERSPointer];
        if (category === currentHeaderFilter) {
            const deleteme_category = _getCategoryOfClickedItem(tile); //e.g. colours.orange
            console.log(`....showing(3) : ${deleteme_category}`);
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
    const headerClicked = _getCategoryOfClickedItem(element); //e.g. colours.orange
    // ======================================================================
    if (HEADER_FILTERS.indexOf(headerClicked) === -1) { // header not found
        console.warn("CLICKED HEADER FILTER 'return/move up to this tier' NOT FOUND IN THE HEADERS LIST!", HEADER_FILTERS);
        return; // or handle accordingly
    }
    // ======================================================================
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
    // ======================================================================
    filterFurtherClicked(element);
    // // UPDATE THE HEADERS TO SHOW THE THING THAT WAS CLICKED
    // // ====================
    // HEADER_FILTERS.push(headerClicked); //e.g. after running, HEADER_FILTERS=["all.colours"]
    // 
    // // GET THE CHILDREN TIERS
    // // ====================
    // let childTiers: string[] = _getAllChildren(headerClicked) //e.g. ["all.colours.orange", "all.colours.blue"]
    // console.log(`>>>> child tiers: ${childTiers}`);
    // 
    // 
    // // if there are no child tiers, we should throw an error, as the filter icon should only be visible when child tiers are available!
    // if(childTiers.length === 0){
    // console.warn("ERROR! The filter icon should not have been clickable as there are no child tiers available!");
    // return null;
    // }
    // 
    // // HIDE CURRENT TILES, AND THEN UNHIDE EACH OF THE CHILDREN
    // //=========================================================
    // _updateVisibleFilterTiles(childTiers)
    // 
    // // UPDATE THE HEADER
    // //=========================================================
    // _updateFilterHeader()
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
        const deleteme_hiding = _getCategoryOfClickedItem(tile); //e.g. colours.orange
        console.log(`....hiding(4) : ${deleteme_hiding}`);
        tile.style.display = 'none';
    });
    // Then, show only the tiles that match the childTiers
    filterTiles.forEach((tile) => {
        const category = _getCategoryOfClickedItem(tile); //e.g. colours.orange
        if (!category) {
            console.warn("ERROR CATEGORY COULDN'T BE FOUND");
            return;
        }
        if (childTiers.indexOf(category) === -1) {
            console.log(`<<<<<<<<<<<<<<<<<<<<<<2 Element: '${category}' is not in the child tiers: ${JSON.stringify(childTiers)} `);
            return;
        }
        const deleteme_category = _getCategoryOfClickedItem(tile); //e.g. colours.orange
        console.log(`....showing(4) : ${deleteme_category}`);
        tile.style.display = ''; // Reset to default display value
    });
}
function _getParentName(name) {
    // e.g. for 'colours.orange' -> parent group = 'colours'
    const lastDotIndex = name.lastIndexOf('.');
    return lastDotIndex === -1 ? '' : name.substring(0, lastDotIndex);
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
        const deleteme_category = _getCategoryOfClickedItem(tile); //e.g. colours.orange
        console.log(`....hiding: ${deleteme_category}`);
        tile.style.display = 'none';
    });
    return filterTilesArray;
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



    LAWS:
    - A group = filters that all have a shared parent.
        e.g. 'colours.red', 'colours.blue' are in a group as they have the same parent 'colours'
    - If all filters in a group are false, treat that as the entire group being true. (if not filtering for something specific, show everything)
    - For each tag that an item has:
        - for the item to show: The tag has to be true OR one of the other tags in the group needs to be true


--------------------------------------------------

                
    For each item:
        shouldShow=True
        For each tag group it has (e.g. [colours.red//colours.blue], [shoe/boot])
            If all of the filters for that group are False or they are all True:
                Skip           //no filters applied for this particular category, so don't worry
            If any of those value are true:
                Skip           //user has filtered for that thing, so we are alright

            // if we get to this point, it means that none of the filters we have tagged for this item have been selected by the user
            // so we need to hide this item
            HIDE


   */
    console.log("SSSSSSSSSSSSSSSSSSS");
    console.log(`Filter tiers new: ${JSON.stringify(filterTiersNew)}!`);
    console.log(`1`);
    // 1) 
    const allTableEntries = _get_fresh_filter_tiles(ITEM_WRAPPER_CLASS);
    console.log(`2 `);
    for (const item of allTableEntries) {
        //e.g. item = the sapp boot element. The entire block wrapped by the ITEM_WRAPPER_CLASS class
        console.log(`=============================`);
        // == get params ===
        const itemName = _getCategoryOfClickedItem(item); //e.g. 'sapp-boot'
        const allTagsForItem = itemsToTagsNew[itemName];
        if (!allTagsForItem) {
            console.error(`[ERROR] No Item tag found for '${itemName}'`);
            console.error('Available item keys:');
            console.error(`${JSON.stringify(itemsToTagsNew)}`);
            continue; // No tags found for this item
        }
        console.log(`Checking whether item: ${itemName} should be shown............`);
        // == determine whether to show ===
        const shouldSee = shouldWeShowItem();
        console.log(`Are we showing the item?   ${shouldSee}`);
        console.log(`All tags for item: ${JSON.stringify(allTagsForItem)}`);
        function shouldWeShowItem() {
            const filterGroups = Object.keys(allTagsForItem);
            for (let i = 0; i < filterGroups.length; i++) {
                const filterGroup = filterGroups[i]; // e.g. filterGroup = 'colours'
                const filterSubGroups = allTagsForItem[filterGroup]; // e.g. filterSubGroups = ['red', 'orange']
                console.log(`==> working with (new): ${filterGroup} and sub: ${filterSubGroups}`);
                const shouldShow = itemPassedFilterGroup();
                function itemPassedFilterGroup() {
                    // get the group:
                    const selectedSubFiltersListForGivenGroup = filterTiersNew[filterGroup];
                    // e.g. selectedSubFiltersListForGivenGroup = {red:false, orange:true, black:true,...}
                    if (!selectedSubFiltersListForGivenGroup) {
                        console.error(`[ERROR] no sub filters found for: ${filterGroup}`);
                        return false;
                    }
                    // 1) For each value, check if that particular value is true. Skip on if any are true (that means user is filtering for them, so we are good)
                    for (let i = 0; i < filterSubGroups.length; i++) {
                        const subGroupTag = filterSubGroups[i];
                        if (selectedSubFiltersListForGivenGroup[subGroupTag] === true) {
                            console.log(`		--> item has a tag: ${subGroupTag} that matches one of the selected filter entries; returning True`);
                            return true;
                        }
                    }
                    console.log(`.... It seems that none of the sub keys in the group: '${JSON.stringify(filterSubGroups)}' are true... here's the proof: '${JSON.stringify(selectedSubFiltersListForGivenGroup)}'`);
                    // 2) Check if all filters are false (which means NO filters are being applied for that group)
                    let allFalse = true;
                    for (const key in selectedSubFiltersListForGivenGroup) {
                        if (selectedSubFiltersListForGivenGroup.hasOwnProperty(key)) {
                            if (selectedSubFiltersListForGivenGroup[key] !== false) {
                                console.log(`		--> The entries in the subgroup are not all false... item: ${key} is not false: ${selectedSubFiltersListForGivenGroup[key]}: ${JSON.stringify(selectedSubFiltersListForGivenGroup)}`);
                                allFalse = false;
                                break;
                            }
                        }
                    }
                    if (allFalse) {
                        console.log(`		--> All filter entries for the group are false; so this item's tag passes; returning true`);
                        return true;
                    }
                    // 3) User has chosen to filter out this item. Hide it. (i.e. don't unhide it!)
                    console.log(`		--> !!! Item has a tag not being filtered for: ; returning False!`);
                    return false;
                }
                if (!shouldShow) {
                    console.log(`		~~> !!! At least one of the tags of the item has not been filtered for by the user... hiding this item.`);
                    return false;
                }
            }
            // only show if all of its tags are being filtered for
            console.log(`		~~> :):):) All tags are being filtered by user. Showing this item.`);
            return true;
        }
        if (shouldSee == true) {
            const deleteme_category = _getCategoryOfClickedItem(item); //e.g. colours.orange
            console.log(`....showing: ${deleteme_category}`);
            item.style.display = ''; // Change it from displaying 'none' to displaying
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
// Show the sort overlay
function handleSortClickedNew() {
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
    // Add your sort logic here
}
function handleLowHighClicked() {
    closeSortOverlay();
    // Add your sort logic here
}
function handleDateAddedClicked() {
    closeSortOverlay();
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
