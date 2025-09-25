//The below will be replaced once the website is compiled
<r-dynamicContentLoader> 

document.addEventListener("DOMContentLoaded", setDynamicElementsContent);
// ====================================================

// # Tab seperated categories
// 
// colours 	
	// red 
		// maroon red
	// green 
		// deep green
	// blue
// 
// # Items, tab seperated tags (all of the bottom leaves- so if you have maroon red, won't add red or colours)
// # hmmm how to just say 'all colours'??
	// # because saying 'colours' just means it has more than 0 colours... not all colours...
// 
	// 1) Just do all sub categories ...
// Sapp boot
	// # colours
	// maroon red
	// green
// 
	// # 
// 
// =====================
// Split on tabs
// prevTier = None
// - line by line:
	// # count num. tabs before first non-tab character
	// - currentTier = countNumLeadingTabs()
	// # verify that it is a valid value
	// #	-> Must be 1 more or less than the previous, unless it is 0, in which case you have reached a new category
// 
	// # check if we are onto a new category
	// 
	// # end 
	// - prevTier = currentTier
// 
// # this will build:
// {
	// "colours":{
		// "red":
			// {"maroon red":None}
		// }
// }
// 
// =======================

// ====================================================================
// LOADING DATA
// ====================================================================
const CATEGORIES_FILE: string = "<root>/config/categories";

// Define a type for the category tree structure
type CategoryNode = {
  [key: string]: CategoryNode | null;
};

// Define a specific return type for category lists
type CategoryList = string[];

class Categories {
	/*
	This class mainly exists so that we can fetch categories easily

	This class stores a collection of useful functions, which can be used to process the categories map.
	*/

	static getSubcategories(categories: CategoryNode, parent: string | null): CategoryList | null {
		/*
		@return (string) all subcategories of the given parent category
		e.g. parent=colur; => return = red, blue, yellow

		if parent is None, it returns tier 1 / top-level categories. 
		*/
		return null;
	}
}

class CategoryGetter {
	/*
	Used to get a map of maps of categories, from an input file in tab-seperated-category format.

	e.g. 
	Assume the input file is in a valid tab-seperated-category format:
	```
	colours 	
			red 
				maroon red
			green
	```
	Then after the functions within the class process it, we will get the map of maps:
	```
	{
		"colours":{
			"red": {"maroon red":null},
			"green":null
		}
	}

	```
	*/

	async getCategories(): Promise<CategoryNode> {
		const lines: string[] = await readFileLineByLine(CATEGORIES_FILE);

		let lineNum: number = 0;
		let categoriesMap: CategoryNode = {};
		
		// Simplified implementation - actual logic would be more complex
		lines.forEach(line => {
			[lineNum, categoriesMap] = this._processLineForCategory(line, lineNum, 0, categoriesMap);
		});
		
		return categoriesMap;
	}

	_processLineForCategory(line: string, lineNum: number, prevTier: number, categoriesMap: CategoryNode): [number, CategoryNode] {
		/*
		Generates a map of maps, representing the categories and each of their [possibly many] subcategories
		e.g. 
		If the following text is fed into this function line by line:
		```
		colours 	
			red 
				maroon red
			green 

		```
		Then, after the last line is passed, this function will return:
		```
		{
			"colours":{
				"red":
					{"maroon red":null}
				},
				"green":null
			}
		}
		```
		@param line = the current text that we are processing. Should follow the tab-seperated-category format.
		@param lineNum = the currentLine number that we are processing
		@param prevTier = the tier (i.e. defined by num. tabs) of the previous line. 
						   e.g. If we are processing '	red' then the previous tier would be 1
						   e.g.2. If we are processing '		maroon red' then the previous tier would be 2
		*/
		const currentTier: number = countLeadingTabs(line);

		// verify that it is a valid value
		if (!tierIsValid(currentTier, prevTier)){
			throw new Error(`Error when parsing categories: line ${line} (the ${lineNum} th line we processed), has an invalid number of tabs preceding it. \n Rule: it must either: (1) Have 0 tabs (indicating a new top-level category); (2) Have the same number of tabs as the line above it; (3) Have one more tab than the line above it; (4) Have one less tab that the line above it.\n This line had ${currentTier} tabs. The line above had ${prevTier} tabs.\nSolutions: (1) Update the categories configuration file found at: ${CATEGORIES_FILE} . Update the line mentioned in this error message to have a valid number of leading tabs.`);
		}

		// Add to map
		// --> If currentTier is 1, just add a new entry to the map. If entry already exists, throw error.
		// --> If currentTier is not 1, need to find what the parent entry would be, then add a new map there.
		// ideally need to know the previousTier's full path.
		// e.g. if we know the the previous was: ["colours"]["red"], then we know:
		//	-> If same tier: we add new map to ["colours"]
		//	-> If higher tier: we add new map to the root
		//	-> If lower tier: we add new map to ["colours"]["red"]
		//	-> If currentTier is 0: we add new map to the root
		// TODO add this logic!
		
		// end 
		prevTier = currentTier;

		//move onto the next line
		lineNum++;

		return [lineNum, categoriesMap];
	}
}

