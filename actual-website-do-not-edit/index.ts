//The below will be replaced once the website is compiled
// Make sure you have Promise support in your tsconfig.json:
// {
//   "compilerOptions": {
//     "target": "es2015",  // or higher
//     "lib": ["dom", "es2015", "es2016", "es2017"] // ensure Promise is included
//   }
// }

async function setDynamicElementsContent(): Promise<void> {
  const prefix: string = "D-";
  const corrContentFuncNameStart: string = "contentGetter_";
  console.log("Loading the dynamic elements...");
  
  // Get all elements that have an id that starts with the prefix that identifies that element as dynamic
  const dynamicElements: NodeListOf<Element> = document.querySelectorAll(`[id^="${prefix}"]`);
  
  // Define the extended Window interface to allow accessing dynamic functions
  interface WindowWithDynamicFunctions extends Window {
    [key: string]: any;
  }
  
  const typedWindow: WindowWithDynamicFunctions = window as WindowWithDynamicFunctions;
  
  for (let i: number = 0; i < dynamicElements.length; i++) {
    // Get the element
    const element: HTMLElement = dynamicElements[i] as HTMLElement;
    
    // Get its ID
    const id: string = element.id;
    console.log("Setting the inner html to loading...");
    
    // Set that element as loading
    element.innerHTML = "Loading...";
    
    // Load expected function name
    // The end of the corresponding content function name 
    const corrContentFuncNameEnd: string = id.replace(new RegExp('^' + prefix), '').replace(/-/g, '_'); // Remove the prefix from the start and replace dashes with underscores
    
    // Corresponding content function name
    const corrContentFuncName: string = corrContentFuncNameStart + corrContentFuncNameEnd;
    
    // Ensure function exists
    console.log("TESTING--------------------------------------------");
    const myFunction: Function | undefined = typedWindow[corrContentFuncName]; // Access the function by name
    
    if (myFunction) {
      console.log("THERE IS A MY FUNCTION");
      try {
        const elementContent: string = await typedWindow[corrContentFuncName]();
        console.log(`Here is the result: ${elementContent}`);
        element.innerHTML = elementContent;
      } catch (error: unknown) {
        const errorMessage: string = error instanceof Error ? error.message : String(error);
        console.error(`Error calling ${corrContentFuncName}: ${errorMessage}`);
        element.innerHTML = "No content available";
      }
    } else {
      console.error(`(1) Function "${corrContentFuncName}" does not exist.`);
      
      if (typeof myFunction === 'function') {
        // Call the function
        console.log("THE FUNCTION EXISTS!!!");
        try {
          const elementContent: string = await typedWindow[corrContentFuncName]();
          console.log(`Here is the proof: ${elementContent}`);
          element.innerHTML = elementContent;
        } catch (error: unknown) {
          const errorMessage: string = error instanceof Error ? error.message : String(error);
          console.error(`Error calling ${corrContentFuncName}: ${errorMessage}`);
          element.innerHTML = "No content available";
        }
      } else {
        console.error(`(2) Function "${corrContentFuncName}" does not exist.`);
      }
      
      console.log("TESTING END --------------------------------------------");
      
      if (!typedWindow[corrContentFuncName] || typeof typedWindow[corrContentFuncName] !== 'function') {
        // Get the list of functions 
        const propNames: string[] = Object.getOwnPropertyNames(window);
        const functionNames: string[] = propNames.filter((prop: string) => typeof typedWindow[prop] === 'function');
        const functionList: string = functionNames.join(', ');
        console.error(`There is no function with the name ${corrContentFuncName}. It was expected that this function exists, since you have an element with the id: ${id}, which is seen to be representing a dynamic element due to starting with the prefix ${prefix}. \n Available functions: ${functionList}`);
        element.innerHTML = "No content available";
        continue;
      }
      
      // Get the new HTML content using that function
      let elementContent: string = "No content available.";
      
      try {
        elementContent = await typedWindow[corrContentFuncName]();
      } catch (error: unknown) {
        const errorMessage: string = error instanceof Error ? error.message : String(error);
        console.error(`There was an error when attempting to fetch the content of element with the id: ${id}, using its corresponding function: ${corrContentFuncName}. The error is as follows: ${errorMessage}`);
        element.innerHTML = "No content available";
        continue;
      }
      
      // Fix for the instanceof Promise issue
      if (typeof elementContent === 'object' && elementContent !== null && 
          typeof (elementContent as any).then === 'function' || 
          String(elementContent) === '[object Promise]') {
        console.error(`There was an error (received a Promise, not content) when attempting to fetch the content of element with the id: ${id}, using its corresponding function: ${corrContentFuncName}.`);
        element.innerHTML = "No content available";
        continue;
      }
      
      console.log(`Got the new html content by calling the function name: ${corrContentFuncName}, before receiving the response: ${elementContent}`);
      
      // Set the element's new content
      element.innerHTML = elementContent;
    }
  }
}

