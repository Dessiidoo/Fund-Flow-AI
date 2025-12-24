import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useInvestors(params?: { search?: string; focus?: string }) {
  return useQuery({
    queryKey: [api.investors.list.path, params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append("search", params.search);
      if (params?.focus) queryParams.append("focus", params.focus);
      
      const url = `${api.investors.list.path}?${queryParams.toString()}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch investors");
      return api.investors.list.responses[200].parse(await res.json());
    },
  });
}

export function useInvestor(id: number) {
  return useQuery({
    queryKey: [api.investors.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.investors.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch investor");
      return api.investors.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useImportInvestors() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      // Note: Implementation specific to how file upload is handled on backend
      // Assuming endpoint accepts JSON or FormData. Since schema says "POST /api/investors/import"
      // and response is { count: number }, we'll assume the backend handles the CSV parsing logic
      // internally if we trigger it, or this might be a mock trigger for now.
      
      const res = await fetch(api.investors.import.path, {
        method: api.investors.import.method,
        body: formData, // Sending FormData directly for file upload
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to import investors");
      return api.investors.import.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.investors.list.path] });
    },
  });
}
