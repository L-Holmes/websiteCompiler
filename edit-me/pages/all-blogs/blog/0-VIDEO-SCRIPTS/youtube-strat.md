webscrape scripts from best YouTubers
feed them into AI
polish up by hand. 



===========

...



 ====================
 ====================
 ====================

# AI Videos

 audio cleanup:
- audacity!?!? authonic!?!? 
- ffmpeg -i input.wav -af "highpass=f=80, lowpass=f=15000, afftdn, arnndn loudnorm" output.wav.

Subtitles (I'll already have full script) 
- alass (for when I have script..) ++
- whisper as backup 

Images:
- noun project

Stock footage / audio tracks etc.
- envato elements ++ 

Free B-roll:
- pexels
- unsplash
- storyblocks
- NASA media library + 
- Wikipedia commins ++ 

Background music:
- epidemic sound ++ 
- pixabay -- 

====

1) Contruct parts
- Draw all variations of base character and setups
- --> Body w/arm poses
- --> Facial expressions (eyes and mouth together) 
- export as PNG
- make all on single master.kra file.
- layer groups for "bodies"; "eyes"; "mouth" etc.
- use export layers plugin 

2) Make all the images
- in Krita, use file layer (auto updates if the file changes)
- --> But only make the base scenes! If anything changes mid scene, like a single expression or image or arm pointing, animate them seperately in kdenlive


3) Import everything into kdenlive
- combine the audio and the images
- animate by layering two max pngs...
- 1) Main scene background
  2) Main character  

" 
additional things;
- subtle zoom or pan

TODO:
-- Stage 0 --
- Add the above guide onto my notes
- organise the notes more- like mention step by step of things, like producing th audio first, as podcast, exporting then saving, then doing the video stuff etc...
+ Include like what tabs to open with her image providers (when making the pictures...), and what subscriptions to monitor... etc. 
- Install all necessary thingson computer... 

-- Stage 1 -- 
- Research how to use kdenlive (vids / masterclass...)
- research using Krita
- research simple animations for YouTube
- find masterclasses from like cgpgrey etc. (ask AI) and watch / do them...

-- Stage 2 --
- Prepare all base images

-- Stage 3 --
- Start making first video, but keep simple.
- Just enough to elevate it beyond just a slideshow 

========================================================
                     FULL PROCESS
========================================================

## Already done;
- Buy audio input hardware; 
    - Aston stealth microphone (needs phantom power!)
    - focusrite scarlett solo gen 3 (works out of the box, no driver needed)

## Pre-stages:
- Draw all variations of base character and setups
    --> Body w/arm poses
    --> Facial expressions (eyes and mouth together) 
- (run the ensure-all-installed.sh script)

## Write the script 
- (see the below appendix A - writing the script)

## Record the audio
- (run the audio.sh script)

## Generate the subtitles file 
- pip install openai-whisper
- whisper video.mp4 --model medium --output_format srt

- then just ask regular ai to tweak it based on the actual script...

## Make the images 
- Open Krita

## Make the video
- animate by layering two max pngs...
- 1) Main scene background
  2) Main character  

========================================================
                     APPENDIX
========================================================

--------------------------------------------------------
 Appendix A) Writing the script
--------------------------------------------------------

# writing videos guideance
1)  Get down random bullet points
2)  Write headings
3)  For each heading - write rough bullet points
4)  For each heading - condense down bullet points
5)  Get some research done- relevant sources
6)  Do a read through
7)  Ask AI for help (see below) (Gemini for base, claude for alt...)
8)  Go through the base (gemini), and compare against alt (claude), making edits in-order
9)  Rearrange sections for maximimum retention and interest
10) Read through 


# AI help;

Create me a youtube script, 
inspired by the best science / maths / logical youtube people's scripts (like cgpgrey, Tom Scott, Chris Spargo, not just bikes, etc);
make it sound not as 'AI-ish', not as american (more british english), and more of a conversational tone;
...
More stats.
Less 'school educational video', like the hisotry is interesting sure, but you are very wordy and not just going from point to point. 
People are intersted by drama, interpersonal relations, emotional things, memorable statistics, not from overly wordy things.
Also i don't feel there is a good enough hook at the start to keep people reeled in. There needs to be something that will get even people not into inguistics...
Make it channel that slightly cynical, highly logical, fast-paced style of creators


--------------------------------------------------------
 Appendix B) To be determined
--------------------------------------------------------
...


