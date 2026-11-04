import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Compass,
  Globe2,
  House,
  Layers3,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Settings2,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { ExperienceProps, Opportunity, Page, City, Genre } from "../types";
import { cityLabels } from "../data";

export function NodalMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="36"
      height="36"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 29V11L30 29V11"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="11" r="4" fill="currentColor" />
      <circle cx="30" cy="29" r="4" fill="currentColor" />
    </svg>
  );
}
function CoastalArt({ variant = "hero" }: { variant?: string }) {
  const id = `art-${variant}`;
  return (
    <div className={`coastal-art coastal-art--${variant}`} aria-hidden="true">
      <svg viewBox="0 0 720 560" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#e3f0ec" />
            <stop offset=".42" stopColor="#bdd9d9" />
            <stop offset="1" stopColor="#769eaa" />
          </linearGradient>
          <linearGradient id={`${id}-water`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#91b6ba" />
            <stop offset=".36" stopColor="#557f90" />
            <stop offset="1" stopColor="#244f67" />
          </linearGradient>
          <linearGradient id={`${id}-metal`} x1="0" y1=".3" x2="1" y2=".7">
            <stop stopColor="#d4eee8" />
            <stop offset=".15" stopColor="#f2faf3" />
            <stop offset=".32" stopColor="#7cacaf" />
            <stop offset=".47" stopColor="#2b6578" />
            <stop offset=".57" stopColor="#a6cfd0" />
            <stop offset=".68" stopColor="#edf8ed" />
            <stop offset=".82" stopColor="#90b9b4" />
            <stop offset="1" stopColor="#386b7c" />
          </linearGradient>
          <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f4fff6" />
            <stop offset=".4" stopColor="#c3e3da" />
            <stop offset="1" stopColor="#5f939a" />
          </linearGradient>
          <radialGradient id={`${id}-sun`}>
            <stop stopColor="#f8f8df" stopOpacity=".96" />
            <stop offset=".55" stopColor="#f5f6dc" stopOpacity=".65" />
            <stop offset="1" stopColor="#e9f5e9" stopOpacity="0" />
          </radialGradient>
          <filter id={`${id}-blur`}>
            <feGaussianBlur stdDeviation="13" />
          </filter>
        </defs>
        <rect width="720" height="560" fill={`url(#${id}-sky)`} />
        <circle cx="504" cy="184" r="146" fill={`url(#${id}-sun)`} />
        <path
          d="M0 310Q170 299 330 305T720 303V560H0Z"
          fill={`url(#${id}-water)`}
        />
        <path
          d="M0 307Q240 299 720 304"
          stroke="#e7f4df"
          strokeWidth="1.5"
          opacity=".8"
        />
        <ellipse
          cx="442"
          cy="440"
          rx="157"
          ry="21"
          fill="#143e52"
          opacity=".26"
          filter={`url(#${id}-blur)`}
        />
        <g className="tide-sculpture">
          <path
            d="M352 132C424 89 550 112 558 193C563 247 497 287 439 316C390 340 345 366 370 408C385 433 438 439 468 427C414 470 323 457 305 404C279 330 369 283 429 252C472 230 503 202 482 172C464 148 419 148 391 167C363 186 367 213 396 228C350 220 318 203 323 177C326 157 336 144 352 132Z"
            fill={`url(#${id}-metal)`}
          />
          <path
            d="M353 132C418 94 540 109 552 184C563 250 464 287 417 314C371 340 338 373 367 409C390 438 440 437 468 427"
            stroke={`url(#${id}-edge)`}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M394 167C364 186 367 213 396 228C348 221 321 203 325 178"
            stroke="#fcfff8"
            strokeWidth="1.2"
            fill="none"
            opacity=".8"
          />
          <path
            d="M482 173C505 213 462 239 422 260C364 292 299 336 309 391"
            stroke="#2b6877"
            strokeWidth="1.4"
            fill="none"
            opacity=".55"
          />
        </g>
        <g fill="none" stroke="#d5e9df" strokeWidth=".7" opacity=".4">
          <ellipse cx="443" cy="446" rx="94" ry="9" />
          <ellipse cx="443" cy="448" rx="143" ry="17" />
          <ellipse cx="443" cy="450" rx="205" ry="28" />
          <ellipse cx="443" cy="455" rx="287" ry="43" />
          <path d="M-50 496Q360 440 770 495" />
          <path d="M-30 529Q380 461 770 536" />
        </g>
        <path
          d="M0 364C109 346 179 372 244 385C125 387 78 408 0 405Z"
          fill="#c0d9cf"
          opacity=".18"
        />
      </svg>
      <div className="art-grain" />
    </div>
  );
}
function OpportunityCard({
  item,
  saved,
  onSave,
  onOpen,
}: {
  item: Opportunity;
  saved: boolean;
  onSave: () => void;
  onOpen: () => void;
}) {
  return (
    <article className={`opportunity-card opportunity-card--${item.color}`}>
      <div className="opportunity-art">
        <button
          className="opportunity-art-link"
          onClick={onOpen}
          aria-label={`Ver oportunidad: ${item.title}`}
        >
          <div className={`abstract-poster abstract-poster--${item.color}`}>
            <span className="poster-orb" />
            <span className="poster-arch" />
            <span className="poster-arch poster-arch--second" />
            <span className="poster-ripple" />
            <span className="poster-text">
              {item.city === "ibiza"
                ? "BALEARIC\nSTATE OF MIND"
                : item.city === "riviera"
                  ? "LA VIE\nEN AZUR"
                  : "FEEL\nTHE RHYTHM"}
            </span>
            <span className="poster-coordinates">
              {item.city === "ibiza"
                ? "38° N / 01° E"
                : item.city === "riviera"
                  ? "43° N / 07° E"
                  : "20° N / 87° W"}
            </span>
          </div>
        </button>
        <span className="opportunity-kind">{item.kind}</span>
        <button
          className={`save-button ${saved ? "is-saved" : ""}`}
          onClick={onSave}
          aria-label={`${saved ? "Quitar de guardados" : "Guardar"}: ${item.title}`}
          aria-pressed={saved}
        >
          {saved ? (
            <Bookmark size={17} fill="currentColor" />
          ) : (
            <Bookmark size={17} />
          )}
        </button>
        <span className="poster-number">{item.number} / NODAL SESSIONS</span>
      </div>
      <div className="opportunity-meta">
        <span>
          <MapPin size={12} />
          {item.location}
        </span>
        <span>{item.date}</span>
      </div>
      <button className="opportunity-title" onClick={onOpen}>
        {item.title}
        <ArrowUpRight size={19} />
      </button>
      <p className="opportunity-venue">{item.venue}</p>
      <div className="opportunity-bottom">
        <span className="genre-label">
          <i />
          {item.genre}
        </span>
        <span className="fee-label">{item.fee}</span>
      </div>
    </article>
  );
}
const navigation: { page: Page; label: string; icon: typeof House }[] = [
  { page: "home", label: "Inicio", icon: House },
  { page: "bookings", label: "Bookings", icon: BriefcaseBusiness },
  { page: "discover", label: "Discover", icon: Compass },
  { page: "services", label: "Servicios", icon: Layers3 },
  { page: "profile", label: "Perfil", icon: UserRound },
];
export default function Experience(props: ExperienceProps) {
  const {
    page,
    city,
    genre,
    search,
    saved,
    opportunities,
    artists,
    onNavigate,
    onCityChange,
    onGenreChange,
    onSearchChange,
    onSave,
    onOpenOpportunity,
    onOpenArtist,
    onAction,
  } = props;
  const [savedOnly, setSavedOnly] = useState(false);
  const profileName = props.profile?.name?.trim() || "";
  const initials = profileName
    ? profileName
        .split(/\s+/)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "N";
  const savedCount = opportunities.filter((o) => saved.includes(o.id)).length;
  const listed =
    page === "bookings" && savedOnly
      ? opportunities.filter((o) => saved.includes(o.id))
      : opportunities;
  const date = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Mexico_City",
  }).format(new Date());
  const pageTitles: Record<Page, string> = {
    home: "Tu próximo capítulo empieza aquí.",
    bookings: "Haz espacio para tu próximo set.",
    discover: "La conexión correcta lo cambia todo.",
    services: "Detrás del sonido, todo un mundo.",
    profile: "Tu sonido. Tu historia. Tu espacio.",
  };
  function renderFilters() {
    return (
      <div className="filters">
        <label className="search-field">
          <Search size={17} />
          <input
            aria-label={
              page === "discover" ? "Buscar artistas" : "Buscar oportunidades"
            }
            placeholder={
              page === "discover"
                ? "Busca un artista, una ciudad, un sonido…"
                : "Busca un lugar, un sonido, una oportunidad…"
            }
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>
        <label className="genre-select">
          <AudioLines size={16} />
          <select
            aria-label="Género"
            value={genre}
            onChange={(e) => onGenreChange(e.target.value as Genre)}
          >
            <option value="all">Todos los sonidos</option>
            <option>Afro house</option>
            <option>Melodic house</option>
            <option>Organic house</option>
          </select>
          <ChevronDown size={14} />
        </label>
        {(genre !== "all" || search || city !== "worldwide") && (
          <button
            className="clear-button"
            onClick={() => {
              onCityChange("worldwide");
              onGenreChange("all");
              onSearchChange("");
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>
    );
  }
  function renderOpportunityGrid() {
    return listed.length ? (
      <div className="opportunities-grid">
        {listed.map((item) => (
          <OpportunityCard
            key={item.id}
            item={item}
            saved={saved.includes(item.id)}
            onSave={() => onSave(item.id)}
            onOpen={() => onOpenOpportunity(item.id)}
          />
        ))}
      </div>
    ) : (
      <div className="designed-empty">
        <Compass size={32} />
        <h3>Hay más horizontes por descubrir.</h3>
        <p>
          {savedOnly
            ? "Guarda una oportunidad para encontrarla aquí."
            : "Prueba con otra ciudad o un sonido diferente."}
        </p>
        <button
          className="text-button"
          onClick={() => {
            setSavedOnly(false);
            onCityChange("worldwide");
            onGenreChange("all");
            onSearchChange("");
          }}
        >
          Explorar todas <ArrowRight size={16} />
        </button>
      </div>
    );
  }
  return (
    <div className="app-layout">
      <aside className="side-rail">
        <button
          className="rail-brand"
          aria-label="NODAL — Inicio"
          onClick={() => onNavigate("home")}
        >
          <NodalMark />
        </button>
        <nav aria-label="Navegación principal" className="rail-nav">
          {navigation.map((n) => (
            <button
              key={n.page}
              onClick={() => onNavigate(n.page)}
              className={`rail-link ${page === n.page ? "active" : ""}`}
              aria-current={page === n.page ? "page" : undefined}
              aria-label={n.label}
            >
              <n.icon size={21} strokeWidth={1.65} />
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="rail-bottom">
          <span className="rail-line" />
          <button
            className="rail-settings"
            aria-label="Preferencias"
            onClick={() => onAction("preferences")}
          >
            <Settings2 size={21} />
          </button>
          <button
            className="rail-avatar"
            aria-label="Tu perfil"
            onClick={() => onNavigate("profile")}
          >
            {initials}
          </button>
        </div>
      </aside>
      <div className="app-body">
        <header className="app-header">
          <button
            className="wordmark"
            onClick={() => onNavigate("home")}
            aria-label="NODAL Inicio"
          >
            NODAL<span>®</span>
          </button>
          <span className="header-descriptor">THE PEOPLE BEHIND THE MUSIC</span>
          <div className="header-right">
            <label className="city-control">
              <Globe2 size={16} />
              <select
                aria-label="Ubicación"
                value={city}
                onChange={(e) => onCityChange(e.target.value as City)}
              >
                {Object.entries(cityLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} />
            </label>
            <span className="header-divider" />
            <button
              className="utility-button"
              aria-label="Mensajes"
              onClick={() => onAction("messages")}
            >
              <MessageCircle size={20} />
            </button>
            <button
              className="utility-button notification-button"
              aria-label="Notificaciones"
              onClick={() => onAction("notifications")}
            >
              <Bell size={20} />
            </button>
            <button
              className="header-avatar"
              aria-label="Abrir mi perfil"
              onClick={() => onNavigate("profile")}
            >
              {initials}
              <span
                className={props.availability === false ? "is-unavailable" : ""}
              />
            </button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} className="workspace">
          <div className="workspace-intro">
            <div>
              <p className="micro-label date-label">
                {page === "home"
                  ? date
                  : "NODAL / " + navigation.find((n) => n.page === page)?.label}
              </p>
              <h1>{pageTitles[page]}</h1>
            </div>
            <button className="preview-note" onClick={() => onAction("about")}>
              <span className="preview-dot" />
              Vista de diseño
              <span className="preview-long"> · Datos de ejemplo</span>
              <ArrowUpRight size={12} />
            </button>
          </div>
          {page === "home" && (
            <>
              <section className="hero-grid">
                <div className="horizon-hero">
                  <CoastalArt />
                  <div className="hero-shade" />
                  <div className="hero-topline">
                    <span>
                      <i />A NEW HORIZON
                    </span>
                    <span>VOL. 01 — THE MEDITERRANEAN EDIT</span>
                  </div>
                  <div className="hero-content">
                    <p className="hero-kicker">Hecho para ir más lejos.</p>
                    <h2>
                      Tu sonido.
                      <br />
                      Sin <em>fronteras.</em>
                    </h2>
                    <p className="hero-description">
                      Los lugares cambian.
                      <br />
                      La conexión se queda.
                    </p>
                    <button
                      className="hero-cta"
                      onClick={() => onNavigate("bookings")}
                    >
                      Encuentra tu próximo set <ArrowUpRight size={18} />
                    </button>
                  </div>
                  <div className="hero-bottomline">
                    <span>IBIZA · CÔTE D’AZUR · WORLDWIDE</span>
                    <span className="hero-edition">
                      MEDITERRANEAN EDIT / 01
                    </span>
                  </div>
                  <span className="art-caption">
                    A study in connection.
                    <br />
                    NODAL ORIGINAL / DIGITAL SCULPTURE
                  </span>
                </div>
                <aside className="connection-card">
                  <div className="connection-top">
                    <span className="micro-label">TU ESPACIO EN LA ESCENA</span>
                    <ArrowUpRight size={17} />
                  </div>
                  <div className="profile-sculpture">
                    <div className="profile-orbit orbit-one" />
                    <div className="profile-orbit orbit-two" />
                    <div className="sculpture-n">
                      n<span>°</span>
                    </div>
                    <span className="sculpture-tag">YOUR NEXT CHAPTER</span>
                  </div>
                  <div className="connection-copy">
                    <h2>
                      {profileName ? (
                        <>
                          {profileName}.<br />
                          Tu siguiente capítulo.
                        </>
                      ) : (
                        <>
                          Todo empieza
                          <br />
                          con tu identidad.
                        </>
                      )}
                    </h2>
                    <p>
                      {profileName ? (
                        props.profile?.statement ||
                        "Un perfil que habla por ti."
                      ) : (
                        <>
                          Un perfil que habla por ti.
                          <br />
                          Una conexión que te lleva más lejos.
                        </>
                      )}
                    </p>
                    <button
                      className="connection-cta"
                      onClick={() => onAction("profile")}
                    >
                      {profileName ? "Editar mi perfil" : "Crear mi perfil"}{" "}
                      <Plus size={17} />
                    </button>
                  </div>
                  <div className="connection-footer">
                    <span className="small-star">✧</span> YOU ARE NODAL.
                  </div>
                </aside>
              </section>
              <section className="opportunities-section">
                <div className="section-heading">
                  <div>
                    <p className="micro-label">
                      <span className="section-index">01</span> / FIND YOUR NEXT
                      MOMENT
                    </p>
                    <h2>El siguiente set podría estar aquí.</h2>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => onNavigate("bookings")}
                  >
                    Explorar oportunidades <ArrowUpRight size={17} />
                  </button>
                </div>
                {renderOpportunityGrid()}
              </section>
              <section className="journey-strip">
                <div className="journey-icon">
                  <Compass size={27} strokeWidth={1.25} />
                </div>
                <div>
                  <p className="micro-label">BUILT FOR A WORLD IN MOTION</p>
                  <h3>Tu próxima parada no tiene por qué estar cerca.</h3>
                </div>
                <button
                  className="soft-button"
                  onClick={() => onAction("tour")}
                >
                  Descubre Tour Mode <ArrowUpRight size={17} />
                </button>
                <div className="journey-dots" aria-hidden="true">
                  <span />
                  <i />
                  <span />
                  <i />
                  <span />
                </div>
              </section>
              <section className="bottom-editorial">
                <span>Music connects people.</span>
                <span>
                  We connect the people
                  <br />
                  behind the music.
                </span>
                <NodalMark />
              </section>
            </>
          )}
          {page === "bookings" && (
            <>
              <section className="page-heading">
                <div>
                  <p className="micro-label">OPEN POSSIBILITIES / WORLDWIDE</p>
                  <h2>
                    Donde empieza
                    <br />
                    <em>tu próxima historia.</em>
                  </h2>
                  <p>
                    Explora sonidos, lugares y momentos. Encuentra el que se
                    siente como tú.
                  </p>
                </div>
                <div className="heading-art">
                  <CoastalArt variant="booking" />
                  <span>A WORLD OF POSSIBILITY</span>
                </div>
              </section>
              <div className="bookings-toolbar">
                <div
                  className="segment-tabs"
                  aria-label="Mostrar oportunidades"
                >
                  <button
                    className={!savedOnly ? "active" : ""}
                    onClick={() => setSavedOnly(false)}
                  >
                    Para ti{" "}
                    <span>
                      {opportunities.length.toString().padStart(2, "0")}
                    </span>
                  </button>
                  <button
                    className={savedOnly ? "active" : ""}
                    onClick={() => setSavedOnly(true)}
                  >
                    Guardadas <Bookmark size={14} />
                    <span>{savedCount.toString().padStart(2, "0")}</span>
                  </button>
                </div>
                <button
                  className="text-button"
                  onClick={() => onAction("create-opportunity")}
                >
                  Publicar oportunidad <Plus size={17} />
                </button>
              </div>
              {renderFilters()}
              {renderOpportunityGrid()}
              <div className="honesty-footnote">
                <i />
                Estas oportunidades son ejemplos de diseño. No son convocatorias
                reales.
              </div>
            </>
          )}
          {page === "discover" && (
            <>
              <section className="page-heading discover-heading">
                <div>
                  <p className="micro-label">DIFFERENT PLACES. ONE SCENE.</p>
                  <h2>
                    El mundo suena mejor
                    <br />
                    <em>cuando conectamos.</em>
                  </h2>
                  <p>
                    Identidades distintas. Una misma forma de sentir la música.
                  </p>
                </div>
                <div className="discovery-symbol" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </section>
              <div className="section-heading">
                <div>
                  <p className="micro-label">ARTISTAS / PERFILES DE EJEMPLO</p>
                  <h2>Un sonido propio.</h2>
                </div>
                <span className="subtle-count">
                  {artists.length.toString().padStart(2, "0")} CONNECTIONS
                </span>
              </div>
              {renderFilters()}
              {artists.length === 0 && (
                <div className="designed-empty">
                  <Compass size={32} />
                  <h3>Un nuevo sonido espera por ti.</h3>
                  <p>
                    No hay perfiles de muestra para estos filtros. Explora otro
                    horizonte.
                  </p>
                  <button
                    className="text-button"
                    onClick={() => {
                      onCityChange("worldwide");
                      onGenreChange("all");
                      onSearchChange("");
                    }}
                  >
                    Explorar todos los perfiles <ArrowRight size={16} />
                  </button>
                </div>
              )}
              <div className="artists-grid">
                {artists.map((a, index) => (
                  <button
                    key={a.id}
                    className={`artist-card artist-card--${a.color}`}
                    onClick={() => onOpenArtist(a.id)}
                  >
                    <div className="artist-visual">
                      <span className="artist-orbit" />
                      <span className="artist-initials">{a.initials}</span>
                      <span className="artist-index">
                        N° {String(index + 1).padStart(3, "0")}
                      </span>
                      <span className="artist-arrow">
                        <ArrowUpRight size={20} />
                      </span>
                    </div>
                    <div className="artist-info">
                      <span className="micro-label">{a.city}</span>
                      <h3>{a.name}</h3>
                      <p>{a.statement}</p>
                      <span className="genre-label">
                        <i />
                        {a.genre}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="discover-invitation">
                <NodalMark />
                <div>
                  <h3>Tu identidad merece su propio espacio.</h3>
                  <p>Empieza por el perfil que te gustaría compartir.</p>
                </div>
                <button
                  className="dark-button"
                  onClick={() => onAction("profile")}
                >
                  Crear mi perfil <ArrowUpRight size={17} />
                </button>
              </div>
            </>
          )}
          {page === "services" && (
            <>
              <section className="services-hero">
                <div className="services-copy">
                  <p className="micro-label">THE PEOPLE WHO MAKE IT HAPPEN</p>
                  <h2>
                    Un gran set.
                    <br />
                    <em>Todo un equipo.</em>
                  </h2>
                  <p>
                    Sonido, luz, imagen y producción.
                    <br />
                    El talento detrás de cada momento.
                  </p>
                  <span className="upcoming-label">
                    <span />
                    En la próxima etapa
                  </span>
                </div>
                <div className="services-object" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <AudioLines size={100} strokeWidth={0.8} />
                </div>
              </section>
              <div className="service-categories">
                {[
                  {
                    n: "01",
                    title: "Sound & equipment",
                    body: "El equipo correcto para tu sonido.",
                    icon: AudioLines,
                  },
                  {
                    n: "02",
                    title: "Light & atmosphere",
                    body: "La luz que transforma un espacio.",
                    icon: Sparkles,
                  },
                  {
                    n: "03",
                    title: "People & production",
                    body: "Quienes hacen posible el momento.",
                    icon: Layers3,
                  },
                ].map((s) => (
                  <div className="service-category" key={s.n}>
                    <div className="service-category-top">
                      <span className="micro-label">
                        {s.n} / NODAL SERVICES
                      </span>
                      <s.icon size={27} strokeWidth={1.2} />
                    </div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                ))}
              </div>
              <div className="services-note">
                <div>
                  <p className="micro-label">PRIMERO, UNA BASE SÓLIDA.</p>
                  <h3>
                    Diseñado para conectar.
                    <br />
                    Construido con intención.
                  </h3>
                </div>
                <p>
                  Esta propuesta presenta la dirección de Services. La
                  contratación, el inventario y las cotizaciones todavía no
                  están disponibles.
                </p>
                <button
                  className="text-button"
                  onClick={() => onNavigate("bookings")}
                >
                  Explorar Bookings <ArrowUpRight size={17} />
                </button>
              </div>
            </>
          )}
          {page === "profile" && (
            <>
              <section className="profile-layout">
                <div className="personal-profile">
                  <p className="micro-label">YOUR SOUND. YOUR STORY.</p>
                  <div
                    className={`profile-avatar-large ${profileName ? "has-name" : ""}`}
                  >
                    {profileName ? (
                      initials
                    ) : (
                      <>
                        n<span>°</span>
                      </>
                    )}
                  </div>
                  <h2>
                    {profileName ? (
                      <>
                        {profileName}
                        <br />
                        <em>Tu espacio en la escena.</em>
                      </>
                    ) : (
                      <>
                        Tu próximo capítulo
                        <br />
                        <em>lleva tu nombre.</em>
                      </>
                    )}
                  </h2>
                  <p>
                    {profileName
                      ? props.profile?.statement ||
                        "Tu sonido, tu historia y tu siguiente oportunidad."
                      : "Crea una identidad profesional que se sienta como tú. Tu música, tu recorrido y tu próxima oportunidad, en un mismo lugar."}
                  </p>
                  {profileName && (
                    <p className="profile-location">
                      <MapPin size={13} />
                      {props.profile?.home}
                    </p>
                  )}
                  <button
                    className="dark-button"
                    onClick={() => onAction("profile")}
                  >
                    {profileName ? "Editar mi perfil" : "Empezar mi perfil"}{" "}
                    <Plus size={17} />
                  </button>
                  <div className="profile-topics">
                    <span>Tu sonido</span>
                    <span>Tu historia</span>
                    <span>Tu siguiente paso</span>
                  </div>
                </div>
                <div className="passport-preview">
                  <div className="passport-label">
                    <span>SCENE PASSPORT</span>
                    <span>DESIGN STUDY / 01</span>
                  </div>
                  <div className="passport-book">
                    <NodalMark />
                    <span className="passport-wordmark">NODAL</span>
                    <div className="passport-lines" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                    <span className="passport-bottom">
                      TURN DISTANCE
                      <br />
                      INTO CONNECTION.
                    </span>
                  </div>
                  <p>Una historia que se construye con actuaciones reales.</p>
                  <button
                    className="text-button"
                    onClick={() => onAction("about")}
                  >
                    Conocer el concepto <ArrowUpRight size={17} />
                  </button>
                </div>
              </section>
              <div className="profile-features">
                {[
                  {
                    title: "Tu disponibilidad",
                    body:
                      props.availability === false
                        ? "Disponibilidad pausada en esta vista previa."
                        : "Disponible para explorar nuevos horizontes.",
                    action: "availability" as const,
                    icon: Check,
                  },
                  {
                    title: "Tu próxima ruta",
                    body: "Más posibilidades, con tu privacidad primero.",
                    action: "tour" as const,
                    icon: Globe2,
                  },
                  {
                    title: "Tu perfil, compartido",
                    body: "Un enlace para acercar tu sonido al mundo.",
                    action: "share" as const,
                    icon: ArrowUpRight,
                  },
                ].map((f) => (
                  <button
                    key={f.title}
                    className="profile-feature"
                    onClick={() => onAction(f.action)}
                  >
                    <f.icon size={22} strokeWidth={1.4} />
                    <div>
                      <h3>{f.title}</h3>
                      <p>{f.body}</p>
                    </div>
                    <ArrowUpRight size={18} />
                  </button>
                ))}
              </div>
              <div className="profile-utilities">
                <button onClick={() => onAction("preferences")}>
                  <Settings2 size={17} />
                  Preferencias
                  <ArrowUpRight size={15} />
                </button>
                <button onClick={() => onAction("messages")}>
                  <MessageCircle size={17} />
                  Mensajes
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </>
          )}
          <footer className="app-footer">
            <span>
              NODAL® <i /> THE PROFESSIONAL NETWORK FOR ELECTRONIC MUSIC
            </span>
            <button onClick={() => onAction("about")}>
              Made for connection <ArrowUpRight size={12} />
            </button>
          </footer>
        </main>
        <nav className="mobile-navigation" aria-label="Navegación móvil">
          {navigation.map((n) => (
            <button
              key={n.page}
              onClick={() => onNavigate(n.page)}
              className={page === n.page ? "active" : ""}
              aria-current={page === n.page ? "page" : undefined}
            >
              <n.icon size={21} strokeWidth={1.7} />
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
