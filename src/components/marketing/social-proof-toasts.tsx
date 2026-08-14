"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Bookmark,
  CalendarDays,
  FileCheck2,
  MapPinned,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ProofProject = {
  name: string;
  slug: string;
  location: string;
  coverImage?: string;
};

type ProofAction = {
  key: string;
  verb: string;
  detail: string;
  badge: string;
  Icon: typeof CalendarDays;
  accent: string;
};

const FIRST_NAMES = [
  "Aarav",
  "Aditi",
  "Ananya",
  "Atharva",
  "Isha",
  "Kabir",
  "Meera",
  "Nikhil",
  "Omkar",
  "Pooja",
  "Rohan",
  "Saanvi",
  "Siddharth",
  "Tanvi",
  "Vedant",
  "Yash",
  "Priya",
  "Harsh",
  "Neha",
  "Suresh",
];

const LAST_NAMES = [
  "Deshmukh",
  "Patil",
  "Joshi",
  "Kulkarni",
  "Shinde",
  "More",
  "Pawar",
  "Jadhav",
  "Gaikwad",
  "Bhosale",
  "Naik",
  "Sawant",
  "Chavan",
  "Kadam",
  "Lokhande",
  "Deshpande",
  "Inamdar",
];

const CITIES = [
  "Pune",
  "Mumbai",
  "Thane",
  "Nashik",
  "Nagpur",
  "Kolhapur",
  "Satara",
  "Chhatrapati Sambhajinagar",
  "Panvel",
  "Kalyan",
  "Solapur",
  "Ratnagiri",
  "Navi Mumbai",
  "Pimpri-Chinchwad",
];

const ACTIONS: ProofAction[] = [
  {
    key: "site-visit",
    verb: "booked a site visit",
    detail: "Visit confirmed for this weekend slot",
    badge: "Site visit",
    Icon: CalendarDays,
    accent: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  {
    key: "plot",
    verb: "reserved a plot",
    detail: "Token amount marked against inventory",
    badge: "Plot reserved",
    Icon: MapPinned,
    accent: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  },
  {
    key: "booking",
    verb: "completed a booking",
    detail: "Agreement packet shared with investor",
    badge: "Booking",
    Icon: FileCheck2,
    accent: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  },
  {
    key: "wishlist",
    verb: "saved this land",
    detail: "Added to investor shortlist",
    badge: "Wishlist",
    Icon: Bookmark,
    accent: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  },
  {
    key: "enquiry",
    verb: "requested project details",
    detail: "Sales desk notified for follow-up",
    badge: "Enquiry",
    Icon: MessageCircle,
    accent: "bg-teal-500/15 text-teal-800 dark:text-teal-300",
  },
];

const FALLBACK_PROJECTS: ProofProject[] = [
  {
    name: "Emerald Acres",
    slug: "emerald-acres-mulshi",
    location: "Tamhini, Pune",
  },
  {
    name: "Orlane Villas",
    slug: "orlane-villas-lonavala",
    location: "Lonavala, Pune",
  },
  {
    name: "Florave Estate",
    slug: "florave-estate",
    location: "Maharashtra",
  },
];

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)]!;
}

function maskName(first: string, last: string) {
  return `${first} ${last.charAt(0)}.`;
}

function minutesAgo() {
  const n = 1 + Math.floor(Math.random() * 48);
  if (n === 1) return "Just now";
  if (n < 60) return `${n} mins ago`;
  return "About an hour ago";
}

function initials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

function showProofToast(projects: ProofProject[]) {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  const city = pick(CITIES);
  const project = pick(projects.length ? projects : FALLBACK_PROJECTS);
  const action = pick(ACTIONS);
  const when = minutesAgo();
  const Icon = action.Icon;
  const name = maskName(first, last);

  toast.custom(
    (id) => (
      <div
        className="w-[min(88vw,20rem)] overflow-hidden rounded-xl border border-border/80 bg-card p-3 shadow-lg ring-1 ring-black/5 dark:ring-white/10 sm:w-[21rem] sm:p-3.5"
        onClick={() => toast.dismiss(id)}
        role="status"
      >
        <div className="flex gap-2.5 sm:gap-3">
          <div className="relative shrink-0">
            {project.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.coverImage}
                alt=""
                className="size-10 rounded-lg object-cover ring-1 ring-border sm:size-11"
              />
            ) : (
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-[11px] font-semibold text-primary ring-1 ring-border sm:size-11">
                {project.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full border border-border bg-card text-[8px] font-bold text-foreground shadow-sm">
              {initials(first, last)}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="min-w-0 text-[12px] leading-snug text-foreground sm:text-[13px]">
                <span className="font-semibold">{name}</span>
                <span className="text-muted-foreground"> · {city}</span>
              </p>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.06em] uppercase",
                  action.accent
                )}
              >
                <Icon className="size-2.5" />
                {action.badge}
              </span>
            </div>

            <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground sm:text-[13px]">
              {action.verb}
            </p>
            <p className="mt-1 truncate text-[13px] font-semibold text-primary sm:text-sm">
              {project.name}
            </p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <p className="truncate text-[10px] text-muted-foreground sm:text-[11px]">
                {project.location}
              </p>
              <p className="shrink-0 text-[10px] font-medium text-muted-foreground sm:text-[11px]">
                {when}
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      id: `social-proof-${Date.now()}`,
      duration: 5500,
      position: "bottom-left",
    }
  );
}

/** FOMO / engagement toasts for marketing pages — uses live project names. */
export function SocialProofToasts({
  projects = [],
}: {
  projects?: ProofProject[];
}) {
  const shown = useRef(0);
  const listRef = useRef(projects);

  useEffect(() => {
    listRef.current = projects;
  }, [projects]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let cancelled = false;
    let timer: number | undefined;

    const schedule = (delay: number) => {
      timer = window.setTimeout(() => {
        if (cancelled) return;
        if (document.visibilityState === "hidden") {
          schedule(10000);
          return;
        }
        if (shown.current >= 24) return;
        showProofToast(listRef.current);
        shown.current += 1;
        schedule(10000);
      }, delay);
    };

    schedule(10000);

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return null;
}
