import FinancialAppShell from '@/components/financial-app-shell';

export default function Home() {
  return (
    <main className="flex justify-center items-start min-h-screen bg-gray-100 p-0 md:p-4">
      <div className="w-full max-w-sm mx-auto bg-white shadow-lg rounded-3xl overflow-hidden md:mt-8">
          <FinancialAppShell />
      </div>
    </main>
  );
}
