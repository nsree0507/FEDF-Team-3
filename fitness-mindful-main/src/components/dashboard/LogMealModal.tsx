import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from "lucide-react";

interface LogMealModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const LogMealModal = ({ open, onClose, userId }: LogMealModalProps) => {
  const [description, setDescription] = useState("");
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!description.trim()) {
      toast({
        title: "Please describe your meal",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-meal", {
        body: { description },
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Analysis failed",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setMealName(data.meal_name);
      setCalories(data.calories.toString());
      setProtein(data.protein.toString());
      setCarbs(data.carbs.toString());
      setFats(data.fats.toString());

      toast({
        title: "Meal analyzed!",
        description: "Nutrition data has been estimated.",
      });
    } catch (error) {
      console.error("Error analyzing meal:", error);
      toast({
        title: "Failed to analyze meal",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogMeal = async () => {
    if (!mealName || !calories) {
      toast({
        title: "Please provide meal name and calories",
        variant: "destructive",
      });
      return;
    }

    setIsLogging(true);
    try {
      const { error } = await supabase.from("meals").insert({
        user_id: userId,
        meal_name: mealName,
        calories: parseInt(calories),
        protein: protein ? parseFloat(protein) : null,
        carbs: carbs ? parseFloat(carbs) : null,
        fats: fats ? parseFloat(fats) : null,
      });

      if (error) throw error;

      toast({
        title: "Meal logged successfully!",
      });

      // Reset form
      setDescription("");
      setMealName("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFats("");
      onClose();
    } catch (error) {
      console.error("Error logging meal:", error);
      toast({
        title: "Failed to log meal",
        variant: "destructive",
      });
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Log a Meal</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="smart" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="smart">Smart Search</TabsTrigger>
            <TabsTrigger value="custom">Custom Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="smart" className="space-y-4 mt-4">
            <div>
              <Label>Describe your meal</Label>
              <Textarea
                placeholder="e.g., A bowl of oatmeal with blueberries and a coffee"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Meal
                </>
              )}
            </Button>

            {mealName && (
              <div className="space-y-3 pt-4 border-t">
                <div>
                  <Label>Meal Name</Label>
                  <Input
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Calories (kcal)</Label>
                    <Input
                      type="number"
                      value={calories}
                      onChange={(e) => setCalories(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Protein (g)</Label>
                    <Input
                      type="number"
                      value={protein}
                      onChange={(e) => setProtein(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Carbs (g)</Label>
                    <Input
                      type="number"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Fats (g)</Label>
                    <Input
                      type="number"
                      value={fats}
                      onChange={(e) => setFats(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleLogMeal}
                  disabled={isLogging}
                  className="w-full"
                >
                  {isLogging ? "Logging..." : "Log Meal"}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 mt-4">
            <div>
              <Label>Meal Name</Label>
              <Input
                placeholder="e.g., Breakfast Smoothie"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Calories (kcal)</Label>
                <Input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label>Protein (g)</Label>
                <Input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Carbs (g)</Label>
                <Input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Fats (g)</Label>
                <Input
                  type="number"
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleLogMeal}
                disabled={isLogging}
                className="flex-1"
              >
                {isLogging ? "Logging..." : "Log Meal"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LogMealModal;
