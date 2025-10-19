Sort out the new headers;
- make the filters centred again on mobile- reusing my old code wherever that is gone.
- add a check for if no filters in a given category are selected. If so: act if everything selected.
- clean up the scss
- do something with the clear all button.
- update the redirect from index code to work;
    - should auto-select 'products'


- make products/blogs headers disappear if unselected.
- fix toggle dyslexia font
    - (or maybe it only adds to url? because on next page it seems applied)
- when I navigate to next page after turning off big font, it doesn't carry over. stays on big font.
- language selection button (e.g. japanese) needs to grow according to size of contents + the language name needs to udpate to reflect the current language.
    - perhaps this is just a translation? for the 'english' text?
- Make sort work per section. (e.g. products; sort blogs)
- Add price to example elements (and date) so i can integrate sort.


- Can you make it such that:
    - when products sub-filter is clicked, after it hides the parent, it unhides a substitue for the parent, that looks just like the parent
    --> and when clicked, it acts like the 'clear all' button, but instead of removing all filters, it instead unselects all of the children of products.
- Extract the new button design into its own reusable (like i did with filter tiles)
- Add the sort back in;
    -> Use the logic from that reorder button, but integrate it with the actual sort.
    -> will need to add a js file potentially, and import it in. 
    -> will need to add something to actually sort items by as well...
- clean up products2.html -> remove all uneeded css...
- sort out the catastrophe of text below...





----------------------------------------------------


# TODO:
- New filter system:
    - Try to see if you can integrate url params into this filtering system
    - If I'm feeling brave / stupid enough, try to add a 3rd level of filters.... 
- integration of new filter system:
    - integrate new filter system into my products page.
- documentation
    - document my old 'ultimate' method. 
    - store the code somewhere...

look back through deepseek code;
    -> work out how to hide the parent when the child is selected.
    -> work out what happens when i add more filters! (e.g. add at least 1 more to each category...)




option 1:
- seperate pages for blogs and products....
- just 1 tier of filters...
option 2:
- go back to my 1000 line javascript file...
    - add even more lines and complexity achieving what is my current goal...
    - waste another 10+ hours of my life going for that...






well...
yet again, i've wasted my precious time and energy.
I can only get css to work when we have loads of single level filters.  f



RIGHT
- I feel we are getting overcomplicated again... because the ai can't do it...
- but we are almost there.
    - i think the ai got confused with the subcategory definitions... its just the issue with hiding/unhiding irrelevant stuff now...



# Summary, no js filtering etc.
- not possible... just like how fli*** sorting isn't possible...
- can only;
    - Filter using 'OR'.
    - This means; we can only filter for top level things (categories like shoes, boots, etc.), not for attributes (things like colour, etc.)






# -> Make a guide for future me on the todo / design of the 'ultimate filter' system...
# -> consider the simplest html/css only method for now...
    -> Just go with the top-level 'or' filters...
    -> 

Can you make it so that:
    - I select 'products', it then shows 'products -> shoes', 'products -> tables'.
    --> If I then click on 'shoes', it unselects 'products -> shoes', such that now only 'shoes' is selected. But here's the catch; that 'shoes' filter will actually filter items that have the tag 'products.shoes'.
        - i.e. when i click 'products' it unhides 'products.shoes', 'products.tables' etc. but not 'blogs.shoes', 'blogs.tables'
        - this way, it will not show all products when shoes is selected; it will only show shoes
        - continuing, 
        - i.e. so then say the 'sapp boot' will have the tags: 'products', 'products.shoes', 'products.shoes.red', 'products.shoes.yellow', 'products.shoes.laces' etc...
        - aahhhhhh but that still will be too many permutations for the colours and subcategories...
        -> again, we'll have to limit to only the OR things. That means... no colours.. no 'laces', etc...
Okay, lets just ignore the subfilters for now.

could you not have a 'hide if it has this tag'?
i.e. so if the users want red, then anything not red will have a 'hide if not red' tag.. so that you can have a button, which when clicked, just hides everything with that tag?







====================

