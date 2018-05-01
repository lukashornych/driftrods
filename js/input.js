var input = {
    pressed: {},

	  //buttons keycodes WASD
    left: 65,
    right: 68,
    up: 87,
    down: 83,

    //buttons keycodes ARROWS
    leftA: 37,
    rightA: 39,
    upA: 38,
    downA: 40,

    spaceBar: 32,
    enter: 13,

    //return true or false
    isDown: function(keyCode) {
        return this.pressed[keyCode];
    },

    //key object is true in pressed collection
    onKeyDown: function(event) {
        this.pressed[event.keyCode] = true;
    },

    //deletes key from pressed collection
    onKeyUp: function(event) {
        delete this.pressed[event.keyCode];
    }
}

var clickInput = {

    onClick: function(event) {
        switch(selectRun)
        {
            case 0:
              menuR.menuClick();
              break;

            case 1:
              garageR.carSelection();
              break;

            case 2:
              trackSelectionR.trackSelection();
              break;

            case 3:
              if(gameR.state == 1) {
                  gameR.stopBackSound();
                  gameR.stopEngineSound();
                  roomGoTo(1);
              }
              break;
        }
    }
}
