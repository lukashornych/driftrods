class ImagesLoader {

    constructor() {
        this.images = new Array();
        this.loadedImages = 0;
        this.imagesCount = 0;
    }

    load(sources, callback, callbackAttribute) {
        this.imagesCount = sources.length;
        while(this.loadedImages < this.imagesCount)
        {
            this.images[this.loadedImages] = new Image();
            this.images[this.loadedImages].src = sources[this.loadedImages];
            this.images[this.loadedImages].onload = function()
            {
                if(this.loadedImages == this.imagesCount)
                {
                    callback(callbackAttribute);
                }
            }
            this.loadedImages++;
        }
    }
}
