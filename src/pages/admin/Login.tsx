import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Sparkles,
} from "lucide-react";
import { DEMO_CREDENTIALS, useAuth } from "@/stores/useAuth";
import { toast } from "@/stores/useToast";

export function Login() {
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();

  // Auto-populate demo credentials by default as requested
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [show, setShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (res.ok) {
        toast.success("Welcome back, Administrator.");
        navigate("/admin/dashboard");
      } else {
        setError(res.error ?? "Invalid credentials. Please verify your login details.");
      }
    }, 450);
  };

  const handleResetDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError("");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f4f6f8] p-4 sm:p-6 lg:p-8">
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-xl border border-[#e2e7ed] bg-white shadow-sm">
        <div className="grid lg:grid-cols-12">
          {/* Left Hero / Brand Pane */}
          <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between overflow-hidden bg-[#17212f] p-8 border-r border-[#26384c]">

            {/* Brand Header */}
            <div>
              <div className="flex items-center gap-3">
                <img src="/logo-full.png" alt="MAFT MARKETING" className="h-14 w-auto object-contain brightness-0 invert" />
                <span className="border-l border-white/15 pl-3 text-[10px] font-bold uppercase leading-tight tracking-[0.2em] text-[#baa482]">
                  Admin<br />Console
                </span>
              </div>

              <div className="mt-10">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-[#deb887]">
                  <Sparkles className="h-3 w-3 text-[#deb887]" /> Enterprise Catalogue Suite
                </span>
                <h2 className="mt-3 text-2xl font-black text-white leading-tight">
                  Furniture Hardware &amp; Inventory Management
                </h2>
                <p className="mt-2.5 text-xs text-white/70 leading-relaxed">
                  Real-time administration portal to manage recliner mechanisms, sofa fittings, colour finishes, and wholesale enquiries.
                </p>
              </div>
            </div>

            {/* Highlights List */}
            <div className="my-8 space-y-3.5">
              {[
                { icon: Layers, title: "198+ Active Catalog SKUs", desc: "Instantly update products, variants & sizes" },
                { icon: CheckCircle2, title: "Live WhatsApp Integration", desc: "Sync direct distributor quotes & pricing" },
                { icon: ShieldCheck, title: "Protected Data Store", desc: "Local sandbox with automatic data backup" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[#deb887]">
                    <item.icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/90">{item.title}</p>
                    <p className="text-[11px] text-white/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Tag */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
              <span>MAFT System v1.2</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Service Online
              </span>
            </div>
          </div>

          {/* Right Login Form Pane */}
          <div className="lg:col-span-7 bg-white p-7 sm:p-10 flex flex-col justify-center">
            {/* Mobile Brand Header */}
            <div className="flex items-center gap-3 lg:hidden mb-6">
              <img src="/logo-full.png" alt="MAFT MARKETING" className="h-12 w-auto object-contain" />
              <span className="border-l border-[#e0dacf] pl-3 text-[10px] font-bold uppercase leading-tight tracking-[0.18em] text-[#8e5927]">
                Admin<br />Portal
              </span>
            </div>

            {/* Form Title & Auto-populated Notice */}
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#1c1813]">
                Admin Sign In
              </h1>
              <p className="mt-1 text-xs text-[#6e655a]">
                Enter your administrative credentials to manage products and settings.
              </p>
            </div>

            {/* Pre-populated Banner */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-[#e8decb] bg-[#fbf8f2] px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-[#6e4e2a]">
                  Demo credentials auto-populated
                </span>
              </div>
              <button
                type="button"
                onClick={handleResetDemo}
                className="text-[11px] font-semibold text-[#8e5927] hover:underline"
              >
                Reset Demo
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="mt-6 space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-[#352e25] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8273]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@maftmarketing.com"
                    autoComplete="username"
                    className="h-11 w-full rounded-xl border border-[#ded8ce] bg-[#fdfbf7] pl-10 pr-3.5 text-xs text-[#1c1813] font-medium placeholder:text-[#999] focus:border-[#8e5927] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8e5927]/20 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#352e25]">
                    Password
                  </label>
                  <span className="text-[11px] font-semibold text-[#8e5927]">
                    Default: {DEMO_CREDENTIALS.password}
                  </span>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8273]" />
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="h-11 w-full rounded-xl border border-[#ded8ce] bg-[#fdfbf7] pl-10 pr-10 text-xs text-[#1c1813] font-medium placeholder:text-[#999] focus:border-[#8e5927] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8e5927]/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c8273] hover:text-[#1c1813] transition"
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              {/* Remember Me Option */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-[#5a5247]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-[#ded8ce] text-[#8e5927] focus:ring-[#8e5927]"
                  />
                  <span>Keep session active</span>
                </label>
                <span className="text-[11px] text-[#8c8273]">Demo Environment</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#8e5927] text-xs font-bold text-white shadow-md transition duration-200 hover:bg-[#78491d] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying session…</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Sign In to Dashboard</span>
                  </>
                )}
              </button>
            </form>

            {/* Bottom Security / Privacy Badge */}
            <div className="mt-8 pt-5 border-t border-[#f0ede6] flex items-center justify-center gap-2 text-[11px] text-[#8c8479]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>256-bit SSL encrypted administrative console</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
