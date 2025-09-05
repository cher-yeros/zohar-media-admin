import { gql } from "@apollo/client";

// User Mutations
export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      success
      message
      token
      user {
        id
        email
        first_name
        last_name
        role
        avatar_url
        is_active
        last_login_at
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(
      email: $input.email
      password: $input.password
      first_name: $input.first_name
      last_name: $input.last_name
      role: $input.role
      avatar_url: $input.avatar_url
    ) {
      success
      message
      user {
        id
        email
        first_name
        last_name
        role
        avatar_url
        is_active
        created_at
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(
      id: $id
      email: $input.email
      first_name: $input.first_name
      last_name: $input.last_name
      role: $input.role
      avatar_url: $input.avatar_url
      is_active: $input.is_active
    ) {
      success
      message
      user {
        id
        email
        first_name
        last_name
        role
        avatar_url
        is_active
        updated_at
      }
    }
  }
`;

// Team Member Mutations
export const CREATE_TEAM_MEMBER = gql`
  mutation CreateTeamMember($input: CreateTeamMemberInput!) {
    createTeamMember(
      name: $input.name
      role: $input.role
      email: $input.email
      phone: $input.phone
      avatar_url: $input.avatar_url
      bio: $input.bio
      join_date: $input.join_date
      status: $input.status
      skills: $input.skills
      social_links: $input.social_links
    ) {
      success
      message
      teamMember {
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
  }
`;

export const UPDATE_TEAM_MEMBER = gql`
  mutation UpdateTeamMember($id: ID!, $input: UpdateTeamMemberInput!) {
    updateTeamMember(
      id: $id
      name: $input.name
      role: $input.role
      email: $input.email
      phone: $input.phone
      avatar_url: $input.avatar_url
      bio: $input.bio
      status: $input.status
      skills: $input.skills
      social_links: $input.social_links
    ) {
      success
      message
      teamMember {
        id
        name
        role
        email
        phone
        avatar_url
        bio
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
  }
`;

// Portfolio Mutations
export const CREATE_PORTFOLIO_ITEM = gql`
  mutation CreatePortfolioItem($input: CreatePortfolioItemInput!) {
    createPortfolioItem(
      title: $input.title
      description: $input.description
      category_id: $input.category_id
      thumbnail_url: $input.thumbnail_url
      client_name: $input.client_name
      project_date: $input.project_date
      status: $input.status
      featured: $input.featured
      project_url: $input.project_url
      testimonial: $input.testimonial
      images: $input.images
      tags: $input.tags
      technologies: $input.technologies
      team_members: $input.team_members
    ) {
      success
      message
      portfolioItem {
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
    }
  }
`;

export const CREATE_PORTFOLIO_CATEGORY = gql`
  mutation CreatePortfolioCategory($input: CreatePortfolioCategoryInput!) {
    createPortfolioCategory(
      name: $input.name
      description: $input.description
      color: $input.color
    ) {
      success
      message
      portfolioCategory {
        id
        name
        description
        color
      }
    }
  }
`;

// Inquiry Mutations
export const CREATE_INQUIRY = gql`
  mutation CreateInquiry($input: CreateInquiryInput!) {
    createInquiry(
      name: $input.name
      email: $input.email
      subject: $input.subject
      message: $input.message
      type: $input.type
    ) {
      success
      message
      inquiry {
        id
        name
        email
        subject
        message
        inquiry_date
        status
        type
      }
    }
  }
`;

export const UPDATE_INQUIRY = gql`
  mutation UpdateInquiry($id: ID!, $input: UpdateInquiryInput!) {
    updateInquiry(
      id: $id
      status: $input.status
      assigned_to: $input.assigned_to
      response: $input.response
    ) {
      success
      message
      inquiry {
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
    }
  }
`;

// Testimonial Mutations
export const CREATE_TESTIMONIAL = gql`
  mutation CreateTestimonial($input: CreateTestimonialInput!) {
    createTestimonial(
      name: $input.name
      company: $input.company
      message: $input.message
      rating: $input.rating
      testimonial_date: $input.testimonial_date
      status: $input.status
      featured: $input.featured
      avatar_url: $input.avatar_url
      portfolio_item_id: $input.portfolio_item_id
    ) {
      success
      message
      testimonial {
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
    }
  }
`;

export const UPDATE_TESTIMONIAL = gql`
  mutation UpdateTestimonial($id: ID!, $input: UpdateTestimonialInput!) {
    updateTestimonial(
      id: $id
      name: $input.name
      company: $input.company
      message: $input.message
      rating: $input.rating
      status: $input.status
      featured: $input.featured
      avatar_url: $input.avatar_url
      portfolio_item_id: $input.portfolio_item_id
    ) {
      success
      message
      testimonial {
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
    }
  }
`;

// Media Mutations
export const CREATE_MEDIA_ITEM = gql`
  mutation CreateMediaItem($input: CreateMediaItemInput!) {
    createMediaItem(
      title: $input.title
      type: $input.type
      url: $input.url
      thumbnail_url: $input.thumbnail_url
      file_size: $input.file_size
      dimensions: $input.dimensions
      duration: $input.duration
      tags: $input.tags
    ) {
      success
      message
      mediaItem {
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
    }
  }
`;

// System Mutations
export const UPDATE_SYSTEM_SETTINGS = gql`
  mutation UpdateSystemSettings($input: UpdateSystemSettingsInput!) {
    updateSystemSettings(
      business_name: $input.business_name
      business_description: $input.business_description
      industry: $input.industry
      website_url: $input.website_url
      contact_email: $input.contact_email
      theme: $input.theme
    ) {
      success
      message
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
  }
`;
