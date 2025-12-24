import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <Layout>
      <div className="space-y-8 max-w-4xl">
        <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
        
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Email Configuration</CardTitle>
            <CardDescription>Manage your sending domains and signatures.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Sending Name</Label>
              <Input placeholder="John Doe" className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label>Reply-To Email</Label>
              <Input placeholder="john@startup.com" className="bg-background" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>AI Preferences</CardTitle>
            <CardDescription>Customize how the AI generates matches and emails.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Aggressive Matching</Label>
                <p className="text-sm text-muted-foreground">Match with investors slightly outside focus area</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Draft Emails</Label>
                <p className="text-sm text-muted-foreground">Automatically generate drafts for approved matches</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </div>
    </Layout>
  );
}
