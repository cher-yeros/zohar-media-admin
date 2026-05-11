import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Eye,
  Play,
} from "lucide-react";
import { Loading } from "@/components/ui/loading";
import {
  GET_ANALYTICS_DATA,
  GET_BUSINESS_STATISTICS,
  GET_MEDIA_ITEMS,
} from "@/lib/graphql/queries";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useMemo } from "react";
import { useQuery } from "@apollo/client";

type AnalyticsRow = {
  id: string;
  date: string;
  visitors_today: number;
  visitors_this_week: number;
  visitors_this_month: number;
  visitor_trend: number;
  inquiries_total: number;
  inquiries_this_month: number;
  inquiry_trend: number;
  media_total_views: number;
};

type MediaType = "IMAGE" | "VIDEO";
type MediaItem = {
  id: string;
  title: string;
  type: MediaType;
  url: string;
  thumbnail_url?: string | null;
  tags: { id: string; tag_name: string }[];
};

export function Analytics() {
  const { data: analyticsData, loading: analyticsLoading } = useQuery(
    GET_ANALYTICS_DATA,
    { variables: { limit: 30, offset: 0 } },
  );
  const { loading: businessLoading } = useQuery(GET_BUSINESS_STATISTICS);
  const { data: mediaData, loading: mediaLoading } = useQuery(GET_MEDIA_ITEMS, {
    variables: { limit: 50, offset: 0 },
  });

  const rows: AnalyticsRow[] = analyticsData?.analyticsData?.items ?? [];
  const latest = rows[0];

  const deviceData = useMemo(
    () => [
      { name: "Desktop", value: 45, color: "hsl(var(--primary))" },
      { name: "Mobile", value: 35, color: "hsl(var(--secondary))" },
      { name: "Tablet", value: 20, color: "hsl(var(--accent))" },
    ],
    [],
  );

  const visitorData = useMemo(() => {
    const seven = rows.slice(0, 7).reverse();
    return seven.map((r) => ({
      name: new Date(r.date).toLocaleDateString(undefined, {
        weekday: "short",
      }),
      visitors: r.visitors_today ?? 0,
    }));
  }, [rows]);

  const inquiryTrendData = useMemo(() => {
    const points = rows.slice(0, 6).reverse();
    return points.map((r) => ({
      name: new Date(r.date).toLocaleDateString(undefined, {
        month: "short",
        day: "2-digit",
      }),
      inquiries: r.inquiries_this_month ?? 0,
    }));
  }, [rows]);

  const mediaEngagementData = useMemo(() => {
    const items: MediaItem[] = mediaData?.mediaItems?.items ?? [];
    const images = items.filter((i) => i.type === "IMAGE").length;
    const videos = items.filter((i) => i.type === "VIDEO").length;
    return [
      { name: "Images", views: images, engagement: 0 },
      { name: "Videos", views: videos, engagement: 0 },
    ];
  }, [mediaData]);

  const topPerformingMedia = useMemo(() => {
    const items: MediaItem[] = (mediaData?.mediaItems?.items ?? []).slice(0, 5);
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      thumbnail: item.thumbnail_url ?? item.url,
      tags: item.tags?.map((t) => t.tag_name) ?? [],
      views: 0,
      engagementRate: 0,
    }));
  }, [mediaData]);

  const topPerformingMediaView: Array<{
    id: string;
    title: string;
    type: MediaType;
    thumbnail: string;
    tags: string[];
    views: number;
    engagementRate: number;
  }> = topPerformingMedia;

  const isLoading = analyticsLoading || businessLoading || mediaLoading;
  if (isLoading) return <Loading type="page" />;

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Insights and performance metrics for your media business
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Website Visitors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(latest?.visitors_this_month ?? 0).toLocaleString()}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span
                className={`flex items-center ${
                  (latest?.visitor_trend ?? 0) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {(latest?.visitor_trend ?? 0) >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {(latest?.visitor_trend ?? 0) >= 0 ? "+" : ""}
                {latest?.visitor_trend ?? 0}%
              </span>
              <span>vs last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(latest?.media_total_views ?? 0).toLocaleString()}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>Based on stored analytics snapshots</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latest && latest.visitors_this_month
                ? `${(
                    (latest.inquiries_this_month / latest.visitors_this_month) *
                    100
                  ).toFixed(2)}%`
                : "—"}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>inquiries_this_month / visitors_this_month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Session Duration
            </CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>Not tracked yet</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Visitor Trends */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Weekly Visitor Trends</CardTitle>
            <CardDescription>
              Daily visitor count for the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visitors" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>How visitors access your site</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              {deviceData.map((device, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: device.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {device.name} ({device.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inquiry Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Inquiry Trends</CardTitle>
            <CardDescription>Monthly inquiry volume over time</CardDescription>
          </CardHeader>
          <CardContent>
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

        {/* Media Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Media Engagement</CardTitle>
            <CardDescription>
              Views and engagement by content type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mediaEngagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Media */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Media</CardTitle>
          <CardDescription>
            Most recent uploads (per-item views not tracked yet)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformingMediaView.map((item, index: number) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 p-4 border rounded-lg"
              >
                <div className="flex-shrink-0">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {item.type === "VIDEO" ? "Video" : "Image"} •{" "}
                    {item.tags.join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">—</div>
                  <div className="text-xs text-muted-foreground">—</div>
                </div>
                <Badge variant="outline">#{index + 1}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
