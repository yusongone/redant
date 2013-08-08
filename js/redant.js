var game=window.game||(function(){
	// game engine return sprite
	var Sprite=(function(){
		/*
		 *private function of sprite Module
		 * */

		//create canvas and context;
		function _createTempCanvas(){
			var tempCanvas=document.createElement("canvas");
				tempCanvas.width=this.width;
				tempCanvas.height=this.height;
			this.spriteCanvas=tempCanvas;
			this.spriteCtx=tempCanvas.getContext("2d");
		};

		/*
		 *sprite entity;
		 * */
		var _sprite=function(width,height){
			this.name=_game.funLib.getRandom();
			this.width=width||20;
			this.height=height||20;
			this.centerX=0;
			this.centerY=0;
			this.canvasList={};
			this.childSprite={};
			this.FrameFun={};
			this.angle=0;
			_createTempCanvas.call(this);
			game.addSprite(this);
			this.setFrame("drawNyCanvas",this.drawMyCanvas,10);
		};	
		_sprite.prototype.test=function(){
		
		}
		_sprite.prototype.setCenter=function(x,y){
				this.centerX=x||this.centerX;
				this.centerY=y||this.centerY;
				this.offsetX=this.centerX-this.width/2;
				this.offsetY=this.centerY-this.height/2;
		}
		_sprite.prototype.drawMyCanvas=function(animateData){
			var ctx=animateData.ctx;
			var cX=this.centerX,cY=this.centerY,offX=this.offsetX,offY=this.offsetY;
				ctx.save();
				ctx.translate(cY,cX);
				ctx.rotate(Math.PI*2/360*this.angle);
				ctx.translate(-cX,-cY);
				ctx.drawImage(this.spriteCanvas,offX,offY,this.width,this.height);
				ctx.strokeRect(offX,offY,this.width,this.height);
				ctx.restore();
		}
		_sprite.prototype.oneFrameFun=function(animateData){
				var now=animateData.now;
				for(var i in this.FrameFun){
					var fun=this.FrameFun[i];

					var useTime=(now-fun.startTime)||0;
					if(game.pause){fun.startTime=now;continue;}
					if(fun.fpsTime<(useTime+fun.surplusTime)){
						animateData.useTime=useTime;
						fun.call(this,animateData);
						fun.startTime=now;
						fun.surplusTime=useTime-fun.fpsTime+fun.surplusTime;
					}
				}
				for(var j in this.childSprite){
					var temp_sprite=this.childSprite[j];
						temp_Sprite.oneFrameFun();
				}
		};
		_sprite.prototype.setImageData=function(name,json){
				var tempAry=[];
				var tempJson=json;
				for(var j=0,l=tempJson.data.length;j<l;j++){
						var CanvasData=tempJson.data[j];
					var canvas=document.createElement("canvas");
						canvas.width=CanvasData.width;
						canvas.height=CanvasData.height;
					var ctx=canvas.getContext("2d");
						ctx.drawImage(json.img,CanvasData.x,CanvasData.y,CanvasData.width,CanvasData.height,0,0,this.width,this.height);
						tempAry.push(canvas);
				}
				this.canvasList[name]=tempAry;
		};
		_sprite.prototype.setFrame=function(name,fun,time){
				fun.startTime=0;
				fun.fpsTime=time||0;
				fun.surplusTime=0;
				this.FrameFun[name]=fun;
		};
		_sprite.prototype.removeFrame=function(name){
				delete this.FrameFun[name];
		};
		return _sprite;
	})();


	/*
	 *Animation entity;
	 * */
	var Animation=(function(){
		var _canvas=document.createElement("canvas");
			_canvas.width=100;
			_canvas.width=200;
			_ctx=_canvas.getContext("2d");
		var _RAF=window.mozRequestAnimationFrame||window.requestAnimationFrame||window.webkitRequestAnimationFrame;
		var _childList;
		//
		var _startAnimateList={};
		function _startAnimate(time){
			for(var i in _startAnimateList){
				_startAnimateList[i](time);
			}
		};
		//
		var _endAnimateList={};
		function _endAnimate(){
			for(var i in _endAnimateList){
				_endAnimateList[i]();
			}
		};
		//
		function _clearScreen(){
			_ctx.clearRect(0,0,_canvas.width,_canvas.height);
		};
		function _paintUnderSprite(){
			
		};
		function _paintOverSprite() {

		};
		function _updateSprite(_AnimateData){
			for(var i in _childList){
				_childList[i].oneFrameFun(_AnimateData);
			}
		};
		var _AnimateData={};
			_AnimateData.ctx=_ctx;
		function _oneFrame(time){
			//_tick();
			_AnimateData.oldTime=_AnimateData.now;
			_AnimateData.now=time;
			_RAF(_oneFrame);
			if(game.pause){return false;}
			_clearScreen(_AnimateData);
			_startAnimate(_AnimateData);
			_paintUnderSprite(_AnimateData);	
			_updateSprite(_AnimateData);	
			_paintOverSprite(_AnimateData);
			_endAnimate(_AnimateData);
		};
		return {
			start:function(){
				_oneFrame();
			},	
			getCanvas:function(){
				return _canvas;
			},
			pushStartAnimate:function(key,fun){
				_startAnimateList[key]=fun;
			},
			removeStartAnimate:function(key){
				delete _startAnimateList[key];
			},
			pushEndAnimate:function(){
				_endAnimateList[key]=fun;
			},
			removeEndAnimate:function(){
				delete _endAnimateList[key];
			},
			setChildList:function(obj){
				_childList=obj;
			}

		}	
	})();

	/*
	 *
	 * */
	var _funLib=(function(){
		function _extend(sup,sub){
			function temp(){};	
			temp.prototype=sup.prototype;
			temp.constructor=sub;
			sub.prototype=new temp();
		};
		var _randomJson={};
		return {
			extend:_extend
			,getRandom:function(b,bool){
				var bb=b||10;
					var bs=Math.pow(10,bb);
				var sj=parseInt(bs*Math.random(1));
				if(_randomJson[sj]&&bool){
					var ssj=_getRandom(b);	
					_randomJson[ssj]=ssj;
					return ssj;
				}else if(_randomJson[sj]==0){
					console.error("can't get random!");
				}else{
					_randomJson[sj]=sj;
					return sj;
				}
			}
		};
	})();

	/*
	 * main of game engine 
	 */
	var _game=(function(){
		//load modle
		var fileJson={};

		function _createImage(tempJson){
			var img=document.createElement("img");
				img.src=tempJson.url;
				img.onload=function(){
					tempJson.obj=img;
				};
		};
		var _fun_createSound=function(tempJson){
			var img=document.createElement("img");
				img.src=tempJson.url;
				img.onload=function(){
					tempJson.obj=img;
				};
		};
		//child object
		var spriteList={};
		Animation.setChildList(spriteList);


		//load modle
		var _fun_createSound=function(){
		};
		return {
			pause:1,
			funLib:_funLib,
			start:function(){
				this.pause=0;
				Animation.start();		
			},
			togglePaused:function(){
						 
						 },
			getSprite:function(sprite){
				return spriteList[name];
			},	
			removeSprite:function(name){
				delete spriteList[name];
			},
			addSprite:function(sprite){
				spriteList[sprite.name]=sprite;
			},
			getSpriteEntity:function(){
				return Sprite;
			},
			addFile:function(Ary){
				for(var i=0,l=Ary.length;i<l;i++){
					var tempObj=Ary[i];
					var tempName={};
						tempName[tempObj.name]=tempObj;
					fileJson[tempObj.type]=tempName;
				};
				return this;
			},
			load:function(){
				var imgJson=fileJson.img,
					soundJson=fileJson.sound;
					for(var i in imgJson){
						_createImage(imgJson[i]);	
					}
					for(var i in soundJson){
						_fun_createSound(soundJson[i]);
					}
				 },
			getImage:function(name){
				return fileJson["img"][name].obj;
			},
			getSound:function(){
			},
			appendTo:function(str){
				var box=document.getElementById(str);
					box.appendChild(Animation.getCanvas());
					   
					   }
		}
	})();
	return _game;
})();

