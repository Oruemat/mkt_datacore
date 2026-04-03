export default function Loading() {
  return (
    <div className="h-screen bg-dc-navy flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-dc-electric border-t-transparent rounded-full animate-spin" />
        <p className="text-dc-muted text-sm">Cargando Studio...</p>
      </div>
    </div>
  );
}