distinguish:
-> possibly have an underline for clickable ones like 'shoes'.. 
    and remove vertical bar seperator and have like an arrow for the non-clickable???
    and possibly have the outline not light up for only filterable?? 
    or even say... have less rounded edges for things that aren't filterable???


thoughts:
- all competitors tend to have tier 1 (shoes) and tier 2 (boots / formal) etc. visible via a hover-over on dropdown...
--+ the main category (boots / formal) etc. is almots always seperate from colours / activity etc.
    - sometimes its also in a dropdown as well, but there are usually bigger, easier to read buttons with that info)
- perhaps take inspo from north face...
- and moncler??
- omega pretty good as well...

questions from thoughts
-> Do i show all 3 tiers initially?
-> perhaps I just say... I want the filters to take up 'x' amount of space...
    -> Here are the filters, in order of how much people will click them...
    -> Try and: 
        - Get all main categories on first
        -> then if extra space, insert most popular ones, if they are over 90% (use some algorithm / common sence to determine how much to show)
        -> If there isn't space, and the bottom ones are rarely used, possibly even hide them behind a 'more filters' button! So we can fit the higher priority things on!


Thouhgts frmo above reasearch:
- I like what north face does with the easily de-selectable things, prioritising key things, etc...
    -> showing what filters are selected, with 'x' next to them...
- I'd like to have a 'clear filters' option, but just for tier 2 (products contents) and beyond...



# Primary TODO;
- Decide on whether to show all categories by default...
    Option 1)
    -> Have all categories hidden behind the 'categories' filter
        e.g. 'categories |v|' 
        -ve.. slows down large proportion of people just looking to add top-level filters...
        -ve.. may confuse people 
        -ve.. increased cognitive load, trying to workout where the 'typical' things are...
    Option 2)
        -> Show _some_ of the categories, and have a 'see more' button at the end.
        -> e.g. enough to fill 30% of the screen height...
        e.g. 'categories |v|'  '-> shoes' .. '-> tables' .. '-> ghandis'
        -ve... will this work for big text people on mobile???
        -ve... too much text on screen? You'll rarely, on mobile, be able to show all categories... so 
            why even bother with any as they'll always expand... so at that point its just for info...
    Option 3)
        -> Have a quick access menu, which is *scrollable*
        -> So it takes up only a small amount of the screen, and has all categories you can scroll through??
            -> Not ideal for keyboard users.. but ultimately that is a very small percentage of people.......

- Decide on how to distinguish the 'clickable' filters from the 'dropdown' filters
    - + make it more obvious what is the filter and what is the dropdown????
    - ?? do i have a tickbox for select and filter for filter ??
    --> when i've done that, work out a way for 'colours' to not unselect everthing
- Work out the default 'and' / 'or'...
    -> I almost feel that: 
        -> Tier 2 categories (shoes, coats, tables) should be 'OR'
        -> Tier 3 and onwards should be 'and'???
        --> possibly have another 'quick access' section to switch between 'and' and 'or' for all selected categories in the current section (e.g. all -> products -> colours, switch all to 'AND')

- Bit later:
    - Work out how to 'select all'??!!??! 
        - Again, do i have the 'quick access' popup, or do i just add 'select all' button?
        -> It would make more sense to 'select all' since its 1 less click... (although that never
            stopped me from not having categories on main page!)
    - Work out how to integrate the 'quick access feature'
        -> do i have something fixed or does it hover over the content???

- Down the line;
    - Seperate sort and filter for each section
    - When user is lucking at a product, they can see its other tags, and click to add them to the list???? (scrollable?????)
    - Have the seperate list of applied filters, which can be 'AND' -> 'OR' switched???
----------



- Main:
    - Each section will be, by default grouped by tier 0 (products / blogs), tier 1 (shoes), and tier 3 (boots)
    - Each section will have its own filter and its own sort.
