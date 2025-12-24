import { Layout } from "@/components/Layout";
import { useCampaign, useCampaignMatches, useGenerateMatches, useUpdateMatch, useGenerateEmail } from "@/hooks/use-campaigns";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Sparkles, CheckCircle, XCircle, Mail, RotateCw, Copy, Send } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MatchWithInvestor } from "@shared/schema";

export default function CampaignDetails() {
  const [, params] = useRoute("/campaigns/:id");
  const id = Number(params?.id);
  const { data: campaign, isLoading: isLoadingCampaign } = useCampaign(id);
  const { data: matches, isLoading: isLoadingMatches } = useCampaignMatches(id);
  const { mutate: generateMatches, isPending: isGenerating } = useGenerateMatches();
  const { mutate: updateMatch } = useUpdateMatch();
  
  const [selectedMatch, setSelectedMatch] = useState<MatchWithInvestor | null>(null);

  if (isLoadingCampaign) return <Layout><Skeleton className="h-12 w-1/2 mb-8" /><Skeleton className="h-64 w-full" /></Layout>;
  if (!campaign) return <Layout><div>Campaign not found</div></Layout>;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-display font-bold text-foreground">{campaign.name}</h1>
              <Badge variant={campaign.isActive ? "default" : "secondary"}>
                {campaign.isActive ? "Active" : "Archived"}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2 max-w-2xl">{campaign.description}</p>
          </div>
          <Button 
            onClick={() => generateMatches(id)} 
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/20"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            AI Generate Matches
          </Button>
        </div>

        <Tabs defaultValue="pipeline" className="w-full">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="all">All Matches</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pipeline" className="mt-6">
            {isLoadingMatches ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-96 rounded-xl bg-card/50" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
                {/* Kanban Columns */}
                <PipelineColumn 
                  title="Pending Review" 
                  status="pending" 
                  matches={matches?.filter(m => m.status === 'pending') || []} 
                  onApprove={(id) => updateMatch({ id, status: 'approved' })}
                  onReject={(id) => updateMatch({ id, status: 'rejected' })}
                />
                <PipelineColumn 
                  title="Approved / To Contact" 
                  status="approved" 
                  matches={matches?.filter(m => m.status === 'approved' && m.emailStatus === 'not_sent') || []} 
                  onContact={(match) => setSelectedMatch(match)}
                />
                <PipelineColumn 
                  title="Contacted" 
                  status="contacted" 
                  matches={matches?.filter(m => m.emailStatus === 'sent') || []} 
                />
                <PipelineColumn 
                  title="Replied" 
                  status="replied" 
                  matches={matches?.filter(m => m.emailStatus === 'replied') || []} 
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="all">
            <div className="bg-card rounded-xl border border-border p-6">
               <p className="text-muted-foreground">List view of all {matches?.length} matches would go here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Email Generation Dialog */}
      {selectedMatch && (
        <EmailDialog 
          match={selectedMatch} 
          open={!!selectedMatch} 
          onOpenChange={(open) => !open && setSelectedMatch(null)} 
        />
      )}
    </Layout>
  );
}

// Sub-components for Pipeline

function PipelineColumn({ title, matches, onApprove, onReject, onContact }: any) {
  return (
    <div className="flex flex-col gap-4 min-w-[280px]">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">{title}</h3>
        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{matches.length}</span>
      </div>
      <div className="flex flex-col gap-3 bg-muted/20 p-2 rounded-xl h-[600px] overflow-y-auto">
        {matches.map((match: any) => (
          <div key={match.id} className="bg-card p-4 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-foreground">{match.investor.name}</h4>
              <Badge variant="outline" className="text-[10px] h-5">{match.matchScore}% Match</Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{match.matchReason}</p>
            
            {onApprove && (
              <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" className="flex-1 h-8 bg-green-600 hover:bg-green-700" onClick={() => onApprove(match.id)}>
                  <CheckCircle className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" className="flex-1 h-8" onClick={() => onReject(match.id)}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            {onContact && (
              <Button size="sm" className="w-full mt-2 h-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onContact(match)}>
                <Mail className="w-3 h-3 mr-2" /> Draft Email
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EmailDialog({ match, open, onOpenChange }: { match: MatchWithInvestor, open: boolean, onOpenChange: (o: boolean) => void }) {
  const { mutate: generateEmail, isPending, data } = useGenerateEmail();
  const { mutate: updateMatch } = useUpdateMatch();
  const { toast } = useToast();
  const [content, setContent] = useState("");

  // Auto-generate on open if no content
  if (open && !content && !isPending && !data) {
    generateEmail(match.id);
  }
  
  // Update local state when data arrives
  if (data && !content) {
    setContent(data.content);
  }

  const handleSend = () => {
    updateMatch({ id: match.id, emailStatus: 'sent', emailContent: content }, {
      onSuccess: () => {
        toast({ title: "Sent", description: "Email sent successfully." });
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Outreach to {match.investor.name}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {isPending ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground animate-pulse">AI crafting personalized email...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-background border border-border rounded-md text-sm whitespace-pre-wrap font-mono min-h-[300px] focus-within:ring-2 ring-primary">
                <textarea 
                  className="w-full h-full bg-transparent border-none outline-none resize-none"
                  value={content || data?.content || ""}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                 <Button variant="outline" size="sm" onClick={() => generateEmail(match.id)}>
                   <RotateCw className="w-3 h-3 mr-2" /> Regenerate
                 </Button>
                 <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(content)}>
                   <Copy className="w-3 h-3 mr-2" /> Copy
                 </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSend} disabled={isPending || !content} className="gap-2">
            <Send className="w-4 h-4" /> Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
