var context;
function init(){
    context=new webkitAudioContext();
    var request1=new XMLHttpRequest();
        request1.open("GET","/sound/dragon.wav",true);
        request1.responseType = 'arraybuffer';
        request1.onload=function(buffer){
            context.decodeAudioData(request1.response, function(buffer) {
                var source1=context.createBufferSource();
                    source1.buffer=buffer;
                    source1.connect(context.destination);
                    source1.loop=0;
                   // source1.noteOn(1);
            }, function(){console.log("fefe")});
        };
        request1.send();
    var request=new XMLHttpRequest();
        request.open("GET","/sound/dragon.wav",true);
        request.responseType = 'arraybuffer';
        request.onload=function(buffer){
            context.decodeAudioData(request.response, function(buffer) {
                var ary=buffer.getChannelData(0);

                var gainNode=context.createGainNode();
                    gainNode.connect(context.destination);
                        gainNode.gain.value=0.8;
                        //gainNode.gain.linearRampToValueAtTime(0.5,3);
                        //gainNode.gain.linearRampToValueAtTime(0,4);
                        /*
                    setInterval(function(){
                        gainNode.gain.value+=0.01;
                    },100);
                    console.dir(gainNode);
                    */

                   function cre(){
						console.log("d");
				   
				   } 

                    setInterval(function(){
							cre();
                    },3000);




                dogBarkingBuffer = buffer;
            }, function(){console.log("fefe")});
        }
        request.send();
}
