import { Button } from "@/components/ui/button";
import { Dumbbell, Plus, Sparkles, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DashboardHeaderProps {
  onAddWorkout: () => void;
}

const DashboardHeader = ({ onAddWorkout }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Dumbbell className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">
          Fit<span className="text-primary">Tracker</span>
        </h1>
      </div>
      <div className="flex gap-2">
        <Button onClick={onAddWorkout} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Workout
        </Button>
        <Button variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4" />
          AI Insights
        </Button>
        <Button variant="ghost" size="icon" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
