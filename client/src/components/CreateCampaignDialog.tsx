import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useCreateCampaign } from "@/hooks/use-campaigns";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";

export function CreateCampaignDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { mutate, isPending } = useCreateCampaign();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    mutate(
      { name, description, isActive: true },
      {
        onSuccess: () => {
          setOpen(false);
          setName("");
          setDescription("");
          toast({ title: "Success", description: "Campaign created successfully" });
        },
        onError: (err) => {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="font-display">Create Campaign</DialogTitle>
          <DialogDescription>
            Start a new fundraising outreach campaign.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Seed Round Q1 2025" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="bg-background border-input focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Goal / Focus</Label>
            <Textarea 
              id="description" 
              placeholder="Seeking $2M seed for AI logistics platform..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="bg-background border-input focus:ring-primary min-h-[100px]"
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isPending || !name}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Campaign
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