// Declare a more specific type for the dynamic content getter functions
type ContentGetterFunction = () => Promise<string> | string;

// Fix for the recursive interface definition
interface WindowWithContentGetters {
  [key: string]: any;
  [key: `contentGetter_${string}`]: ContentGetterFunction;
}

// Extend the global Window interface
interface Window extends WindowWithContentGetters {}
 

// document.addEventListener("DOMContentLoaded", setDynamicElementsContent);
// // ====================================================
// 
// // ====================================================================
// // LOADING DATA
// // ====================================================================
// const CATEGORIES_FILE: string = "config/categories";
// 
// // Define a type for the category tree structure
// type CategoryNode = {
  // [key: string]: CategoryNode | null;
// };
// 
// // Define a specific return type for category lists
// type CategoryList = string[];
// 
// class Categories {
	// /*
	// This class mainly exists so that we can fetch categories easily
// 
	// This class stores a collection of useful functions, which can be used to process the categories map.
	// */
// 
	// static getSubcategories(categories: CategoryNode, parent: string | null): CategoryList | null {
		// /*
		// @return (string) all subcategories of the given parent category
		// e.g. parent=colur; => return = red, blue, yellow
// 
		// if parent is None, it returns tier 1 / top-level categories. 
		// */
		// return null;
	// }
// }
// 
// class CategoryGetter {
	// /*
	// Used to get a map of maps of categories, from an input file in tab-seperated-category format.
// 
	// e.g. 
	// Assume the input file is in a valid tab-seperated-category format:
	// ```
	// colours 	
			// red 
				// maroon red
			// green
	// ```
	// Then after the functions within the class process it, we will get the map of maps:
	// ```
	// {
		// "colours":{
			// "red": {"maroon red":null},
			// "green":null
		// }
	// }
// 
	// ```
	// */
// 
	// async getCategories(): Promise<CategoryNode> {
		// const lines: string[] = await readFileLineByLine(CATEGORIES_FILE);
// 
		// let lineNum: number = 0;
		// let categoriesMap: CategoryNode = {};
		// 
		// // Simplified implementation - actual logic would be more complex
		// lines.forEach(line => {
			// [lineNum, categoriesMap] = this._processLineForCategory(line, lineNum, 0, categoriesMap);
		// });
		// 
		// return categoriesMap;
	// }
// 
	// _processLineForCategory(line: string, lineNum: number, prevTier: number, categoriesMap: CategoryNode): [number, CategoryNode] {
		// /*
		// Generates a map of maps, representing the categories and each of their [possibly many] subcategories
		// e.g. 
		// If the following text is fed into this function line by line:
		// ```
		// colours 	
			// red 
				// maroon red
			// green 
// 
		// ```
		// Then, after the last line is passed, this function will return:
		// ```
		// {
			// "colours":{
				// "red":
					// {"maroon red":null}
				// },
				// "green":null
			// }
		// }
		// ```
		// @param line = the current text that we are processing. Should follow the tab-seperated-category format.
		// @param lineNum = the currentLine number that we are processing
		// @param prevTier = the tier (i.e. defined by num. tabs) of the previous line. 
						   // e.g. If we are processing '	red' then the previous tier would be 1
						   // e.g.2. If we are processing '		maroon red' then the previous tier would be 2
		// */
		// const currentTier: number = countLeadingTabs(line);
// 
		// // verify that it is a valid value
		// if (!tierIsValid(currentTier, prevTier)){
			// throw new Error(`Error when parsing categories: line ${line} (the ${lineNum} th line we processed), has an invalid number of tabs preceding it. \n Rule: it must either: (1) Have 0 tabs (indicating a new top-level category); (2) Have the same number of tabs as the line above it; (3) Have one more tab than the line above it; (4) Have one less tab that the line above it.\n This line had ${currentTier} tabs. The line above had ${prevTier} tabs.\nSolutions: (1) Update the categories configuration file found at: ${CATEGORIES_FILE} . Update the line mentioned in this error message to have a valid number of leading tabs.`);
		// }
