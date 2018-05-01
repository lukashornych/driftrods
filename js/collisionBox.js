class CollisionBox {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    isColliding(object, xView, yView) {
        if (object.x > this.x && object.x < this.x + this.width)
        {
            if (object.y > this.y && object.y < this.y + this.height )
            {
                return true;
            }
        }
    }
}
