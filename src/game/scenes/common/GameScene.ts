import { Scene } from 'phaser';
import { EventBus } from '@/game/EventBus';

export abstract class GameScene extends Scene {
    eventBus: Phaser.Events.EventEmitter;
    // @ts-expect-error see init()
    background: Phaser.GameObjects.Image;
    // @ts-expect-error see init()
    camera: Phaser.Cameras.Scene2D.Camera;
    sceneText: Phaser.GameObjects.Text | undefined;
    abstract changeScene(): void;

    constructor(key: string) {
        super(key);
        this.eventBus = EventBus;
    }

    // https://github.com/phaserjs/phaser/pull/7039
    init() {
        // all scenes use this same background
        this.background = this.add.image(512, 384, 'background');
        this.camera = this.cameras.main;
    }
}
