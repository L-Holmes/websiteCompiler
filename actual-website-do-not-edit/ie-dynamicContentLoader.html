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
