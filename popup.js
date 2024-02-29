const playSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"/></svg>`
const deleteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"/></svg>`
let id="";
let len=null;
const fetchBookmarks = (id)=>{
    return new Promise((resolve)=>{
        chrome.storage.local.get([id],(res)=>{
            resolve(res[id]===undefined?[]:JSON.parse(res[id]))
        })
    })
}
      
const addChildren=(bms,item,tab)=>{
    const bm=document.createElement("div");
    bm.classList.add("bm",item.time);
    const p = document.createElement("p");
    p.textContent=item.description;
    const options=document.createElement("div");
    options.classList.add("options");
    const bmplay=document.createElement("div");
    bmplay.classList.add("bmplay");
    bmplay.innerHTML=playSvg;
    const bmdelete=document.createElement("div");
    bmdelete.classList.add("bmdelete");
    bmdelete.innerHTML=deleteSvg;
    options.append(bmplay,bmdelete);
    bm.append(p,options);
    bms.appendChild(bm);
    bmplay.addEventListener("click",()=>{
        chrome.tabs.sendMessage(tab.id,{
            type:"play",
            value:item.time,
         })
    })
    bmdelete.addEventListener("click",()=>{
        bms.removeChild(bm);
        len=len-1;
        chrome.tabs.sendMessage(tab.id,{
            type:"delete",
            value:item.time,
        });
        if(len===0)
        {
            renderData(tab);
            console.log("notify");
                const notificationOptions={
                    type:"basic",
                    title:"No bookmarks",
                    message:"length of bookmarks : 0"
                }
                chrome.notifications.create('zeroBoundCount',notificationOptions);
            
        }

        });
}
const renderData = async(tab)=>{
    const data = await fetchBookmarks(id);
    console.log(data);
    const bms = document.querySelector(".bms");
    if(data.length===0)
    {
        bms.innerHTML=`<p class="none">No bookmarks to show</p>`
    }
    else
    {
        len=data.length;
        for(let i=0;i<len;i++)
        {
            addChildren(bms,data[i],tab);
        }
    }
          
}



document.addEventListener("DOMContentLoaded",()=>{

    chrome.tabs.query({active:true},async(tabs)=>{
        const tab=tabs[0];
        if(tab.url && tab.url.includes("youtube.com/watch"))
        {
            const urlparams = new URLSearchParams(tab.url.split("?")[1])
            console.log(urlparams.get("v"))
              id=urlparams.get("v");
            
            renderData(tab);
        }
        else
        {
            const bms = document.querySelector(".bms");
            bms.innerHTML=`<div class="support">This Extension only works for youtube</div>`
        }
    })
})


