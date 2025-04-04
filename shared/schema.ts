import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real, date, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { randomUUID } from "crypto";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user").notNull(),
  accessLevel: text("access_level").default("trial").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const companyInfo = pgTable("company_info", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  ceoName: text("ceo_name"),
  cioName: text("cio_name"),
  ctoName: text("cto_name"),
  cisoName: text("ciso_name"),
  logoId: integer("logo_id"),
});

export const cybersecurityStaff = pgTable("cybersecurity_staff", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull(),
  staffName: text("staff_name").notNull(),
});

export const policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  content: text("content"),
  fileId: integer("file_id"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// File storage tables
export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  path: text("path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  uploadedBy: integer("uploaded_by"),
  fileType: text("file_type").notNull(), // 'logo', 'policy', etc.
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCompanyInfoSchema = createInsertSchema(companyInfo);
export const insertCybersecurityStaffSchema = createInsertSchema(cybersecurityStaff);
export const insertPolicySchema = createInsertSchema(policies);
export const insertFileSchema = createInsertSchema(files).omit({ id: true });

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type CompanyInfo = typeof companyInfo.$inferSelect;
export type CybersecurityStaff = typeof cybersecurityStaff.$inferSelect;
export type Policy = typeof policies.$inferSelect;
export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;

// Framework assessment tables
export const frameworks = pgTable("frameworks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  displayName: text("display_name").notNull(),
  description: text("description").notNull(),
  version: text("version").notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const domains = pgTable("domains", {
  id: serial("id").primaryKey(),
  frameworkId: integer("framework_id").notNull(),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
});

export const controls = pgTable("controls", {
  id: serial("id").primaryKey(),
  domainId: integer("domain_id").notNull(),
  controlId: text("control_id").notNull(), // e.g., "ECC-1.2.3" or "SAMA-2.4"
  name: text("name").notNull(),
  description: text("description").notNull(),
  guidance: text("guidance"),
  maturityLevel: integer("maturity_level").default(1),
  referenceLinks: text("reference_links"),
  implementationGuide: text("implementation_guide"),
  frameworkSpecific: jsonb("framework_specific"), // Stores framework-specific properties
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull(),
  frameworkId: integer("framework_id").notNull(),
  name: text("name").notNull(),
  status: text("status").default("in_progress").notNull(), // in_progress, completed
  score: real("score"),
  startDate: date("start_date", { mode: 'string' }).defaultNow().notNull(),
  completionDate: date("completion_date", { mode: 'string' }),
  createdBy: integer("created_by").notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
  findings: jsonb("findings"),
  recommendations: jsonb("recommendations"),
});

export const assessmentResults = pgTable("assessment_results", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull(),
  controlId: integer("control_id").notNull(),
  status: text("status").notNull(), // implemented, partially_implemented, not_implemented, not_applicable
  evidence: text("evidence"),
  comments: text("comments"),
  attachments: jsonb("attachments"),
  maturityLevel: text("maturity_level"), // SAMA: baseline, evolving, established, predictable, leading
  maturityScore: integer("maturity_score"), // Numeric representation of maturity (1-5)
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
  updatedBy: integer("updated_by").notNull(),
  frameworkSpecificData: jsonb("framework_specific_data"), // Stores framework-specific assessment data
});

export const remediationTasks = pgTable("remediation_tasks", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull(),
  controlId: integer("control_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").default("open").notNull(), // open, in_progress, completed
  priority: text("priority").default("medium").notNull(), // low, medium, high, critical
  assignedTo: integer("assigned_to"),
  dueDate: date("due_date", { mode: 'string' }),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
  externalId: text("external_id"), // For integration with external systems like ClickUp
});

// Create insert schemas for assessment tables
export const insertFrameworkSchema = createInsertSchema(frameworks).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDomainSchema = createInsertSchema(domains).omit({ id: true });
export const insertControlSchema = createInsertSchema(controls).omit({ id: true });
export const insertAssessmentSchema = createInsertSchema(assessments).omit({ id: true, updatedAt: true });
export const insertAssessmentResultSchema = createInsertSchema(assessmentResults).omit({ id: true, updatedAt: true });
export const insertRemediationTaskSchema = createInsertSchema(remediationTasks).omit({ id: true, createdAt: true, updatedAt: true });

// Define assessment-related types
export type Framework = typeof frameworks.$inferSelect;
export type Domain = typeof domains.$inferSelect;
export type Control = typeof controls.$inferSelect;
export type Assessment = typeof assessments.$inferSelect;
export type AssessmentResult = typeof assessmentResults.$inferSelect;
export type RemediationTask = typeof remediationTasks.$inferSelect;

export type InsertFramework = z.infer<typeof insertFrameworkSchema>;
export type InsertDomain = z.infer<typeof insertDomainSchema>;
export type InsertControl = z.infer<typeof insertControlSchema>;
// Compliance reports and shareable links
export const complianceReports = pgTable("compliance_reports", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull(),
  companyId: integer("company_id").notNull(),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  title: text("title").notNull(),
  summary: text("summary"),
  reportData: jsonb("report_data").notNull(),
  format: text("format").default("pdf").notNull(), // pdf, html, json, etc.
  status: text("status").default("generated").notNull(), // generating, generated, error
  isPublic: boolean("is_public").default(false).notNull(),
});

