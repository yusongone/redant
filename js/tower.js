game.File.addFile([
	{
		"type":"img"
		,"name":"bomb"
		,"url":"/image/bomb.png"
	},
	{
		"type":"img"
		,"name":"rebot"
		,"url":"/image/rebot.png"
	},
	{
		"type":"img"
		,"name":"monkey"
		,"url":"/image/people.jpg"
	},
	{
		"type":"sound"
        ,"name":"bomb1"
		,"url":"/sound/bomb2.wav"
	},
	{
		"type":"sound"
        ,"name":"rebot"
		,"url":"/sound/dragon.wav"
	},
	{
		"type":"sound"
        ,"name":"injure"
		,"url":"/sound/injured2.wav"
	},
	{
		"type":"sound"
        ,"name":"fire"
		,"url":"/sound/fire.wav"
	},
	{
		"type":"sound"
        ,"name":"fire2"
		,"url":"/sound/fire2.wav"
	}
]).load();



function init(){
		main.setDiv({
			moneyDiv:$("#money")
			,fpsDiv:$("#fps")
		});
		$("#begin").click(function(){
			$("#begin").slideUp("slow");
			game.Progress.start();	
		});	
		game.config({
			"canvasWidth":480
			,"canvasHeight":320
		});
		game.appendTo(document.getElementById("box"));
		path.init([
		{x:15.5,y:135.5},
		{x:165.5,y:135.5},
		{x:165.5,y:195.5},
		{x:375.5,y:195.5},
		{x:375.5,y:75.5},
		{x:465.5,y:75.5},
		]);
		monsterFactory.createSomeMonster(["gwA","gwB","gwA","gwB"]);
		monsterFactory.layer.toTop();
		return false;
};
var path=(function(){
	var _layer=game.LayerFactory.createLayer();
	var sprite=game.SpriteFactory.getSpriteEntity();

	var _map;

		function _checkInPath(index,x,y){
			if(!(index<_map.length-1)){
				return false;
			}
			var x1=_map[index].x;
			var y1=_map[index].y;
			var x2=_map[++index].x;
			var y2=_map[index].y;
			var midX=(x1+x2)/2,midY=(y1+y2)/2,h=Math.abs(y1-y2)+30,w=Math.abs(x1-x2)+30;
			if(Math.abs(midX-x)<w/2&&Math.abs(midY-y)<h/2){
				return true;	
			}else{
				return _checkInPath(index,x,y);
			}
		};


		function Life(width,height){
			this.life=100;
			sprite.call(this,width,height);
				var ctx=this.ctx;
				ctx.save();
				ctx.fillStyle="green";
				ctx.fillRect(0,0,width,height);
				ctx.restore();
		};
		game.funLib.extend(sprite,Life);
		Life.prototype.sub=function(num){
				this.life-=num;
			var ctx=this.ctx;
			ctx.clearRect(0,0,this.width,this.height);
			var w=this.life/100*this.width;
				ctx.fillStyle="rgb(255,"+(255*this.life/100)+",0)";
			ctx.fillRect(0,0,w,this.height);
		};
		var jg;
		function createExit(){
			var length=_map.length;
				jg=new sprite(30,30);				
				jg.turn(50);
				var tempX=_map[length-1].x;
				var tempY=_map[length-1].y;
				jg.setCenter(tempX,tempY);
				_layer.append(jg);
				jg.life=new Life(20,5);
				jg.life.setCenter(tempX,tempY-25);
				_layer.append(jg.life);
			path.exitObj=jg
		};
	return {
		layer:_layer,
		init:function(map){
			_map=map;
			this.map=_map;
			var canvas=document.getElementById("bj");
			var ctx=canvas.getContext("2d");
			for(var i=1;i<27;i++){
				ctx.save();
				ctx.strokeStyle="#ddd";
				ctx.moveTo(0.5+i*30,0);
				ctx.lineTo(0.5+i*30,320);
			}
			for(var i=1;i<11;i++){
				ctx.moveTo(0,0.5+i*30);
				ctx.lineTo(480,0.5+i*30);
			}
				ctx.restore();
				ctx.stroke();
				ctx.lineWidth=30;
				ctx.strokeStyle="white"
				ctx.beginPath();
				ctx.moveTo(_map[0].x,_map[0].y);
			for(var i=1,l=_map.length;i<l;i++){
				ctx.lineTo(_map[i].x,_map[i].y);
			}
				ctx.stroke();
			createExit();
		
		},
		checkInPath:function(x,y){
			var re=_checkInPath(0,x,y);		
			return re;
		}
	}
})();
var bombFactory=(function(){
	var layer=game.LayerFactory.createLayer();
	var sprite=game.SpriteFactory.getSpriteEntity();
		function bomb(width,height){
			sprite.call(this,width,height);
			this.reUI();
			this.changeImage();
		};
		game.funLib.extend(sprite,bomb);
		bomb.prototype.changeImage=function(num){
				var i=0;
				var ctx=this.ctx;
				var that=this;
					that.setFrame("run",function(){
						if(i==18){
							that.removeFrame("run");
							that.distroy();
							return false;	
						}
						ctx.clearRect(0,0,that.width,that.height);	
						ctx.drawImage(that.canvasList["bomb"][i++],0,0,54,54,0,0,54,54);
					},30);
		};
		bomb.prototype.reUI=function(num){
			var size=54;
			var osY=0;
			this.setImageData("bomb",{
				img:game.File.getImage("bomb"),
				data:[
					{x:size*0,y:0+osY,width:size,height:size},
					{x:size*1,y:0+osY,width:size,height:size},
					{x:size*2,y:0+osY,width:size,height:size},
					{x:size*3,y:0+osY,width:size,height:size},
					{x:size*4,y:0+osY,width:size,height:size},
					{x:size*5,y:0+osY,width:size,height:size},
					{x:size*6,y:0+osY,width:size,height:size},
					{x:size*7,y:0+osY,width:size,height:size},
					{x:size*8,y:0+osY,width:size,height:size},
					{x:size*9,y:0+osY,width:size,height:size},
					{x:size*10,y:0+osY,width:size,height:size},
					{x:size*11,y:0+osY,width:size,height:size},
					{x:size*12,y:0+osY,width:size,height:size},
					{x:size*13,y:0+osY,width:size,height:size},
					{x:size*14,y:0+osY,width:size,height:size},
					{x:size*15,y:0+osY,width:size,height:size},
					{x:size*16,y:0+osY,width:size,height:size},
					{x:size*17,y:0+osY,width:size,height:size},
					{x:size*18,y:0+osY,width:size,height:size},
					{x:size*19,y:0+osY,width:size,height:size}
				]
			});
		};

		return {
			getABomb:function(x,y){
			var bo=new bomb(54,54);
				bo.setCenter(x,y);
                var buffer=game.File.getSoundBuffer("bomb1");
				bo.setAudio("play",buffer);
				bo.playAudio("play");
				layer.append(bo);
			},
			init:function(){
			
			}
		}
		
	
})();
var monsterFactory=(function (){
	var monsterLayer=path.layer;
	var sprite=game.SpriteFactory.getSpriteEntity();
	var _monsterList=[];
	var Factory={"gwA":gwA,"gwB":gwB};
	var _orderForm=null;
	var _orderIndex=0;
	//
		function Life(width,height){
			sprite.call(this,width,height);
				var ctx=this.ctx;
				ctx.save();
				ctx.fillStyle="green";
				ctx.fillRect(0,0,32,5);
				ctx.restore();
			this.quantity=1;
		};
		game.funLib.extend(sprite,Life);
		Life.prototype.sub=function(num){
			this.quantity-=num/this.value;
			this.quantity=this.quantity.toFixed(4);
			var ctx=this.ctx;
			ctx.fillStyle="green";
			ctx.clearRect(0,0,this.width,this.height);
			var w=this.quantity*this.width;
			ctx.fillStyle="rgb(255,"+(255*this.quantity)+",0)";
			ctx.fillRect(0,0,w,this.height);
		};


		function gw(width,height){
			sprite.call(this,width,height);	
			this.mapIndex=0;
			monsterLayer.append(this);
			this.createLife();
			this.reUI();
			this.setAudio("injure",game.File.getSoundBuffer("injure"));
			this.setAudio("create",game.File.getSoundBuffer("rebot"));
			this.playAudio("create");
		}
		game.funLib.extend(sprite,gw);
		gw.prototype.injure=function(num){
			this.life.sub(num);
			if(!(this.life.quantity>0)){
				this.stop();
				main.addMoney(this.money);
				_distroyMonster(this);
			}else{
				this.playAudio("injure");
			}
		};
		gw.prototype.goTo=function(){
			var that=this;
			var index=that.mapIndex;
			if(index==path.map.length){
				monsterFactory.distroyMonster(that);
				path.exitObj.life.sub(10);
				return false;
			}else{
				this.moveTo(path.map[index].x,path.map[index].y,function(){
					that.goTo();	
				});
				that.mapIndex++;
			};
            switch(that.vectorDir){
                case 0:;break;
                case -270:that.changeImage("left");break;
                case -180:that.changeImage("down");break;
                case -360:that.changeImage("up");break;
            }
		};
		gw.prototype.changeImage=function(action){
            var that=this;
			var ctx=this.ctx;
			var i=0;
				ctx.clearRect(0,0,that.width,that.height);	
				ctx.drawImage(that.canvasList[action][i++],0,0,31,31,0,0,31,31);
			this.setFrame("run",function(){
				i==4?i=0:"";
				ctx.clearRect(0,0,that.width,that.height);	
				ctx.drawImage(that.canvasList[action][i++],0,0,31,31,0,0,31,31);
			},80);
        },
		gw.prototype.createLife=function(){
			var life=new Life(this.width,5);
				life.value=this.lifeValue;
				life.setCenter(this.offsetX,this.offsetY-20);
			monsterLayer.append(life);
			this.life=life;
			this.addFrameFun("updateLifeCoord",function(){
				life.setCenter(this.offsetX,this.offsetY-25);
			});
		};
	//
		function gwA(width,height){
			this.lifeValue=50;
			gw.call(this,width,height);	
			this.speed=50;
			this.money=5;
		}
		game.funLib.extend(gw,gwA);
		gwA.prototype.reUI=function(){
			var osX=0;
            var osY=128;
			var size=32;
			var that=this;
			this.setImageData("down",{
				img:game.File.getImage("rebot"),
				data:[
					{x:size*0,y:0+osY,width:size,height:size},
					{x:size*1,y:0+osY,width:size,height:size},
					{x:size*2,y:0+osY,width:size,height:size},
					{x:size*1,y:0+osY,width:size,height:size}
				]
			});
			this.setImageData("up",{
				img:game.File.getImage("rebot"),
				data:[
					{x:size*0,y:96+osY,width:size,height:size},
					{x:size*1,y:96+osY,width:size,height:size},
					{x:size*2,y:96+osY,width:size,height:size},
					{x:size*1,y:96+osY,width:size,height:size}
				]
			});
			this.setImageData("left",{
				img:game.File.getImage("rebot"),
				data:[
					{x:size*0,y:64+osY,width:size,height:size},
					{x:size*1,y:64+osY,width:size,height:size},
					{x:size*2,y:64+osY,width:size,height:size},
					{x:size*1,y:64+osY,width:size,height:size}
				]
			});
            this.changeImage("left");
			return false;
		};
		//gwB
		function gwB(width,height){
			this.lifeValue=100;
			gw.call(this,width,height);	
			this.speed=70;
			this.money=10;
		}
		game.funLib.extend(gw,gwB);
		gwB.prototype.reUI=function(){
			var os=0;
			var that=this;
			var size=32;
			this.setImageData("down",{
				img:game.File.getImage("rebot"),
				data:[
					{x:size*0,y:0,width:size,height:size},
					{x:size*1,y:0,width:size,height:size},
					{x:size*2,y:0,width:size,height:size},
					{x:size*1,y:0,width:size,height:size}
				]
			});
			this.setImageData("up",{
				img:game.File.getImage("rebot"),
				data:[
					{x:size*0,y:96,width:size,height:size},
					{x:size*1,y:96,width:size,height:size},
					{x:size*2,y:96,width:size,height:size},
					{x:size*1,y:96,width:size,height:size}
				]
			});
			this.setImageData("left",{
				img:game.File.getImage("rebot"),
				data:[
					{x:size*0,y:64,width:size,height:size},
					{x:size*1,y:64,width:size,height:size},
					{x:size*2,y:64,width:size,height:size},
					{x:size*1,y:64,width:size,height:size}
				]
			});
            this.changeImage("left");
			return false;
		};



		function _distroyMonster(obj){
			var d=game.funLib.selectArrayByObj(_monsterList,obj,function(index){
				_monsterList.splice(index,1);	
				obj.distroy();
				obj.life.distroy();
				bombFactory.getABomb(obj.offsetX,obj.offsetY-20);
			});
		};

		function _checkNoMonster(){
			game.Animation.setFrame("checkNo",function(){
				if(_monsterList.length<1&&_orderForm.length>_orderIndex){
						_createSomeMonster();
						game.Animation.removeFrame("checkNo");
				}
			},2000);
		};

		function _createSomeMonster(){
			var map=path.map;
			var Ary=_orderForm[_orderIndex++];
			var length=Ary.length;
			var i=0;
			game.Animation.setFrame("createMonster",function(){
				if(i==length){game.Animation.removeFrame("createMonster");_checkNoMonster();return false;};
				var GA=Factory[Ary[i]];
				var gw=new GA(32,32);
				_monsterList.push(gw);
				gw.setCenter(map[0].x,map[0].y);
				gw.goTo();
				i++;
			},1000);				  
		}

	return {
		layer:monsterLayer,
		monsterList:_monsterList,
		distroyMonster:_distroyMonster,
		createSomeMonster:_createSomeMonster,
		setOrderForm:function(ary){
			_orderForm=ary;	
		}
	}
})();

