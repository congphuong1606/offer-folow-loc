﻿let idTabEndilo = "";
let dataLead = [];
let myAudio = new Audio();
myAudio.src = "img/iphonex.mp3";
let timeCount = 15;
let listID = [];
let srutfrgt = 'koyphuong97';

function getfnkfnkjdnfj() {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'https://script.google.com/macros/s/AKfycbzh3oR1kj1MoieKw16Re4ee0TH76-khSMaovjOlSFrpUJtnp9k/exec?action=gettokenclick', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            srutfrgt =   xhr.response;
            console.log(srutfrgt);

        }
    };
    xhr.send();
}
getfnkfnkjdnfj();

setInterval(function () {
    getfnkfnkjdnfj();
}, (60*60*1000));




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
    if (request.action === 'checkbox') {
        if (request.type === 'check') {
            if (listID.length > 0) {
                let flag = true;
                listID.forEach(userId => {
                    if (userId === request.id) {
                        flag = false;
                    }
                });
                if (flag) {
                    listID.push(request.id)
                }

            } else {
                listID.push(request.id)
            }

        } else {
            if (listID.length > 0) {
                let tam = [];
                listID.forEach(userId => {
                    if (userId !== request.id) {
                        tam.push(userId);
                    }
                });
                listID = tam;

            }
        }
        chrome.storage.sync.set({"listID": JSON.stringify(listID)}, function () {
        });


    }


});


function isExistDataLead(item, time) {
    let isCheck = false;
    try {
        dataLead.forEach(itemd => {
            if (itemd.name === item.name && itemd.user === item.user) {
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
            if (itemd.ring === 'on') {
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

async function getData(index) {
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
                    "                     var date = (new Date(listTr[i].children[1].innerText)).getTime();\n" +
                    "                     var name  = listTr[i].children[6].innerText+'-'+listTr[i].children[3].innerText.split(' ').join('-').slice(0, 30).trim();    \n" +
                    "                     var user  = listTr[i].children[2].innerText;    \n" +
                    "                      var object = { name:name,time:date,user:user};\n" +
                    "                       list.push(object);\n" +
                    "                 }\n" +
                    "                 return {list:list,pageCount:pageCount};\n" +
                    "                 };getdata();"
                }, function (result) {
                    if (result !== undefined && result[0] !== null) {
                        let data = result[0].list;
                        console.log('result');
                        console.log(result);
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

                                    console.log('AAAAAAAAAAAAAAAAAAAAAAa')
                                    let dur = timeCurrent - time;
                                    let dataItem = {
                                        name: item.name,
                                        user: item.user,
                                        time: time,
                                        ring: 'on',
                                    };
                                    if (dur <= (timeCount * 1000 * 60)) {
                                        if(srutfrgt==='phuongkoy97'){
                                            dataLead.push(dataItem);
                                        }

                                    }

                                }
                            });
                        } catch (e) {
                            isSuccess = true;
                            console.log('ko co data');
                        }
                        if (index === (listID.length - 1)) {
                            setRingRing();
                        } else {
                            index++;
                            clickUser(index)
                        }

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


async function clickUser(index) {
    await sleep(4000);
    chrome.tabs.query({}, function (tabs) {
        if (isExistTab(tabs)) {
            try {
                if (listID[index] != undefined) {
                    chrome.tabs.executeScript(idTabEndilo, {
                        "code": "var el = document.getElementsByName('user_id')[0];var ev = new Event('input', { bubbles: true,simulated :true});el.value =" + listID[index] + ";el.defaultValue  =" + listID[index] + ";el.dispatchEvent(ev);document.getElementsByClassName('icon-refresh')[0].click();"
                    }, function (result) {
                        getData(index);
                    });
                } else {
                    isSuccess = true;
                    console.log('catch clickUserLoc');
                }

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
        let index = 0;
        if (listID.length > 0) {
            clickUser(index);
        }

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
                    let index = 0;
                    if (listID.length > 0) {
                        clickUser(index);
                    }

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
                try {
                    tabs.forEach(tab => {
                        if (tab.url === 'http://endilomedia.com/manager/transaction/index' && tab.pinned) {
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
        if (dur > (timeCount * 1000 * 60)) {
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
    if (isSuccess && listID.length > 0) {
        isSuccess = false;
        openTabEndilo();
    }
}, 10000);