// ====================================================================
// UTILS
// ====================================================================

function countLeadingTabs(text: string): number {
	/* 
	@return the number of leading tabs 
	e.g. 
	console.log(countLeadingTabs("\t\tHello")); // 2
	console.log(countLeadingTabs("Hello")); // 0
	console.log(countLeadingTabs("\t\t\tTest\t")); // 3 (only counts leading tabs)
	*/ 
    const match = text.match(/^[\t]*/);
    return match ? match[0].length : 0;
}

async function readFileLineByLine(url: string): Promise<string[]> {
	/*
	@return [promise] String list of the lines of a file. Each entry in the list represents one line, in order.
	*/ 
	const res = await fetch(url);
	const text = await res.text();
	return text
		.split('\n')
		.map(line => line.trim())
		.filter(line => line && !line.startsWith('#'));
}

function tierIsValid(currentTier: number, previousTier: number): boolean {
	/*
	-> Must be 1 more or less than the previous, unless it is 0, in which case you have reached a new category
	if !( (currentTier == prevTier) || 
		   (currentTier == prevTier - 1) || 
		   (currentTier == prevTier + 1) || 
		   (currentTier == 0)):
	*/
	if (currentTier == previousTier){
		// if we are in the same tier as the previous
		return true;
	}
	if (currentTier == previousTier - 1){
		// if we have moved down into a tier below the previous
		return true;
	}
	if (currentTier == previousTier + 1){
		// if we have gone back up to the tier above the previous
		return true;
	}
	if (currentTier == 0){
		// valid if we are starting a completely new tier
		return true;
	}

	return false;
}

// ====================================================================
// CONSTRUCTING RUNTIME HTML
// ====================================================================

const filterCategories: string[] = ["shoes", "allColours", "tables"]; 
// shoes all?
// shoes categories?
// shoes -> categories

//--content getters--

//tier 1
async function contentGetter_category_filter(): Promise<string> {
	/*
	Returns the html for the filter (used to filter which items are displayed on screen)
	*/

	// == Everything above the category squares ==
	//----------------------

	let tableHtml: string = `
	<div class="filter-outer-grid">
		<div class="filter-squares-wrapper">
	`;


	// == Add the category squares ==
	//----------------------

	let currentTier: number = 0;

	console.log("START table html: " + tableHtml)

	/*
	if currentTier == 0{
		// show the 'everything' tile
		tableHtml += "<div> Everything </div>"; 
	}
	if currentTier == 1{
		currentTierCategories = Categories.getSubcategories(categories, null)
	}
	if currentTier > 1{	
		continue
		//for each parentCategory:
			//getChildCategories
	}
	*/

	// HERE WE ARE STORING THE ACTUAL CATEGORIES/SUBCATEGORIES THAT HAVE BEEN SELECTED

	//const tier_1_filters: CategoryNode = get_test_categories();
	//for (const _ of Object.keys(tier_1_filters)) {
		//tableHtml += await get_filter_tile();
	//}

	const all_filters: CategoryNode = await get_categories();  // Note the await here
    const filterTilePromises: Promise<string>[] = Object.keys(all_filters).map(async (key: string) => get_filter_tile(key)); //process in parallel
    const filterTiles: string[] = await Promise.all(filterTilePromises);

	console.log("-> Just got all of the filters: " + filterTiles)

    tableHtml += filterTiles.join('');

	console.log("-> out after adding the tiles:"+ tableHtml)

	//== Close everything ==
	//----------------------

	// Close the filter squares wrapper
	tableHtml += "</div>";

	// search button
	tableHtml += "<div class='search-button>'></div>";

	// Close the filter outer grid 
	tableHtml += "</div>";

	return tableHtml;
}

async function get_filter_tile(filterFileName : string): Promise<string> {
	/*
	Returns a single tile, used as part of the filtering system when a user is looking at the items 
	@param filterFileName the name of the file within the <root>/shared/images/filtering/filters directory 

	*/
    let fullFilterImgPath = "<root>/shared/images/filtering/filters/" + filterFileName

	let tile_html: string = "<div class='filter-tile'>";
	//tile_html += "	<img class='filter-tile-bg-water' src='<root>/shared/images/filtering/water-half-full.avif' alt='filtering test tubes water'>";
	tile_html += "	<img class='filter-tile-bg-test-tube' src='<root>/shared/images/filtering/test-tube-half.avif' alt='filtering test tube'>";
	tile_html += "		<div class='filter-tile-content'>";

	tile_html += await get_test_tube_sticker();


	// close off filter tile content
	tile_html += "	</div>";
	// close off the filter tile
	tile_html += "</div>";
	
	return tile_html;

	
}

