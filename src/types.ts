export type Page = "home" | "bookings" | "discover" | "services" | "profile";
export type City = "worldwide" | "ibiza" | "riviera" | "tulum" | "cdmx";
export type Genre = "all" | "Afro house" | "Melodic house" | "Organic house";
export interface Opportunity {
  id: string;
  number: string;
  title: string;
  venue: string;
  city: Exclude<City, "worldwide">;
  location: string;
  date: string;
  time: string;
  genre: Exclude<Genre, "all">;
  kind: string;
  fee: string;
  color: "blue" | "sage" | "aqua";
  description: string;
  requirements: string[];
  setRole: string;
}
export interface Artist {
  id: string;
  name: string;
  city: string;
  genre: string;
  initials: string;
  color: string;
  statement: string;
}
export interface ExperienceProps {
  profile?: { name: string; statement: string; home: string };
  availability?: boolean;
  page: Page;
  city: City;
  genre: Genre;
  search: string;
  saved: string[];
  opportunities: Opportunity[];
  artists: Artist[];
  onNavigate: (page: Page) => void;
  onCityChange: (city: City) => void;
  onGenreChange: (genre: Genre) => void;
  onSearchChange: (search: string) => void;
  onSave: (id: string) => void;
  onOpenOpportunity: (id: string) => void;
  onOpenArtist: (id: string) => void;
  onAction: (
    action:
      | "notifications"
      | "messages"
      | "preferences"
      | "profile"
      | "availability"
      | "tour"
      | "share"
      | "about"
      | "create-opportunity",
  ) => void;
}
