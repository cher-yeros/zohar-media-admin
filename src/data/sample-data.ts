export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: Date;
  status: "unread" | "responded" | "resolved";
  type: "general" | "collaboration" | "pricing" | "support";
}

export interface MediaItem {
  id: string;
  title: string;
  type: "image" | "video";
  url: string;
  thumbnail: string;
  tags: string[];
  uploadDate: Date;
  size: string;
  dimensions?: string;
  duration?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  message: string;
  rating: number;
  date: Date;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  avatar?: string;
}

export interface AnalyticsData {
  visitors: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    trend: number;
  };
  inquiries: {
    total: number;
    thisMonth: number;
    trend: number;
  };
  media: {
    totalViews: number;
    topPerforming: MediaItem[];
  };
}

// Sample inquiries
export const sampleInquiries: Inquiry[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    subject: "Wedding Photography Inquiry",
    message:
      "Hi, I'm interested in your wedding photography services for my upcoming wedding in June. Could you please provide more information about your packages and availability?",
    date: new Date("2024-01-15"),
    status: "unread",
    type: "collaboration",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@techcorp.com",
    subject: "Corporate Video Production",
    message:
      "We need a professional video production team for our annual company meeting. Please send us your portfolio and pricing.",
    date: new Date("2024-01-14"),
    status: "responded",
    type: "collaboration",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    subject: "Photo Editing Services",
    message:
      "I have about 200 photos from my recent vacation that need professional editing. What are your rates for batch editing?",
    date: new Date("2024-01-13"),
    status: "resolved",
    type: "pricing",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@startup.io",
    subject: "Brand Photography",
    message:
      "Our startup needs professional brand photography for our website and marketing materials. Do you work with small businesses?",
    date: new Date("2024-01-12"),
    status: "unread",
    type: "collaboration",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    email: "lisa.thompson@example.com",
    subject: "Question about Licensing",
    message:
      "I'd like to use one of your stock photos for commercial purposes. How does your licensing work?",
    date: new Date("2024-01-11"),
    status: "responded",
    type: "general",
  },
];

// Sample media items
export const sampleMedia: MediaItem[] = [
  {
    id: "1",
    title: "Sunset Wedding Ceremony",
    type: "image",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=300",
    tags: ["wedding", "sunset", "ceremony"],
    uploadDate: new Date("2024-01-10"),
    size: "2.4 MB",
    dimensions: "1920x1080",
  },
  {
    id: "2",
    title: "Corporate Team Meeting",
    type: "video",
    url: "https://example.com/video1.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300",
    tags: ["corporate", "business", "meeting"],
    uploadDate: new Date("2024-01-09"),
    size: "45.2 MB",
    duration: "2:15",
  },
  {
    id: "3",
    title: "Product Photography - Watch",
    type: "image",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
    tags: ["product", "watch", "luxury"],
    uploadDate: new Date("2024-01-08"),
    size: "1.8 MB",
    dimensions: "1600x1200",
  },
  {
    id: "4",
    title: "Brand Story Video",
    type: "video",
    url: "https://example.com/video2.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=300",
    tags: ["brand", "story", "commercial"],
    uploadDate: new Date("2024-01-07"),
    size: "78.5 MB",
    duration: "3:42",
  },
  {
    id: "5",
    title: "Portrait Session - Executive",
    type: "image",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    tags: ["portrait", "executive", "professional"],
    uploadDate: new Date("2024-01-06"),
    size: "3.1 MB",
    dimensions: "2000x1500",
  },
  {
    id: "6",
    title: "Event Photography - Conference",
    type: "image",
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300",
    tags: ["event", "conference", "networking"],
    uploadDate: new Date("2024-01-05"),
    size: "2.7 MB",
    dimensions: "1920x1280",
  },
];

// Sample testimonials
export const sampleTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Jennifer Martinez",
    company: "Elegant Events",
    message:
      "Zohar Media exceeded our expectations for our corporate event. The photography was stunning and captured every important moment perfectly.",
    rating: 5,
    date: new Date("2024-01-10"),
    status: "approved",
    featured: true,
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b60c8dd8?w=100",
  },
  {
    id: "2",
    name: "Robert Smith",
    company: "TechStart Inc.",
    message:
      "Professional, creative, and delivered on time. Their brand photography helped us establish a strong visual identity.",
    rating: 5,
    date: new Date("2024-01-08"),
    status: "approved",
    featured: false,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
  },
  {
    id: "3",
    name: "Amanda Davis",
    company: "Davis Wedding Co.",
    message:
      "Amazing work on our wedding photos! Every shot was perfect and the editing was flawless. Highly recommend!",
    rating: 5,
    date: new Date("2024-01-06"),
    status: "pending",
    featured: false,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
  },
  {
    id: "4",
    name: "Mark Johnson",
    company: "Johnson Architecture",
    message:
      "Great attention to detail and excellent communication throughout the project. The final results speak for themselves.",
    rating: 4,
    date: new Date("2024-01-04"),
    status: "approved",
    featured: true,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100",
  },
  {
    id: "5",
    name: "Sofia Garcia",
    company: "Creative Studio",
    message:
      "Working with Zohar Media was a pleasure. They understood our vision and brought it to life beautifully.",
    rating: 5,
    date: new Date("2024-01-02"),
    status: "approved",
    featured: false,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
  },
];

