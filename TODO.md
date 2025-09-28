How do i handle sort when the sort options change depending on what is shown?
and how do i handle grouping? Like do i group blogs or do i show them alongside all of the other things?
what if the user wants to see all blogs and products related to 'knee health'?

What would happen if the user only looking at blogs and they click the 'price high to low' filter?
    -> even just seeing it would likely lead them to believe that the blog require payment to read!?!?


hmmmm... do i just always show the heading if there is more than one thing visible in that category?
-> a bit like yamatomichi's all page?
and then have sort seperate for each one? But then have a global one at the top?
    -> Or I have 'super categories'
    -> all things in a super category have the same sort options.
    so these would be 'products' and 'blogs'.

yep i think that is the way.

to summarise:

# products <sort>
[shoes]    <sort>
- ....
[tables]   <sort>

# blogs    <sort> 
- ...



HOLD UP
- If im doing that, why not just have the filter there as well?
- because then im being repetitive, no?
- as in filter for shoes? because then there would be filters everywhere, and how would I get say... shoes back if i click off to hide? Just nah m8.


===================================================================

update the compiler to handle 
%s{}
--> take the text inside (e.g. filterImage)
--> e.g. filterImage = colours.red.avif
--> Instead of subsituting:
   get the name of the penultimate thing in the name (e.g. 'red')
   replace '_' with spaces
   Capitalise first letter of first word.







- remove top bar from the products page
- add the updated sorting etc. system for the products page
    - (i.e. the 
- make the on-click of the flags of the language selection redirect back to the main page, but at /en-index.html...
- 
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

