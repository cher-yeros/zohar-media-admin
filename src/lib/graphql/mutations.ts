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

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $email: String
    $first_name: String
    $last_name: String
    $role: UserRole
    $avatar_url: String
    $is_active: Boolean
  ) {
    updateUser(
      id: $id
      email: $email
      first_name: $first_name
      last_name: $last_name
      role: $role
      avatar_url: $avatar_url
      is_active: $is_active
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
        last_login_at
        createdAt
        updatedAt
      }
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      success
      message
    }
  }
`;

// Team Member Mutations
export const CREATE_TEAM_MEMBER = gql`
  mutation CreateTeamMember(
    $name: String!
    $role: String!
    $email: String!
    $phone: String
    $avatar_url: String
    $bio: String
    $join_date: String!
    $status: TeamMemberStatus
    $skills: [String!]
    $social_links: [SocialLinkInput!]
  ) {
    createTeamMember(
      name: $name
      role: $role
      email: $email
      phone: $phone
      avatar_url: $avatar_url
      bio: $bio
      join_date: $join_date
      status: $status
      skills: $skills
      social_links: $social_links
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
        createdAt

        skills {
          id
          skill_name
          createdAt
        }
        social_links {
          id
          platform
          url
          createdAt
        }
      }
    }
  }
`;

export const UPDATE_TEAM_MEMBER = gql`
  mutation UpdateTeamMember(
    $id: ID!
    $name: String
    $role: String
    $email: String
    $phone: String
    $avatar_url: String
    $bio: String
    $status: TeamMemberStatus
    $skills: [String!]
    $social_links: [SocialLinkInput!]
  ) {
    updateTeamMember(
      id: $id
      name: $name
      role: $role
      email: $email
      phone: $phone
      avatar_url: $avatar_url
      bio: $bio
      status: $status
      skills: $skills
      social_links: $social_links
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
        createdAt
        updated_at
        skills {
          id
          skill_name
          createdAt
        }
        social_links {
          id
          platform
          url
          createdAt
        }
      }
    }
  }
`;

export const DELETE_TEAM_MEMBER = gql`
  mutation DeleteTeamMember($id: ID!) {
    deleteTeamMember(id: $id) {
      success
      message
    }
  }
