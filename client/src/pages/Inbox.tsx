import { Layout } from "@/components/Layout";
import { Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Inbox() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold text-foreground">Inbox</h1>
          <Button variant="outline" size="icon"><RefreshCw className="w-4 h-4" /></Button>
        </div>

        <div className="bg-card border border-border rounded-xl flex flex-col items-center justify-center py-32 text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Mail className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">All caught up!</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            No pending replies from investors. Check back later or start a new campaign.
          </p>
        </div>
      </div>
    </Layout>
  );
}
