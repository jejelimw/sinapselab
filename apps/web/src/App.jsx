import { ArrowRight, BrainCircuit, CheckCircle2, FlaskConical, MessageCircle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import api, { clearTokens, loadStoredTokens, persistTokens } from "./api";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

const partnerLogos = Array.from({ length: 12 }).map((_, idx) => ({ id: idx + 1 }));

const labels = {
  "pt-BR": {
    about: "Sobre",
    services: "Serviços",
    login: "Entrar",
    request: "Fazer solicitação",
    hero: "Rigor técnico e previsibilidade para operações odontológicas de alta exigência.",
    heroText:
      "A Sinapse Lab estrutura o ciclo completo de solicitações com padrão operacional, governança de qualidade e comunicação objetiva entre clínica e laboratório.",
    myRequests: "Minhas solicitações",
    createRequest: "Nova solicitação",
    labPanel: "Painel do laboratório",
    logout: "Sair",
    carouselTitle: "Rede de parceiros odontológicos",
    carouselText: "Clínicas e dentistas conectados ao modelo operacional da Sinapse Lab.",
  },
  en: {
    about: "About",
    services: "Services",
    login: "Sign in",
    request: "Submit request",
    hero: "Technical rigor and predictability for high-demand dental operations.",
    heroText:
      "Sinapse Lab structures the full request lifecycle with operational standards, quality governance, and objective communication.",
    myRequests: "My requests",
    createRequest: "New request",
    labPanel: "Laboratory panel",
    logout: "Sign out",
    carouselTitle: "Dental partner network",
    carouselText: "Clinics and dentists connected to the Sinapse Lab technical workflow.",
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const SESSION_EXPIRES_AT_KEY = "session_expires_at";
const SESSION_TIMEOUT_MS = Math.max(Number(import.meta.env.VITE_SESSION_TIMEOUT_MS) || 3600000, 1000);
const SESSION_WARNING_MS = Math.min(
  Math.max(Number(import.meta.env.VITE_SESSION_WARNING_MS) || 300000, 500),
  SESSION_TIMEOUT_MS - 100,
);

function useLocale() {
  const browserLocale = navigator.language?.toLowerCase().startsWith("en") ? "en" : "pt-BR";
  return { t: labels[browserLocale] };
}

function Header({ t, isAuthenticated, onLogout }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="shell flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center">
          <img src="/logo-sinapse.svg" alt="Logo Sinapse Lab" className="h-8 w-auto" />
        </Link>

        <nav className="flex items-center gap-3 text-sm md:gap-5">
          <Link className="text-muted-foreground transition hover:text-foreground" to="/#sobre">
            {t.about}
          </Link>
          <Link className="text-muted-foreground transition hover:text-foreground" to="/#servicos">
            {t.services}
          </Link>
          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={onLogout}>
              {t.logout}
            </Button>
          ) : (
            <Link className="rounded-md bg-amber-500 px-4 py-2 font-semibold text-black transition hover:bg-amber-400" to="/login">
              {t.login}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function LandingPage({ t }) {
  const highlights = [
    { title: "SLA técnico monitorado", value: "24-72h", detail: "Janelas de resposta por prioridade clínica" },
    { title: "Confiabilidade operacional", value: "99.2%", detail: "Solicitações com checklist completo no envio" },
    { title: "Rede assistida", value: "+180", detail: "Clínicas e dentistas em acompanhamento recorrente" },
  ];

  return (
    <main className="pb-24">
      <section className="shell relative overflow-hidden py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-20 top-6 h-56 w-56 rounded-full bg-amber-500/18 blur-3xl md:h-72 md:w-72" />
          <div className="absolute -right-24 bottom-0 h-52 w-52 rounded-full bg-orange-500/14 blur-3xl md:h-64 md:w-64" />
        </div>

        <motion.div
          className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr]"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="space-y-7" variants={fadeUp}>
            <span className="inline-flex rounded-full border border-amber-300/35 bg-amber-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-amber-200">
              Plataforma de coordenação laboratorial
            </span>
            <h1 className="hero-title max-w-3xl text-4xl leading-[1.05] md:text-6xl">{t.hero}</h1>
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{t.heroText}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-400"
                to="/login"
              >
                {t.request}
                <ArrowRight size={16} />
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-black/25 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-card/80"
                to="/#servicos"
              >
                Ver metodologia
              </Link>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {highlights.map((item) => (
                <Card key={item.title} className="glass border-amber-200/15 bg-black/30">
                  <CardHeader className="p-4 pb-2">
                    <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">{item.title}</p>
                    <CardTitle className="text-2xl text-amber-300">{item.value}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-xs text-muted-foreground">{item.detail}</CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div className="flex items-end" variants={fadeUp}>
            <WhatsAppFlowCard />
          </motion.div>
        </motion.div>
      </section>

      <section className="shell py-10" id="servicos">
        <motion.div
          className="mb-6 max-w-3xl space-y-3"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
        >
          <motion.h2 className="text-2xl md:text-3xl" variants={fadeUp}>
            Direção técnica e governança operacional
          </motion.h2>
          <motion.p className="text-sm text-muted-foreground md:text-base" variants={fadeUp}>
            Operamos com protocolo definido para cada etapa do processo, do envio da solicitação ao retorno final,
            garantindo previsibilidade, qualidade e comunicação corporativa.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-4 md:grid-cols-3"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div variants={fadeUp}>
            <ProcessCard icon={<BrainCircuit size={18} className="text-amber-300" />} title="1. Solicitação e triagem">
              Recebimento estruturado dos dados e anexos, com classificação técnica inicial.
            </ProcessCard>
          </motion.div>
          <motion.div variants={fadeUp}>
            <ProcessCard icon={<FlaskConical size={18} className="text-amber-300" />} title="2. Análise especializada">
              Avaliação por equipe do laboratório com controle de prazo e padrão de qualidade.
            </ProcessCard>
          </motion.div>
          <motion.div variants={fadeUp}>
            <ProcessCard icon={<CheckCircle2 size={18} className="text-amber-300" />} title="3. Resposta e acompanhamento">
              Retorno técnico documentado e acompanhamento contínuo via plataforma.
            </ProcessCard>
          </motion.div>
        </motion.div>
      </section>

      <section className="shell py-10" id="sobre">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl">{t.carouselTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">{t.carouselText}</p>
          </div>
        </div>
        <PartnerMarquee items={partnerLogos} />
      </section>

      <section className="shell py-12">
        <motion.div
          className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div variants={fadeUp}>
            <Card className="glass h-full border-amber-200/20 bg-gradient-to-br from-amber-500/10 via-black/40 to-black/30">
              <CardHeader>
                <CardTitle>Sobre o laboratório</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                A Sinapse Lab atua com metodologia técnica e gestão por indicadores para sustentar qualidade,
                previsibilidade e padrão de entrega em operações odontológicas.
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Card className="glass h-full">
              <CardHeader>
                <CardTitle>Escopo de serviços</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>Próteses fixas e removíveis com rastreabilidade por etapa.</p>
                <p>Prototipagem digital e revisão técnica em casos de alta complexidade.</p>
                <p>Retorno estruturado com histórico centralizado na plataforma.</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}

function ProcessCard({ icon, title, children }) {
  return (
    <Card className="glass h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{children}</CardContent>
    </Card>
  );
}

function WhatsAppFlowCard() {
  const conversation = [
    { id: 1, sender: "agent", text: "Recebemos seu caso 2481. Triagem técnica iniciada.", time: "09:42" },
    { id: 2, sender: "client", text: "Perfeito, fico no aguardo das próximas etapas.", time: "09:44" },
    { id: 3, sender: "agent", text: "Atualizações seguem por aqui e também na plataforma Sinapse Lab.", time: "09:46" },
  ];

  const frames = useMemo(
    () => [
    { visibleMessages: 1, typing: null, duration: 2000 },
    { visibleMessages: 1, typing: "client", duration: 1300 },
    { visibleMessages: 2, typing: null, duration: 2000 },
    { visibleMessages: 2, typing: "agent", duration: 1300 },
    { visibleMessages: 3, typing: null, duration: 2600 },
    ],
    [],
  );

  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (frameIndex >= frames.length - 1) {
      return;
    }

    const timer = setTimeout(() => {
      setFrameIndex((old) => old + 1);
    }, frames[frameIndex].duration);
    return () => clearTimeout(timer);
  }, [frameIndex, frames]);

  const currentFrame = frames[frameIndex];
  const visibleMessages = conversation.slice(0, currentFrame.visibleMessages);

  return (
    <motion.div
      className="mx-auto mt-2 w-full max-w-2xl rounded-xl border border-amber-400/25 bg-black/55 p-4 text-left backdrop-blur-sm"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="mb-3 flex items-center gap-2 border-b border-border/60 pb-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
          <MessageCircle size={16} />
        </span>
        <div>
          <p className="text-sm font-semibold">Atualizações via WhatsApp</p>
          <p className="text-xs text-muted-foreground">Com agentes e acompanhamento contínuo</p>
        </div>
      </div>

      <div className="h-52 overflow-hidden rounded-lg bg-black/35 p-2">
        <div className="space-y-2">
        <AnimatePresence initial={false}>
          {visibleMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === "client" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm ${
                  message.sender === "client"
                    ? "rounded-br-md bg-zinc-800 text-zinc-100"
                    : "rounded-bl-md bg-amber-500/18 text-amber-100"
                }`}
              >
                <p>{message.text}</p>
                <p className="mt-1 text-[10px] text-zinc-400">{message.time}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {currentFrame.typing ? (
            <motion.div
              key={`typing-${currentFrame.typing}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`flex ${currentFrame.typing === "client" ? "justify-end" : "justify-start"}`}
            >
              <div className="rounded-full border border-border/70 bg-zinc-900/80 px-3 py-1 text-xs text-muted-foreground">
                digitando...
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function PartnerMarquee({ items }) {
  const loopItems = [...items, ...items];

  return (
    <div className="relative overflow-hidden rounded-xl bg-card/60 py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />
      <div className="marquee-track">
        {loopItems.map((item, index) => (
          <div
            className="inline-flex h-20 min-w-[160px] items-stretch justify-stretch"
            key={`logo-${item.id}-${index}`}
            aria-label={`Parceiro ${item.id}`}
          >
            <div className="partner-logo-mark" />
          </div>
        ))}
      </div>
    </div>
  );
}

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const socialBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmitLogin = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await api.post("/auth/login/", {
        email: form.email,
        password: form.password,
      });
      persistTokens(response.data.access, response.data.refresh);
      const me = await api.get("/auth/me/");
      onLoginSuccess(me.data);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Falha no login. Verifique credenciais.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitRegister = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    if (registerForm.password1 !== registerForm.password2) {
      setError("As senhas não conferem.");
      setSubmitting(false);
      return;
    }

    try {
      await api.post("/auth/registration/", registerForm);
      const loginResponse = await api.post("/auth/login/", {
        email: registerForm.email,
        password: registerForm.password1,
      });
      persistTokens(loginResponse.data.access, loginResponse.data.refresh);
      const me = await api.get("/auth/me/");
      onLoginSuccess(me.data);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Não foi possível criar sua conta. Verifique os dados e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="shell py-16">
      <Card className="mx-auto max-w-xl border-amber-400/20 bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl">Acesso à plataforma</CardTitle>
          <p className="text-sm text-muted-foreground">Entre com sua conta ou cadastre-se como cliente.</p>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-2 rounded-md border border-border/70 bg-black/30 p-1 text-sm">
            <button
              className={`rounded px-3 py-2 transition ${mode === "login" ? "bg-amber-500 text-black" : "text-muted-foreground"}`}
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
            >
              Entrar
            </button>
            <button
              className={`rounded px-3 py-2 transition ${mode === "register" ? "bg-amber-500 text-black" : "text-muted-foreground"}`}
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
              }}
            >
              Criar conta
            </button>
          </div>

          {mode === "login" ? (
            <form className="space-y-3" onSubmit={onSubmitLogin}>
              <input
                className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                type="email"
                placeholder="E-mail"
                value={form.email}
                onChange={(event) => setForm((old) => ({ ...old, email: event.target.value }))}
                required
              />
              <input
                className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                type="password"
                placeholder="Senha"
                value={form.password}
                onChange={(event) => setForm((old) => ({ ...old, password: event.target.value }))}
                required
              />
              {error ? <p className="text-sm text-red-400">{error}</p> : null}
              <Button className="w-full" type="submit" disabled={submitting}>
                {submitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          ) : (
            <form className="space-y-3" onSubmit={onSubmitRegister}>
              <input
                className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                type="text"
                placeholder="Nome completo"
                value={registerForm.full_name}
                onChange={(event) => setRegisterForm((old) => ({ ...old, full_name: event.target.value }))}
                required
              />
              <input
                className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                type="tel"
                placeholder="Telefone"
                value={registerForm.phone}
                onChange={(event) => setRegisterForm((old) => ({ ...old, phone: event.target.value }))}
                required
              />
              <input
                className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                type="email"
                placeholder="E-mail"
                value={registerForm.email}
                onChange={(event) => setRegisterForm((old) => ({ ...old, email: event.target.value }))}
                required
              />
              <input
                className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                type="password"
                placeholder="Senha"
                value={registerForm.password1}
                onChange={(event) => setRegisterForm((old) => ({ ...old, password1: event.target.value }))}
                required
              />
              <input
                className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                type="password"
                placeholder="Confirmar senha"
                value={registerForm.password2}
                onChange={(event) => setRegisterForm((old) => ({ ...old, password2: event.target.value }))}
                required
              />
              {error ? <p className="text-sm text-red-400">{error}</p> : null}
              <Button className="w-full" type="submit" disabled={submitting}>
                {submitting ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>
          )}

          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border/70" />
            ou continue com
            <span className="h-px flex-1 bg-border/70" />
          </div>

          <div className="grid gap-2">
            <a
              href={`${socialBase}/auth/google/`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
            >
              <GoogleMark />
              Continuar com Google
            </a>
            <a
              href={`${socialBase}/auth/apple/`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-black bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-900"
            >
              <AppleMark />
              Continuar com Apple
            </a>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Ao criar conta, seu perfil será registrado automaticamente como cliente.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9a6 6 0 1 1 0-12c2.1 0 3.6.9 4.4 1.7l3-2.9C17.5 3.1 15 2 12 2a10 10 0 1 0 0 20c5.8 0 9.6-4 9.6-9.7 0-.7-.1-1.4-.2-2.1z"
      />
      <path fill="#34A853" d="M2 7.9l3.5 2.6A6 6 0 0 1 12 6a5.7 5.7 0 0 1 4.4 1.7l3-2.9A10 10 0 0 0 2 7.9" />
      <path fill="#4A90E2" d="M12 22a10 10 0 0 0 7.2-2.8l-3.3-2.7c-1 .7-2.3 1.3-3.9 1.3a6 6 0 0 1-5.6-4l-3.5 2.7A10 10 0 0 0 12 22" />
      <path fill="#FBBC05" d="M2 16.5l3.6-2.7a6 6 0 0 1-.3-1.8c0-.6.1-1.2.3-1.8L2 7.5A10 10 0 0 0 2 16.5" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.7 12.7c0-2 1.6-3 1.7-3.1-1-.9-2.5-1-3-1-.8-.1-1.7.4-2.1.4-.5 0-1.2-.4-2-.4-1 0-2 .6-2.5 1.5-1.1 1.8-.3 4.5.8 6 .6.8 1.3 1.7 2.2 1.7.9 0 1.2-.5 2.2-.5s1.3.5 2.2.5c.9 0 1.5-.8 2.1-1.6.7-.9 1-1.8 1-1.9 0 0-2.6-1-2.6-3.6zM14.9 7.4c.5-.6.8-1.3.7-2.1-.7 0-1.5.5-2 1-.5.5-.9 1.3-.8 2.1.8.1 1.6-.4 2.1-1z" />
    </svg>
  );
}

function ClienteDashboard({ t, user }) {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ status: "", start_date: "", end_date: "" });
  const [newRequest, setNewRequest] = useState({
    patientName: "",
    workType: "",
    elements: "",
    material: "",
    materialOther: "",
    color: "",
    colorOther: "",
    photos: [],
    scans: [],
    notes: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const workTypeOptions = ["Coroa", "Lente", "Coroa sobre implante", "Enceramento (50/un)", "Placa miorrelaxante"];
  const materialOptions = ["PMMA", "Zirconia", "Emax", "Outro"];
  const colorOptions = [
    "BL1",
    "BL2",
    "BL3",
    "BL4",
    "A1",
    "A2",
    "A3",
    "A4",
    "B1",
    "B2",
    "B3",
    "B4",
    "C1",
    "C2",
    "C3",
    "C4",
    "D2",
    "D3",
    "D4",
    "Outro",
  ];
  const allowedExtensions = new Set(["pdf", "png", "jpg", "jpeg", "doc", "docx", "xls", "xlsx"]);
  const maxFileSize = 20 * 1024 * 1024;

  const loadItems = async () => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;
    const response = await api.get("/solicitacoes/", { params });
    setItems(response.data.results || []);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const validateFiles = (files, label) => {
    if (files.length > 10) {
      return `${label}: envie no maximo 10 arquivos.`;
    }

    for (const file of files) {
      if (file.size > maxFileSize) {
        return `${label}: o arquivo ${file.name} excede 20MB.`;
      }

      const extension = file.name.includes(".") ? file.name.split(".").pop().toLowerCase() : "";
      if (!allowedExtensions.has(extension)) {
        return `${label}: formato ${extension || "desconhecido"} nao e aceito.`;
      }
    }

    return "";
  };

  const submitRequest = async (event) => {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!newRequest.patientName || !newRequest.workType || !newRequest.elements || !newRequest.material || !newRequest.color) {
      setFormError("Preencha todos os campos obrigatorios.");
      return;
    }

    if (newRequest.material === "Outro" && !newRequest.materialOther.trim()) {
      setFormError("Informe o material em 'Outro'.");
      return;
    }

    if (newRequest.color === "Outro" && !newRequest.colorOther.trim()) {
      setFormError("Informe a cor em 'Outro'.");
      return;
    }

    const photosError = validateFiles(newRequest.photos, "Fotos");
    if (photosError) {
      setFormError(photosError);
      return;
    }

    const scansError = validateFiles(newRequest.scans, "Escaneamento");
    if (scansError) {
      setFormError(scansError);
      return;
    }

    setSubmitting(true);

    const selectedMaterial = newRequest.material === "Outro" ? newRequest.materialOther.trim() : newRequest.material;
    const selectedColor = newRequest.color === "Outro" ? newRequest.colorOther.trim() : newRequest.color;
    const descricao = [
      "Sinapse Lab - Solicitação de Serviço",
      "",
      `Nome do paciente: ${newRequest.patientName}`,
      `Tipo de trabalho: ${newRequest.workType}`,
      `Elementos: ${newRequest.elements}`,
      `Material: ${selectedMaterial}`,
      `Cor: ${selectedColor}`,
      "",
      `Observacoes: ${newRequest.notes?.trim() || "Sem observacoes."}`,
      "",
      `Fotos anexadas: ${newRequest.photos.length}`,
      `Escaneamentos anexados: ${newRequest.scans.length}`,
    ].join("\n");

    try {
      const created = await api.post("/solicitacoes/", {
        titulo: `${newRequest.workType} - ${newRequest.patientName}`,
        descricao,
      });

      const allFiles = [...newRequest.photos, ...newRequest.scans];
      if (allFiles.length > 0) {
        for (const file of allFiles) {
          const data = new FormData();
          data.append("arquivo", file);
          await api.post(`/solicitacoes/${created.data.id}/anexos/`, data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      setNewRequest({
        patientName: "",
        workType: "",
        elements: "",
        material: "",
        materialOther: "",
        color: "",
        colorOther: "",
        photos: [],
        scans: [],
        notes: "",
      });
      setFormSuccess("Solicitacao enviada com sucesso.");
      await loadItems();
    } catch {
      setFormError("Nao foi possivel enviar a solicitacao. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="shell grid gap-6 py-10">
      <Card className="glass border-amber-300/25">
        <CardHeader className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-amber-300">Sinapse Lab</p>
            <CardTitle className="mt-1 text-2xl">Solicitação de serviço</CardTitle>
          </div>
          <div className="rounded-md border border-border/70 bg-black/30 px-4 py-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Conta conectada</p>
            <p className="mt-1">{user?.email || "jessicamosby12@gmail.com"} • Mudar de conta</p>
            <p className="mt-2 text-xs">
              O nome, a foto e o e-mail associados a sua Conta do Google serao registrados quando voce fizer upload de
              arquivos e enviar este formulario.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-red-400">*</span> Indica uma pergunta obrigatoria
          </p>
        </CardHeader>

        <CardContent>
          <form className="grid gap-5" onSubmit={submitRequest}>
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Nome do paciente <span className="text-red-400">*</span>
              </label>
              <input
                className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={newRequest.patientName}
                onChange={(event) => setNewRequest((old) => ({ ...old, patientName: event.target.value }))}
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Qual tipo de trabalho <span className="text-red-400">*</span>
              </label>
              <div className="grid gap-2 md:grid-cols-2">
                {workTypeOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 rounded-md border border-border/70 bg-secondary/40 px-3 py-2 text-sm"
                  >
                    <input
                      type="radio"
                      name="workType"
                      value={option}
                      checked={newRequest.workType === option}
                      onChange={(event) => setNewRequest((old) => ({ ...old, workType: event.target.value }))}
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Quais elementos? <span className="text-red-400">*</span>
              </label>
              <input
                className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ex.: 11, 12, 21"
                value={newRequest.elements}
                onChange={(event) => setNewRequest((old) => ({ ...old, elements: event.target.value }))}
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Qual material? <span className="text-red-400">*</span>
              </label>
              <div className="grid gap-2 md:grid-cols-2">
                {materialOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 rounded-md border border-border/70 bg-secondary/40 px-3 py-2 text-sm"
                  >
                    <input
                      type="radio"
                      name="material"
                      value={option}
                      checked={newRequest.material === option}
                      onChange={(event) => setNewRequest((old) => ({ ...old, material: event.target.value }))}
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
              {newRequest.material === "Outro" ? (
                <input
                  className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Informe o material"
                  value={newRequest.materialOther}
                  onChange={(event) => setNewRequest((old) => ({ ...old, materialOther: event.target.value }))}
                  required
                />
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Cor <span className="text-red-400">*</span>
              </label>
              <div className="grid gap-2 sm:grid-cols-4 md:grid-cols-6">
                {colorOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 rounded-md border border-border/70 bg-secondary/40 px-3 py-2 text-sm"
                  >
                    <input
                      type="radio"
                      name="color"
                      value={option}
                      checked={newRequest.color === option}
                      onChange={(event) => setNewRequest((old) => ({ ...old, color: event.target.value }))}
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
              {newRequest.color === "Outro" ? (
                <input
                  className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Informe a cor"
                  value={newRequest.colorOther}
                  onChange={(event) => setNewRequest((old) => ({ ...old, colorOther: event.target.value }))}
                  required
                />
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Fotos</label>
              <p className="text-xs text-muted-foreground">
                Para colorimetria, foto com a escala paralela ao dente. Para enceramento: foto de rosto completo, com
                flash e abridor de boca. Paciente sem oculos.
              </p>
              <p className="text-xs text-muted-foreground">
                Faca upload de ate 10 arquivos aceitos. O tamanho maximo e de 20 MB por item.
              </p>
              <input
                className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm"
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                onChange={(event) => setNewRequest((old) => ({ ...old, photos: Array.from(event.target.files || []) }))}
              />
              {newRequest.photos.length ? (
                <p className="text-xs text-muted-foreground">{newRequest.photos.length} arquivo(s) selecionado(s).</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Escaneamento</label>
              <p className="text-xs text-muted-foreground">
                Faca upload de ate 10 arquivos aceitos. O tamanho maximo e de 20 MB por item.
              </p>
              <input
                className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm"
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                onChange={(event) => setNewRequest((old) => ({ ...old, scans: Array.from(event.target.files || []) }))}
              />
              {newRequest.scans.length ? (
                <p className="text-xs text-muted-foreground">{newRequest.scans.length} arquivo(s) selecionado(s).</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Observacoes</label>
              <textarea
                className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                rows={4}
                value={newRequest.notes}
                onChange={(event) => setNewRequest((old) => ({ ...old, notes: event.target.value }))}
              />
            </div>

            {formError ? <p className="text-sm text-red-400">{formError}</p> : null}
            {formSuccess ? <p className="text-sm text-emerald-300">{formSuccess}</p> : null}

            <Button className="w-full md:w-fit" type="submit" disabled={submitting}>
              {submitting ? "Enviando..." : "Enviar solicitacao"}
            </Button>

            <p className="text-xs text-muted-foreground">Nunca envie senhas por este formulario.</p>
          </form>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>{t.myRequests}</CardTitle>
          <div className="grid gap-2 md:grid-cols-4">
            <input
              className="rounded-md border border-input bg-secondary px-3 py-2 text-sm"
              type="date"
              value={filters.start_date}
              onChange={(event) => setFilters((old) => ({ ...old, start_date: event.target.value }))}
            />
            <input
              className="rounded-md border border-input bg-secondary px-3 py-2 text-sm"
              type="date"
              value={filters.end_date}
              onChange={(event) => setFilters((old) => ({ ...old, end_date: event.target.value }))}
            />
            <select
              className="rounded-md border border-input bg-secondary px-3 py-2 text-sm"
              value={filters.status}
              onChange={(event) => setFilters((old) => ({ ...old, status: event.target.value }))}
            >
              <option value="">Todos status</option>
              <option value="enviada">Enviada</option>
              <option value="em_analise">Em análise</option>
              <option value="aguardando_dados">Aguardando dados</option>
              <option value="respondida">Respondida</option>
              <option value="recusada">Recusada</option>
              <option value="reaberta">Reaberta</option>
            </select>
            <Button onClick={loadItems} type="button">
              Filtrar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item) => (
            <Card className="bg-secondary/50" key={item.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{item.titulo}</CardTitle>
                <p className="text-sm text-muted-foreground">{item.descricao}</p>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                <p>Status: {item.status}</p>
                {item.resposta_laboratorio ? <p>Resposta: {item.resposta_laboratorio}</p> : null}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

function LaboratorioDashboard({ t }) {
  const [items, setItems] = useState([]);

  const loadItems = async () => {
    const response = await api.get("/laboratorio/solicitacoes/");
    setItems(response.data.results || []);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const responder = async (id) => {
    const resposta = window.prompt("Digite a resposta para esta solicitação");
    if (!resposta) return;
    await api.post(`/laboratorio/solicitacoes/${id}/responder/`, {
      resposta_laboratorio: resposta,
      status: "respondida",
    });
    await loadItems();
  };

  return (
    <main className="shell py-10">
      <Card className="glass">
        <CardHeader>
          <CardTitle>{t.labPanel}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <Card className="bg-secondary/50" key={item.id}>
              <CardHeader>
                <CardTitle className="text-base">{item.titulo}</CardTitle>
                <p className="text-sm text-muted-foreground">{item.descricao}</p>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p>Cliente ID: {item.cliente}</p>
                <p>Status: {item.status}</p>
                <Button className="w-full" type="button" onClick={() => responder(item.id)}>
                  Responder
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

function Dashboard({ user, t }) {
  const [adminView, setAdminView] = useState("lab");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "cliente") {
    return <ClienteDashboard t={t} user={user} />;
  }

  if (user.role === "lab_admin") {
    return (
      <>
        <section className="shell pt-6">
          <Card className="glass border-amber-300/20">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <p className="text-sm text-muted-foreground">Selecione a área que deseja acessar no painel administrativo.</p>
              <div className="flex gap-2">
                <Button variant={adminView === "lab" ? "default" : "outline"} size="sm" onClick={() => setAdminView("lab")}>
                  Painel do laboratorio
                </Button>
                <Button
                  variant={adminView === "request" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAdminView("request")}
                >
                  Nova solicitacao
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {adminView === "request" ? <ClienteDashboard t={t} user={user} /> : <LaboratorioDashboard t={t} />}
      </>
    );
  }

  return <LaboratorioDashboard t={t} />;
}

function Footer() {
  return (
    <footer className="border-t border-border/80 bg-black/40">
      <div className="shell grid gap-6 py-8 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold">
            Sinapse <span className="text-amber-400">Lab</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Plataforma para gestão técnica de solicitações entre clínicas e laboratório de próteses.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">Contato</p>
          <p className="mt-2 text-sm text-foreground">contato@sinapselab.com</p>
          <p className="text-sm text-foreground">+55 (00) 00000-0000</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">Institucional</p>
          <p className="mt-2 text-sm text-foreground">Termos de uso</p>
          <p className="text-sm text-foreground">Política de privacidade</p>
        </div>
      </div>
      <div className="border-t border-border/70 py-3 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Sinapse Lab. Todos os direitos reservados.
      </div>
    </footer>
  );
}

function AnimatedBackgroundLines() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0.42 }}
      animate={reduceMotion ? { opacity: 0.44 } : { opacity: [0.36, 0.56, 0.36] }}
      transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M0 22 L30 22 L43 38 L100 38"
          stroke="rgba(242,169,0,0.36)"
          strokeWidth="0.14"
          fill="none"
          strokeLinecap="round"
          filter="url(#lineBlur)"
          initial={{ pathLength: 0.2, pathOffset: 0.8 }}
          animate={reduceMotion ? { pathLength: 1, pathOffset: 0 } : { pathLength: [0.2, 1], pathOffset: [0.8, 0] }}
          transition={{ duration: 11.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M0 48 L33 48 L50 30 L100 30"
          stroke="rgba(255,194,71,0.32)"
          strokeWidth="0.14"
          fill="none"
          strokeLinecap="round"
          filter="url(#lineBlur)"
          initial={{ pathLength: 0.1, pathOffset: 1 }}
          animate={reduceMotion ? { pathLength: 1, pathOffset: 0 } : { pathLength: [0.1, 1], pathOffset: [1, 0] }}
          transition={{ duration: 13.2, repeat: Infinity, ease: "linear", delay: 0.45 }}
        />
        <motion.path
          d="M0 66 L31 66 L44 84 L100 84"
          stroke="rgba(242,169,0,0.28)"
          strokeWidth="0.14"
          fill="none"
          strokeLinecap="round"
          filter="url(#lineBlur)"
          initial={{ pathLength: 0.14, pathOffset: 0.95 }}
          animate={reduceMotion ? { pathLength: 1, pathOffset: 0 } : { pathLength: [0.14, 1], pathOffset: [0.95, 0] }}
          transition={{ duration: 12.6, repeat: Infinity, ease: "linear", delay: 0.2 }}
        />
        <motion.path
          d="M0 83 L27 83 L41 64 L100 64"
          stroke="rgba(255,194,71,0.24)"
          strokeWidth="0.14"
          fill="none"
          strokeLinecap="round"
          filter="url(#lineBlur)"
          initial={{ pathLength: 0.12, pathOffset: 1 }}
          animate={reduceMotion ? { pathLength: 1, pathOffset: 0 } : { pathLength: [0.12, 1], pathOffset: [1, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear", delay: 0.9 }}
        />
        <defs>
          <filter id="lineBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.9" />
          </filter>
        </defs>
      </svg>
    </motion.div>
  );
}

function SessionExpiryNotice({ isOpen, timeLeftMs, onContinue, onLogout }) {
  if (!isOpen) {
    return null;
  }

  const totalSeconds = Math.max(0, Math.ceil(timeLeftMs / 1000));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4">
      <Card className="w-full max-w-md border-amber-300/30 bg-card/95 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Sua sessao esta prestes a encerrar</CardTitle>
          <p className="text-sm text-muted-foreground">
            Restam aproximadamente <span className="font-semibold text-amber-300">{totalSeconds}s</span> para encerrar sua
            sessao. Deseja continuar logado?
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onLogout}>
            Encerrar agora
          </Button>
          <Button onClick={onContinue}>Continuar logado</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  const { t } = useLocale();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isSessionNoticeOpen, setIsSessionNoticeOpen] = useState(false);
  const [sessionTimeLeftMs, setSessionTimeLeftMs] = useState(0);
  const warningTimeoutRef = useRef(null);
  const logoutTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  const clearSessionTimers = () => {
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
      logoutTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const clearSessionExpiry = () => {
    localStorage.removeItem(SESSION_EXPIRES_AT_KEY);
  };

  const setSessionExpiry = (expiresAt) => {
    localStorage.setItem(SESSION_EXPIRES_AT_KEY, String(expiresAt));
  };

  const loadSessionExpiry = () => {
    const raw = localStorage.getItem(SESSION_EXPIRES_AT_KEY);
    if (!raw) return null;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      clearSessionExpiry();
      return null;
    }
    return parsed;
  };

  const logout = () => {
    clearSessionTimers();
    setIsSessionNoticeOpen(false);
    setSessionTimeLeftMs(0);
    clearSessionExpiry();
    clearTokens();
    setUser(null);
  };

  const startSessionCountdown = (expiresAt) => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    setSessionTimeLeftMs(Math.max(0, expiresAt - Date.now()));
    countdownIntervalRef.current = setInterval(() => {
      setSessionTimeLeftMs(Math.max(0, expiresAt - Date.now()));
    }, 200);
  };

  const startSessionTimers = (expiresAt) => {
    clearSessionTimers();

    const now = Date.now();
    const remainingMs = expiresAt - now;
    if (remainingMs <= 0) {
      logout();
      return;
    }

    const warningDelayMs = expiresAt - SESSION_WARNING_MS - now;
    if (warningDelayMs <= 0) {
      setIsSessionNoticeOpen(true);
      startSessionCountdown(expiresAt);
    } else {
      warningTimeoutRef.current = setTimeout(() => {
        setIsSessionNoticeOpen(true);
        startSessionCountdown(expiresAt);
      }, warningDelayMs);
    }

    logoutTimeoutRef.current = setTimeout(() => {
      logout();
    }, remainingMs);
  };

  const beginNewSession = () => {
    const expiresAt = Date.now() + SESSION_TIMEOUT_MS;
    setSessionExpiry(expiresAt);
    setIsSessionNoticeOpen(false);
    setSessionTimeLeftMs(expiresAt - Date.now());
    startSessionTimers(expiresAt);
  };

  const handleLoginSuccess = (nextUser) => {
    setUser(nextUser);
    beginNewSession();
  };

  const handleContinueSession = () => {
    beginNewSession();
  };

  useEffect(() => () => clearSessionTimers(), []);

  useEffect(() => {
    const tokens = loadStoredTokens();
    if (!tokens.access) return;

    const expiresAt = loadSessionExpiry();
    if (!expiresAt || expiresAt <= Date.now()) {
      logout();
      return;
    }

    startSessionTimers(expiresAt);

    api
      .get("/auth/me/")
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        logout();
      });
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const targetId = location.hash.slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    const timer = setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
    return () => clearTimeout(timer);
  }, [location.hash, location.pathname]);

  return (
    <div className="relative z-10 flex min-h-screen flex-col bg-background">
      <AnimatedBackgroundLines />
      <Header t={t} isAuthenticated={isAuthenticated} onLogout={logout} />
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <Routes location={location}>
              <Route path="/" element={<LandingPage t={t} />} />
              <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/dashboard" element={<Dashboard user={user} t={t} />} />
              <Route path="/sobre" element={<Navigate to="/#sobre" replace />} />
              <Route path="/servicos" element={<Navigate to="/#servicos" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
      <SessionExpiryNotice
        isOpen={isSessionNoticeOpen}
        timeLeftMs={sessionTimeLeftMs}
        onContinue={handleContinueSession}
        onLogout={logout}
      />
    </div>
  );
}
