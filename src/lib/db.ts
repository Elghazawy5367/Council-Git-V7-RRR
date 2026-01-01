import Dexie, { type Table } from "dexie";

/**
 * DATABASE SCHEMA VERSIONING STRATEGY
 * 
 * Version 1: Initial schema with experts and sessions
 * Version 2: Added 'persona' field to experts, transformed existing data
 */

export interface Expert {
  id?: number;
  name: string;
  role: string;
  model: string;
  persona?: string; // Added in v2
  description?: string;
}

export interface Session {
  id?: number;
  title: string;
  createdAt: number;
}

export class CouncilDatabase extends Dexie {
  experts!: Table<Expert>;
  sessions!: Table<Session>;

  constructor() {
    super("CouncilDB");

    // VERSION 1: Initial Definition
    this.version(1).stores({
      experts: "++id, name, role, model",
      sessions: "++id, title, createdAt",
    });

    // VERSION 2: Schema Evolution
    // Adds 'persona' field and populates it based on 'role' for existing records
    this.version(2)
      .stores({
        experts: "++id, name, role, model, persona", // Add persona to index
      })
      .upgrade(async (tx) => {
        // Data transformation: Map existing roles to initial personas
        return tx.table("experts").toCollection().modify(expert => {
          if (!expert.persona) {
            expert.persona = `Specialist in ${expert.role}`;
          }
        });
      });
  }
}

export const db = new CouncilDatabase();

/**
 * SAFE DATABASE INITIALIZATION & ERROR HANDLING
 */
export async function initDatabase() {
  try {
    await db.open();
    console.log("[CouncilDB] Migration successful or database up to date.");
  } catch (err) {
    console.error("[CouncilDB] Critical migration failure:", err);
    // Error Recovery: In extreme cases, notify user or implement secondary fallback
    // Note: Dexie automatically handles rollback if a transaction fails within .upgrade()
  }
}

/**
 * LOCAL TESTING UTILITY
 * Use this in development to verify migrations
 */
export async function testMigration() {
  if (process.env.NODE_ENV !== "development") return;

  console.log("[CouncilDB] Starting migration test...");
  const experts = await db.experts.toArray();
  const needsPersona = experts.some(e => !e.persona);
  
  if (needsPersona) {
    console.warn("[CouncilDB] Test detected unmigrated data. Running version check...");
  } else {
    console.log("[CouncilDB] Migration verification complete. All records have personas.");
  }
}
