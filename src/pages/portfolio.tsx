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
  const { data: portfolioData, loading: portfolioLoading } = useQuery(
    GET_PORTFOLIO_ITEMS,
    {
      variables: {
        category_id: filterCategory === "all" ? null : filterCategory,
        status: filterStatus === "all" ? null : filterStatus.toUpperCase(),
        limit: 100,
        offset: 0,
      },
    }
  );

  console.log(portfolioData);

  const { data: categoriesData, loading: categoriesLoading } = useQuery(
    GET_PORTFOLIO_CATEGORIES
  );
  const { data: teamData, loading: teamLoading } = useQuery(GET_TEAM_MEMBERS);

  // Apollo Client mutations
  const [createPortfolioItem] = useMutation(CREATE_PORTFOLIO_ITEM);
  const [updatePortfolioItem] = useMutation(UPDATE_PORTFOLIO_ITEM);
  const [deletePortfolioItem] = useMutation(DELETE_PORTFOLIO_ITEM);

  const portfolioItems = portfolioData?.portfolioItems?.items || [];
  const categories = categoriesData?.portfolioCategories || [];
  const teamMembers = teamData?.teamMembers || [];
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
        testimonial: formData.testimonial || undefined,
        tags: formData.tags,
        technologies: formData.technologies,
        team_members: formData.teamMembers.map((memberId) => ({
          team_member_id: memberId,
          role: undefined,
        })),
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
            "Failed to create portfolio item"
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
      teamMembers: item.team_members.map((tm) => tm.team_member.id),
      featured: item.featured,
      technologies: item.technologies.map((tech) => tech.technology_name),
      projectUrl: item.project_url || "",
      testimonial: item.testimonial || "",
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
        testimonial: formData.testimonial || undefined,
        tags: formData.tags,
        technologies: formData.technologies,
        team_members: formData.teamMembers.map((memberId) => ({
          team_member_id: memberId,
          role: undefined,
        })),
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
            "Failed to update portfolio item"
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
            "Failed to delete portfolio item"
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

  const getCategoryById = (categoryId: string) => {
    return categories.find((cat: PortfolioCategory) => cat.id === categoryId);
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Portfolio Management
          </h1>
          <p className="text-muted-foreground">
            Manage your portfolio items and showcase your work.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
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
              teamMembers={teamMembers}
              onSubmit={handleAddItem}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
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
                    p.status === PortfolioItemStatus.COMPLETED
                ).length
              }{" "}
              completed
            </p>
          </CardContent>
        </Card>
        <Card>
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
            {portfolioItems.filter((p: PortfolioItem) => p.featured).length}
            <p className="text-xs text-muted-foreground">Highlighted work</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Different types</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                portfolioItems.filter(
                  (p) => p.status === PortfolioItemStatus.IN_PROGRESS
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
          <div className="flex gap-4 mb-6">
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
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
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
              {filteredItems.map((item) => {
                const category = item.category;
                const assignedTeamMembers = item.team_members.map(
                  (tm) => tm.team_member
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
                        {assignedTeamMembers.slice(0, 3).map((member) => (
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
                                .map((n) => n[0])
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
            teamMembers={teamMembers}
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
  teamMembers,
  onSubmit,
  onCancel,
}: {
  formData: PortfolioItemFormData;
  setFormData: (data: PortfolioItemFormData) => void;
  categories: PortfolioCategory[];
  teamMembers: any[];
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const handleTagsChange = (value: string) => {
    const tags = value
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    setFormData({ ...formData, tags });
  };

  const handleTechnologiesChange = (value: string) => {
    const technologies = value
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    setFormData({ ...formData, technologies });
  };

  const handleTeamMembersChange = (memberId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        teamMembers: [...formData.teamMembers, memberId],
      });
    } else {
      setFormData({
        ...formData,
        teamMembers: formData.teamMembers.filter(
          (id: string) => id !== memberId
        ),
      });
    }
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
          <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
          <Input
            id="thumbnailUrl"
            value={formData.thumbnailUrl}
            onChange={(e) =>
              setFormData({ ...formData, thumbnailUrl: e.target.value })
            }
            placeholder="https://example.com/image.jpg"
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
              {categories.map((category) => (
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
              setFormData({ ...formData, status: value })
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

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags.join(", ")}
          onChange={(e) => handleTagsChange(e.target.value)}
          placeholder="e.g., wedding, outdoor, corporate"
        />
      </div>

      <div>
        <Label htmlFor="technologies">Technologies (comma-separated)</Label>
        <Input
          id="technologies"
          value={formData.technologies.join(", ")}
          onChange={(e) => handleTechnologiesChange(e.target.value)}
          placeholder="e.g., Canon EOS R5, Adobe Lightroom, Sony FX6"
        />
      </div>

      <div>
        <Label>Team Members</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`member-${member.id}`}
                checked={formData.teamMembers.includes(member.id)}
                onChange={(e) =>
                  handleTeamMembersChange(member.id, e.target.checked)
                }
                className="rounded"
              />
              <label htmlFor={`member-${member.id}`} className="text-sm">
                {member.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="projectUrl">Project URL</Label>
        <Input
          id="projectUrl"
          value={formData.projectUrl}
          onChange={(e) =>
            setFormData({ ...formData, projectUrl: e.target.value })
          }
          placeholder="https://example.com/project"
        />
      </div>

      <div>
        <Label htmlFor="testimonial">Client Testimonial</Label>
        <Textarea
          id="testimonial"
          value={formData.testimonial}
          onChange={(e) =>
            setFormData({ ...formData, testimonial: e.target.value })
          }
          rows={2}
          placeholder="Client feedback about the project..."
        />
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
        <Button onClick={onSubmit}>
          {formData.title ? "Update" : "Add"} Item
        </Button>
      </div>
    </div>
  );
}
