import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ElementType;
}

export function StatCard({ title, value, description, trend, trendValue, icon: Icon }: StatCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-display">{value}</div>
        {(description || trendValue) && (
          <div className="flex items-center text-xs mt-1">
            {trend === "up" && <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />}
            {trend === "down" && <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />}
            {trend === "neutral" && <Minus className="mr-1 h-3 w-3 text-gray-500" />}
            
            {trendValue && (
              <span className={`mr-2 font-medium ${
                trend === "up" ? "text-green-500" : 
                trend === "down" ? "text-red-500" : "text-muted-foreground"
              }`}>
                {trendValue}
              </span>
            )}
            <span className="text-muted-foreground truncate">{description}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
