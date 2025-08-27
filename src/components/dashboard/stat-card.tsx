import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: LucideIcon;
  description: string;
}

export const StatCard = React.memo(
  ({ title, value, change, icon: Icon, description }: StatCardProps) => {
    return (
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span className="flex items-center text-green-600">{change}</span>
            <span>{description}</span>
          </div>
        </CardContent>
      </Card>
    );
  }
);

StatCard.displayName = "StatCard";
