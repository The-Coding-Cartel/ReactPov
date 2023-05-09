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

export class GameScene extends Phaser.Scene {
  constructor() {
    super("gameScene");

    this.scoreLabel = null;
    this.ghostSpawner = null;
    this.ghostGroup = null;
    this.hasHit = false;

    this.username = null;
    this.wallsLayer = null;
    this.coins = null;
    this.music = null;
    this.cursors = null;
    this.player = null;

    this.powerPills = null;
    this.raycaster = null;
    this.ray = null;

    this.fov = -45;
    this.playerAngle = 0;
    this.keyPress = false;
  }
  init(data) {
    this.hasHit = false;
    this.fov = -45;
    this.playerAngle = 0;
    this.keyPress = false;
    if (this.footsteps.isPlaying) {
      this.footsteps.stop();
    }
    if (this.music?.isPlaying) {
      this.music.stop();
    }
    this.currentLevel = data.level;
    this.cameras.main.setBackgroundColor("#4E68E0");
    this.username = data.username;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.leftRotate = this.input.keyboard.addKey("Q");
    this.rightRotate = this.input.keyboard.addKey("E");

    this.cursors.up.on("up", () => {
      if (this.footsteps.isPlaying) {
        this.footsteps.stop();
      }
    });

    this.cursors.down.on("up", () => {
      if (this.footsteps.isPlaying) {
        this.footsteps.stop();
      }
    });

    this.cursors.left.on("up", () => {
      if (this.footsteps.isPlaying) {
        this.footsteps.stop();
      }
    });

    this.cursors.right.on("up", () => {
      if (this.footsteps.isPlaying) {
        this.footsteps.stop();
      }
    });

    this.leftRotate.on("up", () => {
      if (this.playerAngle === 0) {
        this.playerAngle = 270;
      } else {
        this.playerAngle += -90;
      }
    });

    this.rightRotate.on("up", () => {
      if (this.playerAngle === 270) {
        this.playerAngle = 0;
      } else {
        this.playerAngle += 90;
      }
    });
  }

  preload() {
    this.canvas = this.sys.game.canvas;
    this.load.tilemapTiledJSON(
      `tilemap${this.currentLevel}`,
      `./maze${this.currentLevel}.json`
    );
    this.load.audio("footsteps", "./footsteps.mp3");
  }

  create(data) {
    this.add.rectangle(0, 0, this.canvas.width * 2, 540, 0x00cccc);
    this.add.rectangle(0, 540, this.canvas.width * 2, 540, 0xdddddd);
    this.graphics = this.add.graphics();
    this.collectGraphics = this.add.graphics();

    const newMap = this.make.tilemap({
      key: `tilemap${this.currentLevel}`,
    });
    const tileSet = newMap.addTilesetImage("maze", "tiles");
    newMap.createLayer("floor", tileSet).setVisible(false);
    this.wallsLayer = newMap.createLayer("walls", tileSet);
    this.wallsLayer
      .setCollisionByProperty({ collides: true })
      .setVisible(false);

    this.coins = this.physics.add.staticGroup();
    this.powerPills = this.physics.add.staticGroup();
    this.ghostSpawner = new GhostSpawner(this, "ghost");
    this.ghostGroup = this.ghostSpawner.group.setVisible(false);

    newMap.filterTiles((tile) => {
      switch (tile.index) {
        case 3:
          this.coins
            .create(
              tile.pixelX + tile.width / 2,
              tile.pixelY + tile.width / 2,
              "coin"
            )
            .setCircle(15);
          break;
        case 4:
          this.player = this.createPlayer(
            tile.pixelX + tile.width / 2,
            tile.pixelY + tile.width / 2
          );
          break;
        case 5:
          let currentGhost = this.ghostSpawner.spawn(
            tile.pixelX + tile.width / 2,
            tile.pixelY + tile.width / 2
          );

          break;
        case 6:
          this.powerPills.create(
            tile.pixelX + tile.width / 2,
            tile.pixelY + tile.width / 2,
            "powerPill"
          );
          break;
        default:
          break;
      }
    });
    this.powerPills.setVisible(false);

    this.coins.setVisible(false);
    this.ghostGroup.setVisible(false);

    this.player.setBounce(0);
    this.player.setDrag(0);
    this.player.setVisible(false);
    this.scoreLabel = this.createScoreLabel(16, 16, data.score || 0);
    this.music = this.sound.add("background-music", {
      loop: true,
      volume: 0.5,
    });
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

    this.footsteps = this.sound.add("footsteps", { loop: true, volume: 2 });

    this.createRaycaster();
  }

