class Barrel {
    constructor(car, x, y, diameter)
    {
        this.car = car;
        this.x = x;
        this.y = y;
        this.diameter = diameter;

        this.offset = 12;
    }

    update()
    {
        var x = this.car.x;
        if((Math.abs(this.x - this.car.colX - this.offset)) < (Math.abs(this.x - this.car.x - this.offset)) || (Math.abs(this.x + this.width - this.car.colX - this.offset)) < (Math.abs(this.x + this.width - this.car.x - this.offset)))
        { x = this.car.colX; }

        var y = this.car.y;
        if((Math.abs(this.y - this.car.colY - this.offset)) < (Math.abs(this.y - this.car.y - this.offset)) || (Math.abs(this.y + this.height - this.car.colY - this.offset)) < (Math.abs(this.y + this.height - this.car.y - this.offset)))
        { y = this.car.colY; }

        //get distance between car and tires barel
        var dx = Math.abs(this.x - this.car.x - this.offset);
        var dy = Math.abs(this.y - this.car.y - this.offset);
        var distance = Math.sqrt(dx * dx + dy * dy);

        //check for collision
        if (distance < this.diameter/2 + this.car.collisionCircleMaskWidth/2)
        {
            var value = 2 + (10 * (this.car.speed / this.car.maxSpeed));

            if(x >= this.x - this.offset && x <= this.x + this.diameter + this.offset && this.car.y < this.y + 2) {
               this.car.y -= value;
            }

            if (x >= this.x - this.offset && x <= this.x + this.diameter + this.offset && this.car.y > this.y + this.diameter/2 - 2) {
               this.car.y += value;
            }

            if (y >= this.y - this.offset && y <= this.y + this.diameter + this.offset && this.car.x < this.x + this.diameter/2 + 2) {
               this.car.x -= value;
            }

            if (y >= this.y - this.offset && y <= this.y + this.diameter + this.offset && this.car.x > this.x + this.diameter/2 - 2) {
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
