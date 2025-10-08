



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