  update() {
    const ghostsArray = this.ghostGroup.getChildren();
    if (!this.hasHit) {
      this.playerMovement(this.cursors);
      this.updateRaycaster();
    }
    ghostsArray.forEach((ghost) => {
      this.enemyMovement(ghost);
    });
  }

  createPlayer(xPos, yPos) {
    const player = this.physics.add.sprite(xPos, yPos, "povman").setScale(0.6);
    player.setCircle(12);
    return player;
  }

  playerMovement(cursors) {
    const speed = 125 / 2;
    this.player.setVelocity(0);
    if (
      cursors.up.isDown ||
      cursors.down.isDown ||
      cursors.left.isDown ||
      cursors.right.isDown
    ) {
      if (!this.footsteps.isPlaying) {
        this.footsteps.play();
      }
    }

    if (cursors.up.isDown) {
      switch (this.playerAngle) {
        case 270:
          this.player.setVelocityY(-speed);
          break;
        case 90:
          this.player.setVelocityY(speed);
          break;
        case 180:
          this.player.setVelocityX(-speed);
          break;
        case 0:
          this.player.setVelocityX(speed);
          break;
      }
    } else if (cursors.down.isDown) {
      switch (this.playerAngle) {
        case 270:
          this.player.setVelocityY(speed);
          break;
        case 90:
          this.player.setVelocityY(-speed);
          break;
        case 180:
          this.player.setVelocityX(speed);
          break;
        case 0:
          this.player.setVelocityX(-speed);
          break;
      }
    }

    if (cursors.left.isDown) {
      switch (this.playerAngle) {
        case 270:
          this.player.setVelocityX(-speed);
          break;
        case 90:
          this.player.setVelocityX(speed);
          break;
        case 180:
          this.player.setVelocityY(speed);
          break;
        case 0:
          this.player.setVelocityY(-speed);
          break;
      }
    } else if (cursors.right.isDown) {
      switch (this.playerAngle) {
        case 270:
          this.player.setVelocityX(speed);
          break;
        case 90:
          this.player.setVelocityX(-speed);
          break;
        case 180:
          this.player.setVelocityY(-speed);
          break;
        case 0:
          this.player.setVelocityY(speed);
          break;
      }
    }
  }

