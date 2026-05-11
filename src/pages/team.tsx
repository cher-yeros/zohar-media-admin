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
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  CREATE_TEAM_MEMBER,
  DELETE_TEAM_MEMBER,
  UPDATE_TEAM_MEMBER,
} from "@/lib/graphql/mutations";
import { GET_TEAM_MEMBERS } from "@/lib/graphql/queries";
import {
  CreateTeamMemberInput,
  TeamMember,
  TeamMemberFormData,
  UpdateTeamMemberInput,
} from "@/lib/types/team";
import { uploadFile, validateFile } from "@/lib/api/file-upload";
import { formatDate } from "@/lib/utils";
import { useMutation, useQuery } from "@apollo/client";
import {
  Edit,
  Eye,
  Loader2,
  Mail,
  Phone,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

/** GraphQL `TeamMemberStatus` is ACTIVE | INACTIVE; DB may expose legacy lowercase. */
function normalizeStatusForForm(status: string): "ACTIVE" | "INACTIVE" {
  const u = status.toUpperCase();
  if (u === "ACTIVE") return "ACTIVE";
  if (u === "INACTIVE") return "INACTIVE";
  if (status === "active") return "ACTIVE";
  if (status === "inactive") return "INACTIVE";
  return "ACTIVE";
}

function isActiveMemberStatus(status: string): boolean {
  const u = status.toUpperCase();
  return u === "ACTIVE" || status === "active";
}

function memberStatusLabel(status: string) {
  return status.replace(/_/g, " ").toLowerCase();
}

function TeamMemberCardPreview({ member }: { member: TeamMember }) {
  if (member.avatar_url) {
    return (
      <img
        src={member.avatar_url}
        alt={member.name}
        className="h-full w-full object-cover object-top"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <Users className="h-16 w-16 text-muted-foreground" />
    </div>
  );
}

export function Team() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] =
    useState<TeamMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: "",
    role: "",
    email: "",
    phone: "",
    bio: "",
    skills: [],
    status: "ACTIVE",
    linkedin: "",
    twitter: "",
    instagram: "",
    joinDate: new Date().toISOString().split("T")[0],
    avatarUrl: "",
  });

  // Apollo Client queries
  const {
    data: teamData,
    loading: teamLoading,
    refetch: refetchTeam,
  } = useQuery(GET_TEAM_MEMBERS);

  // Apollo Client mutations
  const [createTeamMember] = useMutation(CREATE_TEAM_MEMBER);
  const [updateTeamMember] = useMutation(UPDATE_TEAM_MEMBER);
  const [deleteTeamMember] = useMutation(DELETE_TEAM_MEMBER);

  const teamMembers = teamData?.teamMembers || [];
  const isLoading = teamLoading;

  const handleAddMember = async (avatarFile: File | null) => {
    setIsSubmitting(true);
    try {
      const socialLinks = [];
      if (formData.linkedin)
        socialLinks.push({ platform: "linkedin", url: formData.linkedin });
      if (formData.twitter)
        socialLinks.push({ platform: "twitter", url: formData.twitter });
      if (formData.instagram)
        socialLinks.push({ platform: "instagram", url: formData.instagram });

      let avatar_url = formData.avatarUrl || undefined;
      if (avatarFile) {
        const uploadResult = await uploadFile(avatarFile, {
          folder: "avatars",
        });
        if (!uploadResult.fileName) {
          throw new Error(
            uploadResult.message || "Failed to upload team photo",
          );
        }
        avatar_url = uploadResult.fileName;
      }

      const input: CreateTeamMemberInput = {
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone || undefined,
        avatar_url,
        bio: formData.bio || undefined,
        join_date: formData.joinDate,
        status: formData.status,
        skills: formData.skills,
        social_links: socialLinks,
      };

      const result = await createTeamMember({
        variables: input,
      });

      if (result.data?.createTeamMember?.success) {
        setIsAddDialogOpen(false);
        resetForm();
        refetchTeam();
        toast({
          title: "Team member added",
          description: `${formData.name} has been added to the team.`,
        });
      } else {
        throw new Error(
          result.data?.createTeamMember?.message ||
            "Failed to create team member",
        );
      }
    } catch (error) {
      console.error("Error creating team member:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add team member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);

    // Extract social links
    const linkedin =
      member.social_links.find((link: any) => link.platform === "linkedin")
        ?.url || "";
    const twitter =
      member.social_links.find((link: any) => link.platform === "twitter")
        ?.url || "";
    const instagram =
      member.social_links.find((link: any) => link.platform === "instagram")
        ?.url || "";

    setFormData({
      name: member.name,
      role: member.role,
      email: member.email,
      phone: member.phone || "",
      bio: member.bio || "",
      skills: member.skills.map((skill) => skill.skill_name),
      status: normalizeStatusForForm(member.status),
      linkedin,
      twitter,
      instagram,
      joinDate: member.join_date.split("T")[0],
      avatarUrl: member.avatar_url || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateMember = async (avatarFile: File | null) => {
    if (!editingMember) return;

    setIsSubmitting(true);
    try {
      const socialLinks = [];
      if (formData.linkedin)
        socialLinks.push({ platform: "linkedin", url: formData.linkedin });
      if (formData.twitter)
        socialLinks.push({ platform: "twitter", url: formData.twitter });
      if (formData.instagram)
        socialLinks.push({ platform: "instagram", url: formData.instagram });

      let avatar_url = formData.avatarUrl || undefined;
      if (avatarFile) {
        const uploadResult = await uploadFile(avatarFile, {
          folder: "avatars",
        });
        if (!uploadResult.fileName) {
          throw new Error(
            uploadResult.message || "Failed to upload team photo",
          );
        }
        avatar_url = uploadResult.fileName;
      }

      const input: UpdateTeamMemberInput = {
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone || undefined,
        avatar_url,
        bio: formData.bio || undefined,
        status: formData.status,
        skills: formData.skills,
        social_links: socialLinks,
      };

      const result = await updateTeamMember({
        variables: {
          id: editingMember.id,
          ...input,
        },
      });

      if (result.data?.updateTeamMember?.success) {
        setIsEditDialogOpen(false);
        setEditingMember(null);
        resetForm();
        refetchTeam();
        toast({
          title: "Team member updated",
          description: `${formData.name}'s information has been updated.`,
        });
      } else {
        throw new Error(
          result.data?.updateTeamMember?.message ||
            "Failed to update team member",
        );
      }
    } catch (error) {
      console.error("Error updating team member:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update team member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      const result = await deleteTeamMember({
        variables: { id: memberId },
      });

      if (result.data?.deleteTeamMember?.success) {
        refetchTeam();
        toast({
          title: "Team member removed",
          description: "The team member has been removed from the team.",
        });
      } else {
        throw new Error(
          result.data?.deleteTeamMember?.message ||
            "Failed to delete team member",
        );
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete team member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      email: "",
      phone: "",
      bio: "",
      skills: [],
      status: "ACTIVE",
      linkedin: "",
      twitter: "",
      instagram: "",
      joinDate: new Date().toISOString().split("T")[0],
      avatarUrl: "",
    });
  };

  const filteredMembers = teamMembers.filter((member: TeamMember) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const uniqueRoles = Array.from(
    new Set(teamMembers.map((member: TeamMember) => member.role)),
  );

  if (isLoading) {
    return <Loading type="page" />;
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">
            Manage your team members and their information.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
              <DialogDescription>
                Add a new team member to your organization.
              </DialogDescription>
            </DialogHeader>
            <TeamMemberForm
              formData={formData}
              setFormData={setFormData}
              mode="create"
              dialogOpen={isAddDialogOpen}
              isSubmitting={isSubmitting}
              onSubmit={handleAddMember}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {
                teamMembers.filter((m: TeamMember) =>
                  isActiveMemberStatus(m.status),
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {uniqueRoles.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, role, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {uniqueRoles.map((role) => (
                  <SelectItem key={String(role)} value={String(role)}>
                    {String(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Team grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMembers.map((member: TeamMember) => (
          <Card key={member.id} className="group card-hover overflow-hidden">
            <div className="relative aspect-video bg-muted">
              <TeamMemberCardPreview member={member} />
              <div className="absolute top-2 right-2">
                <Badge
                  variant={
                    isActiveMemberStatus(member.status)
                      ? "default"
                      : "secondary"
                  }
                  className="flex items-center gap-1 capitalize shadow-sm"
                >
                  {memberStatusLabel(member.status)}
                </Badge>
              </div>
              <div className="absolute inset-0 flex items-center justify-center space-x-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedTeamMember(member)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{selectedTeamMember?.name}</DialogTitle>
                      <DialogDescription>
                        {selectedTeamMember?.role}
                        {selectedTeamMember && (
                          <>
                            {" "}
                            · Joined {formatDate(selectedTeamMember.join_date)}
                          </>
                        )}
                      </DialogDescription>
                    </DialogHeader>
                    {selectedTeamMember && (
                      <div className="space-y-4">
                        <div className="mx-auto aspect-square w-48 overflow-hidden rounded-full border bg-muted">
                          {selectedTeamMember.avatar_url ? (
                            <img
                              src={selectedTeamMember.avatar_url}
                              alt={selectedTeamMember.name}
                              className="h-full w-full object-cover object-top"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Users className="h-16 w-16 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant={
                              isActiveMemberStatus(selectedTeamMember.status)
                                ? "default"
                                : "secondary"
                            }
                            className="capitalize"
                          >
                            {memberStatusLabel(selectedTeamMember.status)}
                          </Badge>
                          <Badge variant="outline">
                            {selectedTeamMember.role}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <a
                              href={`mailto:${selectedTeamMember.email}`}
                              className="text-primary hover:underline"
                            >
                              {selectedTeamMember.email}
                            </a>
                          </div>
                          {selectedTeamMember.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                              <span>{selectedTeamMember.phone}</span>
                            </div>
                          )}
                        </div>
                        {selectedTeamMember.bio && (
                          <p className="text-sm text-muted-foreground">
                            {selectedTeamMember.bio}
                          </p>
                        )}
                        <div>
                          <span className="text-sm font-medium">Skills</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {selectedTeamMember.skills.length === 0 ? (
                              <span className="text-sm text-muted-foreground">
                                —
                              </span>
                            ) : (
                              selectedTeamMember.skills.map((skill) => (
                                <Badge key={skill.id} variant="outline">
                                  {skill.skill_name}
                                </Badge>
                              ))
                            )}
                          </div>
                        </div>
                        {selectedTeamMember.social_links.length > 0 && (
                          <div>
                            <span className="text-sm font-medium">
                              Social links
                            </span>
                            <div className="mt-1 flex flex-col gap-1 text-sm">
                              {selectedTeamMember.social_links.map((link) => (
                                <a
                                  key={link.id}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline capitalize"
                                >
                                  {link.platform}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleEditMember(member)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteMember(member.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="mb-2 line-clamp-1 text-sm font-semibold">
                {member.name}
              </h3>
              <div className="mb-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="line-clamp-1">{member.role}</span>
                <span className="shrink-0">{formatDate(member.join_date)}</span>
              </div>
              <div className="mb-2 line-clamp-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Mail className="h-3 w-3 shrink-0" />
                <span className="line-clamp-1">{member.email}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {member.skills.slice(0, 3).map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="outline"
                    className="text-xs font-normal"
                  >
                    {skill.skill_name}
                  </Badge>
                ))}
                {member.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{member.skills.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No team members</h3>
            <p className="mb-4 text-center text-muted-foreground">
              {searchTerm || filterRole !== "all"
                ? "Try adjusting your search or role filter"
                : "Add your first team member to get started"}
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update team member information.
            </DialogDescription>
          </DialogHeader>
          <TeamMemberForm
            formData={formData}
            setFormData={setFormData}
            mode="edit"
            dialogOpen={isEditDialogOpen}
            isSubmitting={isSubmitting}
            onSubmit={handleUpdateMember}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingMember(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Team Member Form Component
function TeamMemberForm({
  formData,
  setFormData,
  mode,
  dialogOpen,
  isSubmitting,
  onSubmit,
  onCancel,
}: {
  formData: TeamMemberFormData;
  setFormData: (data: TeamMemberFormData) => void;
  mode: "create" | "edit";
  dialogOpen: boolean;
  isSubmitting: boolean;
  onSubmit: (avatarFile: File | null) => void | Promise<void>;
  onCancel: () => void;
}) {
  const { toast } = useToast();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  useEffect(() => {
    if (!dialogOpen) {
      setAvatarFile(null);
      setAvatarPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return "";
      });
    }
  }, [dialogOpen]);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview("");
    }

    if (!selected) {
      setAvatarFile(null);
      return;
    }

    const validation = validateFile(selected, 10 * 1024 * 1024, [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ]);
    if (!validation.valid) {
      toast({
        title: "Invalid image",
        description:
          validation.error ?? "Please choose a JPEG, PNG, GIF, or WebP image.",
        variant: "destructive",
      });
      e.target.value = "";
      setAvatarFile(null);
      return;
    }

    setAvatarFile(selected);
    setAvatarPreview(URL.createObjectURL(selected));
  };

  const displayAvatarSrc =
    avatarPreview || (formData.avatarUrl ? formData.avatarUrl : "");

  const handleSkillsChange = (value: string) => {
    const skills = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    setFormData({ ...formData, skills });
  };

  return (
    <div className="space-y-4">
      <fieldset
        disabled={isSubmitting}
        className="min-w-0 space-y-4 border-0 p-0 disabled:pointer-events-none disabled:opacity-60"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="joinDate">Join Date</Label>
            <Input
              id="joinDate"
              type="date"
              value={formData.joinDate}
              onChange={(e) =>
                setFormData({ ...formData, joinDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatarFile">Team photo</Label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
                {displayAvatarSrc ? (
                  <img
                    src={displayAvatarSrc}
                    alt="Team member preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Users className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <Input
                  id="avatarFile"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="cursor-pointer"
                  onChange={handleAvatarFileChange}
                />
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, GIF, or WebP, up to 10MB. A new upload replaces the
                  current photo.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="avatarUrl">Image URL (optional)</Label>
          <Input
            id="avatarUrl"
            value={formData.avatarUrl}
            onChange={(e) =>
              setFormData({ ...formData, avatarUrl: e.target.value })
            }
            placeholder="https://example.com/avatar.jpg — used if no file is selected"
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="skills">Skills (comma-separated)</Label>
          <Input
            id="skills"
            value={formData.skills.join(", ")}
            onChange={(e) => handleSkillsChange(e.target.value)}
            placeholder="e.g., Photography, Video Editing, Design"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={formData.linkedin}
              onChange={(e) =>
                setFormData({ ...formData, linkedin: e.target.value })
              }
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div>
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              value={formData.twitter}
              onChange={(e) =>
                setFormData({ ...formData, twitter: e.target.value })
              }
              placeholder="https://twitter.com/username"
            />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={formData.instagram}
              onChange={(e) =>
                setFormData({ ...formData, instagram: e.target.value })
              }
              placeholder="https://instagram.com/username"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({ ...formData, status: value })
            }
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </fieldset>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={() => void onSubmit(avatarFile)}
          type="button"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              {mode === "create" ? "Creating…" : "Updating…"}
            </>
          ) : mode === "create" ? (
            "Create Member"
          ) : (
            "Update Member"
          )}
        </Button>
      </div>
    </div>
  );
}
