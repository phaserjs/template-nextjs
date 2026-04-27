import { GameObjects, Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class MainMenu extends Scene
{
    background!: GameObjects.Image;
    logo!: GameObjects.Image;
    title!: GameObjects.Text;
    subtitle!: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor ()
    {
        super('MainMenu');
        this.logoTween = null;
    }

    create ()
    {
        const { width, height } = this.scale;

        this.background = this.add.image(width / 2, height / 2, 'background').setAlpha(0.35);

        this.add.rectangle(width / 2, height / 2, width - 120, height - 140, 0x0c1220, 0.75)
            .setStrokeStyle(3, 0x66e3ff, 0.9);

        this.logo = this.add.image(width / 2, 180, 'logo').setScale(0.8).setDepth(10);

        this.title = this.add.text(width / 2, 300, 'STAR CATCHER', {
            fontFamily: 'Arial Black',
            fontSize: 64,
            color: '#fff4c4',
            stroke: '#101420',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.subtitle = this.add.text(width / 2, 420, 'Move left and right to catch stars\nMiss 3 and the game is over', {
            fontFamily: 'Arial',
            fontSize: 30,
            color: '#dce8ff',
            align: 'center',
            lineSpacing: 12
        }).setOrigin(0.5);

        this.add.text(width / 2, 560, 'Press SPACE or tap to start', {
            fontFamily: 'Arial Black',
            fontSize: 34,
            color: '#66e3ff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.input.keyboard?.once('keydown-SPACE', () => this.changeScene());
        this.input.once('pointerdown', () => this.changeScene());

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
    }

    moveLogo (reactCallback: ({ x, y }: { x: number, y: number }) => void)
    {
        if (this.logoTween)
        {
            if (this.logoTween.isPlaying())
            {
                this.logoTween.pause();
            }
            else
            {
                this.logoTween.play();
            }
            return;
        }

        this.logoTween = this.tweens.add({
            targets: this.logo,
            x: { value: 790, duration: 2200, ease: 'Sine.easeInOut' },
            y: { value: 100, duration: 1600, ease: 'Sine.easeInOut' },
            yoyo: true,
            repeat: -1,
            onUpdate: () => {
                reactCallback({
                    x: Math.floor(this.logo.x),
                    y: Math.floor(this.logo.y)
                });
            }
        });
    }
}
