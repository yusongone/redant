var game=window.game||(function(){
	// game engine return sprite
	var Sprite=(function(){
		/*
		 *private function of sprite Module
		 * */

		//create canvas and context;
		function _createTempCanvas=function(){
			var tempCanvas=document.createElement("canvas");
				tempCanvas.width=this.width;
				tempCanvas.height=this.height;
			this._tempCanvas.tempCanvas;
			this._ctx=tempCanvas.getContext("2d");
		};

		/*
		 *sprite entity;
		 * */
		var _sprite=function(width,height){
			this.width=width;
			this.height=height;
			this.ImageData={};
			this.childSprite={};
			_createTempCanvas.call(this);
		};	
		_sprite.prototype.test=function(){
		
		}
		_sprite.prototype.setImageData=function(name,json){
				var tempAry=[];
				var tempJson=json[i];
				for(var j=0,i=tempJson.length;j<l;j++){
						var CanvasData=tempJson[j];
					var canvas=document.createElement("canvas");
						canvas.width=oneCanvaData.width;
						canvas.height=oneCanvaData.height;
					var ctx=canvas.getContext("2d");
						ctx.drawImage(json.img,CanvasData.x,CanvasData.y,CanvasData.width,CanvasData.height);
						tempAry.push(canvas);
				}
				this.ImageData[name]=tempAry;
		};
		_sprite.prototype.updateFrame=function(){

		}
		return _sprite;
	})();


	/*
	 *Animation entity;
	 * */
	var Animation=(function(){
		var _RAF=window.mozRequestAnimationFrame||window.requestAnimationFrame||window.webkitRequestAnimationFrame;
		var _canvas,_ctx;
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
		function _updateSprite(){
			for(var i in _childList){

			}
		};
		function _oneFrame(){
			_tick();
			_clearScreen();
			_startAnimate(time);
			_paintUnderSprite();	
			_updateSprite();	
			_paintOverSprite();
			_endAnimate();
			_RAF(oneFrame);
		};
		return {
			start:function(canvas){
				_canvas=canvas;
				_ctx=canvas.getContext("2d");
				_oneFrame();
			},	
			setChildList:function(childList){
				_childList=childList;
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
		return {
			"extend":_extend
		
		};
	})();

	/*
	 * main of game engine 
	 */
	var _game=(function(){
		var canvas=document.createElement("canvas");
			canvas.width=100;
			canvas.width=200;
		//load modle
		var fileJson={};
		var _fun_createImage=function(tempJson){
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
		var child={};


		//load modle
		var _fun_createSound=function(){
		};
		return {
			funLib:_funlib,
			start:function(){
				Animation.setChildList=child;
				Animation.start(canvas);		
			},
			togglePaused:function(){
						 
						 },
			getSprite:function(sprite){
				return spriteList[name];
			},	
			removeSprite:function(name){
				delete spriteList[name];
			},
			addSprite:function(name,sprite){
				spriteList[name]=sprite;
			},
			getSpriteEntity:function(){
				return Sprite;
						   },
			addFile:function(Ary){
				for(var i=0,l=Ary.length;i++){
					var tmepObj=Ary[i];
					fileJson[tempObj.type][tempObj.name]=tempObj;
				};
				return this;
			},
			load:function(){
				var imgJson=fileJson.img,
					soundJson=fileJson.sound;
					for(var i in imgJson){
						_fun_createImag(imgJson[i]);	
					}
					for(var i in soundJson){
						_fun_createSound(soundJson[i]);
					}
				 },
			getElement:function(){
					   
					   }
		}
	})();
	return _game;
})();


game.addFile([
	{
		"type":"img"
		,"name":"monkey"
		,"url":"/img/abc.png"
		,"url":"abc"
	},
	{
		"type":"sound"
		,"url":"/sound/sound.mp3"
		,"url":"abc"
	}
]).load();

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