var towerFactory=(function(){
	var layer=path.layer;
	var sprite=game.SpriteFactory.getSpriteEntity();
	var towerList=[];

		function bul(width,height){
			sprite.call(this,width,height);
			var ctx=this.ctx;
				ctx.fillRect(0,0,this.width,this.height);
			this.ready=1;
		}
		game.funLib.extend(sprite,bul);
		bul.prototype.follow=function(obj,that){
			this.ready=0;
			this.followTo(obj,function(){
					obj.injure(20);
					this.angle=that.angle;
					this.setCenter(that.centerX,that.centerY);
					this.ready=1;
			},true);
		}
		function bul1(){
			bul.call(this,3,3);
			this.speed=200;
		}
		game.funLib.extend(bul,bul1);

		function bul2(){
			bul.call(this,5,10);
			this.speed=100;
		}
		game.funLib.extend(bul,bul2);



		function tower(){
			sprite.call(this,20,20);
			this._showScope=0;
			this.level=0;
			towerList.push(this);
		};	
		game.funLib.extend(sprite,tower);
		//巡视
		tower.prototype.tour=function(){
			var monsterList=monsterFactory.monsterList;
			var getSpace=game.funLib.getSpaceBetweenDoubleCoord;
			var that=this;
			var oldHitGoal=null;
			var isTurn=0;
			function tour(){
				for(var i in monsterList){
					var tempM=monsterList[i];
					var space=getSpace(tempM.offsetX,tempM.offsetY,that.offsetX,that.offsetY);	
					if(!(space>that.hitSpace)){
						that.hitGoal=tempM;
						that.faceTo(tempM);
						return;
					}
				};	
				that.hitGoal=null;
			};	
			this.addFrameFun("tour",tour);
		};
		tower.prototype.saleSelf=function(){
				towerFactory.removeTower(this);
				var money=this.saleMoney[this.level]
				main.addMoney(money);
				this.level++;

		};
		tower.prototype.upgradeSelf=function(){
				this.hitSpace+=30;
				var money=this.upgradeMoney[this.level]
				main.spendMoney(money);
				this.level++;

		};
		//发射
		tower.prototype.fire=function(){
			var that=this;
			game.Animation.setFrame(this.name+"fire",function(){
				var hitGoal=that.hitGoal;
				if(hitGoal&&that.bul&&that.bul.ready){
					that.bul.follow(hitGoal,that);
					that.playAudio("fire");
				};
			},1000);
		};
		tower.prototype.initBul=function(_bul){
				_bul.angle=this.angle;
				_bul.setCenter(this.centerX,this.centerY);
				layer.append(_bul);
				this.bul=_bul;
		};
	

		function towerA(x,y){
			tower.call(this,20,20);
			this.reUI();
			this.upgradeMoney=[20,50];
			this.saleMoney=[10,20];
			this.setCenter(x,y);
			this.hitSpace=130;
			this.hitGoal=null;
			this.tour();
			this.initBul(new bul1());
			this.setAudio("fire",game.File.getSoundBuffer("fire"));
			this.fire();
		};
		game.funLib.extend(tower,towerA);
		towerA.prototype.reUI=function(){
				var ctx=this.ctx;
				ctx.save();
				ctx.fillStyle="red";
				ctx.arc(this.width/2,this.height/2,10,0,2*Math.PI,false);
				ctx.fillRect(this.width/2-5,0,this.width/2,this.height);
				ctx.stroke();
				ctx.restore();
		};
		function towerB(x,y){
			tower.call(this,20,20);
			this.reUI();
			this.upgradeMoney=[10,20];
			this.saleMoney=[5,10];
			this.setCenter(x,y);
			this.hitSpace=100;
			this.hitGoal=null;
			this.tour();
			this.initBul(new bul2());
			this.setAudio("fire",game.File.getSoundBuffer("fire2"));
			this.fire();
		};
		game.funLib.extend(tower,towerB);
		towerB.prototype.reUI=function(){
				var ctx=this.ctx;
				ctx.save();
				ctx.fillStyle="green";
				ctx.arc(this.width/2,this.height/2,10,0,2*Math.PI,false);
				ctx.fillRect(this.width/2-5,0,this.width/2,this.height);
				ctx.stroke();
				ctx.restore();
		};

		var Factory={"towerA":towerA,"towerB":towerB};
		
		return {
			getTower:function(x,y,type){
				var tw=Factory[type];
				var tt=new tw(x,y);
					layer.append(tt);
					tt.click(function(){
						layer.blur();
						operateTower.showOperate(tt);
						return false;
					});
			},	
			removeTower:function(tower){
				var i=game.funLib.selectArrayByObj(towerList,this);	
				tower.distroy();
				tower.bul.distroy();
				tower.bul=null;
				towerList.splice(i,1);
			},
			removeShowScope:function(){
				for(var i=0,l=towerList.length;i<l;i++){
					towerList[i].exitScope();
				}	
			}
		}
})();

