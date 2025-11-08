import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface UserStatsCardProps {
  userId: string;
}

const UserStatsCard = ({ userId }: UserStatsCardProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [weeklyCalories, setWeeklyCalories] = useState(0);
  const weeklyGoal = 3500;

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      setProfile(data);
    };

    const fetchWeeklyCalories = async () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data } = await supabase
        .from("workouts")
        .select("calories")
        .eq("user_id", userId)
        .gte("workout_date", weekAgo.toISOString());

      const total = data?.reduce((sum, w) => sum + (w.calories || 0), 0) || 0;
      setWeeklyCalories(total);
    };

    fetchProfile();
    fetchWeeklyCalories();
  }, [userId]);

  if (!profile) return null;

  const bmi = profile.weight && profile.height 
    ? (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)
    : "N/A";

  const progress = (weeklyCalories / weeklyGoal) * 100;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-8">
          <div>
            <p className="text-sm text-muted-foreground">Weight</p>
            <p className="text-2xl font-bold">{profile.weight || "N/A"}KG</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Height</p>
            <p className="text-2xl font-bold">{profile.height || "N/A"}CM</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">BMI</p>
            <p className="text-2xl font-bold">{bmi}</p>
          </div>
        </div>
        <div className="flex-1 max-w-xl ml-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Weekly Goal</p>
            <p className="text-sm font-medium">
              {weeklyCalories.toLocaleString()}/{weeklyGoal.toLocaleString()} cal
            </p>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </Card>
  );
};

export default UserStatsCard;
