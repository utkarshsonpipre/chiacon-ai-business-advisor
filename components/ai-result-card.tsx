import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type UseCaseInsight } from "@/lib/types";

type AiResultCardProps = {
  result: UseCaseInsight;
  className?: string;
  title?: string;
};

export function AiResultCard({ result, className, title = "Generated AI Opportunities" }: AiResultCardProps) {
  return (
    <Card className={cn("animate-fade-in border-primary/20", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Problem Summary</h3>
          <p className="mt-1 text-sm text-muted-foreground">{result.problemSummary}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Opportunities</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {result.aiOpportunities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Expected Business Impact</h3>
          <p className="mt-1 text-sm text-muted-foreground">{result.expectedBusinessImpact}</p>
        </div>
      </CardContent>
    </Card>
  );
}
