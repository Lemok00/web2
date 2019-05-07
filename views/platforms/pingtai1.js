
$(document).ready(function(){
    $.getJSON("/platforms","platform_JSON_package",function(data){    //有请小马哥在这一行的xxx写上后端的url链接
        for(const i in data){
            const obj = data[i];                    //这里说明一下，json包不需要说明一共有多少个了，因为可以自动遍历


            var div1=document.createElement("div");
            var div2=document.createElement("div");
            var div3=document.createElement("div");
            var a1=document.createElement("a");
            var img1=document.createElement("img");
            div1.appendChild(div2);
            div2.appendChild(a1);
            div2.appendChild(div3);
            a1.appendChild(img1);
            div3.innerHTML="...";
            div1.className="responsive";
            div2.className="img";
            div3.className="desc";
            a1.target="_blank";
            img1.src="loading.png";
            img1.style.width="300";
            img1.style.height="200";
            var right=document.getElementById("right");

            img1.src=obj[2];        //根据你发给我的*那个图片*的编号这是图片
            img1.url=obj[3];        //这是跳转链接
            div3.innerHTML=obj[1];  //这是平台的名字

        }
    });
});
