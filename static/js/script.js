var timer = null,
    index = 0,
    pics = byId("banner").querySelectorAll('.banner-slide'),
    size = pics.length,
    prev = byId("prev"),
    next = byId("next");

function addHandler(element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler, true);
    }
    else if (element.attachEvent) {
        element.attachEvent('on' + type, handler);
    }
    else {
        element['on' + type] = handler;
    }
}

function byId(id){
	return typeof(id)==="string"?document.getElementById(id):id;
}

// 清除定时器,停止自动播放
function stopAutoPlay(){
	if(timer){
       clearInterval(timer);
	}
}

// 图片自动轮播
function startAutoPlay(){
   timer = setInterval(function(){
       index++;
       if(index >= size){
          index = 0;
       }
       changeImg();
   },3000)
}

function changeImg(){
   for(var i=0,len=pics.length;i<len;i++){
       pics[i].style.display = "none";
   }
   pics[index].style.display = "block";
}

function slideImg(){
    startAutoPlay();
    var main = byId("main");
    var banner = byId("banner");

    addHandler(main,"mouseover",stopAutoPlay);
    addHandler(main,"mouseout",startAutoPlay);

    // 下一张
    addHandler(next,"click",function(){
       index++;
       if(index>=size) index=0;
       changeImg();
    })

    // 上一张
    addHandler(prev,"click",function(){
       index--;
       if(index<0) index=size-1;
       changeImg();
    })
}

addHandler(window,"load",slideImg);

