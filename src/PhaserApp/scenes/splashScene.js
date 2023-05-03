import Phaser from "phaser";

export class SplashScene extends Phaser.Scene {
  constructor() {
    super("splashScene");
    this.background = null;
  }

  init() {
    this.cameras.main.setBackgroundColor("#ffffff");
  }

  preload() {
    this.load.image("codingCartel", "./coding cartel.png");
    this.load.image("title-img", "./POVMAN-title.jpg");
  }

  create() {
    this.background = this.add.sprite(0, 0, "codingCartel");
    this.background.x = 400;
    this.background.y = 300;
  }

  update(time, delta) {
    if (time > 3000) {
      this.scene.switch("titleScene");
    }
  }
}
