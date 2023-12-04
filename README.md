# potluck
Chrome extension to simplify your Youtube feed and curate video recommendations from friends  
[Chrome Web Store listing](https://chrome.google.com/webstore/detail/potluck/mpgljjemfdiemijijojnbpmcipkmhbhc)


### Functionality
potluck is based on curated, peer-to-peer recommendations. potluck users authenticate through Google. Each user is limited to one current recommendation. Each user account
is linked to the youtube video url they recommended. When you navigate to any youtube video page, the sub-menu under the video player has an orange Recommend button. Clicking
this button updates your recommendation in the database. _(If you want to see your own recommendation, add your own email to your Google contacts list)_ Conversely, all of your
Google contacts _with a valid email_ can update their recommendations in the database. When you navigate to the Youtube homepage, your recommendation feed should be divided in two
sections:
1. Your Potluck Recommendations
2. Your Youtube Recommendations

The first section will pull in a limited selection of recommendations from [your Google contacts](https://contacts.google.com/). In the current version of potluck, the maximum limit of recommended videos is 20
and they are pulled in no particular order. The second section has the standard recommendation feed provided by Youtube's recommendation algorithm. This feed is also limited to
a maximum of 5 rows.

### Options
The potluck extension icon in the extensions toolbar provides user options to customize your feed. You can choose the number of potluck recommendation videos you want to see
on the homepage from the options [5,10,15,20]. You can also select the number of rows of Youtube recommendations you want to see from the options [1,2,3,5]. To stay compatible with Youtube's dark mode, there is a dark mode toggle that changes the text between black and white.

### Motivation
The Youtube algorithm is a great mechanism for exploration. But it is designed to maximize watchtime using signals that operate directly with your subconscious behavior. potluck is an effort to minimize watchtime - in a way that is transparant to you. The only signal is the people whose opinion you value.

### Current Issues
1. The recommednation button doesn't load upon navigating to a video from the homepage. Refreshing the page usually works.
2. The Youtube video metadata (thumbnail, title) is pulled using the Youtube API, and the contact information through Google People API, both of which are rate limited.