// 
		// // Add to map
		// // --> If currentTier is 1, just add a new entry to the map. If entry already exists, throw error.
		// // --> If currentTier is not 1, need to find what the parent entry would be, then add a new map there.
		// // ideally need to know the previousTier's full path.
		// // e.g. if we know the the previous was: ["colours"]["red"], then we know:
		// //	-> If same tier: we add new map to ["colours"]
		// //	-> If higher tier: we add new map to the root
		// //	-> If lower tier: we add new map to ["colours"]["red"]
		// //	-> If currentTier is 0: we add new map to the root
		// // TODO add this logic!
		// 
		// // end 
		// prevTier = currentTier;
// 
		// //move onto the next line
		// lineNum++;
// 
		// return [lineNum, categoriesMap];
	// }
// }
// 
// // ====================================================================
// // UTILS
// // ====================================================================
// 
// function countLeadingTabs(text: string): number {
	// /* 
	// @return the number of leading tabs 
	// e.g. 
	// console.log(countLeadingTabs("\t\tHello")); // 2
	// console.log(countLeadingTabs("Hello")); // 0
	// console.log(countLeadingTabs("\t\t\tTest\t")); // 3 (only counts leading tabs)
	// */ 
    // const match = text.match(/^[\t]*/);
    // return match ? match[0].length : 0;
// }
// 
// async function readFileLineByLine(url: string): Promise<string[]> {
	// /*
	// @return [promise] String list of the lines of a file. Each entry in the list represents one line, in order.
	// */ 
	// const res = await fetch(url);
	// const text = await res.text();
	// return text
		// .split('\n')
		// .map(line => line.trim())
		// .filter(line => line && !line.startsWith('#'));
// }
// 
// function tierIsValid(currentTier: number, previousTier: number): boolean {
	// /*
	// -> Must be 1 more or less than the previous, unless it is 0, in which case you have reached a new category
	// if !( (currentTier == prevTier) || 
		   // (currentTier == prevTier - 1) || 
		   // (currentTier == prevTier + 1) || 
		   // (currentTier == 0)):
	// */
	// if (currentTier == previousTier){
		// // if we are in the same tier as the previous
		// return true;
	// }
	// if (currentTier == previousTier - 1){
		// // if we have moved down into a tier below the previous
		// return true;
	// }
	// if (currentTier == previousTier + 1){
		// // if we have gone back up to the tier above the previous
		// return true;
	// }
	// if (currentTier == 0){
		// // valid if we are starting a completely new tier
		// return true;
	// }
// 
	// return false;
// }
// 
// // ====================================================================
// // CONSTRUCTING RUNTIME HTML
// // ====================================================================
// 
// const filterCategories: string[] = ["shoes", "allColours", "tables"]; 
// // shoes all?
// // shoes categories?
// // shoes -> categories
// 
// //--content getters--
// 
// //tier 1
// async function contentGetter_category_filter(): Promise<string> {
	// /*
	// Returns the html for the filter (used to filter which items are displayed on screen)
	// */
// 
	// // == Everything above the category squares ==
	// //----------------------
// 
	// let tableHtml: string = `
	// <div class="filter-outer-grid">
		// <div class="filter-squares-wrapper">
	// `;
// 
// 
	// // == Add the category squares ==
	// //----------------------
// 
	// let currentTier: number = 0;
// 
	// console.log("START table html: " + tableHtml)
// 
	// /*
	// if currentTier == 0{
		// // show the 'everything' tile
		// tableHtml += "<div> Everything </div>"; 
	// }
	// if currentTier == 1{
		// currentTierCategories = Categories.getSubcategories(categories, null)
	// }
	// if currentTier > 1{	
		// continue
		// //for each parentCategory:
			// //getChildCategories
	// }
	// */
// 
	// // HERE WE ARE STORING THE ACTUAL CATEGORIES/SUBCATEGORIES THAT HAVE BEEN SELECTED
// 
	// //const tier_1_filters: CategoryNode = get_test_categories();
	// //for (const _ of Object.keys(tier_1_filters)) {
		// //tableHtml += await get_filter_tile();
	// //}
// 
	// const all_filters: CategoryNode = await get_categories();  // Note the await here
    // const filterTilePromises: Promise<string>[] = Object.keys(all_filters).map(async (key: string) => get_filter_tile(key)); //process in parallel
    // const filterTiles: string[] = await Promise.all(filterTilePromises);
