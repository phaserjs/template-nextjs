import { Dispatch, RefObject, SetStateAction, useEffect, useLayoutEffect, useRef } from 'react';
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
            ref.current = { game: StartGame("game-container"), scene: null };
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
    }, [/*ref*/]);

    useEffect(() =>
    {
        console.log("attach new on()")
        EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) =>
        {

            console.log("EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) =>")

            console.log({EventBus})

            const prevRef = ref.current as IRefPhaserGame

            ref.current = Object.assign(prevRef, {scene: scene_instance })

            setCanMoveSprite((ref?.current?.scene?.scene.key === "MainMenu"))
            
        });
        return () =>
        {
            console.log("EventBus.removeListener('current-scene-ready');")

            EventBus.removeListener('current-scene-ready');
        
        }
    }, [/*ref*/]);

    return (
        <div id="game-container" className={ref?.current?.game ? 'opacity-1' : 'opacity-0'}></div>
    );

};

export {PhaserGame as default, type IRefPhaserGame, type IPropsPhaserGame}