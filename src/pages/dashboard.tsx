import { useMemo } from "react";
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
import { AddMedia } from "@/components/forms/add-media";
import { AddTestimony } from "@/components/forms/add-testimony";
import { StatCard } from "@/components/dashboard/stat-card";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import {
  GET_ANALYTICS_DATA,
  GET_BUSINESS_STATISTICS,
  GET_INQUIRIES,
  GET_TESTIMONIALS,
} from "@/lib/graphql/queries";

type InquiryRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  inquiry_date: string;
  status: string;
};

export function Dashboard() {
  const { data: statsData, loading: statsLoading } = useQuery(
    GET_BUSINESS_STATISTICS,
  );
  const { data: analyticsData, loading: analyticsLoading } = useQuery(
    GET_ANALYTICS_DATA,
    { variables: { limit: 30, offset: 0 } },
  );
  const { data: recentInquiriesData, loading: recentLoading } = useQuery(
    GET_INQUIRIES,
    { variables: { limit: 5, offset: 0 } },
  );
  const { data: unreadInquiriesData, loading: unreadLoading } = useQuery(
    GET_INQUIRIES,
    { variables: { status: "UNREAD", limit: 1, offset: 0 } },
  );
  const { data: pendingTestimonialsData, loading: pendingLoading } = useQuery(
    GET_TESTIMONIALS,
    { variables: { status: "PENDING", limit: 1, offset: 0 } },
  );

  const loading =
    statsLoading ||
    analyticsLoading ||
    recentLoading ||
    unreadLoading ||
    pendingLoading;

  const stats = statsData?.businessStatistics;
  const analyticsRows: {
    date: string;
    inquiries_this_month: number;
    visitors_today: number;
    visitors_this_month: number;
    visitor_trend: number;
    media_total_views: number;
  }[] = analyticsData?.analyticsData?.items ?? [];
  const latestAnalytics = analyticsRows[0];

  const recentInquiries: InquiryRow[] =
    recentInquiriesData?.inquiries?.items ?? [];
  const unreadTotal = unreadInquiriesData?.inquiries?.total ?? 0;
  const pendingTestimonialsTotal =
    pendingTestimonialsData?.testimonials?.total ?? 0;

  const inquiryChartData = useMemo(() => {
    const seven = analyticsRows.slice(0, 7).reverse();
    return seven.map((r) => ({
      name: new Date(r.date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      inquiries: r.inquiries_this_month ?? 0,
    }));
  }, [analyticsRows]);

  const visitorChangeStr = useMemo(() => {
    const t = latestAnalytics?.visitor_trend;
    if (t === undefined || t === null) return "—";
    return `${t >= 0 ? "+" : ""}${t}%`;
  }, [latestAnalytics]);

  const statCards = useMemo(() => {
    const completed = stats?.completed_projects ?? 0;
    const happy = stats?.happy_clients ?? 0;
    const perspective = stats?.perspective_clients ?? 0;
    const visitorsMonth = latestAnalytics?.visitors_this_month ?? 0;
    return [
      {
        title: "Completed Projects",
        value: completed.toLocaleString(),
        change: "Business stats",
        icon: CheckCircle,
        description: "From settings",
      },
      {
        title: "Happy Clients",
        value: happy.toLocaleString(),
        change: "Business stats",
        icon: Users,
        description: "From settings",
      },
      {
        title: "Perspective Clients",
        value: perspective.toLocaleString(),
        change: "Business stats",
        icon: Eye,
        description: "From settings",
      },
      {
        title: "Website Visitors",
        value: visitorsMonth.toLocaleString(),
        change: visitorChangeStr,
        icon: ArrowUpRight,
        description: "This month (analytics)",
      },
    ];
  }, [stats, latestAnalytics, visitorChangeStr]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNREAD":
        return "destructive";
      case "RESPONDED":
        return "default";
      case "RESOLVED":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (loading || !stats) {
    return <Loading type="page" />;
  }

  return (
    <div className="space-y-6 fade-in">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
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
        <Card className="lg:col-span-8 overflow-hidden">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Inquiry volume from recent analytics snapshots
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {inquiryChartData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-12 text-center">
                No analytics snapshots yet. Data will appear after analytics
                records exist.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={inquiryChartData}>
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
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-4 space-y-6">
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

              <Link
                to="/media"
                className="flex items-center justify-between rounded-xl border bg-background/60 px-4 py-3 hover:bg-accent/50 transition-colors"
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
              </Link>

              <Link
                to="/testimonials"
                className="flex items-center justify-between rounded-xl border bg-background/60 px-4 py-3 hover:bg-accent/50 transition-colors"
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
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>At a glance</CardTitle>
              <CardDescription>Key metrics right now</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Media Views (snapshot)</span>
                </div>
                <span className="font-semibold">
                  {(latestAnalytics?.media_total_views ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Unread Inquiries</span>
                </div>
                <span className="font-semibold">{unreadTotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Pending testimonials</span>
                </div>
                <span className="font-semibold">
                  {pendingTestimonialsTotal}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Today's Visitors</span>
                </div>
                <span className="font-semibold">
                  {(latestAnalytics?.visitors_today ?? 0).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Recent Inquiries</CardTitle>
            <CardDescription>
              Latest customer inquiries and their status
            </CardDescription>
          </div>
          <Link to="/inquiries">
            <span className="text-sm text-primary hover:underline">
              View all
            </span>
          </Link>
        </CardHeader>
        <CardContent>
          {recentInquiries.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No inquiries yet.
            </p>
          ) : (
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
                    <TableCell className="font-medium">
                      {inquiry.name}
                    </TableCell>
                    <TableCell>{inquiry.email}</TableCell>
                    <TableCell>{inquiry.subject}</TableCell>
                    <TableCell>{formatDate(inquiry.inquiry_date)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(inquiry.status)}>
                        {inquiry.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
