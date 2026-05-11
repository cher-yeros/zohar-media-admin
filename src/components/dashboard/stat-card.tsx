import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: LucideIcon;
  description: string;
}

export const StatCard = React.memo(
  ({ title, value, change, icon: Icon, description }: StatCardProps) => {
    const isDown = change.trim().startsWith("-");
    const TrendIcon = isDown ? TrendingDown : TrendingUp;
    return (
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span
              className={cn(
                "flex items-center gap-1",
                isDown ? "text-destructive" : "text-emerald-600",
              )}
            >
              <TrendIcon className="h-3 w-3" />
              {change}
            </span>
            <span>{description}</span>
          </div>
        </CardContent>
      </Card>
    );
  },
);

StatCard.displayName = "StatCard";
