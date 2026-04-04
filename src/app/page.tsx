import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-dc-blue-50 via-white to-dc-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-dc-blue-600 to-dc-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-dc-blue-600/20">
          <span className="text-white text-xl font-bold font-display">DC</span>
        </div>
        <h1 className="text-4xl font-display font-bold text-dc-gray-900 mb-2">
          DataCore Studio
        </h1>
        <p className="text-dc-gray-500 mb-8">
          Sistema de generacion de contenido con IA
        </p>
        <Link
          href="/studio"
          className="bg-gradient-to-r from-dc-blue-600 to-dc-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-dc-blue-600/25 transition-all"
        >
          Abrir Studio
        </Link>
      </div>
    </main>
  );
}
