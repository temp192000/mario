let config = {
    // type: Phaser.AUTO,
    type: Phaser.CANVAS,
    
    scale:{
        mode: Phaser.Scale.FIT,
        width: 800,
        height: 600,
    },

    backgroundColor: 0xffff11,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1000
            },
            // debug: true,
        }
    },

    scene:{
        preload: preload,
        create: create,
        update: update,
    }
};

let game = new Phaser.Game(config);
let gameConfig = {
    playerSpeed: 150,
    playerJumpSpeed: -700
}

function preload(){
    this.load.image('ground', './assets/topground.png');
    this.load.image('apple', './assets/apple.png');
    this.load.image('sky', './assets/background.png');
    this.load.spritesheet('dude', './assets/dude.png', {
        frameWidth: 32,
        frameHeight: 48
    });
}

function create(){
    W = game.config.width;
    H = game.config.height;

    let ground = this.add.tileSprite(0, H-128, W, 128, 'ground');
    ground.setOrigin(0, 0);

    let background = this.add.sprite(0, 0, 'sky');
    background.setOrigin(0, 0);
    background.displayWidth = W;
    // background.displayWidth = H;
    background.depth = -1;

    this.player = this.physics.add.sprite(100, 100, 'dude', 4);
    this.player.setBounce(0.3);

    this.player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'center',
        frames: this.anims.generateFrameNumbers('dude', {start: 4, end: 4}),
        frameRate: 10,
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1
    });


    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.existing(ground, true);
    // ground.body.allowGravity = false;
    // ground.body.immovable = true;

    let apple = this.physics.add.group({
        key: 'apple',
        repeat: 8,
        setScale: {
            x: 0.2,
            y: 0.2
        },
        setXY: {
            x: 10,
            y: 0,
            stepX: 100
        }
    });
    
    // this.physics.add.collider(ground, apple);
    apple.children.iterate(function(f){
        f.setBounce(Phaser.Math.FloatBetween(0.4, 0.7));
    });

    let platforms = this.physics.add.staticGroup();
    platforms.create(500, 350, 'ground').setScale(2, 0.5).refreshBody();
    platforms.create(700, 200, 'ground').setScale(2, 0.5).refreshBody();
    platforms.create(100, 200, 'ground').setScale(2, 0.5).refreshBody();
    platforms.add(ground);

    this.physics.add.collider(platforms, apple);
    this.physics.add.collider(platforms, this.player);
    // this.physics.add.collider(this.player, apple); //unrealistic
    this.physics.add.overlap(this.player, apple, eatApple, null, this);

    this.cameras.main.setBounds(0, 0, W, H);
    this.physics.world.setBounds(0, 0, W, H);

    this.cameras.main.startFollow(this.player, true, true);
    this.cameras.main.setZoom(1.5);
}

function update(){
    if(this.cursors.left.isDown){
        this.player.setVelocityX(-gameConfig.playerSpeed);
        this.player.anims.play('left', true);
    }else if(this.cursors.right.isDown){
        this.player.setVelocityX(gameConfig.playerSpeed);
        this.player.anims.play('right', true);
    }else{
        this.player.setVelocityX(0);
        this.player.anims.play('center', true);
    }

    if(this.cursors.up.isDown && this.player.body.touching.down){
        this.player.setVelocityY(gameConfig.playerJumpSpeed);
    }
}


function eatApple(player, apple){
    apple.disableBody(true, true);
}