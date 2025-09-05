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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Calendar,
  User,
  Tag,
  Image as ImageIcon,
  Video,
  Search,
  Filter,
  Star,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";
import {
  samplePortfolioItems,
  samplePortfolioCategories,
  sampleTeamMembers,
  PortfolioItem,
  PortfolioCategory,
} from "@/data/sample-data";
import { formatDate } from "@/lib/utils";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";

export function Portfolio() {
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [teamMembers, setTeamMembers] = useState(sampleTeamMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    client: "",
    status: "completed" as "completed" | "in-progress" | "draft",
    tags: [] as string[],
    teamMembers: [] as string[],
    featured: false,
    technologies: [] as string[],
    projectUrl: "",
    testimonial: "",
  });

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setPortfolioItems(samplePortfolioItems);
      setCategories(samplePortfolioCategories);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddItem = () => {
    const newItem: PortfolioItem = {
      id: (portfolioItems.length + 1).toString(),
      title: formData.title,
      description: formData.description,
      categoryId: formData.categoryId,
      images: [], // Would be handled by file upload in real app
      thumbnail: "", // Would be handled by file upload in real app
      client: formData.client,
      projectDate: new Date(),
      status: formData.status,
      tags: formData.tags,
      teamMembers: formData.teamMembers,
      featured: formData.featured,
      technologies: formData.technologies,
      projectUrl: formData.projectUrl,
      testimonial: formData.testimonial,
    };

    setPortfolioItems([...portfolioItems, newItem]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "Portfolio item added",
      description: `${formData.title} has been added to the portfolio.`,
    });
  };

  const handleEditItem = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      categoryId: item.categoryId,
      client: item.client || "",
      status: item.status,
      tags: item.tags,
      teamMembers: item.teamMembers,
      featured: item.featured,
      technologies: item.technologies || [],
      projectUrl: item.projectUrl || "",
      testimonial: item.testimonial || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;

    const updatedItems = portfolioItems.map((item) =>
      item.id === editingItem.id
        ? {
            ...item,
            ...formData,
          }
        : item
    );

    setPortfolioItems(updatedItems);
    setIsEditDialogOpen(false);
    setEditingItem(null);
    resetForm();
    toast({
      title: "Portfolio item updated",
      description: `${formData.title} has been updated.`,
    });
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = portfolioItems.filter((item) => item.id !== itemId);
    setPortfolioItems(updatedItems);
    toast({
      title: "Portfolio item removed",
      description: "The portfolio item has been removed.",
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      categoryId: "",
      client: "",
      status: "completed",
      tags: [],
      teamMembers: [],
      featured: false,
      technologies: [],
      projectUrl: "",
      testimonial: "",
    });
  };

  const filteredItems = portfolioItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || item.categoryId === filterCategory;
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryById = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "draft":
        return <FileText className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "secondary";
      case "draft":
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
              {portfolioItems.filter((p) => p.status === "completed").length}{" "}
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
              {portfolioItems.filter((p) => p.featured).length}
            </div>
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
              {portfolioItems.filter((p) => p.status === "in-progress").length}
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
                const category = getCategoryById(item.categoryId);
                const assignedTeamMembers = teamMembers.filter((member) =>
                  item.teamMembers.includes(member.id)
                );

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
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
                      <div className="text-sm">{item.client || "N/A"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(item.projectDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.status)}
                        <Badge variant={getStatusColor(item.status)}>
                          {item.status}
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
                            {member.avatar ? (
                              <img
                                src={member.avatar}
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
                        {item.projectUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(item.projectUrl, "_blank")
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
  formData: any;
  setFormData: (data: any) => void;
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
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
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
