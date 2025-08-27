import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Check, X, Star, Heart, Eye } from "lucide-react";
import { sampleTestimonials, Testimonial } from "@/data/sample-data";
import { formatDate } from "@/lib/utils";
import { AddTestimony } from "@/components/forms/add-testimony";

export function Testimonials() {
  const [testimonials, setTestimonials] = useState(sampleTestimonials);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || testimonial.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = (testimonialId: string) => {
    setTestimonials((prev) =>
      prev.map((testimonial) =>
        testimonial.id === testimonialId
          ? { ...testimonial, status: "approved" as const }
          : testimonial
      )
    );
  };

  const handleReject = (testimonialId: string) => {
    setTestimonials((prev) =>
      prev.map((testimonial) =>
        testimonial.id === testimonialId
          ? { ...testimonial, status: "rejected" as const }
          : testimonial
      )
    );
  };

  const handleToggleFeatured = (testimonialId: string) => {
    setTestimonials((prev) =>
      prev.map((testimonial) =>
        testimonial.id === testimonialId
          ? { ...testimonial, featured: !testimonial.featured }
          : testimonial
      )
    );
  };

  const handleTestimonyAdded = (newTestimony: Testimonial) => {
    setTestimonials((prev) => [newTestimony, ...prev]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "default";
      case "approved":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground">
            Manage customer testimonials and reviews
          </p>
        </div>
        <AddTestimony onTestimonyAdded={handleTestimonyAdded} />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Testimonials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testimonials.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {testimonials.filter((t) => t.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {testimonials.filter((t) => t.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {testimonials.filter((t) => t.featured).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Testimonials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, company, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="card-hover">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-sm">
                      {testimonial.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Badge variant={getStatusColor(testimonial.status)}>
                    {testimonial.status}
                  </Badge>
                  {testimonial.featured && (
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {renderStars(testimonial.rating)}
                <span className="text-sm text-muted-foreground ml-2">
                  {testimonial.rating}/5
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                "{testimonial.message}"
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatDate(testimonial.date)}
                </span>
                <div className="flex items-center space-x-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTestimonial(testimonial)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Testimonial Details</DialogTitle>
                        <DialogDescription>
                          From {selectedTestimonial?.name} at{" "}
                          {selectedTestimonial?.company}
                        </DialogDescription>
                      </DialogHeader>
                      {selectedTestimonial && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            {selectedTestimonial.avatar ? (
                              <img
                                src={selectedTestimonial.avatar}
                                alt={selectedTestimonial.name}
                                className="h-16 w-16 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-lg font-medium text-primary">
                                  {selectedTestimonial.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold">
                                {selectedTestimonial.name}
                              </h3>
                              <p className="text-muted-foreground">
                                {selectedTestimonial.company}
                              </p>
                              <div className="flex items-center space-x-1 mt-1">
                                {renderStars(selectedTestimonial.rating)}
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">
                              Message
                            </label>
                            <p className="text-sm text-muted-foreground mt-1">
                              "{selectedTestimonial.message}"
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">
                                Status
                              </label>
                              <Badge
                                variant={getStatusColor(
                                  selectedTestimonial.status
                                )}
                                className="mt-1"
                              >
                                {selectedTestimonial.status}
                              </Badge>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Featured
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {selectedTestimonial.featured ? "Yes" : "No"}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {selectedTestimonial.status === "pending" && (
                              <>
                                <Button
                                  onClick={() =>
                                    handleApprove(selectedTestimonial.id)
                                  }
                                  className="flex-1"
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    handleReject(selectedTestimonial.id)
                                  }
                                  className="flex-1"
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {selectedTestimonial.status === "approved" && (
                              <Button
                                variant="outline"
                                onClick={() =>
                                  handleToggleFeatured(selectedTestimonial.id)
                                }
                                className="flex-1"
                              >
                                <Heart className="h-4 w-4 mr-2" />
                                {selectedTestimonial.featured
                                  ? "Unfeature"
                                  : "Feature"}
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  {testimonial.status === "pending" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApprove(testimonial.id)}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReject(testimonial.id)}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </>
                  )}
                  {testimonial.status === "approved" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFeatured(testimonial.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${testimonial.featured ? "text-red-500 fill-current" : "text-muted-foreground"}`}
                      />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTestimonials.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Star className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No testimonials found
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Add your first testimonial to get started"}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
