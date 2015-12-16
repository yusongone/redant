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
        this._attr={};
    };
    R.Scene.Sprite.extend(Monster);

    /* overwrite */
    Monster.prototype.draw=function(_ctx){
        _ctx.beginPath();
        _ctx.rect(this.x-this.width/2,this.y-this.height/2,this.width,this.height);
        _ctx.closePath();
        _ctx.fillStyle=this._attr.background||"#ddd";
        _ctx.fill();
    };
    Monster.prototype.setAttr=function(key,val){
        this._attr[key]=val;
    }

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

            var m=new Monster(100,100,40,40,"a");
            m.setAttr("background","red");
            m.click(function(rEvent){
                rEvent.shutup();
                console.log(this.name);
            });

            R.Scene.on("click",function(rEvent){
                console.log("scene clicked");
                m.moveTo(rEvent.x,rEvent.y);
            });

            R.Animation.run();
        }
    }
})();
