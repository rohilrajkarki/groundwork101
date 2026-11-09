import { Shift } from "@/database/db";

// format time
export function formattedStartEnd(time: string) {
  return new Date(time).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}
export function totalHoursCount(workData: Shift) {
  const durationMs =
    new Date(workData.end).getTime() - new Date(workData.start).getTime();
  return (durationMs / (1000 * 60 * 60)).toFixed(2);
}
