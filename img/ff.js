function getdata(){
    var list=[];var listTr =document.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var pageCount = document.getElementsByClassName('pagination')[0].getElementsByTagName('li').length-2;
    if(pageCount<=0){pageCount =1;}
    for(var i=listTr.length-1; i>=0;i--){var name  = listTr[i].children[3].innerText;list.push(name.trim());}
    return {list:list,pageCount:pageCount};
};getdata();





function getdata(){
                 var list=[];var listTr =document.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
                 var pageCount = document.getElementsByClassName('pagination')[0].getElementsByTagName('li').length-2;
                 if(pageCount<=0){pageCount =1;}
                 for(var i=listTr.length-1; i>=0;i--){
                 if(listTr[i].children[2].innerText=='loc'){
                     var date = (new Date(listTr[i].children[1].innerText))+'';
                    date=date.split('GMT+0700')[0] +'GMT+0700'
                     var name  = listTr[i].children[6].innerText+'-'+listTr[i].children[3].innerText.split(' ').join('-').slice(0, 30).trim();
                      var object = { name:name,time:date};
                       list.push(object);
                  }}
                 return {list:list,pageCount:pageCount};
                 };getdata();