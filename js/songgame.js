					
var pagePrivate=window.pagePrivate||{};
pagePrivate.SongGame=(function(){
	/*
	 *Animate
	 * */
	var RAF=window.mozRequestAnimationFrame||window.requestAnimationFrame||window.webkitRequestAnimationFrame;
	var FrameTime=(function(){
	function animation(ctx){
		this.canvasObjList={};
		this.funAry={};
		var that=this;
		var cList=that.canvasObjList;
		var setAni=function(){
			for(var i in that.funAry){
				that.funAry[i]();
			}	
			for(var i in cList){
				var c=cList[i];
				ctx.beginPath();
				ctx.drawImage(c.canvas,c.x.toFixed(3),c.y.toFixed(3));

				ctx.arc(250,250,10,2*Math.PI,false);
				ctx.fill();
			};
			RAF(dod);
		};
		var time=0;
			var d=$("<div/>");
		var dod=function(){
			setAni();
			var timestamp = (new Date()).valueOf(); 
			var cha=timestamp-time;
			window.cha=cha;
			time=timestamp;
		};
		dod();
	}
	animation.prototype.addFunToFrame=function(key,fun){
		this.funAry[key]=fun;	
	};
	animation.prototype.removeFunToFrame=function(key,fun){
		delete this.funAry[key];	
	}
	animation.prototype.appendElement=function(key,canvasObj){
		this.canvasObjList[key]=canvasObj;
	};
	animation.prototype.removeElement=function(key){
		delete this.canvasObjList[key];
	};
	return animation;
	})();

	/*
	 *Stage
	 * */
	var Stage=(function(){
	var _getSpiritAryByLocal=function(SpiritAry,x,y,bool){
		var ary=[];
		for(var i=SpiritAry.length-1,l=0;i>-1;i--){
			if(SpiritAry[i].isInLocal(x,y)){
				ary.push(SpiritAry[i]);
				if(bool){
					return ary;
				};
			};
		};
		return ary;
			
	};
	var _bindEvent=function(){
		var stage=this;
		stage.canva.addEventListener("click",function(evt){
				var x=evt.offsetX,
					y=evt.offsetY;
			var spiritAry=_getSpiritAryByLocal(stage.SpiritAry,x,y);
			for(var i=0,l=spiritAry.length;i<l;i++){
				var d=spiritAry[i].triggerClick();
				if(d===false){
					return ;
				}
			}
			if(stage.events["click"]){
				var d=stage.events["click"]({"x":x,"y":y});
				if(d===false){
				return ;
				};
			}
		},false);
	};
	function stage(){
		var canva=document.createElement("canvas");
			var ss=SG.getScreenSize();
			canva.width=500;
			canva.height=500;
			canva.style.border="1px solid red";
		this.canva=canva;
		this.ctx=canva.getContext("2d");
		this.Animation=new FrameTime(this.ctx);
		this.SpiritAry=[];
		this.events={};
		var that=this;
		_bindEvent.call(this);
		this.Animation.addFunToFrame("clearRect",function(){
			that.ctx.clearRect(0,0,that.ctx.canvas.width,that.ctx.canvas.height);
		});
	}
	stage.prototype.bindEvent=function(eventName,fun){
		this.events[eventName]=fun;
	};
	stage.prototype.getCanva=function(){
		return this.canva;
	};
	stage.prototype.addAnimate=function(key,canvasObj){
		this.Animation.appendElement(key,canvasObj);
	};
	stage.prototype.removeAnimate=function(key){
		this.Animation.removeElement(key);
	};
	stage.prototype.addSpirit=function(spirit){
		this.SpiritAry.push(spirit);
		spirit.stage=this;
	};
	return stage;
	})();

	/*
	 *spirit
	 * */
	var Spirit=(function(){
		function _cacheCanvas(data){
			var that=this;
			var ary=[];
			var offsetX=data.offsetX,
				offsetY=data.offsetY,
				singleWidth=data.singleWidth,
				singleHeight=data.singleHeight;
			for(var i=0,l=data.imgCount;i<l;i++){
				var can=document.createElement("canvas");	
				var ctx=can.getContext("2d");
					can.width=singleWidth+1;
					can.height=singleHeight+1;
				ctx.beginPath();
				ctx.drawImage(data.img,offsetX+(i*singleWidth),offsetY,singleWidth,data.singleHeight,0,0,that.width,that.height);
			ctx.lineWidth=1;
				ctx.closePath();
				ary.push({"canvas":can,"ctx":ctx});
			}
			return ary;
		}
	function _oneFrame(){
		var list=this.frameFunList;
		for(var i in list){
			list[i]();
		};
		if(this.drawfun[this.state]){
			return this.drawfun[this.state]();
		};
	};
	function spirit(stage){
		this.name=SG.getRandom();
		var that=this;
		this.drawfun={};
		this.state=stage;
		this.frameFunList={};
		var animate=stage.Animation;
			animate.addFunToFrame(this.name+"run",function(){_oneFrame.call(that);});
		this.init();
	};
	spirit.prototype.distroy=function(name,fun){
			this.drawfun[this.state]=function(){};
			this.stage.Animation.removeFunToFrame(this.name+"run");
			this.stage.removeAnimate(this.name);
	}
	spirit.prototype.isInLocal=function(x,y){
		var myX=this.localX,myY=this.localY;
		var w=this.width/2,h=this.height/2;
		if((Math.abs(myX-x)<w)&&(Math.abs(myY-y)<h)){
			return true;
		};
		return false;
	};
	spirit.prototype.Test=function(){
			alert("test");
	};
	spirit.prototype.setDraw=function(name,_drawData){
		var that=this;
		if(typeof(_drawData)=="function"){
			this.drawfun[name]=_drawData;
			return;
		}else if(!typeof(_drawData)=="object"){
			console.error("drawData must be a function or object!");
			return;
		}
		var data=_drawData;
		var count=data.imgCount,delay=data.delay,a=0,i=0,c=0;
		var ary=_cacheCanvas.call(this,data);


		that.drawfun[name]=function(){
			a++;
			if(a==delay){
				a=0;i++;count==i?i=0:"";
			}
			var canvasObj=ary[i];
				var can=canvasObj.canvas;
				if(that.angle){
					var tempCan=document.createElement("canvas");
					var ctx=tempCan.getContext("2d");
						ctx.translate(15,15);
						ctx.rotate(Math.PI*2/360*that.angle);
						ctx.drawImage(can,-15,-15);
					can=tempCan;
				}
			that.stage.addAnimate(that.name,{"canvas":can,"x":that.offsetX,"y":that.offsetY});
		}
	};
	spirit.prototype.addFrameFun=function(name,fun){
		this.frameFunList[name]=fun;
	};
	spirit.prototype.removeFrameFun=function(name,fun){
		delete this.frameFunList[name];
	};
	spirit.prototype.faceTo=function(x,y){
		var x1=this.localX,
			y1=this.localY;
		var k=(y1-y)/(x1-x);
		var al=Math.atan(k);
		var v=x1>x?1:-1;
		var angle=al*(360/2/Math.PI)+270*v;
		this.rotateTo(angle);

	};
	spirit.prototype.rotateTo=function(_angle,fun){
			this.angle=_angle;
	};
	spirit.prototype.moveTo=function(x,y,_speed,fun){
			var that=this;
			var speed=_speed||1;
			var x1=this.localX;
			var y1=this.localY;
			var Xl=(x-x1);
			var Yl=(y-y1);
			var jl=Math.pow(Yl,2)+Math.pow(Xl,2);
			var d=Math.sqrt(jl);
			var step=0;
			var count=parseInt(d/speed);
			this.addFrameFun("moveTo",function(){
			t.faceTo(250,250);
				step++;
				x1=x1+Xl*(1/d)*speed;
				y1=y1+Yl*(1/d)*speed;
				that.setLocal(x1,y1);
				if(step==count){
					that.setLocal(x,y);
					that.removeFrameFun("moveTo");	
					fun?fun.call(that):"";
				}
			});
	};
	spirit.prototype.setLocal=function(x,y){
		this.localX=x;
		this.localY=y;
		this.offsetX=this.localX-this.width/2;
		this.offsetY=this.localY-this.height/2;
	};
	spirit.prototype.click=function(fun){
		this.clicker=fun;
	};
	spirit.prototype.triggerClick=function(){
		if(this.clicker){
			return this.clicker(this);
		}
	};
	spirit.prototype.addDrawFun=function(key,fun){
		this.drawFun[key]=fun;
	};
	spirit.prototype.add=function(){
		
	};
	return spirit;
	})();
	window._randomJson={};
	var _getRandom=function(b,bool){
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
			};
	}

	var songgame={
		"getScreenSize":function(){
				window.scrollTo(0,1);
			return {"width":window.innerWidth,"height":screen.height};
		},
		"animateAry":{},
		"Stages":{},
		"getRandom":function(b,bool){
			var js=_getRandom(b,bool);
			return js;
		},
		"extend":function(sup,sub){
			function temp(){};	
			temp.prototype=sup.prototype;
			temp.constructor=sub;
			sub.prototype=new temp();
		},
		"Image":{},
		"sound":{},
		"loadImg":function(json,fun){
			var tempAry=[];
			var that=this;
			for(var i in json){
				tempAry.push(i);
			}
			getImage(0);
			function getImage(count){
				if(!(count<tempAry.length)){
					fun();
					return false;
				}
				var img=document.createElement("img");
					var key=tempAry[count];
					img.src=json[key];
					img.onload=function(){
						that.Image[key]=img;
						getImage(++count);
					}
			}
		},
		"loadSound":function(json){
		},
		createAnimation:function(name){
			if(this.animateAry[name]){
				console.log("animate"+name+"ware exist!");
				return false;
			}else{
				var ani=new Animation();
				this.animateAry[name]=ani;
				return ani;
			}
		},
		changeStage:function(stage){
			var _stage;
			if(typeof(stage)=="string"){
				_stage=this.Stages[stage];
			}else if(typeof(stage)=="object"){
				_stage=stage;
			};
			this.box.appendChild(_stage.getCanva());
		},
		createStage:function(name){
			var stage=new Stage();
			this.Stages[name]=stage;
			return stage;
		},
		config:function(json){
			this.box=json.box;
		},
		extendSpirit:function(spirit){
			if(typeof(spirit)=="function"){
				this.extend(Spirit,spirit);
			}
		},
		getSpirit:function(spirit){
				return Spirit;
		}
	}	
	return songgame;
})();



