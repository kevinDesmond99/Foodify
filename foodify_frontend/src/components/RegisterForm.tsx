// src/components/RegisterForm.tsx
import { useState } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_ANON_KEY!
);

interface RegisterFormProps {
  email: string;
  token: string;
}

export default function RegisterForm({ email, token }: RegisterFormProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1) Registrazione tramite Supabase Auth (hash e salvataggio gestiti da Supabase)
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Metadata opzionali; rimuovi o modifica se non servono
          data: { cliente: 'Foodify' }
        }
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      // 2) Consuma il token sul backend
      const consume = await fetch(`http://localhost:8000/consume-token/${token}`, {
        method: "POST",
      });
      if (!consume.ok) {
        const err = await consume.json().catch(() => ({}));
        throw new Error(err.detail || "Errore nel consumo del token");
      }

      setDone(true);
    } catch (err: any) {
      setError(err.message || "Errore durante la registrazione");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded text-center">
        <h2 className="text-xl font-bold mb-2">Registrazione completata</h2>
        <p className="text-gray-700">Controlla la tua email per confermare l’account (se richiesto) e accedi.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Registrazione</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-600 cursor-not-allowed"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          placeholder="Almeno 8 caratteri"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
          minLength={8}
        />
      </div>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
      >
        {loading ? "Registrazione in corso..." : "Registrati"}
      </button>
    </form>
  );
}
