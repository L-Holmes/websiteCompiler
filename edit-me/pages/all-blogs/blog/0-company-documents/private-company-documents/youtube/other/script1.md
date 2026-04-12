https://tactiq.io/tools/youtube-transcript

# tactiq.io free youtube transcript
# This Video Has 71,476,287 Views
# https://www.youtube.com/watch/BxV14h0kFs0

00:00:04.710 The title of this videowon’t be exactly right.
00:00:07.540 It only updates every few minutes at most,and besides,
00:00:09.950 YouTube doesn’t update its view counts inreal time anyway,
00:00:12.860 so don’t bother refreshingand refreshing and refreshing,
00:00:15.320 you won’t actually be able to see itticking up second-by-second.
00:00:17.940 If it’s actually 100% spot-on,
00:00:19.670 it’s a miracle, but if it’s close,
00:00:22.170 then the code I’ve written is still working.
00:00:24.730 But at some point, that code will break,
00:00:26.120 and the title of this video will slipmore and more out of touch with reality.
00:00:29.560 This is the story of how I madethat changing title work,
00:00:32.479 why it used to be a lot easier tomake things like that work,
00:00:35.430 and how all this ties into the White Cliffs of Dover
00:00:38.649 and the end of the universe.
00:00:42.480 Now, I’m not going to talk aboutthe exact details of my code here,
00:00:45.359 it is not the important part,
00:00:46.800 because code is just incredibly dull on camera.
00:00:50.310 But, big-picture, if you’re automatinga job like that,
00:00:52.870 there are two main approaches you could take.
00:00:55.129 First: you could write something that pretendsto be a human.
00:00:58.590 Not in some Blade Runner replicant way,
00:01:00.300 but you could run a system that loads up theYouTube video page,
00:01:04.099 reads the number of views,and then goes to the video manager,
00:01:07.260 changes the title, and hits save.
00:01:09.020 That’s actually not too tricky to do:
00:01:11.020 “screen-scrapers” have been built to dothings like that for decades.
00:01:15.380 And that’s a fairly innocent use of a screen-scraper.
00:01:18.270 But if you can write code to change a title,
00:01:20.280 then you can also write code thatsigns up for loads of new accounts.
00:01:23.430 Or spams people. Or sends out messagestrying to steal personal information.
00:01:26.790 That’s why you see those“I’m not a robot” checkboxes.
00:01:30.259 Which aren’t impossible to defeat,by any means,
00:01:32.149 but they make screen-scraping like thatmuch, much, much, much, more difficult.
00:01:35.220 And, plus, it’s an approach that’ll breakquickly:
00:01:37.950 every time one of the pages that’s beingscraped gets redesigned,
00:01:40.649 you’ll have to rewrite your code.
00:01:43.680 But for a long time, the people who buildweb services like YouTube have recognised
00:01:47.880 that there are legitimate reasons for lettingcode interact with their systems.
00:01:52.170 Like pulling analytics data into a spreadsheet,
00:01:54.740 or letting captioning services add subtitlesto videos quickly and automatically.
00:01:59.549 Or you might want to hookmultiple web services together:
00:02:02.920 to automatically tweet whena new video goes up,
00:02:05.159 or ask your voice assistantto search for a playlist.
00:02:07.530 That can and should all be done with code.
00:02:10.840 So behind the scenes, nearly every majorweb service has an "API",
00:02:14.270 an Application Programming Interface.
00:02:15.970 It’s a way for bits of code to pass dataand instructions
00:02:19.080 back and forth between services safely withouthaving to deal with
00:02:22.250 all the complicated visual stuffthat humans need.
00:02:25.470 So when I want my code to change a video title,I don’t ask it to open up a web browser.
00:02:29.910 Instead, it sends a single request to YouTube:
00:02:32.710 here’s the video ID,here’s the stuff to change,
00:02:35.010 here’s my credentials to prove thatI’m allowed to do that.
00:02:38.000 Bundle that all up, send it over.
00:02:39.830 And YouTube sends back a single answer:
00:02:41.410 hopefully it’s a response code of 200,which means “OK”,
00:02:44.340 with confirmation of what the video’s datahas changed to.
00:02:47.230 But if there’s some problem with that request,it’ll send back some other status number,
00:02:51.220 and an error message about what went wrong.
00:02:53.940 I can write code to handle those errors,or for something simple like this,
00:02:57.720 I can just have it fail and log it somewhereso I can deal with it later.
00:03:01.360 No typing, no clicking on things;no pretending to be a human.
00:03:05.530 One request out, one reply back.
00:03:07.450 At least, that’s how it’s meant to work.
00:03:12.220 This idea, that web services could interactwith each other through code,
00:03:16.060 was amazing when it first became popular.
00:03:18.530 It became "Web 2.0",
00:03:20.930 a buzzword that is now more thanfifteen years old.
00:03:23.860 And honestly, the Web 2.0 years were someof the most optimistic times on the web.
00:03:27.950 All these new startups were making sure theycould interchange data with each other,
00:03:31.450 so maybe in the future,
00:03:32.880 you could see your friends’ Facebook statuseson your fridge!
00:03:36.430 Or lights could flash to warn you ifyour bus was arriving early!
00:03:40.060 The web would be all about data, and wecould make all sorts of things of our own
00:03:43.880 to understand it and control itand shape it.
00:03:45.930 It was going to be the Age of Mashups:take data, and do interesting things with it.
00:03:51.540 I built so many thingsin the days of Web 2.0.
00:03:54.320 So many little web toys that took data fromone place and showed it in weird ways.
00:03:58.150 And the most ridiculous, over-the-top toolthat I loved to build with
00:04:01.520 was called Yahoo Pipes.
00:04:03.220 You didn’t need to write any code to make amashup with that.
00:04:05.010 You could just click and drag boxes on a screento make a flow-chart,
00:04:08.060 and it would all be done for you,
00:04:09.430 Yahoo would run it all on their servers,for free.
00:04:12.110 I made a thing called Star Wars Weather.
00:04:14.730 It was a really simple web page,it’d show you the weather forecast
00:04:17.760 by comparing it to a planet from Star Wars.
00:04:20.149 I had a million people visit that site inone day at its peak,
00:04:23.669 a few people genuinely used it to get theweather every morning,
00:04:26.180 I got lovely emails from them,
00:04:27.509 and all the processing was done in the backgroundthrough Yahoo Pipes,
00:04:31.000 I didn’t have to pay for some expensive serveror pay for access to the weather data.
00:04:34.200 There didn’t seem to be any limit, either.
00:04:35.930 Yahoo just handled it,
00:04:37.879 because this was Web 2.0 and that was theright thing to do,
00:04:40.699 and, y'know they’ll figure out how tomake money later.
00:04:44.530 Google Maps. That was free to build on, too.
00:04:46.710 World-class maps just to play with.I built a terrible racing game on top of it,
00:04:50.500 put it in my own site, loads of peopleplayed it, I didn’t pay them a penny.
00:04:54.310 None of those free services exist now.
00:04:56.439 And in hindsight, it was never sustainable.
00:04:59.189 See, when Twitter launched,
00:05:01.449 it wasn’t pitched as just an app,or a web site;
00:05:03.770 Twitter was a platform, a messaging service.
00:05:06.419 You could use their web site toread and send tweets, sure,
00:05:09.550 or you could write code that used the API,
00:05:11.729 that looked at tweets, that reacted to them,or even wrote tweets of its own.
00:05:15.100 It was so quick, so open that anyone with alittle coding experience could make stuff easily.
00:05:20.580 Everything you could do on the Twitter website,or later, on the app,
00:05:24.180 everything was available in the API for yourcode to play with.
00:05:28.379 The first sign that something was wrong,
00:05:30.100 for me at least, was the Red Scare Bot.
00:05:34.270 It appeared in August 2009 with the face ofJoseph McCarthy as its avatar,
00:05:38.479 and it watched the entire Twitter timeline,
00:05:41.120 everything posted by everyone --
00:05:42.600 because Twitter was small enough back thenthat you could do that.
00:05:45.980 And if anyone mentioned communism or socialism,
00:05:48.990 it would quote-tweet them with… not evenreally a joke, just a comment,
00:05:54.009 just something that said“hey, pay attention to me”!
00:05:57.360 Hardly anyone followed it, because,yeah, it was really annoying.
00:06:00.009 Over the six years before it either brokeor was shut down,
00:06:02.689 that bot tweeted more than two million times,
00:06:06.180 two million utterly useless things added toTwitter’s database,
00:06:09.020 two million times that someone wasprobably slightly confused or annoyed.
00:06:12.680 Somehow it survived, even as Twitter’s ruleschanged to explicitly ban
00:06:15.909 “look for a word and reply to it” bots,
00:06:18.250 even as countless other irritantsgot shut down.
00:06:20.840 “Search for every use of a word on Twitterand reply to it”
00:06:24.050 seems a lot more sinister these days,
00:06:25.870 in a world where social mediashapes public opinion.
00:06:28.210 We didn’t really knowwhat we were playing with.
00:06:31.259 I built some Twitter bots myself,
00:06:33.780 although they weren’t quite as annoyingas that.
00:06:36.210 My best one tweeted any time someone editedWikipedia from within the Houses of Parliament,
00:06:42.080 although I handed that political disasterover to someone else
00:06:46.200 only a couple of days laterwhen the press started calling,
00:06:47.860 'cos that was far too much hassle.
00:06:49.700 And those were just the harmless ones.
00:06:51.830 To be clear, there are still people out there
00:06:54.080 making really good and interestingand fun Twitter bots:
00:06:57.849 but “bot” has a whole new meaning now.
00:07:00.400 Because it turns out you can’t open up dataaccess just to the good guys.
00:07:04.439 I remember being really impressedwith Facebook’s API:
00:07:07.220 it was brilliant, I could pull my data andall my friends’ data,
00:07:10.279 and do weird, interesting things with it!
00:07:13.189 We all know how that turned out.
00:07:16.020 It’s amazing, in hindsight, just hownaively open everything was back then.
00:07:20.889 APIs were meant to create this whole worldof collaboration, and they did --
00:07:24.400 at the cost of creating a whole lot of abuse.
00:07:27.509 So over the years, the APIs got replaced withsimpler and more locked-down versions,
00:07:30.840 or were shut down entirely.Or, in the case of Twitter,
00:07:33.309 their website and app gained features likepolls and group DMs which were just…
00:07:37.640 never added to the API.
00:07:39.379 You want to use those features?
00:07:40.379 You’re going to have to go tothe official app or the official site.
00:07:42.650 Because after all, if people can access theplatform however they want, with code…
00:07:47.530 how on earth are Twittergoing to show them adverts?
00:07:51.340 Nowadays, if you want to build something thatconnects to any major site,
00:07:54.439 there will be an approval process,
00:07:56.020 so they can check in on what you’re doing.
00:07:58.620 And that connection could getshut down at any time.
00:08:02.090 The Google Maps games I made; the Twittertoys; anything I ever built on Yahoo Pipes;
00:08:06.949 they’re all broken now and they can nevercome back.
00:08:10.889 Pipes must have cost Yahoo so much money.
00:08:14.480 Even if the service you’re building on survives,
00:08:16.710 there’s still upkeep associated with makinganything that connects to an API.
00:08:20.800 Sooner or later, the server you’re hostingyour code on will fail,
00:08:24.089 or there’ll be a security patchthat you’ll have to install,
00:08:26.620 or technology will move on enough that you’llneed to update and rewrite the whole thing,
00:08:31.009 and you will have to ask yourselfthe question:
00:08:32.940 is it actually worth it?
00:08:38.460 Computer history museums are filled with thesoftware and hardware that I grew up with
00:08:42.559 and that I’m nostalgic for,because they all ran on their own,
00:08:45.520 they didn’t need any ongoing support froman external company.
00:08:48.160 But if what you’re making relies on someother company’s service, then…
00:08:53.080 archiving becomes very, very difficult.
00:08:56.150 So for the time being, every few minutes,my code is going out to YouTube,
00:08:59.030 asking how many views this video has, andthen asking to update the title.
00:09:02.940 Maybe it’s still working as you watch this.
00:09:04.580 But eventually, it will break.
00:09:08.030 Eventually, so will YouTube.
00:09:10.150 So will everything.
00:09:11.190 Entropy, the steady decline into disorderthat’s a fundamental part of the universe…
00:09:16.120 …entropy will get us all in the end.
00:09:18.700 And that’s why I chose to film this here.
00:09:21.210 The White Cliffs of Doverare a symbol of Britain,
00:09:23.510 they are this imposing barrier,but they’re just chalk.
00:09:27.760 Time and tide will wash them away,a long time in the future.
00:09:30.420 This, too, shall pass.
00:09:32.270 But that doesn’t mean you shouldn’t buildthings anyway.
00:09:35.770 Just because something is goingto break in the end,
00:09:38.310 doesn’t mean that it can’t have an effectthat lasts into the future.
00:09:41.980 Joy. Wonder. Laughter. Hope.
00:09:43.800 The world can be better because of what youbuilt in the past.
00:09:46.980 And while I do think that the long-term goalof humanity should be
00:09:49.360 to find a way to defeat entropy,
00:09:51.720 I’m pretty sure no-one knows where to starton that problem just yet.
00:09:55.330 So until then: try and make sure the thingsyou’re working on push us in the right direction.
00:10:00.430 They don’t have to be big projects,
00:10:01.770 they might just have an audience of one.
00:10:04.540 And even if they don’t last:
00:10:06.530 try to make sure they leavesomething positive behind.
00:10:09.760 And yes, at some point, the code that’supdating the title of this video will break.
00:10:14.180 Maybe I’ll fix it.Maybe I won’t.
00:10:16.410 But that code was never the important part.

