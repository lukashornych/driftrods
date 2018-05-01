class Car {

    constructor(car, acceleration, brakeForce, steerAmount, steerMaxAngle, maxSpeed, power, posX, posY) {
        this.x = posX;
        this.y = posY;
        this.speed = 0;
        this.direction = 0;
        this.wantedDirection = 0;
        this.colX = posX - 55;
        this.colY = posY;
        this.prevX = posX;
        this.prevY = posY;
        this.prevWantedDirection = 0;

        this.car = car;

        this.acceleration = acceleration;
        this.brakeForce = brakeForce;
        this.steerAmount = steerAmount;
        this.steerMaxAngle = steerMaxAngle;
        this.maxSpeed = maxSpeed;
        this.power = power;

        this.accelerateValue = 0;
        this.steerLerp = 0.65;
        this.actualSteer = 0;
        this.atmosphereSlowDown = 0.04;

        this.collisionCircleMaskWidth = 70;

        this.driftScore = 0;
        this.minDriftAngle = 40;
        this.driftScoreMultiplier = 1;
        this.timeFromPrevDrift = 0;
        this.timeFromPrevMultiplierValue = 0;
        this.afterDrift = false;

        this.inDrift = false;
        this.playingSkidSound = false;

        this.skidSoundSource = null;
        this.skidSoundVol = null;
    }

    currentAcceleration(speed, maxSpeed, acceleration) {
        //get current acceleration from current speed
        var currentSpeedPercentage = speed / maxSpeed;
        var currentAcceleration = acceleration - (acceleration * currentSpeedPercentage);

        return currentAcceleration;
    }

    accelerateBrake() {
      var angleDiff = Math.abs(this.wantedDirection - this.direction);

      if(!input.isDown(input.spaceBar)) {
          var actualMaxSpeed = 0; //forward max speed or backward max speed
          var actualAcceleration = 0; //forward acceleration or backward acceleration

          //get accelerateValue
          if (Math.abs(this.accelerationBrakeInputAxis()) != 0)
          {
              this.accelerateValue = Math.lerp(this.accelerateValue, 1, this.power);
          }
          else
          {
              this.accelerateValue = 0;
          }

          //set max speed and acceleration by direction of drive
          if (this.speed >= 0)
          {
              actualMaxSpeed = this.maxSpeed;
              actualAcceleration = this.acceleration;
          }
          else if (this.speed < 0)
          {
              actualMaxSpeed = this.maxSpeed * 0.4;
              actualAcceleration = this.acceleration * 0.4;
          }

          if(!gameR.map.objectIsColliding){
              this.speed = Math.lerp(this.speed, this.speed / 4, 0.03);
          }

          //update speed
          if (angleDiff <= 10) {
              this.speed += this.currentAcceleration(Math.abs(this.speed), actualMaxSpeed, actualAcceleration) * this.accelerateValue * this.accelerationBrakeInputAxis();
          } else if (angleDiff > 10 && angleDiff < 100) {
              this.speed += this.currentAcceleration(Math.abs(this.speed), actualMaxSpeed, actualAcceleration) * this.accelerateValue * this.accelerationBrakeInputAxis() * 0.7;
          } else {
              this.speed += 0;
          }
        }
    }

    steer() {
        this.prevWantedDirection = this.wantedDirection;

        var angleDiff = Math.abs(this.wantedDirection - this.direction);

        //steer forward
        if (this.speed > 0.1) {
            //check if car can turn normaly or it has opposition
            if (Math.sign(this.actualSteer) == this.steerInputAxis())
            {
                this.actualSteer += this.steerAmount / 6 * this.steerInputAxis();
            }
            else
            {
                this.actualSteer += this.steerAmount * this.steerInputAxis();
            }
        }
        //steer backward
        else if(this.speed < -0.1) {
            this.wantedDirection -= 1 * this.steerInputAxis();
        }

        //limit steer angle
        if (Math.abs(this.actualSteer) > this.steerMaxAngle) {
            this.actualSteer = this.steerMaxAngle * (Math.sign(this.actualSteer));
        }

        //reset values when car isn't moving
        if (this.speed < 3) {
            this.actualSteer = Math.lerp(this.actualSteer, 0, 0.05);
            this.direction = Math.lerp(this.direction, this.wantedDirection, 0.1);
        }

        //limit speed in drift
        if (angleDiff > 10) {
            this.speed = Math.lerp(this.speed, this.speed / angleDiff / 5, 0.01);
        }


        //update wanted direction with actualSteer value
        this.wantedDirection += this.actualSteer;
    }

    handbrake() {
        if (input.isDown(input.spaceBar) && this.speed > 0.5)
        {
            this.actualSteer += this.steerAmount / 3 * this.steerInputAxis();
            this.speed -= this.brakeForce;
        }
    }

    steerInputAxis() {
        var value = 0;

        //assign value with 1, 0, -1 by steer input
        if (input.isDown(input.left) || input.isDown(input.leftA))
        {
            value = -1;
        }
        else if (input.isDown(input.right) || input.isDown(input.rightA))
        {
            value = 1;
        }
        else
        {
            value = 0;
        }

        return value;
    }

    accelerationBrakeInputAxis() {
        var value = 0;

        //assign value with 1, 0, -1 by pedals input
        if (input.isDown(input.up) || input.isDown(input.upA))
        {
            value = 1;
        }
        else if (input.isDown(input.down) || input.isDown(input.downA))
        {
            value = -1;
        }
        else
        {
            value = 0;
        }

        return value;
    }

    updateXAndYWithVector() {
        this.direction = Math.lerp(this.direction, this.wantedDirection, 0.02 / Math.clamp(Math.abs(this.speed) / 2)/*don't drift if speed is smaller than 2*/);
        this.x += this.speed * Math.cos(this.direction * Math.PI / 180);
        this.y += this.speed * Math.sin(this.direction * Math.PI / 180);
    }

    slowDownByAtmosphere() {
        if (!input.isDown(input.up) && !input.isDown(input.down)) {
            if (this.speed > 0) {
                this.speed -= this.atmosphereSlowDown;
            }
            else if (this.speed < 0) {
                this.speed += this.atmosphereSlowDown;
            }
        }
    }

    updateDriftScore() {
        var angleDiff = (Math.round(Math.abs(Math.abs(this.wantedDirection) - Math.abs(this.direction))));

        if(gameR.map.objectIsColliding) {

            //drift multiplier
            //count when drift is over
            if (angleDiff < this.minDriftAngle && this.afterDrift)
            {
                this.timeFromPrevDrift++;
            }

            //check if time for multiplier continue on next drift is over and not drifting
            if (this.timeFromPrevDrift > 250 && angleDiff < this.minDriftAngle)
            {
                this.driftScoreMultiplier = 1;
                this.timeFromPrevDrift = 0;
                this.afterDrift = false;
            }

            //increase multiplier
            if (this.timeFromPrevMultiplierValue > 100)
            {
                this.driftScoreMultiplier++;
                //reset multiplier timer
                this.timeFromPrevMultiplierValue = 0;
            }


            //drift score
            if(angleDiff > this.minDriftAngle && this.speed > 4.2)
            {
                this.driftScore += this.driftScoreMultiplier;
                this.afterDrift = true;
                this.inDrift = true;

                this.timeFromPrevMultiplierValue++;

                if(this.skidSoundVol != null && this.skidSoundVol.gain.value < 0.5) { this.skidSoundVol.gain.value += 0.02; }
            } else { this.inDrift = false; }
        }
        else {
            this.timeFromPrevMultiplierValue = 0;
            this.timeFromPrevDrift = 0;
            this.afterDrift = 0;
            this.driftScoreMultiplier = 1;
            this.inDrift = false;
        }

    }

    playSkidSound() {
        if(this.inDrift && !this.playingSkidSound) {
            //create sound and play
            this.skidSoundSource = audioContext.createBufferSource();
            this.skidSoundSource.buffer = sounds[1];

            this.skidSoundVol = audioContext.createGain();
            this.skidSoundVol.gain.value = 0;

            this.skidSoundSource.loop = true;

            this.skidSoundSource.connect(this.skidSoundVol);
            this.skidSoundVol.connect(audioContext.destination);

            this.skidSoundSource.start(0);

            this.playingSkidSound = true;
        } else if(!this.inDrift && this.playingSkidSound) {
            this.skidSoundSource.stop();
            this.skidSoundSource = null;
            this.playingSkidSound = false;
        }
    }

    changeEngineSoundPitch() {
        if(input.isDown(input.up) || input.isDown(input.upA)) {
            gameR.engineSoundSource.playbackRate.value = Math.lerp(gameR.engineSoundSource.playbackRate.value, 1.1, this.power);
            gameR.engineSoundVol.gain.value = Math.lerp(gameR.engineSoundVol.gain.value, 0.23, this.power);
        } else {
            gameR.engineSoundSource.playbackRate.value = Math.lerp(gameR.engineSoundSource.playbackRate.value, 0.3, 0.03);
            gameR.engineSoundVol.gain.value = Math.lerp(gameR.engineSoundVol.gain.value, 0.03, 0.03);
        }
    }

    updateColPositions() {
        this.colX = this.x - 55 * Math.cos(this.wantedDirection * Math.PI / 180);
        this.colY = this.y - 55 * Math.sin(this.wantedDirection * Math.PI / 180);
    }


    update() {
        this.prevX = this.x;
        this.prevY = this.y;

        if (gameR.state == 0) {

            //input
            this.steer();
            this.accelerateBrake();
            this.handbrake();
        }
        //count drift score
        this.updateDriftScore();

        //slow down speed when gas button is not pressed
        this.slowDownByAtmosphere();

        //move x and y of car with vector
        this.updateXAndYWithVector();

        //engine sound
        this.changeEngineSoundPitch();

        this.playSkidSound();

        this.updateColPositions();
    }

    draw(ctx, viewX, viewY) {

        //draw car shadow
        ctx.save();
        ctx.translate(this.x - viewX -5, this.y - viewY +5);
        ctx.rotate(this.wantedDirection * Math.PI / 180);
        this.car.shadow.draw(ctx,(-this.car.img.width/4)*3, -this.car.img.height/2, 1);
        ctx.restore();

        //draw car and turning wheels
        ctx.save();
        ctx.translate(this.x - viewX, this.y - viewY);
        ctx.rotate(this.wantedDirection * Math.PI / 180);

        //wheels
        if (this.steerInputAxis() == 1) {
            spr_turningWheelsRight.draw(ctx,(-spr_turningWheelsRight.width/4)*3, -spr_turningWheelsRight.height/2, 1);
        } else if (this.steerInputAxis() == -1) {
            spr_turningWheelsLeft.draw(ctx,(-spr_turningWheelsLeft.width/4)*3, -spr_turningWheelsLeft.height/2, 1);
        }
        //car
        this.car.img.draw(ctx,(-this.car.img.width/4)*3, -this.car.img.height/2, 1);

        ctx.restore();
    }
}

function carCollisionBehavior(car) {

    
    //stop car and port car to previous positions
    //car.speed = 0;
    car.x = car.prevX;
    car.y = car.prevY;

    //set car directin to previous
    car.wantedDirection = car.prevWantedDirection;

    //play hit sound and decrease engine sound volume and pitch
    var prevDif = (Math.abs(car.x - car.prevX) + Math.abs(car.y - car.prevY)) /2;
    if(prevDif > 4) { playSound(sounds[8], false); }
    gameR.engineSoundSource.playbackRate.value = Math.lerp(gameR.engineSoundSource.playbackRate.value, 0.3, 0.01);
    gameR.engineSoundVol.gain.value = Math.lerp(gameR.engineSoundVol.gain.value, 0.03, 0.01);

    //stop drift score
    car.timeFromPrevMultiplierValue = 0;
    car.timeFromPrevDrift = 0;
    car.afterDrift = 0;
    car.driftScoreMultiplier = 1;
    car.inDrift = false;
}