- Main filter:
    - There shall be a top bar, showing where you are, so you can easily navigate back and forth
        -> (e.g. All -> products)
    - Under 'All -> products' will be *all* filter items; including both generically known 'variants'
        (shoes // tops // jackets // tables)
        AND
        modifiers: (colours etc)
    --> Anything that cannot be directly selected...
        -> when you select an item, there will be a quick access tool tip? (select all in this group?????)
            -> (or do i just have a 'select all' button?)
    - There shall be 2 main types of filters:
        - Ones that apply a filter (e.g. 'coats', e.g. 'red')
        - Ones that are just a group header (e.g. 'colours', 'categories')
        --> We will attempt to show all 'clickable' filters first, and all 'group headers' second.


- When you select a filter, it adds it to a list.
    -> 'blogs' OR 'products' OR 'products -> shoes' OR 'colours -> red' 
    - you can select multiple of these, and click 'make these AND' or 'make these OR' 
    -> this will be an 'advanced' feature, so not easy to get to 
- When you add a filter for a specific colour, a pop-up will appear in the corner:
    - "Quick Access: Click here to *Add this filter for all selected items*"
- When you sort a section, there will be a pop-up:
    - "Quick Access: Apply sort [high to low] across all sections"
    --> in fact, have this quick access / mass update always visible???


hmmm.. everything could be OR by default, but then you can click 'add and option', which will be a button next to a selected option, and then select the things you want to 'and' with that.
e.g. 'shoes' -> click & -> red, -> 50 grams -> done...

- Other:
    - there shall be keys assigned; (assume querty)
        - Key hints are toggleable(?) are they???
        --> In order of most to least:  
            - Adding tier 1 filters (90%)
            - Adding tier 2 filters (60%)
            - Returning back to tier 1 (58%)
            - everything else: 20%....
        - so;
            - 'e' is always 'up one level'
                -> ah, but what if you just pressed 'd'? 
            - [?] is always 
            - first to last item select:
                - 'a','s','d','f','j','k','l',';'
                


questions:
-> do i give peaks of level 3?
    -> e.g. colors.red, colours.blue etc. (I feel i thought about this already...)
    -> I think not. I decided that it would take up too much space... Not worth it when we want big obviousness.

-> do I seperate out *just* categories?!???
    -> I feel that 90% of main searches can be done just via these.
    -> they are extremely key.
    -> and we are hiding them behind an extra click...
    -> and there isn't really a term that encapsulates them...
    --> I feel the absolute minimum number of clicks (i.e. things available in the all -> products) should be 
     allocated for the 90th percentile + scenario. 
     Now, trying to do this is difficult. Because it breaks consistency, simplicity, !overwheliming, etc....

--------------------
review:
- need a way to allow 'or' vs. 'and' customisation from the user (with sensible default)
- for selecting say styles -> cowboy, it makes sense that the user finds that on a specific item, and then once they've found it, they have the ability to perform that update for 'all'/'all selected/'just this'/'specific' (again, with sensible default)
    - perhaps in a pop up box.   --> how for only certain selected?
    - e.g. colour.blue with any parent...
- things like ands and specific filtering, done by one 10% of users should be:
    - relitively hidden, since most people won't use them and will get confused... 
- defaults:
    - sort applies to the group


... 

They would:
- do the obvious and have 3 main levels of grouping (this covers 90%):
- blogs -> lifestyle -> 'in the home'
- products -> shoes -> boots
...
filters always apply to single by default with options to toggle to 'all' and then 'specific subsection of selected'?
....
should be easy:
(a)
- Select just boots
- filter for just boots
(b)
- select just blogs
- filter just blogs
(c)
- see all shoe variants (boots etc.)
- filter for that.
(d)
- See all items that have a price less than £50. 


# SO
- just get rid of the colours filter.
    - sure it may be confusing to new users.. could maybe add some sort of hint to how they can find it???
... but then... still back at square 1:
where on earth do you put 'colours'? Just at the top level?
colours is top level! like 'shoe variants' (boots etc)
--> but since colours also shows up as a sub option for multiple other things... Its also a global filter!


?? 
everything that more than one thing have in common show in the global filters????

yeah probs have global and in-depth and show the pop up for both.

hold up... would all this not be solved by having colours as 'filter only'?
!!!!!!!! I think that the above is key !!!!!!!!!!!!!!
    -> sure, selecting all but one of the colours would be a bit annoying but that's such a rare use case...

--------------------





















TODO:
clicking just 'colours' in general hides everything when it shouldn't... what has changed@?!??!??!
(is the state changing when one of the sub colours is clicked???)

clicking the colours seems to hide all items when they shouldn't. 

--> need to make the arrow in the filter-header not visibile when there isn't a 'next category'
-----> perhaps everything after all has arrow as part of the html design????

find the black and brown images???





TODO:
- Continue at:
    - filterHeaderReturnToParentClicked()
        --> at the bottom, test whether we get the correct file name.
        --> May want to go on to the under filter clicked logic after that since it basically uses the same approach as when the return to parent is clicked...
- Update the headers etc?
    - (I think have all permutations of all of the pages available and seperate. then just hide them by default and unhide as necessary?)
- Make the filter further icon also seperately clickable...

- update the filters;
   - switch out the logic for the image icon ->
        -> Insteaad use my compiler logic to pass in the html as the optional argument(!)
    - Implement the version with a big image...
    - Update the ts code to work with the new system...
        -> make the outline a lighter grey when its unselected
        -> Make it a bold white when it is selected (and possibly bold the text?)

    - continue with designs;
        - Add the help text regarding the 'info' sign and 'filter' symbol, as seen in the designs...




TODO:
- on the products page:
    - Update the typescript code;
        - Full = all three boxes light blue background
        - Partial = bottom two boxes only light blue background
        - None = all boxes see through
    - Make the entire upper third section the button, which activates the 'on select' click...
    - Add hover effect:
        - Dark blue
        - text turns dark yellow
- work on the blogs
    - get the blogs all importing the global blogs css 
    - add css for basic text centre-ing etc.
- back to filters:
    - merge all filter stickers into a single file. Then use my new code to sub-in / out the things we do / don't want...
        - could maybe even do that with the class of the top bar?!?!?!?!?!?!?!?
    - sort out the text overflow graphical issues
        - make the description text smaller...
        - add bold etc. where necessary
    - Add the seperation between the global filters and the regular filters...
    - Add logic to hide blogs if there are no blogs to show
        - and vice versa for products...
- update the compiler;
    - make it so the blogs get moved up a folder
- make the new translation method actually carry through between pages!!!!!!!
    - i.e. en-[page-name]
- Review the below todo...



to summarise:

# products <sort>
[shoes]    <sort>
- ....
[tables]   <sort>

# blogs    <sort> 
- ...

===================================================================

- add the updated sorting etc. system for the products page
    - (i.e. the 
- sort out the mobile version of opening page. 

TODO;
- make language selection look nicer
- Make language selection functional
- Make increase text size functional
- Make toggle dislexia font functional
- Update the mobile version of the main page
- Sort out the sorting and filtering
    - Add an actual filter
    - update the sorting to:
        - have 'general' / 'global' as a clearly seperate section.
        --> or be able to select which tiles you want to globally apply changes to?!?
        --> nah, that is bloated. just make it simple...
    - Add text underneath the images to make it clear what is being filtered...
- Add different icon for switch to dyslexic help
- Add functionality for change lang so it actually redirects to the /en/... page...
    - Remove the old functionality
- Work out how to present blogs?!?!?!?
    - just do something trivial and easy for now. 


OLDER TODO:
- Sort out the height of the boxes on mobile
    - Space accoring to vh and designs.
- Sort out the issue with desktop now no longer centring the contents



==========
==========
===========

- make mobile landing page look like designs.
- make search bar clickable from anywhere
- --> actually switch over to new translation system; update links, remove legacy js, etc.
- implement filtering thing where turning off colour doesn't affect
- implement filter saves to URL.
- implement changing language changes the URL to en-...
- Update the landing page on desktop- side buttons should take up the width of the entire page, but then the contents should be padded by loads so that it appears as if the buttons are in a nice legible position.