`;

// Portfolio Mutations
export const CREATE_PORTFOLIO_ITEM = gql`
  mutation CreatePortfolioItem(
    $title: String!
    $description: String!
    $category_id: ID
    $thumbnail_url: String
    $client_name: String
    $project_date: String!
    $status: PortfolioItemStatus
    $featured: Boolean
    $project_url: String
    $testimonial: String
    $images: [PortfolioItemImageInput!]
    $tags: [String!]
    $technologies: [String!]
    $team_members: [PortfolioItemTeamMemberInput!]
  ) {
    createPortfolioItem(
      title: $title
      description: $description
      category_id: $category_id
      thumbnail_url: $thumbnail_url
      client_name: $client_name
      project_date: $project_date
      status: $status
      featured: $featured
      project_url: $project_url
      testimonial: $testimonial
      images: $images
      tags: $tags
      technologies: $technologies
      team_members: $team_members
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
        createdAt
        updated_at
        category {
          id
          name
          description
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

export const UPDATE_PORTFOLIO_ITEM = gql`
  mutation UpdatePortfolioItem(
    $id: ID!
    $title: String
    $description: String
    $category_id: ID
    $thumbnail_url: String
    $client_name: String
    $project_date: String
    $status: PortfolioItemStatus
    $featured: Boolean
    $project_url: String
    $testimonial: String
    $images: [PortfolioItemImageInput!]
    $tags: [String!]
    $technologies: [String!]
    $team_members: [PortfolioItemTeamMemberInput!]
  ) {
    updatePortfolioItem(
      id: $id
      title: $title
      description: $description
      category_id: $category_id
      thumbnail_url: $thumbnail_url
      client_name: $client_name
      project_date: $project_date
      status: $status
      featured: $featured
      project_url: $project_url
      testimonial: $testimonial
      images: $images
      tags: $tags
      technologies: $technologies
      team_members: $team_members
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
        createdAt
        updated_at
        category {
          id
          name
          description
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

export const DELETE_PORTFOLIO_ITEM = gql`
  mutation DeletePortfolioItem($id: ID!) {
    deletePortfolioItem(id: $id) {
      success
      message
    }
  }
`;

export const CREATE_PORTFOLIO_CATEGORY = gql`
  mutation CreatePortfolioCategory(
    $name: String!
    $description: String
    $color: String!
  ) {
    createPortfolioCategory(
      name: $name
      description: $description
      color: $color
    ) {
      success
      message
      category {
        id
        name
        description
        color
        createdAt
        updated_at
        portfolio_items {
          id
          title
          featured
        }
      }
    }
  }
`;

export const UPDATE_PORTFOLIO_CATEGORY = gql`
  mutation UpdatePortfolioCategory(
    $id: ID!
    $name: String
    $description: String
    $color: String
  ) {
    updatePortfolioCategory(
      id: $id
      name: $name
      description: $description
      color: $color
    ) {
      success
      message
      category {
        id
        name
        description
        color
        createdAt
        updated_at
        portfolio_items {
          id
          title
          featured
        }
      }
    }
  }
`;

export const DELETE_PORTFOLIO_CATEGORY = gql`
  mutation DeletePortfolioCategory($id: ID!) {
    deletePortfolioCategory(id: $id) {
      success
      message
    }
  }
`;

// Inquiry Mutations
export const CREATE_INQUIRY = gql`
  mutation CreateInquiry(
    $name: String!
    $email: String!
    $subject: String!
    $message: String!
    $type: InquiryType
  ) {
    createInquiry(
      name: $name
      email: $email
      subject: $subject
      message: $message
      type: $type
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
  mutation UpdateInquiry(
    $id: ID!
    $status: InquiryStatus
    $assigned_to: ID
    $response: String
  ) {
    updateInquiry(
      id: $id
      status: $status
      assigned_to: $assigned_to
      response: $response
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

export const DELETE_INQUIRY = gql`
  mutation DeleteInquiry($id: ID!) {
    deleteInquiry(id: $id) {
      success
      message
    }
  }
`;

// Testimonial Mutations
export const CREATE_TESTIMONIAL = gql`
  mutation CreateTestimonial(
    $name: String!
    $company: String
    $message: String!
    $rating: Int
    $testimonial_date: String!
    $portfolio_item_id: ID
    $avatar_url: String
  ) {
    createTestimonial(
      name: $name
      company: $company
      message: $message
      rating: $rating
      testimonial_date: $testimonial_date
      portfolio_item_id: $portfolio_item_id
      avatar_url: $avatar_url
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
  mutation UpdateTestimonial(
    $id: ID!
    $name: String
    $company: String
    $message: String
    $rating: Int
    $testimonial_date: String
    $status: TestimonialStatus
    $featured: Boolean
    $portfolio_item_id: ID
    $avatar_url: String
  ) {
    updateTestimonial(
      id: $id
      name: $name
      company: $company
      message: $message
      rating: $rating
      testimonial_date: $testimonial_date
      status: $status
      featured: $featured
      avatar_url: $avatar_url
      portfolio_item_id: $portfolio_item_id
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

export const DELETE_TESTIMONIAL = gql`
  mutation DeleteTestimonial($id: ID!) {
    deleteTestimonial(id: $id) {
      success
      message
    }
  }
`;

// Media Mutations
export const CREATE_MEDIA_ITEM = gql`
  mutation CreateMediaItem(
    $title: String!
    $type: MediaType!
    $url: String!
    $thumbnail_url: String
    $file_size: String
    $dimensions: String
    $duration: String
    $tags: [String!]
  ) {
    createMediaItem(
      title: $title
      type: $type
      url: $url
      thumbnail_url: $thumbnail_url
      file_size: $file_size
      dimensions: $dimensions
      duration: $duration
      tags: $tags
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

export const UPDATE_MEDIA_ITEM = gql`
  mutation UpdateMediaItem(
    $id: ID!
    $title: String
    $type: MediaType
    $url: String
    $thumbnail_url: String
    $file_size: String
    $dimensions: String
    $duration: String
    $tags: [String!]
  ) {
    updateMediaItem(
      id: $id
      title: $title
      type: $type
      url: $url
      thumbnail_url: $thumbnail_url
      file_size: $file_size
      dimensions: $dimensions
      duration: $duration
      tags: $tags
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

export const DELETE_MEDIA_ITEM = gql`
  mutation DeleteMediaItem($id: ID!) {
    deleteMediaItem(id: $id) {
      success
      message
    }
  }
`;

// Homepage gallery (portfolio site Photo Gallery section)
export const CREATE_GALLERY_PHOTO = gql`
  mutation CreateGalleryPhoto(
    $image_url: String!
    $alt_text: String
    $sort_order: Int
    $is_published: Boolean
  ) {
    createGalleryPhoto(
      image_url: $image_url
      alt_text: $alt_text
      sort_order: $sort_order
      is_published: $is_published
    ) {
      success
      message
      galleryPhoto {
        id
        image_url
        alt_text
        sort_order
        is_published
      }
    }
  }
`;

export const UPDATE_GALLERY_PHOTO = gql`
  mutation UpdateGalleryPhoto(
    $id: ID!
    $image_url: String
    $alt_text: String
    $sort_order: Int
    $is_published: Boolean
  ) {
    updateGalleryPhoto(
      id: $id
      image_url: $image_url
      alt_text: $alt_text
      sort_order: $sort_order
      is_published: $is_published
    ) {
      success
      message
      galleryPhoto {
        id
        image_url
        alt_text
        sort_order
        is_published
      }
    }
  }
`;

export const DELETE_GALLERY_PHOTO = gql`
  mutation DeleteGalleryPhoto($id: ID!) {
    deleteGalleryPhoto(id: $id) {
      success
      message
    }
  }
`;

export const UPDATE_BUSINESS_STATISTICS = gql`
  mutation UpdateBusinessStatistics(
    $completed_projects: Int
    $happy_clients: Int
    $perspective_clients: Int
    $total_revenue: Float
    $average_project_value: Float
    $is_public: Boolean
    $auto_update: Boolean
  ) {
    updateBusinessStatistics(
      completed_projects: $completed_projects
      happy_clients: $happy_clients
      perspective_clients: $perspective_clients
      total_revenue: $total_revenue
      average_project_value: $average_project_value
      is_public: $is_public
      auto_update: $auto_update
    ) {
      success
      message
      statistics {
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
  }
`;

// System Mutations
export const UPDATE_SYSTEM_SETTINGS = gql`
  mutation UpdateSystemSettings(
    $business_name: String
    $business_description: String
    $industry: String
    $website_url: String
    $contact_email: String
    $theme: Theme
  ) {
    updateSystemSettings(
      business_name: $business_name
      business_description: $business_description
      industry: $industry
      website_url: $website_url
      contact_email: $contact_email
      theme: $theme
    ) {
      success
      message
      settings {
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
