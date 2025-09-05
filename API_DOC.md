# Zohar Media Backend API

A comprehensive GraphQL API backend for Zohar Media Admin application, built with Node.js, TypeScript, Sequelize, and Apollo Server.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd zohar-media-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   NODE_ENV=development
   PORT=4000
   JWT_SECRET=your-super-secret-jwt-key-here

   # Database Configuration
   DB_HOST=localhost
   DB_NAME=zohar_media
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_PORT=3306
   ```

4. **Database Setup**

   ```bash
   # Create database
   mysql -u root -p -e "CREATE DATABASE zohar_media;"

   # Run migrations
   npm run db:migrate

   # Generate GraphQL schema
   npm run generate
   ```

5. **Start the server**

   ```bash
   # Development
   npm run start:dev

   # Production
   npm run start:prod
   ```

The server will be available at `http://localhost:4000/graphql`

## 📚 API Documentation

### GraphQL Playground

Visit `http://localhost:4000/graphql` to access the interactive GraphQL playground where you can:

- Explore the complete schema
- Test queries and mutations
- View documentation
- Debug your requests

### Authentication

All API requests (except login and public queries) require authentication via JWT token.

**Headers:**

```json
{
  "Authorization": "Bearer <your-jwt-token>",
  "Content-Type": "application/json"
}
```

## 🔐 User Management

### User Types

```graphql
enum UserRole {
  ADMIN
  MANAGER
  EDITOR
}

type User {
  id: ID!
  email: String!
  first_name: String!
  last_name: String!
  role: UserRole!
  avatar_url: String
  is_active: Boolean!
  last_login_at: Date
  created_at: Date!
  updated_at: Date!
}
```

### User Mutations

**Create User**

```graphql
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
```

**Login**

```graphql
mutation Login($email: String!, $password: String!) {
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
```

**Update User**

```graphql
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
```

## 👥 Team Management

### Team Member Types

```graphql
type TeamMember {
  id: ID!
  name: String!
  role: String!
  email: String!
  phone: String
  avatar_url: String
  bio: String
  join_date: Date!
  status: TeamMemberStatus!
  created_at: Date!
  updated_at: Date!
  skills: [TeamMemberSkill!]!
  social_links: [TeamMemberSocialLink!]!
  portfolio_items: [PortfolioItemTeamMember!]!
  assigned_inquiries: [Inquiry!]!
}

enum TeamMemberStatus {
  ACTIVE
  INACTIVE
}

type TeamMemberSkill {
  id: ID!
  team_member_id: ID!
  skill_name: String!
  created_at: Date!
  team_member: TeamMember!
}

type TeamMemberSocialLink {
  id: ID!
  team_member_id: ID!
  platform: String!
  url: String!
  created_at: Date!
  team_member: TeamMember!
}
```

### Team Member Queries

**Get All Team Members**

```graphql
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
```

**Get Single Team Member**

```graphql
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
```

### Team Member Mutations

**Create Team Member**

```graphql
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
```

## 💼 Portfolio Management

### Portfolio Types

```graphql
type PortfolioCategory {
  id: ID!
  name: String!
  description: String
  color: String!
  created_at: Date!
  updated_at: Date!
  portfolio_items: [PortfolioItem!]!
}

type PortfolioItem {
  id: ID!
  title: String!
  description: String!
  category_id: ID
  thumbnail_url: String
  client_name: String
  project_date: Date!
  status: PortfolioItemStatus!
  featured: Boolean!
  project_url: String
  testimonial: String
  created_at: Date!
  updated_at: Date!
  category: PortfolioCategory
  images: [PortfolioItemImage!]!
  tags: [PortfolioItemTag!]!
  technologies: [PortfolioItemTechnology!]!
  team_members: [PortfolioItemTeamMember!]!
  testimonials: [Testimonial!]!
}

enum PortfolioItemStatus {
  COMPLETED
  IN_PROGRESS
  DRAFT
}

type PortfolioItemImage {
  id: ID!
  portfolio_item_id: ID!
  image_url: String!
  alt_text: String
  sort_order: Int!
  created_at: Date!
  portfolio_item: PortfolioItem!
}

type PortfolioItemTag {
  id: ID!
  portfolio_item_id: ID!
  tag_name: String!
  created_at: Date!
  portfolio_item: PortfolioItem!
}

type PortfolioItemTechnology {
  id: ID!
  portfolio_item_id: ID!
  technology_name: String!
  created_at: Date!
  portfolio_item: PortfolioItem!
}

type PortfolioItemTeamMember {
  id: ID!
  portfolio_item_id: ID!
  team_member_id: ID!
  role: String
  created_at: Date!
  portfolio_item: PortfolioItem!
  team_member: TeamMember!
}
```

