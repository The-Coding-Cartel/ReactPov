import Phaser from "phaser";
import ScoreLabel from "../ui/scoreLabel";
import GhostSpawner from "../assets/ghostSpawner";
import {
  addDoc,
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  serverTimestamp,
} from "@firebase/firestore";
import { firestore } from "../../firebase";
export const mapX = 28,
  mapY = 31,
  mapS = 32;

export class GameScene extends Phaser.Scene {
  constructor() {
    super("gameScene");
    this.direction = "up";
    this.enemyDirection = "up";
    this.scoreLabel = null;
    this.ghostSpawner = null;
    this.ghostGroup = null;
    this.hasHit = false;
    this.poweredUp = false;
    this.username = null;
    this.wallsLayer = null;
    this.coins = null;
    this.music = null;
    this.cursors = null;
    this.player = null;
    this.scoreLabel = null;
    this.powerPills = null;
    this.raycaster = null;
    this.ray = null;
  }
  init(data) {
    this.cameras.main.setBackgroundColor("#000000");
    this.username = data.username;
  }

  preload() {
    this.canvas = this.sys.game.canvas;
  }

  create() {
    const newMap = this.make.tilemap({
      key: "tilemap",
    });
    const tileSet = newMap.addTilesetImage("maze", "tiles");
    newMap.createLayer("floor", tileSet);
    this.wallsLayer = newMap.createLayer("walls", tileSet);
    this.wallsLayer.setCollisionByProperty({ collides: true });

    this.coins = this.physics.add.staticGroup();

    newMap.filterTiles((tile) => {
      if (tile.index === -1) {
        this.coins.create(
          tile.pixelX + tile.width / 2,
          tile.pixelY + tile.width / 2,
          "coin"
        );
      }
    });
    this.ghostSpawner = new GhostSpawner(this, "ghost");
    this.ghostGroup = this.ghostSpawner.group;
    for (let i = 0; i < 3; i++) {
      this.ghostSpawner.spawn();
    }
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player = this.createPlayer(430, 425);
    this.scoreLabel = this.createScoreLabel(16, 16, 0);
    this.music = this.sound.add("background-music", { loop: true });
    this.music.play();

    this.physics.add.overlap(
      this.player,
      this.coins,
      this.collectCoin,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.powerPills,
      this.collectPowerPill,
      null,
      this
    );

    this.physics.add.collider(
      this.ghostGroup,
      this.wallsLayer,
      this.changeDir,
      null,
      this
    );
    this.physics.add.collider(this.player, this.wallsLayer);

    this.physics.add.collider(
      this.player,
      this.ghostGroup,
      this.hitGhost,
      null,
      this
    );

    this.createRaycaster();
  }

  update() {
    const ghostsArray = this.ghostGroup.getChildren();
    this.playerMovement(this.cursors);
    ghostsArray.forEach((ghost) => {
      this.enemyMovement(ghost);
    });

    this.physics.world.wrap(this.player, 0);
    this.updateRaycaster();
  }

  createPlayer(xPos, yPos) {
    const player = this.physics.add.sprite(xPos, yPos, "povman").setScale(0.96);
    player.setCircle(15);
    return player;
  }

  playerMovement(cursors) {
    const speed = 125;
    this.player.setVelocity(0);

    switch (this.direction) {
      case "up":
        this.ray.setAngleDeg(270);
        this.player.setVelocityY(-speed);
        break;
      case "down":
        this.ray.setAngleDeg(90);
        this.player.setVelocityY(speed);
        break;
      case "left":
        this.ray.setAngleDeg(180);
        this.player.setVelocityX(-speed);
        break;
      case "right":
        this.ray.setAngleDeg(0);
        this.player.setVelocityX(speed);
        break;
    }

    if (cursors.up.isDown) {
      this.player.setVelocityY(-speed);

      this.direction = "up";
    } else if (cursors.down.isDown) {
      this.player.setVelocityY(speed);

      this.direction = "down";
    }

    if (cursors.left.isDown) {
      this.player.setVelocityX(-speed);

      this.direction = "left";
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(speed);

      this.direction = "right";
    }
  }

  enemyMovement(ghost) {
    const speed = 125;
    ghost.setVelocity(0);

    switch (ghost.direction) {
      case "up":
        ghost.setVelocityY(-speed);
        break;
      case "down":
        ghost.setVelocityY(speed);
        break;
      case "left":
        ghost.setVelocityX(-speed);
        break;
      case "right":
        ghost.setVelocityX(speed);
        break;
    }
  }

