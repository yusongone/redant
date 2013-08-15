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
		game.config({
			"canvasWidth":"500"
			,"canvasHeight":"500"
		});
		game.appendTo(document.getElementById("box"));
	var sprite=game.SpriteFactory.getSpriteEntity();
		//some event
		var t;
		$("body").click(function(){
			game.Progress.start();	
		});	
		/*
	var Tank=new sprite(100,10);	
		Tank.setCenter(100,100);
		Tank.setFrame("zd",function(){
			this.angle+=6;
			if(this.angle==360){
				var at=(new Date()).getTime();
				alert(at-t);
			}
		},1000);
		return false;
		*/
	//var s=new sprite(45,80);	
	var l1=game.LayerFactory.createLayer("button");
	var Tank=new sprite(40,40);	
		Tank.angle=90;
		Tank.speed=0.3;
		l1.setCoord(40,left++);
		l1.append(Tank);
		Tank.setCenter(10,100);
		var ttt=0;
		var left=0;
		game.Animation.setFrame("test",function(){
			l1.toTop();
		},5000);
		game.Animation.setFrame("dd",function(){
		//	l1.setCoord(10,left++);
			if(left==4){
			}
		},500);
	var Tank2=new sprite(30,30);	
		Tank2.setCenter(300,100);
		var width=30;
		Tank2.ctx.fillRect(0,0,width,30);
		Tank2.sub=function(){
			Tank2.ctx.clearRect(0,0,30,30);
			Tank2.ctx.fillRect(0,0,width--,30);
		}
		Tank.click(function(){
			alert("tank");
		});
		l1.append(Tank2);
	var bul=new sprite(20,20);
		bul.angle=Tank.angle;
		bul.speed=1000;
		l1.append(bul);
		bul.click(function(){
			alert("bul");
		});
		bul.setCenter(Tank.centerX,Tank.centerY);
		game.Animation.setFrame(bul.name+"moveTo",function(data){
				var that=bul;
			var d=that.nextLocal(data.useTime);
			//	that.setCenter(d.x,d.y);	
			function temp(hittedSprite){
				hittedSprite.sub();
				that.setCenter(Tank.centerX,Tank.centerY);
				//bul.removeFrame("moveTo");
			}
			that.checkHit({"tank":Tank2},temp);
		});
	var l2=game.LayerFactory.createLayer("button");
	var test=new sprite(50,50);
		test.setCenter(100,100);
		test.ctx.fillStyle="yellow";
		test.ctx.fillRect(0,0,50,50);
		l2.append(test);
		test.click(function(){alert()});

	};