game.addFile([
	{
		"type":"img"
		,"name":"monkey"
		,"url":"/image/people.jpg"
	},
	{
		"type":"sound"
		,"url":"/sound/sound.mp3"
	}
]).load();

/*
var sp=new Sprite();
	sp.addInit("jump",{
		"data":[
				{"x":100,"y":200,"width":100,"height":100}
				,{"x":100,"y":200,"width":100,"height":100}
				,{"x":100,"y":200,"width":100,"height":100}
			]
		,"img":game.getImage("songsong")
	});
	sp.addInit("run",{
		"data":[
				{"x":100,"y":200,"width":100,"height":100}
				,{"x":100,"y":200,"width":100,"height":100}
				,{"x":100,"y":200,"width":100,"height":100}
			]
		,"img":game.getImage("songsong")
	});
	*/
function init(){
	game.appendTo("box");
	var sprite=game.getSpriteEntity();
	console.log(game.getImage("monkey"));
	var s=new sprite(45,80);	
	var w=47;
		s.setImageData("jump",{
			"data":[
			{x:30,y:10,width:45,height:80}
			,{x:30+w*1,y:10,width:45,height:80}
			,{x:30+w*2,y:10,width:45,height:80}
			,{x:30+w*3,y:10,width:45,height:80}
			,{x:30+w*4,y:10,width:45,height:80}
			,{x:30+w*5,y:10,width:45,height:80}
					],
			"img":game.getImage("monkey")
		});
		var i=0;
		s.setCenter(100,100);
		s.setFrame("run",function(data){
			var angle_s=6;
			var time=data.useTime||0;	
				s.angle+=angle_s*(time/1000);
		});
		var tt=0;
		s.setFrame("test",function(data){
			var time=data.useTime||1;
				i<4?i++:i=0;
				this.spriteCtx.clearRect(0,0,this.width,this.height);
				this.spriteCtx.drawImage(this.canvasList["jump"][i],0,0);
		},100);
	$("body").click(function(){
	game.start();
	
	});	
	window.onblur=function(){
		game.pause=1;
	}
	window.onfocus=function(){
		game.pause=false;
	}
}
