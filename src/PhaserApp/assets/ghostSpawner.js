export default class GhostSpawner {
  constructor(scene, ghostKey = "ghost") {
    this.scene = scene;
    this.key = ghostKey;

    this._group = this.scene.physics.add.group();

    this.id = 0;
  }

  get group() {
    return this._group;
  }

  spawn(xPos, yPos) {
    const ghost = this.group.create(xPos, yPos, this.key).setScale(1);
    // ghost.setCircle(15);
    ghost.setCollideWorldBounds(true);
    ghost.direction = "up";
    ghost.id = this.id++;

    return ghost;
  }
}
