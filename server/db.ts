// server/db.ts - PostgreSQL Database Operations
import { query, queryOne, queryMany } from "./database";
import { ENV } from "./_core/env";

// ==============================
// 👤 USER OPERATIONS
// ==============================

export interface User {
  id: string;
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}

export interface InsertUser {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  role?: "user" | "admin";
  lastSignedIn?: Date;
}

export async function upsertUser(user: InsertUser) {
  const role = user.role || (user.openId === ENV.ownerOpenId ? "admin" : "user");
  const now = new Date();

  await query(
    `INSERT INTO users (open_id, name, email, login_method, role, last_signed_in, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (open_id) 
     DO UPDATE SET 
       name = EXCLUDED.name,
       email = EXCLUDED.email,
       login_method = EXCLUDED.login_method,
       role = EXCLUDED.role,
       last_signed_in = EXCLUDED.last_signed_in,
       updated_at = EXCLUDED.updated_at`,
    [user.openId, user.name, user.email, user.loginMethod, role, user.lastSignedIn || now, now, now]
  );
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const result = await queryOne<any>(
    `SELECT id, open_id as "openId", name, email, login_method as "loginMethod", 
            role, created_at as "createdAt", updated_at as "updatedAt", 
            last_signed_in as "lastSignedIn"
     FROM users WHERE open_id = $1`,
    [openId]
  );
  return result || undefined;
}

// ==============================
// 📄 PAGE CONTENT OPERATIONS
// ==============================

