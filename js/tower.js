var SG=pagePrivate.SongGame;
	function init(){
		var imgData={
			"people":"/image/people.jpg"
			,"lb":"/image/lb.jpg"
		}
	SG.config({
		"box":document.getElementById("box")
	});
	SG.loadImg(imgData,function(){
		gameMain.begin();
	});
	};
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

			
