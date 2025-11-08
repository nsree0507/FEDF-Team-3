import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate("/dashboard");
      }
    };

    checkUser();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="text-center space-y-8 p-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Dumbbell className="h-16 w-16 text-primary" />
          <h1 className="text-6xl font-bold">
            Fit<span className="text-primary">Tracker</span>
          </h1>
        </div>
        <p className="text-2xl text-muted-foreground max-w-2xl">
          Your personal fitness companion. Track workouts, monitor nutrition, and achieve your health goals.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Button size="lg" onClick={() => navigate("/auth")}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
