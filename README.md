# todo:
- start with fixing the tests
    - just run the tests, fix what goes wrong
- then run the main code
    - will need to work out oddities with file paths etc. which will probs be a mega headache
    - just have the original code ready, and be ready.

# To run:
cargo build
cargo run



# reference for me on running the server
NOT!!!!!!!!!!! webfsd -F -p 8080 -r "$PWD" -i index.html
python3 -m http.server 8000
sudo lsof -i :8000




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


