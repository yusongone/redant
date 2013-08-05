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
						var stage=SG.createStage("song");
							SG.changeStage(stage);
							var t=new Tank(stage,200,200);
							stage.addSpirit(t);
							window.t=t;
							t.click(function(){
							});
							stage.bindEvent("click",function(evt){
							//	gz();
								t.faceTo(evt.x,evt.y);
								t.moveTo(evt.x,evt.y,2);
								t.fire({"x":evt.x,"y":evt.y},[t1,t2,t3,t4]);
								return false;
							});
							var t1=new Tank(stage,0,0);
							var t2=new Tank(stage,400,1);
							var t3=new Tank(stage,400,400);
							var t4=new Tank(stage,1,400);
							t1.addFrameFun("fire",function(){
								t1.fire({x:t.localX,y:t.localY});//发射子弹需要目标坐标，这里需要计算；
							},100);
							t4.addFrameFun("fire",function(){
								t4.fire({x:t.localX,y:t.localY});//发射子弹需要目标坐标，这里需要计算；
							},100);
							gz(t1);
							gz(t2);
							gz(t3);
							gz(t4);
								function gz(obj){
										obj.addFrameFun("c",function(){
											this.faceTo(t.localX,t.localY);
											var that=this;
											this.moveTo(t.localX,t.localY,1,function(){
													obj.removeFrameFun("c");
											});
										});
								};
							bindEvent(t);
					});
			}
//子弹
					function zd(stage){
						this.stage=stage;
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
//坦克
					function Tank(stage,x,y){
						this.name=SG.getRandom();
						this.stage=stage;
						this.width=30;
						this.height=30;
						this.setLocal(x,y);
						SG.getSpirit().call(this,stage);
					};
					SG.extendSpirit(Tank);
					Tank.prototype.fire=function(json,Ary){
						var that=this;
						this.zd=new zd(this.stage);
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
					Tank.prototype.init=function(json){
							var drawdata={};
							this.state="run";
							this.setDraw("walk",{
								img:SG.Image.people,
								offsetX:30,
								offsetY:10,
								singleWidth:47,
								singleHeight:85,
								imgCount:5,
								delay:9
							});
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
							this.setDraw("jump",{
								img:SG.Image.lb,
								offsetX:30,
								offsetY:10,
								singleWidth:47,
								singleHeight:85,
								imgCount:5,
								delay:9
							});
					}
								
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

			
