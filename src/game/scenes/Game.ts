import { GameScene } from './common/GameScene';

export class Game extends GameScene {
    constructor() {
        super('Game');
    }

    create() {
        this.camera.setBackgroundColor(0x00ff00);
        this.background.setAlpha(0.5);

        this.sceneText = this.add
            .text(
                512,
                384,
                'Make something fun!\nand share it with us:\nsupport@phaser.io',
                {
                    fontFamily: 'Arial Black',
                    fontSize: 38,
                    color: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 8,
                    align: 'center',
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.eventBus.emit('current-scene-ready', this);
    }

    changeScene() {
        this.scene.start('GameOver');
    }
}
