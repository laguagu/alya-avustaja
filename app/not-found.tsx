import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col justify-center items-center font-sans">
      <h1 className="text-6xl font-bold mb-2">404</h1>
      <h2 className="text-3xl mb-4">Sivua ei löytynyt</h2>
      <p className="text-xl mb-8">
        Valitettavasti etsimääsi sivua ei löytynyt.
      </p>
      <Link
        href="/alya"
        className="bg-white text-black py-2 px-4 rounded hover:bg-gray-200 transition-colors"
      >
        Palaa etusivulle
      </Link>
    </div>
  );
}
