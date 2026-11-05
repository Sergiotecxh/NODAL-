import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Home,
  MessageCircle,
  BriefcaseBusiness,
  Compass,
  Layers3,
  UserRound,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Bookmark,
  Search,
  Bell,
  MapPin,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
  ShieldCheck,
  Music2,
  Headphones,
  AudioLines,
  Lightbulb,
  Video,
  Utensils,
  Package,
  Globe2,
  Download,
  CalendarDays,
} from "lucide-react";
import { contactRisk } from "./contact-policy";
import "./studio.css";
type Section =
  "inicio" | "mensajes" | "bookings" | "discover" | "servicios" | "perfil";
type Place = {
  id: string;
  name: string;
  city: string;
  type: "Establecimiento" | "Evento";
  category: string;
  genre: string;
  detail: string;
};
type StudioPrefs = {
  name?: string;
  bio?: string;
  set?: string;
  pro?: boolean;
  saved?: string[];
  events?: Place[];
};
type ChatMessage = { text: string; kind: "text" | "location"; mine: boolean };
const seed: Place[] = [
  {
    id: "p1",
    name: "Bruma listening room",
    city: "Puebla",
    type: "Establecimiento",
    category: "Club",
    genre: "Organic house",
    detail: "Selección cálida, pista íntima y una identidad que se escucha.",
  },
  {
    id: "p2",
    name: "Jardín de tarde",
    city: "Puebla",
    type: "Establecimiento",
    category: "Restaurante",
    genre: "Afro house",
    detail: "Un espacio para conectar la gastronomía con el sonido.",
  },
  {
    id: "p3",
    name: "Costa sessions",
    city: "Ibiza",
    type: "Evento",
    category: "Sunset",
    genre: "Melodic house",
    detail: "Un encuentro de tarde frente al Mediterráneo. Evento de ejemplo.",
  },
  {
    id: "p4",
    name: "Rivage rooftop",
    city: "Niza",
    type: "Establecimiento",
    category: "Terraza",
    genre: "Organic house",
    detail: "Un horizonte distinto para tu siguiente set.",
  },
];
const nav = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "mensajes", label: "Mensajes", icon: MessageCircle },
  { id: "bookings", label: "Bookings", icon: BriefcaseBusiness },
  { id: "discover", label: "Discover", icon: Compass },
  { id: "servicios", label: "Servicios", icon: Layers3 },
  { id: "perfil", label: "Perfil", icon: UserRound },
] as const;
const chats = [
  {
    name: "Bruma · programación",
    status: "Respondidos",
    initial: "B",
    first:
      "Gracias por compartir tu presskit. ¿Tienes disponibilidad para un warm-up? Este es un chat de muestra.",
  },
  {
    name: "Costa sessions",
    status: "Pendientes",
    initial: "C",
    first: "Tu propuesta de muestra está pendiente de respuesta.",
  },
  {
    name: "Jardín · producción",
    status: "Respondidos",
    initial: "J",
    first:
      "Podemos revisar el rider y los horarios aquí. Conversación de ejemplo.",
  },
];
function initialSection(): Section {
  const h = location.hash.slice(1);
  return nav.some((n) => n.id === h) ? (h as Section) : "inicio";
}
function load(): StudioPrefs {
  try {
    const r = JSON.parse(localStorage.getItem("nodal-studio-v3") || "{}");
    if (!r || typeof r !== "object" || Array.isArray(r)) return {};
    let set = "";
    if (typeof r.set === "string") {
      try {
        const u = new URL(r.set);
        if (u.protocol === "https:" && !u.username && !u.password) set = r.set;
      } catch {
        /* Ignore a corrupt stored URL. */
      }
    }
    return {
      name: typeof r.name === "string" ? r.name.slice(0, 60) : "",
      bio: typeof r.bio === "string" ? r.bio.slice(0, 500) : "",
      set,
      pro: r.pro === true,
      saved: Array.isArray(r.saved)
        ? r.saved.filter((v: unknown) => typeof v === "string").slice(0, 200)
        : [],
      events: Array.isArray(r.events)
        ? r.events
            .filter(
              (v: unknown) =>
                !!v &&
                typeof v === "object" &&
                ["id", "name", "city", "category", "genre", "detail"].every(
                  (k) => typeof (v as Record<string, unknown>)[k] === "string",
                ) &&
                (v as { type?: unknown }).type === "Evento",
            )
            .slice(0, 100)
        : [],
    };
  } catch {
    return {};
  }
}
function Mark() {
  return (
    <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">
      <path
        d="M10 29V11L30 29V11"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="10" cy="11" r="4" fill="currentColor" />
      <circle cx="30" cy="29" r="4" fill="currentColor" />
    </svg>
  );
}
function Flag({ region }: { region: string }) {
  return (
    <span
      className={"s-flag flag-" + region}
      aria-label={
        region === "MX"
          ? "México"
          : region === "US"
            ? "Estados Unidos"
            : "Europa · referencia UE"
      }
    >
      {region === "MX" ? (
        <>
          <i />
          <b>✦</b>
          <i />
        </>
      ) : region === "US" ? (
        <>
          <b>✦</b>
          <i />
        </>
      ) : (
        Array.from({ length: 12 }, (_, i) => (
          <i
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              fontSize: 4,
              fontStyle: "normal",
              lineHeight: 1,
              transform: `translate(-50%,-50%) rotate(${i * 30}deg) translateY(-9px) rotate(${-i * 30}deg)`,
            }}
          >
            ★
          </i>
        ))
      )}
    </span>
  );
}
export default function StudioApp() {
  const [section, setSection] = useState<Section>(initialSection);
  const [prefs, setPrefs] = useState(load);
  const [modal, setModal] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [photoConsent, setPhotoConsent] = useState(false);
  const [region, setRegion] = useState<"MX" | "US" | "EU">("MX");
  const [spread, setSpread] = useState(0);
  const [turned, setTurned] = useState(false);
  const [camera, setCamera] = useState(false);
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState("Todo");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Puebla");
  const [service, setService] = useState("Todos");
  const [chatFilter, setChatFilter] = useState("Todos");
  const [chatIndex, setChatIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Record<number, ChatMessage[]>>({});
  const [manualLocation, setManualLocation] = useState("");
  const [rules, setRules] = useState(true);
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const saved: string[] = Array.isArray(prefs.saved) ? prefs.saved : [];
  const name =
    typeof prefs.name === "string" && prefs.name.trim()
      ? prefs.name
      : "Tu nombre artístico";
  const events: Place[] = Array.isArray(prefs.events) ? prefs.events : [];
  const pro = prefs.pro === true;
  useEffect(() => {
    const small = {
      name: prefs.name,
      bio: prefs.bio,
      set: prefs.set,
      saved: prefs.saved,
      events: prefs.events,
      pro: prefs.pro,
    };
    try {
      localStorage.setItem("nodal-studio-v3", JSON.stringify(small));
    } catch {
      setNotice("El navegador no permitió guardar la muestra.");
    }
  }, [prefs]);
  useEffect(() => {
    const f = () => setSection(initialSection());
    addEventListener("hashchange", f);
    return () => removeEventListener("hashchange", f);
  }, []);
  useEffect(() => {
    if (modal) {
      if (!dialog.current?.open) dialog.current?.showModal();
    } else {
      dialog.current?.close();
      stopCamera();
    }
  }, [modal]);
  useEffect(
    () => () => stream.current?.getTracks().forEach((t) => t.stop()),
    [],
  );
  useEffect(() => {
    if (camera && video.current && stream.current) {
      video.current.srcObject = stream.current;
      void video.current
        .play()
        .catch(() =>
          setNotice("Toca reproducir o usa la cámara del teléfono."),
        );
    }
  }, [camera]);
  function stopCamera() {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    setCamera(false);
  }
  function go(next: Section) {
    setSection(next);
    location.hash = next;
    window.scrollTo({ top: 0, behavior: "instant" });
    setNotice("");
  }
  function toggleSave(id: string) {
    setPrefs((p: StudioPrefs) => ({
      ...p,
      saved: saved.includes(id)
        ? saved.filter((s) => s !== id)
        : [...saved, id],
    }));
  }
  function open(id: string) {
    setNotice("");
    setModal(id);
  }
  async function startCamera() {
    if (!photoConsent) {
      setNotice("Acepta el uso local de tu selfie antes de abrir la cámara.");
      return;
    }
    try {
      stream.current?.getTracks().forEach((t) => t.stop());
      stream.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setCamera(true);
    } catch {
      setNotice(
        "No se pudo abrir la cámara. Permite el acceso en HTTPS o usa «Tomar/elegir selfie».",
      );
    }
  }
  function capture() {
    const v = video.current;
    if (!v?.videoWidth) return;
    const c = document.createElement("canvas");
    c.width = c.height = 640;
    const n = Math.min(v.videoWidth, v.videoHeight);
    c.getContext("2d")!.drawImage(
      v,
      (v.videoWidth - n) / 2,
      (v.videoHeight - n) / 2,
      n,
      n,
      0,
      0,
      640,
      640,
    );
    setSelfie(c.toDataURL("image/jpeg", 0.85));
    stopCamera();
  }
  async function chooseSelfie(file: File | undefined) {
    if (!file) return;
    if (!photoConsent) {
      setNotice("Primero acepta el uso local de la foto.");
      return;
    }
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setNotice("Usa JPEG, PNG o WebP de hasta 5 MB.");
      return;
    }
    try {
      const bitmap = await createImageBitmap(file);
      const c = document.createElement("canvas");
      c.width = c.height = 640;
      const n = Math.min(bitmap.width, bitmap.height);
      c.getContext("2d")!.drawImage(
        bitmap,
        (bitmap.width - n) / 2,
        (bitmap.height - n) / 2,
        n,
        n,
        0,
        0,
        640,
        640,
      );
      setSelfie(c.toDataURL("image/jpeg", 0.85));
      bitmap.close();
      setNotice(
        "Selfie cargada sólo en esta sesión. No verifica tu identidad.",
      );
    } catch {
      setNotice("No pudimos leer esa imagen. Prueba con otra.");
    }
  }
  function send(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    const problem = contactRisk(draft);
    if (problem) {
      setNotice(
        problem + " Filtro de patrones de muestra; IA de servidor pendiente.",
      );
      return;
    }
    setMessages((m) => ({
      ...m,
      [chatIndex]: [
        ...(m[chatIndex] || []),
        { text: draft.trim(), kind: "text", mine: true },
      ],
    }));
    setDraft("");
    setNotice(
      "Mensaje añadido a la simulación local; no se envió a otra persona.",
    );
  }
  function locationMessage(text: string) {
    if (!text.trim()) return;
    const risk = contactRisk(text);
    if (risk) {
      setNotice(risk);
      return;
    }
    setMessages((m) => ({
      ...m,
      [chatIndex]: [
        ...(m[chatIndex] || []),
        { text, kind: "location", mine: true },
      ],
    }));
    setNotice(
      "Ubicación agregada sólo al chat de muestra, sin transmisión externa.",
    );
    setManualLocation("");
    setModal(null);
  }
  const listings = [...seed, ...events].filter(
    (p) =>
      (city === "Worldwide" ||
        p.city.toLowerCase().includes(city.toLowerCase())) &&
      (tab === "Todo" ||
        (tab === "Guardados" && saved.includes(p.id)) ||
        (tab === "Establecimientos" && p.type === "Establecimiento") ||
        (tab === "Eventos" && p.type === "Evento")) &&
      [p.name, p.genre, p.category]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const activePlace = [...seed, ...events].find((p) => modal === p.id);
  const services = [
    {
      name: "Catering",
      icon: Utensils,
      detail: "Alimentos y hospitalidad para tu producción.",
    },
    {
      name: "Iluminación",
      icon: Lightbulb,
      detail: "Diseño de luz, ambientación y montaje.",
    },
    {
      name: "Fotografía y video",
      icon: Video,
      detail: "Cámara, fotografía, video y cobertura.",
    },
    {
      name: "Audio",
      icon: AudioLines,
      detail: "PA, monitores, operación y microfonía.",
    },
    {
      name: "Equipo DJ",
      icon: Headphones,
      detail: "Mixers, reproductores, audífonos y backline.",
    },
    {
      name: "Otros productos",
      icon: Package,
      detail: "Cables, adaptadores, conectividad y accesorios.",
    },
  ];
  const profileImage = selfie ? (
    <img src={selfie} alt="Tu selfie de muestra" />
  ) : (
    <UserRound strokeWidth={1} size={72} />
  );
  return (
    <div className="studio">
      <aside className="s-rail">
        <button aria-label="NODAL inicio" onClick={() => go("inicio")}>
          <Mark />
        </button>
        <nav aria-label="Navegación principal">
          {nav.map((n) => (
            <button
              key={n.id}
              className={section === n.id ? "active" : ""}
              onClick={() => go(n.id)}
              aria-current={section === n.id ? "page" : undefined}
            >
              <n.icon size={21} />
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
        <button
          className="s-rail-bottom"
          onClick={() => open("plan")}
          aria-label="Ver membresía"
        >
          N<span>+</span>
        </button>
      </aside>
      <div className="s-body">
        <header className="s-header">
          <button className="s-wordmark" onClick={() => go("inicio")}>
            NODAL<span>°</span>
          </button>
          <span className="s-header-line">YOUR SOUND. YOUR WORLD.</span>
          <label>
            <Globe2 size={16} />
            <select
              aria-label="Ubicación"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              {[
                "Puebla",
                "Worldwide",
                "Ibiza",
                "Niza",
                "Tulum",
                "Ciudad de México",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <button
            className="s-icon"
            aria-label="Notificaciones"
            onClick={() => open("notifications")}
          >
            <Bell size={20} />
          </button>
          <button
            className="s-avatar"
            onClick={() => open("profile")}
            aria-label="Editar mi presskit"
          >
            {selfie ? <img src={selfie} alt="" /> : "N"}
          </button>
        </header>
        <main className="s-main">
          <div className="s-intro">
            <div>
              <p className="s-eyebrow">
                THE PROFESSIONAL NETWORK FOR ELECTRONIC MUSIC
              </p>
              <h1>
                {section === "inicio"
                  ? "Tu identidad. Tu próximo horizonte."
                  : nav.find((n) => n.id === section)?.label}
              </h1>
            </div>
            <span className="s-preview">
              Vista de diseño · datos de ejemplo
            </span>
          </div>
          {section === "inicio" && (
            <>
              <div className="s-home-grid">
                <section className="s-presskit">
                  <div className="s-presskit-top">
                    <span className="s-eyebrow">
                      DIGITAL PRESSKIT / YOUR OWN SOUND
                    </span>
                    <button className="s-link" onClick={() => open("profile")}>
                      Editar presskit <ArrowUpRight size={17} />
                    </button>
                  </div>
                  <div className="s-presskit-main">
                    <div className="s-portrait">
                      {profileImage}
                      <button
                        onClick={() => open("passport")}
                        aria-label="Añadir mi selfie"
                      >
                        <Camera size={18} />
                      </button>
                    </div>
                    <div>
                      <span className="s-pill">DJ / ARTIST</span>
                      <h2>{name}</h2>
                      <p>
                        {prefs.bio ||
                          "Tu sonido merece un espacio propio. Comparte tu historia, tu música y las conexiones que quieres construir."}
                      </p>
                      <div className="s-presskit-meta">
                        <span>
                          <MapPin size={14} />
                          Puebla, México
                        </span>
                        <span>Organic / Afro house</span>
                      </div>
                      <div className="s-inline">
                        <button
                          className="s-btn"
                          onClick={() =>
                            prefs.set
                              ? window.open(
                                  prefs.set,
                                  "_blank",
                                  "noopener,noreferrer",
                                )
                              : open("profile")
                          }
                        >
                          <Music2 size={16} />
                          Escuchar mi set
                        </button>
                        <button
                          className="s-outline"
                          onClick={() => open("profile")}
                        >
                          Completar mi perfil <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="s-kit-bottom">
                    <span>PRESSKIT VIVO / SIN VOLVER A SUBIR PDFs</span>
                    <span>TURN DISTANCE INTO CONNECTION.</span>
                  </div>
                </section>
                <button
                  className={"s-passport-card cover-" + region}
                  onClick={() => {
                    setSpread(0);
                    setTurned(false);
                    open("passport");
                  }}
                  aria-label="Abrir mi Scene Passport"
                >
                  <div className="s-passport-card-top">
                    <span>SCENE PASSPORT</span>
                    <ArrowUpRight size={17} />
                  </div>
                  <div className="s-passport-symbol">
                    <Mark />
                    <span>NODAL</span>
                  </div>
                  <div className="s-stamps">
                    <i>
                      IBIZA
                      <br />
                      CONCEPTO
                    </i>
                    <i>
                      PUEBLA
                      <br />
                      MUESTRA
                    </i>
                  </div>
                  <div className="s-passport-bottom">
                    <Flag region={region} />
                    <span>
                      Tu historia, sin fronteras.
                      <small>
                        Credencial profesional · No es documento de viaje
                      </small>
                    </span>
                  </div>
                </button>
              </div>
              <section className="s-section">
                <div className="s-section-head">
                  <div>
                    <p className="s-eyebrow">LO IMPORTANTE, A SU TIEMPO</p>
                    <h2>Tu siguiente movimiento.</h2>
                  </div>
                  <button
                    className="s-link"
                    onClick={() => open("notifications")}
                  >
                    Ver actividad <ArrowUpRight size={17} />
                  </button>
                </div>
                <div className="s-activity-grid">
                  <button onClick={() => go("mensajes")}>
                    <MessageCircle />
                    <div>
                      <strong>Nuevos mensajes</strong>
                      <p>Respuestas y conversaciones en un solo lugar.</p>
                    </div>
                    <ArrowUpRight />
                  </button>
                  <button onClick={() => open("notifications")}>
                    <Check />
                    <div>
                      <strong>Bookings aceptados</strong>
                      <p>Aquí aparecerán tus confirmaciones reales.</p>
                    </div>
                    <ArrowUpRight />
                  </button>
                  <button onClick={() => go("bookings")}>
                    <Compass />
                    <div>
                      <strong>Tu próximo escenario</strong>
                      <p>Explora establecimientos y eventos.</p>
                    </div>
                    <ArrowUpRight />
                  </button>
                </div>
              </section>
              <div className="s-note">
                Esta muestra no contiene bookings ni notificaciones reales. Los
                sellos del pasaporte son diseños conceptuales.
              </div>
            </>
          )}
          {section === "mensajes" && (
            <section className="s-messenger">
              <aside>
                <div className="s-section-head">
                  <h2>Tus conversaciones</h2>
                  <MessageCircle size={20} />
                </div>
                <div className="s-tabs compact">
                  {["Todos", "Respondidos", "Pendientes"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setChatFilter(t)}
                      aria-pressed={chatFilter === t}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {chats.map(
                  (c, i) =>
                    (chatFilter === "Todos" || chatFilter === c.status) && (
                      <button
                        key={c.name}
                        className={
                          "s-chat-contact " +
                          (chatIndex === i ? "selected" : "")
                        }
                        onClick={() => {
                          setChatIndex(i);
                          setNotice("");
                        }}
                      >
                        <span>{c.initial}</span>
                        <div>
                          <strong>{c.name}</strong>
                          <small>{c.status} · ejemplo</small>
                        </div>
                        <ChevronRight size={15} />
                      </button>
                    ),
                )}
                <p className="s-note">
                  Conversaciones ficticias. Sin envío a terceros.
                </p>
              </aside>
              <div className="s-chat">
                <div className="s-chat-head">
                  <div>
                    <h2>{chats[chatIndex].name}</h2>
                    <p>Acuerdos claros. Conexiones dentro de NODAL.</p>
                  </div>
                  <ShieldCheck size={20} />
                </div>
                <div
                  className="s-chat-log"
                  role="log"
                  aria-label="Mensajes del chat"
                >
                  <div className="s-bubble">{chats[chatIndex].first}</div>
                  {(messages[chatIndex] || []).map((m, i) => (
                    <div key={i} className="s-bubble mine">
                      {m.kind === "location" && <MapPin size={16} />} {m.text}
                      <small>Sólo muestra local</small>
                    </div>
                  ))}
                </div>
                {notice && (
                  <p className="s-form-notice" role="status">
                    {notice}
                  </p>
                )}
                <form className="s-chat-compose" onSubmit={send}>
                  <button
                    type="button"
                    className="s-icon"
                    aria-label="Compartir ubicación"
                    onClick={() => open("location")}
                  >
                    <MapPin />
                  </button>
                  <input
                    aria-label="Escribir mensaje"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Escribe aquí, conecta aquí…"
                    maxLength={2000}
                  />
                  <button
                    className="s-btn"
                    type="submit"
                    aria-label="Enviar mensaje de muestra"
                  >
                    <Send size={17} />
                  </button>
                </form>
                <p className="s-chat-policy">
                  Filtro de contactos de muestra activo · La detección con IA y
                  moderación de servidor están pendientes.
                </p>
              </div>
            </section>
          )}
          {section === "bookings" && (
            <>
              <section className="s-banner">
                <div>
                  <p className="s-eyebrow">UN LUGAR PARA TU SONIDO</p>
                  <h2>Encuentra tu próximo escenario.</h2>
                  <p>
                    Clubs, restaurantes, terrazas y eventos. Elige dónde quieres
                    conectar.
                  </p>
                </div>
                <button
                  className="s-btn"
                  onClick={() => open(pro ? "event" : "plan")}
                >
                  Publicar evento <Plus size={17} />
                </button>
              </section>
              <div className="s-toolbar">
                <div className="s-tabs">
                  {["Todo", "Establecimientos", "Eventos", "Guardados"].map(
                    (t) => (
                      <button
                        key={t}
                        aria-pressed={tab === t}
                        onClick={() => setTab(t)}
                      >
                        {t}
                        {t === "Guardados" && <Bookmark size={13} />}
                      </button>
                    ),
                  )}
                </div>
                <label className="s-search">
                  <Search size={17} />
                  <input
                    placeholder="Busca un lugar, un sonido…"
                    aria-label="Buscar establecimientos y eventos"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
              </div>
              <div className="s-listings">
                {listings.map((p, i) => (
                  <article className={"s-place tone-" + (i % 3)} key={p.id}>
                    <div className="s-place-art">
                      <span>{p.category.toUpperCase()}</span>
                      <div className="s-orb" />
                      <button
                        className="s-save"
                        aria-label={
                          (saved.includes(p.id)
                            ? "Quitar de guardados: "
                            : "Guardar: ") + p.name
                        }
                        aria-pressed={saved.includes(p.id)}
                        onClick={() => toggleSave(p.id)}
                      >
                        <Bookmark
                          size={19}
                          fill={saved.includes(p.id) ? "currentColor" : "none"}
                        />
                      </button>
                      <strong>
                        {p.city.toUpperCase()}
                        <br />
                        {p.type === "Evento"
                          ? "THE NEXT MOMENT"
                          : "A PLACE TO CONNECT"}
                      </strong>
                    </div>
                    <div className="s-place-copy">
                      <p className="s-eyebrow">
                        {p.type} · {p.category}
                      </p>
                      <button
                        className="s-place-title"
                        onClick={() => open(p.id)}
                      >
                        {p.name}
                        <ArrowUpRight size={19} />
                      </button>
                      <p>{p.genre}</p>
                    </div>
                  </article>
                ))}
              </div>
              {!listings.length && (
                <div className="s-empty">
                  <Compass size={34} />
                  <h2>Otro horizonte te espera.</h2>
                  <p>No hay ejemplos con estos filtros.</p>
                  <button
                    className="s-outline"
                    onClick={() => {
                      setCity("Worldwide");
                      setTab("Todo");
                      setSearch("");
                    }}
                  >
                    Ver todos los ejemplos
                  </button>
                </div>
              )}
              <p className="s-note">
                Lugares y eventos ficticios para evaluar el diseño. Los
                establecimientos no aceptan solicitudes masivas por aparecer en
                el directorio.
              </p>
            </>
          )}
          {section === "discover" && (
            <>
              <section className="s-banner editorial">
                <div>
                  <p className="s-eyebrow">SCENE / SONIDO / CULTURA</p>
                  <h2>El mundo detrás de la música.</h2>
                  <p>
                    Noticias de industria, música y agenda según tu ubicación.
                  </p>
                </div>
                <Compass size={70} strokeWidth={0.8} />
              </section>
              <div className="s-editorial-grid">
                {[
                  {
                    title: "Industria, con contexto.",
                    body: "Consulta las publicaciones originales. No hay un feed de noticias verificado conectado a esta muestra.",
                    link: "https://mixmag.net/",
                    cta: "Abrir Mixmag",
                  },
                  {
                    title: "Tecnología y cultura DJ.",
                    body: "Equipo, artistas y escena en las fuentes originales. No se inventan titulares o entrevistas.",
                    link: "https://djmag.com/",
                    cta: "Abrir DJ Mag",
                  },
                  {
                    title: "Tu próxima escucha.",
                    body: "Explora organic house y construye tus propias referencias. Recomendación editorial de ejemplo, sin IA conectada.",
                    link: "https://open.spotify.com/search/organic%20house",
                    cta: "Explorar música",
                  },
                ].map((c) => (
                  <article key={c.title}>
                    <span className="s-eyebrow">
                      NODAL SELECTS / FUENTES EXTERNAS
                    </span>
                    <h2>{c.title}</h2>
                    <p>{c.body}</p>
                    <a
                      className="s-link"
                      href={c.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {c.cta}
                      <ArrowUpRight size={16} />
                    </a>
                  </article>
                ))}
              </div>
              <section className="s-section">
                <div className="s-section-head">
                  <h2>En el horizonte de {city}.</h2>
                  <span className="s-note">Agenda de ejemplo</span>
                </div>
                {[...seed, ...events]
                  .filter(
                    (p) =>
                      p.type === "Evento" &&
                      (city === "Worldwide" || p.city === city),
                  )
                  .map((p) => (
                    <button
                      key={p.id}
                      className="s-agenda"
                      onClick={() => open(p.id)}
                    >
                      <CalendarDays />
                      <span>
                        {p.name}
                        <small>{p.city} · Evento de muestra</small>
                      </span>
                      <ArrowUpRight />
                    </button>
                  ))}
                {![...seed, ...events].some(
                  (p) =>
                    p.type === "Evento" &&
                    (city === "Worldwide" || p.city === city),
                ) && (
                  <p className="s-note">
                    Sin eventos de muestra en esta ubicación. La agenda real
                    requiere fuentes y organizadores verificados.
                  </p>
                )}
              </section>
            </>
          )}
          {section === "servicios" && (
            <>
              <section className="s-banner">
                <div>
                  <p className="s-eyebrow">TODO LO QUE HACE POSIBLE UN SET</p>
                  <h2>El equipo detrás del momento.</h2>
                  <p>
                    Necesidades de producción, organizadas por especialidad.
                  </p>
                </div>
                <Layers3 size={72} strokeWidth={0.8} />
              </section>
              <div className="s-tabs service-tabs">
                {["Todos", ...services.map((s) => s.name)].map((s) => (
                  <button
                    key={s}
                    aria-pressed={service === s}
                    onClick={() => setService(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="s-service-grid">
                {services
                  .filter((s) => service === "Todos" || service === s.name)
                  .map((s, i) => (
                    <button
                      key={s.name}
                      onClick={() => open("service:" + s.name)}
                    >
                      <span className="s-eyebrow">0{i + 1} / PRODUCTION</span>
                      <s.icon size={42} strokeWidth={1} />
                      <h2>{s.name}</h2>
                      <p>{s.detail}</p>
                      <span className="s-link">
                        Preparar una solicitud <ArrowUpRight size={17} />
                      </span>
                    </button>
                  ))}
              </div>
              <p className="s-note">
                Categorías y solicitudes de muestra. No hay cotizaciones ni
                proveedores reales conectados.
              </p>
            </>
          )}
          {section === "perfil" && (
            <>
              <section className="s-profile-sheet">
                <div className="s-portrait">{profileImage}</div>
                <div>
                  <p className="s-eyebrow">PRESSKIT DIGITAL</p>
                  <h2>{name}</h2>
                  <p>{prefs.bio || "Tu historia empieza por presentarte."}</p>
                  <button className="s-btn" onClick={() => open("profile")}>
                    Editar mi presskit
                    <ArrowUpRight size={17} />
                  </button>
                </div>
              </section>
              <div className="s-settings-grid">
                <button onClick={() => open("passport")}>
                  <Flag region={region} />
                  <span>Mi Scene Passport</span>
                  <ArrowUpRight />
                </button>
                <button onClick={() => open("plan")}>
                  <ShieldCheck />
                  <span>Mi membresía{pro ? " · Pro de muestra" : ""}</span>
                  <ArrowUpRight />
                </button>
                <a
                  href="/reports/NODAL_PLAN_24_MESES.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download />
                  <span>Plan y costos · PDF</span>
                  <ArrowUpRight />
                </a>
              </div>
              <p className="s-note">
                La selfie se mantiene sólo en memoria durante esta sesión y se
                elimina al recargar. Nombre, biografía y guardados se almacenan
                en este dispositivo. No hay cuenta real.
              </p>
              <button
                className="s-outline"
                onClick={() => {
                  setSelfie(null);
                  setPrefs({});
                  setMessages({});
                  setNotice("Se borró la muestra de este navegador.");
                }}
              >
                Borrar datos de muestra
              </button>
            </>
          )}
          <footer className="s-footer">
            <span>NODAL · MUSIC CONNECTS PEOPLE.</span>
            <a
              href="/reports/NODAL_PLAN_24_MESES.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Plan, costos y análisis <ArrowUpRight size={14} />
            </a>
          </footer>
          {notice && section !== "mensajes" && !modal && (
            <p className="s-form-notice" role="status">
              {notice}
            </p>
          )}
        </main>
        <nav className="s-mobile-nav" aria-label="Navegación móvil">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              aria-current={section === n.id ? "page" : undefined}
            >
              <n.icon size={20} />
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <dialog
        className={
          "s-modal " + (modal === "passport" ? "s-modal-passport" : "")
        }
        ref={dialog}
        onClose={() => {
          setModal(null);
          stopCamera();
        }}
        onCancel={() => setModal(null)}
      >
        <button
          className="s-modal-close"
          aria-label="Cerrar ventana"
          onClick={() => setModal(null)}
        >
          <X size={21} />
        </button>
        {modal === "passport" && (
          <>
            <p className="s-eyebrow">
              SCENE PASSPORT / TU IDENTIDAD PROFESIONAL
            </p>
            <h2>Tu historia deja huella.</h2>
            <div className="s-passport-controls">
              <label>
                Paleta de origen
                <select
                  aria-label="Paleta de origen"
                  value={region}
                  onChange={(e) =>
                    setRegion(e.target.value as "MX" | "US" | "EU")
                  }
                >
                  <option value="MX">México · verde</option>
                  <option value="US">Estados Unidos · azul</option>
                  <option value="EU">Europa / UE · borgoña</option>
                </select>
              </label>
              <p>
                No es un documento oficial. Europa es una referencia cromática,
                no una nacionalidad.
              </p>
            </div>
            <div
              className={
                "s-book " + (turned ? "is-open" : "") + " cover-" + region
              }
            >
              <div
                className="s-book-pages"
                aria-hidden={!turned}
                inert={!turned}
              >
                <div className="s-book-page identity">
                  <span className="s-eyebrow">
                    NODAL / PROFESSIONAL IDENTITY
                  </span>
                  <div className="s-passport-photo">{profileImage}</div>
                  <h3>{name}</h3>
                  <p>
                    {spread === 0
                      ? "Tu sonido conecta ciudades."
                      : "Cada actuación real podrá sumar una historia."}
                  </p>
                  <Flag region={region} />
                  <small>SELLO DE IDENTIDAD VISUAL · NO VERIFICADA</small>
                </div>
                <div className="s-book-page stamps">
                  <span className="s-eyebrow">
                    SCENE / {String(spread + 1).padStart(2, "0")}
                  </span>
                  <div
                    className={"s-leaf " + (spread % 2 ? "leaf-turned" : "")}
                    key={spread}
                  >
                    {["PUEBLA", "IBIZA", "CÔTE D’AZUR"].map((s, i) => (
                      <div className={"s-passport-stamp stamp-" + i} key={s}>
                        {s}
                        <small>SELLO CONCEPTUAL</small>
                        <span>✦ NODAL ✦</span>
                      </div>
                    ))}
                  </div>
                  <p>No acredita viajes ni actuaciones reales.</p>
                </div>
              </div>
              <button
                className="s-book-cover"
                tabIndex={turned ? -1 : 0}
                aria-hidden={turned}
                onClick={() => setTurned(true)}
                aria-label="Abrir las hojas del pasaporte"
              >
                <div className="s-book-cover-top">
                  SCENE PASSPORT
                  <Flag region={region} />
                </div>
                <Mark />
                <strong>NODAL</strong>
                <span>
                  TURN DISTANCE
                  <br />
                  INTO CONNECTION.
                </span>
                <small>CREDENCIAL PROFESIONAL / NO DOCUMENTO DE VIAJE</small>
              </button>
            </div>
            <div className="s-book-navigation">
              <button
                className="s-outline"
                onClick={() => {
                  if (spread === 0) setTurned(false);
                  else setSpread((s) => s - 1);
                }}
              >
                <ChevronLeft size={16} />
                Anterior
              </button>
              <span>
                {turned
                  ? "Páginas " + (spread * 2 + 1) + "–" + (spread * 2 + 2)
                  : "Portada"}
              </span>
              <button
                className="s-btn"
                onClick={() => {
                  if (!turned) setTurned(true);
                  else setSpread((s) => s + 1);
                }}
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            </div>
            <section className="s-selfie">
              <h3>Una selfie para tu Passport.</h3>
              <p>
                Se usa sólo en esta muestra y no se sube a ningún servidor. No
                es verificación biométrica. En la app nativa se implementará
                captura, consentimiento y almacenamiento privado.
              </p>
              <label className="s-consent">
                <input
                  type="checkbox"
                  checked={photoConsent}
                  onChange={(e) => {
                    setPhotoConsent(e.target.checked);
                    if (!e.target.checked) {
                      stopCamera();
                      setSelfie(null);
                    }
                  }}
                />
                Acepto usar mi foto sólo durante esta sesión de diseño.
              </label>
              <div className="s-inline">
                <button
                  className="s-btn"
                  onClick={startCamera}
                  disabled={!photoConsent}
                >
                  <Camera size={17} />
                  Abrir cámara frontal
                </button>
                <label
                  className={
                    "s-outline s-file-label " +
                    (!photoConsent ? "disabled" : "")
                  }
                >
                  Tomar/elegir selfie
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    capture="user"
                    disabled={!photoConsent}
                    onChange={(e) => void chooseSelfie(e.target.files?.[0])}
                  />
                </label>
                {selfie && (
                  <button className="s-outline" onClick={() => setSelfie(null)}>
                    Eliminar selfie
                  </button>
                )}
              </div>
              {camera && (
                <div className="s-camera">
                  <video ref={video} autoPlay playsInline muted />
                  <button className="s-btn" onClick={capture}>
                    Capturar selfie
                  </button>
                  <button className="s-outline" onClick={stopCamera}>
                    Cancelar cámara
                  </button>
                </div>
              )}
            </section>
          </>
        )}
        {modal === "profile" && (
          <>
            <p className="s-eyebrow">PRESSKIT / TU PRESENTACIÓN</p>
            <h2>Tu sonido, en tus palabras.</h2>
            <form
              className="s-form"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                const set = String(f.get("set") || "");
                if (set) {
                  try {
                    const u = new URL(set);
                    if (u.protocol !== "https:" || u.username || u.password)
                      throw Error();
                  } catch {
                    setNotice("Usa un enlace HTTPS válido para tu set.");
                    return;
                  }
                }
                setPrefs((p: StudioPrefs) => ({
                  ...p,
                  name: String(f.get("name")),
                  bio: String(f.get("bio")),
                  set,
                }));
                setModal(null);
              }}
            >
              <label>
                Nombre artístico
                <input
                  name="name"
                  defaultValue={prefs.name || ""}
                  required
                  maxLength={60}
                />
              </label>
              <label>
                Biografía
                <textarea
                  name="bio"
                  defaultValue={prefs.bio || ""}
                  rows={4}
                  maxLength={500}
                />
              </label>
              <label>
                Enlace HTTPS a tu set
                <input
                  name="set"
                  type="url"
                  defaultValue={prefs.set || ""}
                  placeholder="https://soundcloud.com/…"
                />
              </label>
              <button
                type="button"
                className="s-outline"
                onClick={() => open("passport")}
              >
                <Camera size={16} />
                Añadir selfie al Passport
              </button>
              <p className="s-note">
                Sólo se guarda en este navegador; no se publica un perfil.
              </p>
              <button className="s-btn">Guardar presskit de muestra</button>
            </form>
          </>
        )}
        {modal === "plan" && (
          <>
            <p className="s-eyebrow">MEMBRESÍA / PROPUESTA POR VALIDAR</p>
            <h2>Haz que tu siguiente paso cuente.</h2>
            <div className="s-plan">
              <span>DJ PRO</span>
              <strong>
                $149<small>MXN / mes · IVA incluido, supuesto del plan</small>
              </strong>
              <p>
                Perfil completo, organización de oportunidades, guardados y
                publicación de eventos con moderación.
              </p>
              <ul>
                <li>30 días de prueba, sin tarjeta y sin cobro automático.</li>
                <li>Free conserva tu perfil y acceso básico.</li>
                <li>
                  Precio propuesto: requiere validación con DJs de Puebla.
                </li>
              </ul>
              <button
                className="s-btn"
                onClick={() => {
                  setPrefs((p: StudioPrefs) => ({ ...p, pro: !pro }));
                  setNotice(
                    pro
                      ? "Modo Pro de muestra desactivado."
                      : "Modo Pro de muestra activado. No se cobró ni se creó una suscripción.",
                  );
                }}
              >
                {pro ? "Desactivar Pro de muestra" : "Probar Pro de muestra"}
              </button>
            </div>
            <p className="s-note">
              El cliente no podrá otorgar Pro real: producción requiere recibos
              de tienda y permisos de servidor.
            </p>
            <a
              className="s-link"
              href="/reports/NODAL_PLAN_24_MESES.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir costos y estrategia en PDF
              <ArrowUpRight size={16} />
            </a>
          </>
        )}
        {modal === "event" && (
          <>
            <p className="s-eyebrow">DJ PRO / PUBLICACIÓN DE MUESTRA</p>
            <h2>Haz espacio para un encuentro.</h2>
            <form
              className="s-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!pro) {
                  setModal("plan");
                  return;
                }
                const f = new FormData(e.currentTarget);
                const p: Place = {
                  id: "local-" + Date.now(),
                  name: String(f.get("name")),
                  city: String(f.get("city")),
                  type: "Evento",
                  category: String(f.get("date")),
                  genre: String(f.get("genre")),
                  detail:
                    "Evento de muestra creado en este navegador. Sin publicación real ni venta de entradas.",
                };
                setPrefs((v: StudioPrefs) => ({
                  ...v,
                  events: [...events, p],
                }));
                setTab("Eventos");
                setCity(p.city);
                setModal(null);
                setNotice(
                  "Evento guardado sólo en esta muestra, sin publicar en internet.",
                );
              }}
            >
              <label>
                Nombre del evento
                <input name="name" required maxLength={80} />
              </label>
              <label>
                Ciudad
                <select name="city">
                  {["Puebla", "Ibiza", "Niza", "Tulum", "Ciudad de México"].map(
                    (c) => (
                      <option key={c}>{c}</option>
                    ),
                  )}
                </select>
              </label>
              <label>
                Fecha
                <input name="date" type="date" required />
              </label>
              <label>
                Sonido
                <input
                  name="genre"
                  required
                  defaultValue="Organic house"
                  maxLength={60}
                />
              </label>
              <p className="s-note">
                Pro de muestra habilitado. Publicar realmente requiere
                validación de membresía y moderación.
              </p>
              <button className="s-btn">Guardar evento de muestra</button>
            </form>
          </>
        )}
        {modal === "location" && (
          <>
            <p className="s-eyebrow">UBICACIÓN / COMPARTIR CON INTENCIÓN</p>
            <h2>El lugar correcto.</h2>
            <form
              className="s-form"
              onSubmit={(e) => {
                e.preventDefault();
                locationMessage(manualLocation);
              }}
            >
              <label>
                Lugar o punto de encuentro
                <input
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  required
                  maxLength={150}
                  placeholder="Puebla, Centro · punto de encuentro"
                />
              </label>
              <p className="s-note">
                Evita domicilios privados. Esta ubicación se añade sólo a un
                chat ficticio, sin envío externo.
              </p>
              <button className="s-btn">
                <MapPin size={17} />
                Compartir lugar de muestra
              </button>
            </form>
            <button
              className="s-outline"
              onClick={() =>
                navigator.geolocation?.getCurrentPosition(
                  (p) => {
                    setManualLocation(
                      `Coordenadas ${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}`,
                    );
                    setNotice(
                      "Coordenadas obtenidas. Revisa y confirma antes de compartir.",
                    );
                  },
                  () =>
                    setNotice(
                      "Ubicación no disponible. Puedes indicar un punto manualmente.",
                    ),
                )
              }
            >
              Usar mi ubicación · requiere permiso
            </button>
          </>
        )}
        {modal === "notifications" && (
          <>
            <p className="s-eyebrow">ACTIVIDAD / TU SIGUIENTE PASO</p>
            <h2>Todo lo importante, aquí.</h2>
            <div className="s-notification">
              <MessageCircle />
              <span>
                Mensajes y respuestas
                <small>Ejemplo de cómo aparecerán las respuestas.</small>
              </span>
              <button
                className="s-link"
                onClick={() => {
                  setModal(null);
                  go("mensajes");
                }}
              >
                Abrir
              </button>
            </div>
            <div className="s-notification">
              <Check />
              <span>
                Bookings aceptados
                <small>No tienes confirmaciones reales en esta muestra.</small>
              </span>
            </div>
            <p className="s-note">
              Las notificaciones push requieren backend y configuración
              iOS/Android.
            </p>
          </>
        )}
        {activePlace && (
          <>
            <p className="s-eyebrow">
              {activePlace.type.toUpperCase()} / EJEMPLO
            </p>
            <h2>{activePlace.name}</h2>
            <p>{activePlace.detail}</p>
            <div className="s-place-details">
              <span>
                <MapPin size={17} />
                {activePlace.city}
              </span>
              <span>{activePlace.category}</span>
              <span>{activePlace.genre}</span>
            </div>
            <button
              className="s-btn"
              onClick={() => {
                setModal(null);
                go("mensajes");
              }}
            >
              Ver conversación de muestra
              <ArrowUpRight size={17} />
            </button>
            <p className="s-note">
              Un establecimiento sólo recibirá aplicaciones si tiene una
              oportunidad abierta. No es una contratación real.
            </p>
          </>
        )}
        {modal?.startsWith("service:") && (
          <>
            <p className="s-eyebrow">SERVICES / SOLICITUD ESTRUCTURADA</p>
            <h2>{modal.slice(8)}</h2>
            <form
              className="s-form"
              onSubmit={(e) => {
                e.preventDefault();
                setNotice(
                  "Solicitud preparada sólo como muestra. No se envió a proveedores.",
                );
              }}
            >
              <label>
                Qué necesitas
                <textarea
                  rows={4}
                  required
                  maxLength={1000}
                  placeholder="Modelo, cantidad, fecha y necesidades de montaje…"
                />
              </label>
              <label>
                Fecha
                <input type="date" required />
              </label>
              <button className="s-btn">Preparar solicitud de muestra</button>
            </form>
            <p className="s-note">
              Cotizaciones, disponibilidad, contratos y pagos se implementarán
              en el backend.
            </p>
          </>
        )}
        {notice && (
          <p className="s-form-notice" role="status">
            {notice}
          </p>
        )}
        <div className="s-modal-footer">
          NODAL DESIGN STUDY · NO LIVE BOOKINGS
        </div>
      </dialog>
    </div>
  );
}
