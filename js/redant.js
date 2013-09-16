var game=window.game||(function(){
	var LayerFactory=(function(){
		var _activeLayer=null;
		var _layerList=[];

		function layer(){
			this.spriteList=[];
			this.coordX=0;
			this.coordY=0;
			this.hide=0;
			this.Blur=null;
		};
		layer.prototype.setCoord=function(x,y){
			this.coordX=x||this.coordX;
			this.coordY=y||this.coordY;
		};
		layer.prototype.clearLayer=function(){
			this.spriteList.length=0;
		};
		layer.prototype.removeSprite=function(obj){
			var that=this;
			game.funLib.selectArrayByObj(this.spriteList,obj,function(i){
				that.spriteList.splice(i,1);	
			});
		};
		layer.prototype.append=function(obj){
			obj.layer=this;
			this.removeSprite(obj);
			this.spriteList.push(obj);
		};
		layer.prototype.toTop=function(){
			var i=game.funLib.selectArrayByObj(_layerList,this);	
			var temp=_layerList[i];
			_layerList.splice(i,1);
			_layerList.push(temp);
		};
		layer.prototype.select=function(){
			_activeLayer=this;
		};
		layer.prototype.bindBlur=function(fun){
			this.Blur=fun;
		};
		layer.prototype.blur=function(){
			_activeLayer=null;
			if(this.Blur){
				return this.Blur();
			}
		};
		layer.prototype.toBottom=function(){
			var i=game.funLib.selectArrayByObj(_layerList,this);	
			var temp=_layerList[i];
			_layerList.splice(i,1);
			_layerList.unshift(temp);
		};
		return {
				removeLayer:function(obj){
					var i=game.funLib.selectArrayByObj(_layerList,obj);	
					var temp=_layerList[i];
					_layerList.splice(i,1);
					_activeLayer===temp?_activeLayer=null:"";
					temp=null;
				},
				setActiveLayer:function(tempLayer){
					_activeLayer=tempLayer;					   
				},
				getActiveLayer:function(tempLayer){
					return _activeLayer;
				},
				getLayerList:function(){
					return _layerList;
				},
				checkBlur:function(tempLayer){
					return _activeLayer===tempLayer
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
		var i=0;
		function _isPassCoord(x,y,fun){
			var ox=this.offsetX,oy=this.offsetY,px=this.prevX,py=this.prevY;
			var Vx=(ox-x)*(px-x)<0;
			var Vy=(oy-y)*(py-y)<0;
			var inC=(oy-py)==oy-y&&(ox-px)==ox-x;
			if(Vx||Vy||inC){
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
			if(subWidth<0&&subHeight<0||_isPassCoord.call(this,x,y)){
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
		//
		//draw this self temp canvas to Animation's canvas
		function _drawMyCanvas(animateData){
			var ctx=animateData.ctx;
				this.layer?_getOffsetCoord.call(this):"";
			var oX=this.offsetX,oY=this.offsetY,drawX=this.drawX,drawY=this.drawY;
				ctx.save();
				ctx.translate(oX,oY);
				ctx.rotate(Math.PI*2/360*this.angle);
				ctx.translate(-oX,-oY);
				ctx.drawImage(this.spriteCanvas,drawX,drawY,this.width,this.height);
				ctx.strokeStyle="#999";
				//ctx.strokeRect(drawX,drawY,this.width,this.height);
				ctx.restore();
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
			this.vectorDir=0;
			this.frameFunList={};
			_createTempCanvas.call(this);
			
		};	
		_sprite.prototype.test=function(){
				alert("test");
		};
		_sprite.prototype.speak=function(str){
			console.log(this.name+":"+str);
		};
		_sprite.prototype.removeFrame=function(name){
				delete this.FrameFun[name];
		};
		_sprite.prototype.setFrame=function(name,fun,time){
				fun.startTime=0;//(new Date()).getTime();
				fun.fpsTime=time||0;
				fun.surplusTime=0;
				this.FrameFun[name]=fun;
		};
		_sprite.prototype.distroy=function(){
			var layer=this.layer;
			layer.removeSprite(this);
		};
		_sprite.prototype.isPassCoord=function(x,y,fun){
			return _isPassCoord.call(this,x,y,fun);
		};
		_sprite.prototype.followTo=function(sprite,fun,bool){
			var that=this;
			game.Animation.setFrame(that.name+"followTo",function(data){
				var x=sprite.offsetX,y=sprite.offsetY;
			that.vectorDir=game.funLib.getAngle(that.offsetX,that.offsetY,x,y);
			bool?that.angle=that.vectorDir:"";
				var d=that.nextLocal(data.useTime);
				that.setCenter(d.x,d.y);
				that.checkHit([sprite],function(){
					that.setCenter(x,y);
					game.Animation.removeFrame(that.name+"followTo");
					fun.call(that);
				});
			});
		};
		_sprite.prototype.stop=function(x,y,fun){
			game.Animation.removeFrame(this.name+"moveTo");
		};
		_sprite.prototype.stopTurn=function(speed,bool){
			delete this.removeFrame("turn");
		};
		_sprite.prototype.turn=function(speed,fun){
			var that=this;
			this.setFrame("turn",function(data){
				fun?fun():"";
				that.angle=that.angle+(speed*data.useTime/1000);
				that.angle%=360;
			});
		};
		_sprite.prototype.faceTo=function(obj){
			var that=this;
			that.angle=game.funLib.getAngle(that.offsetX,that.offsetY,obj.offsetX,obj.offsetY);
		};
		_sprite.prototype.moveTo=function(x,y,fun,bool){
			var that=this;
			that.vectorDir=game.funLib.getAngle(that.offsetX,that.offsetY,x,y);
			bool?that.angle=that.vectorDir:"";
			game.Animation.setFrame(that.name+"moveTo",function(data){
				var d=that.nextLocal(data.useTime);
				that.setCenter(d.x,d.y);
				that.isPassCoord(x,y,function(){
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
			var al=Math.PI*2*(this.vectorDir/360);
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
		_sprite.prototype.clearClickFunction=function(){
				this.clickFun.length=0;
				return this;
		};
		_sprite.prototype.removeClick=function(fun){
			var that=this;
			game.funLib.selectArrayByObj(this.clickFun,fun,function(i){
				that.clickFun.splice(i,1);	
			});
			return this;
		};
		_sprite.prototype.click=function(fun){
				this.clickFun.push(fun);
		};
		//do this Frame function when Animation's Frame;
		_sprite.prototype.oneFrameFun=function(animateData){
			var that=this;
				that.prevX=that.offsetX;
				that.prevY=that.offsetY;
				for(var i in that.frameFunList){
					that.frameFunList[i].call(this,animateData);
				}
				var now=animateData.now;
				var d=animateData.pauseUsedTime;
				for(var i in this.FrameFun){
					var fun=this.FrameFun[i];
					fun.startTime=fun.startTime||now;
					var useTime=now-fun.startTime;
					if(fun.fpsTime<(useTime+fun.surplusTime)){
						animateData.useTime=useTime-d;
						fun.call(this,animateData);
						fun.startTime=now;
						fun.surplusTime=useTime-fun.fpsTime+fun.surplusTime-d;
					}
				}
				_drawMyCanvas.call(this,animateData);
		};
		_sprite.prototype.addFrameFun=function(name,fun){
			this.frameFunList[name]=fun;
		};
		_sprite.prototype.removeFrameFun=function(name){
			delete this.frameFunList[name];
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
		var _RAF=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame;
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
		function _parseLayerList(fun,order){
			var l=_layerList.length;
			if(order===false){
					for(var i=l-1;i>-1;i--){
						var bool=fun(_layerList[i]);
						if(bool==false){
							return bool;
						}
					}
			}else{
					for(var i=0;i<l;i++){
						var bool=fun(_layerList[i]);
						if(bool==false){
							return bool;
						}
					}
			}
		};
		function _updateSprite(_AnimateData){
			_parseLayerList(function(_layer){
				var _childList=_layer.spriteList;
				var length=_childList.length;
				if(_layer.hide){return;}
				for(var i=0;i<length;i++){
					_childList[i]?_childList[i].oneFrameFun(_AnimateData):"";
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
							return false;
							break;
						}
				}
			}
		};
		function _click(offsetX,offsetY){
			var bool=true;		
			var gotActiveLayer=false;
			var count=0;
			var activeLayer=LayerFactory.getActiveLayer();
			Animation.parseLayerList(function(layer){
				if(layer.hide){return;}
				_getChildSprite(layer.spriteList,function(sprite){
					if(sprite.isInLocal(offsetX,offsetY)){
						if(count==0){
							count++;
							if(LayerFactory.checkBlur(sprite.layer)){
								gotActiveLayer=0;
							}else{
								if(activeLayer){
									bool=activeLayer.blur();
									if(bool==false){
										return bool;
									}
								}
							}
						};	
						var cf=sprite.clickFun;
						for(var i=0,l=cf.length;i<l;i++){
								if(false===cf[i].call(sprite,offsetX,offsetY)){
									bool=false;	
								};
						};
						return bool;
					};
				});
				return bool;
				//
			},false);
				if(bool){
					if(activeLayer){
						bool=activeLayer.blur();
						if(bool==false){
							return bool;
						}
					}
					for(var i =_clickFun.length-1,l=-1;i>l;i--){
						_clickFun[i](offsetX,offsetY);
					};
				}
				return bool;
		};
		function _bindClick(){
			var _canvas=Animation.getCanvas();
				_canvas.addEventListener("click",function(evt){
					evt.preventDefault();
					var offsetX=evt.offsetX||evt.layerX;
					var offsetY=evt.offsetY||evt.layerY;
					_click(offsetX,offsetY);	
				},false);
		};
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
			togglePaused:function(statu){
				if(statu){
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
					if(!fileJson[tempObj.type]){
                        fileJson[tempObj.type]=[];
                    };
                    fileJson[tempObj.type].push(tempObj);
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
			load:function(fun){
				var imgJson=fileJson.img,
					soundJson=fileJson.sound;
					for(var i=0;i<imgJson.length;i++){
						this._createImage(imgJson[i]);	
					}
					for(var i=0;i<soundJson.length;i++){
						this._createSound(soundJson[i]);
					}
			},
			//return img object of game cache;
			getImage:function(name){
				if(fileJson["img"]){
                    for(var i=0;i<fileJson["img"].length;i++){
                        if(fileJson["img"][i].name==name){
					        return fileJson["img"][i].obj;
                        }
                    }
				}
			},
			//return sound object of game cache;
			getSound:function(){
			}
		}
		return {
			SpriteFactory:_spriteObj,
			LayerFactory:LayerFactory,
			File:_fileObj,
			Progress:_progress,
			Animation:Animation,
			funLib:_funLib,
			speak:function(str){
				document.getElementById("test").innerText=str;
			},
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


function initWindowEvent(){
	var z=1;
	window.onblur=function(){
		if(z){
			z=0;
		game.Progress.togglePaused(0);
		}
	}
	window.onfocus=function(){
		if(!z){
			z=1;
		game.Progress.togglePaused(1);
		}
	}
	document.addEventListener("keyup",function(evt){
		if(evt.keyCode==13){
			game.Progress.togglePaused();
		};
	},false);
}
initWindowEvent();
