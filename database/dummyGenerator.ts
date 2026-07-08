import { Shift } from "@/database/db";

const getRandomItem = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

const getRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomDateInNext7Days = () => {
  const today = new Date();
  const future = new Date();
  future.setDate(today.getDate() + 7);

  const randomTime =
    today.getTime() + Math.random() * (future.getTime() - today.getTime());

  return new Date(randomTime);
};

// ✅ now returns ONE shift
export const generateDummyShift = (): Shift => {
  const names = [
    "Morning Shift",
    "Afternoon Shift",
    "Night Shift",
    "Weekend Shift",
    "Overtime Shift",
  ];

  const locations = ["Office", "Warehouse", "Factory", "Store", "Remote"];
  const types = ["Work", "Overtime", "Casual"];

  const startHour = getRandomNumber(6, 22);
  const endHour = startHour + getRandomNumber(3, 8);

  const shiftDate = getRandomDateInNext7Days();

  return {
    id: Date.now(),
    name: getRandomItem(names),
    location: getRandomItem(locations),
    rate: getRandomNumber(20, 45),
    start: `${startHour}:00`,
    end: `${endHour}:00`,
    shiftDate: shiftDate.toISOString(),
    notes: "Auto generated shift",
    shiftType: getRandomItem(types),
  };
};
