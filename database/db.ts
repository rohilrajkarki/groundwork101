import * as SQLite from "expo-sqlite";

export type Shift = {
  id: number;
  name: string;
  location: string;
  rate: number;
  start: string;
  end: string;
  shiftDate: string;
  notes: string;
  shiftType: string;
  // createdAt?: string;
};

const db = SQLite.openDatabaseSync("schedule.db");

// Initialize DB + table
export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS shifts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        rate REAL NOT NULL,
        start TEXT NOT NULL,
        end TEXT NOT NULL,
        shiftDate TEXT NOT NULL,
        shiftType TEXT NOT NULL
        );
        `);

    // add new columns safely for migration( Alter Table)
    await db
      .execAsync(
        `
      ALTER TABLE shifts
      ADD COLUMN shiftDate TEXT;
    `,
      )
      .catch(() => {});

    await db
      .execAsync(
        `
      ALTER TABLE shifts
      ADD COLUMN notes TEXT;
    `,
      )
      .catch(() => {});

    await db
      .execAsync(
        `
      ALTER TABLE shifts
      ADD COLUMN shiftType TEXT;
    `,
      )
      .catch(() => {});

    // await db
    //   .execAsync(
    //     `
    //   ALTER TABLE shifts
    //   ADD COLUMN createdAt TEXT
    //   DEFAULT CURRENT_TIMESTAMP;
    // `,
    //   )
    //   .catch(() => {});

    console.log("Database initialized");
  } catch (error) {
    console.log("DB init error:", error);
  }
};

// CREATE
export const insertShift = async (shift: Shift) => {
  try {
    const result = await db.runAsync(
      `
      INSERT INTO shifts
      (name, location, rate, start, end, shiftDate, notes,shiftType)
      VALUES (?, ?, ?, ?, ?, ?, ?,?)
      `,
      [
        shift.name,
        shift.location,
        shift.rate,
        shift.start,
        shift.end,
        shift.shiftDate ?? null,
        shift.notes ?? null,
        shift.shiftType,
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

// READ BY DATE
export const getTodaysShifts = async (): Promise<Shift[]> => {
  try {
    // today's local date (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    const result = await db.getAllAsync<Shift>(
      `
      SELECT * FROM shifts
      WHERE date(shiftDate) = ?
      ORDER BY start ASC
      `,
      [today],
    );

    return result;
  } catch (error) {
    console.log("Get today's shifts error:", error);
    return [];
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
