chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab)=>{
    console.log(tabId);
    url=tab.url;
    if(url && url.includes("youtube.com/watch"))
    {
        const queryParams=url.split("?")[1];
        const urlParams= new URLSearchParams(queryParams);
        console.log(urlParams);
        chrome.tabs.sendMessage(tabId,{
            id:tabId,
            type:"new_video",
            videoId:urlParams.get("v"),
        })

        // const Urls = ["https://*.googleadservices.com/*"];
        // chrome.webRequest.onBeforeRequest.addListener(
        //     function(details) { return {cancel: true}; },
        //     {urls: Urls},
        //     ["blocking"]
        //   );
    
    }
    else
    {
        console.log("not matched"+url);
    }
})
chrome.runtime.onMessage.addListener((obj,sender,resonse)=>{
    console.log(obj);
    const notificationOptions={
        title: 'Bookmarks',
        message: "Count : "+String(obj["count"]),
        iconUrl: '/icon.png',
        type: 'basic'
    }
    chrome.notifications.clear('countDisplay',()=>{
        chrome.notifications.create('countDisplay',notificationOptions);
    })
  

    chrome.action.setBadgeText({tabId:obj["id"],text:String(obj["count"])});
    resonse({got:"count"});
   
})

