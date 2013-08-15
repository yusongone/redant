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

var main=(function(){
	var towerBar=(function(){
		var layer=game.LayerFactory.createLayer();
		var sprite=game.SpriteFactory.getSpriteEntity();
		function towerA(width,height){
			sprite.call(this,width,height);	
		}
		game.funLib.extend(sprite,towerA);
		towerA.prototype.rewriteUI=function(){
			var ctx=this.ctx;
				ctx.save();
				ctx.fillStyle="red";
				ctx.fillRect(0,0,50,50);
				ctx.restore();
		};
		towerA.prototype.getSome=function(){
			
		};
		return{
			"create":function(){
		var ta=new towerA(50,50);
			ta.rewriteUI();
			ta.setCenter(0,0);
			layer.append(ta);
			layer.setCoord(100,50);
			ta.click(function(){
				alert("d");
			});
			}
		}
	})();

	return {
		init:function(){
		var towerA=towerBar.create();
		}
	}	
})();


function init(){
		game.config({
			"canvasWidth":480
			,"canvasHeight":320
		});
		game.appendTo(document.getElementById("box"));

	var map=[
		{x:15.5,y:135.5},
		{x:165.5,y:135.5},
		{x:165.5,y:195.5},
		{x:375.5,y:195.5},
		{x:375.5,y:75.5},
		{x:465.5,y:75.5},
		{x:15.5,y:75.5}
		];


	var layerBackground=game.LayerFactory.createLayer();
		layerBackground.setCoord(240,160);
	var sprite=game.SpriteFactory.getSpriteEntity();
		var b=new sprite(480,320);
			for(var i=1;i<27;i++){
				b.ctx.save();
				b.ctx.strokeStyle="#ddd";
				b.ctx.moveTo(0.5+i*30,0);
				b.ctx.lineTo(0.5+i*30,320);
			}
			for(var i=1;i<11;i++){
				b.ctx.moveTo(0,0.5+i*30);
				b.ctx.lineTo(480,0.5+i*30);
				b.ctx.stroke();
				b.ctx.restore();
			}
		layerBackground.append(b);
		$("body").click(function(){
			game.Progress.start();	
		});	


	var runA=game.LayerFactory.createLayer();
		runA.setCoord(0,0);

		var gw=new sprite(30,30);
			gw.setCenter(map[0].x,map[0].y);
			(function(){
				var ctx=gw.ctx;
				ctx.save();
				ctx.fillStyle="red";
				ctx.fillRect(0,0,30,30);
				ctx.restore();
			})();
			gw.speed=50;
			var i=1;
		function goto(x,y){
			gw.moveTo(x,y,function(){
				i++;
				if(i==map.length){i=0};
				goto(map[i].x,map[i].y);
			});
		};
		goto(map[1].x,map[1].y);
		runA.append(gw);

		var tf=new sprite(30,30);
			tf.setCenter(255.5,135.5);
			(function(){
				var ctx=tf.ctx;
				ctx.save();
				ctx.fillStyle="yellow";
				ctx.fillRect(0,0,30,30);
				ctx.restore();
			})();

			game.Animation.setFrame(tf.name+"angle",function(){
				tf.angle=game.funLib.getAngle(tf.offsetX,tf.offsetY,gw.offsetX,gw.offsetY);
			});
			game.Animation.setFrame(tf.name+"fire",function(){
	var bul=new sprite(10,20);
		bul.angle=tf.angle;
		bul.speed=100;
		bul.setCenter(tf.centerX,tf.centerY);
		bul.followTo(gw,function(){
				this.distroy();
		});
		runA.append(bul);
			},3000);
		runA.append(tf);
			
}



//
	function initt(){
		game.config({
			"canvasWidth":480
			,"canvasHeight":320
		});
		game.appendTo(document.getElementById("box"));
	var sprite=game.SpriteFactory.getSpriteEntity();
		//some event
		var t;
		$("body").click(function(){
			game.Progress.start();	
		});	
	var l1=game.LayerFactory.createLayer("button");
	var Tank=new sprite(40,40);	
		Tank.angle=90;
		Tank.speed=0.3;
		l1.setCoord(10,0);
		l1.append(Tank);
		Tank.setCenter(10,100);
		var ttt=0;
		var left=0;
		game.Animation.setFrame("test",function(){
			l1.toTop();
		},5000);
		game.Animation.setFrame("dd",function(){
			l1.setCoord(10,left++);
			if(left==4){
			}
		},30);
	var Tank2=new sprite(30,30);	
		Tank2.setCenter(300,100);
		var width=30;
		Tank2.ctx.fillRect(0,0,width,30);
		Tank2.sub=function(){
			Tank2.ctx.clearRect(0,0,30,30);
			Tank2.ctx.fillRect(0,0,width--,30);
		}
		Tank2.click(function(){
			alert("tank2");
		});
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
				that.setCenter(d.x,d.y);	
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


