import { EventBus } from '../EventBus';
import { Input, Math as PhaserMath, Scene } from 'phaser';

export class Game extends Scene
{
    background!: Phaser.GameObjects.Image;
    player!: Phaser.GameObjects.Rectangle;
    playerBody!: Phaser.Physics.Arcade.Body;
    stars!: Phaser.Physics.Arcade.Group;
    scoreText!: Phaser.GameObjects.Text;
    livesText!: Phaser.GameObjects.Text;
    hintText!: Phaser.GameObjects.Text;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    keys!: { left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
    spawnTimer!: Phaser.Time.TimerEvent;
    score: number;
    lives: number;
    fallSpeed: number;

    constructor ()
    {
        super('Game');
        this.score = 0;
        this.lives = 3;
        this.fallSpeed = 220;
    }

    create ()
    {
        const { width, height } = this.scale;

        this.score = 0;
        this.lives = 3;
        this.fallSpeed = 220;

        this.background = this.add.image(width / 2, height / 2, 'background').setAlpha(0.25);
        this.add.rectangle(width / 2, height / 2, width, height, 0x08111f, 0.55);

        this.player = this.add.rectangle(width / 2, height - 60, 170, 26, 0xffd166)
            .setStrokeStyle(3, 0xffffff, 0.85);
        this.physics.add.existing(this.player);

        this.playerBody = this.player.body as Phaser.Physics.Arcade.Body;
        this.playerBody.setCollideWorldBounds(true);
        this.playerBody.setImmovable(true);
        this.playerBody.setAllowGravity(false);

        this.stars = this.physics.add.group({
            allowGravity: false,
            immovable: false
        });

        this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);

        this.scoreText = this.add.text(24, 18, 'Score: 0', {
            fontFamily: 'Arial Black',
            fontSize: 34,
            color: '#fff4c4',
            stroke: '#000000',
            strokeThickness: 6
        });

        this.livesText = this.add.text(width - 24, 18, 'Lives: 3', {
            fontFamily: 'Arial Black',
            fontSize: 34,
            color: '#ff6b6b',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(1, 0);

        this.hintText = this.add.text(width / 2, height - 20, 'Use ARROWS or A / D to move', {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#cfe1ff'
        }).setOrigin(0.5, 1);

        this.cursors = this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys;
        this.keys = this.input.keyboard?.addKeys({
            left: Input.Keyboard.KeyCodes.A,
            right: Input.Keyboard.KeyCodes.D
        }) as { left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };

        this.spawnTimer = this.time.addEvent({
            delay: 800,
            loop: true,
            callback: this.spawnStar,
            callbackScope: this
        });

        EventBus.emit('current-scene-ready', this);
    }

    update ()
    {
        if (!this.playerBody)
        {
            return;
        }

        const moveLeft = this.cursors.left.isDown || this.keys.left.isDown;
        const moveRight = this.cursors.right.isDown || this.keys.right.isDown;

        if (moveLeft)
        {
            this.playerBody.setVelocityX(-520);
        }
        else if (moveRight)
        {
            this.playerBody.setVelocityX(520);
        }
        else
        {
            this.playerBody.setVelocityX(0);
        }

        const stars = this.stars.getChildren() as Phaser.Physics.Arcade.Image[];

        stars.forEach((star) => {
            if (!star.active)
            {
                return;
            }

            if (star.y > this.scale.height + 24)
            {
                this.missStar(star);
            }
        });
    }

    spawnStar ()
    {
        const x = PhaserMath.Between(40, this.scale.width - 40);
        const star = this.stars.create(x, -20, 'star') as Phaser.Physics.Arcade.Image;

        star.setScale(PhaserMath.FloatBetween(0.8, 1.4));
        star.setVelocity(PhaserMath.Between(-30, 30), this.fallSpeed + PhaserMath.Between(0, 110));
        star.setAngularVelocity(PhaserMath.Between(-260, 260));
        star.setBounce(1, 1);
        star.setCollideWorldBounds(false);
    }

    collectStar (
        _playerObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile,
        starObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile
    )
    {
        const star = starObj as Phaser.Physics.Arcade.Image;

        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);

        this.tweens.add({
            targets: this.player,
            scaleX: 1.08,
            scaleY: 1.08,
            yoyo: true,
            duration: 80
        });

        star.destroy();

        if (this.score % 5 === 0)
        {
            this.increaseDifficulty();
        }
    }

    missStar (star: Phaser.Physics.Arcade.Image)
    {
        star.destroy();

        this.lives -= 1;
        this.livesText.setText(`Lives: ${this.lives}`);

        this.cameras.main.shake(120, 0.004);

        if (this.lives <= 0)
        {
            this.endGame();
        }
    }

    increaseDifficulty ()
    {
        this.fallSpeed += 35;

        const nextDelay = Math.max(280, this.spawnTimer.delay - 45);
        if (nextDelay !== this.spawnTimer.delay)
        {
            this.spawnTimer.remove(false);
            this.spawnTimer = this.time.addEvent({
                delay: nextDelay,
                loop: true,
                callback: this.spawnStar,
                callbackScope: this
            });
        }

        this.hintText.setText('Speed Up! Keep catching!');
        this.time.delayedCall(900, () => {
            if (this.scene.isActive('Game'))
            {
                this.hintText.setText('Use ARROWS or A / D to move');
            }
        });
    }

    endGame ()
    {
        this.spawnTimer.remove(false);
        this.stars.clear(true, true);

        const best = this.getBestScore(this.score);
        this.scene.start('GameOver', { score: this.score, best });
    }

    getBestScore (score: number)
    {
        let currentBest = 0;

        try
        {
            const raw = window.localStorage.getItem('star-catcher-best') || '0';
            currentBest = Number.parseInt(raw, 10) || 0;

            if (score > currentBest)
            {
                window.localStorage.setItem('star-catcher-best', String(score));
                return score;
            }
        }
        catch (error)
        {
            // Ignore storage failures and continue with in-memory score.
        }

        return Math.max(score, currentBest);
    }

    changeScene ()
    {
        this.endGame();
    }
}
