import { Card } from "@/components/ui/card";
import { Plus, Activity, UtensilsCrossed, Sparkles } from "lucide-react";

interface QuickActionsProps {
  onLogWorkout: () => void;
  onViewProgress: () => void;
  onLogMeal: () => void;
  onAskAiCoach: () => void;
}

const QuickActions = ({ onLogWorkout, onViewProgress, onLogMeal, onAskAiCoach }: QuickActionsProps) => {
  const actions = [
    {
      icon: Plus,
      title: "Log Workout",
      description: "Record a session",
      color: "text-primary",
      onClick: onLogWorkout,
    },
    {
      icon: Activity,
      title: "View Progress",
      description: "See your analytics",
      color: "text-info",
      onClick: onViewProgress,
    },
    {
      icon: UtensilsCrossed,
      title: "Log Meal",
      description: "Track your nutrition",
      color: "text-warning",
      onClick: onLogMeal,
    },
    {
      icon: Sparkles,
      title: "Ask AI Coach",
      description: "Get fitness advice",
      color: "text-success",
      onClick: onAskAiCoach,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Card
          key={action.title}
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={action.onClick}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className={`p-4 rounded-full bg-secondary ${action.color}`}>
              <action.icon className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-semibold">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QuickActions;
