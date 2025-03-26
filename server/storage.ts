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
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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
  
  // Session storage
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private companyData: Map<number, CompanyInfo>;
  private staffMembers: Map<number, CybersecurityStaff[]>;
  private policyDocuments: Map<number, Policy>;
  currentId: {
    users: number;
    company: number;
    staff: number;
    policy: number;
  };
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.companyData = new Map();
    this.staffMembers = new Map();
    this.policyDocuments = new Map();
    this.currentId = {
      users: 1,
      company: 1,
      staff: 1,
      policy: 1
    };
    
    // Initialize session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Create a default admin user
    this.createUser({
      username: "admin",
      password: "password123", // Would be hashed in production
      role: "admin",
      accessLevel: "premium",
      isActive: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: Partial<User>): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { 
      id, 
      username: insertUser.username || `user${id}`, 
      password: insertUser.password || "password",
      role: insertUser.role || "user",
      accessLevel: insertUser.accessLevel || "trial",
      isActive: insertUser.isActive !== undefined ? insertUser.isActive : true
    };
    this.users.set(id, user);
    return user;
  }
  
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Company info methods
  async saveCompanyInfo(info: Partial<CompanyInfo>): Promise<CompanyInfo> {
    // In this simple implementation, we only store one company record
    const id = 1; // Always use ID 1 for the company
    const existingInfo = this.companyData.get(id);
    
    const companyInfo: CompanyInfo = {
      id,
      companyName: info.companyName || (existingInfo?.companyName || ""),
      ceoName: info.ceoName || (existingInfo?.ceoName || ""),
      cioName: info.cioName || (existingInfo?.cioName || ""),
      ctoName: info.ctoName || (existingInfo?.ctoName || ""),
      cisoName: info.cisoName || (existingInfo?.cisoName || "")
    };
    
    this.companyData.set(id, companyInfo);
    return companyInfo;
  }
  
  async getCompanyInfo(): Promise<CompanyInfo | undefined> {
    return this.companyData.get(1); // Always use ID 1 for the company
  }
  
  // Staff methods
  async saveCybersecurityStaff(companyId: number, staffNames: string[]): Promise<CybersecurityStaff[]> {
    const staffMembers: CybersecurityStaff[] = staffNames.map(name => ({
      id: this.currentId.staff++,
      companyId,
      staffName: name
    }));
    
    this.staffMembers.set(companyId, staffMembers);
    return staffMembers;
  }
  
  async getCybersecurityStaff(companyId: number): Promise<CybersecurityStaff[]> {
    return this.staffMembers.get(companyId) || [];
  }
  
  // Policy methods
  async savePolicy(policy: Partial<Policy>): Promise<Policy> {
    const id = this.currentId.policy++;
    const now = new Date().toISOString();
    
    const policyDoc: Policy = {
      id,
      title: policy.title || "Untitled Policy",
      type: policy.type || "general",
      content: policy.content || "",
      createdAt: policy.createdAt || now,
      updatedAt: policy.updatedAt || now
    };
    
    this.policyDocuments.set(id, policyDoc);
    return policyDoc;
  }
  
  async getPolicies(): Promise<Policy[]> {
    return Array.from(this.policyDocuments.values());
  }
}

export const storage = new MemStorage();
