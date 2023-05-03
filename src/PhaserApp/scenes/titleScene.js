import Phaser from "phaser";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super("titleScene");
    this.background = null;
  }

  init() {
    this.cameras.main.setBackgroundColor("#4E68E0");
    this.background = this.add.sprite(0, 0, "title-img");
    this.background.x = 400;
    this.background.y = 300;
  }

  preload() {}

  create() {}

  update(time, delta) {
    if (time > 3000) {
      this.scene.switch("menuScene");
    }
  }
}
