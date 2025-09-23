// Portfolio Types based on GraphQL Schema

export enum PortfolioItemStatus {
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
  DRAFT = "DRAFT",
}

export interface PortfolioCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
  updated_at: string;
  portfolio_items?: PortfolioItem[];
}

export interface PortfolioItemImage {
  id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
}

export interface PortfolioItemTag {
  id: string;
  tag_name: string;
}

export interface PortfolioItemTechnology {
  id: string;
  technology_name: string;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar_url?: string;
}

export interface PortfolioItemTeamMember {
  id: string;
  role?: string;
  team_member: TeamMember;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  client_name?: string;
  project_date: string;
  status: PortfolioItemStatus;
  featured: boolean;
  project_url?: string;
  testimonial?: string;
  createdAt: string;
  updated_at: string;
  category?: PortfolioCategory;
  images: PortfolioItemImage[];
  tags: PortfolioItemTag[];
  technologies: PortfolioItemTechnology[];
  team_members: PortfolioItemTeamMember[];
}

export interface PortfolioItemsResponse {
  items: PortfolioItem[];
  total: number;
}

export interface PortfolioItemResponse {
  success: boolean;
  message: string;
  portfolioItem?: PortfolioItem;
}

export interface PortfolioCategoryResponse {
  success: boolean;
  message: string;
  category?: PortfolioCategory;
}

// Input types for mutations
export interface PortfolioItemImageInput {
  image_url: string;
  alt_text?: string;
  sort_order?: number;
}

export interface PortfolioItemTeamMemberInput {
  team_member_id: string;
  role?: string;
}

export interface CreatePortfolioItemInput {
  title: string;
  description: string;
  category_id?: string;
  thumbnail_url?: string;
  client_name?: string;
  project_date: string;
  status?: PortfolioItemStatus;
  featured?: boolean;
  project_url?: string;
  testimonial?: string;
  images?: PortfolioItemImageInput[];
  tags?: string[];
  technologies?: string[];
  team_members?: PortfolioItemTeamMemberInput[];
}

export interface UpdatePortfolioItemInput {
  title?: string;
  description?: string;
  category_id?: string;
  thumbnail_url?: string;
  client_name?: string;
  project_date?: string;
  status?: PortfolioItemStatus;
  featured?: boolean;
  project_url?: string;
  testimonial?: string;
  images?: PortfolioItemImageInput[];
  tags?: string[];
  technologies?: string[];
  team_members?: PortfolioItemTeamMemberInput[];
}

export interface CreatePortfolioCategoryInput {
  name: string;
  description?: string;
  color: string;
}

export interface UpdatePortfolioCategoryInput {
  id: string;
  name?: string;
  description?: string;
  color?: string;
}

export interface PortfolioCategoryFormData {
  name: string;
  description: string;
  color: string;
}

// Form data types for UI
export interface PortfolioItemFormData {
  title: string;
  description: string;
  categoryId: string;
  client: string;
  status: PortfolioItemStatus;
  tags: string[];
  teamMembers: string[];
  featured: boolean;
  technologies: string[];
  projectUrl: string;
  testimonial: string;
  projectDate: string;
  thumbnailUrl: string;
}

export interface PortfolioCategoryFormData {
  name: string;
  description: string;
  color: string;
}
