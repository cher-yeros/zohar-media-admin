// User Types
export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  EDITOR = "EDITOR",
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  avatar_url?: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  avatar_url?: string;
}

export interface UpdateUserInput {
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  avatar_url?: string;
  is_active?: boolean;
}

// Team Member Types
export enum TeamMemberStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface TeamMemberSkill {
  id: string;
  team_member_id: string;
  skill_name: string;
  created_at: string;
}

export interface TeamMemberSocialLink {
  id: string;
  team_member_id: string;
  platform: string;
  url: string;
  created_at: string;
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
  status: TeamMemberStatus;
  created_at: string;
  updated_at: string;
  skills: TeamMemberSkill[];
  social_links: TeamMemberSocialLink[];
}

export interface CreateTeamMemberInput {
  name: string;
  role: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  join_date: string;
  status: TeamMemberStatus;
  skills?: Array<{ skill_name: string }>;
  social_links?: Array<{ platform: string; url: string }>;
}

export interface UpdateTeamMemberInput {
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  status?: TeamMemberStatus;
  skills?: Array<{ skill_name: string }>;
  social_links?: Array<{ platform: string; url: string }>;
}

// Portfolio Types
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
  created_at: string;
  updated_at: string;
}

export interface PortfolioItemImage {
  id: string;
  portfolio_item_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  created_at: string;
}

export interface PortfolioItemTag {
  id: string;
  portfolio_item_id: string;
  tag_name: string;
  created_at: string;
}

export interface PortfolioItemTechnology {
  id: string;
  portfolio_item_id: string;
  technology_name: string;
  created_at: string;
}

export interface PortfolioItemTeamMember {
  id: string;
  portfolio_item_id: string;
  team_member_id: string;
  role?: string;
  created_at: string;
  team_member: TeamMember;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category_id?: string;
  thumbnail_url?: string;
  client_name?: string;
  project_date: string;
  status: PortfolioItemStatus;
  featured: boolean;
  project_url?: string;
  testimonial?: string;
  created_at: string;
  updated_at: string;
  category?: PortfolioCategory;
  images: PortfolioItemImage[];
  tags: PortfolioItemTag[];
  technologies: PortfolioItemTechnology[];
  team_members: PortfolioItemTeamMember[];
}

export interface CreatePortfolioItemInput {
  title: string;
  description: string;
  category_id?: string;
  thumbnail_url?: string;
  client_name?: string;
  project_date: string;
  status: PortfolioItemStatus;
  featured: boolean;
  project_url?: string;
  testimonial?: string;
  images?: Array<{
    image_url: string;
    alt_text?: string;
    sort_order: number;
  }>;
  tags?: Array<{ tag_name: string }>;
  technologies?: Array<{ technology_name: string }>;
  team_members?: Array<{
    team_member_id: string;
    role?: string;
  }>;
}

export interface CreatePortfolioCategoryInput {
  name: string;
  description?: string;
  color: string;
}

// Inquiry Types
export enum InquiryStatus {
  UNREAD = "UNREAD",
  RESPONDED = "RESPONDED",
  RESOLVED = "RESOLVED",
}

export enum InquiryType {
  GENERAL = "GENERAL",
  COLLABORATION = "COLLABORATION",
  PRICING = "PRICING",
  SUPPORT = "SUPPORT",
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiry_date: string;
  status: InquiryStatus;
  type: InquiryType;
  assigned_to?: string;
  response?: string;
  response_date?: string;
  created_at: string;
  updated_at: string;
  assigned_team_member?: TeamMember;
}

export interface CreateInquiryInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: InquiryType;
}

export interface UpdateInquiryInput {
  status?: InquiryStatus;
  assigned_to?: string;
  response?: string;
}

// Testimonial Types
export enum TestimonialStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface Testimonial {
  id: string;
  name: string;
  company?: string;
  message: string;
  rating?: number;
  testimonial_date: string;
  status: TestimonialStatus;
  featured: boolean;
  avatar_url?: string;
  portfolio_item_id?: string;
  created_at: string;
  updated_at: string;
  portfolio_item?: PortfolioItem;
}

export interface CreateTestimonialInput {
  name: string;
  company?: string;
  message: string;
  rating?: number;
  testimonial_date: string;
  status: TestimonialStatus;
  featured: boolean;
  avatar_url?: string;
  portfolio_item_id?: string;
}

export interface UpdateTestimonialInput {
  name?: string;
  company?: string;
  message?: string;
  rating?: number;
  status?: TestimonialStatus;
  featured?: boolean;
  avatar_url?: string;
  portfolio_item_id?: string;
}

// Media Types
export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

export interface MediaItemTag {
  id: string;
  media_item_id: string;
  tag_name: string;
  created_at: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  url: string;
  thumbnail_url?: string;
  file_size?: string;
  dimensions?: string;
  duration?: string;
  upload_date: string;
  created_at: string;
  updated_at: string;
  tags: MediaItemTag[];
}

export interface CreateMediaItemInput {
  title: string;
  type: MediaType;
  url: string;
  thumbnail_url?: string;
  file_size?: string;
  dimensions?: string;
  duration?: string;
  tags?: Array<{ tag_name: string }>;
}

// Analytics Types
export interface AnalyticsData {
  id: string;
  date: string;
  visitors_today: number;
  visitors_this_week: number;
  visitors_this_month: number;
  visitor_trend: number;
  inquiries_total: number;
  inquiries_this_month: number;
  inquiry_trend: number;
  media_total_views: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessStatistics {
  id: string;
  completed_projects: number;
  happy_clients: number;
  perspective_clients: number;
  total_revenue: number;
  average_project_value: number;
  is_public: boolean;
  auto_update: boolean;
  created_at: string;
  updated_at: string;
}

// System Types
export enum Theme {
  LIGHT = "LIGHT",
  DARK = "DARK",
}

export interface SystemSettings {
  id: string;
  business_name: string;
  business_description?: string;
  industry?: string;
  website_url?: string;
  contact_email?: string;
  theme: Theme;
  created_at: string;
  updated_at: string;
}

export interface UpdateSystemSettingsInput {
  business_name?: string;
  business_description?: string;
  industry?: string;
  website_url?: string;
  contact_email?: string;
  theme?: Theme;
}

export interface ActivityLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  description?: string;
  metadata?: any;
  created_at: string;
  user?: User;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

// GraphQL Response Types
export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: Array<string | number>;
    extensions?: {
      code: string;
      http?: {
        status: number;
      };
    };
  }>;
}
