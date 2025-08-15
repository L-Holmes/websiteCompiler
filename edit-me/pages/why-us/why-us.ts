document.addEventListener("DOMContentLoaded", setDynamicElementsContent);

//--content getters--

async function contentGetter_text_lines() {
	return "<h1> This surrrreeellllyyyy is the dynamic content </h1>"
}


async function contentGetter_loaded_txt() {
	return "loaded text yaaa"
	/*j
	try{
		fileContents = loadFileContents()
	} catch (error) {
		throw error;
	}
	return `${fileContents}`
	*/
}


//////////////////////////
//GROTE FUNCTIONS
//////////////////////////

//start of -----------------------------------------------------
<r-dynamicContentLoader>
//end of -----------------------------------------------------


//////////////////////////
//KLEINE FUNCTIONS
//////////////////////////

/**
 * Load the contents of a text file asynchronously.
 * @param {string} filePath - The path to the text file.
 * @returns {Promise<string>} - A promise that resolves with the file contents.
 */
async function loadFileContents(filePath) {
	try {
		const response = await fetch(filePath);
		if (!response.ok) {
			throw new Error(`Error fetching file: ${response.status} ${response.statusText}`);
			return null
		}
		const fileContents = await response.text();
		return fileContents;
	} catch (error) {
		console.error('Error loading file:', error);
		throw error;
	}
}

/**
 * Split the file contents into separate lines.
 * @param {string} fileContents - The contents of the text file.
 * @returns {string[]} - An array of individual lines.
 */
function splitIntoLines(fileContents) {
	return fileContents.split('\n');
}
