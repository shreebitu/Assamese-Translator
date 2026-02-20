import { useState, useEffect } from "react";
import { useTranslate } from "@/hooks/use-translations";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowRightLeft, Copy, Check, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Home() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  
  const { mutate: translate, isPending } = useTranslate();
  const { toast } = useToast();

  const handleTranslate = () => {
    if (!sourceText.trim()) return;
    
    translate(
      { text: sourceText },
      {
        onSuccess: (data) => {
          setTranslatedText(data.translatedText);
        },
      }
    );
  };

  const copyToClipboard = async () => {
    if (!translatedText) return;
    await navigator.clipboard.writeText(translatedText);
    setIsCopied(true);
    toast({
      description: "Translation copied to clipboard",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Handle Ctrl+Enter to translate
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleTranslate();
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center space-y-4 mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground"
          >
            Translate <span className="text-primary">Assamese</span> to English
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Seamlessly convert Assamese text into English with our AI-powered translation tool.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-[1fr,auto,1fr] gap-6 items-start">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="group"
          >
            <Card className="p-1 shadow-lg hover:shadow-xl transition-shadow border-primary/20 bg-gradient-to-br from-white to-secondary/50 dark:from-gray-900 dark:to-gray-800/50">
              <div className="bg-background rounded-xl p-4 md:p-6 min-h-[300px] flex flex-col relative">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-primary uppercase tracking-wider">Assamese</span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">Ctrl + Enter to translate</span>
                </div>
                <Textarea
                  placeholder="ইয়াত লিখক (Type here)..."
                  className="flex-1 resize-none border-0 p-0 text-lg md:text-xl font-assamese focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/40 leading-relaxed"
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
                  <span>{sourceText.length} chars</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Action Button */}
          <div className="flex justify-center md:pt-32">
            <Button
              size="icon"
              variant="outline"
              className="rounded-full w-12 h-12 border-2 bg-background hover:bg-secondary hover:scale-110 transition-all duration-200 hidden md:flex"
              onClick={handleTranslate}
              disabled={isPending || !sourceText.trim()}
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />}
            </Button>
            
            {/* Mobile Translate Button */}
            <Button
              className="w-full md:hidden bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              size="lg"
              onClick={handleTranslate}
              disabled={isPending || !sourceText.trim()}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Translating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Translate
                </>
              )}
            </Button>
          </div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className={cn(
              "p-1 shadow-lg transition-all duration-300 border-border bg-gradient-to-br from-secondary/30 to-background dark:from-gray-800/30 dark:to-gray-900",
              translatedText && "ring-2 ring-primary/20 shadow-primary/10"
            )}>
              <div className="bg-background/50 rounded-xl p-4 md:p-6 min-h-[300px] flex flex-col relative">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">English</span>
                  {translatedText && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={copyToClipboard}
                    >
                      {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  )}
                </div>
                
                {isPending ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                      <Sparkles className="w-5 h-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="animate-pulse text-sm">Translating...</p>
                  </div>
                ) : translatedText ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 text-lg md:text-xl leading-relaxed text-foreground"
                  >
                    {translatedText}
                  </motion.div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground/40 italic">
                    Translation will appear here...
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Desktop CTA */}
        <div className="flex justify-center pt-8 hidden md:flex">
          <Button
            size="lg"
            className="px-8 py-6 text-lg rounded-full font-semibold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-primary to-purple-600"
            onClick={handleTranslate}
            disabled={isPending || !sourceText.trim()}
          >
            {isPending ? "Translating..." : "Translate Text"}
            {!isPending && <Sparkles className="ml-2 w-5 h-5" />}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
