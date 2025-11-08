import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import UserStatsCard from "@/components/dashboard/UserStatsCard";
import StatsGrid from "@/components/dashboard/StatsGrid";
import RecentWorkouts from "@/components/dashboard/RecentWorkouts";
import TodayNutrition from "@/components/dashboard/TodayNutrition";
import RemindersSection from "@/components/dashboard/RemindersSection";
import AchievementsSection from "@/components/dashboard/AchievementsSection";
import QuickActions from "@/components/dashboard/QuickActions";
import AddWorkoutModal from "@/components/dashboard/AddWorkoutModal";
import LogMealModal from "@/components/dashboard/LogMealModal";
import ProgressAnalyticsModal from "@/components/dashboard/ProgressAnalyticsModal";
import AiCoachModal from "@/components/dashboard/AiCoachModal";
import ShareProgressModal from "@/components/dashboard/ShareProgressModal";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [showLogMeal, setShowLogMeal] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showAiCoach, setShowAiCoach] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if profile is complete
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profile || !profile.age || !profile.height) {
        navigate("/onboarding");
        return;
      }

      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <DashboardHeader onAddWorkout={() => setShowAddWorkout(true)} />
        <UserStatsCard userId={user.id} />
        <StatsGrid userId={user.id} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentWorkouts
            userId={user.id}
            onShare={(workout) => {
              setSelectedWorkout(workout);
              setShowShare(true);
            }}
          />
          <TodayNutrition userId={user.id} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RemindersSection userId={user.id} />
          <AchievementsSection userId={user.id} />
        </div>

        <QuickActions
          onLogWorkout={() => setShowAddWorkout(true)}
          onViewProgress={() => setShowProgress(true)}
          onLogMeal={() => setShowLogMeal(true)}
          onAskAiCoach={() => setShowAiCoach(true)}
        />
      </div>

      <AddWorkoutModal
        open={showAddWorkout}
        onClose={() => setShowAddWorkout(false)}
        userId={user.id}
      />

      <LogMealModal
        open={showLogMeal}
        onClose={() => setShowLogMeal(false)}
        userId={user.id}
      />

      <ProgressAnalyticsModal
        open={showProgress}
        onClose={() => setShowProgress(false)}
        userId={user.id}
      />

      <AiCoachModal
        open={showAiCoach}
        onClose={() => setShowAiCoach(false)}
        userId={user.id}
      />

      {selectedWorkout && (
        <ShareProgressModal
          open={showShare}
          onClose={() => {
            setShowShare(false);
            setSelectedWorkout(null);
          }}
          workout={selectedWorkout}
        />
      )}
    </div>
  );
};

export default Dashboard;
