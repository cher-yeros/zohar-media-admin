import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Youtube, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addMediaFormSchema, AddMediaFormData } from "@/lib/schemas/validation";
import { CREATE_MEDIA_ITEM } from "@/lib/graphql/mutations";
import { useMutation } from "@apollo/client";
import { uploadFile } from "@/lib/api/file-upload";

interface AddMediaProps {
  onMediaAdded?: (media: any) => void;
}

export function AddMedia({ onMediaAdded }: AddMediaProps) {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<AddMediaFormData>({
    resolver: zodResolver(addMediaFormSchema),
    defaultValues: {
      title: "",
      youtubeUrl: "",
      description: "",
      category: "",
      tags: [],
      currentTag: "",
    },
  });

  const [createMediaItem] = useMutation(CREATE_MEDIA_ITEM);

  const categories = [
    "Wedding Photography",
    "Corporate Videos",
    "Product Photography",
    "Event Photography",
    "Portrait Sessions",
    "Brand Photography",
    "Commercial Videos",
    "Documentary",
  ];

  const extractYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

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

  const onSubmit = async (data: AddMediaFormData) => {
    try {
      const youtubeId = extractYouTubeId(data.youtubeUrl);

      if (!youtubeId) {
        toast({
          title: "Error",
          description: "Please enter a valid YouTube URL",
          variant: "destructive",
        });
        return;
      }

      const result = await createMediaItem({
        variables: {
          input: {
            title: data.title,
            type: "VIDEO",
            url: data.youtubeUrl,
            thumbnail_url: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
            tags: tags.map((tag) => ({ tag_name: tag })),
          },
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
        setOpen(false);
      } else {
        throw new Error(
          result.data?.createMediaItem?.message || "Failed to create media item"
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

  const youtubeUrl = watch("youtubeUrl");
  const youtubeId = extractYouTubeId(youtubeUrl);

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
            <Youtube className="h-5 w-5 text-red-500" />
            <span>Add YouTube Media</span>
          </DialogTitle>
          <DialogDescription>
            Add a new video from YouTube to your media library.
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
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => setValue("category", value)}>
                <SelectTrigger
                  className={errors.category ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtubeUrl">YouTube URL *</Label>
            <Input
              id="youtubeUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              {...register("youtubeUrl")}
              className={errors.youtubeUrl ? "border-destructive" : ""}
            />
            {errors.youtubeUrl && (
              <p className="text-sm text-destructive">
                {errors.youtubeUrl.message}
              </p>
            )}
          </div>

          {youtubeId && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                  alt="YouTube thumbnail"
                  className="w-full h-full object-cover"
                />
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
