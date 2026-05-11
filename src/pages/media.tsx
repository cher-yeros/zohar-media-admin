import { AddMedia } from "@/components/forms/add-media";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";
import { DELETE_MEDIA_ITEM } from "@/lib/graphql/mutations";
import { GET_MEDIA_ITEMS } from "@/lib/graphql/queries";
import { formatDate } from "@/lib/utils";
import {
  Edit,
  Eye,
  Image as ImageIcon,
  Play,
  Plus,
  Search,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

type MediaType = "IMAGE" | "VIDEO";
type MediaItem = {
  id: string;
  title: string;
  type: MediaType;
  url: string;
  thumbnail_url?: string | null;
  file_size?: string | null;
  dimensions?: string | null;
  duration?: string | null;
  upload_date: string;
  tags: { id: string; tag_name: string }[];
};

export function Media() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const { toast } = useToast();

  const {
    data,
    loading,
    refetch: refetchMedia,
  } = useQuery(GET_MEDIA_ITEMS, {
    variables: { limit: 200, offset: 0 },
  });

  const [deleteMediaItem, { loading: deleting }] =
    useMutation(DELETE_MEDIA_ITEM);

  const media: MediaItem[] = data?.mediaItems?.items ?? [];

  const filteredMedia = media.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.tag_name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesType =
      typeFilter === "all" ||
      item.type === typeFilter ||
      (typeFilter === "image" && item.type === "IMAGE") ||
      (typeFilter === "video" && item.type === "VIDEO");

    return matchesSearch && matchesType;
  });

  const handleDelete = async (mediaId: string) => {
    try {
      const result = await deleteMediaItem({ variables: { id: mediaId } });
      if (result.data?.deleteMediaItem?.success) {
        await refetchMedia();
        toast({ title: "Deleted", description: "Media item removed." });
      } else {
        throw new Error(
          result.data?.deleteMediaItem?.message ?? "Failed to delete",
        );
      }
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to delete",
        variant: "destructive",
      });
    }
  };

  const handleMediaAdded = (_newMedia: MediaItem) => {
    refetchMedia();
  };

  const getTypeIcon = (type: string) => {
    return type === "VIDEO" ? Video : ImageIcon;
  };

  /** Grid / card preview: <img> cannot decode video URLs; use <video> for VIDEO. */
  function MediaCardPreview({ item }: { item: MediaItem }) {
    if (item.type === "VIDEO") {
      return (
        <video
          src={item.url}
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          aria-label={item.title}
        />
      );
    }
    return (
      <img
        src={item.thumbnail_url ?? item.url}
        alt={item.title}
        className="h-full w-full object-cover"
      />
    );
  }

  if (loading) {
    return <Loading type="page" />;
  }

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
              {media.filter((m) => m.type === "IMAGE").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {media.filter((m) => m.type === "VIDEO").length}
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
                <MediaCardPreview item={item} />
                {item.type === "VIDEO" && (
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
                    <span className="capitalize">
                      {item.type === "VIDEO" ? "video" : "image"}
                    </span>
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
                          {selectedMedia?.type === "IMAGE" ? "Image" : "Video"}{" "}
                          • Uploaded{" "}
                          {selectedMedia &&
                            formatDate(selectedMedia.upload_date)}
                        </DialogDescription>
                      </DialogHeader>
                      {selectedMedia && (
                        <div className="space-y-4">
                          <div className="aspect-video bg-black rounded-lg overflow-hidden">
                            {selectedMedia.type === "VIDEO" ? (
                              <video
                                key={selectedMedia.id}
                                src={selectedMedia.url}
                                controls
                                playsInline
                                preload="metadata"
                                className="h-full w-full object-contain"
                              >
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <img
                                src={selectedMedia.url}
                                alt={selectedMedia.title}
                                className="h-full w-full object-cover"
                              />
                            )}
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
                                {selectedMedia.type === "VIDEO"
                                  ? "video"
                                  : "image"}
                              </p>
                            </div>
                            <div>
                              <label className="font-medium">Size</label>
                              <p className="text-muted-foreground">
                                {selectedMedia.file_size ?? "—"}
                              </p>
                            </div>
                            <div>
                              <label className="font-medium">
                                {selectedMedia.type === "VIDEO"
                                  ? "Duration"
                                  : "Dimensions"}
                              </label>
                              <p className="text-muted-foreground">
                                {selectedMedia.type === "VIDEO"
                                  ? (selectedMedia.duration ?? "—")
                                  : (selectedMedia.dimensions ?? "—")}
                              </p>
                            </div>
                          </div>
                          <div>
                            <label className="font-medium">Tags</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedMedia.tags.map((tag) => (
                                <Badge key={tag.id} variant="outline">
                                  {tag.tag_name}
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
                    disabled={deleting}
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
                  <span>{item.file_size ?? "—"}</span>
                  <span>{formatDate(item.upload_date)}</span>
                </div>
                <div className="flex flex-wrap gap-1">
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
