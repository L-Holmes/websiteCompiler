# To run:
cargo build
cargo run



# reference for me on running the server
cd .. && cd actual-website-do-not-edit/ && python3 -m http.server 8000

# If you get a port issues...
sudo lsof -i :8000

# Copying the contents of actual website do not edit/ to our website:
1) Navigate to the folder of where you want the contents to go
2) Run this:
find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} + && cp -a "$HOME/code/websiteCompiler/actual-website-do-not-edit/." .

# images source
https://icons8.com/icons/set/shoe


Laws:
- Speed is our number 1 priority. 
    - Speed includes:
        - How long an expert takes to perform the task that they want (e.g. 'buy a red sapp shoe in size 5')
        - How long it takes a new user to do what they want:
            - e.g. time to interpret the ui, and know how to get to the image
    - Thus;
        - Use text whenever possible 
        - ONLY use other means (images/videos/audio) when 90% of people would agree that the thing cannot be accurately described via text alone (or it would take way to long to describe accuretely)
            -> Is image absolutely necessary here? To convey the information? Or 
            -> Would the user have additional left over questions, related to something only representable by an image, if there was no image?
                e.g. "what does it look like on a 5'11, 80kg man?" // "what does the shoe look like on someone's feet'? 
                ==> If <5% will have those questions or find them very helpful... DON'T USE IMAGES. 
- Only address *inconveniences, that would cause stress / require to think harder, in >5% of people*
    -> e.g. Having a search bar, as having to learn how filters etc. work takes brain power
    -> and the way the brain works, is it has an idea of what it wants, in language/text (for most people), so that matches how the brain works and how most society works (text/lang based representation)..
    ==> 
    NOT searching via images

- Assumptions:
    - 95%+ of our audience can read. (some may not read that fast, but most can at least read familiar words in a reasonable amount of time.)
    - 95%+ of our audience is familiar with the internet 
        - and thus familiar with: common icon (e.g. filter icon, burger menu, etc.)


general considerations:
- Most of the internet uses text 
    - particularly in filter categories


But what about my time!?!?!?!??!?!?!??!
--> should the time going towards getting the filters perfect now not happen later?!?!?
    --> that is the golden rules of startups, no?
    --> mention ideas, but don't implement them?
    --> use the most basic thing (just words in this case)
    --> so i ensure that i don't waste my time, and get things out to the people first... 

so...
TODO:
--> On the main, just use the same image for everything for now (e.g. blank white), as placeholder
--> add text to the main
--> Add my current 'perfected' designs to the list of things to optimise in the future....
I already know that either way, there needs to be a square for each thing being filtered regardless of my final decision!


conclusions:
- I think there are simply too many people with slow / limited reading ability, who just want the quick massive amount of info you can get out of a familiar icon.
    - so i'm going to add icons. simple as that.
    - in fact, the page may look dead without them.... at least on the home page.... 
--> Icons should however be as minimal as possible. Ideally svg... 



========================================================================================================================
========================================================================================================================
========================================================================================================================
========================================================================================================================
========================================================================================================================
========================================================================================================================
========================================================================================================================
========================================================================================================================
========================================================================================================================
========================================================================================================================

# Website X

## ====================================================
# Quickstart
## ====================================================

## Making the website
In order for the webpage to be viewed, the edit-me/ directory must be 'compiled'.
This is done by running the make-website script;

```bash
./make-website.sh
```

Upon compiling, the actual-website-do-not-edit/ directory will contain the final website code.

## Running locally (for testing)
1) Go to the actual website folder: actual-website-do-not-edit/
2) Start a local server with python3:
```
python -m http.server 8000
webfsd -F -p 8080 -r "$PWD" -i index.html
```

or

```

```


## ====================================================
# Coding guideance for the custom compiler
## ====================================================

