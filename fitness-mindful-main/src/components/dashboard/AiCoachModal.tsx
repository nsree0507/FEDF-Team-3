import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AiCoachModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const AiCoachModal = ({ open, onClose, userId }: AiCoachModalProps) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchUserData();
    }
  }, [open, userId]);

  const fetchUserData = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      setUserData(data);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) {
      toast({
        title: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnswer("");

    try {
      const { data, error } = await supabase.functions.invoke("ai-coach", {
        body: { question, userData },
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Failed to get advice",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setAnswer(data.answer);
    } catch (error) {
      console.error("Error asking AI coach:", error);
      toast({
        title: "Failed to get coaching advice",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Ask AI Coach
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Textarea
              placeholder="e.g., What exercises should I do to improve my endurance? How can I build muscle with my equipment?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <Button
            onClick={handleAsk}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting advice...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Get Fitness Advice
              </>
            )}
          </Button>

          {answer && (
            <div className="mt-6 space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">AI Coach Response:</h4>
              <ScrollArea className="h-[300px] w-full rounded-lg border p-4 bg-secondary/30">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {answer}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AiCoachModal;
