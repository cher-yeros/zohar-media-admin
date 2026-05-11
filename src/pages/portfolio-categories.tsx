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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { GET_PORTFOLIO_CATEGORIES } from "@/lib/graphql/queries";
import {
  CREATE_PORTFOLIO_CATEGORY,
  UPDATE_PORTFOLIO_CATEGORY,
  DELETE_PORTFOLIO_CATEGORY,
} from "@/lib/graphql/mutations";
import {
  PortfolioCategory,
  PortfolioCategoryFormData,
  CreatePortfolioCategoryInput,
  UpdatePortfolioCategoryInput,
} from "@/lib/types/portfolio";
import { formatDate } from "@/lib/utils";
import { useQuery, useMutation } from "@apollo/client";
import {
  Calendar,
  Edit,
  Filter,
  Hash,
  Plus,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export function PortfolioCategories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<PortfolioCategory | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<PortfolioCategoryFormData>({
    name: "",
    description: "",
    color: "#3B82F6",
  });

  // Apollo Client queries
  const {
    data: categoriesData,
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useQuery(GET_PORTFOLIO_CATEGORIES);

  // Apollo Client mutations
  const [createPortfolioCategory] = useMutation(CREATE_PORTFOLIO_CATEGORY);
  const [updatePortfolioCategory] = useMutation(UPDATE_PORTFOLIO_CATEGORY);
  const [deletePortfolioCategory] = useMutation(DELETE_PORTFOLIO_CATEGORY);

  const categories = categoriesData?.portfolioCategories || [];
  const portfolioItems = categories.flatMap(
    (category: PortfolioCategory) => category?.portfolio_items ?? [],
  );
  const isLoading = categoriesLoading;

  const handleAddCategory = async () => {
    try {
      const input: CreatePortfolioCategoryInput = {
        name: formData.name,
        description: formData.description || undefined,
        color: formData.color,
      };

      const result = await createPortfolioCategory({
        variables: input,
      });

      if (result.data?.createPortfolioCategory?.success) {
        setIsAddDialogOpen(false);
        resetForm();
        refetchCategories();
        toast({
          title: "Category added",
          description: `${formData.name} has been added to categories.`,
        });
      } else {
        throw new Error(
          result.data?.createPortfolioCategory?.message ||
            "Failed to create portfolio category",
        );
      }
    } catch (error) {
      console.error("Error creating portfolio category:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = (category: PortfolioCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      const input: UpdatePortfolioCategoryInput = {
        id: editingCategory.id,
        name: formData.name,
        description: formData.description || undefined,
        color: formData.color,
      };

      const result = await updatePortfolioCategory({
        variables: input,
      });

      if (result.data?.updatePortfolioCategory?.success) {
        setIsEditDialogOpen(false);
        setEditingCategory(null);
        resetForm();
        refetchCategories();
        toast({
          title: "Category updated",
          description: `${formData.name} has been updated.`,
        });
      } else {
        throw new Error(
          result.data?.updatePortfolioCategory?.message ||
            "Failed to update portfolio category",
        );
      }
    } catch (error) {
      console.error("Error updating portfolio category:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const result = await deletePortfolioCategory({
        variables: { id: categoryId },
      });

      if (result.data?.deletePortfolioCategory?.success) {
        refetchCategories();
        toast({
          title: "Category removed",
          description: "The category has been removed.",
        });
      } else {
        throw new Error(
          result.data?.deletePortfolioCategory?.message ||
            "Failed to delete portfolio category",
        );
      }
    } catch (error) {
      console.error("Error deleting portfolio category:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "#3B82F6",
    });
  };

  const filteredCategories = categories.filter((category: PortfolioCategory) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getProjectCount = (categoryId: string) => {
    const category = categories.find((cat: PortfolioCategory) => cat.id === categoryId);
    return category?.portfolio_items?.length || 0;
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
            Portfolio Categories
          </h1>
          <p className="text-muted-foreground">
            Manage portfolio categories and organize your projects.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new portfolio category to organize your projects.
              </DialogDescription>
            </DialogHeader>
            <CategoryForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleAddCategory}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Portfolio categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.length > 0
                ? Math.max(
                    ...categories.map(
                      (c: PortfolioCategory) => c.portfolio_items?.length || 0,
                    ),
                  )
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Projects in top category
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category: PortfolioCategory) => {
          const projectCount = getProjectCount(category.id);
          return (
            <Card key={category.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {category.description && (
                  <CardDescription>{category.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Projects
                    </span>
                    <Badge variant="outline">{projectCount}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Created
                    </span>
                    <span className="text-sm">
                      {formatDate(category.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Color</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="h-4 w-4 rounded border"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-mono">
                        {category.color}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            Detailed view of all portfolio categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category: PortfolioCategory) => {
                const projectCount = getProjectCount(category.id);
                return (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {category.description || "No description"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{projectCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(category.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div
                          className="h-4 w-4 rounded border"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-mono">
                          {category.color}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information.</DialogDescription>
          </DialogHeader>
          <CategoryForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateCategory}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingCategory(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Category Form Component
function CategoryForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
}: {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const predefinedColors = [
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#8B5CF6", // Purple
    "#F97316", // Orange
    "#06B6D4", // Cyan
    "#84CC16", // Lime
    "#EC4899", // Pink
    "#6B7280", // Gray
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Wedding Photography"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Brief description of this category..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="color">Color</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="color"
              id="color"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className="h-10 w-20 rounded border"
            />
            <Input
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              placeholder="#3B82F6"
              className="font-mono"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {predefinedColors.map((color) => (
              <button
                key={color}
                type="button"
                className={`h-8 w-8 rounded border-2 ${
                  formData.color === color
                    ? "border-gray-900"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setFormData({ ...formData, color })}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {formData.name ? "Update" : "Add"} Category
        </Button>
      </div>
    </div>
  );
}
