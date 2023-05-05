import Phaser from "phaser";
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("menuScene");
    this.username = "";
    this.background = null;
    this.loginButton = null;
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
    this.load.image("tiles", "./newTiles.png");
    this.load.image("povman", "./povman.png");
    this.load.image("coin", "./coin.png");
    this.load.image("ghost", "./ghost.png");
    this.load.image("powerPill", "./powerPill.png");
    this.load.audio("background-music", "./background.wav");
    this.load.spritesheet("playButton", "./playButtonSpriteSheet.png", {
      frameWidth: 391,
      frameHeight: 160,
    });
  }

  create() {
    this.loginButton = this.add
      .image(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        "googleloginbutton"
      )
      .setScale(0.5);

    this.anims.create({
      key: "playButtonAnims",
      frameRate: 10,
      frames: this.anims.generateFrameNumbers("playButton", {
        start: 0,
        end: 19,
      }),
      repeat: -1,
    });

    this.loginButton.setInteractive({ useHandCursor: true });

    this.loginButton.on("pointerup", () => {
      signInWithPopup(auth, googleProvider).then(({ user }) => {
        this.username = user.displayName;
        this.loginButton.destroy();
        this.playButton = this.add.sprite(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2,
          "playButton"
        );
        this.playButton.play("playButtonAnims");
        this.playButton.setInteractive({ useHandCursor: true });
        this.playButton.on("pointerup", () => {
          this.buttonClicked();
        });
      });
    });
  }

  buttonClicked() {
    this.scene.start("gameScene", { username: this.username, level: 1 });
    this.scene.sleep("menuScene");
  }
}
