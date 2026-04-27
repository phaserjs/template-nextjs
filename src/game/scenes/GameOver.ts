import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

interface IGameOverData
{
    score?: number;
    best?: number;
}

export class GameOver extends Scene
{
    background!: Phaser.GameObjects.Image;
    gameOverText!: Phaser.GameObjects.Text;
    scoreText!: Phaser.GameObjects.Text;
    bestText!: Phaser.GameObjects.Text;
    promptText!: Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameOver');
    }

    create (data: IGameOverData)
    {
        const { width, height } = this.scale;
        const score = data.score ?? 0;
        const best = data.best ?? score;

        this.background = this.add.image(width / 2, height / 2, 'background').setAlpha(0.22);
        this.add.rectangle(width / 2, height / 2, width, height, 0x200b0b, 0.78);

        this.gameOverText = this.add.text(width / 2, 230, 'GAME OVER', {
            fontFamily: 'Arial Black',
            fontSize: 84,
            color: '#ffd3d3',
            stroke: '#000000',
            strokeThickness: 10
        }).setOrigin(0.5);

        this.scoreText = this.add.text(width / 2, 380, `Score: ${score}`, {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#fff4c4',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.bestText = this.add.text(width / 2, 455, `Best: ${best}`, {
            fontFamily: 'Arial',
            fontSize: 38,
            color: '#d2f4ff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.promptText = this.add.text(width / 2, 580, 'Press SPACE or tap to play again', {
            fontFamily: 'Arial Black',
            fontSize: 30,
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
        this.scene.start('MainMenu');
    }
}
