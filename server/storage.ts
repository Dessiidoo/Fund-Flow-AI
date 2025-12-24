import { 
  investors, campaigns, matches,
  type Investor, type InsertInvestor,
  type Campaign, type InsertCampaign,
  type Match, type InsertMatch,
  type MatchWithInvestor
} from "@shared/schema";
import { db } from "./db";
import { eq, like, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Investors
  getInvestors(search?: string, focus?: string): Promise<Investor[]>;
  getInvestor(id: number): Promise<Investor | undefined>;
  createInvestor(investor: InsertInvestor): Promise<Investor>;
  createInvestors(investors: InsertInvestor[]): Promise<void>;

  // Campaigns
  getCampaigns(): Promise<Campaign[]>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;

  // Matches
  getMatches(campaignId: number): Promise<MatchWithInvestor[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: number, updates: Partial<InsertMatch>): Promise<Match>;
  getMatch(id: number): Promise<Match | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Investors
  async getInvestors(search?: string, focus?: string): Promise<Investor[]> {
    let query = db.select().from(investors);
    
    const conditions = [];
    if (search) {
      conditions.push(
        sql`(${investors.name} ILIKE ${`%${search}%`} OR ${investors.focus} ILIKE ${`%${search}%`} OR ${investors.description} ILIKE ${`%${search}%`})`
      );
    }
    if (focus) {
      conditions.push(like(investors.focus, `%${focus}%`));
    }

    if (conditions.length > 0) {
      // @ts-ignore
      query = query.where(sql.join(conditions, sql` AND `));
    }
    
    return await query;
  }

  async getInvestor(id: number): Promise<Investor | undefined> {
    const [investor] = await db.select().from(investors).where(eq(investors.id, id));
    return investor;
  }

  async createInvestor(investor: InsertInvestor): Promise<Investor> {
    const [newInvestor] = await db.insert(investors).values(investor).returning();
    return newInvestor;
  }

  async createInvestors(investorList: InsertInvestor[]): Promise<void> {
    if (investorList.length === 0) return;
    // Batch insert
    await db.insert(investors).values(investorList);
  }

  // Campaigns
  async getCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns).orderBy(desc(campaigns.createdAt));
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign;
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [newCampaign] = await db.insert(campaigns).values(campaign).returning();
    return newCampaign;
  }

  // Matches
  async getMatches(campaignId: number): Promise<MatchWithInvestor[]> {
    const results = await db
      .select({
        match: matches,
        investor: investors
      })
      .from(matches)
      .innerJoin(investors, eq(matches.investorId, investors.id))
      .where(eq(matches.campaignId, campaignId));
    
    return results.map(r => ({ ...r.match, investor: r.investor }));
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const [newMatch] = await db.insert(matches).values(match).returning();
    return newMatch;
  }

  async updateMatch(id: number, updates: Partial<InsertMatch>): Promise<Match> {
    const [updatedMatch] = await db
      .update(matches)
      .set(updates)
      .where(eq(matches.id, id))
      .returning();
    return updatedMatch;
  }

  async getMatch(id: number): Promise<Match | undefined> {
    const [match] = await db.select().from(matches).where(eq(matches.id, id));
    return match;
  }
}

export const storage = new DatabaseStorage();
