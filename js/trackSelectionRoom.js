class TrackSelection {

    constructor() {
        this.maps = []

        this.selectedMap = 0;
        this.mapCount = 0;

        this.cameraLeader = { x: 640, y: 360 };

        this.canPressButtonLeft = true;
        this.canPressButtonRight = true;
    }

    trackSelectionInit() {
        this.mapCount = tracksDatabase.length;

        //create cars
        for(var i = 0; i < this.mapCount; i++)
        {
            this.maps[i] = new TrackSelectionTrack(tracksDatabase[i], (1280 * i) + 820);
        }

        this.camera = new Camera(this.cameraLeader, 0, 0, windowWidth, windowHeight, 1280 * this.mapCount, 720);

        //run update and draw
        selectRun = 2;
    }

    update() {
        //garage control
        if(input.isDown(input.leftA) && this.selectedMap > 0 && this.canPressButtonLeft){
            this.selectedMap--;
            this.canPressButtonLeft = false;
        }
        else if(!input.isDown(input.leftA)){
            this.canPressButtonLeft = true;
        }

        if(input.isDown(input.rightA) && this.selectedMap < (this.mapCount - 1) && this.canPressButtonRight){
            this.selectedMap++;
            this.canPressButtonRight = false;
        }
        else if(!input.isDown(input.rightA)){
            this.canPressButtonRight = true;
        }

        //move camera leader
        this.cameraLeader.x = Math.lerp(this.cameraLeader.x, (1280 * this.selectedMap) + (1280 / 2), 0.1);

        //update camera position
        this.camera.update();
    }

    draw(ctx) {
        ctx.clearRect(0,0,windowWidth, windowHeight);

        ctx.save();
        ctx.fillStyle = "gray";
        ctx.fillRect(0, 0, 1280,720);
        ctx.restore();

        //draw maps
        for(var i=0; i<this.mapCount; i++)
        {
            this.maps[i].draw(ctx, this.camera.viewX);
        }

        //draw info
        ctx.save();
        ctx.shadowColor = "black";
        ctx.shadowBlur = 30;
        ctx.fillStyle = "white";

        ctx.font = "35px Raleway";
        ctx.fillText("Úroveň tratě: " + tracksLevels[trackSelectionR.selectedMap] + "/9", 60, windowHeight/2 - 85);

        //draw money
        ctx.font = "30px Raleway";
        ctx.textAlign = "right";
        ctx.fillText(playerMoney + " korun", windowWidth - 75, 90);
        ctx.textAlign = "left";

        ctx.font = "25px Raleway";
        ctx.fillStyle = "#FFD700";
        ctx.fillText("1. " + (basicMoneyRewards[0] * tracksLevels[this.selectedMap]) + " korun (" + (tracksDatabase[this.selectedMap].placePrize[0] * tracksLevels[this.selectedMap]) + " bodů)", 60, windowHeight/2 - 35);
        ctx.fillStyle = "#C0C0C0";
        ctx.fillText("2. " + (basicMoneyRewards[1] * tracksLevels[this.selectedMap]) + " korun (" + (tracksDatabase[this.selectedMap].placePrize[1] * tracksLevels[this.selectedMap]) + " bodů)", 60, windowHeight/2);
        ctx.fillStyle = "#fb7200";
        ctx.fillText("2. " + (basicMoneyRewards[2] * tracksLevels[this.selectedMap]) + " korun (" + (tracksDatabase[this.selectedMap].placePrize[2] * tracksLevels[this.selectedMap]) + " bodů)", 60, windowHeight/2 + 35);

        var min = Math.floor(tracksDatabase[this.selectedMap].time / 60000);
        var sec = Math.round(((tracksDatabase[this.selectedMap].time / 60000) - min) * 60);
        if(sec < 10) { sec = "0" + sec; }
        ctx.font = "35px Raleway";
        ctx.fillStyle = "white";
        ctx.fillText("Čas: " + min + ":" + sec, 60, windowHeight/2 + 85);

        ctx.font = "50px Raleway";
        ctx.textAlign = "center";
        ctx.fillText("Vyber si trať", windowWidth/2, 100);
        ctx.font = "30px Raleway";
        if(this.selectedMap != 4 || boughtParkTrack == 1) {
            ctx.fillText("Klikni pro pokračování", windowWidth/2, windowHeight - 65);
        } else {
            if(playerMoney >= parkTrackPrize) {
                ctx.fillText("Klikni pro zakoupení bonusové tratě", windowWidth/2, windowHeight - 65);
            } else {
                ctx.fillStyle = "red";
                ctx.fillText("Bonusová trať stojí " + parkTrackPrize + " korun", windowWidth/2, windowHeight - 65);
            }
        }

        ctx.restore();
    }

    trackSelection() {
        if(this.selectedMap != 4 || boughtParkTrack == 1) {
            gameR.selectedMap = this.selectedMap;
            roomGoTo(3);
        } else {
            if(playerMoney >= parkTrackPrize) {
                boughtParkTrack = 1;
                playerMoney -= parkTrackPrize;
                saveCookie("playerMoney", playerMoney);
                saveCookie("boughtParkTrack", boughtParkTrack);
            } else {
                ctx.fillStyle = "red";
                ctx.fillText("Nemáš dostatek peněz pro zakoupení bonusové tratě", windowWidth/2, windowHeight - 65);
            }
        }
    }
}
