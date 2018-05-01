class MenuRoom {

    menuInit() {
        //draw splash geekwork screen
        this.drawSplashScreen(context);

        //wait 4 seconds and then draw menu
        var that = this;
        setTimeout(function() {
            that.drawStartMenu(context);
            //run update
            selectRun = 0;
        }, 4000);
    }

    drawSplashScreen(ctx) {
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, windowWidth, windowHeight);
        ctx.restore();
        ctx.drawImage(imagesLoader.images[1], windowWidth/2 - imagesLoader.images[1].width/2, windowHeight/2 - imagesLoader.images[1].height/2);
    }

    drawStartMenu(ctx) {
        ctx.drawImage(imagesLoader.images[2], 0, 0);

        //draw cookies warning
        ctx.save();
        ctx.shadowColor = "black";
        ctx.shadowBlur = 20;
        ctx.fillStyle = "white";
        ctx.font = "15px Raleway";
        ctx.textAlign = "center";
        ctx.fillText("Tato hra využívá cookies pro ukládání hry.", windowWidth/2, 30);
        ctx.restore();
		
		//draw remove cookies
        ctx.save();
        ctx.shadowColor = "black";
        ctx.shadowBlur = 20;
        ctx.fillStyle = "red";
        ctx.font = "15px Raleway";
        ctx.textAlign = "right";
        ctx.fillText("Vymazat uložený postup.", windowWidth - 23, 30);
        ctx.restore();

        //draw game name
        ctx.save();
        ctx.shadowColor = "black";
        ctx.shadowBlur = 30;
        ctx.fillStyle = "white";
        ctx.font = "110px Raleway";
        ctx.textAlign = "center";
        ctx.fillText("DriftRods", windowWidth/2, 250)

        //draw game description
        ctx.fillStyle = "red";
        ctx.font = "35px Raleway";
        ctx.fillText("arcade drifting game", windowWidth/2, 305);

        //draw continue text
        ctx.fillStyle = "white";
        ctx.fillText("Klikni pro pokračování", windowWidth/2, 600);

        //team members
        ctx.fillStyle = "white";
        ctx.font = "20px Raleway";
        ctx.textAlign = "left";
        ctx.fillText("Grafika:", 30, windowHeight-55);
        ctx.fillText("Vladimír Tipelt", 30, windowHeight-25);
ctx
        ctx.textAlign = "center";
        ctx.fillText("Programování:", windowWidth/2, windowHeight-55);
        ctx.fillText("Lukáš Hornych", windowWidth/2, windowHeight-25);

        ctx.textAlign = "right";
        ctx.fillText("Testování:", windowWidth - 30, windowHeight-55);
        ctx.fillText("Tomáš Hrodek", windowWidth -30, windowHeight-25);
        ctx.restore();
    }
	
	menuClick() {
		if(mouseX > 1070 && mouseY < 40) {
			//remove all saved data
			playerMoney = defaultPlayerMoney;
			saveCookie("playerMoney", defaultPlayerMoney);
			
			tracksLevels = [1,1,1,1,1];
			var tracksLevelsStr = tracksLevels.join("");
			saveCookie("tracksLevels", tracksLevelsStr);
			
			boughtCars = [0,0,0,0];
			var boughtCarsStr = boughtCars.join("");
			saveCookie("boughtCars", boughtCarsStr);
			
			boughtParkTrack = 0;
			saveCookie("boughtParkTrack", boughtParkTrack);
		} else {
			roomGoTo(1);
		}
	}
}