// Sample analytics data
export const sampleAnalytics: AnalyticsData = {
  visitors: {
    today: 234,
    thisWeek: 1842,
    thisMonth: 7856,
    trend: 12.5,
  },
  inquiries: {
    total: 89,
    thisMonth: 23,
    trend: 8.3,
  },
  media: {
    totalViews: 15420,
    topPerforming: sampleMedia.slice(0, 3),
  },
};

// Chart data for analytics
export const inquiryTrendData = [
  { name: "Jan", inquiries: 12 },
  { name: "Feb", inquiries: 19 },
  { name: "Mar", inquiries: 15 },
  { name: "Apr", inquiries: 23 },
  { name: "May", inquiries: 18 },
  { name: "Jun", inquiries: 25 },
  { name: "Jul", inquiries: 22 },
];

export const visitorData = [
  { name: "Mon", visitors: 245 },
  { name: "Tue", visitors: 312 },
  { name: "Wed", visitors: 289 },
  { name: "Thu", visitors: 356 },
  { name: "Fri", visitors: 423 },
  { name: "Sat", visitors: 312 },
  { name: "Sun", visitors: 267 },
];

// New interfaces for team management, portfolio, and settings
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  joinDate: Date;
  status: "active" | "inactive";
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface PortfolioCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
  projectCount: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  category?: PortfolioCategory;
  images: string[];
  thumbnail: string;
  client?: string;
  projectDate: Date;
  status: "completed" | "in-progress" | "draft";
  tags: string[];
  teamMembers: string[];
  featured: boolean;
  technologies?: string[];
  projectUrl?: string;
  testimonial?: string;
}

export interface SettingsStats {
  completedProjects: number;
  happyClients: number;
  perspectiveClients: number;
  totalRevenue?: number;
  averageProjectValue?: number;
}

// Sample team members
export const sampleTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Lead Photographer",
    email: "sarah@zoharmedia.com",
    phone: "+1 (555) 123-4567",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b60c8dd8?w=150",
    bio: "Professional photographer with 8+ years of experience in wedding and corporate photography.",
    skills: [
      "Wedding Photography",
      "Portrait Photography",
      "Photo Editing",
      "Lighting",
    ],
    joinDate: new Date("2022-01-15"),
    status: "active",
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      instagram: "https://instagram.com/sarahjohnson_photo",
    },
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Video Producer",
    email: "michael@zoharmedia.com",
    phone: "+1 (555) 234-5678",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    bio: "Creative video producer specializing in corporate videos and brand storytelling.",
    skills: [
      "Video Production",
      "Video Editing",
      "Motion Graphics",
      "Color Grading",
    ],
    joinDate: new Date("2022-03-10"),
    status: "active",
    socialLinks: {
      linkedin: "https://linkedin.com/in/michaelchen",
      twitter: "https://twitter.com/michaelchen_video",
    },
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Creative Director",
    email: "emily@zoharmedia.com",
    phone: "+1 (555) 345-6789",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    bio: "Visionary creative director with expertise in brand development and visual storytelling.",
    skills: [
      "Creative Direction",
      "Brand Strategy",
      "Visual Design",
      "Project Management",
    ],
    joinDate: new Date("2021-09-01"),
    status: "active",
    socialLinks: {
      linkedin: "https://linkedin.com/in/emilyrodriguez",
      instagram: "https://instagram.com/emily_creative",
    },
  },
  {
    id: "4",
    name: "David Kim",
    role: "Technical Specialist",
    email: "david@zoharmedia.com",
    phone: "+1 (555) 456-7890",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
    bio: "Technical expert handling equipment, post-production, and digital workflow optimization.",
    skills: [
      "Equipment Management",
      "Post-Production",
      "Technical Support",
      "Workflow Optimization",
    ],
    joinDate: new Date("2022-06-20"),
    status: "active",
    socialLinks: {
      linkedin: "https://linkedin.com/in/davidkim",
    },
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "Client Relations Manager",
    email: "lisa@zoharmedia.com",
    phone: "+1 (555) 567-8901",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    bio: "Dedicated to ensuring exceptional client experiences and project coordination.",
    skills: [
      "Client Relations",
      "Project Coordination",
      "Communication",
      "Customer Service",
    ],
    joinDate: new Date("2022-02-14"),
    status: "active",
    socialLinks: {
      linkedin: "https://linkedin.com/in/lisathompson",
    },
  },
];

