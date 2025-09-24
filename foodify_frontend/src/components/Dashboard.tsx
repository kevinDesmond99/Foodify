import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Recupera l'utente loggato
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login"); // redirect alla login
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-3xl font-bold mb-6">
        Benvenuto nella Dashboard {userEmail && `(${userEmail})`}
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
      >
        Esci
      </button>
    </div>
  );
}
