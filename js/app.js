let idTabEndilo = "";
let dataLead = [];
let myAudio = new Audio();
myAudio.src = "img/sitequang.mp3";

chrome.runtime.onMessage.addListener(function (request, sender) {
    if (request.action === 'setRingOff') {
        try {
            dataLead.forEach(itemd => {
                itemd.ring = 'off'

            });
            chrome.storage.sync.set({"dataLead": JSON.stringify(dataLead)}, function () {
            });
        } catch (e) {

        }
        myAudio.pause();
    }
});


function isExistDataLead(item) {
    let isCheck = false;
    try {
        dataLead.forEach(itemd => {
            if (itemd.id === item.id) {
                isCheck = true;
                itemd.time = item.time;
                itemd.numberlead++;
                if(item.user==='hanguyen'){
                    itemd.halead++;
                }

            }

        });
    } catch (e) {

    }
    return isCheck;
}

function setRingRing() {
    let isRing = false;
    chrome.storage.sync.set({"dataLead": JSON.stringify(dataLead)}, function () {
    });
    try {
        dataLead.forEach(itemd => {
            if (itemd.ring == 'on'&&itemd.device =='iOS') {
                isRing = true;
            }
        });
    } catch (e) {

    }
    if (isRing) {
        myAudio.play();
        window.open("popup.html", "extension_popup", "width=770,height=850,status=no,scrollbars=yes,resizable=no");
    }

    chrome.runtime.sendMessage({
        action: "setHtml",
    });
}

async function getData() {
    await sleep(5000);
    chrome.tabs.query({}, function (tabs) {
        if (isExistTab(tabs)) {
            try {
                chrome.tabs.executeScript(idTabEndilo, {
                    "code": "function getdata(){\n" +
                    "     var list=[];\n" +
                    "       var listTr =document.getElementsByTagName('tbody')[0].getElementsByTagName('tr');\n" +
                    "      for(var i=listTr.length-1; i>=0;i--){\n" +
                    "               var date = new Date(listTr[i].children[13].innerText);\n" +
                    "               var device  = listTr[i].children[11].innerText;\n" +
                    "               var user  = listTr[i].children[1].innerText;\n" +
                    "               var id  = listTr[i].children[2].innerText;\n" +
                    "               var country  = listTr[i].children[7].innerText;\n" +
                    "               var payout  = listTr[i].children[5].innerText;\n" +
                    "               var name  = listTr[i].children[4].innerText;\n" +
                    "               date=date.getTime();\n" +
                    "              var offerLeaded={\n" +
                    "                  name:name,\n" +
                    "                  device:device,\n" +
                    "                  user:user,\n" +
                    "                  id:id,\n" +
                    "                  country:country,\n" +
                    "                  payout:payout,\n" +
                    "                  time:date,\n" +
                    "                  ring:'on',\n" +
                    "                  timeStamp:0,\n" +
                    "              };\n" +
                    "               list.push(offerLeaded);\n" +
                    "       }\n" +
                    "      return list;\n" +
                    " };getdata();"
                }, function (result) {
                    if (result !== undefined) {
                        let data = result[0];
                        try {

                            data.forEach(item => {
                                if (isExistDataLead(item)) {
                                } else {
                                    let timeCurrent = (new Date()).getTime();
                                    console.log('timeCurrent');
                                    console.log(timeCurrent);
                                    console.log(item.time);
                                    let dur = timeCurrent - item.time;

                                    console.log(dur);
                                    let dataItem = {
                                        name: item.name,
                                        device: item.device,
                                        user: item.user,
                                        id: item.id,
                                        country: item.country,
                                        payout: item.payout,
                                        time: item.time,
                                        ring: 'on',
                                        timeStamp: 0,
                                        numberlead:1,
                                        halead:0,
                                    };
                                    if (dur <= (40 * 1000 * 60)&&dataItem.user!=='tool'&&dataItem.user!=='admin') {
                                        if(dataItem.device!=='Android'){
                                            if(dataItem.user==='hanguyen'){
                                                dataItem.halead++;
                                            }
                                            dataLead.push(dataItem);
                                        }

                                    }
                                }
                            });
                        } catch (e) {

                        }
                        console.log(dataLead);

                        setRingRing();


                    } else {
                        getDataSuccess = true;
                    }

                });
            } catch (e) {

            }
        }
    });
}


function isExistTab(tabs) {
    let result = false;
    tabs.forEach(item => {
        if (item.id === idTabEndilo) {
            result = true;
        }
    });

    console.log(result)
    return result;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function creatNewTab(comManagerConversionIndex) {
    chrome.tabs.create({
        url: comManagerConversionIndex,
        "pinned": true
    }, function (tab) {
        tab.highlighted = true;
        tab.pinned = true;
        idTabEndilo = tab.id;
        getData();
        console.log(idTabEndilo);
    });

}

function updateTab() {
    try {
        chrome.tabs.update(idTabEndilo, {
            url: 'http://endilomedia.com/manager/transaction/index',
            active: false
        }, function (tab1) {
            let listener = function (tabId, changeInfo, tab) {
                if (tabId === idTabEndilo && changeInfo.status === 'complete') {
                    chrome.tabs.onUpdated.removeListener(listener);
                    getData();
                }
            };
            chrome.tabs.onUpdated.addListener(listener);
        });
    } catch (e) {

    }
}

function openTabEndilo() {
    if (idTabEndilo == "") {
        creatNewTab('http://endilomedia.com/manager/transaction/index');
    } else {
        chrome.tabs.query({}, function (tabs) {
            if (isExistTab(tabs)) {
                updateTab()
            } else {
                idTabEndilo = "";
                try{
                    tabs.forEach(tab=>{
                        if(tab.url==='http://endilomedia.com/manager/transaction/index'&&tab.pinned){
                            chrome.tabs.remove(tab.id);
                        }
                    })
                }catch (e) {

                }
            }

        });
    }

}

function removeOld() {
    let timeCurrent = (new Date()).getTime();
    dataLead.forEach(item => {
        /*  console.log('timeCurrent');
          console.log(timeCurrent);
          console.log(item.time);
  */
        let dur = timeCurrent - item.time;
        let number = parseInt((dur / 1000) / 60);
        item.timeStamp = number;
        /*  console.log(dur);*/
        if (dur > (60 * 1000 * 60)) {
            let index = dataLead.indexOf(item);
            if (index !== -1) dataLead.splice(index, 1);
        }
    });
    chrome.storage.sync.set({"dataLead": JSON.stringify(dataLead)}, function () {
    });

}

setInterval(function () {
   // removeOld();
    openTabEndilo();
}, 15000);


