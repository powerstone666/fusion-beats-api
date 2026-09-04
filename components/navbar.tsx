import Link from 'next/link';
import SearchBar from './search-bar';

export default function Navbar() {
  return (
    <header className="md-topbar mt-3">
      {/* Same container metrics as <main> so bar edges match content edges. */}
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="md-topbar-inner">
          <Link href="/" className="md-brand shrink-0" aria-label="Fusion Beats home">
            ♫ <b>Fusion Beats</b>
          </Link>
          <div className="md-topbar-search">
            <SearchBar compact />
          </div>
          <nav className="hidden shrink-0 sm:block">
            <Link href="/playground" className="md-btn md-btn-tonal">
              Playground
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
