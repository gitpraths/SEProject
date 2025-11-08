import { pgTable, text, integer, timestamp, uuid, boolean, real, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  age: integer('age'),
  gender: text('gender'),
  phoneNumber: text('phone_number'),
  email: text('email'),
  address: text('address'),
  location: jsonb('location').$type<{ lat: number; lng: number; address: string }>(),
  
  medicalHistory: text('medical_history'),
  disabilities: text('disabilities').array(),
  chronicConditions: text('chronic_conditions').array(),
  
  education: text('education'),
  skills: text('skills').array(),
  previousOccupation: text('previous_occupation'),
  
  emergencyContactName: text('emergency_contact_name'),
  emergencyContactPhone: text('emergency_contact_phone'),
  emergencyContactRelation: text('emergency_contact_relation'),
  
  hasGovernmentId: boolean('has_government_id').default(false),
  documents: text('documents').array(),
  
  priorityLevel: text('priority_level'),
  status: text('status').default('active'),
  currentSituation: text('current_situation'),
  
  consent: boolean('consent').default(false),
  notes: text('notes'),
  
  createdBy: text('created_by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const shelters = pgTable('shelters', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  location: jsonb('location').$type<{ lat: number; lng: number; address: string }>().notNull(),
  capacity: integer('capacity').notNull(),
  available: integer('available').notNull(),
  
  amenities: text('amenities').array(),
  genderRestriction: text('gender_restriction'),
  ageRestriction: text('age_restriction'),
  
  contactPerson: text('contact_person'),
  contactPhone: text('contact_phone'),
  contactEmail: text('contact_email'),
  
  description: text('description'),
  rules: text('rules'),
  
  status: text('status').default('active'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const jobs = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  location: jsonb('location').$type<{ lat: number; lng: number; address: string }>().notNull(),
  
  description: text('description'),
  requirements: text('requirements').array(),
  skills: text('skills').array(),
  
  salaryMin: integer('salary_min'),
  salaryMax: integer('salary_max'),
  salaryCurrency: text('salary_currency').default('INR'),
  
  jobType: text('job_type'),
  experienceLevel: text('experience_level'),
  
  contactPerson: text('contact_person'),
  contactPhone: text('contact_phone'),
  contactEmail: text('contact_email'),
  
  status: text('status').default('active'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const matches = pgTable('matches', {
  id: uuid('id').defaultRandom().primaryKey(),
  profileId: uuid('profile_id').references(() => profiles.id).notNull(),
  resourceId: uuid('resource_id').notNull(),
  resourceType: text('resource_type').notNull(),
  
  matchScore: real('match_score').notNull(),
  matchReasons: text('match_reasons').array(),
  
  status: text('status').default('suggested'),
  outcome: text('outcome'),
  
  createdBy: text('created_by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const followups = pgTable('followups', {
  id: uuid('id').defaultRandom().primaryKey(),
  profileId: uuid('profile_id').references(() => profiles.id).notNull(),
  userId: text('user_id').notNull(),
  
  type: text('type').notNull(),
  notes: text('notes'),
  outcome: text('outcome'),
  
  nextFollowupDate: timestamp('next_followup_date'),
  completed: boolean('completed').default(false),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertShelterSchema = createInsertSchema(shelters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFollowupSchema = createInsertSchema(followups).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type Shelter = typeof shelters.$inferSelect;
export type InsertShelter = z.infer<typeof insertShelterSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

export type Followup = typeof followups.$inferSelect;
export type InsertFollowup = z.infer<typeof insertFollowupSchema>;