export interface PageContent {
  id: string;
  pageKey: string;
  headline?: string | null;
  subHeadline?: string | null;
  missionText?: string | null;
  visionText?: string | null;
  studentsTrained?: number;
  expertInstructors?: number;
  jobPlacementRate?: number;
  heroImageUrl?: string | null;
  visionImageUrl?: string | null;
  bannerImageUrl?: string | null;
  founderImageUrl?: string | null;
  companyImageUrl?: string | null;
  missionImageUrl?: string | null;
  founderBio?: string | null;
  founderMessage?: string | null;
  aboutCompany?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertPageContent = Omit<PageContent, "id" | "createdAt" | "updatedAt">;

export async function getPageContent(pageKey: string): Promise<PageContent | undefined> {
  const result = await queryOne<any>(
    `SELECT id, page_key as "pageKey", headline, sub_headline as "subHeadline",
            mission_text as "missionText", vision_text as "visionText",
            students_trained as "studentsTrained", expert_instructors as "expertInstructors",
            job_placement_rate as "jobPlacementRate", hero_image_url as "heroImageUrl",
            banner_image_url as "bannerImageUrl", founder_image_url as "founderImageUrl",
            company_image_url as "companyImageUrl", mission_image_url as "missionImageUrl",
            vision_image_url as "visionImageUrl", founder_bio as "founderBio",
            founder_message as "founderMessage", about_company as "aboutCompany",
            created_at as "createdAt", updated_at as "updatedAt"
     FROM page_content WHERE page_key = $1`,
    [pageKey]
  );
  return result || undefined;
}

export async function updatePageContent(pageKey: string, updates: Partial<InsertPageContent>) {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  // Build dynamic UPDATE query
  Object.entries(updates).forEach(([key, value]) => {
    if (key === 'pageKey') return; // Skip pageKey
    
    // Convert camelCase to snake_case
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    fields.push(`${snakeKey} = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  });

  if (fields.length === 0) return;

  values.push(pageKey);
  
  await query(
    `UPDATE page_content SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE page_key = $${paramIndex}`,
    values
  );
}

// ==============================
// 📚 COURSES OPERATIONS
// ==============================

export interface Course {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  duration?: string | null;
  level?: string | null;
  instructor?: string | null;
  priceEgp: number;
  priceUsd: number;
  courseLink?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertCourse = Omit<Course, "id" | "createdAt" | "updatedAt">;

export async function getCourses(): Promise<Course[]> {
  return await queryMany<any>(
    `SELECT id, title, description, image_url as "imageUrl", duration, level, 
            instructor, price_egp as "priceEgp", price_usd as "priceUsd",
            course_link as "courseLink",
            created_at as "createdAt", updated_at as "updatedAt"
     FROM courses ORDER BY created_at DESC`
  );
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  const result = await queryOne<any>(
    `SELECT id, title, description, image_url as "imageUrl", duration, level,
            instructor, price_egp as "priceEgp", price_usd as "priceUsd",
            course_link as "courseLink",
            created_at as "createdAt", updated_at as "updatedAt"
     FROM courses WHERE id = $1`,
    [id]
  );
  return result || undefined;
}

export async function createCourse(course: InsertCourse) {
  await query(
    `INSERT INTO courses (title, description, image_url, duration, level, instructor, price_egp, price_usd, course_link)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [course.title, course.description, course.imageUrl, course.duration, course.level, 
     course.instructor, course.priceEgp, course.priceUsd, course.courseLink]
  );
}

export async function updateCourse(id: string, updates: Partial<InsertCourse>) {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  Object.entries(updates).forEach(([key, value]) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    fields.push(`${snakeKey} = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  });

  if (fields.length === 0) return;

  values.push(id);
  
  await query(
    `UPDATE courses SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${paramIndex}`,
    values
  );
}

export async function deleteCourse(id: string) {
  await query(`DELETE FROM courses WHERE id = $1`, [id]);
}

// ==============================
// 🎓 PROGRAMS OPERATIONS
// ==============================

export interface Program {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  duration?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertProgram = Omit<Program, "id" | "createdAt" | "updatedAt">;

export async function getPrograms(): Promise<Program[]> {
  return await queryMany<any>(
    `SELECT id, title, description, image_url as "imageUrl", duration,
            created_at as "createdAt", updated_at as "updatedAt"
     FROM programs ORDER BY created_at DESC`
  );
}

export async function createProgram(program: InsertProgram) {
  await query(
    `INSERT INTO programs (title, description, image_url, duration)
     VALUES ($1, $2, $3, $4)`,
    [program.title, program.description, program.imageUrl, program.duration]
  );
}

export async function updateProgram(id: string, updates: Partial<InsertProgram>) {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  Object.entries(updates).forEach(([key, value]) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    fields.push(`${snakeKey} = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  });

  if (fields.length === 0) return;

  values.push(id);
  
  await query(
    `UPDATE programs SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${paramIndex}`,
    values
  );
}

export async function deleteProgram(id: string) {
  await query(`DELETE FROM programs WHERE id = $1`, [id]);
}

// ==============================
// 📝 BLOG OPERATIONS
// ==============================

export interface BlogPost {
  id: string;
  title: string;
  content?: string | null;
  excerpt?: string | null;
  imageUrl?: string | null;
  author?: string | null;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertBlogPost = Omit<BlogPost, "id" | "createdAt" | "updatedAt">;

export async function getBlogPosts(): Promise<BlogPost[]> {
  return await queryMany<any>(
    `SELECT id, title, content, excerpt, image_url as "imageUrl", author,
            published_at as "publishedAt", created_at as "createdAt", updated_at as "updatedAt"
     FROM blog_posts ORDER BY published_at DESC`
  );
}

export async function getBlogPostById(id: string): Promise<BlogPost | undefined> {
  const result = await queryOne<any>(
    `SELECT id, title, content, excerpt, image_url as "imageUrl", author,
            published_at as "publishedAt", created_at as "createdAt", updated_at as "updatedAt"
     FROM blog_posts WHERE id = $1`,
    [id]
  );
  return result || undefined;
}

export async function createBlogPost(post: InsertBlogPost) {
  await query(
    `INSERT INTO blog_posts (title, content, excerpt, image_url, author, published_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [post.title, post.content, post.excerpt, post.imageUrl, post.author, post.publishedAt]
  );
}

export async function updateBlogPost(id: string, updates: Partial<InsertBlogPost>) {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  Object.entries(updates).forEach(([key, value]) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    fields.push(`${snakeKey} = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  });

  if (fields.length === 0) return;

  values.push(id);
  
  await query(
    `UPDATE blog_posts SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${paramIndex}`,
    values
  );
}

export async function deleteBlogPost(id: string) {
  await query(`DELETE FROM blog_posts WHERE id = $1`, [id]);
}

// ==============================
// 💼 CAREERS OPERATIONS
// ==============================

export interface Career {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  type?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertCareer = Omit<Career, "id" | "createdAt" | "updatedAt">;

export async function getCareers(): Promise<Career[]> {
  return await queryMany<any>(
    `SELECT id, title, description, location, type,
            created_at as "createdAt", updated_at as "updatedAt"
     FROM careers ORDER BY created_at DESC`
  );
}

export async function createCareer(career: InsertCareer) {
  await query(
    `INSERT INTO careers (title, description, location, type)
     VALUES ($1, $2, $3, $4)`,
    [career.title, career.description, career.location, career.type]
  );
}

export async function updateCareer(id: string, updates: Partial<InsertCareer>) {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  Object.entries(updates).forEach(([key, value]) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    fields.push(`${snakeKey} = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  });

  if (fields.length === 0) return;

  values.push(id);
  
  await query(
    `UPDATE careers SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${paramIndex}`,
    values
  );
}

export async function deleteCareer(id: string) {
  await query(`DELETE FROM careers WHERE id = $1`, [id]);
}

// ==============================
// 📋 APPLICATIONS OPERATIONS
// ==============================

export interface Application {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  courseInterest?: string | null;
  message?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertApplication = Omit<Application, "id" | "createdAt" | "updatedAt">;

export async function getApplications(): Promise<Application[]> {
  return await queryMany<any>(
    `SELECT id, full_name as "fullName", email, phone, course_interest as "courseInterest",
            message, status, created_at as "createdAt", updated_at as "updatedAt"
     FROM applications ORDER BY created_at DESC`
  );
}

export async function createApplication(application: InsertApplication) {
  await query(
    `INSERT INTO applications (full_name, email, phone, course_interest, message, status)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [application.fullName, application.email, application.phone, 
     application.courseInterest, application.message, application.status || 'pending']
  );
}

export async function updateApplicationStatus(id: string, status: string) {
  await query(
    `UPDATE applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
    [status, id]
  );
}

export async function deleteApplication(id: string) {
  await query(`DELETE FROM applications WHERE id = $1`, [id]);
}

// ==============================
// 💬 MESSAGES OPERATIONS
// ==============================

export interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertMessage = Omit<Message, "id" | "createdAt" | "updatedAt">;

export async function getMessages(): Promise<Message[]> {
  return await queryMany<any>(
    `SELECT id, name, email, subject, message, status,
            created_at as "createdAt", updated_at as "updatedAt"
     FROM messages ORDER BY created_at DESC`
  );
}

export async function createMessage(msg: InsertMessage) {
  await query(
    `INSERT INTO messages (name, email, subject, message, status)
     VALUES ($1, $2, $3, $4, $5)`,
    [msg.name, msg.email, msg.subject, msg.message, msg.status || 'unread']
  );
}

export async function updateMessageStatus(id: string, status: string) {
  await query(
    `UPDATE messages SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
    [status, id]
  );
}

export async function deleteMessage(id: string) {
  await query(`DELETE FROM messages WHERE id = $1`, [id]);
}


// ==============================
// 💼 JOB LISTINGS OPERATIONS (Aliases for Careers)
// ==============================

// These are aliases for career functions to maintain compatibility
export const getJobListings = getCareers;
export const getAllJobListings = getCareers;
export const createJobListing = createCareer;
export const updateJobListing = updateCareer;
export const deleteJobListing = deleteCareer;

// ==============================
// 📝 STUDENT APPLICATIONS (Aliases)
// ==============================

export const getStudentApplications = getApplications;
export const createStudentApplication = createApplication;
export const deleteStudentApplication = deleteApplication;

// ==============================
// 💬 CONTACT MESSAGES (Aliases)
// ==============================

export const getContactMessages = getMessages;
export const createContactMessage = createMessage;
export const deleteContactMessage = deleteMessage;

// ==============================
// ⚙️ SITE SETTINGS
// ==============================

export async function setSiteSetting(key: string, value: string) {
  await query(
    `INSERT INTO site_settings (key, value) 
     VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
    [key, value]
  );
}

export async function getSiteSetting(key: string): Promise<string | null> {
  const result = await queryOne<{ value: string }>(
    `SELECT value FROM site_settings WHERE key = $1`,
    [key]
  );
  return result?.value || null;
}
