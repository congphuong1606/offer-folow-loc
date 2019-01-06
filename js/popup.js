let dataLead = [];
onWindowLoad();

let idLoc = 4;
let idKhoa = 3;
let idKien = 10;
let idHaiDang = 19;
let idBeNgoc = 13;
let idDung = 34;
let idMob = 35;

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#offOn').addEventListener('change', offon);

    function offon() {
        if (offOn.checked) {
        } else {
            chrome.runtime.sendMessage({
                action: "setRingOff"
            });
        }
    }

    document.querySelector('#checkLoc').addEventListener('change', loc_Hander);
    document.querySelector('#checkKhoa').addEventListener('change', khoa_Hander);
    document.querySelector('#checkKien').addEventListener('change', kien_Hander);
    document.querySelector('#checkHaidang').addEventListener('change', haidang_Hander);
    document.querySelector('#checkBengoc').addEventListener('change', bengoc_Hander);
    document.querySelector('#checkDung').addEventListener('change', dung_Hander);
    document.querySelector('#checkMob').addEventListener('change', mob_Hander);

    function loc_Hander() {
        if (checkLoc.checked) {
            chrome.runtime.sendMessage({action: "checkbox", type: "check", id: idLoc,});
        } else {
            chrome.runtime.sendMessage({action: "checkbox", type: "uncheck", id: idLoc,});
        }
    }

    function dung_Hander() {
        if (checkDung.checked) {
            chrome.runtime.sendMessage({action: "checkbox", type: "check", id: idDung,});
        } else {
            chrome.runtime.sendMessage({action: "checkbox", type: "uncheck", id: idDung,});
        }
    }
    function mob_Hander() {
        if (checkMob.checked) {
            chrome.runtime.sendMessage({action: "checkbox", type: "check", id: idMob,});
        } else {
            chrome.runtime.sendMessage({action: "checkbox", type: "uncheck", id: idMob,});
        }
    }

    function khoa_Hander() {
        if (checkKhoa.checked) {
            chrome.runtime.sendMessage({action: "checkbox", type: "check", id: idKhoa,});
        } else {
            chrome.runtime.sendMessage({action: "checkbox", type: "uncheck", id: idKhoa,});
        }
    }

    function kien_Hander() {
        if (checkKien.checked) {
            chrome.runtime.sendMessage({action: "checkbox", type: "check", id: idKien,});
        } else {
            chrome.runtime.sendMessage({action: "checkbox", type: "uncheck", id: idKien,});
        }
    }


    function haidang_Hander() {
        if (checkHaidang.checked) {
            chrome.runtime.sendMessage({action: "checkbox", type: "check", id: idHaiDang,});
        } else {
            chrome.runtime.sendMessage({action: "checkbox", type: "uncheck", id: idHaiDang,});
        }
    }


    function bengoc_Hander() {
        if (checkBengoc.checked) {
            chrome.runtime.sendMessage({action: "checkbox", type: "check", id: idBeNgoc,});
        } else {
            chrome.runtime.sendMessage({action: "checkbox", type: "uncheck", id: idBeNgoc,});
        }
    }

});


function onWindowLoad() {
    chrome.storage.sync.get(
        ["dataLead", "listID"
        ], function (items) {
            try {
                dataLead = JSON.parse(items.dataLead);
                let listID = JSON.parse(items.listID);
                console.log(listID);

                if (listID.length > 0) {
                    listID.forEach(id => {
                        switch (id) {
                            case idLoc:
                                document.getElementById('checkLoc').checked = true;
                                break;
                            case idKien:
                                document.getElementById('checkKien').checked = true;
                                break;
                            case idKhoa:
                                document.getElementById('checkKhoa').checked = true;
                                break;
                            case idBeNgoc:
                                document.getElementById('checkBengoc').checked = true;
                                break;
                            case idHaiDang:
                                document.getElementById('checkHaidang').checked = true;
                                break;
                            case idDung:
                                document.getElementById('checkDung').checked = true;
                                break;
                            case idMob:
                                document.getElementById('checkMob').checked = true;
                                break;
                        }
                    })
                }

                let ison = false;
                dataLead.forEach(item => {
                    if (item.ring === 'on') {
                        ison = true;
                    }
                });
                if (ison) {
                    document.getElementById('offOn').checked = true;
                } else {
                    document.getElementById('offOn').checked = false;
                }
                dataLead.reverse();
                dataLead.forEach(item => {
                    let id = item.user;
                    let ctime = (new Date()).getTime()
                    let timeStamp = parseInt((ctime - item.time) / 60000);
                    if (item.ring == 'on') {
                        document.getElementById('listOffers').innerHTML += '     <hr><div class="offer"><div class="idOffers"><h2 id="' + id + '">' + id + '</h2></div><div class="name"><h2>'
                            + item.name.slice(0, 33) +
                            '</h2></div><div class="timeStamp"><h5>' + timeStamp +
                            ' phút trước </h5></div> <div class="status"> <h4 style="color: blue">Mới</h4></div> </div>';
                    } else {
                        document.getElementById('listOffers').innerHTML += '     <hr><div class="offer"><div class="idOffers"><h2 id="' + id + '">' + id + '</h2></div><div class="name"><h2>'
                            + item.name.slice(0, 33) +
                            '</h2></div><div class="timeStamp"><h5>' + timeStamp +
                            ' phút trước </h5></div> <div class="status"> <h4 style="color: #cccccc">Đã xem</h4></div> </div>';
                    }

                });
            } catch (e) {
            }
        });


}

chrome.runtime.onMessage.addListener(function (request, sender) {
    if (request.action === "setHtml") {
        console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH')
    }
});
