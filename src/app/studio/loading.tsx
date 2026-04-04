export default function Loading() {
  return (
    <div className="h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-dc-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-dc-gray-500 text-sm">Cargando Studio...</p>
      </div>
    </div>
  );
}
