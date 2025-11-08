import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bike, Dumbbell, Activity, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface RecentWorkoutsProps {
  userId: string;
  onShare?: (workout: any) => void;
}

const iconMap: Record<string, any> = {
  running: Activity,
  cycling: Bike,
  strength: Dumbbell,
  yoga: Activity,
};

const colorMap: Record<string, string> = {
  running: "text-orange-500",
  cycling: "text-info",
  strength: "text-destructive",
  yoga: "text-purple-500",
};

const RecentWorkouts = ({ userId, onShare }: RecentWorkoutsProps) => {
  const [workouts, setWorkouts] = useState<any[]>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const { data } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", userId)
        .order("workout_date", { ascending: false })
        .limit(3);

      setWorkouts(data || []);
    };

    fetchWorkouts();
  }, [userId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Workouts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {workouts.map((workout) => {
          const Icon = iconMap[workout.exercise_type] || Dumbbell;
          const color = colorMap[workout.exercise_type] || "text-primary";

          return (
            <div key={workout.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg bg-secondary ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold capitalize">{workout.exercise_type.replace("_", " ")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(workout.workout_date), "MMM d, yyyy")} • {workout.location || "Unknown"}
                  </p>
                  {workout.notes && (
                    <p className="text-sm italic text-muted-foreground mt-1">"{workout.notes}"</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">{workout.duration}min</p>
                </div>
                {workout.distance && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Distance</p>
                    <p className="font-semibold">{workout.distance}km</p>
                  </div>
                )}
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Calories</p>
                  <p className="font-semibold">{workout.calories}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onShare && onShare(workout)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RecentWorkouts;
