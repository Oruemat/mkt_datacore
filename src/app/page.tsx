import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-dc-navy flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-display font-bold text-white mb-4">
          DataCore Studio
        </h1>
        <p className="text-dc-muted mb-8">
          Sistema de generacion de contenido con IA
        </p>
        <Link
          href="/studio"
          className="bg-dc-electric text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Abrir Studio
        </Link>
      </div>
    </main>
  );
}
