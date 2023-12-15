/**
 * This file handles the popup button logic.
 * It communicates by sending a message on button click of the query terms to the content script
*/

const button = document.querySelector("button");
button.addEventListener("click", async () => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {text:document.getElementById('querystring').value}, function(response){
    });
  });
});
