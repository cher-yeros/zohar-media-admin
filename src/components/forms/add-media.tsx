import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CREATE_MEDIA_ITEM } from "@/lib/graphql/mutations";
import { AddMediaFormData, addMediaFormSchema } from "@/lib/schemas/validation";
import {
  formatFileSize,
  getImageDimensions,
  getVideoDuration,
  uploadFile,
  validateFile,
} from "@/lib/api/file-upload";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface AddMediaProps {
  onMediaAdded?: (media: any) => void;
}

export function AddMedia({ onMediaAdded }: AddMediaProps) {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<AddMediaFormData>({
    resolver: zodResolver(addMediaFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: [],
      currentTag: "",
    },
  });

  const [createMediaItem] = useMutation(CREATE_MEDIA_ITEM);

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      const newTags = [...tags, currentTag.trim()];
      setTags(newTags);
      setValue("tags", newTags);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setValue("tags", newTags);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);

    if (!selected) {
      setPreviewUrl("");
      return;
    }

    const validation = validateFile(selected, 50 * 1024 * 1024, [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ]);
    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.error ?? "File not allowed",
        variant: "destructive",
      });
      setFile(null);
      setPreviewUrl("");
      return;
    }

    setPreviewUrl(URL.createObjectURL(selected));
  };

  const onSubmit = async (data: AddMediaFormData) => {
    try {
      if (!file) {
        toast({
          title: "Error",
          description: "Please select a media file to upload",
          variant: "destructive",
        });
        return;
      }

      const type = file.type.startsWith("video/")
        ? ("VIDEO" as const)
        : ("IMAGE" as const);

      const [dimensions, duration] = await Promise.all([
        type === "IMAGE"
          ? getImageDimensions(file)
              .then((d) => `${d.width}x${d.height}`)
              .catch(() => undefined)
          : Promise.resolve(undefined),
        type === "VIDEO"
          ? getVideoDuration(file)
              .then((sec) => `${Math.round(sec)}s`)
              .catch(() => undefined)
          : Promise.resolve(undefined),
      ]);

      const uploadResult = await uploadFile(file, { folder: "media" });
      if (!uploadResult.fileName) {
        throw new Error(uploadResult.message || "Upload failed");
      }

      const result = await createMediaItem({
        variables: {
          title: data.title,
          type,
          url: uploadResult.fileName,
          thumbnail_url: type === "IMAGE" ? uploadResult.fileName : undefined,
          file_size: formatFileSize(file.size),
          dimensions,
          duration,
          tags: tags.length > 0 ? tags : undefined,
        },
      });

      if (result.data?.createMediaItem?.success) {
        const newMedia = result.data.createMediaItem.mediaItem;

        onMediaAdded?.(newMedia);

        toast({
          title: "Media Added Successfully",
          description: `"${data.title}" has been added to your media library.`,
        });

        // Reset form
        reset();
        setTags([]);
        setCurrentTag("");
        setFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
        setOpen(false);
      } else {
        throw new Error(
          result.data?.createMediaItem?.message ||
            "Failed to create media item",
        );
      }
    } catch (error) {
      console.error("Error creating media item:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add media. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Media</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Media</span>
          </DialogTitle>
          <DialogDescription>
            Upload an image or video. The uploaded URL will be saved in the
            database.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter media title"
                {...register("title")}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="Optional category"
                {...register("category")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mediaFile">Media file *</Label>
            <Input
              id="mediaFile"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </div>

          {previewUrl && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                {file?.type.startsWith("video/") ? (
                  <video
                    src={previewUrl}
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a description for this media"
              {...register("description")}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex space-x-2">
              <Input
                id="tags"
                placeholder="Add a tag and press Enter"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <span>{tag}</span>
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Media"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
