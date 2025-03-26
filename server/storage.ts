import {
  users,
  companyInfo,
  cybersecurityStaff,
  policies,
  type User,
  type InsertUser,
  type CompanyInfo,
  type CybersecurityStaff,
  type Policy
} from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

const PostgresSessionStore = connectPg(session);

// Interface for storage operations
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: Partial<User>): Promise<User>;
  getUsers(): Promise<User[]>;
  
  // Company info management
  saveCompanyInfo(info: Partial<CompanyInfo>): Promise<CompanyInfo>;
  getCompanyInfo(): Promise<CompanyInfo | undefined>;
  
  // Staff management
  saveCybersecurityStaff(companyId: number, staffNames: string[]): Promise<CybersecurityStaff[]>;
  getCybersecurityStaff(companyId: number): Promise<CybersecurityStaff[]>;
  
  // Policy management
  savePolicy(policy: Partial<Policy>): Promise<Policy>;
  getPolicies(): Promise<Policy[]>;
  getPolicyById(id: number): Promise<Policy | undefined>;
  
  // Session storage
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Create a session store with PostgreSQL
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: Partial<User>): Promise<User> {
    const [user] = await db.insert(users).values({
      username: insertUser.username || '',
      password: insertUser.password || '',
      role: insertUser.role || 'user',
      accessLevel: insertUser.accessLevel || 'trial',
      isActive: insertUser.isActive !== undefined ? insertUser.isActive : true
    }).returning();
    return user;
  }
  
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }
  
  // Company info methods
  async saveCompanyInfo(info: Partial<CompanyInfo>): Promise<CompanyInfo> {
    // First check if there's an existing company record
    const existingCompany = await this.getCompanyInfo();
    
    if (existingCompany) {
      // Update existing company
      const [updated] = await db.update(companyInfo)
        .set({
          companyName: info.companyName || existingCompany.companyName,
          ceoName: info.ceoName !== undefined ? info.ceoName : existingCompany.ceoName,
          cioName: info.cioName !== undefined ? info.cioName : existingCompany.cioName,
          ctoName: info.ctoName !== undefined ? info.ctoName : existingCompany.ctoName,
          cisoName: info.cisoName !== undefined ? info.cisoName : existingCompany.cisoName,
          logoId: info.logoId !== undefined ? info.logoId : existingCompany.logoId
        })
        .where(eq(companyInfo.id, existingCompany.id))
        .returning();
      return updated;
    } else {
      // Create new company
      const [company] = await db.insert(companyInfo).values({
        companyName: info.companyName || '',
        ceoName: info.ceoName,
        cioName: info.cioName,
        ctoName: info.ctoName,
        cisoName: info.cisoName,
        logoId: info.logoId
      }).returning();
      return company;
    }
  }
  
  async getCompanyInfo(): Promise<CompanyInfo | undefined> {
    const [company] = await db.select().from(companyInfo).limit(1);
    return company;
  }
  
  // Staff methods
  async saveCybersecurityStaff(companyId: number, staffNames: string[]): Promise<CybersecurityStaff[]> {
    // First delete existing staff for this company
    await db.delete(cybersecurityStaff).where(eq(cybersecurityStaff.companyId, companyId));
    
    // Then insert new staff
    if (staffNames.length === 0) {
      return [];
    }
    
    const staffValues = staffNames.map(name => ({
      companyId,
      staffName: name
    }));
    
    return await db.insert(cybersecurityStaff).values(staffValues).returning();
  }
  
  async getCybersecurityStaff(companyId: number): Promise<CybersecurityStaff[]> {
    return await db.select().from(cybersecurityStaff).where(eq(cybersecurityStaff.companyId, companyId));
  }
  
  // Policy methods
  async savePolicy(policy: Partial<Policy>): Promise<Policy> {
    const now = new Date().toISOString();
    
    if (policy.id) {
      // Update existing policy
      const [existingPolicy] = await db.select().from(policies).where(eq(policies.id, policy.id));
      
      if (existingPolicy) {
        const [updated] = await db.update(policies)
          .set({
            title: policy.title || existingPolicy.title,
            type: policy.type || existingPolicy.type,
            content: policy.content !== undefined ? policy.content : existingPolicy.content,
            fileId: policy.fileId !== undefined ? policy.fileId : existingPolicy.fileId,
            updatedAt: now
          })
          .where(eq(policies.id, policy.id))
          .returning();
        return updated;
      }
    }
    
    // Create new policy
    const [newPolicy] = await db.insert(policies).values({
      title: policy.title || 'Untitled Policy',
      type: policy.type || 'general',
      content: policy.content,
      fileId: policy.fileId,
      createdAt: policy.createdAt || now,
      updatedAt: now
    }).returning();
    return newPolicy;
  }
  
  async getPolicies(): Promise<Policy[]> {
    return await db.select().from(policies);
  }
  
  async getPolicyById(id: number): Promise<Policy | undefined> {
    const [policy] = await db.select().from(policies).where(eq(policies.id, id));
    return policy;
  }
}

export const storage = new DatabaseStorage();
