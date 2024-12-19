import { Dispatch, RefObject, SetStateAction, useEffect, useLayoutEffect} from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';

interface IRefPhaserGame
{
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IPropsPhaserGame{
    ref: RefObject<IRefPhaserGame | null>,
    setCanMoveSprite:Dispatch<SetStateAction<boolean>>
}

const PhaserGame = ({ref, setCanMoveSprite}: IPropsPhaserGame) =>
{
    useLayoutEffect(() =>
    {
        if (ref.current === null)
        {
            const game = StartGame("game-container")
            ref.current = { game: game, scene: null };
        }

        return () =>
        {
            if (ref.current?.game)
            {
                let game = ref.current.game
                game.destroy(true);
                if (ref.current.game !== null)
                {
                    ref.current.game = null
                    ref.current = null
                }
            }
        }
    }, [ref]);

    useEffect(() =>
    {
        EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) =>
        {

            const prevRef = ref.current as IRefPhaserGame
            
            ref.current = Object.assign(prevRef, {scene: scene_instance })
            
            setCanMoveSprite((ref?.current?.scene?.scene.key === "MainMenu"))

        });
        return () =>
        {
            EventBus.removeListener('current-scene-ready');
        
        }
    }, [ref]);

    return <div id="game-container"></div>
}

export {PhaserGame as default, type IRefPhaserGame, type IPropsPhaserGame}