import Phaser from "phaser";

export default class GhostSpawner {
  constructor(scene, ghostKey = "ghost") {
    this.scene = scene;
    this.key = ghostKey;

    this._group = this.scene.physics.add.group();
  }

  get group() {
    return this._group;
  }

  spawn() {
    const ghost = this.group.create(430, 705, this.key).setScale(0.96);
    // ghost.setCircle(15);
    ghost.setCollideWorldBounds(true);
    ghost.direction = "up";

    return ghost;
  }
}
