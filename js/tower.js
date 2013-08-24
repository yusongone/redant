game.File.addFile([
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



function init(){
		$("#box").click(function(){
			game.Progress.start();	
		});	
		game.config({
			"canvasWidth":480
			,"canvasHeight":320
		});
		game.appendTo(document.getElementById("box"));

		monsterFactory.createSomeMonster(["gwA","gwB","gwA","gwB"]);
		monsterFactory.layer.toTop();
		return false;
};
var path=(function(){
	var _layer=game.LayerFactory.createLayer();
	var sprite=game.SpriteFactory.getSpriteEntity();
	var _map=[
		{x:15.5,y:135.5},
		{x:165.5,y:135.5},
		{x:165.5,y:195.5},
		{x:375.5,y:195.5},
		{x:375.5,y:75.5},
		{x:465.5,y:75.5},
		];
		
	var layerBackground=game.LayerFactory.createLayer();
		layerBackground.setCoord(240,160);
	var sprite=game.SpriteFactory.getSpriteEntity();
		var back=new sprite(480,320);
			var ctx=back.ctx;
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
				ctx.stroke();
				ctx.restore();
		layerBackground.append(back);
		var Path=new sprite(480,320);
			var ctx=Path.ctx;
				ctx.lineWidth=30;
				ctx.strokeStyle="#ddd"
				ctx.moveTo(_map[0].x,_map[0].y);
			for(var i=1,l=_map.length;i<l;i++){
				ctx.lineTo(_map[i].x,_map[i].y);
			}
				ctx.stroke();
		layerBackground.append(Path);

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

		var length=_map.length;

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
			ctx.fillRect(0,0,w,this.height);
		};
		var jg;
		function createExit(){
				jg=new sprite(30,30);				
				jg.turn(3);
				var tempX=_map[length-1].x;
				var tempY=_map[length-1].y;
				jg.setCenter(tempX,tempY);
				_layer.append(jg);
				jg.life=new Life(20,5);
				jg.life.setCenter(tempX,tempY-25);
				_layer.append(jg.life);
		};
		createExit();
	return {
		exitObj:jg,
		layer:_layer,
		map:_map,
		checkInPath:function(x,y){
			var re=_checkInPath(0,x,y);		
			return re;
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
				ctx.fillRect(0,0,30,5);
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
			ctx.fillRect(0,0,w,this.height);
		};


		function gw(width,height){
			sprite.call(this,width,height);	
			this.mapIndex=0;
			monsterLayer.append(this);
			this.createLife();
			this.reUI();
		}
		game.funLib.extend(sprite,gw);
		gw.prototype.injure=function(num){
			this.life.sub(num);
			if(!(this.life.quantity>0)){
				this.stop();
				main.addMoney(this.money);
				_distroyMonster(this);
			};
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
		};
		gw.prototype.createLife=function(){
			var life=new Life(this.width,5);
				life.value=this.lifeValue;
				life.setCenter(this.offsetX,this.offsetY-20);
			monsterLayer.append(life);
			this.life=life;
			this.addFrameFun("updateLifeCoord",function(){
				life.setCenter(this.offsetX,this.offsetY-15);
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
				var ctx=this.ctx;
				ctx.save();
				ctx.fillStyle="#eee";
				ctx.fillRect(0,0,this.width,this.height);
				ctx.strokeStyle="red";
				ctx.strokeRect(this.width/2,0,2,2);
				ctx.restore();
		};
		//gwB
		function gwB(width,height){
			this.lifeValue=1000;
			gw.call(this,width,height);	
			this.speed=70;
			this.money=10;
		}
		game.funLib.extend(gw,gwB);
		gwB.prototype.reUI=function(){
			var os=30;
			var that=this;
			this.setImageData("run",{
				img:game.File.getImage("monkey"),
				data:[
					{x:0+os,y:0,width:30,height:60},
					{x:30+os,y:10,width:30,height:60}
				]
			});
				var ctx=this.ctx;
				var i=0;
			this.setFrame("run",function(){
				i==2?i=0:"";
				ctx.clearRect(0,0,that.width,that.height);	
				ctx.drawImage(that.canvasList["run"][i++],0,0,30,30,0,0,30,30);
			},100);
			return false;
				var ctx=this.ctx;
				ctx.save();
				ctx.fillStyle="blue";
				ctx.fillRect(0,0,30,30);
				ctx.restore();
		};



		function _distroyMonster(obj){
			var d=game.funLib.selectArrayByObj(_monsterList,obj,function(index){
				_monsterList.splice(index,1);	
				obj.distroy();
				obj.life.distroy();
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
				var gw=new GA(20,20);
				_monsterList.push(gw);
				gw.setCenter(map[0].x,map[0].y);
				gw.goTo();
				i++;
				//path.goto(map[1].x,map[1].y,gw,1);
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

		function bul(width,height){
			sprite.call(this,width,height);
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
			});
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
					if(space<that.hitSpace){
						that.hitGoal=tempM;
						that.faceTo(tempM);
						return;
					}
				};	
				that.hitGoal=null;
			};	
			this.addFrameFun("tour",tour);
		};
		//发射
		tower.prototype.fire=function(){
			var that=this;
			game.Animation.setFrame(this.name+"fire",function(){
				var hitGoal=that.hitGoal;
				if(hitGoal&&that.bul.ready){
					that.bul.follow(hitGoal,that);
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
			this.setCenter(x,y);
			this.hitSpace=100;
			this.hitGoal=null;
			this.tour();
			this.initBul(new bul1());
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
			this.setCenter(x,y);
			this.hitSpace=100;
			this.hitGoal=null;
			this.tour();
			this.initBul(new bul2());
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
				var tA=new tw(x,y);
					layer.append(tA);
					tA.click(function(){
						return false;
					});
			}	
		}
})();

var eventMange=(function(){
	game.click(function(x,y){
		var cx=((x/30)>>0)*30+15;
		var cy=((y/30)>>0)*30+15;
		if(path.checkInPath(cx,cy)){
			return false;
		};
		towerCreateDiv.toggleTowerDiv(cx,cy);
	});	
})();

var towerCreateDiv=(function(){
	var creatLayer=game.LayerFactory.createLayer();
	var sprite=game.SpriteFactory.getSpriteEntity();
	var _show=0;
		function background(width,height){
			sprite.call(this,width,height);
			this.reUI();
		}
		game.funLib.extend(sprite,background);
		background.prototype.reUI=function(){
			var ctx=this.ctx;
				ctx.save();
				ctx.fillStyle="#ddd";
				ctx.fillRect(0,0,this.width,this.height);
				ctx.stroke();
				ctx.restore();
		}

		function MyLocal(){
			sprite.call(this);
			this.reUI();
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
		function tower(){
			sprite.call(this,40,40);
			this.bindEvent();	
		};
		game.funLib.extend(sprite,tower);
		tower.prototype.bindEvent=function(){
			var that=this;
			this.click(function(){
						var cx=creatLayer.coordX;
						var cy=creatLayer.coordY;
						towerFactory.getTower(cx+30,cy+30,that.type);
						towerCreateDiv.toggleTowerDiv();
						return false;
			});
		};
		function towerA(){
			tower.call(this);
			this.pay=10;
			this.type="towerA"
			this.reUI();
		}
		game.funLib.extend(tower,towerA);
		tower.prototype.reUI=function(){
			var ctx=this.ctx;	
				ctx.save();
				ctx.fillStyle="red";
				ctx.arc(this.width/2,this.height/2,this.width/2,0,2*Math.PI,false);
				ctx.fillRect(this.width/2-5,0,10,this.height);
				ctx.stroke();
				ctx.restore();
		}
		function towerB(){
			tower.call(this,40,40);
			this.pay=10;
			this.type="towerB"
			this.reUI();
		}
		game.funLib.extend(tower,towerB);
		towerB.prototype.reUI=function(){
			var ctx=this.ctx;	
				ctx.save();
				ctx.fillStyle="green";
				ctx.arc(this.width/2,this.height/2,this.width/2,0,2*Math.PI,false);
				ctx.fillRect(this.width/2-5,0,10,this.height);
				ctx.stroke();
				ctx.restore();
		}
				var bk=new background(120,45);
				var tA=new towerA(10,10);
				var tB=new towerB(10,10);
				var ML=new MyLocal(10,10);
					ML.click(function(){return false;});
					creatLayer.append(bk);
					creatLayer.append(tA);
					creatLayer.append(tB);
					creatLayer.append(ML);
					bk.setCenter(30,-10);
					ML.setCenter(30,30);
					tA.setCenter(0,-10);
					tB.setCenter(45,-10);
					creatLayer.hide=1;
	return {
			toggleTowerDiv:function(x,y){
				if(_show){
					//creatLayer.clearLayer();
					creatLayer.hide=1;
					_show=0;
				}else{
					_show=1;
					creatLayer.hide=0;
					creatLayer.toTop();
					creatLayer.setCoord(x-30,y-30);
				}
			}
	}
	
})();

var main=(function(){
	var _money=50;
	var _orderForm=[
		["gwB"],
		["gwA","gwA","gwA"],
		["gwB","gwB","gwA"],
		["gwA","gwB","gwB","gwA"],
		["gwB","gwB","gwB","gwA","gwA","gwA"],
		["gwB","gwB","gwB","gwA","gwA","gwA"],
		["gwB","gwB","gwB","gwA","gwA","gwA"],
		["gwB","gwB","gwB","gwA","gwA","gwA"],
		["gwB","gwB","gwB","gwA","gwA","gwA"],
		["gwB","gwB","gwB","gwA","gwA","gwA"]
	]
	monsterFactory.setOrderForm(_orderForm);

	return {
		addMoney:function(value){
	var moneyDiv=$("#money");	
			_money+=value;
			moneyDiv.text(_money);
		},
		checkMoney:function(){
			return _money;
		},
		spendMoney:function(value){
			_money-=value;
			moneyDiv.text(_money);
		}
	}
})();

var topBar=(function(){
	var ui=$("#topBar");
	return {
	
	}
})();