// Sample portfolio categories
export const samplePortfolioCategories: PortfolioCategory[] = [
  {
    id: "1",
    name: "Wedding Photography",
    description: "Beautiful wedding moments captured with artistic flair",
    color: "#FF6B6B",
    createdAt: new Date("2021-01-01"),
    projectCount: 45,
  },
  {
    id: "2",
    name: "Corporate Events",
    description: "Professional corporate event photography and videography",
    color: "#4ECDC4",
    createdAt: new Date("2021-01-01"),
    projectCount: 32,
  },
  {
    id: "3",
    name: "Brand Photography",
    description: "Compelling brand imagery for businesses and products",
    color: "#45B7D1",
    createdAt: new Date("2021-01-01"),
    projectCount: 28,
  },
  {
    id: "4",
    name: "Portrait Sessions",
    description:
      "Professional portrait photography for individuals and families",
    color: "#96CEB4",
    createdAt: new Date("2021-01-01"),
    projectCount: 67,
  },
  {
    id: "5",
    name: "Video Production",
    description: "Creative video content for marketing and storytelling",
    color: "#FFEAA7",
    createdAt: new Date("2021-01-01"),
    projectCount: 23,
  },
];

// Sample portfolio items
export const samplePortfolioItems: PortfolioItem[] = [
  {
    id: "1",
    title: "Elegant Garden Wedding",
    description:
      "A stunning outdoor wedding ceremony and reception captured in a beautiful garden setting with natural lighting and romantic ambiance.",
    categoryId: "1",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
    client: "Sarah & Michael Johnson",
    projectDate: new Date("2023-10-15"),
    status: "completed",
    tags: ["wedding", "outdoor", "garden", "romantic"],
    teamMembers: ["1", "3", "5"],
    featured: true,
    technologies: ["Canon EOS R5", "Adobe Lightroom", "Adobe Photoshop"],
    testimonial:
      "Absolutely stunning photos! Every moment was captured perfectly.",
  },
  {
    id: "2",
    title: "Tech Startup Brand Video",
    description:
      "A dynamic brand video showcasing the innovative culture and products of a growing tech startup.",
    categoryId: "5",
    images: [
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400",
    client: "TechStart Inc.",
    projectDate: new Date("2023-11-20"),
    status: "completed",
    tags: ["corporate", "video", "brand", "startup"],
    teamMembers: ["2", "3", "4"],
    featured: true,
    technologies: ["Sony FX6", "Adobe Premiere Pro", "After Effects"],
    projectUrl: "https://example.com/techstart-video",
  },
  {
    id: "3",
    title: "Executive Portrait Series",
    description:
      "Professional headshots and environmental portraits for C-suite executives at a Fortune 500 company.",
    categoryId: "4",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    client: "Global Corp",
    projectDate: new Date("2023-12-05"),
    status: "completed",
    tags: ["portrait", "executive", "professional", "corporate"],
    teamMembers: ["1", "4"],
    featured: false,
    technologies: ["Canon EOS R5", "Studio Lighting", "Adobe Lightroom"],
  },
  {
    id: "4",
    title: "Product Photography - Luxury Watches",
    description:
      "High-end product photography for a luxury watch brand, showcasing intricate details and craftsmanship.",
    categoryId: "3",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    client: "Luxury Timepieces",
    projectDate: new Date("2023-09-30"),
    status: "completed",
    tags: ["product", "luxury", "watches", "commercial"],
    teamMembers: ["1", "3", "4"],
    featured: true,
    technologies: [
      "Canon EOS R5",
      "Macro Lens",
      "Studio Lighting",
      "Adobe Photoshop",
    ],
  },
  {
    id: "5",
    title: "Annual Conference Coverage",
    description:
      "Comprehensive photography and video coverage of a three-day industry conference with 500+ attendees.",
    categoryId: "2",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
    client: "Industry Leaders Summit",
    projectDate: new Date("2023-08-15"),
    status: "completed",
    tags: ["conference", "event", "corporate", "networking"],
    teamMembers: ["1", "2", "4", "5"],
    featured: false,
    technologies: [
      "Canon EOS R5",
      "Sony FX6",
      "Wireless Audio",
      "Adobe Premiere Pro",
    ],
  },
];

// Sample settings statistics
export const sampleSettingsStats: SettingsStats = {
  completedProjects: 230,
  happyClients: 1068,
  perspectiveClients: 230,
  totalRevenue: 1250000,
  averageProjectValue: 5435,
};
