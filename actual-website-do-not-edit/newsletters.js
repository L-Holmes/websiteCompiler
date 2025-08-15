var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", setDynamicElementsContent);
//--content getters--
function contentGetter_text_lines() {
    return __awaiter(this, void 0, void 0, function* () {
        return "<h1> This surrrreeellllyyyy is the dynamic content </h1>";
    });
}
function contentGetter_loaded_txt() {
    return __awaiter(this, void 0, void 0, function* () {
        return "loaded text yaaa";
        /*j
        try{
            fileContents = loadFileContents()
        } catch (error) {
            throw error;
        }
        return `${fileContents}`
        */
    });
}
//////////////////////////
//GROTE FUNCTIONS
//////////////////////////
//start of -----------------------------------------------------
-dynamicContentLoader >
    //end of -----------------------------------------------------
    //////////////////////////
    //KLEINE FUNCTIONS
    //////////////////////////
    /**
     * Load the contents of a text file asynchronously.
     * @param {string} filePath - The path to the text file.
     * @returns {Promise<string>} - A promise that resolves with the file contents.
     */
    function loadFileContents(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(filePath);
                if (!response.ok) {
                    throw new Error(`Error fetching file: ${response.status} ${response.statusText}`);
                    return null;
                }
                const fileContents = yield response.text();
                return fileContents;
            }
            catch (error) {
                console.error('Error loading file:', error);
                throw error;
            }
        });
    };
/**
 * Split the file contents into separate lines.
 * @param {string} fileContents - The contents of the text file.
 * @returns {string[]} - An array of individual lines.
 */
function splitIntoLines(fileContents) {
    return fileContents.split('\n');
}