### Reusable elements
### Reusable elements -> HTML
==> If you have code that will be shared amonst multiple pages..
#### 1) Create the reusable element in the 'edit-me/shared/reusables' folder
e.g. 
    (a) Create the folder: 'edit-me/shared/reusables/top-bar' 
     
    (b) Add all of the usual files that a regular page would have:
     ```bash
        images/
        top-bar.html
        top-bar.js
        top-bar.scss
     ```
    (c) Add code / content as usual. 
        But! The html file would only be the body:
     ```bash
     <div> Hi, this is the top-bar! </div>
     ```
#### 2) Reuse that component in your other pages
* In pages where you would like to add this reusable component, add:
```html
<r-componentname>

# This would perhaps be a pladeholder for:
<div> This is a component! </div>
```

and if it requires additional parameters:
```
<r-componentname param1=@template:templatename param2=@none param3="books.jpg">

# may produce an intermediate output of:
<div> This is a component! </div>
<div> Hello {param2} </div>
<img src="{param3}">
<r-templatename>

vvvvvvvvvvvvvvvvvvvvvv

# before finally substituting in the values and getting the final: 

<div> This is a component! </div>
<div> Hello </div>
<img src="books.jpg">
<div>
    This is another template!
</div>

```

e.g. In order to add the 'top bar' component, found within the codebase at: 'edit-me/shared/reusables/top-bar' we would use:

```html
<r-top-bar>
```

e.g.2. and for the component found at: 'edit-me/shared/reusables/signpost'

```html
<r-signpost>
```

WARNING!
- DON'T USE '&' IN THE COMPONENT CODE AS IT MESSES UP 'SED' AND RESULTS IN SAID SUBSTITUTING THE '&' OUT!

### Paths 
- All paths are relative to the project root
* Add a project root placeholder using:
```html
'<root>/path/to/thing.txt'
```

e.g. to reference the file at: edit-me/shared/global.css 

```html
'<root>/shared/global.css'
```
- File types this works on:
    - any.


### Adding text (we use a special method since each page is translatable!)
#### --> On each html page:
1) Add the link to the translation javascript to the head: 
```
<script src="i18n.js" defer></script>
```
2) Add the name of the page (used to reference the translations json entry) to the body declaration:
```
# e.g. on the index page:
<body data-page="index">
```

#### --> .. and then for each div / heading etc. in which you want text:
1) Add the text itself
```
<h1 add-text-section="welcome"></h1>
<p add-text-section="intro"></p>
<a href="products.html" add-text-section="contact_us"></a>  

<button onclick="setLanguage('en')">English</button>
<button onclick="setLanguage('ie')">Irish</button>

```



### Dynamic / Added at runtime html 
==> If you want add dynamic elements to a page (things that will change at runtime / whilst the user is viewing/clicking around the page), 
==> .. use the following;
* (1) Add a div that represents where the html will appear. The id of the div must be of the form: D-name-hyphen-seperated
    * e.g. 
    ```
    <div id="D-gallery-images"> </div>
    ```
* (2) Ensure that the html file imports its javascript file
    * e.g. At the top of the html file, it should have:
    ```

    ```
* (3) Add the javascript code which returns the html 
```
document.addEventListener("DOMContentLoaded", setDynamicElementsContent);
//The below will be replaced once the website is compiled
<r-dynamicContentLoader> 

//--content getters--

//tier 1
async function contentGetter_gallery_images() {
	var gallery_images_dir_from_root="CLICK-HERE/gallery-images/"
	var gallery_images_list=await get_gallery_images(gallery_images_dir_from_root)
	var constructed_html = await get_images_string(gallery_images_list)
	return constructed_html
}
```

## ====================================================
# Technology used
## ====================================================
* standard:
    * html / javascript 
* other:
    * scss = improved css for styling 
        * compiled via the compilation script 
    * alpine.js = allows to do some simple javascript things within the html

## ====================================================
# Folder layout 
## ====================================================
* '/edit-me' contains the code that I am editting
* '/actual-website-do-not-edit' contains the compiled code that represents the source code of the final website  
    * ! *do not modify the actual-website-do-not-edit/ directory manually* !
- 'documentation' contains files to help the programmer understand the codebase / concepts explored by this project better.

### --> edit-me/pages
Contains things that are specific to single pages (and the pages themselves)
 \* apart from images 
