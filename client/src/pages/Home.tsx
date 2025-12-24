import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { useCampaigns } from "@/hooks/use-campaigns";
import { Users, TrendingUp, MailCheck, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: campaigns, isLoading } = useCampaigns();

  // Mock aggregates for dashboard
  const activeCampaigns = campaigns?.filter(c => c.isActive).length || 0;
  
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Overview of your fundraising pipeline and outreach performance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Active Campaigns" 
            value={isLoading ? "-" : activeCampaigns} 
            description="Currently running"
            icon={TrendingUp}
            trend="up"
            trendValue="+1"
          />
          <StatCard 
            title="Total Matches" 
            value="1,284" 
            description="Investors identified"
            icon={Users}
            trend="up"
            trendValue="+12%"
          />
          <StatCard 
            title="Emails Sent" 
            value="432" 
            description="Last 30 days"
            icon={MailCheck}
            trend="neutral"
            trendValue="0%"
          />
          <StatCard 
            title="Avg. Response Rate" 
            value="4.8%" 
            description="Sector average: 2.1%"
            icon={Clock}
            trend="up"
            trendValue="+2.7%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity / Campaigns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-semibold">Recent Campaigns</h2>
              <Link href="/campaigns">
                <Button variant="ghost" className="text-sm">View All <ArrowRight className="ml-1 w-4 h-4" /></Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl bg-card/50" />)}
              </div>
            ) : campaigns?.length === 0 ? (
              <div className="p-8 border border-dashed border-border rounded-xl text-center text-muted-foreground">
                No campaigns yet. Start one to see data here.
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns?.slice(0, 3).map(campaign => (
                  <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                    <div className="group bg-card hover:bg-card/80 border border-border p-5 rounded-xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:border-primary/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{campaign.description || "No description provided."}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${campaign.isActive ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                          {campaign.isActive ? 'Active' : 'Archived'}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>42 Prospects</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Created {new Date(campaign.createdAt || "").toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Activity Feed Placeholder */}
          <div className="bg-card/30 border border-border rounded-xl p-6 h-fit">
            <h3 className="font-display font-semibold mb-4">System Activity</h3>
            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
              <div className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-blue-500/20 border-2 border-blue-500" />
                <p className="text-sm text-foreground">New match identified for <span className="font-medium text-blue-400">Seed Round Q1</span></p>
                <p className="text-xs text-muted-foreground mt-0.5">2 hours ago</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-green-500/20 border-2 border-green-500" />
                <p className="text-sm text-foreground">Email opened by <span className="font-medium text-green-400">Sequoia Capital</span></p>
                <p className="text-xs text-muted-foreground mt-0.5">5 hours ago</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-purple-500/20 border-2 border-purple-500" />
                <p className="text-sm text-foreground">Campaign created</p>
                <p className="text-xs text-muted-foreground mt-0.5">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
