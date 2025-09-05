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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Star, Upload, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  addTestimonyFormSchema,
  AddTestimonyFormData,
} from "@/lib/schemas/validation";
import { CREATE_TESTIMONIAL } from "@/lib/graphql/mutations";
import { useMutation } from "@apollo/client";
import { uploadFile } from "@/lib/api/file-upload";

interface AddTestimonyProps {
  onTestimonyAdded?: (testimony: any) => void;
}

export function AddTestimony({ onTestimonyAdded }: AddTestimonyProps) {
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<AddTestimonyFormData>({
    resolver: zodResolver(addTestimonyFormSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      message: "",
      rating: 5,
      avatar: "",
    },
  });

  const [createTestimonial] = useMutation(CREATE_TESTIMONIAL);

  const onSubmit = async (data: AddTestimonyFormData) => {
    try {
      const result = await createTestimonial({
        variables: {
          input: {
            name: data.name,
            company: data.company,
            message: data.message,
            rating: data.rating,
            testimonial_date: new Date().toISOString(),
            status: "PENDING",
            featured: false,
            avatar_url:
              avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`,
          },
        },
      });

      if (result.data?.createTestimonial?.success) {
        const newTestimony = result.data.createTestimonial.testimonial;

        onTestimonyAdded?.(newTestimony);

        toast({
          title: "Testimonial Added Successfully",
          description: `Testimonial from ${data.name} has been added and is pending approval.`,
        });

        // Reset form
        reset();
        setAvatarUrl("");
        setOpen(false);
      } else {
        throw new Error(
          result.data?.createTestimonial?.message ||
            "Failed to create testimonial"
        );
      }
    } catch (error) {
      console.error("Error creating testimonial:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add testimonial. Please try again.",
        variant: "destructive",
      });
    }
  };

  const rating = watch("rating");

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < currentRating
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground"
        } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
        onClick={interactive ? () => setValue("rating", i + 1) : undefined}
      />
    ));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Upload file to server
        const uploadResult = await uploadFile(file, { folder: "avatars" });

        if (uploadResult.success && uploadResult.fileName) {
          setAvatarUrl(uploadResult.fileName);
          setValue("avatar", uploadResult.fileName);
        } else {
          // Fallback to local preview
          const reader = new FileReader();
          reader.onload = (event) => {
            const url = event.target?.result as string;
            setAvatarUrl(url);
            setValue("avatar", url);
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.error("Error uploading avatar:", error);
        // Fallback to local preview
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          setAvatarUrl(url);
          setValue("avatar", url);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Testimonial</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Add New Testimonial</span>
          </DialogTitle>
          <DialogDescription>
            Add a new customer testimonial to showcase your work.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter customer name"
                    {...register("name")}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    placeholder="Enter company name"
                    {...register("company")}
                    className={errors.company ? "border-destructive" : ""}
                  />
                  {errors.company && (
                    <p className="text-sm text-destructive">
                      {errors.company.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">Profile Picture (Optional)</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar preview"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("avatar")?.click()}
                      className="flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Photo</span>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG up to 2MB
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Testimonial Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating *</Label>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {renderStars(rating, true)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({rating}/5)
                  </span>
                </div>
                {errors.rating && (
                  <p className="text-sm text-destructive">
                    {errors.rating.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Testimonial Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Enter the testimonial message..."
                  {...register("message")}
                  rows={6}
                  className={errors.message ? "border-destructive" : ""}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{watch("message")?.length || 0} characters</span>
                  <span>Minimum 20 characters</span>
                </div>
                {errors.message && (
                  <p className="text-sm text-destructive">
                    {errors.message.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {watch("name") && watch("message") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={watch("name")}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {watch("name")?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-sm">{watch("name")}</h4>
                      <p className="text-xs text-muted-foreground">
                        {watch("company")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(rating)}
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "{watch("message")}"
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

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
              {isSubmitting ? "Adding..." : "Add Testimonial"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
