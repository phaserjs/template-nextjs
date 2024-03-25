'use client';
import dynamic from 'next/dynamic';

const AppWithoutSSR = dynamic(() => import('./App'), { ssr: false });

export default function Home() {
  return (
    <main>
        <AppWithoutSSR />
    </main>
  );
}
