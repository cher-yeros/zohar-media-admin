import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Users,
  Eye,
  CheckCircle,
  FolderOpen,
  ArrowUpRight,
} from "lucide-react";
import {
  sampleInquiries,
  sampleAnalytics,
  inquiryTrendData,
} from "@/data/sample-data";
import { formatDate } from "@/lib/utils";
import {
  Area,
  AreaChart,
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
import { StatCard } from "@/components/dashboard/stat-card";
import { Link } from "react-router-dom";

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
      title: "Completed Projects",
      value: 230,
      change: "+15.2%",
      icon: CheckCircle,
      description: "Successfully delivered",
    },
    {
      title: "Happy Clients",
      value: "1,068",
      change: "+8.7%",
      icon: Users,
      description: "Satisfied customers",
    },
    {
      title: "Perspective Clients",
      value: 230,
      change: "+12.3%",
      icon: Eye,
      description: "Potential customers",
    },
    {
      title: "Website Visitors",
      value: sampleAnalytics.visitors.thisMonth.toLocaleString(),
      change: `+${sampleAnalytics.visitors.trend}%`,
      icon: ArrowUpRight,
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your media business.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AddMedia />
          <AddTestimony />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Overview */}
        <Card className="lg:col-span-8 overflow-hidden">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Monthly inquiry volume (last 7 months)
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={inquiryTrendData}>
                <defs>
                  <linearGradient
                    id="inquiriesFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="inquiries"
                  stroke="hsl(var(--primary))"
                  fill="url(#inquiriesFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Right rail */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Shortcuts to common tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Link
                to="/portfolio"
                className="flex items-center justify-between rounded-xl border bg-background/60 px-4 py-3 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FolderOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Manage portfolio</p>
                    <p className="text-xs text-muted-foreground">
                      Add/edit projects
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>

              <button
                type="button"
                onClick={() => handleQuickAction("Upload media")}
                className="text-left flex items-center justify-between rounded-xl border bg-background/60 px-4 py-3 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Image className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Upload new media</p>
                    <p className="text-xs text-muted-foreground">
                      Add photos/videos
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickAction("Add testimonial")}
                className="text-left flex items-center justify-between rounded-xl border bg-background/60 px-4 py-3 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Add testimonial</p>
                    <p className="text-xs text-muted-foreground">
                      Showcase client feedback
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>

          {/* At a glance */}
          <Card>
            <CardHeader>
              <CardTitle>At a glance</CardTitle>
              <CardDescription>Key metrics right now</CardDescription>
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
