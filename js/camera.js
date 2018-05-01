class Camera {

    constructor(object, viewX, viewY, viewW, viewH, mapWidth, mapHeight)
    {
        this.follow = object;
        this.viewX = viewX;
        this.viewY = viewY;
        this.viewW = viewW;
        this.viewH = viewH;
        this.centerX = viewW/2;
        this.centerY = viewH/2;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
    }

    update()
    {
        //move camera on X
        if (this.follow.x >= this.centerX && this.follow.x <= (this.mapWidth - this.centerX))
        {
            this.viewX = this.follow.x - this.centerX;
        }
        else if (this.follow.x < this.centerX)
        {
            this.viewX = 0;
        }
        else if (this.follow.x > (this.mapWidth - this.centerX))
        {
            this.viewX = this.mapWidth - this.viewW;
        }

        //move camera on Y
        if (this.follow.y >= this.centerY && this.follow.y <= (this.mapHeight - this.centerY))
        {
            this.viewY = this.follow.y - this.centerY;
        }
        else if (this.follow.y < this.centerY)
        {
            this.viewY = 0;
        }
        else if (this.follow.Y > (this.mapHeight - this.centerY))
        {
            this.viewY = this.mapHeight - this.viewH;
        }
    }
}
