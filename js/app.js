let idTabEndilo = "";
let dataLead = [];
let myAudio = new Audio();
myAudio.src = "img/iphonex.mp3";

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


function isExistDataLead(item, time) {
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
    console.log('isCheck')
    console.log(isCheck)
    return isCheck;
}

function setRingRing() {
    let isRing = false;
    chrome.storage.sync.set({"dataLead": JSON.stringify(dataLead)}, function () {
    });
    try {
        dataLead.forEach(itemd => {
            if (itemd.ring == 'on') {
                isRing = true;
            }
        });
    } catch (e) {

    }
    if (isRing) {
        myAudio.play();
        window.open("popup.html", "extension_popup", "width=770,height=850,status=no,scrollbars=yes,resizable=no");
    }
    isSuccess = true;
    chrome.runtime.sendMessage({
        action: "setHtml",
    });
}

async function getData() {
    await sleep(3000);
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
                    "                     var date = (new Date(listTr[i].children[1].innerText)).getTime();\n" +

                    "                     var name  = listTr[i].children[6].innerText+'-'+listTr[i].children[3].innerText.split(' ').join('-').slice(0, 30).trim();    \n" +
                    "                      var object = { name:name,time:date};\n" +
                    "                       list.push(object);\n" +
                    "                  }}\n" +
                    "                 return {list:list,pageCount:pageCount};\n" +
                    "                 };getdata();"
                }, function (result) {
                    if (result !== undefined && result[0] !== null) {
                        let data = result[0].list;
                        try {
                            data.forEach(item => {
                               // console.log(item);
                                let timeCurrent = (new Date()).getTime();
                                /*   timeCurrent = timeCurrent.split('GMT+0700')[0] + 'GMT+0700';
                                   timeCurrent = (new Date(timeCurrent)).getTime();*/
                                let time = item.time;
                               // console.log(' console.log(dataLead);');
                               // console.log(timeCurrent);

                                if (isExistDataLead(item, time)) {
                                } else {


                                    let dur = timeCurrent - time;
                                    let dataItem = {
                                        name: item.name,
                                        time: time,
                                        ring: 'on',
                                    };
                                    if (dur <= (120 * 1000 * 60)) {
                                        dataLead.push(dataItem);
                                    }

                                }
                            });
                        }catch (e) {
                            isSuccess = true;
                            console.log('ko co data');
                        }
                       /* console.log('data');
                        console.log(data);
                        console.log('dataLead');*/
                        console.log(dataLead);
                        setRingRing();
                    } else {
                        isSuccess = true;
                        console.log('ko co data');
                    }
                });
            } catch (e) {
                isSuccess = true;
                console.log('catch getdata');
            }
        }
    });

}



async function clickUserLoc() {
    await sleep(4000);
    chrome.tabs.query({}, function (tabs) {
        if (isExistTab(tabs)) {
            try {
                chrome.tabs.executeScript(idTabEndilo, {
                    "code": "var el = document.getElementsByName('user_id')[0];var ev = new Event('input', { bubbles: true,simulated :true});el.value =4;el.defaultValue  =4;el.dispatchEvent(ev);document.getElementsByClassName('icon-refresh')[0].click();"
                }, function (result) {
                    getData();
                });
            } catch (e) {
                isSuccess = true;
                console.log('catch clickUserLoc');
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
        clickUserLoc();
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
                    clickUserLoc();
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

let isSuccess = true;
setInterval(function () {
     removeOld();
    if (isSuccess) {
        isSuccess = false;
        openTabEndilo();
    }
}, 5000);


