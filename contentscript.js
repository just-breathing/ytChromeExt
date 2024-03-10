(()=>{
    const convertHMS=(value)=>{
        const sec = parseInt(value, 10); 
        let hours   = Math.floor(sec / 3600); 
        let minutes = Math.floor((sec - (hours * 3600)) / 60); 
        let seconds = sec - (hours * 3600) - (minutes * 60); 
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes+':'+seconds; 
    }



    let player,tabid;
    let currentVideo="";
    let currentvideobm=[];
    let t="";

    const fetchBookmarks = ()=>{

        return new Promise((resolve) => {
            try {
                chrome.storage.local.get([currentVideo], (res)=>{
                    console.log("getting data : ",res,currentVideo);
                    resolve(res[currentVideo]===undefined?[]:JSON.parse(res[currentVideo]));
                })
            }
            catch (ex) {
                console.log(ex);
            }
        });
    }
const changeBadge = (num)=>{
    chrome.runtime.sendMessage({"id":tabid,"count":num},(res)=>{
        console.log("count : ",num);
    });
}
    const handleBookmark = async()=>{
        t=player.currentTime;
        const newBm = {
            time:t,
            description:`${convertHMS(t)} `
        }
        fetchBookmarks().then((res)=>{
            currentvideobm=[...res,newBm]
            chrome.storage.local.set({
                [currentVideo]:JSON.stringify(currentvideobm.sort((a,b)=>a.time-b.time))
            });
            console.log("handling : ",currentvideobm);
            changeBadge(currentvideobm.length);

        })
       
     
    }

    const newVideoLoaded = async()=>{
        console.log("new video")
        currentvideobm=await fetchBookmarks();
        console.log(currentvideobm);
        changeBadge(currentvideobm.length);
         const  addButExists =document.querySelector(".cusbutton");
         const rightControls=document.querySelector(".ytp-right-controls");
         player=document.querySelector(".video-stream");
        if(!addButExists)
        {
            const addBut=document.createElement("button");
            addBut.innerHTML=`<div class="draw"><div class="hor"></div><div class="ver"></div></div>`;
            addBut.classList.add("ytp-button");
            addBut.classList.add("cusbutton");
            rightControls.appendChild(addBut);
            addBut.addEventListener("click", handleBookmark);
        }
    }


chrome.runtime.onMessage.addListener((obj,sender,response)=>{
    const {type,value,videoId,id}=obj;
    console.log("type : "+type);
    if(type==="new_video")
    {
        tabid=id;
        currentVideo=videoId;
        newVideoLoaded();
    }
    else if(type==="play")
    {
        player.currentTime=value;
    }
    else if(type==="delete")
    {
        currentvideobm=currentvideobm.filter(el=>el.time!=value)
        changeBadge(currentvideobm.length);
        chrome.storage.local.set({
            [currentVideo]:JSON.stringify(currentvideobm)
        })
    }
    response({got:true});
});

})();