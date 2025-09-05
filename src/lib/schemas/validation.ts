import { z } from "zod";

// User Schemas
export const userRoleSchema = z.enum(["ADMIN", "MANAGER", "EDITOR"]);

export const createUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  role: userRoleSchema,
  avatar_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

export const updateUserSchema = z.object({
  email: z.string().email("Please enter a valid email address").optional(),
  first_name: z.string().min(1, "First name is required").optional(),
  last_name: z.string().min(1, "Last name is required").optional(),
  role: userRoleSchema.optional(),
  avatar_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  is_active: z.boolean().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Team Member Schemas
export const teamMemberStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const teamMemberSkillSchema = z.object({
  skill_name: z.string().min(1, "Skill name is required"),
});

export const teamMemberSocialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Please enter a valid URL"),
});

export const createTeamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional().or(z.literal("")),
  avatar_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  join_date: z.string().min(1, "Join date is required"),
  status: teamMemberStatusSchema,
  skills: z.array(teamMemberSkillSchema).optional(),
  social_links: z.array(teamMemberSocialLinkSchema).optional(),
});

export const updateTeamMemberSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  role: z.string().min(1, "Role is required").optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  phone: z.string().optional().or(z.literal("")),
  avatar_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  status: teamMemberStatusSchema.optional(),
  skills: z.array(teamMemberSkillSchema).optional(),
  social_links: z.array(teamMemberSocialLinkSchema).optional(),
});

// Portfolio Schemas
export const portfolioItemStatusSchema = z.enum([
  "COMPLETED",
  "IN_PROGRESS",
  "DRAFT",
]);

export const portfolioItemImageSchema = z.object({
  image_url: z.string().url("Please enter a valid URL"),
  alt_text: z.string().optional(),
  sort_order: z.number().min(0, "Sort order must be non-negative"),
});

export const portfolioItemTagSchema = z.object({
  tag_name: z.string().min(1, "Tag name is required"),
});

export const portfolioItemTechnologySchema = z.object({
  technology_name: z.string().min(1, "Technology name is required"),
});

export const portfolioItemTeamMemberSchema = z.object({
  team_member_id: z.string().min(1, "Team member is required"),
  role: z.string().optional(),
});

export const createPortfolioItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category_id: z.string().optional(),
  thumbnail_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  client_name: z.string().optional().or(z.literal("")),
  project_date: z.string().min(1, "Project date is required"),
  status: portfolioItemStatusSchema,
  featured: z.boolean(),
  project_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  testimonial: z.string().optional().or(z.literal("")),
  images: z.array(portfolioItemImageSchema).optional(),
  tags: z.array(portfolioItemTagSchema).optional(),
  technologies: z.array(portfolioItemTechnologySchema).optional(),
  team_members: z.array(portfolioItemTeamMemberSchema).optional(),
});

export const createPortfolioCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().or(z.literal("")),
  color: z.string().min(1, "Color is required"),
});

// Inquiry Schemas
export const inquiryStatusSchema = z.enum(["UNREAD", "RESPONDED", "RESOLVED"]);
export const inquiryTypeSchema = z.enum([
  "GENERAL",
  "COLLABORATION",
  "PRICING",
  "SUPPORT",
]);

export const createInquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  type: inquiryTypeSchema,
});

export const updateInquirySchema = z.object({
  status: inquiryStatusSchema.optional(),
  assigned_to: z.string().optional(),
  response: z.string().optional(),
});

// Testimonial Schemas
export const testimonialStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const createTestimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional().or(z.literal("")),
  message: z.string().min(20, "Message must be at least 20 characters"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5")
    .optional(),
  testimonial_date: z.string().min(1, "Testimonial date is required"),
  status: testimonialStatusSchema,
  featured: z.boolean(),
  avatar_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  portfolio_item_id: z.string().optional(),
});

export const updateTestimonialSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  company: z.string().optional().or(z.literal("")),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .optional(),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5")
    .optional(),
  status: testimonialStatusSchema.optional(),
  featured: z.boolean().optional(),
  avatar_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  portfolio_item_id: z.string().optional(),
});

// Media Schemas
export const mediaTypeSchema = z.enum(["IMAGE", "VIDEO"]);

export const mediaItemTagSchema = z.object({
  tag_name: z.string().min(1, "Tag name is required"),
});

export const createMediaItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: mediaTypeSchema,
  url: z.string().url("Please enter a valid URL"),
  thumbnail_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  file_size: z.string().optional().or(z.literal("")),
  dimensions: z.string().optional().or(z.literal("")),
  duration: z.string().optional().or(z.literal("")),
  tags: z.array(mediaItemTagSchema).optional(),
});

// System Schemas
export const themeSchema = z.enum(["LIGHT", "DARK"]);

export const updateSystemSettingsSchema = z.object({
  business_name: z.string().min(1, "Business name is required").optional(),
  business_description: z.string().optional().or(z.literal("")),
  industry: z.string().optional().or(z.literal("")),
  website_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  contact_email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  theme: themeSchema.optional(),
});

// Form-specific schemas for existing components
export const addMediaFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  youtubeUrl: z.string().url("Please enter a valid YouTube URL"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  currentTag: z.string().optional(),
});

export const addTestimonyFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().min(1, "Company is required"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(20, "Message must be at least 20 characters"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  avatar: z.string().optional(),
});

// Type exports for TypeScript
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateTeamMemberFormData = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMemberFormData = z.infer<typeof updateTeamMemberSchema>;
export type CreatePortfolioItemFormData = z.infer<
  typeof createPortfolioItemSchema
>;
export type CreatePortfolioCategoryFormData = z.infer<
  typeof createPortfolioCategorySchema
>;
export type CreateInquiryFormData = z.infer<typeof createInquirySchema>;
export type UpdateInquiryFormData = z.infer<typeof updateInquirySchema>;
export type CreateTestimonialFormData = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialFormData = z.infer<typeof updateTestimonialSchema>;
export type CreateMediaItemFormData = z.infer<typeof createMediaItemSchema>;
export type UpdateSystemSettingsFormData = z.infer<
  typeof updateSystemSettingsSchema
>;
export type AddMediaFormData = z.infer<typeof addMediaFormSchema>;
export type AddTestimonyFormData = z.infer<typeof addTestimonyFormSchema>;
