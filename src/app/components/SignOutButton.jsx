'use client' // Only if you're using Next.js App Router

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      style={{
        padding: '10px 20px',
        backgroundColor: '#e53e3e',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
      }}
    >
      Clear Session (Sign Out)
    </button>
  )
}