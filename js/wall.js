class Wall {
    constructor(car, x, y, width, height)
    {
        this.car = car;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.offset = 23;
    }

    update() {

        var x = this.car.x;
        if((Math.abs(this.x - this.car.colX - this.offset)) < (Math.abs(this.x - this.car.x - this.offset)) || (Math.abs(this.x + this.width - this.car.colX - this.offset)) < (Math.abs(this.x + this.width - this.car.x - this.offset)))
        { x = this.car.colX; }

        var y = this.car.y;
        if((Math.abs(this.y - this.car.colY - this.offset)) < (Math.abs(this.y - this.car.y - this.offset)) || (Math.abs(this.y + this.height - this.car.colY - this.offset)) < (Math.abs(this.y + this.height - this.car.y - this.offset)))
        { y = this.car.colY; }

        //check for collisions
        if (x >= this.x - this.offset && x <= this.x + this.width + this.offset && y >= this.y - this.offset && y <= this.y + this.height + this.offset)
        {
             var value = 2 + (10 * (this.car.speed / this.car.maxSpeed));

             if(x >= this.x - this.offset && x <= this.x + this.width + this.offset && this.car.y < this.y + 2) {
                this.car.y -= value;
             }

             if (x >= this.x - this.offset && x <= this.x + this.width + this.offset && this.car.y > this.y + this.height/2 - 2) {
                this.car.y += value;
             }

             if (y >= this.y - this.offset && y <= this.y + this.height + this.offset && this.car.x < this.x + this.width/2 + 2) {
                this.car.x -= value;
             }

             if (y >= this.y - this.offset && y <= this.y + this.height + this.offset && this.car.x > this.x + this.width/2 - 2) {
                this.car.x += value;
             }

             if(this.car.speed > 0) {
                this.car.speed -= 2;
             } else if(this.car.speed < 0) {
                this.car.speed += 2;
             }
        }
    }

}
