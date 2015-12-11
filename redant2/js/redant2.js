(function(factory){
    if(typeof(define)==="Function"){
        define(factory);
    }else{
        window.R=window.R||{};
        factory(window.R);
    }
})(function(_page){
    !_page?_page={}:"";

    _page.Animation=(function(){
        var _handlerList=[];
        var _Event={
            _call:function(action,arg){
                if(_Event[action]){
                    for(var i in _Event[action]){
                        _Event[action][i].apply(this,arg);
                    }
                }
            }
        };
        function _getFrame(){
            for(var i= 0,l=_handlerList.length;i<l;i++){
                _handlerList[i]();
            }
            window.requestAnimationFrame(function(){
                _getFrame();
            });
        }

        return {
            run:function(){
                _getFrame();
                _Event._call("run")
            },
            on:function(action,handler){
                if(!_Event[action]){
                    _Event[action]=[];
                };
                _Event[action].push(handler)
            },
            onFrame:function(handler){
                _handlerList.push(handler);
            }
        }
    })();


    _page.Scene=(function(){
        var _SpriteList=[];
        var _ctx=null;


        function _Sprite(){
            this._child=[];
        }
        _Sprite.prototype.test=function(child){
            alert(this.name+"abcd");
        };
        _Sprite.prototype.supper=function(childSprite){
            _Sprite();
            _SpriteList.push(this);
        };
        _Sprite.prototype.addChild=function(childSprite){
            this._child.push(childSprite);
        };
        _Sprite.prototype.moveTo=function(){

        }

        _Sprite.extend=function(child){
            child.extend=this;
            var temp=function(){};
                temp.constructor=child.constructor;
                temp.prototype=_Sprite.prototype;
                child.prototype=new temp();
        };

        _page.Animation.on("run",function(){
            if(!_ctx){
                throw Error("need init Scene;");
            }
        });

        _page.Animation.onFrame(function(){
            for(var i= 0,l=_SpriteList.length;i<l;i++){
                _SpriteList[i].draw(_ctx);
            }
        })

        function _init(json){
            var canvas=document.createElement("canvas");
            document.getElementById(json.canvasBox).appendChild(canvas);
            _ctx=canvas.getContext("2d");
        };


        return{
            Sprite:_Sprite,
            init:_init
        }
    })();

    _page.Resource=(function(){
        var _totalResourceCount=0;
        var _loadedCount=0;
        var _loadedComplateCallback=null;
        var fileJson={};


        function _checkLoadComplate(){
            if(_loadedCount==_totalResourceCount&&_loadedCount!=0){
                _loadedComplateCallback?_loadedComplateCallback():"";
            }
        };

        //create img by load date  and  cache it;
        function _createImage(tempJson,handler){
            var img=document.createElement("img");
            img.src=tempJson.url;
            img.onload=function(){
                tempJson.obj=img;
                _loadedCount++;
                var progress=(_loadedCount/_totalResourceCount).toFixed(1);
                handler(progress,tempJson);
                _checkLoadComplate();
            };
        };

        //create sound by load date  and cache it;
        function _createSound(tempJson){
            var request=new XMLHttpRequest();
            request.open("GET",tempJson.url,true);
            request.responseType = 'arraybuffer';
            request.onload=function(buffer){
                game.AudioContext.decodeAudioData(request.response, function(buffer) {
                    tempJson.obj=buffer;
                });
            };
            request.send();
        };

        return {
            //add some files in loader
            addFile:function(Ary){
                _totalResourceCount=Ary.length;
                for(var i=0,l=Ary.length;i<l;i++){
                    var tempObj=Ary[i];
                    var tempName={};
                    tempName[tempObj.name]=tempObj;
                    if(!fileJson[tempObj.type]){
                        fileJson[tempObj.type]=[];
                    };
                    fileJson[tempObj.type].push(tempObj);
                };
                return this;
            },


            //go to load
            load:function(frameFun,complate){
                _loadedComplateCallback=complate;
                var imgJson=fileJson.img||[],
                    soundJson=fileJson.sound||[];
                for(var i=0;i<imgJson.length;i++){
                    _createImage(imgJson[i],frameFun);
                }
                for(var i=0;i<soundJson.length;i++){
                    _createSound(soundJson[i],frameFun);
                }
            },

            //return img object of game cache;
            getImage:function(name){
                var imgAry=fileJson["img"];
                if(imgAry){
                    for(var i=0;i<imgAry.length;i++){
                        if(imgAry[i].name==name){
                            return imgAry[i].obj;
                        }
                    }
                }
            },

            //return sound object of game cache;
            getSoundBuffer:function(name){
                var sd=fileJson["sound"];
                if(sd){
                    for(var i=0;i<sd.length;i++){
                        if(sd[i].name==name){
                            return sd[i].obj;
                        }
                    }
                }
            }
        }

    })();

    return _page;
});