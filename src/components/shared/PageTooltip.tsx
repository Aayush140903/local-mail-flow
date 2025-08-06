import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HelpCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Feature {
  title: string;
  description: string;
  steps?: string[];
}

interface PageTooltipProps {
  title: string;
  description: string;
  features: Feature[];
  videoUrl?: string;
}

export function PageTooltip({ title, description, features, videoUrl }: PageTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{title}</DialogTitle>
              <DialogDescription className="mt-2">
                {description}
              </DialogDescription>
            </div>
            <Badge variant="secondary" className="ml-4">Help Guide</Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            {videoUrl && (
              <div className="rounded-lg overflow-hidden border">
                <iframe
                  src={videoUrl}
                  className="w-full h-64"
                  allowFullScreen
                  title={`${title} Tutorial`}
                />
              </div>
            )}

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-sm text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {feature.description}
                  </p>
                  {feature.steps && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Steps:</p>
                      <ol className="text-xs space-y-1 pl-4">
                        {feature.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="list-decimal text-muted-foreground">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">💡 Pro Tips</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Save your work frequently to avoid losing progress</li>
                <li>• Use keyboard shortcuts for faster navigation</li>
                <li>• Test your campaigns with small audiences first</li>
                <li>• Check analytics regularly to optimize performance</li>
              </ul>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}