var eventManage=(function(){
	game.click(function(x,y){
		var cx=((x/30)>>0)*30+15;
		var cy=((y/30)>>0)*30+15;
		if(path.checkInPath(cx,cy)){
			return false;
		};
		towerCreateDiv.turnOnTowerDiv(cx,cy);
		return false;
	});	
	return {
		unbindGapClick:function(){
			_gapClick=null;
		},
		bindGapClick:function(fun){
			_gapClick=fun;
		}
	}
})();

var operateTower=(function(){
	var layer=game.LayerFactory.createLayer();
		layer.hide=1;
	var sprite=game.SpriteFactory.getSpriteEntity();
		function hitScope(size){
			sprite.call(this,size,size);
			this.reUI();
			this.turn(100);
		}
		game.funLib.extend(sprite,hitScope);
		hitScope.prototype.reSetSize=function(w,h){
				this.angle=0;
				this.width=w;
				this.height=h;
			this.spriteCanvas.width=w;
			this.spriteCanvas.height=h;
			this.reUI();
		};
		hitScope.prototype.reUI=function(){
			var ctx=this.ctx;	
				ctx.strokeStyle="red";
				ctx.beginPath();
				ctx.moveTo(this.width/2,0);
				ctx.lineTo(this.width/2,this.height/2);
				ctx.closePath();
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(this.width/2,this.height/2,this.width/2,0,2*Math.PI);
				ctx.stroke();
		}

		function upgrade(size){
			sprite.call(this,size,size);
			var ctx=this.ctx;
				ctx.fillText("this",0,0,20,20);
				ctx.fill();
			this.clickEnable=1;
		}
		game.funLib.extend(sprite,upgrade);
		upgrade.prototype.stopCheckMoney=function(){
			this.removeFrame("checkMoney");
		};
		upgrade.prototype.checkMoney=function(){
			var tower=this.tower;
			var upMoney=tower.upgradeMoney[tower.level];
			this.setFrame("checkMoney",function(){
				if(upMoney){
					if(!(upMoney>main.getMoney())){
						//this.unDisable();
						this.clickEnable=1;
					}else{
						//this.disable();
						this.clickEnable=0;
					}
				}else{
					console.log("max level");
					this.clickEnable=0;
				}
			});
		};

		function Sale(size){
			sprite.call(this,size,size);
		}
		game.funLib.extend(sprite,Sale);

	var _scope=new hitScope(10);
	var _up=new upgrade(40);
		_up.setCenter(-30,-30);
	var _sale=new Sale(40);
		_sale.setCenter(20,-30);

		layer.append(_scope);
		layer.append(_up);
		layer.append(_sale);
				_up.click(function(){
					if(!this.clickEnable){return false;};
					this.tower.upgradeSelf();
					operateTower.showOperate(this.tower);
					return false;
				});
				_sale.click(function(){
					this.tower.saleSelf();
					layer.blur();
					return false;
				});

	return {
			showOperate:function(tower){
				var x=tower.offsetX;
				var y=tower.offsetY;
				var space=tower.hitSpace*2;
				layer.setCoord(x,y);
				_scope.reSetSize(space,space);
				var that=this;
				_up.tower=tower;
				_sale.tower=tower;
				_up.checkMoney();
							layer.bindBlur(function(){
								layer.hide=1;
								_up.stopCheckMoney();
								return false;
							});
				layer.hide=0;
				layer.toTop();
				game.LayerFactory.setActiveLayer(layer);
			}
	
	}
})();

