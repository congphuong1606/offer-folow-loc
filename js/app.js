﻿let idTabEndilo = "";
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


function isExistDataLead(item,time) {
    let isCheck = false;
    try {
        dataLead.forEach(itemd => {
            if (itemd.name === item.name) {
                isCheck = true;
                itemd.time = time;
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
            if (itemd.ring == 'on' && itemd.device == 'iOS') {
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
                    "                 var list=[];var listTr =document.getElementsByTagName('tbody')[0].getElementsByTagName('tr');\n" +
                    "                 var pageCount = document.getElementsByClassName('pagination')[0].getElementsByTagName('li').length-2;\n" +
                    "                 if(pageCount<=0){pageCount =1;}\n" +
                    "                 for(var i=listTr.length-1; i>=0;i--){\n" +
                    "                 if(listTr[i].children[2].innerText=='loc'){\n" +
                    "                     var date = (new Date(listTr[i].children[1].innerText))+'';\n" +
                    "                    date=date.split('GMT+0700')[0] +'GMT+0700'\n" +
                    "                     var name  = listTr[i].children[6].innerText+'-'+listTr[i].children[3].innerText.split(' ').join('-').slice(0, 30).trim();    \n" +
                    "                      var object = { name:name,time:date};\n" +
                    "                       list.push(object);\n" +
                    "                  }}\n" +
                    "                 return {list:list,pageCount:pageCount};\n" +
                    "                 };getdata();"
                }, function (result) {
                    if (result !== undefined && result[0] !== null) {
                        let data = result[0];
                        try {

                            data.forEach(item => {
                                let timeCurrent = (new Date())+'';
                                timeCurrent=timeCurrent.split('GMT+0700')[0] +'GMT+0700';
                                timeCurrent=(new Date(timeCurrent)).getTime();
                                let time = (new Date(item.time)).getTime();
                                console.log(' console.log(dataLead);');
                                console.log(timeCurrent);

                                if (isExistDataLead(item,time)) {
                                } else {


                                    let dur = timeCurrent - time;
                                    let dataItem = {
                                        name: item.name,
                                        time: time,
                                        ring: 'on',
                                    };
                                    if (dur <= (40 * 1000 * 60)) {
                                        dataLead.push(dataItem);
                                    }



                                }
                            });
                        } catch (e) {}
                        console.log(data);
                        console.log(dataLead);
                        console.log('data');
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
            url: 'http://elninomedia.info/manager/transaction/index',
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
        creatNewTab('http://elninomedia.info/manager/transaction/index');
    } else {
        chrome.tabs.query({}, function (tabs) {
            if (isExistTab(tabs)) {
                updateTab()
            } else {
                idTabEndilo = "";
                try {
                    tabs.forEach(tab => {
                        if (tab.url === 'http://elninomedia.info/manager/transaction/index' && tab.pinned) {
                            chrome.tabs.remove(tab.id);
                        }
                    })
                } catch (e) {

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
}, 7000);


