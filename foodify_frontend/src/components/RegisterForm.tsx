import { useState } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_ANON_KEY!
);

interface RegisterFormProps {
  email: string;
  onSuccess: () => void;
}

export default function RegisterForm({ email, onSuccess }: RegisterFormProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { cliente: 'Foodify' }
      }
    });

    if (!error) {
      onSuccess();
    } else {
      setError(error.message);
    }
  };

  return (
    <form 
      onSubmit={handleRegister} 
      className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded"
    >
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
          placeholder="Inserisci password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <button 
        type="submit" 
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Registrati
      </button>
    </form>
  );
}
