let dataLead = [];
onWindowLoad();

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#offOn').addEventListener('change', offon);

    function offon() {
        if (offOn.checked) {
            console.log('check');

        }
        else {
            chrome.runtime.sendMessage({
                action: "setRingOff"
            });
            console.log("setRingOff")
        }
    }




});




function onWindowLoad() {
    chrome.storage.sync.get(
        ["dataLead"
        ], function (items) {
            try {
                dataLead = JSON.parse(items.dataLead);

                let ison = false;
                dataLead.forEach(item => {
                    if (item.ring == 'on') {
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
                    let id='.';
                    let ctime=(new Date()).getTime()
                    let timeStamp=parseInt((ctime-item.time)/60000);
                    if (item.ring == 'on') {
                        document.getElementById('listOffers').innerHTML += '     <hr><div class="offer"><div class="idOffers"><h2 id="'+id+'">'+ id +'</h2></div><div class="name"><h2>'
                          +item.name.slice(0, 33)  +
                            '</h2></div><div class="timeStamp"><h5>'  + timeStamp  +
                            ' phút trước </h5></div> <div class="status"> <h4 style="color: blue">Mới</h4></div> </div>';
                    } else {
                        document.getElementById('listOffers').innerHTML += '     <hr><div class="offer"><div class="idOffers"><h2 id="'+id+'">'+ id +'</h2></div><div class="name"><h2>'
                           + item.name.slice(0,33)  +
                            '</h2></div><div class="timeStamp"><h5>'  + timeStamp  +
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
