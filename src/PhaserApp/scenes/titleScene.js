import Phaser from "phaser";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super("titleScene");
    this.background = null;
  }

  init() {}

  preload() {
    this.load.image("googleloginbutton", "./googleloginbutton.png");
  }

  create() {
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

  update(time, delta) {
    if (time > 5000) {
      this.scene.switch("menuScene");
    }
  }
}
