
import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <WifiOff className="w-16 h-16 text-gray-400 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Anda Sedang Offline</h1>
      <p className="text-gray-600">
        Koneksi internet Anda terputus. Mohon periksa kembali koneksi Anda.
      </p>
    </div>
  );
}
