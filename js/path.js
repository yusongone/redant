var page=(function(){
    var overDiv;
    return {
        init:function(){
            overDiv=$("#overDiv");
            overDiv.click(function(event){
                cacheSpace.doIt({x:event.offsetX,y:event.offsetY});
            });
            overDiv.bind("mousemove",function(evt){
                if(pen.getPathStatus()){
                    return false;
                };
                pen.checkPath({x:evt.offsetX,y:evt.offsetY});
            });
        }
    }
})();
var pen=(function(){
    var pathAry=[];
    var pathStatus;
    function makeSVG(tag, attrs) {
        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        return el;
    }
    function _getAngle(x1,y1,x2,y2){
        var k=(y1-y2)/(x1-x2);
        var al=Math.atan(k);
        var angle=al*(360/2/Math.PI);
        if(x1<x2){
            angle+=180;
         }
        return angle+90;
    };

    function path(){
        this.closePathFunction;
        this.body=makeSVG("svg",{"version":"1.1"});
        //this.body=$("<svg/>",{"class":"path","xmlns":"http://www.w3.org/2000/svg","version":"1.1"});
        $("#overDiv")[0].appendChild(this.body);
        this.pointAry=[];
        this.firstPoint;
        this.prevPoint;
        this.hover=function(){
            console.log("fdddfdfdf");
        }
    };
    path.prototype.addPoint=function(pos){
        pathStatus=1;
        if(!this.firstPoint){
            this.firstPoint=pos; 
            var point=makeSVG("circle",{cx:pos.x,cy:pos.y,r:10,fill:"black"});
            this.body.appendChild(point);
        }else{
            this.isClosePath(pos);
            var point=makeSVG("circle",{cx:pos.x,cy:pos.y,r:5,fill:"red"});
            var path=makeSVG("path",{d:"M"+pos.x+" "+pos.y+" L"+this.prevPoint.x+" "+this.prevPoint.y+" Z",fill:"blue",style:"fill:white;stroke:red;stroke-width:2"});
            this.body.appendChild(point);
            this.body.appendChild(path);
        }
        var x=226,y=482;
        var agn1=_getAngle(pos.x,pos.y,x,y); 
        this.prevPoint=pos;
    }
    path.prototype.closePath=function(){
        pathStatus=0;
        pathAry.push(this);
        this.closePathFunction();
    }
    path.prototype.isClosePath=function(pos){
        var x=Math.abs(pos.x-this.firstPoint.x);
        var y=Math.abs(pos.y-this.firstPoint.y);
        this.pointAry.push(this.prevPoint);
        if(x<10&&y<10){
            this.pointAry.push(this.firstPoint);
            this.closePath();
            pos.x=this.firstPoint.x;
            pos.y=this.firstPoint.y;
            return true;
         }
        return false;
    }
    
    return {
        getPath:function(){
            return path;
        },
        getPathStatus:function(){
            return pathStatus; 
                },
       checkPath:function(json){
            for(var i=0;i<pathAry.length;i++){
                check(pathAry[i]);  
            };
            function check(path){
                var pointAry=path.pointAry;
                var x=json.x;y=json.y;
                var al=0;
                for(var i=1;i<pointAry.length;i++){
                    var tempA=pointAry[i-1],tempB=pointAry[i];
                    var agn=_getAngle(tempA.x,tempA.y,x,y),agn1=_getAngle(tempB.x,tempB.y,x,y); 
                    var subAng=agn1-agn;
                        if(subAng<-180){
                            subAng=360+subAng;
                        }else if(subAng>180){
                            subAng=-(360-subAng);
                        }
                        al+=subAng;
                }
                al=Math.abs(al);
                if(al>355){
                    path.hover();
                }else{
                }
            }
        }
    }
})();


var cacheSpace=(function(){
    var path; 
    return {
        doIt:function(pos){
            if(!path){
                path=new (pen.getPath())();
                path.closePathFunction=function(){
                    path=null;
                }
            }
            path.addPoint(pos);
        }
    }
})();

