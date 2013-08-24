redant
======

a game engine of javascript

API

Layer


Sprite
	setFrame:
		参数:
		1 [name] 函数名称
		2 [fun] 要执行的函数体
		3 [time] ＊可选 默认为浏览器的刷新时间；
		简介:
			给本对象设置间隔执行函数，名称重复将会重写上一个同名函数；

	distory：
		参数：none

		简介：移除所在层对本对象的引用。如其他处无引用，浏览器将会对此内存进行回收。

	isPassCoord:
		参数: 
		1 [coordX] 判定坐标点 x值
		2 [coordY] 判定坐标点 y值
		3 [callback] ＊可选  回调函数，当穿过目标坐标时的回调 

		简介:判断本对象是否经过了一个坐标点；

	followTo:
		
	setImageData:
		参数：
		1 [name] 状态名称 如 走，跳，蹲下
		2 [jsonData] 图像对象，坐标等
			｛
				"img":game.files.getImage("ImageName"),
				"data":[
					{x:0,y:0,width:10,height:20},
					{x:0,y:0,width:10,height:20}
				]
			｝	