async function get_categories():Promise<CategoryNode>{
	const categories: CategoryNode = {
			"all-colours.avif":{
				"black.avif":null,
				"orange.avif":null,
				"purple.avif":null,
				"red.avif":null,
				"brown.avif": null
			},
			"boot.avif":null,
			"shoe.avif":null,
			"table.avif":null
	};

	// each of the above is the name of a file within the <root>/shared/images/filtering/filters directory
	// it is assumed that whatever code uses these will implicitly prepend the name of the entry with the above path, in order to be able to show the associated image itself.

	return categories
}

async function get_test_tube_sticker(): Promise<string> {
	/*
	   returns the 'sticker' that goes on the front of the test tube

	   i.e. this is for the filtering of the products. the sticker contains the image of the item, and then options to filter all or filter none
   */
    let tile_html : string = "";

	tile_html = "<div class=filter-tile-sticker>"

	// Add the header
	tile_html += await get_icon_of_thing_being_filtered_for();

	tile_html += "</div>";

	return tile_html;
}

async function get_icon_of_thing_being_filtered_for(): Promise<string> {
	/*
	@return the html for the thing being filtered (e.g. a picture of a shoe)
	*/

	const infoImagePath: string = "<root>/shared/images/filtering/info-icon.avif";
	const filterTileImage: string = "<root>/shared/images/filtering/filter-shoe.avif";

	let tile_heading_html: string = "<div class='filter-tile-img-wrapper'>";
	tile_heading_html += "	<div class='info-img-wrapper'>"
	tile_heading_html += `		<img class='info-img' src='${infoImagePath}' alt='info'>`;
	tile_heading_html += `	</div>`;
	tile_heading_html += `	<div class='centre-wrapper'> <img class='filter-icon' src='${filterTileImage}' alt='filter-img'> </div>`;
	tile_heading_html += "</div>";

	return tile_heading_html;
}

// ====================================================================
//TESTING 
// ====================================================================

interface ExpectedOutput {
	html: string;
}

async function test_categories_builder(): Promise<void> {
	const categories: CategoryNode = get_test_categories();
	const expectedOutput: ExpectedOutput = {
		html: `
		todo add the expected here
	`
	};
	const actualOutput: string = await contentGetter_category_filter();
	// Comparison code would go here
}

function get_test_categories(): CategoryNode {
	const categories: CategoryNode = {
			"colours":{
				"red":{
					"maroon red": null
				},
				"green": null
			},
			"shoes":null,
			"bikes":{
				"fast":null,
				"folding":null
			},
			"another":null,
			"another1":null,
			"another2":null,
			"another3":null,
			"another4":null,
			"another5":null,
			"another6":null,
			"another7":null,
			"another8":null,
			"another9":null,
			"another11":null,
			"another12":null,
			"another13":null,
			"another14":null,
			"another21":null,
			"another22":null,
			"another23":null,
	};
	return categories;
}



// NEW CODE
// HERE WE ARE GETTING THE CATEGORIES TO BE DISPLAYED ON THE SCREEN

let currentTier: number = 0;

/*
if (currentTier == 0) {
	// show the 'everything' tile
}
if (currentTier == 1) {
	const currentTierCategories: CategoryList | null = Categories.getSubcategories(categories, null);
}
if (currentTier > 1) {	
	// for each parentCategory:
	//     getChildCategories
}
*/

// HERE WE ARE STORING THE ACTUAL CATEGORIES/SUBCATEGORIES THAT HAVE BEEN SELECTED
// ...


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// TODO NEW IDEA!!!!!!!!!!!!!!
// instead of having 'all or none' at the top, instead just have that as the true, top-level (e.g. level 0?) category.
// 	Then that would mean that each category, which has a child category, would then have the same boxes:
// 		- all
// 		- some    <<<-- perhaps this option only shows if some are selected?
// 		- none
// 		????????????

// 	Then perhaps, when showing tiers 2 and higher, you show the parent category, and then all of the subcategories under it? (to show that link?)

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


// LANGUAGE STUFF


function openLanguageBox() {
    const desktopWrapper = document.querySelector(".index-content-wrapper-DESKTOP") as HTMLElement | null;
    const mobileWrapper = document.querySelector(".index-content-wrapper-MOBILE") as HTMLElement | null;
    const changeWrapper = document.querySelector(".change-language-wrapper") as HTMLElement | null;

    if (desktopWrapper) desktopWrapper.style.display = "none";
    if (mobileWrapper) mobileWrapper.style.display = "none";
    if (changeWrapper) changeWrapper.style.display = "flex";

}
