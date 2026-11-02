/** Full-screen branded splash shown while the app loads its first data. */
export function Splash() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#16191d]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#23282e] via-[#16191d] to-[#0f1113]" />
      <div className="relative flex flex-col items-center">
        <img
          src="/logo-full.png"
          alt="MAFT MARKETING"
          className="h-14 w-auto object-contain brightness-0 invert"
          style={{ animation: "maft-splash-pulse 1.6s ease-in-out infinite" }}
        />
        <div className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-[#a86a30] to-[#deb887]" style={{ animation: "maft-splash-bar 1.2s ease-in-out infinite" }} />
        </div>
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.25em] text-white/50">Loading…</p>
      </div>
      <style>{`
        @keyframes maft-splash-pulse { 0%,100%{opacity:.85;transform:scale(1)} 50%{opacity:1;transform:scale(1.04)} }
        @keyframes maft-splash-bar { 0%{transform:translateX(-120%)} 100%{transform:translateX(420%)} }
      `}</style>
    </div>
  );
}
