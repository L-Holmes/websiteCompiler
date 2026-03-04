

- add debugging capabilities to the compiler
- + Ideally crash if there is an error...

- Can't add a shared template inside a template currently.(well, at least the blog top bottom repeated code)
    - only works for when passing a template into another template... using @template..
    - but for say the template-blog-bottom/ I can't have <r-back-button> inside...
        - At least with how that is used.
        - In fact, maybe it doesn't work _because_ It isn't used like <r-template-blog-bottom> but rather manually?
        - so maybe i need to just update that section?

- perhaps seperate out parts of pages from the shared.
    - Bit messy just chucking everything in there, even though some stuff is specific to a single page...
    - would be nice being able to do like just pass in the code directly... rather than creating a new seperate shared it...
        - hmmm or would it? Maybe its quite nice and easy for the compiler etc... 

