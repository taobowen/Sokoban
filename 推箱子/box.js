var canvas=document.getElementById("canvas");
if(canvas.getContext)
	var content=canvas.getContext("2d");
else
	document.write(`你的浏览器不支持canvas！`)
var wall=document.getElementById("wall");
var road=document.getElementById("road");
var box=document.getElementById("box");
var end=document.getElementById("end");
var humanup=document.getElementById("humanup");
var humandown=document.getElementById("humandown");
var humanright=document.getElementById("humanright");
var humanleft=document.getElementById("humanleft");
var blank=document.getElementById("blank");
var message=document.getElementById("message");
var initial_map=[];//初始地图
var current_map=[];//当前地图
var numberOflevel=leveldata.length;//关卡数
var checkpoint=1;//当前关卡数
var imageheight=50;//图像高宽
var imageweight=50;
var humandirection=humandown;//人的朝向
var step=0;//移动步数
var copyArray=function (arr) {//复制二维数组
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
        newArr[i] = arr[i];
    }
    return newArr;
}
var drawroad=function(){//画背景
	for(var i=0;i<16;i++){
		for(var j=0;j<16;j++){
			content.drawImage(road,j*imageweight,i*imageheight,imageweight,imageheight);
		}
	}
}
function Point(x, y) {
    this.x = x;
    this.y = y;
}

var per_position = new Point(5, 5);
// 画关卡地图
var drawmap=function(initial_map){
	message.innerHTML=`当前第${checkpoint}关，当前关卡走了${step}步.`;
	var drawcontent=road;
	for(var i=0;i<16;i++){
		for(var j=0;j<16;j++){
			switch(initial_map[i*16+j]){
				case 0:                         //路：0
					drawcontent=road;
					break;
				case 1:                         //墙：1
					drawcontent=wall;
					break;
				case 2:                         //人：2
					drawcontent=humandirection;
					per_position.x=j;
					per_position.y=i;
					break;
				case 3:                         //箱子：3
					drawcontent=box;
					break;
				case 4:                         //终点：4
					drawcontent=end;
					break;
				default:
					drawcontent=blank;
					break;		
			}
			content.drawImage(drawcontent, j*imageweight,i*imageheight,imageweight,imageheight);//画图
		}
	}
}
var initialization=function(){//初始化关卡
	initial_map=copyArray(leveldata[checkpoint-1]);//保存初始地图
	current_map=copyArray(leveldata[checkpoint-1]);//当前地图
	humandirection=humandown;//初始化人的朝向向下
	step=0;//初始化人物走的步数
	drawroad();
	drawmap(initial_map);
}
var level=function(changepoint) {//加载关卡
	 checkpoint+=changepoint;
	 if(checkpoint<1){
	 	alert(`这是第一关！`);
	 	checkpoint-=changepoint;
	 	return;
	 }else if(checkpoint>numberOflevel){
	 	alert(`这是最后一关！`);
	 	checkpoint-=changepoint;
	 	return;
	 }else{
	 	initialization();
	 }
	// body...
}
var win=function(){                //判断是否通关
	for(var i=0;i<256;i++){
		if(initial_map[i]==4&&current_map[i]!=3)
			return	false;
	}
	return true;
}

document.onkeydown = function curManUp(event) {   //绑定键盘
    var keyCode = event.keyCode;
    var p1 = {
        x: 0,
        y: 0
    }
    var p2 = {
        x: 0,
        y: 0
    }
    switch (keyCode) {
        case 38:              //上
            humandirection = humanup;
            p1.x = per_position.x;
            p1.y = per_position.y - 1;
            p2.x = per_position.x;
            p2.y = per_position.y - 2;
            break;
        case 39:              //右
            humandirection = humanright;
            p1.x = per_position.x + 1;
            p1.y = per_position.y;
            p2.x = per_position.x + 2;
            p2.y = per_position.y;
            break;
        case 40:              //下
            humandirection = humandown;
            p1.x = per_position.x;
            p1.y = per_position.y + 1;
            p2.x = per_position.x;
            p2.y = per_position.y + 2;
            break;
        case 37:              //左
            humandirection = humanleft;
            p1.x = per_position.x - 1;
            p1.y = per_position.y;
            p2.x = per_position.x - 2;
            p2.y = per_position.y;
            break;
    }
    var originalposition=per_position.x+per_position.y*16;
    var position1=p1.x+p1.y*16;
    var position2=p2.x+p2.y*16;
    if(current_map[position1]==1||(current_map[position1]==3&&current_map[position2]==1)||(current_map[position1]==3&&current_map[position2]==3)){
    	return false;
    }else if(current_map[position1]==0||current_map[position1]==4){//如果人走的那个方向是路或者终点
    	current_map[position1]=2;
    }else if(current_map[position1]==3){//如果人走的那个方向上是箱子
    	current_map[position1]=2;
    	current_map[position2]=3;
    }
    if(initial_map[originalposition]==4)
		current_map[originalposition]=4;
	else
		current_map[originalposition]=0;
    step++;
    drawroad();
	drawmap(current_map);
	if (win()) {
		alert(`恭喜通关！`)
        level(1);
    }
}
initialization();