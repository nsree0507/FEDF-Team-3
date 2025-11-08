import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AchievementsSectionProps {
  userId: string;
}

const AchievementsSection = ({ userId }: AchievementsSectionProps) => {
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      const { data } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", userId)
        .order("earned_date", { ascending: false })
        .limit(4);

      setAchievements(data || []);
    };

    fetchAchievements();
  }, [userId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {achievements.length > 0 ? (
          achievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
              <div className="text-4xl">{achievement.icon || "🏆"}</div>
              <div>
                <h4 className="font-semibold">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No achievements yet - keep working!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementsSection;
