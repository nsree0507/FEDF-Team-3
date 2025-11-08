import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Dumbbell, Activity } from "lucide-react";

interface RemindersSectionProps {
  userId: string;
}

const iconMap: Record<string, any> = {
  running: Activity,
  strength: Dumbbell,
  yoga: Activity,
};

const colorMap: Record<string, string> = {
  running: "text-orange-500",
  strength: "text-destructive",
  yoga: "text-purple-500",
};

const RemindersSection = ({ userId }: RemindersSectionProps) => {
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    const fetchReminders = async () => {
      const { data } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("scheduled_day");

      setReminders(data || []);
    };

    fetchReminders();
  }, [userId]);

  const handleDelete = async (id: string) => {
    await supabase.from("reminders").delete().eq("id", id);
    setReminders(reminders.filter((r) => r.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Reminders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {reminders.length > 0 ? (
          reminders.map((reminder) => {
            const Icon = iconMap[reminder.exercise_type] || Dumbbell;
            const color = colorMap[reminder.exercise_type] || "text-primary";

            return (
              <div key={reminder.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-secondary ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold capitalize">{reminder.exercise_type}</h4>
                    <p className="text-sm text-muted-foreground">
                      {reminder.scheduled_day} at {reminder.scheduled_time}
                    </p>
                    {reminder.notes && (
                      <p className="text-sm italic text-muted-foreground">"{reminder.notes}"</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(reminder.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No active reminders</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RemindersSection;
