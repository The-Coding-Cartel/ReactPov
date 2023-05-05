import Phaser from "phaser";
import { SplashScene } from "./scenes/splashScene";
import { TitleScene } from "./scenes/titleScene";
import { MenuScene } from "./scenes/menuScene";
import { GameScene } from "./scenes/gameScene";
import PhaserRaycaster from "phaser-raycaster";

export class PhaserApp {
  constructor({ width, height, id }) {
    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: id,
      width: width, //896
      height: height, //992
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: true,
        },
      },

      scene: [SplashScene, TitleScene, MenuScene, GameScene],
      plugins: {
        scene: [
          {
            key: "PhaserRaycaster",
            plugin: PhaserRaycaster,
            mapping: "raycasterPlugin",
          },
        ],
      },
    });
  }
  update = () => {
    this.game.events.emit("update");
  };

  destroy = () => {
    this.game.destroy(true);
  };
}
