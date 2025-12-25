import { Layout } from "@/components/Layout";
import { useInvestors } from "@/hooks/use-investors";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

function getHostname(url: string | null | undefined): string {
  if (!url) return "";
  try {
    // Add protocol if missing
    const urlStr = url.startsWith("http") ? url : `https://${url}`;
    return new URL(urlStr).hostname || url;
  } catch {
    return url;
  }
}

export default function Investors() {
  const [search, setSearch] = useState("");
  const { data: investors, isLoading } = useInvestors({ search });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Investor Database</h1>
            <p className="text-muted-foreground mt-1">
              Browse and filter 10,000+ verified angel investors and funds.
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 p-4 bg-card rounded-xl border border-border shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, firm, or focus..." 
              className="pl-9 bg-background border-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="secondary" className="gap-2">
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[250px]">Name / Firm</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Focus Area</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : investors?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No investors found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                investors?.map((investor) => (
                  <TableRow key={investor.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="font-medium text-foreground">{investor.name}</div>
                      {investor.website && (
                        <a href={investor.website.startsWith("http") ? investor.website : `https://${investor.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5">
                          {getHostname(investor.website)} <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {investor.fundType || "Angel"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground" title={investor.focus || ""}>
                      {investor.focus || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{investor.stage || "Seed"}</TableCell>
                    <TableCell className="text-muted-foreground">{investor.location || "Global"}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">Details</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
