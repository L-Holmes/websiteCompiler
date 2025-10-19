
- Make it so that the sort button works again...
    - DId the js get deleted?
- Make the js for the filter on click:
    - Unhide all of the filters
- Add the js for the 'hide all filters' at the bottom of the filters.

Sort out the new headers;
- add a check for if no filters in a given category are selected. If so: act if everything selected.

- language selection button (e.g. japanese) needs to grow according to size of contents + the language name needs to udpate to reflect the current language.
    - perhaps this is just a translation? for the 'english' text?
- Make sort work per section. (e.g. products; sort blogs)
- Add price to example elements (and date) so i can integrate sort.



----------------------------------------------------


# TODO:
- documentation
    - document my old 'ultimate' method. 
    - store the code somewhere...


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
                




- work on the blogs
    - get the blogs all importing the global blogs css 
    - add css for basic text centre-ing etc.

- make search bar clickable from anywhere
- implement filtering thing where turning off colour doesn't affect
- implement filter saves to URL.
- implement changing language changes the URL to en-...
- Update the landing page on desktop- side buttons should take up the width of the entire page, but then the contents should be padded by loads so that it appears as if the buttons are in a nice legible position.

