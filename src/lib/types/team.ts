// Team Types based on GraphQL Schema

export interface TeamMemberSkill {
  id: string;
  skill_name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberSocialLink {
  id: string;
  platform: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  join_date: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  skills: TeamMemberSkill[];
  social_links: TeamMemberSocialLink[];
}

export interface TeamMemberResponse {
  success: boolean;
  message: string;
  teamMember?: TeamMember;
}

// Input types for mutations
export interface CreateTeamMemberInput {
  name: string;
  role: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  join_date: string;
  status?: string;
  skills?: string[];
  social_links?: TeamMemberSocialLinkInput[];
}

export interface UpdateTeamMemberInput {
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  status?: string;
  skills?: string[];
  social_links?: TeamMemberSocialLinkInput[];
}

export interface TeamMemberSocialLinkInput {
  platform: string;
  url: string;
}

// Form data types for UI
export interface TeamMemberFormData {
  name: string;
  role: string;
  email: string;
  phone: string;
  bio: string;
  skills: string[];
  status: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  joinDate: string;
  avatarUrl: string;
}