export const reportShareLinks = pgTable("report_share_links", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id").notNull(),
  shareToken: uuid("share_token").defaultRandom().notNull().unique(),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { mode: 'string' }),
  password: text("password"),
  viewCount: integer("view_count").default(0).notNull(),
  maxViews: integer("max_views"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertComplianceReportSchema = createInsertSchema(complianceReports).omit({ 
  id: true, 
  createdAt: true 
});

export const insertReportShareLinkSchema = createInsertSchema(reportShareLinks).omit({ 
  id: true, 
  createdAt: true, 
  shareToken: true,
  viewCount: true
});

export type ComplianceReport = typeof complianceReports.$inferSelect;
export type ReportShareLink = typeof reportShareLinks.$inferSelect;
export type InsertComplianceReport = z.infer<typeof insertComplianceReportSchema>;
export type InsertReportShareLink = z.infer<typeof insertReportShareLinkSchema>;

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type InsertAssessmentResult = z.infer<typeof insertAssessmentResultSchema>;
export type InsertRemediationTask = z.infer<typeof insertRemediationTaskSchema>;

// Policy Management System
export const policyCategories = pgTable("policy_categories", {
  id: serial("id").primaryKey(),
  categoryName: text("category_name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const policyTemplates = pgTable("policy_templates", {
  id: serial("id").primaryKey(),
  templateName: text("template_name").notNull(),
  templateType: text("template_type").notNull(), // Word/PDF
  fileId: integer("file_id").notNull(),
  categoryId: integer("category_id").notNull(),
  dateUploaded: timestamp("date_uploaded", { mode: 'string' }).defaultNow().notNull(),
  uploadedBy: integer("uploaded_by").notNull(),
  version: text("version").default("1.0").notNull(),
  placeholders: jsonb("placeholders"), // Extracted placeholders
  isActive: boolean("is_active").default(true).notNull(),
});

export const generatedPolicies = pgTable("generated_policies", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull(),
  companyId: integer("company_id").notNull(),
  generatedFileId: integer("generated_file_id").notNull(),
  version: text("version").default("1.0").notNull(),
  generationDate: timestamp("generation_date", { mode: 'string' }).defaultNow().notNull(),
  approvalStatus: text("approval_status").default("pending").notNull(), // pending, approved, rejected
  approvedBy: integer("approved_by"),
  approvedDate: timestamp("approved_date", { mode: 'string' }),
  replacementData: jsonb("replacement_data").notNull(), // Stored values used for placeholders
  notes: text("notes"),
});

// Create insert schemas for policy management
export const insertPolicyCategorySchema = createInsertSchema(policyCategories).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true
});

export const insertPolicyTemplateSchema = createInsertSchema(policyTemplates).omit({ 
  id: true, 
  dateUploaded: true
});

export const insertGeneratedPolicySchema = createInsertSchema(generatedPolicies).omit({ 
  id: true, 
  generationDate: true, 
  approvedBy: true,
  approvedDate: true
});

// Define policy management types
export type PolicyCategory = typeof policyCategories.$inferSelect;
export type PolicyTemplate = typeof policyTemplates.$inferSelect;
export type GeneratedPolicy = typeof generatedPolicies.$inferSelect;

export type InsertPolicyCategory = z.infer<typeof insertPolicyCategorySchema>;
export type InsertPolicyTemplate = z.infer<typeof insertPolicyTemplateSchema>;
export type InsertGeneratedPolicy = z.infer<typeof insertGeneratedPolicySchema>;
