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
