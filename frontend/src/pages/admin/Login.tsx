import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Loader2,
  ShieldCheck,
  Layers,
  Sparkles,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/stores/useAuth";
import { toast } from "@/stores/useToast";
import { SITE_IMAGES } from "@/data/images";

export function Login() {
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    const res = await login(username, password);
    setLoading(false);
    if (res.ok) {
      toast.success("Welcome back, Administrator.");
      navigate("/admin/dashboard");
    } else {
      setError(res.error ?? "Invalid credentials. Please verify your login details.");
    }
  };

  const features = [
    { icon: Layers, title: "Live Catalogue", desc: "Products, variants & sizes" },
    { icon: MessageCircle, title: "WhatsApp Enquiries", desc: "Direct distributor quotes" },
    { icon: ShieldCheck, title: "Secure Cloud Store", desc: "JWT-protected · Supabase" },
  ];

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* animations */}
      <style>{`
        @keyframes maft-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes maft-glow { 0%,100%{opacity:.35} 50%{opacity:.6} }
      `}</style>

      {/* ===================== LEFT — BRAND SHOWCASE ===================== */}
      <div className="relative hidden overflow-hidden bg-[#0f1419] lg:block">
        <img src={SITE_IMAGES.hero} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1419] via-[#141d2b]/92 to-[#1a130a]/90" />
        {/* decorative glowing orbs */}
        <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[#8e5927] blur-[120px]" style={{ animation: "maft-glow 6s ease-in-out infinite" }} aria-hidden />
        <div className="absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-[#2a6df4] blur-[130px] opacity-30" style={{ animation: "maft-glow 8s ease-in-out infinite" }} aria-hidden />
        {/* fine grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 0),linear-gradient(90deg,#fff 1px,transparent 0)", backgroundSize: "46px 46px" }}
          aria-hidden
        />

        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo-full.png" alt="MAFT MARKETING" className="h-12 w-auto object-contain brightness-0 invert" />
            <span className="border-l border-white/20 pl-3 text-[10px] font-bold uppercase leading-tight tracking-[0.22em] text-[#deb887]">
              Admin<br />Console
            </span>
          </div>

          {/* Headline */}
          <div className="max-w-md">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#deb887] backdrop-blur">
              <Sparkles className="h-3 w-3" /> Catalogue Suite
            </span>
            <h2 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight text-white xl:text-[2.9rem]">
              Manage your furniture<br />
              hardware <span className="bg-gradient-to-r from-[#deb887] to-[#b9863f] bg-clip-text text-transparent">catalogue</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              One portal for products, variants, finishes, categories and wholesale enquiries — fast, secure and always in sync.
            </p>

            {/* Glass feature chips */}
            <div className="mt-8 space-y-3">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 backdrop-blur-md transition-colors hover:bg-white/[0.1]"
                  style={{ animation: `maft-float 7s ease-in-out ${i * 0.8}s infinite` }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#a86a30] to-[#78491d] text-white shadow-lg">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{f.title}</p>
                    <p className="text-[11px] text-white/55">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer status */}
          <div className="flex items-center justify-between border-t border-white/10 pt-5 text-[11px] text-white/45">
            <span>MAFT MARKETING · Admin v2.0</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" style={{ animation: "maft-glow 2s ease-in-out infinite" }} />
              Service Online
            </span>
          </div>
        </div>
      </div>

      {/* ===================== RIGHT — SIGN IN ===================== */}
      <div className="relative flex items-center justify-center bg-[#fbfaf8] px-5 py-10 sm:px-8">
        {/* soft brand tint */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#faf4ea] via-transparent to-[#f2f5fb]" aria-hidden />

        <div className="relative w-full max-w-sm">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img src="/logo-full.png" alt="MAFT MARKETING" className="h-11 w-auto object-contain" />
            <span className="border-l border-[#e0dacf] pl-3 text-[10px] font-bold uppercase leading-tight tracking-[0.18em] text-[#8e5927]">
              Admin<br />Portal
            </span>
          </div>

          {/* Icon badge */}
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8e5927] to-[#5e3813] text-white shadow-lg shadow-[#8e5927]/25">
            <Lock className="h-6 w-6" />
          </div>

          <h1 className="text-[1.7rem] font-black tracking-tight text-[#1c1813]">Welcome back</h1>
          <p className="mt-1.5 text-sm text-[#6e655a]">Sign in to the MAFT MARKETING admin console.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {/* Username */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#352e25]">Username</label>
              <div className="group relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a79c8c] transition-colors group-focus-within:text-[#8e5927]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="e.g. maftadmin01"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  className="h-12 w-full rounded-xl border border-[#e3ddd2] bg-white pl-10 pr-3.5 text-sm font-medium text-[#1c1813] shadow-sm transition-all placeholder:text-[#b3aa9c] focus:border-[#8e5927] focus:outline-none focus:ring-4 focus:ring-[#8e5927]/12"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#352e25]">Password</label>
              <div className="group relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a79c8c] transition-colors group-focus-within:text-[#8e5927]" />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-12 w-full rounded-xl border border-[#e3ddd2] bg-white pl-10 pr-11 text-sm font-medium text-[#1c1813] shadow-sm transition-all placeholder:text-[#b3aa9c] focus:border-[#8e5927] focus:outline-none focus:ring-4 focus:ring-[#8e5927]/12"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a79c8c] transition hover:text-[#1c1813]"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
                {error}
              </div>
            )}

            <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-[#5a5247]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#ded8ce] text-[#8e5927] focus:ring-[#8e5927]"
              />
              Keep me signed in
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group relative mt-1 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#8e5927] to-[#6b3d1a] text-sm font-bold text-white shadow-lg shadow-[#8e5927]/25 transition-all hover:shadow-xl hover:shadow-[#8e5927]/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign In to Dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 border-t border-[#efe9e0] pt-5 text-[11px] text-[#8c8479]">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Encrypted & access-controlled admin console
          </div>
        </div>
      </div>
    </div>
  );
}
