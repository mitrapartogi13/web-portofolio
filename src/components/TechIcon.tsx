import {
  AppWindow,
  ArrowLeftRight,
  Boxes,
  FolderTree,
  Layers,
  PencilRuler,
  Trophy,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import { siC, siCplusplus, siNextdotjs, siPython, siReact, siTypescript, siUbuntu, type SimpleIcon } from "simple-icons";

/** Brand logos (simple-icons, CC0) and concept icons (lucide). */
const ICONS: Record<string, SimpleIcon | LucideIcon> = {
  nextjs: siNextdotjs,
  typescript: siTypescript,
  react: siReact,
  c: siC,
  cpp: siCplusplus,
  python: siPython,
  ubuntu: siUbuntu,
  web: AppWindow,
  ds: Boxes,
  graph: Waypoints,
  problem: PencilRuler,
  cp: Trophy,
  process: Layers,
  ipc: ArrowLeftRight,
  fs: FolderTree,
};

/** One-colour icon in `currentColor`, so it follows the card's hover colour. */
export default function TechIcon({ name, className }: { name: string; className?: string }) {
  const icon = ICONS[name];
  if (!icon) return null;
  if ("path" in icon) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
        <path d={icon.path} />
      </svg>
    );
  }
  const Lucide = icon;
  return <Lucide aria-hidden strokeWidth={1.75} className={className} />;
}
