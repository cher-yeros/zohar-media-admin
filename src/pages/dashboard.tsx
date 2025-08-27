import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MessageSquare,
  Image,
  Star,
  Upload,
  Plus,
  TrendingUp,
  Users,
  Eye,
} from "lucide-react";
import {
  sampleInquiries,
  sampleAnalytics,
  inquiryTrendData,
} from "@/data/sample-data";
import { formatDate } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";
import { AddMedia } from "@/components/forms/add-media";
import { AddTestimony } from "@/components/forms/add-testimony";

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const recentInquiries = sampleInquiries.slice(0, 5);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleQuickAction = (action: string) => {
    toast({
      title: "Action triggered",
      description: `${action} functionality would be implemented here.`,
    });
  };

  if (isLoading) {
    return <Loading type="page" />;
  }
  const stats = [
    {
      title: "Total Inquiries",
      value: sampleAnalytics.inquiries.total,
      change: `+${sampleAnalytics.inquiries.trend}%`,
      icon: MessageSquare,
      description: "This month",
    },
    {
      title: "Media Items",
      value: 156,
      change: "+12.3%",
      icon: Image,
      description: "Total uploaded",
    },
    {
      title: "Testimonials",
      value: 24,
      change: "+5.2%",
      icon: Star,
      description: "Approved",
    },
    {
      title: "Website Visitors",
      value: sampleAnalytics.visitors.thisMonth.toLocaleString(),
      change: `+${sampleAnalytics.visitors.trend}%`,
      icon: Users,
      description: "This month",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "destructive";
      case "responded":
        return "default";
      case "resolved":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your media business.
          </p>
        </div>
        <div className="flex space-x-3">
          <AddMedia />
          <AddTestimony />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className="flex items-center text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </span>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Inquiry Trends Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Inquiry Trends</CardTitle>
            <CardDescription>
              Monthly inquiry volume over the last 7 months
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={inquiryTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="inquiries"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Media Views</span>
              </div>
              <span className="font-semibold">
                {sampleAnalytics.media.totalViews.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Unread Inquiries</span>
              </div>
              <span className="font-semibold">
                {sampleInquiries.filter((i) => i.status === "unread").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Pending Reviews</span>
              </div>
              <span className="font-semibold">3</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Today's Visitors</span>
              </div>
              <span className="font-semibold">
                {sampleAnalytics.visitors.today}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
          <CardDescription>
            Latest customer inquiries and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentInquiries.map((inquiry) => (
                <TableRow
                  key={inquiry.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{inquiry.name}</TableCell>
                  <TableCell>{inquiry.email}</TableCell>
                  <TableCell>{inquiry.subject}</TableCell>
                  <TableCell>{formatDate(inquiry.date)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(inquiry.status)}>
                      {inquiry.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
