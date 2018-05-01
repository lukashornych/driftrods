function playSound(buffer, loop) {
    var source = audioContext.createBufferSource();
    source.buffer = buffer; //select sound
    source.loop = loop;
    source.connect(audioContext.destination); //connect source do speakers
    source.start(0); //play sound
}

class BufferLoader {
    constructor(ctx, urlList, callback) {
        this.ctx = ctx;
        this.urlList = urlList;
        this.onload = callback;
        this.bufferList = [];
        this.loaded = 0;
    }

    loadBuffer(url, index) {
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        var that = this;

        request.onload = function() {
            that.ctx.decodeAudioData(request.response, function(buffer) {
                    if (!buffer) {
                        alert("error ecoding file data: " + url);
                        return;
                    }

                    that.bufferList[index] = buffer;
                    if(++that.loaded == that.urlList.length) {
                        that.onload(that.bufferList);
                    }

                }, function(error) {
                    console.log("decodeAudioData error", error);
                }
            )
        }

        request.onerror = function() {
            alert("BufferLoader: XHR error");
        }

        request.send();
    }

    load() {
        for (var i = 0; i < this.urlList.length; ++i) {
            this.loadBuffer(this.urlList[i], i);
        }
    }
}
