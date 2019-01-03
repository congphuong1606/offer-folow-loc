function getdata(){
                 var list=[];var listTr =document.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
                 var pageCount = document.getElementsByClassName('pagination')[0].getElementsByTagName('li').length-2;
                 if(pageCount<=0){pageCount =1;}
                 for(var i=listTr.length-1; i>=0;i--){var name  = listTr[i].children[3].innerText;list.push(name.trim());}
                 return {list:list,pageCount:pageCount};
                 };getdata();