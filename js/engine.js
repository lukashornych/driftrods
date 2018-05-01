///////////////////////////////////
///                             ///
///      Project DriftRods      ///
///                             ///
///////////////////////////////////

//engine vars
var canvas;
var context;
var audioContext;
var windowWidth = 1280;
var windowHeight = 720;
var reqAnimFrame;
var selectRun = -1;
var mouseX;
var mouseY;

//money and levels
var playerMoney;
var defaultPlayerMoney = 90000;
var basicMoneyRewards = [7000, 5000, 2000];
var tracksLevels = [1,1,1,1,1];
var boughtCars = [0,0,0,0];
var boughtParkTrack = 0;
var parkTrackPrize = 31500;

//rooms vars
var room = -1; // StartMenu: 0, Garage: 1, TrackSelection: 2, Game: 3
var menuR; //0
var garageR; //1
var trackSelectionR; //2
var gameR; //3

//images vars
var imageSources;
var imagesLoader;

//car info
var carsDatabase = [];

//tracks
var tracksDatabase = [];

//sounds
var bufferLoader;
var soundsUrl = [];
var sounds = [];

//engine
function initEngine() {
    canvas = document.createElement("canvas");

    //set canvas width and height
    canvas.width = windowWidth;
    canvas.height = windowHeight;

    //append canvas to html body
    document.body.appendChild(canvas);

    //get context from canvas
    context = canvas.getContext("2d");

    //audio context (Web Audio Api)
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    audioContext = new AudioContext();

    //add keys event
    window.addEventListener("keydown", function(event) { input.onKeyDown(event); }, false);
    window.addEventListener("keyup", function(event) { input.onKeyUp(event); }, false);
    canvas.addEventListener("click", function(event) { clickInput.onClick(event); }, false);
    canvas.addEventListener("mousemove", function(event) {
        var r = canvas.getBoundingClientRect();
        mouseX = event.clientX - r.left;
		mouseY = event.clientY - r.top;
    }, false);


    //create objects
    imagesLoader = new ImagesLoader();
    menuR = new MenuRoom();
    garageR = new GarageRoom();
    trackSelectionR = new TrackSelection();
    gameR = new GameRoom();

    //load players money from cookies
    if (!checkCookie("playerMoney")) {
        playerMoney = defaultPlayerMoney;
        saveCookie("playerMoney", playerMoney);
    } else {
        playerMoney = parseInt(getCookie("playerMoney"));
    }

    //load tracks levels
    if(checkCookie("tracksLevels")) {
        tracksLevels = getCookie("tracksLevels").split("");
    }

    //load bought cars
    if(checkCookie("boughtCars")) {
        boughtCars = getCookie("boughtCars").split("");
    }

    //load bought park track
    if(checkCookie("boughtParkTrack")) {
        boughtParkTrack = parseInt(getCookie("boughtParkTrack"));
    }

    //load sound
    soundsUrl = ["snd/citySound.wav", "snd/skidSound.wav", "snd/m330EngineSound.wav", "snd/rx07EngineSound.wav", "snd/superrEngineSound.wav", "snd/true86EngineSound.wav", "snd/countdownSound.wav", "snd/countdownFinalSound.wav", "snd/carHitSound.wav"];
    bufferLoader = new BufferLoader(audioContext, soundsUrl, afterSndLoad);
    bufferLoader.load();

    //load images
    imageSources = new Array(
                    //sprites and screens 0,1,2
                    "img/sprites.png", "img/splashScreenBackground.png",
                    "img/startMenuBackground.png",
                    //cars 3,4,5,6
                    "img/garageCarsImages/m330garage.png", "img/garageCarsImages/rx07garage.png",
                    "img/garageCarsImages/superrgarage.png", "img/garageCarsImages/true86garage.png",
                    //maps 7,8,9,10,11
                    "img/tracks/track1.png", "img/tracks/track2.png", "img/tracks/track3.png", "img/tracks/track4.png", "img/tracks/track5.png",
                    //selection maps 12,13,14,15,16
                    "img/tracks/track1min.png", "img/tracks/track2min.png", "img/tracks/track3min.png", "img/tracks/track4min.png", "img/tracks/track5min.png");
    imagesLoader.load(imageSources, afterImgLoad, 0);

    //run engine
    runEngine();
}

