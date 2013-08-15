var game=window.game||(function(){
	var _layerList=[];
	var Layer=(function(){
		function layer(){
			this.spriteList=[];
			this.coordX=0;
			this.coordY=0;
		};
		layer.prototype.setCoord=function(x,y){
			this.coordX=x||this.coordX;
			this.coordY=y||this.coordY;
		};
		layer.prototype.removeSprite=function(obj){
			var that=this;
			game.funLib.selectArrayByObj(this.spriteList,obj,function(i){
				that.spriteList.splice(i,1);	
			});

		};
		layer.prototype.append=function(obj){
			obj.layer=this;
			this.spriteList.push(obj);
		};
		layer.prototype.toTop=function(){
			var i=game.funLib.selectArrayByObj(_layerList,this);	
			var temp=_layerList[i];
			_layerList.splice(i,1);
			_layerList.push(temp);
		};
		layer.prototype.toBottom=function(){
			var i=game.funLib.selectArrayByObj(_layerList,this);	
			var temp=_layerList[i];
			_layerList.splice(i,1);
			_layerList.unshift(temp);
		};
		return {
				getLayerList:function(){
					return _layerList;
				},
				createLayer:function(){
					var ly=new layer(name);
						_layerList.push(ly);
					return ly;
				}
			}
	})();

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
			this.ctx=tempCanvas.getContext("2d");
		};
		function _goCoord(x,y,fun){
			var Vx=(this.offsetX-x)*(this.prevX-x)<0;
			var Vy=(this.offsetY-y)*(this.prevY-y)<0;
			if(Vx||Vy){
				fun?fun():"";
				return true;
			};
			return false;
		}
		function _checkHit(Sprite,fun){
			var x=Sprite.offsetX;
			var y=Sprite.offsetY;
			var tempHeight=(Sprite.height+this.height)/2;
			var tempWidth=(Sprite.width+this.width)/2;
			var subWidth=Math.abs(x-this.offsetX)-tempWidth;
			var subHeight=Math.abs(y-this.offsetY)-tempHeight;
			if(subWidth<0&&subHeight<0||_goCoord.call(this,x,y)){
				var d=fun(Sprite);
				return d;
			};
		};
		function _getOffsetCoord(){
			var layer=this.layer;
				var layerCoordX=0,
					layerCoordY=0;
				if(layer){
					layerCoordX=layer.coordX;
					layerCoordY=layer.coordY;
				}
					this.offsetX=this.centerX+layerCoordX;
					this.offsetY=this.centerY+layerCoordY;
					this.drawX=this.offsetX-this.width/2;
					this.drawY=this.offsetY-this.height/2;
		}
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
			this.FrameFun={};
			this.clickFun=[];
			this.layer=null;
			this.prevX=0;
			this.prevY=0;
			this.speed=0;
			this.angle=0;
			_createTempCanvas.call(this);
		};	
		_sprite.prototype.test=function(){
				alert("test");
		};
		_sprite.prototype.speak=function(str){
			console.log(this.name+":"+str);
		};
		_sprite.prototype.distroy=function(x,y,fun){
			var layer=this.layer;
			layer.removeSprite(this);
		};
		_sprite.prototype.goCoord=function(x,y,fun){
			return _goCoord.call(this,x,y,fun);
		};
		_sprite.prototype.followTo=function(sprite,fun){
			var that=this;
			game.Animation.setFrame(that.name+"followTo",function(data){
				var x=sprite.offsetX,y=sprite.offsetY;
			that.angle=game.funLib.getAngle(that.offsetX,that.offsetY,x,y);
				var d=that.nextLocal(data.useTime);
				that.setCenter(d.x,d.y);
				that.checkHit([sprite],function(){
					that.setCenter(x,y);
					game.Animation.removeFrame(that.name+"followTo");
					fun.call(that);
				});
			});

		};
		_sprite.prototype.moveTo=function(x,y,fun){
			var that=this;
			that.angle=game.funLib.getAngle(that.offsetX,that.offsetY,x,y);
			game.Animation.setFrame(that.name+"moveTo",function(data){
				var d=that.nextLocal(data.useTime);
				that.setCenter(d.x,d.y);
				that.goCoord(x,y,function(){
					that.setCenter(x,y);
					game.Animation.removeFrame(that.name+"moveTo");
					fun.call(that);
				});
			});
		};
		_sprite.prototype.checkHit=function(spriteList,fun){
			var l=spriteList.length;
			for(var i=0;i<l;i++){
				var bool=_checkHit.call(this,spriteList[i],fun);
				if(bool===false){
					break;
				};
			}
		};
		//set center coord
		_sprite.prototype.setCenter=function(x,y){
				this.centerX=x||this.centerX;
				this.centerY=y||this.centerY;
				_getOffsetCoord.call(this);
		};
		_sprite.prototype.nextLocal=function(usedTime){
		//	var s=d	
			var al=Math.PI*2*(this.angle/360);
			var x=Math.sin(al)*this.speed*usedTime/1000;
			var y=-Math.cos(al)*this.speed*usedTime/1000;
			return {"x":this.centerX+x,"y":this.centerY+y}
		};
		_sprite.prototype.isInLocal=function(x,y){
			var myX=this.offsetX,myY=this.offsetY;
			var w=this.width/2,h=this.height/2;
			if((Math.abs(myX-x)<w)&&(Math.abs(myY-y)<h)){
				return true;
			};
			return false;
		};
		_sprite.prototype.click=function(fun){
				this.clickFun.push(fun);
		};
		//draw this self temp canvas to Animation's canvas
		_sprite.prototype.drawMyCanvas=function(animateData){
			var ctx=animateData.ctx;
				this.layer?_getOffsetCoord.call(this):"";
			var oX=this.offsetX,oY=this.offsetY,drawX=this.drawX,drawY=this.drawY;
				ctx.save();
				ctx.translate(oX,oY);
				ctx.rotate(Math.PI*2/360*this.angle);
				ctx.translate(-oX,-oY);
				ctx.drawImage(this.spriteCanvas,drawX,drawY,this.width,this.height);
				ctx.strokeRect(drawX,drawY,this.width,this.height);
				ctx.restore();
		}
		//do this Frame function when Animation's Frame;
		_sprite.prototype.oneFrameFun=function(animateData){
				this.prevX=this.offsetX;
				this.prevY=this.offsetY;
				this.drawMyCanvas(animateData);
		};
		// set this all Image Data,e.g. coord, size ,img object;
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
		return _sprite;
	})();


	/*
	 *Animation entity;
	 * */
	var Animation=(function(){
		var _canvas=document.createElement("canvas");
			_canvas.width=500;
			_canvas.height=500;
			_ctx=_canvas.getContext("2d");
		var _RAF=window.mozRequestAnimationFrame||window.requestAnimationFrame||window.webkitRequestAnimationFrame;
		var _layerList=null;
		var _overLayerFunList={};
		var _frameFunList={};
		var _endAnimateList={};
		var _startAnimateList={};
		var _AnimateData={};
			_AnimateData.ctx=_ctx;

		//
		function _startAnimate(time){
			for(var i in _startAnimateList){
				_startAnimateList[i](time);
			}
		};
		//
		function _endAnimate(){
			for(var i in _endAnimateList){
				_endAnimateList[i]();
			}
		};
		//
		function _clearScreen(){
			_ctx.clearRect(0,0,_canvas.width,_canvas.height);
		};
		function _paintOverSprite(_AnimateData) {
			for(var i in _overLayerFunList){
				_overLayerFunList[i](_AnimateData);
			}
		};
		function _parseLayerList(fun){
			var l=_layerList.length;
			for(var i=0;i<l;i++){
				var bool=fun(_layerList[i]);
				if(bool==false){
					return bool;
				}
			}
		};
		function _updateSprite(_AnimateData){
			_parseLayerList(function(_layer){
				var _childList=_layer.spriteList;
				var length=_childList.length;
				for(var i=0;i<length;i++){
					_childList[i].oneFrameFun(_AnimateData);
				};
			});
		};

		function _FrameFun(animateData){
				var now=animateData.now;
				var d=animateData.pauseUsedTime;
				for(var i in _frameFunList){
					var fun=_frameFunList[i];
					fun.startTime=fun.startTime||now;
					var useTime=now-fun.startTime;
					if(fun.fpsTime<(useTime+fun.surplusTime)){
						animateData.useTime=useTime-d;
						fun.call(this,animateData);
						fun.startTime=now;
						fun.surplusTime=useTime-fun.fpsTime+fun.surplusTime-d;
					}
				}
		};
		function _oneFrame(time){
			//_tick();
			_AnimateData.oldTime=_AnimateData.now;
			_AnimateData.now=time;
			_AnimateData.pauseUsedTime=game.getPauseUsedTime();
		//	console.log(_AnimateData.now-_AnimateData.oldTime);
			_RAF(_oneFrame);
			if(game.Progress.pause){return false;}
			_clearScreen(_AnimateData);
			_FrameFun(_AnimateData);
			_startAnimate(_AnimateData);
			_updateSprite(_AnimateData);	
			_paintOverSprite(_AnimateData);
			_endAnimate(_AnimateData);
		};
		return {
			//start animation
			start:function(){
				game.Progress.pause=0;
				_layerList=game.LayerFactory.getLayerList();
				console.log("start");
				_RAF(_oneFrame);
				//game.togglePaused();
				this.start=function(){console.error("game ware running")};
			},	
			parseLayerList:_parseLayerList,
			//return _canvas;
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
			setOverFunction:function(name,fun){
				_overLayerFunList[name]=fun;
			},
			removeFrame:function(name){
				delete _frameFunList[name];
			},
			setFrame:function(name,fun,time){
				fun.startTime=0;//(new Date()).getTime();
				fun.fpsTime=time||0;
				fun.surplusTime=0;
				_frameFunList[name]=fun;
			}

		}	
	})();

	/*
	 *
	 * */
	var _funLib=(function(){
		//extend
		function _extend(sup,sub){
			function temp(){};	
			temp.prototype=sup.prototype;
			temp.constructor=sub;
			sub.prototype=new temp();
		};

		//get a random num;
		var _randomJson={};
		function _getRandom(b,bool){
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
		};
		//get angle of A to B
		function _getAngle(x1,y1,x2,y2){
			var k=(y1-y2)/(x1-x2);
			var al=Math.atan(k);
			var v=x1>x2?1:-1;
			var angle=al*(360/2/Math.PI)+270*v;
				if(angle==-360){
					angle=-180
				}else if(angle==-180){
					angle=-360;
				}
			return angle;
		};
		function _getSpaceBetweenDoubleCoord(x1,y1,x2,y2){
			var powX=Math.pow(x2-x1,2);
			var powY=Math.pow(y2-y1,2);
			var space=Math.sqrt(powX+powY);
			return space;
		}
		function _findObj(parentObj,subObj,fun){
			var l=parentObj.length;
			for(var i=0;i<l;i++){
				if(parentObj[i]==subObj){
					fun?fun(i):"";
					return i;
				};
			}
			return -1;
		};

		return {
			extend:_extend
			,getRandom:_getRandom
			,getAngle:_getAngle
			,selectArrayByObj:_findObj
			,getSpaceBetweenDoubleCoord:_getSpaceBetweenDoubleCoord
		};
	})();
	

	var _eventManage=(function(){
		function _getChildSprite(tempList,fun){
			var length=tempList.length;
			var bool=true;
			for(var i=length-1;i>-1;i--){
				var tempSprite=tempList[i];
				if(fun){
					var bool=fun(tempSprite);
						if(false===bool){
							break;
						}
				}
			}
		};
		function _click(evt){
			Animation.parseLayerList(function(layer){
				var bool=true;		
				_getChildSprite(layer.spriteList,function(sprite){
					if(sprite.isInLocal(evt.offsetX,evt.offsetY)){
						var cf=sprite.clickFun;
						for(var i=0,l=cf.length;i<l;i++){
								if(false===cf[i](evt.offsetX,evt.offsetY)){
									bool=false;	
								};
						};
						return bool;
					};
				});
				//
				if(bool){
					for(var i =_clickFun.length-1,l=-1;i>l;i--){
						_clickFun[i]({"x":evt.offsetX,"y":evt.offsetY});
					};
				}
				return bool;
			});
		};
		function _bindClick(){
			var _canvas=Animation.getCanvas();
				_canvas.addEventListener("click",function(evt){
					_click(evt);	
				},false);
		}
		return {
			init:function(){
				 _bindClick();
			}
		}
	})();

	/*
	 * main of game engine 
	 */
	var _game=(function(){
		//load modle
		var fileJson={};
		var _canvas=Animation.getCanvas();
		//bindEvent on canvas
			_clickFun=[];

		//child object
		var spriteList=[];
		//bind this spriteList to Animation's childList;

		var _pauseUsedTime=0;
		var _pauseTime=(new Date()).getTime();
		

		var _spriteObj={
			//return Sprite Entity function;
			getSpriteEntity:function(){
				return Sprite;
			}
		};
		var _progress={
			pause:1,
			//start Animation;
			start:function(){
				Animation.start();		
				_eventManage.init();
				this.start=function(){};
			},
			//toggle pause ; turn on or turn off;
			togglePaused:function(){
				if(this.pause){
					this.pause=0;
					var now=(new Date()).getTime();
						_pauseUsedTime=(now-_pauseTime);
				}else{
					_pauseTime=(new Date()).getTime();
					this.pause=1;
				}
			}
		};

		var _fileObj={
			//add some files in loader
			addFile:function(Ary){
				for(var i=0,l=Ary.length;i<l;i++){
					var tempObj=Ary[i];
					var tempName={};
						tempName[tempObj.name]=tempObj;
					fileJson[tempObj.type]=tempName;
				};
				return this;
			},
			//create img by load date save in cache
			_createImage:function(tempJson){
				var img=document.createElement("img");
					img.src=tempJson.url;
					img.onload=function(){
						tempJson.obj=img;
					};
			},
			//create sound by load date save in cache
			_createSound:function(tempJson){
				var img=document.createElement("img");
					img.src=tempJson.url;
					img.onload=function(){
						tempJson.obj=img;
					};
			},
			//go to load
			load:function(){
				var imgJson=fileJson.img,
					soundJson=fileJson.sound;
					for(var i in imgJson){
						this._createImage(imgJson[i]);	
					}
					for(var i in soundJson){
						this._createSound(soundJson[i]);
					}
			},
			//return img object of game cache;
			getImage:function(name){
				return fileJson["img"][name].obj;
			},
			//return sound object of game cache;
			getSound:function(){
			}
		}
		return {
			SpriteFactory:_spriteObj,
			LayerFactory:Layer,
			File:_fileObj,
			Progress:_progress,
			Animation:Animation,
			funLib:_funLib,
			// get times of pause uesd;
			getPauseUsedTime:function(){
				var temp=_pauseUsedTime;
				_pauseUsedTime=0;
				return temp;
			},
			config:function(json){
				_canvas.width=json.canvasWidth;	
				_canvas.height=json.canvasHeight;	
				this.config=function(){console.error("config");}
			},
			click:function(fun){
				_clickFun.push(fun);
			},
			//append this canvas to a tage;str is tage id ;
			appendTo:function(box){
					box.appendChild(_canvas);
			}
		}
	})();
	return _game;
})();


function inita(){
	var z=0;
	window.onblur=function(){
		//game.togglePaused();
	}
	window.onfocus=function(){
	//	game.togglePaused();
		z++;

	}
	document.addEventListener("keyup",function(evt){
		if(evt.keyCode==13){
			game.Progress.togglePaused();
		};
	},false);
}
