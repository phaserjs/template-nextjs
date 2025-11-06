# Phaser Game Integration in Next.js App

This document explains how Phaser 3 is integrated into a Next.js application, providing a comprehensive guide for implementing similar functionality in a modal or other React components.

## Architecture Overview

The integration follows a clean separation of concerns:
- **Next.js App Router** handles the React application structure
- **Client-side rendering** ensures Phaser runs only in the browser
- **React component wrapper** manages Phaser lifecycle
- **Event system** enables communication between React and Phaser

## Key Components

### 1. Client-Side Rendering Setup

```typescript
// src/app/ClientAppWrapper.tsx
"use client";

import dynamic from "next/dynamic";

const AppWithoutSSR = dynamic(() => import("@/App"), { ssr: false });

export default function ClientAppWrapper() {
    return <AppWithoutSSR />;
}
```

**Purpose**: Disables server-side rendering for the Phaser game since Phaser requires browser APIs.

### 2. PhaserGame Component

```typescript
// src/PhaserGame.tsx
export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(
    function PhaserGame({ currentActiveScene }, ref) {
        const game = useRef<Phaser.Game | null>(null);

        useLayoutEffect(() => {
            if (game.current === null) {
                game.current = StartGame("game-container");
                // Set up ref for parent component access
            }

            return () => {
                // Cleanup: destroy game instance
                if (game.current) {
                    game.current.destroy(true);
                    game.current = null;
                }
            };
        }, [ref]);

        return <div id="game-container"></div>;
    }
);
```

**Key Features**:
- Uses `useLayoutEffect` for synchronous DOM manipulation
- Manages Phaser game lifecycle (creation and cleanup)
- Provides ref access to game instance and current scene
- Renders a container div where Phaser mounts

### 3. Game Initialization

```typescript
// src/game/main.ts
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',  // Matches the div id
    backgroundColor: '#028af8',
    scene: [Boot, Preloader, MainMenu, MainGame, GameOver]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}
```

**Configuration**:
- `parent`: Specifies the DOM element to mount to
- `type: AUTO`: Automatically chooses WebGL or Canvas
- Scene array defines the game flow

### 4. Event Communication System

```typescript
// src/game/EventBus.ts
import { Events } from 'phaser';

export const EventBus = new Events.EventEmitter();
```

**Usage in Scenes**:
```typescript
// In MainMenu.ts
create() {
    // ... scene setup ...
    EventBus.emit('current-scene-ready', this);
}
```

**Usage in React**:
```typescript
useEffect(() => {
    EventBus.on("current-scene-ready", (scene_instance: Phaser.Scene) => {
        if (currentActiveScene) {
            currentActiveScene(scene_instance);
        }
    });
    return () => {
        EventBus.removeListener("current-scene-ready");
    };
}, [currentActiveScene, ref]);
```

## Application Flow

### 1. Next.js App Structure
```
page.tsx → ClientAppWrapper → App.tsx → PhaserGame.tsx
```

### 2. Game Initialization Sequence
1. **ClientAppWrapper** disables SSR
2. **App.tsx** renders with client-side hydration
3. **PhaserGame** component mounts
4. **useLayoutEffect** triggers game creation
5. **StartGame** initializes Phaser with config
6. **Boot scene** starts automatically
7. **EventBus** notifies React when scenes are ready

### 3. Scene Lifecycle
```
Boot → Preloader → MainMenu → Game → GameOver
```

Each scene emits `'current-scene-ready'` when fully initialized.

## React-Phaser Communication

### From React to Phaser
```typescript
const changeScene = () => {
    if (phaserRef.current) {
        const scene = phaserRef.current.scene as MainMenu;
        if (scene) {
            scene.changeScene();
        }
    }
};
```

### From Phaser to React
```typescript
// In Phaser scene
moveLogo(reactCallback: ({ x, y }: { x: number, y: number }) => void) {
    this.logoTween = this.tweens.add({
        targets: this.logo,
        onUpdate: () => {
            if (reactCallback) {
                reactCallback({
                    x: Math.floor(this.logo.x),
                    y: Math.floor(this.logo.y)
                });
            }
        }
    });
}
```

## Implementation for Modal Use Case

To implement this in a modal, follow these key principles:

### 1. Modal Component Structure
```typescript
const GameModal = ({ isOpen, onClose }) => {
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="modal-content">
                {isOpen && <PhaserGame ref={phaserRef} />}
            </div>
        </Modal>
    );
};
```

### 2. Conditional Rendering
- Only render `PhaserGame` when modal is open
- This ensures proper cleanup when modal closes

### 3. Cleanup Considerations
```typescript
useEffect(() => {
    return () => {
        // Modal cleanup will trigger PhaserGame cleanup
        // No additional cleanup needed if using conditional rendering
    };
}, []);
```

### 4. Modal-Specific Styling
```css
.modal-content {
    width: 1024px;
    height: 768px;
    /* Ensure container matches game dimensions */
}

#game-container {
    width: 100%;
    height: 100%;
}
```

## Best Practices

### 1. Memory Management
- Always destroy Phaser game instance on component unmount
- Use conditional rendering for modals to ensure cleanup
- Remove event listeners in useEffect cleanup

### 2. Performance
- Use `useLayoutEffect` for DOM manipulation
- Disable SSR for Phaser components
- Consider lazy loading for large game assets

### 3. Error Handling
```typescript
useLayoutEffect(() => {
    try {
        if (game.current === null) {
            game.current = StartGame("game-container");
        }
    } catch (error) {
        console.error("Failed to initialize Phaser game:", error);
    }

    return () => {
        try {
            if (game.current) {
                game.current.destroy(true);
                game.current = null;
            }
        } catch (error) {
            console.error("Failed to cleanup Phaser game:", error);
        }
    };
}, []);
```

### 4. TypeScript Integration
- Define interfaces for game refs and props
- Type scene instances for better IntelliSense
- Use Phaser's built-in TypeScript definitions

## Common Gotchas

1. **SSR Issues**: Always disable SSR for Phaser components
2. **Container Element**: Ensure the container div exists before game initialization
3. **Memory Leaks**: Always cleanup game instances and event listeners
4. **Modal Timing**: Use conditional rendering rather than visibility toggles
5. **Asset Loading**: Handle loading states and errors gracefully

## Conclusion

This integration pattern provides a robust foundation for embedding Phaser games in React applications. The key is proper lifecycle management, clean separation of concerns, and reliable communication between React and Phaser through the EventBus system.

For modal implementations, the same principles apply with additional consideration for conditional rendering and cleanup timing.
