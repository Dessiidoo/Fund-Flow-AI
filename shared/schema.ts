import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const investors = pgTable("investors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  fundType: text("fund_type"),
  website: text("website"),
  focus: text("focus"),
  stage: text("stage"),
  partnerName: text("partner_name"),
  partnerEmail: text("partner_email"),
  portfolio: text("portfolio"),
  location: text("location"),
  socialLinks: jsonb("social_links"),
  investmentCount: integer("investment_count"),
  exitCount: integer("exit_count"),
  description: text("description"),
  foundingYear: integer("founding_year"),
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id).notNull(),
  investorId: integer("investor_id").references(() => investors.id).notNull(),
  matchScore: integer("match_score"),
  matchReason: text("match_reason"),
  status: text("status").default("pending"), // pending, approved, rejected
  emailStatus: text("email_status").default("not_sent"), // not_sent, sent, opened, replied
  emailContent: text("email_content"),
  lastInteraction: timestamp("last_interaction"),
});

export const insertInvestorSchema = createInsertSchema(investors).omit({ id: true });
export const insertCampaignSchema = createInsertSchema(campaigns).omit({ id: true, createdAt: true });
export const insertMatchSchema = createInsertSchema(matches).omit({ id: true });

export type Investor = typeof investors.$inferSelect;
export type InsertInvestor = z.infer<typeof insertInvestorSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

export type MatchWithInvestor = Match & { investor: Investor };
