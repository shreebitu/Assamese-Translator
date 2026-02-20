import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type TranslateInput, type TranslationItem } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useTranslations() {
  return useQuery({
    queryKey: [api.translations.list.path],
    queryFn: async () => {
      const res = await fetch(api.translations.list.path);
      if (!res.ok) throw new Error("Failed to fetch translations");
      return api.translations.list.responses[200].parse(await res.json());
    },
  });
}

export function useTranslate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: TranslateInput) => {
      // Validate input before sending
      const validated = api.translations.translate.input.parse(data);
      
      const res = await fetch(api.translations.translate.path, {
        method: api.translations.translate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.translations.translate.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 500) {
           const error = api.translations.translate.responses[500].parse(await res.json());
           throw new Error(error.message);
        }
        throw new Error("Translation failed");
      }

      return api.translations.translate.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.translations.list.path] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
