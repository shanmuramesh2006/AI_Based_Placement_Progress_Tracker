import fs from 'node:fs/promises';
import path from 'node:path';
import { DailyProgress, GeneratedTest, TestAttempt, Category } from '../types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

interface Schema {
  dailyProgress: DailyProgress[];
  generatedTests: GeneratedTest[];
  testAttempts: TestAttempt[];
}

// Generate some rich, beautiful mock data for the past 15 days to show in the tracker on first load
function generateMockDailyProgress(): DailyProgress[] {
  const data: DailyProgress[] = [];
  const categories: Category[] = ['APTITUDE', 'SQL', 'CODING'];
  
  // Set up mock progress starting from 15 days ago up to yesterday
  const now = new Date();
  
  for (let i = 15; i >= 1; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    categories.forEach((category) => {
      // Create a nice upward trend with some realistic fluctuation
      let baseScore = 60;
      if (category === 'SQL') baseScore = 65;
      if (category === 'CODING') baseScore = 55;
      
      const dayFactor = (15 - i) * 1.8; // gradual increase
      const randomness = Math.sin(i) * 8; // realistic sine fluctuation
      const score = Math.min(100, Math.max(0, Math.round(baseScore + dayFactor + randomness)));
      
      data.push({
        id: `mock-${category}-${dateStr}`,
        studentId: 1,
        category,
        score,
        logDate: dateStr,
      });
    });
  }
  
  return data;
}

const DEFAULT_DB: Schema = {
  dailyProgress: generateMockDailyProgress(),
  generatedTests: [],
  testAttempts: [],
};

async function ensureDbExists() {
  try {
    const dir = path.dirname(DB_PATH);
    await fs.mkdir(dir, { recursive: true });
    
    try {
      await fs.access(DB_PATH);
    } catch {
      // File does not exist, write the default database
      await fs.writeFile(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Error ensuring database exists:', error);
  }
}

export class Database {
  private static async read(): Promise<Schema> {
    await ensureDbExists();
    try {
      const content = await fs.readFile(DB_PATH, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to read database, returning default:', error);
      return DEFAULT_DB;
    }
  }

  private static async write(data: Schema): Promise<void> {
    await ensureDbExists();
    try {
      // Atomic write: write to temp file first then rename, to avoid partial corruption
      const tempPath = `${DB_PATH}.tmp`;
      await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      await fs.rename(tempPath, DB_PATH);
    } catch (error) {
      console.error('Failed to write to database:', error);
    }
  }

  // --- DailyProgress Repository ---
  public static async getAllProgress(): Promise<DailyProgress[]> {
    const db = await this.read();
    return db.dailyProgress;
  }

  public static async saveProgress(progress: Omit<DailyProgress, 'id'>): Promise<DailyProgress> {
    const db = await this.read();
    
    // Check if progress already exists for this student, category and date
    // If so, update it. Otherwise, create a new one.
    const existingIndex = db.dailyProgress.findIndex(
      (p) => 
        p.studentId === progress.studentId && 
        p.category === progress.category && 
        p.logDate === progress.logDate
    );

    const newProgress: DailyProgress = {
      ...progress,
      id: existingIndex >= 0 ? db.dailyProgress[existingIndex].id : `dp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };

    if (existingIndex >= 0) {
      db.dailyProgress[existingIndex] = newProgress;
    } else {
      db.dailyProgress.push(newProgress);
    }

    await this.write(db);
    return newProgress;
  }

  public static async deleteProgress(id: string): Promise<boolean> {
    const db = await this.read();
    const initialLength = db.dailyProgress.length;
    db.dailyProgress = db.dailyProgress.filter((p) => p.id !== id);
    
    if (db.dailyProgress.length !== initialLength) {
      await this.write(db);
      return true;
    }
    return false;
  }

  // --- GeneratedTest Repository ---
  public static async getTestById(id: string): Promise<GeneratedTest | null> {
    const db = await this.read();
    const test = db.generatedTests.find((t) => t.id === id);
    return test || null;
  }

  public static async saveTest(test: Omit<GeneratedTest, 'id' | 'createdAt'>): Promise<GeneratedTest> {
    const db = await this.read();
    const newTest: GeneratedTest = {
      ...test,
      id: `test-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    db.generatedTests.push(newTest);
    await this.write(db);
    return newTest;
  }

  // --- TestAttempt Repository ---
  public static async getAttemptsByStudent(studentId: number): Promise<TestAttempt[]> {
    const db = await this.read();
    return db.testAttempts.filter((a) => a.studentId === studentId);
  }

  public static async saveAttempt(attempt: Omit<TestAttempt, 'id' | 'attemptedAt'>): Promise<TestAttempt> {
    const db = await this.read();
    const newAttempt: TestAttempt = {
      ...attempt,
      id: `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      attemptedAt: new Date().toISOString(),
    };
    db.testAttempts.push(newAttempt);
    await this.write(db);
    return newAttempt;
  }
}