function runEngine() {
    var loop = function(currentTime)
    {
        updateEngine();
        drawEngine();
        window.requestAnimationFrame(loop, canvas);
    }
    window.requestAnimationFrame(loop, canvas);
}

function updateEngine() {
    switch(selectRun)
    {
        case 1:
          	garageR.update();
            break;

        case 2:
            trackSelectionR.update();
            break;

        case 3:
            gameR.update();
            break;
    }
}

function drawEngine() {
    switch(selectRun)
    {
        case 1:
            garageR.draw(context);
            break;

        case 2:
            trackSelectionR.draw(context);
            break;

        case 3:
            gameR.draw();
            break;
    }
}

function roomGoTo(roomIndex) {
    room = roomIndex;
    switch(room)
    {
        case 0:
            menuR.menuInit();
            break;

        case 1:
            garageR.garageInit();
            break;

        case 2:
            trackSelectionR.trackSelectionInit();
            break;

        case 3:
            gameR.gameInit();
            break;
    };
}

function afterSndLoad(bufferList) {
    for (var i = 0; i < soundsUrl.length; i++) {
        sounds[i] = bufferList[i];
    }
}

function afterImgLoad(roomIndex) {
    LoadSprites(imagesLoader.images[0]);

    //car info
    carsDatabase = [
        m330 = {
            name: "M330",
            power: 208,
            weight: 1360,
            maxSpeed: 100,
            steerMaxAngle: 50,
            img: spr_m330,
            shadow: spr_m330Shadow,
            imgGarage: imagesLoader.images[3],
            cost: 49820,
            upgradeCost: 21523
        },

        rx07 = {
            name: "RX07",
            power: 276,
            weight: 1340,
            maxSpeed: 100,
            steerMaxAngle: 50,
            img: spr_rx07,
            shadow: spr_rx07Shadow,
            imgGarage: imagesLoader.images[4],
            cost: 70820,
            upgradeCost: 21981
        },

        superr = {
            name: "SUPERR",
            power: 326,
            weight: 1570,
            maxSpeed: 100,
            steerMaxAngle: 50,
            img: spr_superr,
            shadow: spr_superrShadow,
            imgGarage: imagesLoader.images[5],
            cost: 85200,
            upgradeCost: 25400
        },

        true86 = {
            name: "TRUE 86",
            power: 189,
            weight: 1120,
            maxSpeed: 100,
            steerMaxAngle: 50,
            img: spr_true86,
            shadow: spr_true86Shadow,
            imgGarage: imagesLoader.images[6],
            cost: 41500,
            upgradeCost: 13230
        }
    ]

    //upgrade cars from saved values
    for(var i = 0; i<4 ;i++) {
        for(var j=0; j < (boughtCars[i] - 1); j++) {
            carsDatabase[i].power += Math.round(carsDatabase[i].power * 0.14);
        }
        for(var k=0; k < (boughtCars[i] - 1); k++) {
            carsDatabase[i].weight -= Math.round(carsDatabase[i].weight * 0.01);
        }
    }

    //tracks
    tracksDatabase = [
        track1 = {
            img: imagesLoader.images[7],
            imgSelect: imagesLoader.images[12],
            collisionBoxes: [{x: 350, y: 350, width: 2100, height: 350}, {x: 350, y: 700, width: 350, height: 700}, {x: 700, y: 1050, width: 350, height: 1400},
                            {x: 1050, y: 2100, width: 2100, height: 350}, {x: 2450, y: 1400, width: 700, height: 700}, {x: 2800, y: 700, width: 350, height: 700},
                            {x: 2100, y: 700, width: 700, height: 350}],

            barrels: [{x: 473, y: 295, dia: 43}, {x: 380, y: 318, dia: 45}, {x: 317, y: 390, dia: 45}, {x: 280, y: 484, dia: 45},
                      {x: 285, y: 1285, dia: 45}, {x: 315, y: 1370, dia: 45}, {x: 390, y: 1430, dia: 45}, {x: 480, y: 1460, dia: 45},
                      {x: 875, y: 960, dia: 45}, {x: 974, y: 982, dia: 45}, {x: 1065, y: 1030, dia: 45}, {x: 1111, y: 1010, dia: 45},
                      {x: 1127, y: 1191, dia: 45}, {x: 636, y: 2335, dia: 45}, {x: 664, y: 2430, dia: 45}, {x: 740, y: 2488, dia: 45},
                      {x: 840, y: 2520, dia: 45}, {x: 3005, y: 2511, dia: 45}, {x: 3100, y: 2485, dia: 45}, {x: 3167, y: 2410, dia: 45},
                      {x: 3200, y: 2314, dia: 45}, {x: 3210, y: 2240, dia: 45}, {x: 2385, y: 1500, dia: 45}, {x: 2420, y: 1420, dia: 45},
                      {x: 2485, y: 1345, dia: 45}, {x: 3200, y: 820, dia: 45}, {x: 3175, y: 722, dia: 45}, {x: 3100, y: 660, dia: 45},
                      {x: 3000, y: 325, dia: 45}, {x: 2935, y: 616, dia: 45}, {x: 2233, y: 1115, dia: 45}, {x: 2135, y: 1080, dia: 45},
                      {x: 2055, y: 1024, dia: 45}, {x: 2030, y: 925, dia: 45}, {x: 2510, y: 470, dia: 45}, {x: 2480, y: 377, dia: 45},
                      {x: 2410, y: 310, dia: 45}, {x: 2310, y: 276, dia: 45}, {x: 2230, y: 260, dia: 45}],

            walls: [{x: 577, y: 290, width: 1620, height: 23}, {x: 279, y: 591, width: 23 , height: 573}, {x: 746, y: 746, width: 1300, height: 23},
                    {x: 746, y: 769, width: 23, height: 240}, {x: 615, y: 1461, width: 23, height: 745}, {x: 1082, y: 1296, width: 23, height: 734},
                    {x: 1082, y: 2031, width: 1180, height: 23}, {x: 930, y: 2480, width: 1970, height: 23}, {x: 3180, y: 950, width: 23, height: 1165},
                    {x: 2320, y: 1490, width: 94, height: 590}, {x: 2513, y: 1270, width: 210, height: 95}, {x: 2415, y: 2063, width: 335, height: 26},
                    {x: 2840, y: 1734, width: 335, height: 26}],
            startFinishLinePos: {x: 1100, y: 520},
            time: 90000,
            placePrize: [7000, 5500, 4000]
        },

        track2 = {
            img: imagesLoader.images[8],
            imgSelect: imagesLoader.images[13],
            collisionBoxes: [{x: 350, y: 1050, width: 1050, height: 350}, {x: 350, y: 1400, width: 350, height: 1750}, {x: 700, y: 2800, width: 700, height: 350},
                            {x: 1400, y: 3150, width: 350, height: 700}, {x: 350, y: 3500, width: 700, height: 350}, {x: 350, y: 3850, width: 350, height: 700},
                            {x: 350, y: 4200, width: 3150, height: 350}, {x: 3150, y: 3150, width: 350, height: 1050}, {x: 2450, y: 3150, width: 700, height: 350},
                            {x: 1750, y: 3500, width: 1050, height: 350}, {x: 1750, y: 2100, width: 350, height: 1400}, {x: 2100, y: 2100, width: 2100, height: 350},
                            {x: 3150, y: 350, width: 350, height: 1750}, {x: 2450, y: 350, width: 700, height: 350}, {x: 2450, y: 700, width: 350, height: 1050},
                            {x: 1050, y: 1400, width: 1400, height: 350}],

            barrels: [{x: 490, y: 1017, dia: 45}, {x: 390, y: 1040, dia: 45}, {x: 325, y: 1115, dia: 45}, {x: 290, y: 1211, dia: 45}, {x: 290, y: 3055, dia: 45},
                      {x: 320, y: 3150, dia: 45}, {x: 395, y: 3205, dia: 45},{x: 490, y: 3241, dia: 45},  {x: 1216, y: 2770, dia: 45}, {x: 1320, y: 2790, dia: 45},
                      {x: 1405, y: 2835, dia: 45}, {x: 1460, y: 2916, dia: 45}, {x: 1470, y: 2990, dia: 45}, {x: 490, y: 3470, dia: 45}, {x: 390, y: 3490, dia: 45},
                      {x: 325, y: 3570, dia: 45}, {x: 290, y: 3665, dia: 45}, {x: 1460, y: 3690, dia: 45}, {x: 1440, y: 3790, dia: 45}, {x: 1395, y: 3883, dia: 45},
                      {x: 1316, y: 3930, dia: 45}, {x: 1250, y: 3940, dia: 45}, {x: 290, y: 4450, dia: 45}, {x: 316, y: 4545, dia: 45}, {x: 395, y: 4605, dia: 45},
                      {x: 490, y: 4633, dia: 45}, {x: 3375, y: 4650, dia: 45}, {x: 3470, y: 4626, dia: 45}, {x: 3535, y: 4545, dia: 45}, {x: 3570, y: 4450, dia: 45},
                      {x: 3580, y: 4380, dia: 45}, {x: 3330, y: 3100, dia: 45}, {x: 3430, y: 3120, dia: 45}, {x: 3515, y: 3165, dia: 45}, {x: 3570, y: 3250, dia: 45},
                      {x: 3580, y: 3330, dia: 45}, {x: 2580, y: 3100, dia: 45}, {x: 2480, y: 3120, dia: 45}, {x: 2415, y: 3195, dia: 45}, {x: 2375, y: 3290, dia: 45},
                      {x: 2870, y: 3685, dia: 45}, {x: 2855, y: 3790, dia: 45}, {x: 2805, y: 3890, dia: 45}, {x: 2730, y: 3930, dia: 45}, {x: 2650, y: 3950, dia: 45},
                      {x: 1680, y: 3740, dia: 45}, {x: 1710, y: 3835, dia: 45}, {x: 1790, y: 3895, dia: 45}, {x: 1880, y: 3925, dia: 45}, {x: 1895, y: 2065, dia: 45},
                      {x: 1800, y: 2090, dia: 45}, {x: 1735, y: 2165, dia: 45}, {x: 1700, y: 2255, dia: 45}, {x: 3575, y: 2295, dia: 45}, {x: 3555, y: 2400, dia: 45},
                      {x: 3510, y: 2480, dia: 45}, {x: 3430, y: 2535, dia: 45}, {x: 3355, y: 2550, dia: 45}, {x: 3570, y: 475, dia: 45}, {x: 3530, y: 385, dia: 45},
                      {x: 3445, y: 320, dia: 45}, {x: 3350, y: 290, dia: 45}, {x: 2590, y: 293, dia: 45}, {x: 2490, y: 317, dia: 45}, {x: 2425, y: 390, dia: 45},
                      {x: 2390, y: 485, dia: 45}, {x: 1200, y: 1016, dia: 45}, {x: 1300, y: 1033, dia: 45}, {x: 1390, y: 1080, dia: 45}, {x: 1445, y: 1165, dia: 45},
                      {x: 1450, y: 1240, dia: 45}],

            walls: [{x: 555, y: 1020, width: 584, height: 23}, {x: 285, y: 1290, width: 23, height: 1670}, {x: 732, y: 1462, width: 23, height: 288},
                    {x: 732, y: 1492, width: 23, height: 1274}, {x: 995, y: 1490, width: 23, height: 316}, {x: 732, y: 2762, width: 414, height: 23},
                    {x: 584, y: 3220, width: 422, height: 23}, {x: 986, y: 3240, width: 23, height: 214}, {x: 584, y: 3460, width: 106, height: 23},
                    {x: 1440, y: 3036, width: 23, height: 600}, {x: 276, y: 3752, width: 23, height: 600}, {x: 596, y: 4610, width: 2680, height: 23},
                    {x: 730, y: 4160, width: 2378, height: 23}, {x: 3084, y: 3570, width: 23, height: 613}, {x: 3544, y: 3376, width: 23, height: 933},
                    {x: 2608, y: 3107, width: 580, height: 23}, {x: 2142, y: 3446, width: 286, height: 23}, {x: 2142, y: 2553, width: 23, height: 895},
                    {x: 2145, y: 2531, width: 1071, height: 23}, {x: 2010, y: 2065, width: 1070, height: 23}, {x: 3543, y: 557, width: 23, height: 1656},
                    {x: 2680, y: 295, width: 580, height: 23}, {x: 1445, y: 1370, width: 954, height: 23}, {x: 995, y: 1810, width: 286, height: 23}],

            startFinishLinePos: {x: 1930, y: 4410},
            time: 110000,
            placePrize: [6500, 5500, 4500]
        },

        track3 = {
            img: imagesLoader.images[9],
            imgSelect: imagesLoader.images[14],

            collisionBoxes: [{x: 350, y: 350, width: 2450, height: 350}, {x: 350, y: 700, width: 350, height: 1050}, {x: 700, y: 1400, width: 350, height: 700},
                            {x: 700, y: 1750, width: 1050, height: 350}, {x: 1750, y: 2100, width: 350, height: 700}, {x: 350, y: 2450, width: 1400, height: 350},
                            {x: 350, y: 2800, width: 350, height: 700}, {x: 700, y: 3150, width: 2800, height: 350}, {x: 3150, y: 2450, width: 350, height: 700},
                            {x: 2450, y: 2450, width: 700, height: 350}, {x: 2450, y: 1750, width: 350, height: 1050}, {x: 2800, y: 1050, width: 350, height: 1050},
                            {x: 2450, y: 700, width: 350, height: 700}],

            barrels: [{x: 487, y: 280, dia: 45}, {x: 386, y: 300, dia: 45}, {x: 324, y: 375, dia: 45}, {x: 287, y: 475, dia: 45}, {x: 890, y: 1330, dia: 45},
                      {x: 990, y: 1350, dia: 45}, {x: 1070, y: 1400, dia: 45}, {x: 1124, y: 1480, dia: 45}, {x: 1140, y: 1560, dia: 45}, {x: 270, y: 1650, dia: 45},
                      {x: 300, y: 1735, dia: 45}, {x: 383, y: 1795, dia: 45}, {x: 484, y: 1825, dia: 45}, {x: 595, y: 1840, dia: 110}, {x: 618, y: 1933, dia: 45},
                      {x: 526, y: 1922, dia: 45}, {x: 636, y: 2035, dia: 45}, {x: 685, y: 2117, dia: 45}, {x: 760, y: 2160, dia: 45}, {x: 830, y: 280, dia: 45},
                      {x: 450, y: 2380, dia: 45}, {x: 390, y: 2400, dia: 45}, {x: 325, y: 2480, dia: 45}, {x: 286, y: 2574, dia: 45}, {x: 270, y: 3412, dia: 45},
                      {x: 304, y: 3505, dia: 45}, {x: 385, y: 3560, dia: 45}, {x: 484, y: 3595, dia: 45}, {x: 3400, y: 3600, dia: 45}, {x: 3490, y: 3566, dia: 45},
                      {x: 3550, y: 3490, dia: 45}, {x: 3590, y: 3390, dia: 45}, {x: 3600, y: 3317, dia: 45}, {x: 3606, y: 2600, dia: 45}, {x: 3575, y: 2500, dia: 45},
                      {x: 3505, y: 2440, dia: 45}, {x: 3410, y: 2405, dia: 45}, {x: 3084, y: 2165, dia: 45}, {x: 3170, y: 2114, dia: 45}, {x: 3217, y: 2025, dia: 45},
                      {x: 3237, y: 1927, dia: 45}, {x: 3230, y: 1170, dia: 45}, {x: 3200, y: 1073, dia: 45}, {x: 3130, y: 1010, dia: 45}, {x: 3040, y: 975, dia: 45},
                      {x: 2980, y: 970, dia: 45}, {x: 2900, y: 460, dia: 45}, {x: 2870, y: 370, dia: 45}, {x: 2790, y: 310, dia: 45}, {x: 2670, y: 275, dia: 45},
                      {x: 2624, y: 263, dia: 45}, {x: 2395, y: 1300, dia: 45}, {x: 2524, y: 1400, dia: 45}, {x: 2500, y: 1455, dia: 45}, {x: 2600, y: 1490, dia: 45},
                      {x: 2595, y: 1695, dia: 45}, {x: 2500, y: 1718, dia: 45}, {x: 2432, y: 1794, dia: 45}, {x: 2393, y: 1890, dia: 45}, {x: 1926, y: 1673, dia: 45},
                      {x: 2030, y: 1700, dia: 45}, {x: 2116, y: 1733, dia: 45}, {x: 2170, y: 1821, dia: 45}, {x: 2184, y: 1913, dia: 45}, {x: 2195, y: 2630, dia: 45},
                      {x: 2177, y: 2730, dia: 45}, {x: 2130, y: 2834, dia: 45}, {x: 2050, y: 2870, dia: 45}, {x: 1990, y: 2885, dia: 45}, {x: 2400, y: 2700, dia: 45},
                      {x: 2424, y: 2795, dia: 45}, {x: 2500, y: 2855, dia: 45}, {x: 2600, y: 2885, dia: 45}],

            walls: [{x: 603, y: 282, width: 1930, height: 23}, {x: 290, y: 573, width: 23, height: 950}, {x: 747, y: 767, width: 1634, height: 23},
                    {x: 746, y: 790, width: 23, height: 556}, {x: 2360, y: 790, width: 23, height: 410}, {x: 1107, y: 1695, width: 724, height: 23},
                    {x: 2155, y: 1976, width: 23, height: 577}, {x: 2400, y: 1976, width: 23, height: 577}, {x: 745, y: 2862, width: 1163, height: 23},
                    {x: 285, y: 2705, width: 23, height: 577}, {x: 735, y: 3102, width: 2390, height: 23}, {x: 3100, y: 2860, width: 23, height: 242},
                    {x: 600, y: 3550, width: 2690, height: 23}, {x: 3560, y: 2708, width: 23, height: 540}, {x: 3212, y: 1262, width: 23, height: 580},
                    {x: 2865, y: 560, width: 23, height: 430}, {x: 2840, y: 2144, width: 190, height: 90}, {x: 2840, y: 2230, width: 100, height: 106},
                    {x: 2840, y: 2340, width: 510, height: 100}],

            startFinishLinePos: {x: 1752, y: 3350},
            time: 130000,
            placePrize: [6000, 4500, 3500]
        },

        track4 = {
            img: imagesLoader.images[10],
            imgSelect: imagesLoader.images[15],
            collisionBoxes: [{x: 700, y: 350, width: 4900, height: 350}, {x: 350, y: 700, width: 700, height: 350}, {x: 350, y: 1050, width: 350, height: 1400},
                            {x: 700, y: 2100, width: 1400, height: 350}, {x: 1750, y: 1750, width: 1050, height: 350}, {x: 2450, y: 2100, width: 1750, height: 350},
                            {x: 3850, y: 1400, width: 350, height: 700}, {x: 4200, y: 1400, width: 700, height: 350}, {x: 4550, y: 1750, width: 350, height: 700},
                            {x: 4900, y: 2100, width: 700, height: 350}, {x: 5250, y: 700, width: 350, height: 1400}, {x: 4200, y: 700, width: 700, height: 350},
                            {x: 2100, y: 700, width: 1050, height: 1050}],

            barrels: [{x: 284, y: 838, dia: 45}, {x: 324, y: 736, dia: 45}, {x: 388, y: 662, dia: 45}, {x: 484, y: 637, dia: 45}, {x: 640, y: 483, dia: 45},
                      {x: 680, y: 383, dia: 45}, {x: 745, y: 312, dia: 45}, {x: 848, y: 290, dia: 45}, {x: 277, y: 2360, dia: 45}, {x: 307, y: 2451, dia: 45},
                      {x: 390, y: 2510, dia: 45}, {x: 480, y: 2543, dia: 45}, {x: 1684, y: 1940, dia: 45}, {x: 1717, y: 1841, dia: 45}, {x: 1764, y: 1758, dia: 45},
                      {x: 1854, y: 1710, dia: 45}, {x: 1950, y: 1690, dia: 45}, {x: 1984, y: 2545, dia: 45}, {x: 2080, y: 2520, dia: 45}, {x: 2145, y: 2440, dia: 45},
                      {x: 2180, y: 2345, dia: 45}, {x: 2190, y: 2270, dia: 45}, {x: 2400, y: 2350, dia: 45}, {x: 2432, y: 2435, dia: 45}, {x: 2510, y: 2500, dia: 45},
                      {x: 2610, y: 2530, dia: 45}, {x: 3225, y: 1670, dia: 45}, {x: 4115, y: 2540, dia: 45}, {x: 4205, y: 2509, dia: 45}, {x: 4270, y: 2433, dia: 45},
                      {x: 4307, y: 2333, dia: 45}, {x: 4315, y: 2560, dia: 45}, {x: 4510, y: 2350, dia: 45}, {x: 2540, y: 2440, dia: 45}, {x: 4620, y: 2500, dia: 45},
                      {x: 4720, y: 2533, dia: 45}, {x: 3800, y: 1540, dia: 45}, {x: 3835, y: 1440, dia: 45}, {x: 3904, y: 1364, dia: 45}, {x: 4000, y: 1442, dia: 45},
                      {x: 4760, y: 1343, dia: 45}, {x: 4860, y: 1360, dia: 45}, {x: 4950, y: 1410, dia: 45}, {x: 5000, y: 1500, dia: 45}, {x: 5015, y: 1580, dia: 45},
                      {x: 5515, y: 2536, dia: 45}, {x: 5615, y: 2510, dia: 45}, {x: 5680, y: 2430, dia: 45}, {x: 5715, y: 2331, dia: 45}, {x: 5730, y: 2270, dia: 45},
                      {x: 5700, y: 473, dia: 45}, {x: 5673, y: 375, dia: 45}, {x: 5600, y: 310, dia: 45}, {x: 5500, y: 274, dia: 45}, {x: 5415, y: 265, dia: 45}],

            walls: [{x: 958, y: 275, width: 4356, height: 23}, {x: 278, y: 933, width: 23, height: 1296}, {x: 1100, y: 737, width: 990, height: 23},
                    {x: 2065, y: 760, width: 23, height: 985}, {x: 745, y: 2053, width: 970, height: 23}, {x: 590, y: 2506, width: 1296, height: 23},
                    {x: 2872, y: 2060, width: 964, height: 23}, {x: 2714, y: 2500, width: 1295, height: 23}, {x: 4095, y: 1345, width: 585, height: 23},
                    {x: 5690, y: 596, width: 23, height: 1590}, {x: 4572, y: 305, width: 21, height: 417}, {x: 2090, y: 1740, width: 737, height: 26},
                    {x: 2460, y: 1063, width: 366, height: 356}, {x: 2806, y: 303, width: 23, height: 759}, {x: 2151, y: 698, width: 283, height: 25}],

            startFinishLinePos: {x: 1350, y: 2300},
            time: 120000,
            placePrize: [8500, 7000, 5500]
        },

        track5 = {
            img: imagesLoader.images[11],
            imgSelect: imagesLoader.images[16],
            collisionBoxes: [{x: 0, y: 0, width: 3500, height: 2042}],

            barrels: [{x: 2080, y: 943, dia: 25}, {x: 2070, y: 1060, dia: 25}, {x: 2037, y: 1167, dia: 25}, {x: 1935, y: 1221, dia: 25}, {x: 1814, y: 1223, dia: 25},
                      {x: 1765, y: 873, dia: 125}, {x: 1167, y: 1750, dia: 130}, {x: 750, y: 1860, dia: 25}, {x: 787, y: 1964, dia: 25}, {x: 865, y: 2022, dia: 25},
                      {x: 1472, y: 1490, dia: 25}, {x: 1550, y: 1540, dia: 25}, {x: 1593, y: 1640, dia: 25}],

            walls: [{x: 283, y: 283, width: 23, height: 1136}, {x: 312, y: 862, width: 290, height: 20}, {x: 880, y: 283, width: 1037, height: 23},
                    {x: 1740, y: 324, width: 22, height: 145}, {x: 895, y: 573, width: 230, height: 22}, {x: 893, y: 1160, width: 261, height: 21},
                    {x: 1160, y: 580, width: 20, height: 867}, {x: 583, y: 1445, width: 1167, height: 20}, {x: 316, y: 1751, width: 440, height: 23},
                    {x: 1600, y: 1735, width: 640, height: 25}, {x: 2038, y: 572, width: 595, height: 20}, {x: 2615, y: 590, width: 20, height: 865},
                    {x: 2980, y: 285, width: 170, height: 22}, {x: 3195, y: 333, width: 25, height: 195}, {x: 3203, y: 1460, width: 21, height: 583},
                    {x: 2910, y: 1456, width: 20, height: 60}, {x: -1, y: -1, width: 1, height: 2043}, {x: 0, y: -1, width: 3500, height: 1}, {x: 3500, y: -1, width: 1, height: 2043},
                    {x: 0, y: 2042, width: 3500, height: 1}],

            startFinishLinePos: {x: 2600, y: 1650},
            time: 180000,
            placePrize: [30000, 26000, 22000]
        }
    ]

    roomGoTo(roomIndex);
}

//call main function on webpage load
window.onload = function() {
    initEngine();
}
