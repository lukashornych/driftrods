class GarageCar {
    constructor(car, x, y) {
        this.car = car;
        this.x = x;
        this.y = y;
    }

    draw(ctx, viewX, viewY)
    {
        ctx.save();
        ctx.shadowColor = "black";
        ctx.shadowBlur = 50;
        ctx.drawImage(this.car.imgGarage, this.x - viewX - this.car.imgGarage.width/2, this.y - this.car.imgGarage.height/2);
        ctx.restore();
    }
}
