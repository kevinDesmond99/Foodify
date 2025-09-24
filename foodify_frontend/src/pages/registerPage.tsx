// src/pages/RegisterPage.tsx
import { useEffect, useState } from 'react';
import RegisterForm from '../components/RegisterForm';

interface InviteResponse {
  valid: boolean;
  email?: string;
}

export default function RegisterPage() {
  const [token, setToken] = useState<string>('');
  const [invite, setInvite] = useState<{ email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token');
    if (!t) {
      setError('Token mancante');
      return;
    }
    setToken(t);

    fetch(`http://localhost:8000/validate-token/${t}`)
      .then(async (res) => {
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          throw new Error(e.detail || 'Token non valido');
        }
        return res.json();
      })
      .then((data: InviteResponse) => {
        if (data.valid && data.email) {
          setInvite({ email: data.email });
        } else {
          setError('Token non valido o già usato');
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;
  if (!invite) return <p className="text-center mt-10">Verifica token...</p>;

  return <RegisterForm email={invite.email} token={token} />;
}