// 
	// console.log("-> Just got all of the filters: " + filterTiles)
// 
    // tableHtml += filterTiles.join('');
// 
	// console.log("-> out after adding the tiles:"+ tableHtml)
// 
	// //== Close everything ==
	// //----------------------
// 
	// // Close the filter squares wrapper
	// tableHtml += "</div>";
// 
	// // search button
	// tableHtml += "<div class='search-button>'></div>";
// 
	// // Close the filter outer grid 
	// tableHtml += "</div>";
// 
	// return tableHtml;
// }
// 
// async function get_filter_tile(filterFileName : string): Promise<string> {
	// /*
	// Returns a single tile, used as part of the filtering system when a user is looking at the items 
	// @param filterFileName the name of the file within the shared/images/filtering/filters directory 
// 
	// */
    // let fullFilterImgPath = "shared/images/filtering/filters/" + filterFileName
// 
	// let tile_html: string = "<div class='filter-tile'>";
	// //tile_html += "	<img class='filter-tile-bg-water' src='shared/images/filtering/water-half-full.avif' alt='filtering test tubes water'>";
	// tile_html += "	<img class='filter-tile-bg-test-tube' src='shared/images/filtering/test-tube-half.avif' alt='filtering test tube'>";
	// tile_html += "		<div class='filter-tile-content'>";
// 
	// tile_html += await get_test_tube_sticker();
// 
// 
	// // close off filter tile content
	// tile_html += "	</div>";
	// // close off the filter tile
	// tile_html += "</div>";
	// 
	// return tile_html;
// 
	// 
// }
// 
// async function get_categories():Promise<CategoryNode>{
	// const categories: CategoryNode = {
			// "all-colours.avif":{
				// "black.avif":null,
				// "orange.avif":null,
				// "purple.avif":null,
				// "red.avif":null,
				// "brown.avif": null
			// },
			// "boot.avif":null,
			// "shoe.avif":null,
			// "table.avif":null
	// };
// 
	// // each of the above is the name of a file within the shared/images/filtering/filters directory
	// // it is assumed that whatever code uses these will implicitly prepend the name of the entry with the above path, in order to be able to show the associated image itself.
// 
	// return categories
// }
// 
// async function get_test_tube_sticker(): Promise<string> {
	// /*
	   // returns the 'sticker' that goes on the front of the test tube
// 
	   // i.e. this is for the filtering of the products. the sticker contains the image of the item, and then options to filter all or filter none
   // */
    // let tile_html : string = "";
// 
	// tile_html = "<div class=filter-tile-sticker>"
// 
	// // Add the header
	// tile_html += await get_icon_of_thing_being_filtered_for();
// 
	// tile_html += "</div>";
// 
	// return tile_html;
// }
// 
// async function get_icon_of_thing_being_filtered_for(): Promise<string> {
	// // /*
	// // @return the html for the thing being filtered (e.g. a picture of a shoe)
	// // */
// // 
	// // const infoImagePath: string = "shared/images/filtering/info-icon.avif";
	// // const filterTileImage: string = "shared/images/filtering/filter-shoe.avif";
// // 
	// // let tile_heading_html: string = "<div class='filter-tile-img-wrapper'>";
	// // tile_heading_html += "	<div class='info-img-wrapper'>"
	// // tile_heading_html += `		<img class='info-img' src='${infoImagePath}' alt='info'>`;
	// // tile_heading_html += `	</div>`;
	// // tile_heading_html += `	<div class='centre-wrapper'> <img class='filter-icon' src='${filterTileImage}' alt='filter-img'> </div>`;
	// // tile_heading_html += "</div>";
// // 
	// // return tile_heading_html;
// // }
// // 
// // ====================================================================
// //TESTING 
// // ====================================================================
// 
// interface ExpectedOutput {
	// html: string;
// }
// 
// async function test_categories_builder(): Promise<void> {
	// const categories: CategoryNode = get_test_categories();
	// const expectedOutput: ExpectedOutput = {
		// html: `
		// todo add the expected here
	// `
	// };
	// const actualOutput: string = await contentGetter_category_filter();
	// // Comparison code would go here