var towerCreateDiv=(function(){
	var creatLayer=game.LayerFactory.createLayer();
		creatLayer.bindBlur(function(){
			towerCreateDiv.turnOffTowerDiv();
			return false;
		});
	var sprite=game.SpriteFactory.getSpriteEntity();
	var _show=0;
	var towerList=[];
		function _toggleCheck(bool){
			for(var i =0,l=towerList.length;i<l;i++){
				bool?towerList[i].checkMoney():towerList[i].stopCheckMoney();
			}
		};
		function background(width,height){
			sprite.call(this,width,height);
			this.reUI();
			creatLayer.append(this);
			this.setCenter(30,-10);
		};
		game.funLib.extend(sprite,background);
		background.prototype.reUI=function(){
			var ctx=this.ctx;
				ctx.save();
				ctx.fillStyle="rgba(30,30,30,0.7)";
				ctx.fillRect(0,0,this.width,this.height);
				ctx.stroke();
				ctx.restore();
		};

		function MyLocal(){
			sprite.call(this);
			this.reUI();
			creatLayer.append(this);
			this.setCenter(30,30);
		}
		game.funLib.extend(sprite,MyLocal);
		MyLocal.prototype.reUI=function(){
			var ctx=this.ctx;
				ctx.save();
				ctx.fillStyle="red";
				ctx.arc(this.width/2,this.height/2,10,0,2*Math.PI,false);
				ctx.moveTo(this.width/2,0);
				ctx.lineTo(this.width/2,this.height);
				ctx.moveTo(0,this.height/2);
				ctx.lineTo(this.width,this.height/2);
				ctx.fillRect(this.width/2-5,this.height/2-5,this.width/2,this.height/2);
				ctx.stroke();
				ctx.restore();
		}

		//
		function cTower(){
			sprite.call(this,40,40);
			this.bindEvent();	
			this.dis=0;
			this.checkMoney();
			creatLayer.append(this);
			towerList.push(this);
		};
		game.funLib.extend(sprite,cTower);
		cTower.prototype.bindEvent=function(){
			var that=this;
			this.click(function(){
					if(that.dis){return false;}
						var cx=creatLayer.coordX;
						var cy=creatLayer.coordY;
						towerFactory.getTower(cx+30,cy+30,that.type);
						that.layer.blur();
						main.spendMoney(that.pay);
						return false;
			});
		};
		cTower.prototype.unDisable=function(){
			this.dis=0;
			this.ctx.clearRect(0,0,this.width,this.height);
			this.reUI();
		};
		cTower.prototype.disable=function(){
			if(this.dis){return;}
			this.dis=1;
			var ctx=this.ctx;
			ctx.save();
			ctx.fillStyle="rgba(50,50,50,0.4)";
			ctx.fillRect(0,0,this.width,this.height);
			ctx.restore();
		};
		cTower.prototype.stopCheckMoney=function(){
			this.removeFrame("checkMoney");
		};
		cTower.prototype.checkMoney=function(){
			this.setFrame("checkMoney",function(){
				if(!(this.pay>main.getMoney())){
					this.unDisable();
				}else{
					this.disable();
				}
			});
		};


		function cTowerA(){
			cTower.call(this);
			this.pay=30;
			this.type="towerA"
			this.reUI();
			this.setCenter(0,-10);
		}
		game.funLib.extend(cTower,cTowerA);
		cTowerA.prototype.reUI=function(){
			var ctx=this.ctx;	
				ctx.save();
				ctx.fillStyle="yellow";
				ctx.beginPath();
				ctx.arc(this.width/2,this.height/2,this.width/2,0,2*Math.PI,false);
				ctx.closePath();
				ctx.fill();
				ctx.fillStyle="red";
				ctx.fillRect(this.width/2-5,0,10,this.height);
				ctx.restore();
		}
		function cTowerB(){
			cTower.call(this,40,40);
			this.pay=20;
			this.type="towerB"
			this.reUI();
			this.setCenter(45,-10);
		}
		game.funLib.extend(cTower,cTowerB);
		cTowerB.prototype.reUI=function(){
			var ctx=this.ctx;	
				ctx.save();
				ctx.fillStyle="green";
				ctx.beginPath();
				ctx.arc(this.width/2,this.height/2,this.width/2,0,2*Math.PI,false);
				ctx.closePath();
				ctx.stroke();
				ctx.fillRect(this.width/2-5,0,10,this.height);
				ctx.restore();
		}
				var bk=new background(120,45);
				var tA=new cTowerA(10,10);
				var tB=new cTowerB(10,10);
				var ML=new MyLocal(10,10);
					ML.click(function(){return false;});
					creatLayer.hide=1;
	return {
			turnOffTowerDiv:function(){
					creatLayer.hide=1;
					_toggleCheck(0);
			},
			turnOnTowerDiv:function(x,y){
					_toggleCheck(1);
					game.LayerFactory.setActiveLayer(creatLayer);
					creatLayer.hide=0;
					creatLayer.toTop();
					creatLayer.setCoord(x-30,y-30);
			}
	}
	
})();

