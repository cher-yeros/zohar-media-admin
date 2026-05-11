import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  UPDATE_BUSINESS_STATISTICS,
  UPDATE_SYSTEM_SETTINGS,
} from "@/lib/graphql/mutations";
import {
  GET_ACTIVITY_LOGS,
  GET_BUSINESS_STATISTICS,
  GET_SYSTEM_SETTINGS,
} from "@/lib/graphql/queries";
import { formatDateTime } from "@/lib/utils";
import { useMutation, useQuery } from "@apollo/client";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  DollarSign,
  Eye,
  RefreshCw,
  Save,
  Settings as SettingsIcon,
  Target,
  Users,
} from "lucide-react";
import { useCallback, useState } from "react";

type Theme = "LIGHT" | "DARK";

export function Settings() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: statsData,
    loading: statsLoading,
    refetch: refetchStats,
  } = useQuery(GET_BUSINESS_STATISTICS);
  const {
    data: systemData,
    loading: systemLoading,
    refetch: refetchSystem,
  } = useQuery(GET_SYSTEM_SETTINGS);
  const { data: logsData, loading: logsLoading } = useQuery(GET_ACTIVITY_LOGS, {
    variables: { limit: 15, offset: 0 },
  });

  const [updateBusinessStatistics, { loading: savingStats }] = useMutation(
    UPDATE_BUSINESS_STATISTICS,
  );
  const [updateSystemSettings, { loading: savingSystem }] = useMutation(
    UPDATE_SYSTEM_SETTINGS,
  );

  const stats = statsData?.businessStatistics;
  const settings = systemData?.systemSettings;

  const [statsForm, setStatsForm] = useState({
    completedProjects: 0,
    happyClients: 0,
    perspectiveClients: 0,
    totalRevenue: 0,
    averageProjectValue: 0,
    isPublic: true,
    autoUpdate: true,
  });

  const [businessForm, setBusinessForm] = useState({
    businessName: "",
    businessDescription: "",
    industry: "",
    websiteUrl: "",
    contactEmail: "",
    theme: "LIGHT" as Theme,
  });

  const beginEdit = useCallback(() => {
    if (stats) {
      setStatsForm({
        completedProjects: stats.completed_projects,
        happyClients: stats.happy_clients,
        perspectiveClients: stats.perspective_clients,
        totalRevenue: Number(stats.total_revenue) || 0,
        averageProjectValue: Number(stats.average_project_value) || 0,
        isPublic: stats.is_public ?? true,
        autoUpdate: stats.auto_update ?? true,
      });
    }
    if (settings) {
      setBusinessForm({
        businessName: settings.business_name ?? "",
        businessDescription: settings.business_description ?? "",
        industry: settings.industry ?? "",
        websiteUrl: settings.website_url ?? "",
        contactEmail: settings.contact_email ?? "",
        theme: (settings.theme === "DARK" ? "DARK" : "LIGHT") as Theme,
      });
    }
    setIsEditing(true);
  }, [stats, settings]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleSave = async () => {
    try {
      const statsResult = await updateBusinessStatistics({
        variables: {
          completed_projects: statsForm.completedProjects,
          happy_clients: statsForm.happyClients,
          perspective_clients: statsForm.perspectiveClients,
          total_revenue: statsForm.totalRevenue,
          average_project_value: statsForm.averageProjectValue,
          is_public: statsForm.isPublic,
          auto_update: statsForm.autoUpdate,
        },
      });

      const sysResult = await updateSystemSettings({
        variables: {
          business_name: businessForm.businessName.trim() || undefined,
          business_description:
            businessForm.businessDescription.trim() || undefined,
          industry: businessForm.industry.trim() || undefined,
          website_url: businessForm.websiteUrl.trim() || undefined,
          contact_email: businessForm.contactEmail.trim() || undefined,
          theme: businessForm.theme,
        },
      });

      if (
        statsResult.data?.updateBusinessStatistics?.success &&
        sysResult.data?.updateSystemSettings?.success
      ) {
        await Promise.all([refetchStats(), refetchSystem()]);
        setIsEditing(false);
        toast({
          title: "Settings saved",
          description: "Business statistics and information were updated.",
        });
      } else {
        throw new Error(
          statsResult.data?.updateBusinessStatistics?.message ||
            sysResult.data?.updateSystemSettings?.message ||
            "Save failed",
        );
      }
    } catch (e) {
      toast({
        title: "Error",
        description:
          e instanceof Error ? e.message : "Could not save settings.",
        variant: "destructive",
      });
    }
  };

  const loading = statsLoading || systemLoading;
  const saving = savingStats || savingSystem;

  if (loading || !stats || !settings) {
    return <Loading type="page" />;
  }

  const displayStats = isEditing
    ? statsForm
    : {
        completedProjects: stats.completed_projects,
        happyClients: stats.happy_clients,
        perspectiveClients: stats.perspective_clients,
        totalRevenue: Number(stats.total_revenue) || 0,
        averageProjectValue: Number(stats.average_project_value) || 0,
        isPublic: stats.is_public,
        autoUpdate: stats.auto_update,
      };

  const displayBusiness = isEditing
    ? businessForm
    : {
        businessName: settings.business_name,
        businessDescription: settings.business_description ?? "",
        industry: settings.industry ?? "",
        websiteUrl: settings.website_url ?? "",
        contactEmail: settings.contact_email ?? "",
        theme: (settings.theme === "DARK" ? "DARK" : "LIGHT") as Theme,
      };

  const activityItems = logsData?.activityLogs?.items ?? [];

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage business stats, preferences, and public visibility.
          </p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={cancelEdit} disabled={saving}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button className="shadow-sm" onClick={beginEdit}>
              <SettingsIcon className="h-4 w-4 mr-2" />
              Edit Settings
            </Button>
          )}
        </div>
      </div>

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
                  min={0}
                  value={statsForm.completedProjects}
                  onChange={(e) =>
                    setStatsForm({
                      ...statsForm,
                      completedProjects: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="text-3xl font-bold border-none p-0 h-auto shadow-none focus-visible:ring-0"
                />
              ) : (
                displayStats.completedProjects.toLocaleString()
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
                  min={0}
                  value={statsForm.happyClients}
                  onChange={(e) =>
                    setStatsForm({
                      ...statsForm,
                      happyClients: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="text-3xl font-bold border-none p-0 h-auto shadow-none focus-visible:ring-0"
                />
              ) : (
                displayStats.happyClients.toLocaleString()
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
                  min={0}
                  value={statsForm.perspectiveClients}
                  onChange={(e) =>
                    setStatsForm({
                      ...statsForm,
                      perspectiveClients: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="text-3xl font-bold border-none p-0 h-auto shadow-none focus-visible:ring-0"
                />
              ) : (
                displayStats.perspectiveClients.toLocaleString()
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Potential customers
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16" />
        </Card>
      </div>

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
                    min={0}
                    step="0.01"
                    value={statsForm.totalRevenue}
                    onChange={(e) =>
                      setStatsForm({
                        ...statsForm,
                        totalRevenue: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="text-right w-40"
                  />
                ) : (
                  <span className="text-lg font-bold">
                    ${displayStats.totalRevenue.toLocaleString()}
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
                    min={0}
                    step="0.01"
                    value={statsForm.averageProjectValue}
                    onChange={(e) =>
                      setStatsForm({
                        ...statsForm,
                        averageProjectValue: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="text-right w-40"
                  />
                ) : (
                  <span className="text-lg font-bold">
                    ${displayStats.averageProjectValue.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Revenue per Client</span>
              <span className="text-lg font-bold">
                $
                {displayStats.totalRevenue > 0 && displayStats.happyClients > 0
                  ? Math.round(
                      displayStats.totalRevenue / displayStats.happyClients,
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
                {displayStats.completedProjects > 0 ? "100%" : "0%"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Client Satisfaction</span>
              <Badge variant="default" className="text-sm">
                {displayStats.happyClients > 0 ? "100%" : "0%"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Conversion Rate</span>
              <Badge variant="outline" className="text-sm">
                {displayStats.perspectiveClients > 0
                  ? Math.round(
                      (displayStats.happyClients /
                        displayStats.perspectiveClients) *
                        100,
                    ) + "%"
                  : "0%"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Growth Potential</span>
              <Badge variant="secondary" className="text-sm">
                {displayStats.perspectiveClients > displayStats.happyClients
                  ? "High"
                  : "Stable"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Business Information</span>
          </CardTitle>
          <CardDescription>
            Update your business details and preferences (saved to the database)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={
                  isEditing
                    ? businessForm.businessName
                    : displayBusiness.businessName
                }
                onChange={(e) =>
                  setBusinessForm({
                    ...businessForm,
                    businessName: e.target.value,
                  })
                }
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                placeholder="e.g. photography, media production"
                value={
                  isEditing ? businessForm.industry : displayBusiness.industry
                }
                onChange={(e) =>
                  setBusinessForm({
                    ...businessForm,
                    industry: e.target.value,
                  })
                }
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Business Description</Label>
            <Textarea
              id="description"
              value={
                isEditing
                  ? businessForm.businessDescription
                  : displayBusiness.businessDescription
              }
              onChange={(e) =>
                setBusinessForm({
                  ...businessForm,
                  businessDescription: e.target.value,
                })
              }
              disabled={!isEditing}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://"
                value={
                  isEditing
                    ? businessForm.websiteUrl
                    : displayBusiness.websiteUrl
                }
                onChange={(e) =>
                  setBusinessForm({
                    ...businessForm,
                    websiteUrl: e.target.value,
                  })
                }
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={
                  isEditing
                    ? businessForm.contactEmail
                    : displayBusiness.contactEmail
                }
                onChange={(e) =>
                  setBusinessForm({
                    ...businessForm,
                    contactEmail: e.target.value,
                  })
                }
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="theme">Admin theme preference</Label>
              <Select
                value={isEditing ? businessForm.theme : displayBusiness.theme}
                onValueChange={(v) =>
                  setBusinessForm({
                    ...businessForm,
                    theme: v as Theme,
                  })
                }
                disabled={!isEditing}
              >
                <SelectTrigger id="theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LIGHT">Light</SelectItem>
                  <SelectItem value="DARK">Dark</SelectItem>
                </SelectContent>
              </Select>
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
              <Switch
                id="publicStats"
                checked={isEditing ? statsForm.isPublic : displayStats.isPublic}
                onCheckedChange={(checked) =>
                  setStatsForm({ ...statsForm, isPublic: checked })
                }
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoUpdate">Auto-update Statistics</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically update statistics from completed projects
                </p>
              </div>
              <Switch
                id="autoUpdate"
                checked={
                  isEditing ? statsForm.autoUpdate : displayStats.autoUpdate
                }
                onCheckedChange={(checked) =>
                  setStatsForm({ ...statsForm, autoUpdate: checked })
                }
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>
            Latest actions from the activity log
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <p className="text-sm text-muted-foreground">Loading activity…</p>
          ) : activityItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No activity recorded yet.
            </p>
          ) : (
            <div className="space-y-4">
              {activityItems.map(
                (
                  log: {
                    id: string;
                    action: string;
                    entity_type: string;
                    description?: string | null;
                    createdAt: string;
                    user?: {
                      first_name?: string | null;
                      last_name?: string | null;
                    } | null;
                  },
                  index: number,
                ) => (
                  <div key={log.id} className="flex items-center space-x-3">
                    <div
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        index % 3 === 0
                          ? "bg-green-500"
                          : index % 3 === 1
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {log.description ||
                          `${log.action} • ${log.entity_type}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(log.createdAt)}
                        {log.user
                          ? ` · ${log.user.first_name ?? ""} ${log.user.last_name ?? ""}`.trim()
                          : ""}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
