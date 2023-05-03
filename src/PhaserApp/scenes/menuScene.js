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
    this.background = this.add.sprite(0, 0, "title-img");
    this.background.x = 400;
    this.background.y = 300;
    this.cameras.main.setBackgroundColor("#4E68E0");
  }

  preload() {
    this.load.image("tiles", "./tiles.png");
    this.load.tilemapTiledJSON("tilemap", "./tilemap.json");
    this.load.image("povman", "./povman.png");
    this.load.image("coin", "./coin.png");
    this.load.image("ghost", "./ghost.png");
    this.load.image("powerPill", "./powerPill.png");
    this.load.audio("background-music", "./background.wav");
  }

  create() {
    this.loginButton = this.add
      .text(this.background.x, this.background.y, "Login", {
        font: "64px Arial",
        strokeThickness: 2,
        color: "#000000",
        backgroundColor: "#ffffff",
      })
      .setOrigin();

    this.loginButton.setInteractive({ useHandCursor: true });

    this.loginButton.on("pointerdown", () => {
      signInWithPopup(auth, googleProvider).then(({ user }) => {
        this.username = user.displayName;
        this.loginButton.destroy();
        this.playButton = this.add
          .text(this.background.x, this.background.y, "PLAY GAME", {
            font: "64px Arial",
            strokeThickness: 2,
            color: "#000000",
            backgroundColor: "#ffffff",
          })
          .setOrigin();
        this.playButton.setInteractive({ useHandCursor: true });
        this.playButton.on("pointerdown", () => {
          this.buttonClicked();
        });
      });
    });
  }

  buttonClicked() {
    this.scene.start("gameScene", { username: this.username });
    this.scene.sleep("menuScene");
  }
}
