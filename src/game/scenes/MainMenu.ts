import { GameScene } from './common/GameScene';
import { GameObjects } from 'phaser';

export class MainMenu extends GameScene {
    logo: GameObjects.Image | undefined;
    logoTween: Phaser.Tweens.Tween | undefined;

    constructor() {
        super('MainMenu');
    }

    create() {
        this.logo = this.add.image(512, 300, 'logo').setDepth(100);

        this.sceneText = this.add
            .text(512, 460, 'Main Menu', {
                fontFamily: 'Arial Black',
                fontSize: 38,
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
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = undefined;
        }
        this.scene.start('Game');
    }

    moveLogo(reactCallback: ({ x, y }: { x: number; y: number }) => void) {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            } else {
                this.logoTween.play();
            }
        } else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (reactCallback && this.logo) {
                        reactCallback({
                            // why not use the tween args?
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y),
                        });
                    }
                },
            });
        }
    }
}
