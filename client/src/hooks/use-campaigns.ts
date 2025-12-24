import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertCampaign, type InsertMatch } from "@shared/routes";

// --- CAMPAIGNS ---

export function useCampaigns() {
  return useQuery({
    queryKey: [api.campaigns.list.path],
    queryFn: async () => {
      const res = await fetch(api.campaigns.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      return api.campaigns.list.responses[200].parse(await res.json());
    },
  });
}

export function useCampaign(id: number) {
  return useQuery({
    queryKey: [api.campaigns.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.campaigns.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch campaign");
      return api.campaigns.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertCampaign) => {
      const validated = api.campaigns.create.input.parse(data);
      const res = await fetch(api.campaigns.create.path, {
        method: api.campaigns.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.campaigns.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create campaign");
      }
      return api.campaigns.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.campaigns.list.path] });
    },
  });
}

// --- MATCHES & PIPELINE ---

export function useCampaignMatches(campaignId: number) {
  return useQuery({
    queryKey: [api.campaigns.getMatches.path, campaignId],
    queryFn: async () => {
      const url = buildUrl(api.campaigns.getMatches.path, { id: campaignId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch matches");
      return api.campaigns.getMatches.responses[200].parse(await res.json());
    },
    enabled: !!campaignId,
  });
}

export function useGenerateMatches() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (campaignId: number) => {
      const url = buildUrl(api.campaigns.generateMatches.path, { id: campaignId });
      const res = await fetch(url, {
        method: api.campaigns.generateMatches.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to generate matches");
      return api.campaigns.generateMatches.responses[200].parse(await res.json());
    },
    onSuccess: (_, campaignId) => {
      queryClient.invalidateQueries({ queryKey: [api.campaigns.getMatches.path, campaignId] });
    },
  });
}

export function useUpdateMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertMatch>) => {
      const validated = api.matches.update.input.parse(updates);
      const url = buildUrl(api.matches.update.path, { id });
      const res = await fetch(url, {
        method: api.matches.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update match");
      return api.matches.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.campaigns.getMatches.path, data.campaignId] });
    },
  });
}

export function useGenerateEmail() {
  return useMutation({
    mutationFn: async (matchId: number) => {
      const url = buildUrl(api.matches.generateEmail.path, { id: matchId });
      const res = await fetch(url, {
        method: api.matches.generateEmail.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to generate email");
      return api.matches.generateEmail.responses[200].parse(await res.json());
    },
  });
}
