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
            _fire:function(action,arg){
                if(_Event[action]){
                    for(var i in _Event[action]){
                        _Event[action][i].apply(this,arg);
                    }
                }
            }
        };
        var _oldtime= (new Date()).getTime();



        function _getFrame(){
            var _now= (new Date()).getTime();
            _Event._fire("frameStart");
            for(var i= 0,l=_handlerList.length;i<l;i++){
                _handlerList[i]?_handlerList[i](_now-_oldtime):"";
            }
            _Event._fire("frameEnd");
            _oldtime= _now;

            window.requestAnimationFrame(function(){
                _getFrame();
            });
        }

        return {
            run:function(){
                _getFrame();
                _Event._fire("run")
            },
            on:function(action,handler){
                if(!_Event[action]){
                    _Event[action]=[];
                };
                _Event[action].push(handler)
            },
            bindFrameHandler:function(handler){
                _handlerList.push(handler);
            },
            removeFrameHandler:function(handler){
                for(var i= 0,l=_handlerList.length;i<l;i++){
                    if(_handlerList[i]==handler){
                        _handlerList.splice(i,1);
                       return;
                    };
                }
            }
        }
    })();


    _page.Scene=(function(){
        var _SpriteList=[];
        var _ctx=null;
        var _canvas=null;
        var _scale={x:1,y:1};


        //
        var _Event={
            _fire:function(action,arg){
                if(_Event[action]){
                    for(var i in _Event[action]){
                        _Event[action][i].apply(this,arg);
                    }
                }
            }
        };



        // Sprite private funciton
        function _nextPosition(usedTime){
            var self=this;
            var al=Math.PI*2*(self.moveDir/360);
            var x=Math.sin(al)*self.speed*usedTime/1000;
            var y=-Math.cos(al)*self.speed*usedTime/1000;
            return {"x":self.x+x,"y":self.y+y}
        };
        function _isPassCoord(x,y){
            var self=this;
            var ox=self.x,oy=self.y,px=self.oldX,py=self.oldY;
            var Vx=(ox-x)*(px-x)<0;
            var Vy=(oy-y)*(py-y)<0;
            var inC=(oy-py)==oy-y&&(ox-px)==ox-x;
            if(Vx||Vy||inC){
                return true;
            };
            return false;
        }
        function _createSpriteCanvas(){
            var self=this;
            var tempCanvas=document.createElement("canvas");
            tempCanvas.width=this.width;
            tempCanvas.height=this.height;
            self.canvas=tempCanvas;
            self.ctx=tempCanvas.getContext("2d");
        }

        /*
         * Sprite base object
         */
        function _Sprite(){
            var self=this;
            self._child=[];
        }
        _Sprite.prototype.test=function(child){
            alert(this.name+"abcd");
        };
        _Sprite.prototype.supper=function(option){
            _Sprite();
            var self=this;
            self.x=option.x;
            self.y=option.y;
            self.width=option.width;
            self.height=option.height;
            this._attr={};
            self.speed=300;
            self.moveDir=0;
            self.faceDir=0;
            _createSpriteCanvas.call(this);
            var _handlers={
                _fire:function(action,arg){
                    if(_handlers[action]){
                        for(var i= 0,l=_handlers[action].length;i<l;i++){
                            _handlers[action][i].apply(self,arg);
                        }
                    }
                }
            };
            self._handlers=_handlers;
            self._moveHandler=null;
            _SpriteList.push(self);
            self.draw();
        };
        _Sprite.prototype.addChild=function(childSprite){
            this._child.push(childSprite);
        };
        _Sprite.prototype.moveTo=function(target){
            var self=this;
            self._moveHandler?R.Animation.removeFrameHandler(self._moveHandler):"";
            self._moveHandler=function(useTime){
                var x=target.x,y=target.y;
                self.moveDir=R.commonTools.getAngle(self.x,self.y,x,y);
                var d=_nextPosition.call(self,useTime);
                self.oldX=self.x;
                self.oldY=self.y;
                self.x= d.x;
                self.y= d.y;
                if(_isPassCoord.call(self,x,y)){
                    R.Animation.removeFrameHandler(self._moveHandler)
                    self._moveHandler=null;
                    self.x= x;
                    self.y= y;
                    self.oldX=self.x;
                    self.oldY=self.y;
                }
                return;
            }
            R.Animation.bindFrameHandler(self._moveHandler);
        };
        _Sprite.prototype.fire=function(action,arg){
            this._handlers._fire(action,arg);
        };
        _Sprite.prototype.on=function(action,handler){
            if(!this._handlers[action]){
                this._handlers[action]=[];
            }
            this._handlers[action].push(handler);
        };
        _Sprite.prototype.click=function(handler){
            this.on("click",handler);
        };
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

        _page.Animation.on("frameStart",function(){
            _ctx.clearRect(0,0,_canvas.width,_canvas.height);
        });

        _page.Animation.bindFrameHandler(function(useTime){
            for(var i= 0,l=_SpriteList.length;i<l;i++){
                var sp= _SpriteList[i];
                    sp.update&&typeof(sp.update)=="function"?sp.update():"";
                _ctx.save();
                _ctx.translate(sp.x,sp.y);
                _ctx.rotate(Math.PI*2/360*sp.faceDir);
                _ctx.translate(-sp.x,-sp.y);
                _ctx.drawImage(sp.canvas,sp.x-sp.width/2,sp.y-sp.height/2,sp.width,sp.height);
                _ctx.restore();
            }
        });

        function _init(json){
            _canvas=document.createElement("canvas");
            document.getElementById(json.canvasBox).appendChild(_canvas);

            var _height=window.innerHeight;
            var _width=window.innerWidth;
            _canvas.width=_width;
            _canvas.height=_height;

            _ctx=_canvas.getContext("2d");
            _reParseMapScale();
            _bindEvent();
        };

        function _getMapVisualSize(){
            return {
                width:_canvas.clientWidth,
                height:_canvas.clientHeight
            }
        };

        function _getMapNatrueSize(){
            return{
                width:_canvas.width,
                height:_canvas.height
            }
        };

        function _reParseMapScale(){
            var _x=_getMapVisualSize().width/_getMapNatrueSize().width;
            var _y=_getMapVisualSize().height/_getMapNatrueSize().height;
            _scale.x=_x;
            _scale.y=_y;
        }

        function _toNatrueCoord(_x,_y){
            return {
                x:_x/_scale.x,
                y:_y/_scale.y
            }
        };

        function _checkOver(coord,Sprite){
            if(2*Math.abs(coord.x-Sprite.x)<Sprite.width&&2*Math.abs(coord.y-Sprite.y)<Sprite.height){
                return true;
            }else{
                return false;
            }
        };

        function _checkHit(coord,Sprite){

        }

        function _bindEvent(){
            window.addEventListener("resize",function(){
                _reParseMapScale();
            },false);


            _canvas.addEventListener("click",function(event){

                var _redantEvent={};
                    var coord=_toNatrueCoord(event.offsetX,event.offsetY);
                    _redantEvent.x=coord.x;
                    _redantEvent.y=coord.y;
                    _redantEvent.originEvent=event;
                    _redantEvent._stop=false;
                    _redantEvent.shutup=function(){
                        _redantEvent._stop=true;
                    };

                    //check click sprite;
                    for(i=_SpriteList.length-1;i>-1;i--){
                        var _bool=_checkOver(_redantEvent,_SpriteList[i]);
                        if(_bool){
                            _SpriteList[i].fire("click",[_redantEvent]);
                            if(_redantEvent._stop){
                               return;
                            }
                        }
                    };

                return _Event._fire("click",[_redantEvent])
            },false);
        }


        return{
            Sprite:_Sprite,
            init:_init,
            on:function(action,handler){
                if(!_Event[action]){
                    _Event[action]=[];
                };
                _Event[action].push(handler)
            },
        }
    })();

    _page.Resource=(function() {
        var _totalResourceCount = 0;
        var _loadedCount = 0;
        var _loadedComplateCallback = null;
        var fileJson = {};


        function _checkLoadComplate() {
            if (_loadedCount == _totalResourceCount && _loadedCount != 0) {
                _loadedComplateCallback ? _loadedComplateCallback() : "";
            }
        };

        //create img by load date  and  cache it;
        function _createImage(tempJson, handler) {
            var img = document.createElement("img");
            img.src = tempJson.url;
            img.onload = function () {
                tempJson.obj = img;
                _loadedCount++;
                var progress = (_loadedCount / _totalResourceCount).toFixed(1);
                handler(progress, tempJson);
                _checkLoadComplate();
            };
        };

        //create sound by load date  and cache it;
        function _createSound(tempJson) {
            var request = new XMLHttpRequest();
            request.open("GET", tempJson.url, true);
            request.responseType = 'arraybuffer';
            request.onload = function (buffer) {
                game.AudioContext.decodeAudioData(request.response, function (buffer) {
                    tempJson.obj = buffer;
                });
            };
            request.send();
        };

        return {
            //add some files in loader
            addFile: function (Ary) {
                _totalResourceCount = Ary.length;
                for (var i = 0, l = Ary.length; i < l; i++) {
                    var tempObj = Ary[i];
                    var tempName = {};
                    tempName[tempObj.name] = tempObj;
                    if (!fileJson[tempObj.type]) {
                        fileJson[tempObj.type] = [];
                    }
                    ;
                    fileJson[tempObj.type].push(tempObj);
                }
                ;
                return this;
            },


            //go to load
            load: function (frameFun, complate) {
                _loadedComplateCallback = complate;
                var imgJson = fileJson.img || [],
                    soundJson = fileJson.sound || [];
                for (var i = 0; i < imgJson.length; i++) {
                    _createImage(imgJson[i], frameFun);
                }
                for (var i = 0; i < soundJson.length; i++) {
                    _createSound(soundJson[i], frameFun);
                }
            },

            //return img object of game cache;
            getImage: function (name) {
                var imgAry = fileJson["img"];
                if (imgAry) {
                    for (var i = 0; i < imgAry.length; i++) {
                        if (imgAry[i].name == name) {
                            return imgAry[i].obj;
                        }
                    }
                }
            },

            //return sound object of game cache;
            getSoundBuffer: function (name) {
                var sd = fileJson["sound"];
                if (sd) {
                    for (var i = 0; i < sd.length; i++) {
                        if (sd[i].name == name) {
                            return sd[i].obj;
                        }
                    }
                }
            }
        }
    })();
    _page.commonTools=(function(){
        //get a random num;
        var _randomJson={};
        function _getRandom(b,bool){
            var bb=b||10;
            var bs=Math.pow(10,bb);
            var sj=parseInt(bs*Math.random(1));
            if(_randomJson[sj]&&bool){
                var ssj=_getRandom(b);
                _randomJson[ssj]=ssj;
                return ssj;
            }else if(_randomJson[sj]==0){
                console.error("can't get random!");
            }else{
                _randomJson[sj]=sj;
                return sj;
            }
        };
        //get angle of A to B
        function _getAngle(x1,y1,x2,y2){
            var k=(y1-y2)/(x1-x2);
            var al=Math.atan(k);
            var v=x1>x2?1:-1;
            var angle=al*(360/2/Math.PI)+270*v;
            if(angle==-360){
                angle=-180
            }else if(angle==-180){
                angle=-360;
            }
            return angle;
        };
        function _getSpaceBetweenDoubleCoord(x1,y1,x2,y2){
            var powX=Math.pow(x2-x1,2);
            var powY=Math.pow(y2-y1,2);
            var space=Math.sqrt(powX+powY);
            return space;
        }
        function _findObj(parentObj,subObj,fun){
            var l=parentObj.length;
            for(var i=0;i<l;i++){
                if(parentObj[i]==subObj){
                    fun?fun(i):"";
                    return i;
                };
            }
            return -1;
        };

        return {
            getRandom:_getRandom
            ,getAngle:_getAngle
            ,selectArrayByObj:_findObj
            ,getSpaceBetweenDoubleCoord:_getSpaceBetweenDoubleCoord
        };
    })();

    return _page;
});