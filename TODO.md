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
    --> Anything that cannot be directly selected (e.g. 
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