### Portfolio Queries

**Get Portfolio Items with Filters**

```graphql
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
```

**Get Portfolio Categories**

```graphql
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
```

### Portfolio Mutations

**Create Portfolio Item**

```graphql
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
```

## 📞 Inquiry Management

### Inquiry Types

```graphql
type Inquiry {
  id: ID!
  name: String!
  email: String!
  subject: String!
  message: String!
  inquiry_date: Date!
  status: InquiryStatus!
  type: InquiryType!
  assigned_to: ID
  response: String
  response_date: Date
  created_at: Date!
  updated_at: Date!
  assigned_team_member: TeamMember
}

enum InquiryStatus {
  UNREAD
  RESPONDED
  RESOLVED
}

enum InquiryType {
  GENERAL
  COLLABORATION
  PRICING
  SUPPORT
}
```

### Inquiry Queries

**Get Inquiries with Filters**

```graphql
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
```

### Inquiry Mutations

**Create Inquiry (Public)**

```graphql
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
```

**Update Inquiry**

```graphql
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
```

## 💬 Testimonial Management

### Testimonial Types

```graphql
type Testimonial {
  id: ID!
  name: String!
  company: String
  message: String!
  rating: Int
  testimonial_date: Date!
  status: TestimonialStatus!
  featured: Boolean!
  avatar_url: String
  portfolio_item_id: ID
  created_at: Date!
  updated_at: Date!
  portfolio_item: PortfolioItem
}

enum TestimonialStatus {
  PENDING
  APPROVED
  REJECTED
}
```

### Testimonial Queries

**Get Testimonials with Filters**

```graphql
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
```

## 📸 Media Management

### Media Types

```graphql
type MediaItem {
  id: ID!
  title: String!
  type: MediaType!
  url: String!
  thumbnail_url: String
  file_size: String
  dimensions: String
  duration: String
  upload_date: Date!
  created_at: Date!
  updated_at: Date!
  tags: [MediaItemTag!]!
}

enum MediaType {
  IMAGE
  VIDEO
}

type MediaItemTag {
  id: ID!
  media_item_id: ID!
  tag_name: String!
  created_at: Date!
  media_item: MediaItem!
}
```

### Media Queries

**Get Media Items**

```graphql
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
```

## 📊 Analytics & Statistics

### Analytics Types

```graphql
type AnalyticsData {
  id: ID!
  date: Date!
  visitors_today: Int!
  visitors_this_week: Int!
  visitors_this_month: Int!
  visitor_trend: Float!
  inquiries_total: Int!
  inquiries_this_month: Int!
  inquiry_trend: Float!
  media_total_views: Int!
  created_at: Date!
  updated_at: Date!
}

type BusinessStatistics {
  id: ID!
  completed_projects: Int!
  happy_clients: Int!
  perspective_clients: Int!
  total_revenue: Float!
  average_project_value: Float!
  is_public: Boolean!
  auto_update: Boolean!
  created_at: Date!
  updated_at: Date!
}
```

### Analytics Queries

**Get Analytics Data**

```graphql
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
```

## ⚙️ System Configuration

### System Types

```graphql
type SystemSettings {
  id: ID!
  business_name: String!
  business_description: String
  industry: String
  website_url: String
  contact_email: String
  theme: Theme!
  created_at: Date!
  updated_at: Date!
}

enum Theme {
  LIGHT
  DARK
}

type ActivityLog {
  id: ID!
  user_id: ID
  action: String!
  entity_type: String!
  entity_id: ID
  description: String
  metadata: JSON
  created_at: Date!
  user: User
}
```

### System Queries

**Get System Settings**

```graphql
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
```

## 🔧 Frontend Integration Examples

### React/Next.js Integration

**1. Install Apollo Client**

```bash
npm install @apollo/client graphql
```

**2. Setup Apollo Client**

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("auth-token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

**3. Login Component Example**

```typescript
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from './queries';

const LOGIN_USER = gql`
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
      }
    }
  }
