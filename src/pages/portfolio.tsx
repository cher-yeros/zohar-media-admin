import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Plus,
  Search,
  Star,
  Tag,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export function Portfolio() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
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

  const getStatusIcon = (status: PortfolioItemStatus) => {
    switch (status) {
      case PortfolioItemStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case PortfolioItemStatus.IN_PROGRESS:
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case PortfolioItemStatus.DRAFT:
        return <FileText className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: PortfolioItemStatus) => {
    switch (status) {
      case PortfolioItemStatus.COMPLETED:
        return "default";
      case PortfolioItemStatus.IN_PROGRESS:
        return "secondary";
      case PortfolioItemStatus.DRAFT:
        return "outline";
      default:
        return "outline";
    }
  };

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
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioItems.length}</div>
            <p className="text-xs text-muted-foreground">
              {
                portfolioItems.filter(
                  (p: PortfolioItem) =>
                    p.status === PortfolioItemStatus.COMPLETED,
                ).length
              }{" "}
              completed
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Featured Projects
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portfolioItems.filter((p: PortfolioItem) => p.featured).length}
            </div>
            <p className="text-xs text-muted-foreground">Highlighted work</p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Different types</p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                portfolioItems.filter(
                  (p: PortfolioItem) =>
                    p.status === PortfolioItemStatus.IN_PROGRESS,
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Items</CardTitle>
          <CardDescription>
            Manage and view all portfolio projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-center md:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search portfolio items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="Filter by category" />
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
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item: PortfolioItem) => {
                const category = item.category;
                const assignedTeamMembers = item.team_members.map(
                  (tm: any) => tm.team_member,
                );

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                          {item.thumbnail_url ? (
                            <img
                              src={item.thumbnail_url}
                              alt={item.title}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium flex items-center space-x-2">
                            {item.title}
                            {item.featured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {category && (
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: category.color,
                            color: category.color,
                          }}
                        >
                          {category.name}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{item.client_name || "N/A"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(item.project_date)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.status)}
                        <Badge variant={getStatusColor(item.status)}>
                          {item.status.replace("_", " ").toLowerCase()}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        {assignedTeamMembers.slice(0, 3).map((member: any) => (
                          <div
                            key={member.id}
                            className="h-6 w-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium"
                            title={member.name}
                          >
                            {member.avatar_url ? (
                              <img
                                src={member.avatar_url}
                                alt={member.name}
                                className="h-6 w-6 rounded-full object-cover"
                              />
                            ) : (
                              member.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                            )}
                          </div>
                        ))}
                        {assignedTeamMembers.length > 3 && (
                          <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                            +{assignedTeamMembers.length - 3}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {item.project_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(item.project_url, "_blank")
                            }
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
