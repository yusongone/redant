					
var pagePrivate=window.pagePrivate||{};
pagePrivate.SongGame=(function(){
	/*
	 *Animate
	 * */
	var RAF=window.mozRequestAnimationFrame||window.requestAnimationFrame||window.webkitRequestAnimationFrame;
	function Animation(){
		this.funAry={};
		var that=this;
		var setAni=function(){
			for(var i in that.funAry){
				that.funAry[i]();
			}	
		//	window.requestAnimationFrame(dod);
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
	Animation.prototype.addAnimate=function(key,fun){
		this.funAry[key]=fun;	
	};
	Animation.prototype.removeAnimate=function(key,fun){
		delete this.funAry[key];	
	};

	/*
	 *Stage
	 * */
	var Stage=(function(){
	var _getSpiritAryByLocal=function(SpiritAry,x,y,bool){
		var ary=[];
		for(var i=0,l=SpiritAry.length;i<l;i++){
			if(SpiritAry[i].isInLocal(x,y)){
				ary.push(SpiritAry[i]);
				if(bool){
					return ary;
				};
			};
		};
		return ary;
			
	};
	var _bindEvent=function(stage){
		stage.canva.addEventListener("click",function(evt){
				var x=evt.offsetX,
					y=evt.offsetY;
			var spiritAry=_getSpiritAryByLocal(stage.SpiritAry,x,y);
			if(stage.events["click"]){
				var d=stage.events["click"]({"x":x,"y":y});
				if(d===false){
				return ;
				};
			}
			for(var i=0,l=spiritAry.length;i<l;i++){
				spiritAry[i].triggerClick();
			}
		},false);
	};
	function stage(){
		var canva=document.createElement("canvas");
			var ss=SG.getScreenSize();
			canva.width=ss.width;
			canva.height=ss.height;
			canva.style.border="1px solid red";
		this.canva=canva;
		this.ctx=canva.getContext("2d");
		this.Animation=new Animation();
		this.SpiritAry=[];
		this.events={};
		var that=this;
		_bindEvent(this);
		this.Animation.addAnimate("a",function(){
			that.ctx.clearRect(0,0,that.ctx.canvas.width,that.ctx.canvas.height);
			window.scrollTo(0,1);
									ctx.fillText(cha,100,100);
		});
	}
	stage.prototype.bindEvent=function(eventName,fun){
		this.events[eventName]=fun;
	};
	stage.prototype.getCanva=function(){
		return this.canva;
	};
	stage.prototype.addAnimate=function(key,fun){
		this.Animation.addAnimate(key,fun);
	};
	stage.prototype.removeAnimate=function(key){
		this.Animation.removeAnimate(key);
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
		function _cacheCanvas(data,that){
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
				ctx.drawImage(data.img,offsetX+(i*singleWidth),offsetY,singleWidth,data.singleHeight,0,0,singleWidth,singleHeight);
			ctx.lineWidth=1;
			ctx.strokeRect(0.5,0.5,singleWidth,singleHeight);
				ctx.closePath();
				ary.push(can);
			}
			return ary;
		}
	function spirit(){
		var that=this;
		this.drawfun={};
		this.state;
		this.stage.addAnimate(this.name+"run",function(){that.drawSelf()});
	};
	spirit.prototype.isInLocal=function(x,y){
		var myX=this.localX,myY=this.localY;
		var w=this.width/2,h=this.height/2;
		if(Math.abs(myX-x)<w&&Math.abs(myY-y)<h){
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
		var count=data.imgCount,step=data.delay,a=0,i=0,c=0;
		var ary=_cacheCanvas(data,this);


		that.drawfun[name]=function(ctx){
			a++;
			if(a==step){
				a=0;i++;count==i?i=0:"";
			}
			ctx.beginPath();
			ctx.drawImage(ary[i],that.offsetX,that.offsetY);
			ctx.closePath();
			ctx.fill();
		}
	};
	spirit.prototype.setDrawByFunction=function(name,fun){
			this.drawfun[name]=fun;
	}
	spirit.prototype.drawSelf=function(){
		var ctx=this.stage.ctx;
		if(this.drawfun[this.state]){
			this.drawfun[this.state](ctx);
		};
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
			this.clicker(this);
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



