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
    Monster.prototype.update=function(key,val){
        this.faceDir=this.moveDir;
    };
    Monster.prototype.setAttr=function(key,val){
        this._attr[key]=val;
        this.draw();
    };

    Page.MonsterFactory={
        init:function(){
            R.Scene.init({
                "canvasBox":"page"
            });

            var m2=new Monster(120,120,40,40,"b");
            m2.setAttr("background","green");
            m2.click(function(rEvent){
                rEvent.shutup();
                console.log(this.name);
            });
            m2.speed=50;

            var m=new Monster(100,100,40,40,"a");
            m.setAttr("background","red");
            m.click(function(rEvent){
                rEvent.shutup();
                console.log(this.name);
            });

            R.Scene.on("click",function(rEvent){
                console.log("scene clicked");
                m.moveTo(rEvent);
                m2.moveTo(m);
            });

            R.Animation.run();
        }
    }
})();
