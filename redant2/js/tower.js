var Page=window.Page||{};

function MAIN_FUNCTION(){

    R.Resource.addFile([
        {
            "type":"img"
            ,"name":"bomb"
            ,"url":"/img/bomb.png"
	    },
        {
            "type":"img"
            ,"name":"rebot"
            ,"url":"/img/rebot.png"
        }
    ]).load(function(progress,resource){
        //fire this function when evey resource loaded;
        console.log(progress,resource);
    },function(){
        _startAnimation();
        R.Resource.getImage("bomb");
    });

    function _startAnimation(){
        Page.MonsterFactory.init();
    }
};


/**
 * this model use to create and manege Monster;
 */

(function(){
    function Person(x,y,w,h){
        this.supper({
            x:x,
            y:y,
            width:w,
            height:h
        });
        this.bullet=new Bullet(x,y,10,10,this);
        var frame=new R.Animation.Frame(function(frameTime){
            var z=this.nextStepPosition(frameTime)
            this.x= z.x;
            this.y= z.y;
            var d=R.CommonTools.getSpaceBetweenDoubleCoord(this.x,this.y,this.lanchPosition.x,this.lanchPosition.y);
            if(d>this.scope){
                this.fire();
            }
        });
        this.bullet.setUpdateFrame(frame);
        this.bullet.hide();
    };
    R.Scene.Sprite.extend(Person);
    Person.prototype.draw=function(){
        var _ctx=this.ctx;
        _ctx.strokeStyle=this._attr.background||"#ddd";
        _ctx.save();
        _ctx.beginPath();
        _ctx.lineWidth=2;
        _ctx.arc(this.width/2,this.height/2,this.width/2-3,0,Math.PI*2);
        _ctx.closePath();
        _ctx.stroke();
        _ctx.restore();
        _ctx.beginPath();
        _ctx.moveTo(this.width/2,this.height/2);
        _ctx.lineWidth=5;
        _ctx.lineTo(this.width/2,0);
        _ctx.closePath();
        _ctx.stroke();
    };
    Person.prototype.setAttr=function(key,val){
        this._attr[key]=val;
        this.draw();
    };
    Person.prototype.fire=function(){
        this.bullet.fire();
        this.bullet.Frame.run();
    }







    function Monster(x,y,w,h,name){
        this.supper({
            x:x,
            y:y,
            width:w,
            height:h
        });
        this.name=name;
    };
    R.Scene.Sprite.extend(Monster);

    /* overwrite */
    Monster.prototype.draw=function(_ctx){
        var _ctx=this.ctx;
        _ctx.strokeStyle=this._attr.background||"#ddd";
        _ctx.save();
        _ctx.beginPath();
        _ctx.lineWidth=2;
        _ctx.arc(this.width/2,this.height/2,this.width/2-3,0,Math.PI*2);
        _ctx.closePath();
        _ctx.stroke();
        _ctx.restore();
        _ctx.beginPath();
        _ctx.moveTo(this.width/2,this.height/2);
        _ctx.lineWidth=5;
        _ctx.lineTo(this.width/2,0);
        _ctx.closePath();
        _ctx.stroke();
    };
    Monster.prototype.setAttr=function(key,val){
        this._attr[key]=val;
        this.draw();
    };

    function Bullet(x,y,w,h,Person){
        this.supper({
            x:x,
            y:y,
            width:w,
            height:h
        });
        this.scope=400;
        this.speed=100;
        this.Person=Person;
        this.lanchPosition={};
    };
    R.Scene.Sprite.extend(Bullet);
    Bullet.prototype.draw=function(){
        var _ctx=this.ctx;
        _ctx.fillStyle=this._attr.background||"#ddd";
        _ctx.save();
        _ctx.beginPath();
        _ctx.rect(this.width/2,this.height/2,this.width,this.height);
        _ctx.fill();
    }
    Bullet.prototype.fire=function(){
        this.show();
        this.x=this.Person.x;
        this.y=this.Person.y;
        this.lanchPosition.x=this.x;
        this.lanchPosition.y=this.y;
        this.faceDir=this.Person.faceDir;
        this.moveDir=this.faceDir;
        this.Frame.run();
    }

    Page.MonsterFactory={
        init:function(){
            R.Scene.init({
                "canvasBox":"page"
            });
            R.Animation.run();

            var mousePosition={};
            var keyboardDir=null;

            var updateHandler=new R.Animation.Frame(function(frameTime){
                var angle=R.CommonTools.getAngle(m2.x,m2.y,mousePosition.x,mousePosition.y);
                this.faceDir=angle;
                m2.moveDir=keyboardDir;
                var d=this.nextStepPosition(frameTime);
                this.x= d.x;
                this.y= d.y
            });
            var m2=new Person(120,120,40,40,"b");
            m2.setAttr("background","#999");
            m2.click(function(rEvent){
                rEvent.shutup();
                console.log(this.name);
            });
            m2.speed=200;
            m2.setUpdateFrame(updateHandler);

            var m=new Monster(300,300,40,40,"a");
            m.setAttr("background","#ddd");
            m.speed=80;
            var mHandler=new R.Animation.Frame(function(frameTime){
                var moveDir=R.CommonTools.getAngle(m.x,m.y,m2.x,m2.y);
                m.moveDir=moveDir;
                m.faceDir=moveDir;
                var d=this.nextStepPosition(frameTime);
                this.x= d.x;
                this.y= d.y;
            });
            m.setUpdateFrame(mHandler);
            mHandler.run();

            var i=0;
            R.Animation.bindFrameHandler(function(){
                if(R.CommonTools.checkHit(m2.bullet,m)||R.CommonTools.checkHit(m,m2.bullet)){
                    console.log("f---------------------------"+i);
                    i++;
                };
            })


            R.Scene.on("mousemove",function(rEvent){
                mousePosition.x=rEvent.x;
                mousePosition.y=rEvent.y;
            });

            R.Scene.on("click",function(){
                m2.fire();
            });

            var KEYBOARD_VALUE={ 87:1, 68:2, 83:4, 65:8 };
            var VALUE_CONFIG={1:0, 3:45, 2:90, 6:135, 4:180, 12:225, 8:270, 9:315 };

            R.Scene.on("keyChange",function(keyboard){
                if(keyboard.press.length==0){
                    updateHandler.stop();
                };
                var total=0;
                for(var i in KEYBOARD_VALUE){
                    if(keyboard.press[i]){
                       total+= KEYBOARD_VALUE[i];
                    };
                }
                var dir=VALUE_CONFIG[total];
                if(total>0&&dir!==undefined){
                    keyboardDir=dir;
                    updateHandler.run();
                }else{
                    updateHandler.stop();
                };
            });

        }
    }
})();
