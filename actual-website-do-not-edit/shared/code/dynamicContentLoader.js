var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Make sure you have Promise support in your tsconfig.json:
// {
//   "compilerOptions": {
//     "target": "es2015",  // or higher
//     "lib": ["dom", "es2015", "es2016", "es2017"] // ensure Promise is included
//   }
// }
function setDynamicElementsContent() {
    return __awaiter(this, void 0, void 0, function* () {
        const prefix = "D-";
        const corrContentFuncNameStart = "contentGetter_";
        console.log("Loading the dynamic elements...");
        // Get all elements that have an id that starts with the prefix that identifies that element as dynamic
        const dynamicElements = document.querySelectorAll(`[id^="${prefix}"]`);
        const typedWindow = window;
        for (let i = 0; i < dynamicElements.length; i++) {
            // Get the element
            const element = dynamicElements[i];
            // Get its ID
            const id = element.id;
            console.log("Setting the inner html to loading...");
            // Set that element as loading
            element.innerHTML = "Loading...";
            // Load expected function name
            // The end of the corresponding content function name 
            const corrContentFuncNameEnd = id.replace(new RegExp('^' + prefix), '').replace(/-/g, '_'); // Remove the prefix from the start and replace dashes with underscores
            // Corresponding content function name
            const corrContentFuncName = corrContentFuncNameStart + corrContentFuncNameEnd;
            // Ensure function exists
            console.log("TESTING--------------------------------------------");
            const myFunction = typedWindow[corrContentFuncName]; // Access the function by name
            if (myFunction) {
                console.log("THERE IS A MY FUNCTION");
                try {
                    const elementContent = yield typedWindow[corrContentFuncName]();
                    console.log(`Here is the result: ${elementContent}`);
                    element.innerHTML = elementContent;
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    console.error(`Error calling ${corrContentFuncName}: ${errorMessage}`);
                    element.innerHTML = "No content available";
                }
            }
            else {
                console.error(`(1) Function "${corrContentFuncName}" does not exist.`);
                if (typeof myFunction === 'function') {
                    // Call the function
                    console.log("THE FUNCTION EXISTS!!!");
                    try {
                        const elementContent = yield typedWindow[corrContentFuncName]();
                        console.log(`Here is the proof: ${elementContent}`);
                        element.innerHTML = elementContent;
                    }
                    catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        console.error(`Error calling ${corrContentFuncName}: ${errorMessage}`);
                        element.innerHTML = "No content available";
                    }
                }
                else {
                    console.error(`(2) Function "${corrContentFuncName}" does not exist.`);
                }
                console.log("TESTING END --------------------------------------------");
                if (!typedWindow[corrContentFuncName] || typeof typedWindow[corrContentFuncName] !== 'function') {
                    // Get the list of functions 
                    const propNames = Object.getOwnPropertyNames(window);
                    const functionNames = propNames.filter((prop) => typeof typedWindow[prop] === 'function');
                    const functionList = functionNames.join(', ');
                    console.error(`There is no function with the name ${corrContentFuncName}. It was expected that this function exists, since you have an element with the id: ${id}, which is seen to be representing a dynamic element due to starting with the prefix ${prefix}. \n Available functions: ${functionList}`);
                    element.innerHTML = "No content available";
                    continue;
                }
                // Get the new HTML content using that function
                let elementContent = "No content available.";
                try {
                    elementContent = yield typedWindow[corrContentFuncName]();
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    console.error(`There was an error when attempting to fetch the content of element with the id: ${id}, using its corresponding function: ${corrContentFuncName}. The error is as follows: ${errorMessage}`);
                    element.innerHTML = "No content available";
                    continue;
                }
                // Fix for the instanceof Promise issue
                if (typeof elementContent === 'object' && elementContent !== null &&
                    typeof elementContent.then === 'function' ||
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
    });
}
