import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ProgressAnalyticsModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const ProgressAnalyticsModal = ({ open, onClose, userId }: ProgressAnalyticsModalProps) => {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, average: 0, best: 0, active: 0 });

  useEffect(() => {
    if (open) {
      fetchAnalytics();
    }
  }, [open, userId]);

  const fetchAnalytics = async () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const { data } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", userId)
      .gte("workout_date", sevenDaysAgo.toISOString());

    if (data) {
      // Group by day of week
      const dayMap: Record<string, number> = {
        Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0
      };

      let totalCals = 0;
      let maxCals = 0;
      let activeDays = new Set();

      data.forEach((workout) => {
        const date = new Date(workout.workout_date);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        const cals = workout.calories || 0;
        
        dayMap[day] += cals;
        totalCals += cals;
        maxCals = Math.max(maxCals, dayMap[day]);
        activeDays.add(date.toDateString());
      });

      const chartData = Object.entries(dayMap).map(([day, calories]) => ({
        day,
        calories,
      }));

      setWeeklyData(chartData);
      setStats({
        total: totalCals,
        average: Math.round(totalCals / 7),
        best: maxCals,
        active: activeDays.size,
      });
    }
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))'];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Fitness Progress Analytics</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="bar" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="space-y-4">
            <h3 className="text-center font-semibold text-lg">Weekly Calories Burned</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calories" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Total Calories</p>
                <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Daily Average</p>
                <p className="text-2xl font-bold">{stats.average}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Best Day</p>
                <p className="text-2xl font-bold">{stats.best}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Active Days</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="line" className="space-y-4">
            <h3 className="text-center font-semibold text-lg">Weekly Calories Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="calories" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Total Calories</p>
                <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Daily Average</p>
                <p className="text-2xl font-bold">{stats.average}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Best Day</p>
                <p className="text-2xl font-bold">{stats.best}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Active Days</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pie" className="space-y-4">
            <h3 className="text-center font-semibold text-lg">Weekly Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={weeklyData.filter(d => d.calories > 0)}
                  dataKey="calories"
                  nameKey="day"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Total Calories</p>
                <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Daily Average</p>
                <p className="text-2xl font-bold">{stats.average}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Best Day</p>
                <p className="text-2xl font-bold">{stats.best}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Active Days</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressAnalyticsModal;
