import { GameScene } from './common/GameScene';

export class GameOver extends GameScene {
    constructor() {
        super('GameOver');
    }

    create() {
        this.camera.setBackgroundColor(0xff0000);
        this.background.setAlpha(0.5);

        this.sceneText = this.add
            .text(512, 384, 'Game Over', {
                fontFamily: 'Arial Black',
                fontSize: 64,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 8,
                align: 'center',
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.eventBus.emit('current-scene-ready', this);
    }

    changeScene() {
        this.scene.start('MainMenu');
    }
}
