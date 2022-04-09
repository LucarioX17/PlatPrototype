var Phaser = Phaser || {};

// CONFIGURATIONS
var config = {
    type: Phaser.AUTO,
    
    scale: {
        width: 1280,
        height: 720,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.FIT,
    },
    
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: true,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// GLOBAL VARIABLES
var game = new Phaser.Game(config);
var cam, platforms, cursors, player, level;
//var shakeDuration = 100, shakeIntensity = 0.005;

function preload() {
    // PRELOAD ASSETS
    this.load.image('square', 'img/square.png');
}

function create() {
    // CREATE PLATFORMS STATIC GROUP
    platforms = this.physics.add.staticGroup();

    // CREATE LEVEL
    var randomLevel = getRandomInt(1, 4);
    level = allLevels[randomLevel-1];

    for (var i=0; i<level.length; i++) {
        for (var j=0; j<level[i].length; j++) {
            switch (level[i][j]) {
                case 1:
                    platforms.create(j*32, i*32, 'square');
                    break;
                
                /*case 2:
                    player = new Character(this, j*32, i*32, "square", cursors);
                    break;*/
            }
        }
    }

    player = new Character(this, 640, 500, "square", cursors);

    // INITIALIZE COLLIDERS
    this.physics.add.collider(player, platforms);

    // DETECT KEYBOARD INPUTS
    cursors = this.input.keyboard.createCursorKeys();

    // MAIN CAMERA
    cam = this.cameras.main;
    cam.setBackgroundColor('#1b0326');

    // DEBUG INPUT
    this.physics.world.drawDebug = false;
    this.toggleDebug = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
}

function update() {
    player.update();

    // OUT OF ROOM
    var offset = 64;
    if (player.x < -offset || player.x > 1280+offset || player.y < -offset || player.y > 720+offset) {
        this.scene.restart();
    }

    // DEBUG TOGGLE
    if (Phaser.Input.Keyboard.JustDown(this.toggleDebug)) {
        if (this.physics.world.drawDebug) {
            this.physics.world.drawDebug = false;
            this.physics.world.debugGraphic.clear();
        }
        else {
            this.physics.world.drawDebug = true;
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}