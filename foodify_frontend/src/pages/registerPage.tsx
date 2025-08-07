import { useEffect, useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_ANON_KEY!
);

interface Invite {
  email: string;
  used: boolean;
}


export default function RegisterPage() {
  const [invite, setInvite] = useState<Invite | null>(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token');
    if (t !== null) {
      setToken(t);
    }
    if (t) {
      supabase
        .from('invites')
        .select('*')
        .eq('token', t)
        .single()
        .then(({ data }) => {
          if (data && !data.used) {
            setInvite(data);
          } else {
            alert('Token non valido o già usato');
          }
        });
    }
  }, []);

  const handleSuccess = async () => {
    await supabase
      .from('invites')
      .update({ used: true })
      .eq('token', token);

    alert('Registrazione completata!');
  };

  return invite ? (
    <RegisterForm email={invite.email} onSuccess={handleSuccess} />
  ) : (
    <p>Verifica token...</p>
  );
}