* defines the routes for a website (i.e. at which url each asset is found)
* defines the static content unique to each page (in the html file)
* defines the dynamic content unique to each page (in the js file)

### --> edit-me/shared 
Contains things that are not specific to a single page. 
i.e. things that are shared across multiple pages / the entire website (i.e. 'globaly' across the website)
* edit-me/shared/reusables = contains the reused html components (e.g. top bar, since it is used in many pages)
    html, and associated css/javascript/images
    TODO: rename to 'page-components'
* edit-me/shared/images = contains images 
* edit-me/shared/fonts = contains fonts
* edit-me/shared/page_text = contains anything related to page text / translations / internationalisation
* edit-me/shared/code = contains specific code that is reused amongst different pages
    javascript that is not linked to a specific component
* edit-me/shared/global.scss = contains styling that is used across all pages
* edit-me/shared/global.js = contains general/generic code that is reused amongst different pages

## ====================================================
# Aims:
## ====================================================
* Should be straight forward to use if you only have experience with html/css/js
    * Should compile directly to that
    * Should be easy to use
    * Should have a minimal number of files that are not directly related to html/css/js 
* Should not have errors that are un-solvable 
    - Compiler has lots of debug settings and can be manually editted by the user
* Should understand everything just from this read me
* Folder structure is intuitive whilst organised
* Minimal number of dependencies 
* You can literally read/modify the compile script yourself if there are any issues

## Differences when compared to other static-site-generators:
* No need for anything to be installed (apart from ripgrep and sass I guess)
* Easy 
* Doesn't focus on templating with markdown files 

## ====================================================
# Limitations / Rules:
## ====================================================
These are defined by what the compiler does (read on for more context)

* Can't have a page called 'global'
    * --> since the global directory is required at the root of the project
    * ~~> unless you change the name of the existing global directory, and all references to it in compile.sh
* Can't have text in your page that is of the form: <r-nameOfAReusableComponent> 
    
* reusable components must be located inside of the directory: edit-me/shared/reusables/
* The compile.sh script must be at the same level as the edit-me/ directory and the actual-website-do-not-edit/ directory

## ====================================================
# coding guidelines / recommendations
## ====================================================
* Grid, flex, and absolute displays should be used most of the time. (using the code guides found in global.scss)
    * Mostly grid to be honest
    * Only on very unique situations should a different display, like 'flex', be used
    * e.g. decision flow chart:
        * align to centre/left/right? -> flex 
        * anything arranged where the contents don't define the spacing of each <div>? -> grid
        * align inside of another flex? flex thingy (other one that works inside of a flex)
    * Why?
        * simplicity
        * easier to change + reliable.
* Use a minimal number of html tag types
    * Use div for pretty much everything
    * Why?
        * Minimises the number of things to learn
        * simplicity
        * less confusion.
* Everything has a class. No #Name or anything like that
    * No confusing 'cascading'
    * Should see the html, look at the class, then go to the class and able to change *all* the styling.
    * Only exception is if the css extends other css, for cases where you want to repeat code.
    * Why?
        * makes it extrememly easy for anyone to quickly identify the style + change.
        * again, minimal.

* In 99% of cases, don't use javascript to add repeated text to the page.
    * Use the 'templates' mentioned earlier to make the compiler generate lots of html
    * The use the 'display:none' type css tricks to choose which of that is shown.
    * why?
        * more elegant, typically faster, typically easier to interpret as the compiled html will likely look similar to the actual page
        * etc.



----------------------------------------------------------
- To make compilation easier, we decided to skip the automatic detecting of the order of when to compile the different files.
    - (this should be implemented in the future)
    - instead:
        - Manually sort the reusable components in the 'reusable component order list' file.
        - Simply add the components in the order they should be compiled.
        - lines that start with '#' will be ignored
        - If your component inherits other components, you must place that component lower down than the components it uses.
            - this will allow for the child component to be compiled before it gets placed inside of that component. 

    - verification:
        - must contain all components
        - must not contain any line that isn't a component or a comment
