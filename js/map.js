class Map {
    constructor(object, track)
    {
        this.object = object;
        this.track = track;

        this.trackTime = track.time;
        this.objectIsColliding = true;
        this.collisionBoxes = [];
        this.barrels = [];
        this.walls = [];
    }

    mapInit() {
        this.countTime();

        //create collisionBoxes from database
        for(var i in this.track.collisionBoxes) {
            this.collisionBoxes[i] = new CollisionBox(this.track.collisionBoxes[i].x, this.track.collisionBoxes[i].y, this.track.collisionBoxes[i].width, this.track.collisionBoxes[i].height);
        }

        //create tiresBarels from database
        for(var i in this.track.barrels) {
            this.barrels[i] = new Barrel(gameR.car, this.track.barrels[i].x, this.track.barrels[i].y, this.track.barrels[i].dia);
        }

        //create signs from database
        for(var i in this.track.walls) {
            this.walls[i] = new Wall(gameR.car, this.track.walls[i].x, this.track.walls[i].y, this.track.walls[i].width, this.track.walls[i].height);
        }
    }

    update() {
        //go throw all tires barels and do update
        for(var i in this.barrels) {
            this.barrels[i].update();
        }
        //go throw all tires barels and do update
        for(var i in this.walls) {
            this.walls[i].update();
        }

        //go throw all collisionBoxes and check if any of them is colliding
        for (var i in this.collisionBoxes) {
            if (this.collisionBoxes[i].isColliding(gameR.car, gameR.camera.xView, gameR.camera.yView)) {
                this.objectIsColliding = true;
                return;
            }
            else {
                this.objectIsColliding = false;
            }
        }
    }

    draw(ctx, viewX, viewY) {
        //draw map
        ctx.drawImage(this.track.img, 0, 0, this.track.img.width, this.track.img.height, -viewX, -viewY, this.track.img.width, this.track.img.height);
    }

    countTime() {
        var that = this;
        var i = setInterval(function() {
            that.trackTime -= 1000;

            if (that.trackTime < 1000) {
                gameR.state = 1;
                gameR.getRewardedMoney();
                gameR.giveRewards();
                clearInterval(i);
            }
        }, 1000);
    }
}
