console.log("content runs 2")

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  console.log(sender.tab ?
    "from a content script:" + sender.tab.url :
    "from the extension");
  if (request.greeting === "hello")
    sendResponse({farewell: "goodbye"});
});



chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  console.log(response.farewell);
});
