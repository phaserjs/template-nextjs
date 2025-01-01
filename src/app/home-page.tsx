'use client'

import App from "@/App"
 
// This is a Client Component
// It receives data as props, has access to state and effects, and is
// prerendered on the server during the initial page load.
export default function HomePage() {
  return (
    <main>
        <App />
    </main>
  )
}