  enemyMovement(ghost) {
    const speed = 50;
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

    const ghostDistance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      ghost.x,
      ghost.y
    );
  }

  collectCoin(player, coin) {
    coin.disableBody(true, true);
    this.scoreLabel.add(1);
  }

  collectPowerPill(player, powerPill) {
    if (this.currentLevel < 5) {
      this.add
        .text(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2,
          `Congrats Moving to Level ${this.currentLevel + 1}`,
          {
            font: "50px Arial",
            strokeThickness: 2,
            color: "#000000",
            backgroundColor: "#ffffff",
          }
        )
        .setOrigin(0.5);
      this.time.addEvent({
        delay: 2000,
        callback: () => {
          this.music.stop();
          this.scene.start("gameScene", {
            username: this.username,
            level: this.currentLevel + 1,
            score: this.scoreLabel.score,
          });
        },
        callbackScope: this,
        loop: false,
      });
    } else {
      this.hitGhost(this.player);
    }
  }

  hitGhost(player, ghost) {
    this.hasHit = true;
    this.player.disableBody();
    this.raycaster.removeMappedObjects(this.wallsLayer);
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
    this.playAgain = this.add
      .text(
        this.canvas.width / 2,
        this.canvas.height / 2 + 100,
        "Play Again?",
        {
          font: "100px Arial",
          strokeThickness: 2,
          color: "#000000",
          backgroundColor: "#ffffff",
        }
      )
      .setOrigin(0.5);
    this.playAgain.setInteractive({ useHandCursor: true });
    this.playAgain.on("pointerup", () => {
      this.music.stop();
      this.hasHit = false;
      this.scene.start("gameScene", {
        username: this.username,
        level: 1,
        score: 0,
      });
    });
    this.physics.pause();
  }

  changeDir(ghost, wall) {
    const dirs = ["up", "left", "down", "right"];
    const index = Phaser.Math.Between(0, 3);
    ghost.direction = dirs[index];
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: "32px", fill: "#000" };
    const label = new ScoreLabel(this, 350, y, score, style).setOrigin(0.5);
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

        this.createHighScores(highScores);
      })
      .catch((err) => console.log(err));
  }

  createSquare(intersection) {
    this.graphics.clear();

    let angleToCalcuate = this.fov;

    for (let i = 0; i < intersection.length; i++) {
      let distance = Phaser.Math.Distance.Between(
        this.ray.origin.x,
        this.ray.origin.y,
        intersection[i]?.x || 0,
        intersection[i]?.y || 0
      );

      let ca = this.playerAngle - angleToCalcuate;

      ca = ca * 0.0174532925;

      if (ca < 0) {
        ca += 2 * Math.PI;
      }

      if (ca > 2 * Math.PI) {
        ca -= 2 * Math.PI;
      }

      let adjustedDistance = distance * Math.cos(ca);

      let inverse = (32 * 320) / adjustedDistance;
      if (intersection[i].object.type === "TilemapLayer") {
        const inverseClamp = Math.floor(Phaser.Math.Clamp(inverse, 0, 255));

        const hex = this.RGBtoHex(inverseClamp, 0, 0);
        this.graphics.lineStyle(5, 0xff00ff, 1.0);
        this.graphics.fillStyle(Number(hex));
        this.graphics.fillRect(
          0 + i * 2.8125,
          262.5,
          2.8125,
          Phaser.Math.Clamp(inverse, 0, 496)
        );
        this.graphics.fillRect(
          0 + i * 2.8125,
          262.5,
          2.8125,
          Phaser.Math.Clamp(-inverse, -496, 0)
        );
      } else if (intersection[i].object.type !== "TilemapLayer") {
        const inverseClamp = Math.floor(Phaser.Math.Clamp(inverse, 0, 255));
        const hex = this.RGBtoHex(0, inverseClamp, 0);
        this.graphics.lineStyle(5, 0xff00ff, 1.0);
        this.graphics.fillStyle(Number(hex));
        this.graphics.fillRect(
          0 + i * 2.8125,
          262.5,
          2.8125,
          Phaser.Math.Clamp(inverse, 0, 496)
        );
        this.graphics.fillRect(
          0 + i * 2.8125,
          262.5,
          2.8125,
          Phaser.Math.Clamp(-inverse, -496, 0)
        );
      }
      angleToCalcuate += 0.1875;
    }
  }

  createRaycaster() {
    this.raycaster = this.raycasterPlugin.createRaycaster();
    this.ray = this.raycaster.createRay();
    this.raycaster.mapGameObjects(this.wallsLayer, false, {
      collisionTiles: [2],
    });
    this.raycaster.mapGameObjects(this.ghostGroup.getChildren(), true);
    this.ray.setOrigin(this.player.x, this.player.y);
    this.ray.setAngleDeg(0);
  }

  updateRaycaster() {
    const intersections = [];
    for (let i = 0; i < 480; i++) {
      this.ray.setAngleDeg(this.fov);
      const intersect = this.ray.cast();
      intersections.push(intersect);
      this.fov += 0.1875;
    }
    this.fov = this.playerAngle - 45;
    this.ray.setOrigin(this.player.x, this.player.y);

    this.createSquare(intersections);
  }

  colorToHex(color) {
    const hexadecimal = color.toString(16);
    return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
  }

  RGBtoHex(red, green, blue) {
    return (
      "0x" +
      this.colorToHex(red) +
      this.colorToHex(green) +
      this.colorToHex(blue)
    );
  }
}
