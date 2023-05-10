import Phaser from "phaser";

const formatDistance = (distance) =>
  `Distance to Goal: ${Math.floor(distance / 10)}`;

export default class DistanceLabel extends Phaser.GameObjects.Text {
  constructor(scene, x, y, distance, style) {
    super(scene, x, y, formatDistance(distance), style);
    this.distance = distance;
  }

  setDistance(distance) {
    this.distance = distance;
    this.updateDistanceText();
  }

  calcDist(playerX, playerY, exitX, exitY) {
    const currentDist = Phaser.Math.Distance.Between(
      playerX,
      playerY,
      exitX,
      exitY
    );
    this.setDistance(currentDist);
  }

  updateDistanceText() {
    this.setText(formatDistance(this.distance));
  }
}