// }
// 
// function get_test_categories(): CategoryNode {
	// const categories: CategoryNode = {
			// "colours":{
				// "red":{
					// "maroon red": null
				// },
				// "green": null
			// },
			// "shoes":null,
			// "bikes":{
				// "fast":null,
				// "folding":null
			// },
			// "another":null,
			// "another1":null,
			// "another2":null,
			// "another3":null,
			// "another4":null,
			// "another5":null,
			// "another6":null,
			// "another7":null,
			// "another8":null,
			// "another9":null,
			// "another11":null,
			// "another12":null,
			// "another13":null,
			// "another14":null,
			// "another21":null,
			// "another22":null,
			// "another23":null,
	// };
	// return categories;
// }
// 
// 
// 
// // NEW CODE
// // HERE WE ARE GETTING THE CATEGORIES TO BE DISPLAYED ON THE SCREEN
// 
// let currentTier: number = 0;
// 
// /*
// if (currentTier == 0) {
	// // show the 'everything' tile
// }
// if (currentTier == 1) {
	// const currentTierCategories: CategoryList | null = Categories.getSubcategories(categories, null);
// }
// if (currentTier > 1) {	
	// // for each parentCategory:
	// //     getChildCategories
// }
// */
// 
// // HERE WE ARE STORING THE ACTUAL CATEGORIES/SUBCATEGORIES THAT HAVE BEEN SELECTED
// // ...
// 
// 
// // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// // TODO NEW IDEA!!!!!!!!!!!!!!
// // instead of having 'all or none' at the top, instead just have that as the true, top-level (e.g. level 0?) category.
// // 	Then that would mean that each category, which has a child category, would then have the same boxes:
// // 		- all
// // 		- some    <<<-- perhaps this option only shows if some are selected?
// // 		- none
// // 		????????????
// 
// // 	Then perhaps, when showing tiers 2 and higher, you show the parent category, and then all of the subcategories under it? (to show that link?)
// 
// // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


// LANGUAGE STUFF


function openLanguageBox() {
    const desktopWrapper = document.querySelector(".index-content-wrapper-DESKTOP") as HTMLElement | null;
    const mobileWrapper = document.querySelector(".index-content-wrapper-MOBILE") as HTMLElement | null;
    const changeWrapper = document.querySelector(".change-language-wrapper") as HTMLElement | null;

    if (desktopWrapper) desktopWrapper.style.display = "none";
    if (mobileWrapper) mobileWrapper.style.display = "none";
    if (changeWrapper) changeWrapper.style.display = "inline-flex";


    // Push a new state to history
  history.pushState({ languageBoxOpen: true }, "", "#change-language");
}


// Restore when back button is clicked
window.addEventListener("popstate", (event) => {
  const desktopWrapper = document.querySelector(".index-content-wrapper-DESKTOP") as HTMLElement | null;
  const mobileWrapper = document.querySelector(".index-content-wrapper-MOBILE") as HTMLElement | null;
  const changeWrapper = document.querySelector(".change-language-wrapper") as HTMLElement | null;

  if (event.state?.languageBoxOpen) {
    // If state indicates the language box, show it
    if (desktopWrapper) desktopWrapper.style.display = "none";
    if (mobileWrapper) mobileWrapper.style.display = "none";
    if (changeWrapper) changeWrapper.style.display = "inline-flex";
  } else {
    // Otherwise, revert to original content
    if (desktopWrapper) desktopWrapper.style.display = "grid";
    if (mobileWrapper) mobileWrapper.style.display = "none";
    if (changeWrapper) changeWrapper.style.display = "none";
  }
});


// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================
// SEARCH SEARCH SEARCH
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================

// search.ts (TypeScript safe, pre-ES6 style, minimal)

// <reference path="https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.js" />

// Tell TS that Fuse exists globally
declare var Fuse: any;

interface PageData {
  title: string;
  url: string;
  tags: string[];
}

var pages: PageData[] = [
  { title: "Other resources", url: "http://localhost:8000/blog/other-resources/other-resources.html", tags: ["links","link","other","cool"] },
  { title: "Products Table", url: "http://localhost:8000/blogs.html?category=products&filters=table", tags: ["products","table"] }
];

var fuse: any = null;

// Lazy initialize Fuse
function initFuse(): void {
  if (!fuse) {
    console.log("[search] Initializing Fuse.js");
    fuse = new Fuse(pages, { keys: ["title", "tags"], includeScore: true, threshold: 0.3 });
  }
}

