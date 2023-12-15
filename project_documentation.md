##### Welcome to the PowerSearch Github repo.  
This project was designed as the final project for CS410.  All development was done by Joe Caparelli (jcc12@illinois.edu)

This document will provide to give a general overview of the tool, some implementation details, installation instruction, along with suggestions for future improvements.

### Overview of PowerSearch

PowerSearch is a chrome extension that allows the user to better search Wikipedia articles.  While it can likely be applied to other webpages, the tool assumes the same html structure as a wikipedia article. Using PowerSearch, a user can query a wikipedia article for a phrase or term and be linked to the most relevant paragraph of the document.  Inherently, this is much more powerful than simply cmd-F'ing a term as that relies on an exact matc whereas powersearch operates similarly to how you could query a search engine.  Additionally, for topics with lots of matches it could unclear which is the most relevant.  PowerSearch solves this by utilizing BM25 to rank the documents structure.

### Implementation Details

Powersearch is powered by BM25.  In this sense it treats a paragraph of the wikipedia article as a document.  BM25 uses Term Frequency and Inverse Document Frequency to generate scores for each document in the collection.  More information can be found here on BM25 https://en.wikipedia.org/wiki/Okapi_BM25.  This implementation uses the default BM25 values with k1 set to and b set to .  

This document uses a Chrome Extension to operate.  Chrome Extension have the following structure.  First a manifest.json file that specifies the artifacts and which websites your extension can run on.  Next, an images folder filled with icons for your application to use (I simply used some defaults provided by Chrome's documentation).  This also includes a content script.  This file content.js contains the document processing.  This runs on the document open in the current window and computes the BM25 function.  This file contains various helper functions to do this computation as well.  As such, their documentation can be found inline in the source code with more detailed comments.  Please refer to this.  Finally, the remaining aspects concern the popup window which allows users to input their query.  The popup html and css file specify its structure and style elements.  The popup.js file specifies its logic and handles communicating between the two scripts.  This script will send a message on form completion to the background script.  The background script has a listener configured that when it receives a message it processes this as a query and highlights and navigates to the most relevant section of the article.  

### Installation Instructions

In order to install follow these steps.

1. Download all relevant code artifacts from this repo.  Place the cs410-extension folder in a directory.
2. Next open up a Chrome browser window.
3. Navigate to chrome://extensions/
4. Toggle on Developer Mode
5. Click Load unpacked
6. Select the cs410-extension directory
7. Navigate to a wikipedia article of your chosing, preferabbly one rich in text.
8. Click the extension icon (looks like a puzzle piece and should be in your browser window)
9. Search a query **It is important that you click the button rather than hitting enter on your keyboard**
10. The extension will now navigate you to the most relevant section

### Future Work
First and foremost, I am not much of a ux-designer as you can likely tell.  One way to improve this implementation would be to update this plugin to be more aesthetically pleasing.
Next, there is an open issue that I was unable to resolve in time (I spent well over 20 hours on this project so I wasn't able to resolve this in time) relating to the plugin.  If a user does not press the submit button and instead hits enter on their keyboard no action is taken.  Resolving this bug would likely improve the user experience
Third, this plugin primarily works on wikipedia.  Updating it to be more generic and work on additional sites would likely prove difficult but could be a rewarding experience. This would require a better method of text extraction that relying on paragraph tags
Finally, this plugin only extracts text from the paragraph tags.  Updating this to handle additional data sources or supporting additional ranking algorithms would be a great next step.  
