import { useEffect, useState } from 'react';
import RegisterForm from '../components/RegisterForm';

interface InviteResponse {
  valid: boolean;
  email?: string;
}

export default function RegisterPage() {
  const [token, setToken] = useState<string>('');
  const [invite, setInvite] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token');
    console.log(t);
    if (t) {
      setToken(t);
      fetch(`http://localhost:8000/validate-token/${t}`)
        .then((res) => res.json())
        .then((data: InviteResponse) => {
          console.log(data);
          if (data.valid && data.email) {
            setInvite({ email: data.email });
          } else {
            alert('Token non valido o già usato');
          }
        })
        .catch(() => {
          alert('Errore nella verifica del token');
        });
    }
  }, []);

  const handleSuccess = async () => {
    await fetch(`http://localhost:8000/consume-token/${token}`, {
      method: 'POST',
    });
    alert('Registrazione completata!');
  };

  return invite ? (
    <RegisterForm email={invite.email} onSuccess={handleSuccess} />
  ) : (
    <p>Verifica token...</p>
  );
}
