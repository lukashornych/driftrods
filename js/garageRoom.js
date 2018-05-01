class GarageRoom {
    constructor()
    {
        this.cars = [];

        this.carsCount = 0;
        this.selectedCar = 0;
        this.carGaps = 1280;
        this.carsScale = 3;
        this.carDistanceFromGap = windowWidth/2;
        this.cameraLeader = { x: 640, y: 360 };

        this.canPressButtonLeft = true;
        this.canPressButtonRight = true;
    }

    garageInit()
    {
        //get number of cars
        this.carsCount = carsDatabase.length;

        //create cars
        for(var i = 0; i < this.carsCount; i++)
        {
            this.cars[i] = new GarageCar(carsDatabase[i], (this.carGaps * i) + this.carDistanceFromGap, 360);
        }

        //create camera
        this.camera = new Camera(this.cameraLeader, 0, 0, windowWidth, windowHeight, 1280 * this.carsCount, 720);

        //run update and draw
        selectRun = 1;
    }

    update()
    {
        //garage control
        if(input.isDown(input.leftA) && this.selectedCar > 0 && this.canPressButtonLeft){
            this.selectedCar--;
            this.canPressButtonLeft = false;
        }
        else if(!input.isDown(input.leftA)){
            this.canPressButtonLeft = true;
        }

        if(input.isDown(input.rightA) && this.selectedCar < (this.carsCount - 1) && this.canPressButtonRight){
            this.selectedCar++;
            this.canPressButtonRight = false;
        }
        else if(!input.isDown(input.rightA)){
            this.canPressButtonRight = true;
        }

        //move camera leader
        this.cameraLeader.x = Math.lerp(this.cameraLeader.x, (this.carGaps * this.selectedCar) + (this.carGaps / 2), 0.1);

        //update camera position
        this.camera.update();
    }

    draw(ctx)
    {
        ctx.clearRect(0,0,windowWidth, windowHeight);

        ctx.save();
        ctx.fillStyle = "gray";
        ctx.fillRect(0, 0, 1280,720);
        ctx.restore();

        //draw cars
        for(var i=0; i<this.carsCount; i++)
        {
            this.cars[i].draw(ctx, this.camera.viewX);
        }

        //draw specs
        var string = carsDatabase[this.selectedCar].name + "  |  Výkon: " + carsDatabase[this.selectedCar].power +
                    "hp  |  Váha: " + carsDatabase[this.selectedCar].weight + "kg";
        if (boughtCars[this.selectedCar] == 0) { string += ("  |  Cena: " + carsDatabase[this.selectedCar].cost) }
        ctx.save();

        ctx.shadowColor = "black";
        ctx.shadowBlur = 30;

        ctx.fillStyle = "#ffffff";
        ctx.font = "30px Raleway";
        ctx.fillText(string, 50, 65);

        //draw money
        ctx.textAlign = "right";
        ctx.fillText(playerMoney + " korun", windowWidth - 50, 65);

        ctx.textAlign = "center";

        //buttons
        if(boughtCars[this.selectedCar] == 0) {
            if(playerMoney >= carsDatabase[this.selectedCar].cost) {
                ctx.fillStyle = "white";
                ctx.fillText("Klikni pro zakoupení vozu", windowWidth/2, windowHeight - 65);
            } else {
                ctx.fillStyle = "red";
                ctx.fillText("Nemáš dostatek peněz pro zakoupení vozu", windowWidth/2, windowHeight - 65);
            }
        } else if (boughtCars[this.selectedCar] > 0) {
            if(playerMoney >= carsDatabase[this.selectedCar].upgradeCost) {
                  if(boughtCars[this.selectedCar] < 9) {
                    ctx.fillStyle = "#00FF00";
                    ctx.fillText("Vylepšit za " + carsDatabase[this.selectedCar].upgradeCost + " korun", windowWidth/4, windowHeight - 65);
                  } else {
                    ctx.fillStyle = "red";
                    ctx.fillText("Vůz je plně vylepšen", windowWidth/4, windowHeight - 65);
                  }

            } else {
                ctx.fillStyle = "red";
                ctx.fillText("Vylepšení stojí " + carsDatabase[this.selectedCar].upgradeCost + " korun", windowWidth/4, windowHeight - 65);
            }
            ctx.fillStyle = "white";
            ctx.fillText("Pokračovat", (windowWidth/4) *3, windowHeight - 65);
        } else {
            ctx.fillText("Klikni pro pokračování", windowWidth/2, windowHeight - 65);
        }

        ctx.restore();
    }

    carSelection() {
        if(boughtCars[this.selectedCar] == 0) {
            if(playerMoney >= carsDatabase[this.selectedCar].cost) {
                boughtCars[this.selectedCar] = 1;
                playerMoney -= carsDatabase[this.selectedCar].cost;
                saveCookie("playerMoney", playerMoney);
                var boughtCarsStr = boughtCars.join("");
                saveCookie("boughtCars", boughtCarsStr);
                gameR.selectedCar = this.selectedCar;
            }
        } else {
            if(playerMoney > carsDatabase[this.selectedCar].upgradeCost) {
                  //check where is mouse x pos
                  if(mouseX < windowWidth/2) {
                      //upgrade car
                      if (boughtCars[this.selectedCar] < 9) {
                          boughtCars[this.selectedCar]++;
                          carsDatabase[this.selectedCar].power = Math.round(carsDatabase[this.selectedCar].power * 1.14);
                          carsDatabase[this.selectedCar].weight = Math.round(carsDatabase[this.selectedCar].weight * 0.99);
                          playerMoney -= carsDatabase[this.selectedCar].upgradeCost;
                          saveCookie("playerMoney", playerMoney);
                          var boughtCarsStr = boughtCars.join("");
                          saveCookie("boughtCars", boughtCarsStr);
                      }
                  } else {
                      //continue button
                      gameR.selectedCar = this.selectedCar;
                      roomGoTo(2);
                  }
            } else {
                gameR.selectedCar = this.selectedCar;
                roomGoTo(2);
            }

        }
    }
}
