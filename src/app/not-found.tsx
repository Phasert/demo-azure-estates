import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="container-lux flex min-h-[60svh] flex-col items-start justify-center py-24">
      <p className="eyebrow text-champagne-deep">404</p>
      <h1 className="mt-4 font-serif text-6xl font-light">This page has drifted out to sea.</h1>
      <Link href="/properties" className="mt-8 text-xs tracking-[0.2em] uppercase underline underline-offset-8">Browse properties</Link>
    </main>
  );
}
