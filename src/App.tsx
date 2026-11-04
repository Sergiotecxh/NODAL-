import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Check,
  CheckCheck,
  Bookmark,
  Copy,
  MapPin,
  CalendarDays,
  ShieldCheck,
  ArrowRight,
  Music2,
  Mail,
  Bell,
  Plane,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Experience from "./components/Experience";
import { opportunities, artists, cityLabels } from "./data";
import type { City, Genre, Page, ExperienceProps } from "./types";

type Preferences = {
  city: City;
  saved: string[];
  profile: { name: string; statement: string; home: string };
  palette: "coast" | "ocean" | "sage";
  motion: boolean;
  availability: boolean;
  tour: { city: string; date: string } | null;
};
type Dialog =
  | { type: "opportunity"; id: string }
  | { type: "artist"; id: string }
  | { type: Parameters<ExperienceProps["onAction"]>[0] };
const STORAGE_KEY = "nodal-design-v2";
const defaults: Preferences = {
  city: "worldwide",
  saved: [],
  profile: { name: "", statement: "", home: "Ciudad de México" },
  palette: "coast",
  motion: true,
  availability: true,
  tour: null,
};
function readPreferences(): Preferences {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!raw || typeof raw !== "object") return defaults;
    const cities = ["worldwide", "ibiza", "riviera", "tulum", "cdmx"];
    return {
      ...defaults,
      city: cities.includes(raw.city) ? raw.city : defaults.city,
      saved: Array.isArray(raw.saved)
        ? raw.saved.filter((x: unknown) => typeof x === "string")
        : [],
      profile: {
        name:
          typeof raw.profile?.name === "string"
            ? raw.profile.name.slice(0, 60)
            : "",
        statement:
          typeof raw.profile?.statement === "string"
            ? raw.profile.statement.slice(0, 180)
            : "",
        home:
          typeof raw.profile?.home === "string"
            ? raw.profile.home.slice(0, 80)
            : defaults.profile.home,
      },
      palette: ["coast", "ocean", "sage"].includes(raw.palette)
        ? raw.palette
        : "coast",
      motion: typeof raw.motion === "boolean" ? raw.motion : true,
      availability:
        typeof raw.availability === "boolean" ? raw.availability : true,
      tour:
        raw.tour &&
        typeof raw.tour.city === "string" &&
        typeof raw.tour.date === "string"
          ? raw.tour
          : null,
    };
  } catch {
    return defaults;
  }
}
function currentPage(): Page {
  const hash = window.location.hash.slice(1);
  return ["home", "bookings", "discover", "services", "profile"].includes(hash)
    ? (hash as Page)
    : "home";
}
export default function App() {
  const [page, setPage] = useState<Page>(currentPage);
  const [prefs, setPrefs] = useState<Preferences>(readPreferences);
  const [genre, setGenre] = useState<Genre>("all");
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [simulated, setSimulated] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [copyState, setCopyState] = useState("");
  const lastFocus = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef(false);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* Preview remains usable when device storage is unavailable. */
    }
    document.documentElement.dataset.palette = prefs.palette;
    document.documentElement.dataset.motion = prefs.motion
      ? "ambient"
      : "quiet";
  }, [prefs]);
  useEffect(() => {
    const handler = () => {
      setPage(currentPage());
      setDialog(null);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 3800);
    return () => clearTimeout(timeout);
  }, [toast]);
  useEffect(() => {
    if (!dialog) return;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() =>
      dialogRef.current
        ?.querySelector<HTMLElement>(
          'button,input,select,textarea,[tabindex="0"]',
        )
        ?.focus(),
    );
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeDialog();
      }
      if (e.key === "Tab") {
        const all = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]),a[href],input:not([disabled]),select,textarea,[tabindex="0"]',
          ) ?? [],
        ).filter((el) => el.getClientRects().length);
        const first = all[0],
          last = all[all.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = bodyOverflow;
      document.removeEventListener("keydown", key);
    };
  }, [dialog]);
  function openDialog(next: Dialog) {
    lastFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setCopyState("");
    setDialog(next);
  }
  function closeDialog() {
    setDialog(null);
    requestAnimationFrame(
      () => lastFocus.current?.isConnected && lastFocus.current.focus(),
    );
  }
  function navigate(next: Page) {
    setPage(next);
    setDialog(null);
    window.location.hash = next;
    window.scrollTo({ top: 0, behavior: "instant" });
    pendingFocus.current = true;
  }
  useEffect(() => {
    if (pendingFocus.current) {
      document.getElementById("main-content")?.focus({ preventScroll: true });
      pendingFocus.current = false;
    }
  }, [page]);
  function save(id: string) {
    setPrefs((previous) => {
      const saved = previous.saved.includes(id)
        ? previous.saved.filter((i) => i !== id)
        : [...previous.saved, id];
      return { ...previous, saved };
    });
  }
  function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPrefs((p) => ({
      ...p,
      profile: {
        name: String(data.get("name") ?? "").trim(),
        statement: String(data.get("statement") ?? "").trim(),
        home: String(data.get("home") ?? "").trim(),
      },
    }));
    closeDialog();
    setToast("Perfil de muestra guardado en este dispositivo.");
  }
  function submitTour(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPrefs((p) => ({
      ...p,
      tour: { city: String(data.get("city")), date: String(data.get("date")) },
    }));
    closeDialog();
    setToast("Ruta de muestra guardada en este dispositivo.");
  }
  const needle = search.toLocaleLowerCase("es").trim();
  const filtered = opportunities.filter(
    (o) =>
      (prefs.city === "worldwide" || o.city === prefs.city) &&
      (genre === "all" || o.genre === genre) &&
      (!needle ||
        [o.title, o.venue, o.location, o.genre]
          .join(" ")
          .toLocaleLowerCase("es")
          .includes(needle)),
  );
  const filteredArtists = artists.filter(
    (a) =>
      (genre === "all" || a.genre === genre) &&
      (!needle ||
        [a.name, a.city, a.genre]
          .join(" ")
          .toLocaleLowerCase("es")
          .includes(needle)) &&
      (prefs.city === "worldwide" ||
        (prefs.city === "cdmx" && a.city.includes("México")) ||
        (prefs.city === "riviera" && a.city.includes("Francia"))),
  );
  const opportunity =
    dialog?.type === "opportunity"
      ? opportunities.find((o) => o.id === dialog.id)
      : null;
  const artist =
    dialog?.type === "artist" ? artists.find((a) => a.id === dialog.id) : null;
  const titles: Record<
    Exclude<Dialog["type"], "opportunity" | "artist">,
    string
  > = {
    notifications: "Lo importante, a su tiempo.",
    messages: "Cada conexión tiene una historia.",
    preferences: "Un espacio que se siente tuyo.",
    profile: "Tu identidad, con intención.",
    availability: "Haz espacio para lo que viene.",
    tour: "Deja que tu sonido viaje.",
    share: "Las buenas conexiones se comparten.",
    about: "La gente detrás de la música.",
    "create-opportunity": "Empieza por una oportunidad real.",
  };
  const dialogTitle =
    opportunity?.title ??
    artist?.name ??
    (dialog && dialog.type !== "opportunity" && dialog.type !== "artist"
      ? titles[dialog.type]
      : "NODAL");
  return (
    <>
      <div className="experience-root" inert={!!dialog}>
        <Experience
          page={page}
          city={prefs.city}
          genre={genre}
          search={search}
          saved={prefs.saved}
          opportunities={filtered}
          artists={filteredArtists}
          profile={prefs.profile}
          availability={prefs.availability}
          onNavigate={navigate}
          onCityChange={(city) => setPrefs((p) => ({ ...p, city }))}
          onGenreChange={setGenre}
          onSearchChange={setSearch}
          onSave={save}
          onOpenOpportunity={(id) => openDialog({ type: "opportunity", id })}
          onOpenArtist={(id) => openDialog({ type: "artist", id })}
          onAction={(type) => openDialog({ type })}
        />
      </div>
      {toast && (
        <div className="toast" role="status">
          <Check size={16} />
          {toast}
        </div>
      )}
      {dialog && (
        <div
          className="overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDialog();
          }}
        >
          <div
            className={`dialog ${opportunity ? "dialog--wide" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            ref={dialogRef}
          >
            <button
              className="dialog-close"
              aria-label="Cerrar ventana"
              onClick={closeDialog}
            >
              <X size={20} />
            </button>
            <p className="dialog-eyebrow">
              NODAL /{" "}
              {opportunity
                ? "THE NEXT CONNECTION"
                : artist
                  ? "THE PEOPLE BEHIND THE MUSIC"
                  : "YOUR OWN RHYTHM"}
            </p>
            <h2 className="dialog-title" id="dialog-title">
              {dialogTitle}
            </h2>
            {opportunity && (
              <>
                <div
                  className={`dialog-landscape ${opportunity.color}`}
                  aria-hidden="true"
                >
                  <span />
                  <i />
                  <b />
                  {opportunity.location}
                </div>
                <p className="dialog-copy">{opportunity.description}</p>
                <div className="dialog-grid">
                  <div>
                    <span className="dialog-label">Lugar</span>
                    <p>
                      <MapPin size={14} />
                      {opportunity.location}
                    </p>
                  </div>
                  <div>
                    <span className="dialog-label">Fecha de muestra</span>
                    <p>
                      <CalendarDays size={14} />
                      {opportunity.date}
                    </p>
                  </div>
                  <div>
                    <span className="dialog-label">Sonido & set</span>
                    <p>
                      {opportunity.genre} · {opportunity.setRole}
                    </p>
                  </div>
                  <div>
                    <span className="dialog-label">Fee de muestra</span>
                    <p>{opportunity.fee}</p>
                  </div>
                </div>
                <p className="dialog-time">{opportunity.time}</p>
                <h3 className="dialog-subtitle">
                  Una conexión bien preparada.
                </h3>
                <ul className="dialog-list">
                  {opportunity.requirements.map((r) => (
                    <li key={r}>
                      <Check size={15} />
                      {r}
                    </li>
                  ))}
                </ul>
                <div className="dialog-notice">
                  <ShieldCheck size={18} />
                  <span>
                    Oportunidad ficticia para evaluar el diseño. No es una
                    convocatoria ni una oferta real.
                  </span>
                </div>
                {simulated.includes(opportunity.id) ? (
                  <div className="simulation-confirmation" role="status">
                    <CheckCheck size={22} />
                    <div>
                      <strong>Simulación completada</strong>
                      <p>
                        No se ha enviado ninguna solicitud. Este recorrido sólo
                        muestra la interacción propuesta.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="dialog-actions">
                    <button
                      className="dialog-button"
                      onClick={() =>
                        setSimulated((s) => [...s, opportunity.id])
                      }
                    >
                      Probar Quick Apply
                      <ArrowUpRight size={16} />
                    </button>
                    <button
                      className="dialog-secondary"
                      onClick={() => save(opportunity.id)}
                    >
                      <Bookmark
                        size={16}
                        fill={
                          prefs.saved.includes(opportunity.id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                      {prefs.saved.includes(opportunity.id)
                        ? "Guardada"
                        : "Guardar oportunidad"}
                    </button>
                  </div>
                )}
              </>
            )}
            {artist && (
              <>
                <div className={`artist-dialog-mark ${artist.color}`}>
                  {artist.initials}
                  <Music2 size={40} />
                </div>
                <p className="dialog-copy">{artist.statement}</p>
                <div className="dialog-grid">
                  <p>
                    <MapPin size={16} />
                    {artist.city}
                  </p>
                  <p>{artist.genre}</p>
                </div>
                <p className="dialog-notice">
                  Perfil ficticio para explorar el diseño. No representa a una
                  persona o carrera real.
                </p>
                <button
                  className="dialog-button"
                  onClick={() => {
                    save(artist.id);
                    setToast(
                      prefs.saved.includes(artist.id)
                        ? "Perfil de muestra eliminado de tus guardados."
                        : "Perfil de muestra guardado.",
                    );
                  }}
                >
                  <Bookmark size={17} />
                  {prefs.saved.includes(artist.id)
                    ? "Quitar de guardados"
                    : "Guardar perfil de muestra"}
                </button>
              </>
            )}
            {dialog.type === "profile" && (
              <form onSubmit={submitProfile}>
                <p className="dialog-copy">
                  Primero tu identidad. Después, el siguiente escenario. Puedes
                  probar la edición de este perfil de muestra.
                </p>
                <label className="dialog-label">
                  Nombre artístico
                  <input
                    className="dialog-input"
                    name="name"
                    defaultValue={prefs.profile.name}
                    placeholder="¿Cómo te conoce la escena?"
                    maxLength={60}
                    required
                  />
                </label>
                <label className="dialog-label">
                  Tu sonido, en una frase
                  <textarea
                    className="dialog-input"
                    name="statement"
                    defaultValue={prefs.profile.statement}
                    placeholder="Lo que hace tu sonido tuyo."
                    maxLength={180}
                    rows={3}
                  />
                </label>
                <label className="dialog-label">
                  Home base
                  <input
                    className="dialog-input"
                    name="home"
                    defaultValue={prefs.profile.home}
                    maxLength={80}
                    required
                  />
                </label>
                <p className="dialog-notice">
                  Esta edición se guarda sólo en este navegador. No crea una
                  cuenta ni publica un perfil.
                </p>
                <button className="dialog-button" type="submit">
                  Guardar perfil de muestra
                  <ArrowUpRight size={16} />
                </button>
              </form>
            )}
            {dialog.type === "preferences" && (
              <>
                <p className="dialog-copy">
                  La misma identidad, con una luz diferente.
                </p>
                <fieldset className="palette-picker">
                  <legend>Acento de color</legend>
                  {(["coast", "ocean", "sage"] as const).map((palette, i) => (
                    <button
                      key={palette}
                      aria-pressed={prefs.palette === palette}
                      className={`palette-option palette-${palette}`}
                      onClick={() => setPrefs((p) => ({ ...p, palette }))}
                    >
                      <span />
                      {["Costa", "Océano", "Salvia"][i]}
                      {prefs.palette === palette && <Check size={15} />}
                    </button>
                  ))}
                </fieldset>
                <label className="motion-control">
                  <span>
                    <strong>Movimiento ambiental</strong>
                    <small>
                      Un ritmo suave. Siempre respeta el movimiento reducido de
                      tu dispositivo.
                    </small>
                  </span>
                  <input
                    type="checkbox"
                    checked={prefs.motion}
                    onChange={(e) =>
                      setPrefs((p) => ({ ...p, motion: e.target.checked }))
                    }
                  />
                </label>
                <p className="dialog-notice">
                  Tu apariencia se conserva en este navegador.
                </p>
              </>
            )}
            {dialog.type === "availability" && (
              <>
                <p className="dialog-copy">
                  Tu tiempo también es parte de tu identidad profesional.
                </p>
                <div className="availability-options">
                  {[true, false].map((available) => (
                    <button
                      key={String(available)}
                      className={
                        prefs.availability === available ? "selected" : ""
                      }
                      aria-pressed={prefs.availability === available}
                      onClick={() =>
                        setPrefs((p) => ({ ...p, availability: available }))
                      }
                    >
                      {available
                        ? "Abierto a nuevas conexiones"
                        : "Por ahora, sin disponibilidad"}
                      {prefs.availability === available && <Check size={16} />}
                    </button>
                  ))}
                </div>
                <p className="dialog-notice">
                  Disponibilidad de muestra. No se comparte con organizadores.
                </p>
              </>
            )}
            {dialog.type === "tour" && (
              <form onSubmit={submitTour}>
                <p className="dialog-copy">
                  Elige un horizonte. Imagina las conexiones que podrías
                  encontrar en tu próxima ruta.
                </p>
                <label className="dialog-label">
                  Destino
                  <select
                    name="city"
                    className="dialog-input"
                    defaultValue={prefs.tour?.city ?? "ibiza"}
                  >
                    {Object.entries(cityLabels)
                      .filter(([key]) => key !== "worldwide")
                      .map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                  </select>
                </label>
                <label className="dialog-label">
                  Fecha aproximada
                  <input
                    className="dialog-input"
                    type="date"
                    name="date"
                    defaultValue={prefs.tour?.date ?? ""}
                    required
                  />
                </label>
                <p className="dialog-notice">
                  Ruta de muestra en este dispositivo. No se publica tu
                  ubicación ni se envían alertas.
                </p>
                <button className="dialog-button" type="submit">
                  Explorar mi próxima ruta
                  <Plane size={16} />
                </button>
              </form>
            )}
            {dialog.type === "messages" && (
              <>
                <div className="dialog-symbol">
                  <Mail size={36} strokeWidth={1} />
                </div>
                <p className="dialog-copy">
                  Una conversación útil empieza con una oportunidad. Aquí se
                  conectarán los mensajes de tus solicitudes y bookings.
                </p>
                <p className="dialog-notice">
                  El diseño de la bandeja está en preparación. Esta propuesta
                  visual no envía ni recibe mensajes.
                </p>
                <button
                  className="dialog-button"
                  onClick={() => navigate("bookings")}
                >
                  Explorar oportunidades
                  <ArrowRight size={16} />
                </button>
              </>
            )}
            {dialog.type === "notifications" && (
              <>
                <div className="dialog-symbol">
                  <Bell size={36} strokeWidth={1} />
                </div>
                <p className="dialog-copy">
                  Las respuestas, ofertas y cambios importantes tendrán su
                  propio espacio. Sin ruido innecesario.
                </p>
                <p className="dialog-notice">
                  No hay notificaciones reales en esta vista de diseño.
                </p>
                <button
                  className="dialog-secondary"
                  onClick={() => {
                    closeDialog();
                    openDialog({ type: "preferences" });
                  }}
                >
                  Ajustar mi experiencia
                  <SlidersHorizontal size={16} />
                </button>
              </>
            )}
            {dialog.type === "share" && (
              <>
                <p className="dialog-copy">
                  Comparte esta propuesta de diseño para conversar sobre el
                  próximo NODAL.
                </p>
                <label className="dialog-label">
                  Enlace de esta vista
                  <input
                    className="dialog-input"
                    value={window.location.href}
                    readOnly
                    onFocus={(e) => e.currentTarget.select()}
                  />
                </label>
                <button
                  className="dialog-button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      setCopyState("Enlace copiado.");
                    } catch {
                      setCopyState(
                        "Selecciona el enlace y cópialo manualmente.",
                      );
                    }
                  }}
                >
                  <Copy size={16} />
                  Copiar enlace
                </button>
                {copyState && (
                  <p role="status" className="dialog-copy">
                    {copyState}
                  </p>
                )}
              </>
            )}
            {dialog.type === "about" && (
              <>
                <p className="dialog-copy">
                  Music connects people.
                  <br />
                  NODAL connects the people behind the music.
                </p>
                <p className="dialog-copy">
                  Una identidad profesional, oportunidades con intención y
                  conexiones que se convierten en trabajo. Worldwide by design.
                  Mexico-first by execution.
                </p>
                <p className="dialog-notice">
                  Propuesta visual navegable. Los perfiles, lugares y
                  oportunidades son ejemplos; no hay autenticación, reservas ni
                  pagos reales. Las fotografías se incorporarán en una etapa
                  posterior.
                </p>
                <button
                  className="dialog-button"
                  onClick={() => navigate("discover")}
                >
                  Descubrir la escena
                  <ArrowUpRight size={16} />
                </button>
              </>
            )}
            {dialog.type === "create-opportunity" && (
              <>
                <p className="dialog-copy">
                  Describe tu espacio, el sonido y el momento. La publicación
                  profesional conectará tu organización con artistas preparados
                  para la oportunidad.
                </p>
                <p className="dialog-notice">
                  Este prototipo permite evaluar la experiencia visual. La
                  creación y publicación de convocatorias necesita el backend y
                  los permisos de organizador.
                </p>
                <button
                  className="dialog-button"
                  onClick={() => {
                    closeDialog();
                    openDialog({ type: "opportunity", id: "balearic" });
                  }}
                >
                  Ver una oportunidad de muestra
                  <ArrowUpRight size={16} />
                </button>
              </>
            )}
            <div className="dialog-footnote">
              DESIGN PREVIEW · NO LIVE CONTENT
            </div>
          </div>
        </div>
      )}
    </>
  );
}
