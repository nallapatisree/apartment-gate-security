import { Flat, Resident } from "./types";

export function flatLabel(flats: Flat[], flatId: string): string {
  const f = flats.find((x) => x.id === flatId);
  return f ? f.number : "Unknown flat";
}

export function residentsForFlat(residents: Resident[], flatId: string): Resident[] {
  return residents.filter((r) => r.flatId === flatId);
}

export function isSameDay(iso: string | undefined, ref = new Date()): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
}
