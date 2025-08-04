interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-3xl font-bold mb-6">Benvenuto nella Dashboard</h1>
      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
      >
        Esci
      </button>
    </div>
  );
}