  collectCoin(player, coin) {
    coin.disableBody(true, true);
    this.scoreLabel.add(1);
  }

  collectPowerPill(player, powerPill) {
    powerPill.disableBody(true, true);
    this.poweredUp = true;
    this.player.setTint(0xff4444);
    this.time.addEvent({
      delay: 8000,
      callback: () => {
        this.poweredUp = false;
        this.player.clearTint();
      },
      callbackScope: this,
      loop: false,
    });
  }

  hitGhost(player, ghost) {
    if (!this.hasHit && !this.poweredUp) {
      this.physics.pause();
      player.setTint(0xff4444);
      this.submitScore(this.scoreLabel.score);
      this.gameOverText = this.add
        .text(this.canvas.width / 2, this.canvas.height / 2, "Game Over", {
          font: "100px Arial",
          strokeThickness: 2,
          color: "#000000",
          backgroundColor: "#ffffff",
        })
        .setOrigin(0.5);
      this.hasHit = true;
    } else if (this.poweredUp && !this.hasHit) {
      ghost.destroy();
      this.scoreLabel.add(10);
      this.time.addEvent({
        delay: 3000,
        callback: () => {
          this.ghostSpawner.spawn();
        },
        callbackScope: this,
        loop: false,
      });
    }
  }

  changeDir(ghost, wall) {
    const dirs = ["up", "left", "down", "right"];
    const index = Phaser.Math.Between(0, 3);
    ghost.direction = dirs[index];
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: "32px", fill: "#000" };
    const label = new ScoreLabel(this, x, y, score, style);
    this.add.existing(label);
    return label;
  }
  createHighScores(scores) {
    const style = { fontSize: "32px", fill: "#000" };

    scores.forEach(({ score }, index) => {
      const label = new ScoreLabel(this, 100, 50 + 20 * index, score, style);
      this.add.existing(label);
    });
  }
  submitScore(score) {
    const scoreRef = collection(firestore, "scores");
    const highScores = [];
    const q = query(scoreRef, orderBy("score", "desc"), limit(10));
    let data = {
      posted_at: serverTimestamp(),
      score: score,
      username: this.username,
    };

    addDoc(scoreRef, data)
      .then(() => {
        return getDocs(q);
      })
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          highScores.push(doc.data());
        });
        console.log(highScores);
        this.createHighScores(highScores);
      })
      .catch((err) => console.log(err));
  }

  createRaycaster() {
    this.raycaster = this.raycasterPlugin.createRaycaster({ debug: true });
    this.ray = this.raycaster.createRay();
    this.raycaster.mapGameObjects(this.wallsLayer, false, {
      collisionTiles: [1],
    });
    this.ray.setOrigin(this.player.x, this.player.y);
    this.ray.setAngleDeg(0);
    this.ray.setConeDeg(45);

    let intersection = this.ray.castCone();
  }

  updateRaycaster() {
    this.ray.setOrigin(this.player.x, this.player.y);

    let intersection = this.ray.castCone();
  }
}

// drawMap(scene, map, mapX, mapY, mapS) {
//   const graphics = scene.add.graphics();
//   const walls = this.physics.add.staticGroup();
//   this.powerPills = this.physics.add.staticGroup();
//   this.coins = this.physics.add.staticGroup();

//   graphics.fillStyle(0xffffff, 1); // Fill color and alpha
//   graphics.lineStyle(1, 0x000000, 1); // Line width, color, and alpha
//   for (let i = 0; i < map.length; i++) {
//     const x = (i % mapX) * mapS;
//     const y = Math.floor(i / mapX) * mapS;
//     graphics.strokeRect(x, y, mapS, mapS);

//     switch (map[i]) {
//       case 0:
//         this.coins.create(x + mapS / 2, y + mapS / 2, "coin");
//         graphics.fillRect(x, y, mapS, mapS);
//         break;
//       case 1:
//         walls.create(x + mapS / 2, y + mapS / 2, "wall");
//         break;
//       case 5:
//         graphics.fillRect(x, y, mapS, mapS);
//         this.powerPills.create(x + mapS / 2, y + mapS / 2, "powerPill");
//         break;
//     }
//   }
//   scene.add.existing(graphics);
//   return walls;
// }
