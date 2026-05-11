import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutUser, patchCurrentUser } from "@/redux/slices/authSlice";
import type { User } from "@/lib/types/api";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  KeyRound,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@apollo/client";
import { CHANGE_PASSWORD, UPDATE_USER } from "@/lib/graphql/mutations";
import {
  profileSelfSchema,
  changePasswordSchema,
  ProfileSelfFormData,
  ChangePasswordFormData,
} from "@/lib/schemas/validation";
import { uploadFile, validateFile } from "@/lib/api/file-upload";
import { config } from "@/lib/config";
import { store } from "@/redux/store";
import { normalizeAuthUser } from "@/lib/auth/normalize-auth-user";

export function Profile() {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { toast } = useToast();

  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [avatarClearPending, setAvatarClearPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewUrl = useMemo(() => {
    if (pendingAvatarFile) {
      return URL.createObjectURL(pendingAvatarFile);
    }
    return null;
  }, [pendingAvatarFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const [updateUserMut, { loading: savingProfile }] = useMutation(UPDATE_USER);
  const [changePasswordMut, { loading: changingPassword }] =
    useMutation(CHANGE_PASSWORD);

  const profileForm = useForm<ProfileSelfFormData>({
    resolver: zodResolver(profileSelfSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
    },
  });

  const { reset: resetProfile, handleSubmit: handleProfileSubmit } =
    profileForm;

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = passwordForm;

  useEffect(() => {
    if (currentUser) {
      resetProfile({
        email: currentUser.email,
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
      });
    }
  }, [currentUser, resetProfile]);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem(config.tokenKey);
    localStorage.removeItem(config.userKey);
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200";
      case "MANAGER":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200";
      case "EDITOR":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const displayAvatarSrc = avatarClearPending
    ? undefined
    : previewUrl || currentUser.avatar_url;

  const initial = (
    currentUser.first_name?.charAt(0) ||
    currentUser.email?.charAt(0) ||
    "?"
  ).toUpperCase();

  const persistUser = (next: User) => {
    dispatch(patchCurrentUser(next));
    const fromStore = store.getState().auth.currentUser;
    if (fromStore) {
      localStorage.setItem(config.userKey, JSON.stringify(fromStore));
    }
  };

  const onSaveProfile = async (data: ProfileSelfFormData) => {
    if (!currentUser) return;

    let avatar_url = currentUser.avatar_url ?? "";

    if (pendingAvatarFile) {
      const check = validateFile(pendingAvatarFile, config.maxFileSize, [
        ...config.allowedImageTypes,
      ]);
      if (!check.valid) {
        toast({
          title: "Invalid image",
          description: check.error,
          variant: "destructive",
        });
        return;
      }
      const uploaded = await uploadFile(pendingAvatarFile, {
        folder: "avatars",
      });
      if (
        !uploaded.success ||
        typeof uploaded.fileName !== "string" ||
        uploaded.fileName.length === 0
      ) {
        toast({
          title: "Upload failed",
          description: uploaded.message ?? uploaded.error ?? "Try again.",
          variant: "destructive",
        });
        return;
      }
      avatar_url = uploaded.fileName;
    } else if (avatarClearPending) {
      avatar_url = "";
    }

    try {
      const result = await updateUserMut({
        variables: {
          id: currentUser.id,
          email: data.email.trim(),
          first_name: data.first_name.trim(),
          last_name: data.last_name.trim(),
          avatar_url,
        },
      });

      const payload = result.data?.updateUser;
      if (payload?.success && payload.user) {
        const next = normalizeAuthUser(
          payload.user as Parameters<typeof normalizeAuthUser>[0],
        );
        persistUser(next);
        setPendingAvatarFile(null);
        setAvatarClearPending(false);
        resetProfile({
          email: next.email,
          first_name: next.first_name,
          last_name: next.last_name,
        });
        toast({
          title: "Profile updated",
          description: payload.message ?? "Your changes have been saved.",
        });
      } else {
        toast({
          title: "Update failed",
          description: payload?.message ?? "Could not save profile.",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Update failed",
        description: e instanceof Error ? e.message : "Unexpected error.",
        variant: "destructive",
      });
    }
  };

  const onChangePassword = async (data: ChangePasswordFormData) => {
    try {
      const result = await changePasswordMut({
        variables: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      });
      const payload = result.data?.changePassword;
      if (payload?.success) {
        resetPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast({
          title: "Password changed",
          description: payload.message ?? "Use your new password next time.",
        });
      } else {
        toast({
          title: "Could not change password",
          description: payload?.message ?? "Try again.",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Could not change password",
        description: e instanceof Error ? e.message : "Unexpected error.",
        variant: "destructive",
      });
    }
  };

  const {
    register,
    formState: { errors: profileErrors },
  } = profileForm;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Update your details and password. Role is managed by an
            administrator.
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Sign out
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5" />
              <span>Overview</span>
            </CardTitle>
            <CardDescription>
              Account summary (read-only except via the forms beside this card)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                {displayAvatarSrc ? (
                  <img
                    src={displayAvatarSrc}
                    alt=""
                    className="h-16 w-16 object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-primary">
                    {initial}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold">
                  {currentUser.first_name} {currentUser.last_name}
                </h3>
                <Badge className={getRoleColor(currentUser.role)}>
                  {currentUser.role}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground break-all">
                    {currentUser.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {currentUser.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Member since</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(currentUser.createdAt)}
                  </p>
                </div>
              </div>

              {currentUser.last_login_at && (
                <div className="flex items-start space-x-3">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <Label className="text-sm font-medium">Last login</Label>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(currentUser.last_login_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Edit profile</CardTitle>
            <CardDescription>
              Name, email, and profile photo. Role cannot be changed here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => void handleProfileSubmit(onSaveProfile)(e)}
            >
              <div className="space-y-2">
                <Label>Profile photo</Label>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose image
                  </Button>
                  {(pendingAvatarFile ||
                    (!avatarClearPending && currentUser.avatar_url)) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={() => {
                        setPendingAvatarFile(null);
                        setAvatarClearPending(true);
                      }}
                    >
                      Remove photo
                    </Button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={config.allowedImageTypes.join(",")}
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setPendingAvatarFile(f);
                        setAvatarClearPending(false);
                      }
                      e.target.value = "";
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, GIF, WebP · up to{" "}
                  {Math.round(config.maxFileSize / (1024 * 1024))}MB
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="first_name">First name</Label>
                <Input
                  id="first_name"
                  {...register("first_name")}
                  className={
                    profileErrors.first_name ? "border-destructive" : ""
                  }
                />
                {profileErrors.first_name && (
                  <p className="text-sm text-destructive">
                    {profileErrors.first_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last name</Label>
                <Input
                  id="last_name"
                  {...register("last_name")}
                  className={
                    profileErrors.last_name ? "border-destructive" : ""
                  }
                />
                {profileErrors.last_name && (
                  <p className="text-sm text-destructive">
                    {profileErrors.last_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={profileErrors.email ? "border-destructive" : ""}
                />
                {profileErrors.email && (
                  <p className="text-sm text-destructive">
                    {profileErrors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-role">Role</Label>
                <Input
                  id="profile-role"
                  value={currentUser.role}
                  disabled
                  className="bg-muted"
                  readOnly
                />
              </div>

              <Button type="submit" className="w-full" disabled={savingProfile}>
                {savingProfile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save profile"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Change password
          </CardTitle>
          <CardDescription>
            Enter your current password, then choose a new one (min. 8
            characters).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => void handlePasswordSubmit(onChangePassword)(e)}
          >
            <div className="space-y-2">
              <Label htmlFor="current_password">Current password</Label>
              <Input
                id="current_password"
                type="password"
                autoComplete="current-password"
                {...registerPassword("currentPassword")}
                className={
                  passwordErrors.currentPassword ? "border-destructive" : ""
                }
              />
              {passwordErrors.currentPassword && (
                <p className="text-sm text-destructive">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password">New password</Label>
              <Input
                id="new_password"
                type="password"
                autoComplete="new-password"
                {...registerPassword("newPassword")}
                className={
                  passwordErrors.newPassword ? "border-destructive" : ""
                }
              />
              {passwordErrors.newPassword && (
                <p className="text-sm text-destructive">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm new password</Label>
              <Input
                id="confirm_password"
                type="password"
                autoComplete="new-password"
                {...registerPassword("confirmPassword")}
                className={
                  passwordErrors.confirmPassword ? "border-destructive" : ""
                }
              />
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={changingPassword}>
              {changingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating…
                </>
              ) : (
                "Update password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