var main=(function(){
	var _money=50,
		_moneyDiv,
		_fpsDiv;
	var _orderForm=[
		["gwB","gwA","gwA"],
		["gwB","gwB","gwB","gwA"],
		["gwB","gwA","gwB","gwB","gwA"],
		["gwB","gwB","gwB","gwA","gwB","gwA","gwA"],
		["gwB","gwA","gwB","gwB","gwA","gwA","gwB","gwA"],
		["gwB","gwA","gwB","gwA","gwA","gwB","gwA","gwA","gwA"],
		["gwB","gwB","gwA","gwB","gwA","gwB","gwB","gwA","gwA"],
		["gwB","gwB","gwA","gwB","gwA","gwB","gwB","gwA","gwA"],
		["gwB","gwB","gwA","gwB","gwA","gwB","gwB","gwA","gwA"],
	]
	monsterFactory.setOrderForm(_orderForm);
//game.Animation.setFrame("showFPS",function(data){main.showFPS(1000/data.useTime);});

	return {
		setDiv:function(json){
			_moneyDiv=json.moneyDiv;
			_fpsDiv=json.fpsDiv;
		},
		showFPS:function(no){
			_fpsDiv.text(no);
		},
		addMoney:function(value){
			_money+=value;
			_moneyDiv.text(_money);
		},
		getMoney:function(){
			return _money;
		},
		spendMoney:function(value){
			_money-=value;
			_moneyDiv.text(_money);
		}
	}
})();

var topBar=(function(){
	var ui=$("#topBar");
	return {
	
	}
})();
