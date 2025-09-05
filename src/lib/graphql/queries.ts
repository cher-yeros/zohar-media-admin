import { gql } from "@apollo/client";

// User Queries
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      first_name
      last_name
      role
      avatar_url
      is_active
      last_login_at
      created_at
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      first_name
      last_name
      role
      avatar_url
      is_active
      last_login_at
      created_at
      updated_at
    }
  }
`;

// Team Member Queries
export const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers {
    teamMembers {
      id
      name
      role
      email
      phone
      avatar_url
      bio
      join_date
      status
      skills {
        id
        skill_name
      }
      social_links {
        id
        platform
        url
      }
    }
  }
`;

export const GET_TEAM_MEMBER = gql`
  query GetTeamMember($id: ID!) {
    teamMember(id: $id) {
      id
      name
      role
      email
      phone
      avatar_url
      bio
      join_date
      status
      skills {
        id
        skill_name
      }
      social_links {
        id
        platform
        url
      }
    }
  }
`;

// Portfolio Queries
export const GET_PORTFOLIO_ITEMS = gql`
  query GetPortfolioItems(
    $category_id: ID
    $status: PortfolioItemStatus
    $featured: Boolean
    $limit: Int
    $offset: Int
  ) {
    portfolioItems(
      category_id: $category_id
      status: $status
      featured: $featured
      limit: $limit
      offset: $offset
    ) {
      items {
        id
        title
        description
        thumbnail_url
        client_name
        project_date
        status
        featured
        project_url
        testimonial
        category {
          id
          name
          color
        }
        images {
          id
          image_url
          alt_text
          sort_order
        }
        tags {
          id
          tag_name
        }
        technologies {
          id
          technology_name
        }
        team_members {
          id
          role
          team_member {
            id
            name
            avatar_url
          }
        }
      }
      total
    }
  }
`;

export const GET_PORTFOLIO_CATEGORIES = gql`
  query GetPortfolioCategories {
    portfolioCategories {
      id
      name
      description
      color
      portfolio_items {
        id
        title
        featured
      }
    }
  }
`;

// Inquiry Queries
export const GET_INQUIRIES = gql`
  query GetInquiries(
    $status: InquiryStatus
    $type: InquiryType
    $assigned_to: ID
    $limit: Int
    $offset: Int
  ) {
    inquiries(
      status: $status
      type: $type
      assigned_to: $assigned_to
      limit: $limit
      offset: $offset
    ) {
      items {
        id
        name
        email
        subject
        message
        inquiry_date
        status
        type
        assigned_to
        response
        response_date
        assigned_team_member {
          id
          name
          email
        }
      }
      total
    }
  }
`;

// Testimonial Queries
export const GET_TESTIMONIALS = gql`
  query GetTestimonials(
    $status: TestimonialStatus
    $featured: Boolean
    $portfolio_item_id: ID
    $limit: Int
    $offset: Int
  ) {
    testimonials(
      status: $status
      featured: $featured
      portfolio_item_id: $portfolio_item_id
      limit: $limit
      offset: $offset
    ) {
      items {
        id
        name
        company
        message
        rating
        testimonial_date
        status
        featured
        avatar_url
        portfolio_item {
          id
          title
          client_name
        }
      }
      total
    }
  }
`;

// Media Queries
export const GET_MEDIA_ITEMS = gql`
  query GetMediaItems($type: MediaType, $limit: Int, $offset: Int) {
    mediaItems(type: $type, limit: $limit, offset: $offset) {
      items {
        id
        title
        type
        url
        thumbnail_url
        file_size
        dimensions
        duration
        upload_date
        tags {
          id
          tag_name
        }
      }
      total
    }
  }
`;

// Analytics Queries
export const GET_ANALYTICS_DATA = gql`
  query GetAnalyticsData(
    $start_date: String
    $end_date: String
    $limit: Int
    $offset: Int
  ) {
    analyticsData(
      start_date: $start_date
      end_date: $end_date
      limit: $limit
      offset: $offset
    ) {
      items {
        id
        date
        visitors_today
        visitors_this_week
        visitors_this_month
        visitor_trend
        inquiries_total
        inquiries_this_month
        inquiry_trend
        media_total_views
      }
      total
    }
  }
`;

export const GET_BUSINESS_STATISTICS = gql`
  query GetBusinessStatistics {
    businessStatistics {
      id
      completed_projects
      happy_clients
      perspective_clients
      total_revenue
      average_project_value
      is_public
      auto_update
    }
  }
`;

// System Queries
export const GET_SYSTEM_SETTINGS = gql`
  query GetSystemSettings {
    systemSettings {
      id
      business_name
      business_description
      industry
      website_url
      contact_email
      theme
    }
  }
`;

export const GET_ACTIVITY_LOGS = gql`
  query GetActivityLogs(
    $user_id: ID
    $entity_type: String
    $limit: Int
    $offset: Int
  ) {
    activityLogs(
      user_id: $user_id
      entity_type: $entity_type
      limit: $limit
      offset: $offset
    ) {
      items {
        id
        action
        entity_type
        entity_id
        description
        metadata
        created_at
        user {
          id
          first_name
          last_name
          email
        }
      }
      total
    }
  }
`;
