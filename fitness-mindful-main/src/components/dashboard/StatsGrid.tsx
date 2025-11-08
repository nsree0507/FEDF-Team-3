import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Flame, Clock, MapPin, Dumbbell } from "lucide-react";

interface StatsGridProps {
  userId: string;
}

const StatsGrid = ({ userId }: StatsGridProps) => {
  const [stats, setStats] = useState({
    caloriesBurned: 0,
    hoursActive: 0,
    kmCovered: 0,
    workouts: 0,
    caloriesChange: 0,
    hoursChange: 0,
    kmChange: 0,
    workoutsChange: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      // Current week stats
      const { data: currentWeek } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", userId)
        .gte("workout_date", weekAgo.toISOString());

      // Previous week stats
      const { data: previousWeek } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", userId)
        .gte("workout_date", twoWeeksAgo.toISOString())
        .lt("workout_date", weekAgo.toISOString());

      const calculateStats = (workouts: any[]) => ({
        calories: workouts?.reduce((sum, w) => sum + (w.calories || 0), 0) || 0,
        hours: workouts?.reduce((sum, w) => sum + (w.duration || 0), 0) / 60 || 0,
        km: workouts?.reduce((sum, w) => sum + (w.distance || 0), 0) || 0,
        count: workouts?.length || 0,
      });

      const current = calculateStats(currentWeek || []);
      const previous = calculateStats(previousWeek || []);

      setStats({
        caloriesBurned: Math.round(current.calories),
        hoursActive: parseFloat(current.hours.toFixed(1)),
        kmCovered: parseFloat(current.km.toFixed(1)),
        workouts: current.count,
        caloriesChange: previous.calories ? Math.round(((current.calories - previous.calories) / previous.calories) * 100) : 0,
        hoursChange: previous.hours ? Math.round(((current.hours - previous.hours) / previous.hours) * 100) : 0,
        kmChange: previous.km ? Math.round(((current.km - previous.km) / previous.km) * 100) : 0,
        workoutsChange: previous.count ? Math.round(((current.count - previous.count) / previous.count) * 100) : 0,
      });
    };

    fetchStats();
  }, [userId]);

  const statCards = [
    {
      label: "Calories Burned",
      value: stats.caloriesBurned.toLocaleString(),
      change: stats.caloriesChange,
      icon: Flame,
      color: "text-orange-500",
    },
    {
      label: "Hours Active",
      value: stats.hoursActive,
      change: stats.hoursChange,
      icon: Clock,
      color: "text-info",
    },
    {
      label: "KM Covered",
      value: stats.kmCovered,
      change: stats.kmChange,
      icon: MapPin,
      color: "text-success",
    },
    {
      label: "Workouts",
      value: stats.workouts,
      change: stats.workoutsChange,
      icon: Dumbbell,
      color: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </div>
          <p className="text-3xl font-bold mb-2">{stat.value}</p>
          <p className={`text-sm font-medium ${stat.change >= 0 ? "text-success" : "text-destructive"}`}>
            {stat.change >= 0 ? "+" : ""}{stat.change}% vs last week
          </p>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;
