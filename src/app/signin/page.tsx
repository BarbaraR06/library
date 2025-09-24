"use client";
import { signIn } from 'next-auth/react';

export default function SignInPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Iniciar sesión</h1>
      <button onClick={() => signIn('github')}>Entrar con GitHub</button>
    </main>
  );
}


