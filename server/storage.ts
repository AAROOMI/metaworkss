import {
  users,
  companyInfo,
  cybersecurityStaff,
  policies,
  frameworks,
  domains,
  controls,
  assessments,
  assessmentResults,
  remediationTasks,
  files,
  type User,
  type InsertUser,
  type CompanyInfo,
  type CybersecurityStaff,
  type Policy,
  type Framework,
  type Domain,
  type Control,
  type Assessment,
  type AssessmentResult,
  type RemediationTask,
  type InsertFramework,
  type InsertDomain,
  type InsertControl,
  type InsertAssessment,
  type InsertAssessmentResult,
  type InsertRemediationTask,
  type File
} from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, and, desc, asc, sql, or, isNull } from "drizzle-orm";

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
  
  // Framework management
  saveFramework(framework: InsertFramework): Promise<Framework>;
  getFrameworks(): Promise<Framework[]>;
  getFrameworkByName(name: string): Promise<Framework | undefined>;
  getFrameworkById(id: number): Promise<Framework | undefined>;
  
  // Domain management
  saveDomain(domain: InsertDomain): Promise<Domain>;
  getDomainsByFrameworkId(frameworkId: number): Promise<Domain[]>;
  getDomainById(id: number): Promise<Domain | undefined>;
  
  // Control management
  saveControl(control: InsertControl): Promise<Control>;
  getControlsByDomainId(domainId: number): Promise<Control[]>;
  getControlById(id: number): Promise<Control | undefined>;
  
  // Assessment management
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessmentsByCompanyId(companyId: number): Promise<Assessment[]>;
  getAssessmentById(id: number): Promise<Assessment | undefined>;
  updateAssessmentStatus(id: number, status: string, score?: number): Promise<Assessment>;
  
  // Assessment Results management
  saveAssessmentResult(result: InsertAssessmentResult): Promise<AssessmentResult>;
  getAssessmentResultsByAssessmentId(assessmentId: number): Promise<AssessmentResult[]>;
  getAssessmentResultById(id: number): Promise<AssessmentResult | undefined>;
  
  // Remediation Tasks management
  saveRemediationTask(task: InsertRemediationTask): Promise<RemediationTask>;
  getRemediationTasksByAssessmentId(assessmentId: number): Promise<RemediationTask[]>;
  getRemediationTaskById(id: number): Promise<RemediationTask | undefined>;
  updateRemediationTaskStatus(id: number, status: string): Promise<RemediationTask>;
  
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

  // Framework methods
  async saveFramework(framework: InsertFramework): Promise<Framework> {
    // Check if the framework already exists by name
    const existingFramework = await this.getFrameworkByName(framework.name);
    
    if (existingFramework) {
      // Update existing framework
      const [updated] = await db.update(frameworks)
        .set({
          displayName: framework.displayName,
          description: framework.description,
          version: framework.version,
          updatedAt: new Date().toISOString()
        })
        .where(eq(frameworks.id, existingFramework.id))
        .returning();
      return updated;
    } else {
      // Create new framework
      const [newFramework] = await db.insert(frameworks).values({
        name: framework.name,
        displayName: framework.displayName,
        description: framework.description,
        version: framework.version
      }).returning();
      return newFramework;
    }
  }
  
  async getFrameworks(): Promise<Framework[]> {
    return await db.select().from(frameworks);
  }
  
  async getFrameworkByName(name: string): Promise<Framework | undefined> {
    const [framework] = await db.select().from(frameworks).where(eq(frameworks.name, name));
    return framework;
  }
  
  async getFrameworkById(id: number): Promise<Framework | undefined> {
    const [framework] = await db.select().from(frameworks).where(eq(frameworks.id, id));
    return framework;
  }
  
  // Domain methods
  async saveDomain(domain: InsertDomain): Promise<Domain> {
    // Check if domain exists
    const [existingDomain] = await db.select()
      .from(domains)
      .where(
        and(
          eq(domains.frameworkId, domain.frameworkId),
          eq(domains.name, domain.name)
        )
      );
    
    if (existingDomain) {
      // Update existing domain
      const [updated] = await db.update(domains)
        .set({
          displayName: domain.displayName,
          description: domain.description,
          order: domain.order
        })
        .where(eq(domains.id, existingDomain.id))
        .returning();
      return updated;
    } else {
      // Create new domain
      const [newDomain] = await db.insert(domains).values(domain).returning();
      return newDomain;
    }
  }
  
  async getDomainsByFrameworkId(frameworkId: number): Promise<Domain[]> {
    return await db.select()
      .from(domains)
      .where(eq(domains.frameworkId, frameworkId))
      .orderBy(asc(domains.order));
  }
  
  async getDomainById(id: number): Promise<Domain | undefined> {
    const [domain] = await db.select().from(domains).where(eq(domains.id, id));
    return domain;
  }
  
  // Control methods
  async saveControl(control: InsertControl): Promise<Control> {
    // Check if control exists
    const [existingControl] = await db.select()
      .from(controls)
      .where(
        and(
          eq(controls.domainId, control.domainId),
          eq(controls.controlId, control.controlId)
        )
      );
    
    if (existingControl) {
      // Update existing control
      const [updated] = await db.update(controls)
        .set({
          name: control.name,
          description: control.description,
          guidance: control.guidance,
          maturityLevel: control.maturityLevel,
          referenceLinks: control.referenceLinks,
          implementationGuide: control.implementationGuide
        })
        .where(eq(controls.id, existingControl.id))
        .returning();
      return updated;
    } else {
      // Create new control
      const [newControl] = await db.insert(controls).values(control).returning();
      return newControl;
    }
  }
  
  async getControlsByDomainId(domainId: number): Promise<Control[]> {
    return await db.select()
      .from(controls)
      .where(eq(controls.domainId, domainId))
      .orderBy(asc(controls.controlId));
  }
  
  async getControlById(id: number): Promise<Control | undefined> {
    const [control] = await db.select().from(controls).where(eq(controls.id, id));
    return control;
  }
  
  // Assessment methods
  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const [newAssessment] = await db.insert(assessments).values(assessment).returning();
    return newAssessment;
  }
  
  async getAssessmentsByCompanyId(companyId: number): Promise<Assessment[]> {
    return await db.select()
      .from(assessments)
      .where(eq(assessments.companyId, companyId))
      .orderBy(desc(assessments.startDate));
  }
  
  async getAssessmentById(id: number): Promise<Assessment | undefined> {
    const [assessment] = await db.select().from(assessments).where(eq(assessments.id, id));
    return assessment;
  }
  
  async updateAssessmentStatus(id: number, status: string, score?: number): Promise<Assessment> {
    const updateData: Partial<Assessment> = {
      status,
      updatedAt: new Date().toISOString()
    };
    
    if (status === 'completed') {
      updateData.completionDate = new Date().toISOString();
    }
    
    if (score !== undefined) {
      updateData.score = score;
    }
    
    const [updated] = await db.update(assessments)
      .set(updateData)
      .where(eq(assessments.id, id))
      .returning();
    
    return updated;
  }
  
  // Assessment Results methods
  async saveAssessmentResult(result: InsertAssessmentResult): Promise<AssessmentResult> {
    // Check if result exists
    const [existingResult] = await db.select()
      .from(assessmentResults)
      .where(
        and(
          eq(assessmentResults.assessmentId, result.assessmentId),
          eq(assessmentResults.controlId, result.controlId)
        )
      );
    
    if (existingResult) {
      // Update existing result
      const [updated] = await db.update(assessmentResults)
        .set({
          status: result.status,
          evidence: result.evidence,
          comments: result.comments,
          attachments: result.attachments,
          updatedAt: new Date().toISOString(),
          updatedBy: result.updatedBy
        })
        .where(eq(assessmentResults.id, existingResult.id))
        .returning();
      return updated;
    } else {
      // Create new result
      const [newResult] = await db.insert(assessmentResults).values({
        ...result,
        updatedAt: new Date().toISOString()
      }).returning();
      return newResult;
    }
  }
  
  async getAssessmentResultsByAssessmentId(assessmentId: number): Promise<AssessmentResult[]> {
    return await db.select()
      .from(assessmentResults)
      .where(eq(assessmentResults.assessmentId, assessmentId))
      .orderBy(asc(assessmentResults.id));
  }
  
  async getAssessmentResultById(id: number): Promise<AssessmentResult | undefined> {
    const [result] = await db.select().from(assessmentResults).where(eq(assessmentResults.id, id));
    return result;
  }
  
  // Remediation Tasks methods
  async saveRemediationTask(task: InsertRemediationTask): Promise<RemediationTask> {
    // Check if a task with the same assessmentId and controlId exists
    const [existingTask] = await db.select()
      .from(remediationTasks)
      .where(
        and(
          eq(remediationTasks.assessmentId, task.assessmentId),
          eq(remediationTasks.controlId, task.controlId),
          eq(remediationTasks.title, task.title)
        )
      );
    
    if (existingTask) {
      // Update existing task
      const [updated] = await db.update(remediationTasks)
        .set({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assignedTo: task.assignedTo,
          dueDate: task.dueDate,
          updatedAt: new Date().toISOString(),
          externalId: task.externalId
        })
        .where(eq(remediationTasks.id, existingTask.id))
        .returning();
      return updated;
    } else {
      // Create new task
      const [newTask] = await db.insert(remediationTasks).values({
        ...task,
        updatedAt: new Date().toISOString()
      }).returning();
      return newTask;
    }
  }
  
  async getRemediationTasksByAssessmentId(assessmentId: number): Promise<RemediationTask[]> {
    return await db.select()
      .from(remediationTasks)
      .where(eq(remediationTasks.assessmentId, assessmentId))
      .orderBy(asc(remediationTasks.createdAt));
  }
  
  async getRemediationTaskById(id: number): Promise<RemediationTask | undefined> {
    const [task] = await db.select().from(remediationTasks).where(eq(remediationTasks.id, id));
    return task;
  }
  
  async updateRemediationTaskStatus(id: number, status: string): Promise<RemediationTask> {
    const [updated] = await db.update(remediationTasks)
      .set({
        status,
        updatedAt: new Date().toISOString()
      })
      .where(eq(remediationTasks.id, id))
      .returning();
    
    return updated;
  }
}

export const storage = new DatabaseStorage();
