import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareProgressModalProps {
  open: boolean;
  onClose: () => void;
  workout: any;
}

const ShareProgressModal = ({ open, onClose, workout }: ShareProgressModalProps) => {
  const [options, setOptions] = useState({
    calories: true,
    duration: true,
    distance: true,
    avgHR: false,
    location: true,
    notes: false,
  });
  const { toast } = useToast();

  const handleCopyText = () => {
    let text = `${workout.exercise_type}\n`;
    text += `${new Date(workout.workout_date).toLocaleDateString()}\n\n`;
    
    if (options.calories) text += `Calories: ${workout.calories} kcal\n`;
    if (options.duration) text += `Duration: ${workout.duration} min\n`;
    if (options.distance && workout.distance) text += `Distance: ${workout.distance} km\n`;
    if (options.location && workout.location) text += `Location: ${workout.location}\n`;
    if (options.notes && workout.notes) text += `Notes: ${workout.notes}\n`;
    
    text += `\nFitTracker`;

    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
    });
  };

  const handleDownloadImage = () => {
    toast({
      title: "Feature coming soon!",
      description: "Image download will be available soon.",
    });
  };

  const previewText = `${workout.exercise_type}
${new Date(workout.workout_date).toLocaleDateString()}

${options.calories ? `Calories: ${workout.calories || 0} kcal\n` : ''}${options.duration ? `Duration: ${workout.duration} min\n` : ''}${options.distance && workout.distance ? `Distance: ${workout.distance} km\n` : ''}${options.location && workout.location ? `Location: ${workout.location}\n` : ''}
FitTracker`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Share Your Progress</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-4">
              <div className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground p-8 rounded-lg min-h-[300px] flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2 capitalize">{workout.exercise_type}</h3>
                  <p className="text-sm opacity-90 mb-6">{new Date(workout.workout_date).toLocaleDateString()}</p>
                  
                  <div className="space-y-2">
                    {options.calories && (
                      <p className="text-lg">
                        <span className="font-semibold">Calories: </span>
                        <span className="text-xl font-bold">{workout.calories || 0} kcal</span>
                      </p>
                    )}
                    {options.duration && (
                      <p className="text-lg">
                        <span className="font-semibold">Duration: </span>
                        <span className="text-xl font-bold">{workout.duration} min</span>
                      </p>
                    )}
                    {options.distance && workout.distance && (
                      <p className="text-lg">
                        <span className="font-semibold">Distance: </span>
                        <span className="text-xl font-bold">{workout.distance} km</span>
                      </p>
                    )}
                    {options.location && workout.location && (
                      <p className="text-lg">
                        <span className="font-semibold">Location: </span>
                        <span className="text-xl font-bold">{workout.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-right font-semibold mt-6 opacity-75">FitTracker</p>
              </div>
            </TabsContent>

            <TabsContent value="customize" className="mt-4 space-y-3">
              {Object.entries(options).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, [key]: checked as boolean })
                    }
                  />
                  <Label htmlFor={key} className="capitalize cursor-pointer">
                    {key === "avgHR" ? "Avg HR" : key}
                  </Label>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">Actions</h4>
              <div className="space-y-2">
                <Button onClick={handleDownloadImage} variant="default" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Image
                </Button>
                <Button onClick={handleCopyText} variant="secondary" className="w-full">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Text
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Share Directly</h4>
              <div className="flex gap-2">
                <Button
                  size="lg"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    const text = encodeURIComponent(previewText);
                    window.open(`https://wa.me/?text=${text}`, '_blank');
                  }}
                >
                  WhatsApp
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-pink-600 hover:bg-pink-700"
                  onClick={() => {
                    toast({
                      title: "Feature coming soon!",
                      description: "Instagram sharing will be available soon.",
                    });
                  }}
                >
                  Instagram
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
                  onClick={() => {
                    toast({
                      title: "Feature coming soon!",
                      description: "Snapchat sharing will be available soon.",
                    });
                  }}
                >
                  Snapchat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProgressModal;
