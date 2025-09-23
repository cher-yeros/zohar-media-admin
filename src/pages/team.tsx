import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
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
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Instagram,
  Users,
  UserPlus,
  Search,
  Filter,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";
import { GET_TEAM_MEMBERS } from "@/lib/graphql/queries";
import {
  CREATE_TEAM_MEMBER,
  UPDATE_TEAM_MEMBER,
  DELETE_TEAM_MEMBER,
} from "@/lib/graphql/mutations";
import {
  TeamMember,
  TeamMemberFormData,
  CreateTeamMemberInput,
  UpdateTeamMemberInput,
} from "@/lib/types/team";

export function Team() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: "",
    role: "",
    email: "",
    phone: "",
    bio: "",
    skills: [],
    status: "active",
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

  const handleAddMember = async () => {
    try {
      const socialLinks = [];
      if (formData.linkedin)
        socialLinks.push({ platform: "linkedin", url: formData.linkedin });
      if (formData.twitter)
        socialLinks.push({ platform: "twitter", url: formData.twitter });
      if (formData.instagram)
        socialLinks.push({ platform: "instagram", url: formData.instagram });

      const input: CreateTeamMemberInput = {
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone || null,
        avatar_url: formData.avatarUrl || null,
        bio: formData.bio || null,
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
            "Failed to create team member"
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
    }
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);

    // Extract social links
    const linkedin =
      member.social_links.find((link) => link.platform === "linkedin")?.url ||
      "";
    const twitter =
      member.social_links.find((link) => link.platform === "twitter")?.url ||
      "";
    const instagram =
      member.social_links.find((link) => link.platform === "instagram")?.url ||
      "";

    setFormData({
      name: member.name,
      role: member.role,
      email: member.email,
      phone: member.phone || "",
      bio: member.bio || "",
      skills: member.skills.map((skill) => skill.skill_name),
      status: member.status,
      linkedin,
      twitter,
      instagram,
      joinDate: member.join_date.split("T")[0],
      avatarUrl: member.avatar_url || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;

    try {
      const socialLinks = [];
      if (formData.linkedin)
        socialLinks.push({ platform: "linkedin", url: formData.linkedin });
      if (formData.twitter)
        socialLinks.push({ platform: "twitter", url: formData.twitter });
      if (formData.instagram)
        socialLinks.push({ platform: "instagram", url: formData.instagram });

      const input: UpdateTeamMemberInput = {
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone || null,
        avatar_url: formData.avatarUrl || null,
        bio: formData.bio || null,
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
            "Failed to update team member"
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
            "Failed to delete team member"
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
      status: "active",
      linkedin: "",
      twitter: "",
      instagram: "",
      joinDate: new Date().toISOString().split("T")[0],
      avatarUrl: "",
    });
  };

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const uniqueRoles = Array.from(
    new Set(teamMembers.map((member) => member.role))
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
              onSubmit={handleAddMember}
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
              Total Team Members
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              {teamMembers.filter((m) => m.status === "active").length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Members
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamMembers.filter((m) => m.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueRoles.length}</div>
            <p className="text-xs text-muted-foreground">Different positions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage and view all team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {uniqueRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {member.avatar_url ? (
                          <img
                            src={member.avatar_url}
                            alt={member.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-primary">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.skills
                            .slice(0, 2)
                            .map((skill) => skill.skill_name)
                            .join(", ")}
                          {member.skills.length > 2 && "..."}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-3 w-3" />
                        <span>{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(member.join_date)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        member.status === "active" ? "default" : "secondary"
                      }
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditMember(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
  onSubmit,
  onCancel,
}: {
  formData: TeamMemberFormData;
  setFormData: (data: TeamMemberFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const handleSkillsChange = (value: string) => {
    const skills = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    setFormData({ ...formData, skills });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
        <div>
          <Label htmlFor="avatarUrl">Avatar URL</Label>
          <Input
            id="avatarUrl"
            value={formData.avatarUrl}
            onChange={(e) =>
              setFormData({ ...formData, avatarUrl: e.target.value })
            }
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
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
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {formData.name ? "Update" : "Add"} Member
        </Button>
      </div>
    </div>
  );
}
