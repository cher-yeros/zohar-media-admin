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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Settings as SettingsIcon,
  CheckCircle,
  Users,
  Eye,
  DollarSign,
  TrendingUp,
  Save,
  RefreshCw,
  BarChart3,
  Target,
  Award,
  Calendar,
} from "lucide-react";
import { sampleSettingsStats, SettingsStats } from "@/data/sample-data";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";

export function Settings() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<SettingsStats>(sampleSettingsStats);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Form state for editing stats
  const [formData, setFormData] = useState({
    completedProjects: stats.completedProjects,
    happyClients: stats.happyClients,
    perspectiveClients: stats.perspectiveClients,
    totalRevenue: stats.totalRevenue || 0,
    averageProjectValue: stats.averageProjectValue || 0,
  });

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSaveStats = () => {
    setStats({
      ...stats,
      ...formData,
    });
    setIsEditing(false);
    toast({
      title: "Settings updated",
      description: "Your statistics have been updated successfully.",
    });
  };

  const handleResetStats = () => {
    setFormData({
      completedProjects: stats.completedProjects,
      happyClients: stats.happyClients,
      perspectiveClients: stats.perspectiveClients,
      totalRevenue: stats.totalRevenue || 0,
      averageProjectValue: stats.averageProjectValue || 0,
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return <Loading type="page" />;
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your business statistics and settings.
          </p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleResetStats}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveStats}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <SettingsIcon className="h-4 w-4 mr-2" />
              Edit Settings
            </Button>
          )}
        </div>
      </div>

      {/* Main Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Projects
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isEditing ? (
                <Input
                  type="number"
                  value={formData.completedProjects}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      completedProjects: parseInt(e.target.value) || 0,
                    })
                  }
                  className="text-3xl font-bold border-none p-0 h-auto"
                />
              ) : (
                stats.completedProjects.toLocaleString()
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully delivered projects
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Happy Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isEditing ? (
                <Input
                  type="number"
                  value={formData.happyClients}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      happyClients: parseInt(e.target.value) || 0,
                    })
                  }
                  className="text-3xl font-bold border-none p-0 h-auto"
                />
              ) : (
                stats.happyClients.toLocaleString()
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Satisfied customers
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -translate-y-16 translate-x-16" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Perspective Clients
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isEditing ? (
                <Input
                  type="number"
                  value={formData.perspectiveClients}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      perspectiveClients: parseInt(e.target.value) || 0,
                    })
                  }
                  className="text-3xl font-bold border-none p-0 h-auto"
                />
              ) : (
                stats.perspectiveClients.toLocaleString()
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Potential customers
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16" />
        </Card>
      </div>

      {/* Additional Statistics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Revenue Statistics</span>
            </CardTitle>
            <CardDescription>Financial performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Revenue</span>
              <div className="text-right">
                {isEditing ? (
                  <Input
                    type="number"
                    value={formData.totalRevenue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalRevenue: parseInt(e.target.value) || 0,
                      })
                    }
                    className="text-right w-32"
                  />
                ) : (
                  <span className="text-lg font-bold">
                    ${stats.totalRevenue?.toLocaleString() || "0"}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Project Value</span>
              <div className="text-right">
                {isEditing ? (
                  <Input
                    type="number"
                    value={formData.averageProjectValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        averageProjectValue: parseInt(e.target.value) || 0,
                      })
                    }
                    className="text-right w-32"
                  />
                ) : (
                  <span className="text-lg font-bold">
                    ${stats.averageProjectValue?.toLocaleString() || "0"}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Revenue per Client</span>
              <span className="text-lg font-bold">
                $
                {stats.totalRevenue && stats.happyClients > 0
                  ? Math.round(
                      stats.totalRevenue / stats.happyClients
                    ).toLocaleString()
                  : "0"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Performance Metrics</span>
            </CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Project Success Rate</span>
              <Badge variant="default" className="text-sm">
                {stats.completedProjects > 0 ? "100%" : "0%"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Client Satisfaction</span>
              <Badge variant="default" className="text-sm">
                {stats.happyClients > 0 ? "100%" : "0%"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Conversion Rate</span>
              <Badge variant="outline" className="text-sm">
                {stats.perspectiveClients > 0
                  ? Math.round(
                      (stats.happyClients / stats.perspectiveClients) * 100
                    ) + "%"
                  : "0%"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Growth Potential</span>
              <Badge variant="secondary" className="text-sm">
                {stats.perspectiveClients > stats.happyClients
                  ? "High"
                  : "Stable"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Business Information</span>
          </CardTitle>
          <CardDescription>
            Update your business details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                defaultValue="Zohar Media"
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="videography">Videography</SelectItem>
                  <SelectItem value="media">Media Production</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Business Description</Label>
            <Textarea
              id="description"
              defaultValue="Professional media production company specializing in photography, videography, and creative content for businesses and individuals."
              disabled={!isEditing}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                defaultValue="https://zoharmedia.com"
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                defaultValue="contact@zoharmedia.com"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="publicStats">Public Statistics</Label>
                <p className="text-sm text-muted-foreground">
                  Show statistics on your public website
                </p>
              </div>
              <Switch id="publicStats" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoUpdate">Auto-update Statistics</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically update statistics from completed projects
                </p>
              </div>
              <Switch id="autoUpdate" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>Latest updates to your statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">Statistics updated</p>
                <p className="text-xs text-muted-foreground">
                  Last updated 2 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-blue-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">New project completed</p>
                <p className="text-xs text-muted-foreground">
                  Wedding photography project added 1 day ago
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-yellow-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">Client feedback received</p>
                <p className="text-xs text-muted-foreground">
                  New testimonial added 3 days ago
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
