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

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { cliente: 'Foodify' }
      }
    });

    if (!error) {
      onSuccess();
    } else {
      alert('Errore: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Registrazione per {email}</h2>
      <input
        type="password"
        placeholder="Inserisci password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Registrati</button>
    </div>
  );
}
