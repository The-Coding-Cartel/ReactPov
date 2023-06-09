/* eslint-disable default-case */
import Phaser from "phaser";
import ScoreLabel from "../ui/scoreLabel";
import DistanceLabel from "../ui/distanceLabel";
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
    this.distanceLabel = null;
    this.scoreLabel = null;
    this.ghostSpawner = null;
    this.ghostGroup = null;
    this.hasHit = false;
    this.levelEnd = null;
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
    this.playerSpeed = 65;
  }
  init(data) {
    this.playerSpeed = 65;
    this.hasHit = false;
    this.levelEnd = false;
    this.fov = -45;
    this.playerAngle = 0;
    this.keyPress = false;
    if (this.footsteps?.isPlaying) {
      this.footsteps.stop();
    }
    if (this.music?.isPlaying) {
      this.music.stop();
    }
    if (this.heartbeatAudio?.isPlaying) {
      this.heartbeatAudio.stop();
    }
    this.currentLevel = data.level;
    this.cameras.main.setBackgroundColor("#4E68E0");
    this.username = data.username;
    this.playerAngle = 0;
    this.fov = -45;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.leftRotate = this.input.keyboard.addKey("Q");
    this.rightRotate = this.input.keyboard.addKey("E");
    this.cursors.shift.on("down", () => {
      this.playerSpeed = 100;
      this.footsteps.setRate(1.5);
    });
    this.cursors.shift.on("up", () => {
      this.playerSpeed = 65;
      this.footsteps.setRate(1);
    });
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
    this.load.audio("heartbeat", "./heartbeat.mp3");
    this.load.audio("death", "./death.mp3");
    this.load.image("gameOverScreen", "./gameover.png");
  }

  create(data) {
    this.anims.create({
      key: "audioToggleOn",
      frameRate: 0,
      frames: this.anims.generateFrameNumbers("audioToggle", {
        start: 0,
        end: 0,
      }),
    });
    this.audioToggler = this.add
      .sprite(64, 64, "audioToggle")
      .setDepth(Number.MAX_VALUE)
      .setScale(1)
      .setInteractive({ useHandCursor: true });

    this.audioToggler.on("pointerup", () => {
      if (this.music.isPlaying) {
        this.music.stop();
        this.audioToggler.setFrame(1);
      } else {
        this.music.play();
        this.audioToggler.setFrame(0);
      }
    });

    let gameoverBG = this.add.image(0, 0, "gameOverScreen").setOrigin(0, 0);
    this.endScreen = this.add
      .container(0, 0, gameoverBG)
      .setDepth(Number.MAX_VALUE);
    this.endScreen.alpha = 0;

    this.add.rectangle(0, 0, this.canvas.width * 2, 540, 0x363831);
    this.add.rectangle(0, 540, this.canvas.width * 2, 540, 0x202615);
    this.graphics = this.add.graphics();

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
          this.ghostSpawner.spawn(
            tile.pixelX + tile.width / 2,
            tile.pixelY + tile.width / 2
          );

          break;
        case 6:
          this.powerPills = this.physics.add.sprite(
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
    this.distanceLabel = this.createDistanceLabel(this.canvas.width / 2, 16, 0);
    this.scoreLabel = this.createScoreLabel(
      this.canvas.width / 2,
      48,
      data.score || 0
    );
    this.music = this.sound.add("background-music", {
      loop: true,
      volume: 0.2,
    });
    this.music.play();
    this.heartbeatAudio = this.sound.add("heartbeat", {
      loop: true,
      volume: 0.2,
    });
    this.heartbeatAudio.play();
    this.deathAudio = this.sound.add("death", { loop: false });
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

    this.footsteps = this.sound.add("footsteps", { loop: true, volume: 2.5 });

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
    this.distanceLabel.calcDist(
      this.player.x,
      this.player.y,
      this.powerPills.x,
      this.powerPills.y
    );

    const tempoModifier = Phaser.Math.Percent(
      this.findClosestGhost(this.player, ghostsArray),
      0,
      1,
      100
    );
    if (!this.levelEnd) {
      this.heartbeatAudio.setRate(1.2 + tempoModifier);
    } else {
      this.heartbeatAudio.setRate(1);
    }
  }

  createPlayer(xPos, yPos) {
    const player = this.physics.add.sprite(xPos, yPos, "povman").setScale(0.6);
    player.setCircle(12);
    return player;
  }

  playerMovement(cursors) {
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
          this.player.setVelocityY(-this.playerSpeed);
          break;
        case 90:
          this.player.setVelocityY(this.playerSpeed);
          break;
        case 180:
          this.player.setVelocityX(-this.playerSpeed);
          break;
        case 0:
          this.player.setVelocityX(this.playerSpeed);
          break;
      }
    } else if (cursors.down.isDown) {
      switch (this.playerAngle) {
        case 270:
          this.player.setVelocityY(this.playerSpeed);
          break;
        case 90:
          this.player.setVelocityY(-this.playerSpeed);
          break;
        case 180:
          this.player.setVelocityX(this.playerSpeed);
          break;
        case 0:
          this.player.setVelocityX(-this.playerSpeed);
          break;
      }
    }

    if (cursors.left.isDown) {
      switch (this.playerAngle) {
        case 270:
          this.player.setVelocityX(-this.playerSpeed);
          break;
        case 90:
          this.player.setVelocityX(this.playerSpeed);
          break;
        case 180:
          this.player.setVelocityY(this.playerSpeed);
          break;
        case 0:
          this.player.setVelocityY(-this.playerSpeed);
          break;
      }
    } else if (cursors.right.isDown) {
      switch (this.playerAngle) {
        case 270:
          this.player.setVelocityX(this.playerSpeed);
          break;
        case 90:
          this.player.setVelocityX(-this.playerSpeed);
          break;
        case 180:
          this.player.setVelocityY(-this.playerSpeed);
          break;
        case 0:
          this.player.setVelocityY(this.playerSpeed);
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
  }

  collectCoin(player, coin) {
    coin.disableBody(true, true);
    this.scoreLabel.add(1);
  }

  collectPowerPill(player, powerPill) {
    this.powerPills.disableBody(true, true);
    this.player.disableBody(true, true);
    this.levelEnd = true;
    if (this.currentLevel < 5) {
      this.scoreLabel.add(10);
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
      this.scoreLabel.add(500);
      this.hitGhost(this.player);
    }
  }

  hitGhost(player, ghost) {
    this.deathAudio.play();
    const finalScore = this.add
      .text(775, 325, `:${this.scoreLabel.score}`, {
        fontSize: "100px Arial",
        color: "#fff",
      })
      .setDepth(Number.MAX_VALUE);
    finalScore.alpha = 0;
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
      .setOrigin(0.5)
      .setDepth(Number.MAX_VALUE);
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
    this.playAgain.alpha = 0;
    this.hasHit = true;
    this.tweens.add({
      targets: [this.endScreen, finalScore, this.playAgain],
      duration: 500,
      alpha: 1,
    });
    this.player.disableBody();
    this.raycaster.removeMappedObjects(this.wallsLayer);

    this.submitScore(this.scoreLabel.score);

    this.physics.pause();
  }

  changeDir(ghost, wall) {
    const dirs = ["up", "left", "down", "right"];
    const index = Phaser.Math.Between(0, 3);
    ghost.direction = dirs[index];
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: "32px", fill: "#000" };
    const label = new ScoreLabel(this, x, y, score, style).setOrigin(0.5);
    this.add.existing(label);
    return label;
  }
  createDistanceLabel(x, y, distance) {
    const style = { fontSize: "32px", fill: "#000" };
    const label = new DistanceLabel(this, x, y, distance, style).setOrigin(0.5);
    this.add.existing(label);
    return label;
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
        ca += 2 * Math.PI;
      }

      if (ca > 2 * Math.PI) {
        ca -= 2 * Math.PI;
        ca -= 2 * Math.PI;
      }

      let adjustedDistance = distance * Math.cos(ca);

      let inverse = (32 * 320) / adjustedDistance;
      if (intersection[i].object.type === "TilemapLayer") {
        const inverseClamp = Math.floor(Phaser.Math.Clamp(inverse, 0, 255));

        const hex = this.RGBtoHex(0, 0, inverseClamp);
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
      } else if (intersection[i].object.texture.key === "ghost") {
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
      } else if (intersection[i].object.texture.key === "powerPill") {
        this.graphics.lineStyle(5, 0xff00ff, 1.0);
        this.graphics.fillStyle(
          0xffff00,
          Phaser.Math.Percent(distance, 1, 1000)
        );

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
    this.raycaster.mapGameObjects(this.powerPills, false);
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
    return hexadecimal.length === 1 ? "0" + hexadecimal : hexadecimal;
  }

  RGBtoHex(red, green, blue) {
    return (
      "0x" +
      this.colorToHex(red) +
      this.colorToHex(green) +
      this.colorToHex(blue)
    );
  }

  findClosestGhost(player, ghostGroup) {
    let currentClosest = Number.MAX_VALUE;

    for (let ghost of ghostGroup) {
      const calculatedDist = Phaser.Math.Distance.Between(
        player.x,
        player.y,
        ghost.x,
        ghost.y
      );
      if (calculatedDist < currentClosest) {
        currentClosest = calculatedDist;
      }
    }
    return currentClosest;
  }
}
