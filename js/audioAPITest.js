var context;
function init(){
    context=new webkitAudioContext();
    var request1=new XMLHttpRequest();
        request1.open("GET","/sound/dragon.wav",true);
        request1.responseType = 'arraybuffer';
        request1.onload=function(buffer){
            context.decodeAudioData(request1.response, function(buffer) {
                var gainNode=context.createGainNode();
                    gainNode.connect(context.destination);
                        gainNode.gain.value=0.5;
                var source1=context.createBufferSource();
                console.dir(buffer);
                    source1.buffer=buffer;
                    source1.connect(gainNode);
                     gainNode.connect(context.destination);
                   source1.noteOn(0);

                   console.log("cc");
            }, function(){console.log("fefe")});
        };
        request1.send();
    var request=new XMLHttpRequest();
        request.open("GET","/sound/dragon.wav",true);
        request.responseType = 'arraybuffer';
        request.onload=function(buffer){
            context.decodeAudioData(request.response, function(buffer) {
                var ary=buffer.getChannelData(0);

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
