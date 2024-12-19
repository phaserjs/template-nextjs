import { Dispatch, memo, RefObject, SetStateAction, useEffect, useLayoutEffect/*, useRef*/ , useState } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';
import { useRenderCount } from "@/hooks"

interface IRefPhaserGame
{
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IPropsPhaserGame{
    ref: RefObject<IRefPhaserGame | null>,
    setCanMoveSprite:Dispatch<SetStateAction<boolean>>
}

const PhaserGame = /*memo(*/({ref, setCanMoveSprite}: IPropsPhaserGame) =>
{
    const renderCount = useRenderCount();
    // const [count, setCount] = useState(0);

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

            console.log("setCanMoveSprite", (ref?.current?.scene?.scene.key === "MainMenu"))

            setCanMoveSprite((ref?.current?.scene?.scene.key === "MainMenu"))
            
        });
        return () =>
        {
            console.log("EventBus.removeListener('current-scene-ready');")

            EventBus.removeListener('current-scene-ready');
        
        }
    }, [/*ref*/]);

    return (
        <div style={{display:'flex', flexDirection:'column'}}>
            {/* 
            <button className="primary" onClick={() => setCount((c) => c + 1)}>
                Increment
            </button>
            <p>Button Count: {count}</p> 
            */}
            <p>PhaserGame Render Count: {renderCount}</p>
            <div id="game-container"></div>
        </div>
    )
}/*)*/;

export {PhaserGame as default, type IRefPhaserGame, type IPropsPhaserGame}