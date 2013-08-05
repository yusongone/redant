					
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
				if(c.angle){
					var centerX=c.lx;
					var centerY=c.ly;
					ctx.save()
					ctx.translate(centerX,centerY);
					ctx.rotate(Math.PI*2/360*c.angle);
					ctx.translate(-centerX,-centerY);
					ctx.drawImage(c.canvas,c.x,c.y);
					ctx.restore();
				}else{
					ctx.drawImage(c.canvas,c.x,c.y);
				}
				ctx.closePath();
				ctx.fill();
			};
			RAF(dod);
		};
		var time=0;
		var dod=function(){
			setAni();
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
				ary.push({"canvas":can});
			}
			return ary;
		}
	function _oneFrame(){
		var list=this.frameFunList;
		if(this.distroyStatus){
			_distroyMyself.call(this);
		};
		for(var i in list){
			var temp=list[i];
			if(!temp.time||temp.now==temp.time){
				temp.fun.call(this);
				temp.now=0;
			}else{
				temp.now++;
			}
		};
		if(this.drawfun[this.state]){
			return this.drawfun[this.state].call(this);
		};
	};
	function _distroyMyself(){
			this.drawfun[this.state]=function(){};
			this.stage.Animation.removeFunToFrame(this.name+"run");
			this.stage.removeAnimate(this.name);
	};
	function spirit(stage){
		this.name=SG.getRandom();
		var that=this;
		this.drawfun={};
		this.state=stage;
		this.frameFunList={};
		this.stage=stage;
		var animate=stage.Animation;
			animate.addFunToFrame(this.name+"run",function(){_oneFrame.call(that);});
		this.init();
	};
	spirit.prototype.distroy=function(name,fun){
			this.distroyStatus=true;
	};
	spirit.prototype.getSiteInAngle=function(space){
			var angle=this.angle;
	};
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
			that.stage.addAnimate(that.name,{
					"canvas":ary[i].canvas,
					"x":that.offsetX,
					"y":that.offsetY,
					"lx":that.localX,
					"ly":that.localY,
					"angle":that.angle
				});
		}
	};
	spirit.prototype.addFrameFun=function(name,fun,time){
		this.frameFunList[name]={"fun":fun,"time":time,"now":0};
	};
	spirit.prototype.removeFrameFun=function(name,fun){
		this.deleteName=name;
		delete this.frameFunList[name];
		this.deleteName==null;
	};
	spirit.prototype.faceTo=function(x,y){
		var x1=this.localX,
			y1=this.localY;
		var k=(y1-y)/(x1-x);
		var al=Math.atan(k);
		var v=x1>x?1:-1;
		var angle=al*(360/2/Math.PI)+270*v;
			if(angle==-360){
				angle=-180
			}else if(angle==-180){
				angle=-360;
			}
		this.rotateTo(angle);

	};
	spirit.prototype.rotateTo=function(_angle,fun){
			this.angle=_angle;
	};
	spirit.prototype.checkHit=function(Ary,fun){
		if(!Ary){return;};
		for(var i=0,l=Ary.length;i<l;i++){
			var x=Ary[i].localX;
			var y=Ary[i].localY;
			var tempHeight=(Ary[i].height+this.height)/2;
			var tempWidth=(Ary[i].width+this.width)/2;
			var subWidth=Math.abs(x-this.localX)-tempWidth;
			var subHeight=Math.abs(y-this.localY)-tempHeight;
			if(subWidth<0&&subHeight<0){
				var d=fun.call(this,Ary[i]);
				if(d===false){return ;};
			};
			//var spaceA=songgame.computeSpace(x,y,this.localX,this.localY);
		}
	};
	spirit.prototype.moveTo=function(x,y,Speed,fun){
			var that=this;
			var _speed=Speed||1;
			this.speed=_speed;
			var x1=this.localX;
			var y1=this.localY;
			var Xl=(x-x1);
			var Yl=(y-y1);
			var jl=Math.pow(Yl,2)+Math.pow(Xl,2);
			var d=Math.sqrt(jl);
			var step=0;
			var count=parseInt(d/_speed);
			var k=_speed/d;
			this.addFrameFun("moveTo",function(){
				step++;
				x1+=Xl*k;
				y1+=Yl*k;
				that.setLocal(x1,y1);
				if(step==count){
					that.setLocal(x,y);
					that.removeFrameFun("moveTo");	
					fun?fun.call(that):"";
				};
			});
	};
	spirit.prototype.setLocal=function(x,y){
		this.localX=x||this.localX;
		this.localY=y||this.localY;
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
	//compute space for double dot
	var _computeSpace=function(x1,y1,x2,y2){
			var jl=Math.pow(x2-x1,2)+Math.pow(y2-y1,2);
			var d=Math.sqrt(jl);
			return d;
	};

	var songgame={
		getScreenSize:function(){
				window.scrollTo(0,1);
			return {"width":window.innerWidth,"height":screen.height};
		},
		animateAry:{},
		computeSpace:_computeSpace,
		Stages:{},
		getRandom:function(b,bool){
			var js=_getRandom(b,bool);
			return js;
		},
		extend:function(sup,sub){
			function temp(){};	
			temp.prototype=sup.prototype;
			temp.constructor=sub;
			sub.prototype=new temp();
		},
		Image:{},
		sound:{},
		loadImg:function(json,fun){
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
		loadSound:function(json){
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



