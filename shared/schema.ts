import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
