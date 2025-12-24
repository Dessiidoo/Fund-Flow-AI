import { Layout } from "@/components/Layout";
import { CreateCampaignDialog } from "@/components/CreateCampaignDialog";
import { useCampaigns } from "@/hooks/use-campaigns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ArrowRight, BarChart3, Users, Mail } from "lucide-react";

export default function Campaigns() {
  const { data: campaigns, isLoading } = useCampaigns();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Campaigns</h1>
            <p className="text-muted-foreground mt-1">Manage your fundraising pipelines and outreach.</p>
          </div>
          <CreateCampaignDialog />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        ) : campaigns?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-xl bg-card/20">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">No campaigns yet</h3>
            <p className="text-muted-foreground max-w-sm mt-2 mb-6">Create your first campaign to start matching with investors and automating outreach.</p>
            <CreateCampaignDialog />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns?.map((campaign) => (
              <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer bg-card border-border">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${campaign.isActive ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                        {campaign.isActive ? 'Active' : 'Archived'}
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{campaign.name}</CardTitle>
                    <CardDescription className="line-clamp-2 h-10">
                      {campaign.description || "No description provided."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-border mt-2">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Users className="w-3 h-3 mr-1" /> Prospects
                        </div>
                        <div className="text-lg font-semibold">--</div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Mail className="w-3 h-3 mr-1" /> Sent
                        </div>
                        <div className="text-lg font-semibold">--</div>
                      </div>
                    </div>
                    <Button className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground" variant="secondary">
                      View Pipeline <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
