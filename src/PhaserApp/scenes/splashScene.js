import Phaser from "phaser";

export class SplashScene extends Phaser.Scene {
  constructor() {
    super("splashScene");
    this.background = null;
  }

  init() {
    this.cameras.main.setBackgroundColor("#000000");
  }

  preload() {
    this.load.image("codingCartel", "./coding cartel.png");
    this.load.image("title-img", "./povmaze.png");
  }

  create() {
    this.background = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 10,
      "codingCartel"
    );
    let scaleX = this.cameras.main.width / this.background.width;
    let scaleY = this.cameras.main.height / this.background.height;
    let scale = Math.max(scaleX, scaleY);
    this.background.setScale(scale).setScrollFactor(0);
  }

  update(time, delta) {
    if (time > 3000) {
      this.scene.switch("titleScene");
    }
  }
}