// Perform search
function performSearch(query: string): PageData[] {
  initFuse();
  if (!query) return [];
  var results = fuse.search(query);
  console.log("[search] Found " + results.length + " results for query: " + query);
  var items: PageData[] = [];
  for (var i = 0; i < results.length; i++) {
    items.push(results[i].item);
  }
  return items;
}

// Render results in popup
function renderResults(results: PageData[]): void {
  var popup = document.getElementById("search-results-popup");
  if (!popup) return;

  popup.innerHTML = "";

  if (results.length === 0) {
    popup.innerHTML = `
        <p>Hmmm looks like we didn't find anything...</p>
        <p>Perhaps you could check out our 
          <a href="http://localhost:8000/blogs.html?category=products">new here pages</a>
          or the 
          <a href="http://localhost:8000/blogs.html?category=products">blogs page</a>.
        </p>
      `;
  } else {
    var ul = document.createElement("ul");
    for (var i = 0; i < results.length; i++) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = results[i].url;
      a.textContent = results[i].title;
      // a.target = "_blank";
      li.appendChild(a);
      ul.appendChild(li);
    }
    popup.appendChild(ul);
  }

  showResultsPopup();
}

// Show popup
// function showResultsPopup(): void {
  // var popup = document.getElementById("search-results-popup");
  // if (!popup) return;
// 
  // popup.classList.remove("hidden");
// 
  // var overlay = document.createElement("div");
  // overlay.className = "search-results-overlay";
  // document.body.appendChild(overlay);
// 
  // overlay.addEventListener("click", function() {
    // popup.classList.add("hidden");
    // document.body.removeChild(overlay);
  // });
// }


function showResultsPopup(): void {
  var popup = document.getElementById("search-results-popup");
  if (!popup) return;

  popup.classList.remove("hidden");

  // Create overlay to darken background and detect clicks outside
  var overlay = document.createElement("div");
  overlay.className = "search-results-overlay";
  document.body.appendChild(overlay);

  // Optional: remove overlay if user clicks outside
  overlay.onclick = function() {
    popup.classList.add("hidden");
    document.body.removeChild(overlay);
  };

  // Add close button
  var closeBtn = document.createElement("button");
  closeBtn.textContent = "×"; // simple "X"
  closeBtn.className = "search-close-button";

  closeBtn.onclick = function() {
    popup.classList.add("hidden");
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  };

  popup.appendChild(closeBtn);
}

// Handle search
// function handleSearch(): void {
  // var input = document.getElementById("main-search") as HTMLInputElement | null;
  // if (!input) return;
// 
  // var query = input.value.trim();
  // if (!query) return;
// 
  // console.log("[handleSearch] Searching for:", query);
  // var results = performSearch(query);
  // renderResults(results);
// }


function handleSearch(): void {
  var input = document.getElementById("main-search") as HTMLInputElement | null;
  if (!input) return;
  var query = input.value.trim();
  if (!query) return;

  // Load Fuse.js lazily, then perform search
  loadSearchLibrary(function() {
    console.log("[handleSearch] Performing search after library loaded");
    var results = performSearch(query);
    renderResults(results);
  });
}

// Setup events
function setupSearchEvents(): void {
  var searchIcon = document.querySelector(".search-icon") as SVGElement | null;
  var searchInput = document.getElementById("main-search") as HTMLInputElement | null;

  if (searchIcon) searchIcon.onclick = handleSearch;
  if (searchInput) {
    searchInput.onkeypress = function(e: KeyboardEvent) {
      var key = e.key || e.keyCode;
      if (key === "Enter" || key === 13) handleSearch();
    };
  }
}

// Initialize
window.onload = function() {
  console.log("[init] Initializing search system");
  setupSearchEvents();
};


// Hide popup on ESC key
document.addEventListener(
  "keydown",
  function(e: KeyboardEvent) {
    if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {
      // keep the default blur/focus behavior
      console.log("[Esc] Closing search popup");

      var popup = document.getElementById("search-results-popup");
      if (popup && !popup.classList.contains("hidden")) {
        popup.classList.add("hidden");

        // remove overlay if present
        var overlay = document.querySelector(".search-results-overlay");
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }
    }
  },
  true // capture phase ensures this runs before input handles it
);



function loadSearchLibrary(callback: () => void) {
  if ((window as any).Fuse) {
    callback();
    return;
  }

  var script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.js";
  script.onload = callback;
  document.body.appendChild(script);
}

// Expose for inline onclick
(window as any).runSearch = handleSearch;

