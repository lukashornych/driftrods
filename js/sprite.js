var spr_car;

class Sprite {
    constructor(img, x, y, width, height)
    {
      this.img = img;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }

    draw(ctx, x, y, scale)
    {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height, x, y, this.width * scale, this.height * scale);
    }
}

function LoadSprites(img)
{
    //cars
    spr_m330 = new Sprite(img, 0, 0, 100, 45);
    spr_m330Shadow = new Sprite(img, 0, 45, 100, 45);

    spr_rx07 = new Sprite(img, 100, 0, 100, 45);
    spr_rx07Shadow = new Sprite(img, 100, 45, 100, 45);

    spr_superr = new Sprite(img, 200, 0, 100, 45);
    spr_superrShadow = new Sprite(img, 200, 45, 100, 45);

    spr_true86 = new Sprite(img, 300, 0, 100, 45);
    spr_true86Shadow = new Sprite(img, 300, 45, 100, 45);

    //wheels
    spr_turningWheelsLeft = new Sprite(img, 0, 90, 100, 45);
    spr_turningWheelsRight = new Sprite(img, 100, 90, 100, 45);
}