`;

function LoginComponent() {
  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data } = await loginUser({
        variables: { email, password }
      });

      if (data.loginUser.success) {
        localStorage.setItem('auth-token', data.loginUser.token);
        // Redirect to dashboard
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    // Your login form JSX
  );
}
```

**4. Portfolio Items Component Example**

```typescript
import { useQuery } from '@apollo/client';
import { GET_PORTFOLIO_ITEMS } from './queries';

const GET_PORTFOLIO_ITEMS = gql`
  query GetPortfolioItems($limit: Int, $offset: Int) {
    portfolioItems(limit: $limit, offset: $offset) {
      items {
        id
        title
        description
        thumbnail_url
        client_name
        project_date
        status
        featured
        category {
          id
          name
          color
        }
        images {
          id
          image_url
          alt_text
        }
        tags {
          id
          tag_name
        }
        technologies {
          id
          technology_name
        }
      }
      total
    }
  }
`;

function PortfolioItemsComponent() {
  const { data, loading, error, fetchMore } = useQuery(GET_PORTFOLIO_ITEMS, {
    variables: { limit: 10, offset: 0 }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.portfolioItems.items.map((item) => (
        <div key={item.id} className="portfolio-item">
          <img src={item.thumbnail_url} alt={item.title} />
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <div className="category" style={{ color: item.category.color }}>
            {item.category.name}
          </div>
          <div className="tags">
            {item.tags.map(tag => (
              <span key={tag.id} className="tag">{tag.tag_name}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Vue.js Integration

**1. Install Apollo Client**

```bash
npm install @vue/apollo-composable @apollo/client graphql
```

**2. Setup Apollo Client**

```typescript
import { createApp } from "vue";
import { createApolloClient } from "@vue/apollo-composable";
import { createHttpLink } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("auth-token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const apolloClient = createApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const app = createApp(App);
app.use(apolloClient);
```

### Angular Integration

**1. Install Apollo Client**

```bash
ng add apollo-angular
```

**2. Setup Apollo Client**

```typescript
import { NgModule } from "@angular/core";
import { ApolloModule, APOLLO_OPTIONS } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";
import { InMemoryCache } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";

export function createApollo(httpLink: HttpLink) {
  const http = httpLink.create({ uri: "http://localhost:4000/graphql" });

  const auth = setContext((_, { headers }) => {
    const token = localStorage.getItem("auth-token");
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return {
    link: auth.concat(http),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  imports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
```

## 📁 File Upload

The API supports file uploads via REST endpoint:

**Endpoint:** `POST /api/upload-file/:folder`

**Example:**

```typescript
const uploadFile = async (file: File, folder: string) => {
  const formData = new FormData();
  formData.append("picture", file);

  const response = await fetch(
    `http://localhost:4000/api/upload-file/${folder}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();
  return result.fileName; // Returns the full URL
};
```

**Usage:**

```typescript
// Upload team member avatar
const avatarUrl = await uploadFile(avatarFile, "avatars");

// Upload portfolio images
const imageUrl = await uploadFile(imageFile, "portfolio");

// Upload media files
const mediaUrl = await uploadFile(mediaFile, "media");
```

## 🔒 Error Handling

The API returns structured error responses:

```typescript
interface GraphQLError {
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
}

interface APIResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}
```

**Example Error Handling:**

```typescript
try {
  const { data, errors } = await client.query({
    query: GET_PORTFOLIO_ITEMS,
  });

  if (errors) {
    errors.forEach((error) => {
      console.error("GraphQL Error:", error.message);
    });
  }

  return data;
} catch (error) {
  console.error("Network Error:", error);
  throw error;
}
```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=4000
JWT_SECRET=your-production-jwt-secret
DB_HOST=your-production-db-host
DB_NAME=zohar_media_prod
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
DB_PORT=3306
```

### Build for Production

```bash
npm run build
npm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
```

## 📝 API Rate Limiting

- **Authentication:** 5 requests per minute per IP
- **General API:** 100 requests per minute per authenticated user
- **File Upload:** 10 requests per minute per authenticated user

## 🛠️ Development Scripts

```bash
# Start development server
npm run start:dev

# Start production server
npm run start:prod

# Run database migrations
npm run db:migrate

# Generate GraphQL schema
npm run generate

# Seed database with sample data
npm run db:seed

# Build for production
npm run build

# Type checking
npm run type-check
```

## 📞 Support

For questions or issues:

- Create an issue in the repository
- Contact the development team
- Check the GraphQL playground for API exploration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
