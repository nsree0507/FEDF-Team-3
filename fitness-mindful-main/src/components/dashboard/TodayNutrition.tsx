import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TodayNutritionProps {
  userId: string;
}

const TodayNutrition = ({ userId }: TodayNutritionProps) => {
  const [meals, setMeals] = useState<any[]>([]);
  const [stats, setStats] = useState({ consumed: 0, burned: 0, net: 0 });

  useEffect(() => {
    const fetchTodayData = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Fetch today's meals
      const { data: mealsData } = await supabase
        .from("meals")
        .select("*")
        .eq("user_id", userId)
        .gte("meal_date", today.toISOString())
        .order("meal_date", { ascending: false });

      setMeals(mealsData || []);

      // Calculate consumed calories
      const consumed = mealsData?.reduce((sum, m) => sum + (m.calories || 0), 0) || 0;

      // Fetch today's burned calories
      const { data: workoutsData } = await supabase
        .from("workouts")
        .select("calories")
        .eq("user_id", userId)
        .gte("workout_date", today.toISOString());

      const burned = workoutsData?.reduce((sum, w) => sum + (w.calories || 0), 0) || 0;

      setStats({
        consumed,
        burned,
        net: consumed - burned,
      });
    };

    fetchTodayData();
  }, [userId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Nutrition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-4 rounded-lg bg-secondary">
            <p className="text-sm text-muted-foreground">Consumed</p>
            <p className="text-2xl font-bold text-info">{stats.consumed}</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-secondary">
            <p className="text-sm text-muted-foreground">Burned</p>
            <p className="text-2xl font-bold text-warning">{stats.burned}</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-secondary">
            <p className="text-sm text-muted-foreground">Net</p>
            <p className={`text-2xl font-bold ${stats.net > 0 ? "text-destructive" : "text-success"}`}>
              {stats.net > 0 ? "-" : "+"}{Math.abs(stats.net)}
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Logged Meals</h4>
          <div className="space-y-2">
            {meals.length > 0 ? (
              meals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <p className="font-medium">{meal.meal_name}</p>
                  <p className="font-semibold">{meal.calories} kcal</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No meals logged today</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayNutrition;
