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
import {
  Search,
  Upload,
  Eye,
  Edit,
  Trash2,
  Play,
  Image as ImageIcon,
  Video,
  Plus,
} from "lucide-react";
import { sampleMedia, MediaItem } from "@/data/sample-data";
import { formatDate } from "@/lib/utils";
import { AddMedia } from "@/components/forms/add-media";

export function Media() {
  const [media, setMedia] = useState(sampleMedia);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const filteredMedia = media.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesType = typeFilter === "all" || item.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleDelete = (mediaId: string) => {
    setMedia((prev) => prev.filter((item) => item.id !== mediaId));
  };

  const handleMediaAdded = (newMedia: MediaItem) => {
    setMedia((prev) => [newMedia, ...prev]);
  };

  const getTypeIcon = (type: string) => {
    return type === "video" ? Video : ImageIcon;
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Portfolio</h1>
          <p className="text-muted-foreground">
            Manage your media content and portfolio
          </p>
        </div>
        <div className="flex space-x-3">
          <AddMedia onMediaAdded={handleMediaAdded} />
          <Button variant="outline" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Album</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{media.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {media.filter((m) => m.type === "image").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {media.filter((m) => m.type === "video").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">2.3 GB</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMedia.map((item) => {
          const TypeIcon = getTypeIcon(item.type);
          return (
            <Card key={item.id} className="group card-hover overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <TypeIcon className="h-3 w-3" />
                    <span className="capitalize">{item.type}</span>
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedMedia(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{selectedMedia?.title}</DialogTitle>
                        <DialogDescription>
                          {selectedMedia?.type === "image" ? "Image" : "Video"}{" "}
                          • Uploaded{" "}
                          {selectedMedia &&
                            formatDate(selectedMedia.uploadDate)}
                        </DialogDescription>
                      </DialogHeader>
                      {selectedMedia && (
                        <div className="space-y-4">
                          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                            <img
                              src={selectedMedia.url}
                              alt={selectedMedia.title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <label className="font-medium">Title</label>
                              <p className="text-muted-foreground">
                                {selectedMedia.title}
                              </p>
                            </div>
                            <div>
                              <label className="font-medium">Type</label>
                              <p className="text-muted-foreground capitalize">
                                {selectedMedia.type}
                              </p>
                            </div>
                            <div>
                              <label className="font-medium">Size</label>
                              <p className="text-muted-foreground">
                                {selectedMedia.size}
                              </p>
                            </div>
                            <div>
                              <label className="font-medium">
                                {selectedMedia.type === "video"
                                  ? "Duration"
                                  : "Dimensions"}
                              </label>
                              <p className="text-muted-foreground">
                                {selectedMedia.type === "video"
                                  ? selectedMedia.duration
                                  : selectedMedia.dimensions}
                              </p>
                            </div>
                          </div>
                          <div>
                            <label className="font-medium">Tags</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedMedia.tags.map((tag) => (
                                <Badge key={tag} variant="outline">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" variant="secondary">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-1">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{item.size}</span>
                  <span>{formatDate(item.uploadDate)}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
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

      {filteredMedia.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No media found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || typeFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Upload your first media item to get started"}
            </p>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
