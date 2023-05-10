import Phaser from "phaser";
import { auth } from "../../firebase";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("menuScene");

    this.username = auth?.currentUser.displayName
      ? auth.currentUser.displayName
      : "guest";
    this.background = null;
    this.playButton = null;
  }

  init() {
    this.background = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 10,
      "title-img"
    );
    let scaleX = this.cameras.main.width / this.background.width;
    let scaleY = this.cameras.main.height / this.background.height;
    let scale = Math.max(scaleX, scaleY);
    this.background.setScale(scale).setScrollFactor(0);
    this.cameras.main.setBackgroundColor("#000000");
  }

  preload() {
    this.load.spritesheet("audioToggle", "./audioToggle.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image("tiles", "./newTiles.png");
    this.load.image("povman", "./povman.png");
    this.load.image("coin", "./coin.png");
    this.load.image("ghost", "./ghost.png");
    this.load.image("powerPill", "./powerPill.png");
    this.load.audio("background-music", "./background.mp3");
    this.load.spritesheet("playButton", "./playButtonSpriteSheet.png", {
      frameWidth: 391,
      frameHeight: 160,
    });
  }

  create() {
    let menuBackground = this.add.image(0, 0, "menuBG").setOrigin(0, 0);
    this.bkgContainer = this.add
      .container(0, 0, menuBackground)
      .setDepth(Number.MAX_VALUE);
    this.bkgContainer.alpha = 0;

    this.anims.create({
      key: "playButtonAnims",
      frameRate: 10,
      frames: this.anims.generateFrameNumbers("playButton", {
        start: 0,
        end: 19,
      }),
      repeat: -1,
    });

    this.playButton = this.add.sprite(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "playButton"
    );
    this.playButton.setDepth(Number.MAX_VALUE);
    this.tweens.add({
      targets: [this.bkgContainer, this.playButton],
      duration: 500,
      alpha: 1,
    });
    this.playButton.play("playButtonAnims");
    this.playButton.setInteractive({ useHandCursor: true });
    this.playButton.on("pointerup", () => {
      this.buttonClicked();
    });
  }

  buttonClicked() {
    this.scene.start("gameScene", { username: this.username, level: 1 });
    this.scene.sleep("menuScene");
  }
}
