export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-background px-6 py-12 text-foreground sm:px-12 md:py-24">
      <header className="w-full max-w-5xl">
        <h1 className="font-serif-luxury text-2xl tracking-widest uppercase">TEEX</h1>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="animate-slide-up space-y-6">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Project Foundation Established
          </p>
          <h2 className="font-serif-luxury text-4xl font-light tracking-wide sm:text-6xl md:text-7xl">
            TIMELESS LUXURY
          </h2>
          <div className="mx-auto h-[1px] w-24 bg-border-primary" />
          <p className="mx-auto max-w-md font-sans text-sm font-light leading-relaxed tracking-wide text-muted-foreground">
            The software architecture is complete. Next.js App Router, strict TypeScript, Tailwind v4, and Supabase integration foundations are set.
          </p>
        </div>
      </main>

      <footer className="w-full max-w-5xl text-center font-sans text-[10px] tracking-widest uppercase text-muted-foreground sm:text-right">
        © 2026 TEEX CLOTHINGS. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}
