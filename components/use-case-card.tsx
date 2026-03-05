import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type UseCaseCardProps = {
  title: string;
  description: string;
};

export function UseCaseCard({ title, description }: UseCaseCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Chiacon combines domain expertise with practical AI implementation to deliver measurable outcomes.
        </p>
      </CardContent>
    </Card>
  );
}
