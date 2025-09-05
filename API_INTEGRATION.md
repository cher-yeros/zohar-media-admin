# API Integration Guide

This document explains how the Zohar Media Admin frontend integrates with the GraphQL API backend.

## 🚀 Quick Start

### Environment Setup

Create a `.env` file in the project root with the following variables:

```env
VITE_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
VITE_API_BASE_URL=http://localhost:4000
```

### Dependencies

The following packages have been installed for API integration:

- `@apollo/client` - GraphQL client
- `graphql` - GraphQL query language
- `react-hook-form` - Form management
- `@hookform/resolvers` - Form validation resolvers
- `zod` - Schema validation

## 📁 Project Structure

```
src/
├── lib/
│   ├── apollo-client.ts          # Apollo Client configuration
│   ├── config.ts                 # Application configuration
│   ├── graphql/
│   │   ├── queries.ts            # GraphQL queries
│   │   └── mutations.ts          # GraphQL mutations
│   ├── types/
│   │   └── api.ts                # TypeScript type definitions
│   ├── schemas/
│   │   └── validation.ts         # Zod validation schemas
│   └── api/
│       ├── auth.ts               # Authentication service
│       └── file-upload.ts        # File upload utility
└── components/
    └── forms/
        ├── add-media.tsx         # Updated with react-hook-form + zod
        └── add-testimony.tsx     # Updated with react-hook-form + zod
```

## 🔧 Key Features

### 1. Apollo Client Setup

- **Authentication**: Automatic JWT token handling
- **Error Policy**: Comprehensive error handling
- **Caching**: In-memory cache for better performance

### 2. Form Management

- **react-hook-form**: Efficient form state management
- **zod**: Runtime validation with TypeScript support
- **Real-time validation**: Instant feedback on form errors

### 3. File Upload

- **Progress tracking**: Real-time upload progress
- **File validation**: Size and type checking
- **Error handling**: Graceful fallbacks

### 4. Type Safety

- **Full TypeScript support**: End-to-end type safety
- **Generated types**: From GraphQL schema
- **Runtime validation**: Zod schemas match TypeScript types

## 📝 Usage Examples

### Basic Query

```typescript
import { useQuery } from "@apollo/client";
import { GET_TEAM_MEMBERS } from "@/lib/graphql/queries";

function TeamMembers() {
  const { data, loading, error } = useQuery(GET_TEAM_MEMBERS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.teamMembers?.map(member => (
        <div key={member.id}>{member.name}</div>
      ))}
    </div>
  );
}
```

### Form with Validation

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTeamMemberSchema } from "@/lib/schemas/validation";

function AddTeamMember() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createTeamMemberSchema),
  });

  const onSubmit = (data) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      {errors.name && <span>{errors.name.message}</span>}
    </form>
  );
}
```

### File Upload

```typescript
import { uploadFile } from "@/lib/api/file-upload";

const handleFileUpload = async (file: File) => {
  const result = await uploadFile(file, {
    folder: "avatars",
    onProgress: (progress) => console.log(`${progress}% uploaded`),
  });

  if (result.success) {
    console.log("File uploaded:", result.fileName);
  }
};
```

## 🔐 Authentication

The authentication system is handled automatically:

1. **Login**: Store JWT token in localStorage
2. **Requests**: Token is automatically included in headers
3. **Logout**: Clear token and reset Apollo cache

```typescript
import { AuthService } from "@/lib/api/auth";

// Login
const result = await AuthService.login({ email, password });

// Check authentication
const isAuthenticated = AuthService.isAuthenticated();

// Logout
AuthService.logout();
```

## 🎯 Available Queries & Mutations

### Queries

- `GET_USERS` - Fetch all users
- `GET_TEAM_MEMBERS` - Fetch team members
- `GET_PORTFOLIO_ITEMS` - Fetch portfolio items
- `GET_INQUIRIES` - Fetch inquiries
- `GET_TESTIMONIALS` - Fetch testimonials
- `GET_MEDIA_ITEMS` - Fetch media items
- `GET_ANALYTICS_DATA` - Fetch analytics data

### Mutations

- `LOGIN_USER` - User authentication
- `CREATE_TEAM_MEMBER` - Create team member
- `CREATE_PORTFOLIO_ITEM` - Create portfolio item
- `CREATE_TESTIMONIAL` - Create testimonial
- `CREATE_MEDIA_ITEM` - Create media item
- `UPDATE_INQUIRY` - Update inquiry status

## 🚨 Error Handling

The integration includes comprehensive error handling:

1. **GraphQL Errors**: Parsed and displayed to users
2. **Network Errors**: Graceful fallbacks
3. **Validation Errors**: Real-time form validation
4. **File Upload Errors**: Progress tracking and retry options

## 🔄 State Management

- **Apollo Cache**: Automatic caching and cache updates
- **Form State**: Managed by react-hook-form
- **Authentication State**: Stored in localStorage with validation

## 📱 Responsive Design

All forms and components are fully responsive and work on:

- Desktop
- Tablet
- Mobile devices

## 🧪 Testing

The integration is designed to be easily testable:

1. **Mock Apollo Client**: For unit tests
2. **Form Testing**: react-hook-form testing utilities
3. **API Mocking**: Mock GraphQL responses

## 🚀 Next Steps

1. **Backend Setup**: Ensure the GraphQL API is running
2. **Environment Variables**: Configure your API endpoints
3. **Authentication**: Set up user login/logout
4. **Data Fetching**: Implement data fetching in your components
5. **Form Integration**: Use the updated form components

## 📞 Support

For questions or issues with the API integration:

1. Check the GraphQL playground at `http://localhost:4000/graphql`
2. Review the API documentation in `API_DOC.md`
3. Check the browser console for error messages
4. Verify your environment variables are set correctly
