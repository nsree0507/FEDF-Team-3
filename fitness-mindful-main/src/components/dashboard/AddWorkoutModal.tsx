import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface AddWorkoutModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const AddWorkoutModal = ({ open, onClose, userId }: AddWorkoutModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    exercise_type: "",
    duration: "",
    distance: "",
    intensity: "",
    location: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate estimated calories based on duration and intensity
      const durationNum = parseInt(formData.duration);
      const intensityMultiplier = formData.intensity === "high" ? 10 : formData.intensity === "medium" ? 7 : 5;
      const estimatedCalories = durationNum * intensityMultiplier;

      const { error } = await supabase.from("workouts").insert({
        user_id: userId,
        exercise_type: formData.exercise_type,
        duration: parseInt(formData.duration),
        distance: formData.distance ? parseFloat(formData.distance) : null,
        intensity: formData.intensity,
        location: formData.location,
        notes: formData.notes,
        calories: estimatedCalories,
      });

      if (error) throw error;

      toast.success("Workout added successfully!");
      setFormData({
        exercise_type: "",
        duration: "",
        distance: "",
        intensity: "",
        location: "",
        notes: "",
      });
      onClose();
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to add workout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Workout</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exercise_type">Exercise Type</Label>
            <Select
              value={formData.exercise_type}
              onValueChange={(value) => setFormData({ ...formData, exercise_type: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Exercise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="cycling">Cycling</SelectItem>
                <SelectItem value="swimming">Swimming</SelectItem>
                <SelectItem value="strength">Strength Training</SelectItem>
                <SelectItem value="yoga">Yoga</SelectItem>
                <SelectItem value="walking">Walking</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="45"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="distance">Distance (km) - Optional</Label>
            <Input
              id="distance"
              type="number"
              step="0.1"
              placeholder="5.0"
              value={formData.distance}
              onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="intensity">Intensity</Label>
            <Select
              value={formData.intensity}
              onValueChange={(value) => setFormData({ ...formData, intensity: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Intensity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. Home Gym, Park"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="How did it feel?"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Adding..." : "Add Workout"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkoutModal;
