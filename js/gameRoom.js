class GameRoom {

    constructor()
    {
        this.selectedCar = null;
        this.selectedMap = null;

        //objects
        this.car = null;
        this.camera = null;
        this.map = null;
        this.tiresBarel = null;

        this.state = -1; //-1: countdown / 0: playing / 1: stopped
        this.rewardedMoney = 0;

        this.backSoundSource = null;

        this.engineSoundSource = null;
        this.engineSoundVol = null;

        this.countdown = 3;
    }

    //function called once when web is loaded
    gameInit() {

        this.playEngineSound();

        //create objects
        //acceleration, brakeForce, steerAmount, steerMaxAngle, maxSpeed, power, posX, posY
        this.car = new Car(carsDatabase[this.selectedCar], carsDatabase[this.selectedCar].power/carsDatabase[this.selectedCar].weight*3, 0.025,
                          carsDatabase[this.selectedCar].power/carsDatabase[this.selectedCar].weight*1.5, carsDatabase[this.selectedCar].steerMaxAngle/15,
                          carsDatabase[this.selectedCar].maxSpeed/5, carsDatabase[this.selectedCar].power / carsDatabase[this.selectedCar].weight / 20,
                          tracksDatabase[this.selectedMap].startFinishLinePos.x, tracksDatabase[this.selectedMap].startFinishLinePos.y);
        this.map = new Map(this.car, tracksDatabase[this.selectedMap]);
        this.camera = new Camera(this.car, 0, 0, windowWidth, windowHeight, tracksDatabase[this.selectedMap].img.width, tracksDatabase[this.selectedMap].img.height);

        //sounds
        this.playBackSound();

        //reset game
        this.state = -1;
        this.countdown = 3;
        this.map.mapInit();

        //run update and draw
        selectRun = 3;

        //start countdown
        playSound(sounds[6], false);
        var that = this;
        var interval = setInterval(function () {
            that.countdown--;
            if(that.countdown > 0) {
                playSound(sounds[6], false);
            }else if (that.countdown == 0) {
                playSound(sounds[7], false);
            } else if(that.countdown < 0) {
                clearInterval(interval);
                that.state = 0;
            }
        }, 1000);
    }

    //update
    update() {
        this.car.update();
        this.camera.update();
        this.map.update();
    }

    //draw
    draw() {
        //clear canvas
        context.clearRect(0,0,windowWidth, windowHeight);

        //draw objects
        this.map.draw(context, this.camera.viewX, this.camera.viewY);
        this.car.draw(context, this.camera.viewX, this.camera.viewY);
        //draw hud
        if( this.state == -1) {
            this.drawCountdown(context);
        } else if (this.state == 0) {
            this.drawPlayingHUD(context);
        } else if (this.state == 1) {
            this.drawStoppedHUD(context);
        }
    }

    drawCountdown(ctx) {
        ctx.save();
        ctx.shadowColor = "black";
        ctx.shadowBlur = 30;
        ctx.fillStyle = "white";
        ctx.font = "100px Raleway";
        ctx.textAlign = "center";
        ctx.textBaseline="middle";
        var s = this.countdown;
        if(this.countdown == 0) {
            s = "Start";
            ctx.fillStyle = "#00FF00";
        }
        ctx.fillText(s, windowWidth/2, windowHeight/2);
        ctx.restore();
    }

    drawPlayingHUD(ctx) {
        //draw places
        ctx.save();
        ctx.shadowColor = "black";
        ctx.shadowBlur = 30;

        ctx.fillStyle = "#FFD700";
        ctx.font = "35px Raleway";
        ctx.fillText("1. " + this.map.track.placePrize[0] * tracksLevels[this.selectedMap] + " bodů", 60, 75);

        ctx.fillStyle = "#C0C0C0";
        ctx.font = "35px Raleway";
        ctx.fillText("2. " + this.map.track.placePrize[1] * tracksLevels[this.selectedMap] + " bodů", 60, 110);

        ctx.fillStyle = "#fb7200";
        ctx.font = "35px Raleway";
        ctx.fillText("3. " + this.map.track.placePrize[2] * tracksLevels[this.selectedMap] + " bodů", 60, 145);
        ctx.restore();

        //draw score
        ctx.save();
        ctx.shadowColor = "black";
        ctx.shadowBlur = 50;
        //choose color for drift score
        if (this.car.driftScore > this.map.track.placePrize[0] * tracksLevels[this.selectedMap]) {
            ctx.fillStyle = "#FFD700";
        } else if (this.car.driftScore > this.map.track.placePrize[1] * tracksLevels[this.selectedMap]) {
            ctx.fillStyle = "#C0C0C0";
        } else if (this.car.driftScore > this.map.track.placePrize[2] * tracksLevels[this.selectedMap]) {
            ctx.fillStyle = "#fb7200";
        } else {
            ctx.fillStyle = "#ffffff";
        }
        ctx.font = "110px Raleway";
        ctx.textAlign = "center";
        ctx.fillText(Math.round(this.car.driftScore), windowWidth/2, 120);
        ctx.restore();

        //draw multiplier
        if(this.car.driftScoreMultiplier > 1) {
            ctx.save();
            ctx.shadowColor = "black";
            ctx.shadowBlur = 30;
            ctx.fillStyle = "red";
            ctx.font = "35px Raleway";
            ctx.textAlign = "center";
            ctx.fillText("drift combo x" + this.car.driftScoreMultiplier, windowWidth/2, 175);
            ctx.restore();
        }

        //draw time
        var r = 30;
        var pos = [windowWidth - 50 - r, 50 + r];
        var time = gameR.map.trackTime / gameR.map.track.time;

        ctx.save();
        ctx.shadowColor = "black";
        ctx.shadowBlur = 40;


        ctx.fillStyle = "white";
        ctx.globalAlpha = 0.4;

        ctx.beginPath();
        ctx.arc(pos[0], pos[1], r, 0, 2*Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        ctx.save();

        if(gameR.map.trackTime > 20000) { ctx.fillStyle = "white"; } else { ctx.fillStyle = "red"; };

        ctx.beginPath();
        ctx.moveTo(pos[0], pos[1]);
        ctx.lineTo(pos[0] + r, pos[1]);
        ctx.arc(pos[0], pos[1], r, 0, time*2*Math.PI);
        ctx.lineTo(pos[0], pos[1]);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        //draw speed gauge
    }

    drawStoppedHUD(ctx) {
        //draw background
        ctx.save();
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.6;
        ctx.fillRect(0, 0, windowWidth, windowHeight);
        ctx.restore();

        //draw time is up textAlign
        ctx.save();
        ctx.fillStyle = "red";
        ctx.font = "85px Raleway";
        ctx.textAlign = "center";
        ctx.fillText("Čas vypršel!", windowWidth/2, 150);
        ctx.restore();

        //draw rewards
        ctx.save();
        ctx.fillStyle = "white";
        ctx.font = "35px Raleway";
        ctx.textAlign = "center";
        ctx.fillText("Získal jsi:", windowWidth/2, 270);

        ctx.fillStyle = "white";
        ctx.fillText(Math.round(this.car.driftScore) + " bodů", windowWidth/2, 360);
        ctx.fillText(this.rewardedMoney + " korun", windowWidth/2, 400);
        ctx.restore();

        //draw continue text
        ctx.save();
        ctx.fillStyle = "gray";
        ctx.font = "35px Raleway";
        ctx.textAlign = "center";
        ctx.fillText("Klikni pro pokračování", windowWidth/2, 650);
        ctx.restore();
    }

    getRewardedMoney() {
        //give money
        if (this.car.driftScore > tracksDatabase[this.selectedMap].placePrize[0] * tracksLevels[this.selectedMap]) {
            this.rewardedMoney = basicMoneyRewards[0] * tracksLevels[this.selectedMap];
        } else if (this.car.driftScore > tracksDatabase[this.selectedMap].placePrize[1] * tracksLevels[this.selectedMap]) {
            this.rewardedMoney = basicMoneyRewards[1] * tracksLevels[this.selectedMap];
        } else if (this.car.driftScore > tracksDatabase[this.selectedMap].placePrize[2] * tracksLevels[this.selectedMap]) {
            this.rewardedMoney = basicMoneyRewards[2] * tracksLevels[this.selectedMap];
        } else {
            this.rewardedMoney = 0;
        }
    }

    giveRewards() {
        //give money
        playerMoney += this.rewardedMoney;
        saveCookie("playerMoney", playerMoney);
        //increase track level
        if (this.car.driftScore > this.map.track.placePrize[0] * tracksLevels[this.selectedMap]) {
            if(tracksLevels[this.selectedMap] < 9) { tracksLevels[this.selectedMap]++; }
            var tracksLevelsStr = tracksLevels.join("");
            saveCookie("tracksLevels", tracksLevelsStr);
        }
    }

    playBackSound() {
        this.backSoundSource = audioContext.createBufferSource();
        this.backSoundSource.buffer = sounds[0]; //select sound
        this.backSoundSource.loop = true;
        this.backSoundSource.connect(audioContext.destination); //connect source do speakers
        this.backSoundSource.start(0);
    }

    stopBackSound() {
        this.backSoundSource.stop();
    }

    playEngineSound() {
        this.engineSoundSource = audioContext.createBufferSource();
        this.engineSoundSource.buffer = sounds[this.selectedCar + 2]; //select sound

        this.engineSoundVol = audioContext.createGain();
        this.engineSoundVol.gain.value = 0;

        this.engineSoundSource.playbackRate.value = 0;
        this.engineSoundSource.loop = true;

        this.engineSoundSource.connect(this.engineSoundVol); //connect source do speakers
        this.engineSoundVol.connect(audioContext.destination);

        this.engineSoundSource.start(0);
    }

    stopEngineSound() {
        this.engineSoundSource.stop();
    }
}