/*
//子弹
var gameMain=(function(){
		var Tank=(function(){
			function tank(stage,x,y){
				this.name=SG.getRandom();
				this.stage=stage;
				this.width=30;
				this.height=30;
				this.setLocal(x,y);
				this.life=new Life(stage);
				var that=this;
				this.life.addFrameFun("chageLocal",function(){
					this.setLocal(that.localX,that.localY-18);
				});
				SG.getSpirit().call(this,stage);
				};
			SG.extendSpirit(tank);
			tank.prototype.setPath=function(Ary){
				this.pathAry=Ary;
			};
			tank.prototype.leave=function(){
				var that=this;
				function go(index){
					var x=that.pathAry[index].x;
					var y=that.pathAry[index].y;
					that.faceTo(x,y);
					that.moveTo(x,y,1,function(){
							if(index==5){
									index=-1;
								that.setLocal(0,100);
							};
						go(++index);	
					});
				}
				go(0);
			};
			tank.prototype.fire=function(json,Ary){
				var that=this;
				this.zd=new Bullet(this.stage);
				this.zd.addFrameFun("c",function(){
						this.checkHit(Ary,function(tt){
							this.setLocal();	
							this.distroy();
							tt.distroy();
							return false;
							//tt.moveTo(that.localX,that.localY);
						});
					});
				this.zd.setLocal(this.localX+0.5,this.localY+0.5);
				var that=this;
				this.zd.moveTo(json.x,json.y,20,function(){
					delete that.zd;
					this.distroy();
				});
			};
			tank.prototype.init=function(json){
					var drawdata={};
					this.state="run";
					var can=document.createElement("canvas");	
					var ctx=can.getContext("2d");
						ctx.beginPath();
						ctx.lineWidth=2;
						ctx.translate(15,15);
						ctx.strokeStyle="blue";
						ctx.arc(0,0,10,0,2*Math.PI,false);
						ctx.closePath();
						ctx.stroke();
						ctx.beginPath();
						ctx.strokeStyle="red";
						ctx.arc(30,0,10,0,2*Math.PI,false);
						ctx.moveTo(0,0);;
						ctx.lineTo(0,-15);
						ctx.closePath();
						ctx.stroke();
					this.setDraw("run",{
						img:can,
						offsetX:0,
						offsetY:0,
						singleWidth:30,
						singleHeight:30,
						imgCount:2,
						delay:10
					});
			}
		return tank;
		})();
		var Bullet=(function(){
					function zd(stage){
						this.width=10;
						this.height=10;
						SG.getSpirit().call(this,stage);
					}
					SG.extendSpirit(zd);
					zd.prototype.init=function(){
							this.state="run";
							var that=this;
							var can=document.createElement("canvas");	
							var ctx=can.getContext("2d");
								ctx.fillStyle="red";
								ctx.arc(5,5,5,0,2*Math.PI,false);
								ctx.fill();
							this.setDraw("run",{
								img:can,
								offsetX:0,
								offsetY:0,
								singleWidth:20,
								singleHeight:20,
								imgCount:1,
								delay:3
							});
					};
					return zd;
		})();

		var Life=(function(){
			function life(stage){
						this.width=20;
						this.height=10;
				SG.getSpirit().call(this,stage);
			}
			SG.extendSpirit(life);
			life.prototype.init=function(){
				this.state="run";
							var that=this;
							var can=document.createElement("canvas");	
							var ctx=can.getContext("2d");
								ctx.fillStyle="red";
								ctx.fillRect(0,0,100,6);
								ctx.fill();
							this.setDraw("run",{
								img:can,
								offsetX:0,
								offsetY:0,
								singleWidth:20,
								singleHeight:20,
								imgCount:1,
								delay:3
							});
					
			};
			life.prototype.changeValue=function(){

			};
			return life;
		})();
		
		var Map=(function(){
			var localAry=[
				{x:0,y:100},
				{x:100,y:100},
				{x:100,y:400},
				{x:400,y:400},
				{x:400,y:100},
				{x:600,y:100}
				]
			return {
				getMap:function(){
					return localAry;
				}
			}	
		})();

		return {
			"begin":function(){
		var stage=SG.createStage("song");
			SG.changeStage(stage);
			var t=new Tank(stage,1,100);
				t.setPath(Map.getMap());
				t.leave();
			var tt=new Tank(stage,250,250);
				tt.addFrameFun("faceTo",function(){
					tt.faceTo(t.localX,t.localY);
				});
				tt.addFrameFun("fire",function(){
					tt.fire({x:t.localX,y:t.localY});
				},60);
			stage.bindEvent("click",function(evt){
				t.faceTo(evt.x,evt.y);
				t.moveTo(evt.x,evt.y,1);
				return false;
			});
			
			}
		}
})();
//坦克
								
			function bindEvent(t){
				document.addEventListener("keydown",function(event){
						if(event.keyCode==32){
						}else if(event.keyCode==39){
							t.state="walk";
						}else if(event.keyCode==37){
							var canva=t.stage.canva;
							canva.webkitRequestFullScreen();
						};
						switch(event.keyCode){
								case 87://W
									t.localY-=2;
									t.setLocal();
								break;
								case 65://A
									t.localX-=2;
									t.setLocal();
								break;
								case 83://s
									t.localY+=2;
									t.setLocal();
								break;
								case 68://D
									t.localX+=2;
									t.setLocal();
								break;
						}
				});
			}

*/			
