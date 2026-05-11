import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  CREATE_PORTFOLIO_ITEM,
  DELETE_PORTFOLIO_ITEM,
  UPDATE_PORTFOLIO_ITEM,
} from "@/lib/graphql/mutations";
import {
  GET_PORTFOLIO_CATEGORIES,
  GET_PORTFOLIO_ITEMS,
  GET_TEAM_MEMBERS,
} from "@/lib/graphql/queries";
import {
  CreatePortfolioItemInput,
  PortfolioCategory,
  PortfolioItem,
  PortfolioItemFormData,
  PortfolioItemStatus,
  UpdatePortfolioItemInput,
} from "@/lib/types/portfolio";
import { formatDate } from "@/lib/utils";
import { useMutation, useQuery } from "@apollo/client";
import {
  CheckCircle,
  Clock,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Image as ImageIcon,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";

function PortfolioCardPreview({ item }: { item: PortfolioItem }) {
  if (item.thumbnail_url) {
    return (
      <img
        src={item.thumbnail_url}
        alt={item.title}
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <ImageIcon className="h-12 w-12 text-muted-foreground" />
    </div>
  );
}

export function Portfolio() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [selectedPortfolioItem, setSelectedPortfolioItem] =
    useState<PortfolioItem | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<PortfolioItemFormData>({
    title: "",
    description: "",
    categoryId: "",
    client: "",
    status: PortfolioItemStatus.COMPLETED,
    tags: [],
    teamMembers: [],
    featured: false,
    technologies: [],
    projectUrl: "",
    testimonial: "",
    projectDate: new Date().toISOString().split("T")[0],
    thumbnailUrl: "",
  });

  // Apollo Client queries
  const {
    data: portfolioData,
    loading: portfolioLoading,
    refetch: refetchPortfolioItems,
  } = useQuery(GET_PORTFOLIO_ITEMS, {
    variables: {
      category_id: filterCategory === "all" ? null : filterCategory,
      status:
        filterStatus === "all"
          ? null
          : filterStatus.replace("-", "_").toUpperCase(),
      limit: 100,
      offset: 0,
    },
  });

  const { data: categoriesData, loading: categoriesLoading } = useQuery(
    GET_PORTFOLIO_CATEGORIES,
  );
  const { data: teamData, loading: teamLoading } = useQuery(GET_TEAM_MEMBERS);

  // Apollo Client mutations
  const [createPortfolioItem] = useMutation(CREATE_PORTFOLIO_ITEM);
  const [updatePortfolioItem] = useMutation(UPDATE_PORTFOLIO_ITEM);
  const [deletePortfolioItem] = useMutation(DELETE_PORTFOLIO_ITEM);

  const portfolioItems = portfolioData?.portfolioItems?.items || [];
  const categories = categoriesData?.portfolioCategories || [];
  // Form is concise; team members are not used here.
  void teamData;
  const isLoading = portfolioLoading || categoriesLoading || teamLoading;

  const handleAddItem = async () => {
    try {
      const input: CreatePortfolioItemInput = {
        title: formData.title,
        description: formData.description,
        category_id: formData.categoryId || undefined,
        thumbnail_url: formData.thumbnailUrl || undefined,
        client_name: formData.client || undefined,
        project_date: formData.projectDate,
        status: formData.status,
        featured: formData.featured,
        project_url: formData.projectUrl || undefined,
        tags: formData.tags,
      };

      const result = await createPortfolioItem({
        variables: input,
      });

      if (result.data?.createPortfolioItem?.success) {
        setIsAddDialogOpen(false);
        resetForm();
        refetchPortfolioItems();
        toast({
          title: "Portfolio item added",
          description: `${formData.title} has been added to the portfolio.`,
        });
      } else {
        throw new Error(
          result.data?.createPortfolioItem?.message ||
            "Failed to create portfolio item",
        );
      }
    } catch (error) {
      console.error("Error creating portfolio item:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add portfolio item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      categoryId: item.category?.id || "",
      client: item.client_name || "",
      status: item.status,
      tags: item.tags.map((tag) => tag.tag_name),
      teamMembers: [],
      featured: item.featured,
      technologies: [],
      projectUrl: item.project_url || "",
      testimonial: "",
      projectDate: item.project_date.split("T")[0],
      thumbnailUrl: item.thumbnail_url || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      const input: UpdatePortfolioItemInput = {
        title: formData.title,
        description: formData.description,
        category_id: formData.categoryId || undefined,
        thumbnail_url: formData.thumbnailUrl || undefined,
        client_name: formData.client || undefined,
        project_date: formData.projectDate,
        status: formData.status,
        featured: formData.featured,
        project_url: formData.projectUrl || undefined,
        tags: formData.tags,
      };

      const result = await updatePortfolioItem({
        variables: {
          id: editingItem.id,
          ...input,
        },
      });

      if (result.data?.updatePortfolioItem?.success) {
        setIsEditDialogOpen(false);
        setEditingItem(null);
        resetForm();
        refetchPortfolioItems();
        toast({
          title: "Portfolio item updated",
          description: `${formData.title} has been updated.`,
        });
      } else {
        throw new Error(
          result.data?.updatePortfolioItem?.message ||
            "Failed to update portfolio item",
        );
      }
    } catch (error) {
      console.error("Error updating portfolio item:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update portfolio item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const result = await deletePortfolioItem({
        variables: { id: itemId },
      });

      if (result.data?.deletePortfolioItem?.success) {
        refetchPortfolioItems();
        toast({
          title: "Portfolio item removed",
          description: "The portfolio item has been removed.",
        });
      } else {
        throw new Error(
          result.data?.deletePortfolioItem?.message ||
            "Failed to delete portfolio item",
        );
      }
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete portfolio item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      categoryId: "",
      client: "",
      status: PortfolioItemStatus.COMPLETED,
      tags: [],
      teamMembers: [],
      featured: false,
      technologies: [],
      projectUrl: "",
      testimonial: "",
      projectDate: new Date().toISOString().split("T")[0],
      thumbnailUrl: "",
    });
  };

  const filteredItems = portfolioItems.filter((item: PortfolioItem) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || item.category?.id === filterCategory;
    const matchesStatus =
      filterStatus === "all" ||
      item.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (isLoading) {
    return <Loading type="page" />;
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Portfolio Management
          </h1>
          <p className="text-muted-foreground">
            Manage your portfolio items and showcase your work.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Portfolio Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add New Portfolio Item</DialogTitle>
              <DialogDescription>
                Add a new project to your portfolio.
              </DialogDescription>
            </DialogHeader>
            <PortfolioItemForm
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              onSubmit={handleAddItem}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {portfolioItems.filter((p: PortfolioItem) => p.featured).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {categories.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {
                portfolioItems.filter(
                  (p: PortfolioItem) =>
                    p.status === PortfolioItemStatus.IN_PROGRESS,
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, client, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category: PortfolioCategory) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item: PortfolioItem) => {
          const category = item.category;
          const assignedTeamMembers = item.team_members.map(
            (tm) => tm.team_member,
          );
          const StatusIconGlyph =
            item.status === PortfolioItemStatus.COMPLETED
              ? CheckCircle
              : item.status === PortfolioItemStatus.IN_PROGRESS
                ? Clock
                : FileText;

          return (
            <Card key={item.id} className="group card-hover overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <PortfolioCardPreview item={item} />
                <div className="absolute top-2 right-2 flex flex-wrap items-center justify-end gap-1">
                  {item.featured && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-0.5 shadow-sm"
                    >
                      <Star className="h-3 w-3 text-amber-500 fill-current" />
                      <span className="capitalize">featured</span>
                    </Badge>
                  )}
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 shadow-sm capitalize"
                  >
                    <StatusIconGlyph className="h-3 w-3 shrink-0" />
                    <span>{item.status.replace("_", " ").toLowerCase()}</span>
                  </Badge>
                </div>
                <div className="absolute inset-0 flex items-center justify-center space-x-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedPortfolioItem(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>
                          {selectedPortfolioItem?.title}
                        </DialogTitle>
                        <DialogDescription className="flex flex-wrap items-center gap-2">
                          {selectedPortfolioItem?.category && (
                            <Badge
                              variant="outline"
                              style={{
                                borderColor:
                                  selectedPortfolioItem.category.color,
                                color: selectedPortfolioItem.category.color,
                              }}
                            >
                              {selectedPortfolioItem.category.name}
                            </Badge>
                          )}
                          <span className="text-muted-foreground">
                            {selectedPortfolioItem &&
                              formatDate(selectedPortfolioItem.project_date)}
                          </span>
                        </DialogDescription>
                      </DialogHeader>
                      {selectedPortfolioItem && (
                        <div className="space-y-4">
                          <div className="aspect-video overflow-hidden rounded-lg bg-black">
                            {selectedPortfolioItem.thumbnail_url ? (
                              <img
                                src={selectedPortfolioItem.thumbnail_url}
                                alt={selectedPortfolioItem.title}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-muted">
                                <ImageIcon className="h-16 w-16 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {selectedPortfolioItem.description}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Client</span>
                              <p className="text-muted-foreground">
                                {selectedPortfolioItem.client_name ?? "—"}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Status</span>
                              <p className="text-muted-foreground capitalize">
                                {selectedPortfolioItem.status
                                  .replace("_", " ")
                                  .toLowerCase()}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">Team</span>
                              <div className="mt-1 flex flex-wrap gap-2">
                                {selectedPortfolioItem.team_members.length ===
                                0 ? (
                                  <span className="text-muted-foreground">
                                    —
                                  </span>
                                ) : (
                                  selectedPortfolioItem.team_members.map(
                                    (tm) => (
                                      <Badge
                                        key={tm.id}
                                        variant="outline"
                                        className="font-normal"
                                      >
                                        {tm.team_member.name}
                                      </Badge>
                                    ),
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Tags</span>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {selectedPortfolioItem.tags.length === 0 ? (
                                <span className="text-sm text-muted-foreground">
                                  —
                                </span>
                              ) : (
                                selectedPortfolioItem.tags.map((tag) => (
                                  <Badge key={tag.id} variant="outline">
                                    {tag.tag_name}
                                  </Badge>
                                ))
                              )}
                            </div>
                          </div>
                          {selectedPortfolioItem.project_url && (
                            <Button
                              variant="outline"
                              className="w-full sm:w-auto"
                              onClick={() =>
                                window.open(
                                  selectedPortfolioItem.project_url,
                                  "_blank",
                                )
                              }
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open project link
                            </Button>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  {item.project_url && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => window.open(item.project_url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEditItem(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="mb-2 line-clamp-1 text-sm font-semibold">
                  {item.title}
                </h3>
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="line-clamp-1 pr-2">
                    {item.client_name || "—"}
                  </span>
                  <span className="shrink-0">
                    {formatDate(item.project_date)}
                  </span>
                </div>
                <div className="mb-2 flex flex-wrap gap-1">
                  {category && (
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: category.color,
                        color: category.color,
                      }}
                    >
                      {category.name}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {assignedTeamMembers.slice(0, 3).map((member) => (
                    <div
                      key={member.id}
                      className="h-6 w-6 overflow-hidden rounded-full border-2 border-background bg-primary/10"
                      title={member.name}
                    >
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-medium">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      )}
                    </div>
                  ))}
                  {assignedTeamMembers.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{assignedTeamMembers.length - 3}
                    </Badge>
                  )}
                  {item.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag.id} variant="outline" className="text-xs">
                      {tag.tag_name}
                    </Badge>
                  ))}
                  {item.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.tags.length - 2} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No portfolio items</h3>
            <p className="mb-4 text-center text-muted-foreground">
              {searchTerm || filterCategory !== "all" || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "Add your first portfolio item to get started"}
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Portfolio Item
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Portfolio Item</DialogTitle>
            <DialogDescription>
              Update portfolio item information.
            </DialogDescription>
          </DialogHeader>
          <PortfolioItemForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            onSubmit={handleUpdateItem}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingItem(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Portfolio Item Form Component
function PortfolioItemForm({
  formData,
  setFormData,
  categories,
  onSubmit,
  onCancel,
}: {
  formData: PortfolioItemFormData;
  setFormData: (data: PortfolioItemFormData) => void;
  categories: PortfolioCategory[];
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const [projectUrlError, setProjectUrlError] = useState<string | null>(null);

  const extractYouTubeId = (url: string): string | null => {
    const value = url.trim();
    if (!value) return null;

    // youtu.be/<id>
    const short = value.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
    if (short?.[1]) return short[1];

    // youtube.com/watch?v=<id>
    const watch = value.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
    if (watch?.[1]) return watch[1];

    // youtube.com/shorts/<id>
    const shorts = value.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/);
    if (shorts?.[1]) return shorts[1];

    return null;
  };

  const youtubeThumbnailFromId = (id: string) =>
    `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    setFormData({ ...formData, tags });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="client">Client</Label>
          <Input
            id="client"
            value={formData.client}
            onChange={(e) =>
              setFormData({ ...formData, client: e.target.value })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="projectDate">Project Date</Label>
          <Input
            id="projectDate"
            type="date"
            value={formData.projectDate}
            onChange={(e) =>
              setFormData({ ...formData, projectDate: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={formData.tags.join(", ")}
            onChange={(e) => handleTagsChange(e.target.value)}
            placeholder="e.g., wedding, outdoor, corporate"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) =>
              setFormData({ ...formData, categoryId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category: PortfolioCategory) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({ ...formData, status: value as PortfolioItemStatus })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PortfolioItemStatus.COMPLETED}>
                Completed
              </SelectItem>
              <SelectItem value={PortfolioItemStatus.IN_PROGRESS}>
                In Progress
              </SelectItem>
              <SelectItem value={PortfolioItemStatus.DRAFT}>Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="projectUrl">Project URL (YouTube)</Label>
          <Input
            id="projectUrl"
            value={formData.projectUrl}
            onChange={(e) => {
              const url = e.target.value;
              const id = extractYouTubeId(url);

              setFormData({
                ...formData,
                projectUrl: url,
                thumbnailUrl: id
                  ? youtubeThumbnailFromId(id)
                  : formData.thumbnailUrl,
              });

              if (!url.trim()) {
                setProjectUrlError(null);
              } else if (!id) {
                setProjectUrlError(
                  "Please enter a valid YouTube URL (with a video id).",
                );
              } else {
                setProjectUrlError(null);
              }
            }}
            placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
          />
          {projectUrlError ? (
            <p className="text-sm text-destructive mt-1">{projectUrlError}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
          <Input
            id="thumbnailUrl"
            value={formData.thumbnailUrl}
            onChange={(e) =>
              setFormData({ ...formData, thumbnailUrl: e.target.value })
            }
            placeholder="Auto-generated from YouTube URL"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) =>
            setFormData({ ...formData, featured: e.target.checked })
          }
          className="rounded"
        />
        <label htmlFor="featured" className="text-sm">
          Featured project
        </label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            const url = formData.projectUrl?.trim() ?? "";
            if (url) {
              const id = extractYouTubeId(url);
              if (!id) {
                setProjectUrlError(
                  "Please enter a valid YouTube URL (with a video id).",
                );
                return;
              }
            }
            onSubmit();
          }}
        >
          {formData.title ? "Update" : "Add"} Item
        </Button>
      </div>
    </div>
  );
}
