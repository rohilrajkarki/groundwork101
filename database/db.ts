import * as SQLite from "expo-sqlite";

export type Shift = {
  name: string;
  location: string;
  rate: number;
  start: string;
  end: string;
  shiftDate: string;
  notes: string;
  createdAt?: string;
};

const db = SQLite.openDatabaseSync("schedule.db");

// Initialize DB + table
export const initDatabase = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS shifts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      rate REAL NOT NULL,
      start TEXT NOT NULL,
      end TEXT NOT NULL,
      shiftDate TEXT,
      notes TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

// CREATE
export const insertShift = async (shift: Shift) => {
  try {
    const result = await db.runAsync(
      `
      INSERT INTO shifts
      (name, location, rate, start, end, shiftDate, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        shift.name,
        shift.location,
        shift.rate,
        shift.start,
        shift.end,
        shift.shiftDate ?? null,
        shift.notes ?? null,
      ],
    );

    return result;
  } catch (error) {
    console.log("Create shift error:", error);
    throw error;
  }
};

// READ ALL
export const getAllShifts = async (): Promise<Shift[]> => {
  try {
    const result = await db.getAllAsync<Shift>(
      `SELECT * FROM shifts ORDER BY id DESC`,
    );

    return result;
  } catch (error) {
    console.log("Get shifts error:", error);
    return [];
  }
};

// READ ONE
export const getShiftById = async (id: number): Promise<Shift | null> => {
  try {
    const result = await db.getFirstAsync<Shift>(
      `SELECT * FROM shifts WHERE id = ?`,
      [id],
    );

    return result ?? null;
  } catch (error) {
    console.log("Get shift error:", error);
    return null;
  }
};

// UPDATE
export const updateShift = async (id: number, updatedData: Shift) => {
  try {
    await db.runAsync(
      `
      UPDATE shifts SET
        name = ?,
        location = ?,
        rate = ?,
        start = ?,
        end = ?,
        shiftDate = ?,
        notes = ?
      WHERE id = ?
      `,
      [
        updatedData.name,
        updatedData.location,
        updatedData.rate,
        updatedData.start,
        updatedData.end,
        updatedData.shiftDate,
        updatedData.notes,
        id,
      ],
    );
  } catch (error) {
    console.log("Update shift error:", error);
  }
};

// DELETE
export const deleteShift = async (id: number) => {
  try {
    await db.runAsync(`DELETE FROM shifts WHERE id = ?`, [id]);
  } catch (error) {
    console.log("Delete shift error:", error);
  }
};
