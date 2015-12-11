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
    function Monster(name){
        this.supper();
        this.name=name;
        this.x=0;
        this.y=0;
    };
    R.Scene.Sprite.extend(Monster);


    Monster.prototype.update=function(timestamp){

    };

    /* overwrite */
    Monster.prototype.draw=function(_ctx){
        _ctx.beginPath();
        _ctx.rect(1,1,10,10);
        _ctx.closePath();
        _ctx.stroke();
    };




    Page.MonsterFactory={
        init:function(){
            R.Scene.init({
                "canvasBox":"page"
            });

            var m=new Monster(1);
            m.moveTo(10,10,100);


            R.Animation.run();
        }

    }
})();
