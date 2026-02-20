import { useTranslations } from "@/hooks/use-translations";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function History() {
  const { data: translations, isLoading, isError } = useTranslations();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleCopy = async (text: string, id: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({
      description: "Translated text copied",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isError) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="bg-destructive/10 p-4 rounded-full mb-4">
            <Clock className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">Could not load history</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Translation History</h1>
          <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
            {translations?.length || 0} items
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : translations?.length === 0 ? (
          <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-border">
            <Clock className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-1">No history yet</h3>
            <p className="text-muted-foreground">Your recent translations will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {translations?.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-md transition-all duration-200 border-border/60 hover:border-primary/20">
                  <div className="p-4 md:p-6 grid gap-4 md:grid-cols-[1fr,auto,1fr,auto] items-start md:items-center">
                    
                    <div className="space-y-1">
                      <p className="font-assamese text-lg text-foreground/90 leading-relaxed">
                        {item.sourceText}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="uppercase tracking-wider font-semibold text-[10px]">Assamese</span>
                      </p>
                    </div>

                    <div className="hidden md:flex justify-center text-muted-foreground/30">
                      <ArrowRight className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-lg text-foreground/90 leading-relaxed">
                        {item.translatedText}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="uppercase tracking-wider font-semibold text-[10px]">English</span>
                      </p>
                    </div>

                    <div className="flex flex-row md:flex-col items-center gap-2 justify-end mt-2 md:mt-0 md:pl-4 md:border-l border-border/50">
                      <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {format(new Date(item.createdAt), "MMM d, h:mm a")}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5"
                        onClick={() => handleCopy(item.translatedText, item.id)}
                      >
                        {copiedId === item.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
