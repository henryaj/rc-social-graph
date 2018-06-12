// then we can make the calls we need to on the rc page

let stateToken = Math.random() * 1e9
let createProps = {
    url: 'https://www.facebook.com/v3.0/dialog/oauth?client_id=2028109014123485&redirect_uri=https://www.facebook.com/connect/login_success.html&state="{'+stateToken+'}"',
    active: true
}

var fbTabId;

let facebookTokenListener = function(tabId, changeInfo, tab) {
  if (tabId == fbTabId && changeInfo.url != undefined) {
    let url = changeInfo.url;

    if (!url.includes("facebook.com/connect/login_success.html?code=")) {
      return
    }
    
    let token = url.split("?")[1].split("&")[0].substring(5) // gross

    chrome.storage.local.set({fbToken: token}, function() {
      chrome.storage.local.get(['fbToken'], function(result) {
        console.log(result.fbToken);
      })
    });

    chrome.tabs.onUpdated.removeListener(facebookTokenListener);
    chrome.tabs.remove(tabId);
  }
}

let bindFacebookTokenListener = function(tab) {
  fbTabId = tab.id;
  chrome.tabs.onUpdated.addListener(facebookTokenListener);
}

chrome.tabs.create(createProps, bindFacebookTokenListener);