# Authentication Setup Guide

This guide explains how to set up and use the authentication system in the Zohar Media Admin application.

## 🚀 Quick Start

### 1. Environment Configuration

Create a `.env` file in your project root with the following variables:

```env
VITE_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
VITE_API_BASE_URL=http://localhost:4000
```

### 2. Backend Setup

Ensure your GraphQL API backend is running and accessible at the configured endpoints.

## 🔐 Authentication Features

### Login Page (`/login`)

- **Email/Password Authentication**: Secure login with form validation
- **Remember Me**: Optional persistent login
- **Password Visibility Toggle**: Show/hide password
- **Error Handling**: User-friendly error messages
- **Redirect After Login**: Returns to intended page

### Register Page (`/register`)

- **User Registration**: Create new admin accounts
- **Role Selection**: Choose between Editor, Manager, or Admin
- **Form Validation**: Real-time validation with zod
- **Password Confirmation**: Ensure passwords match
- **Terms Acceptance**: Required checkbox for terms

### Profile Page (`/profile`)

- **User Information Display**: View account details
- **Role Badge**: Visual role indicator
- **Account Status**: Active/Inactive status
- **Member Since**: Account creation date
- **Last Login**: Recent login timestamp

## 🛡️ Security Features

### Protected Routes

- **Automatic Redirect**: Unauthenticated users redirected to login
- **Route Protection**: All admin pages require authentication
- **Auth State Management**: Persistent authentication state

### JWT Token Handling

- **Automatic Storage**: Tokens stored in localStorage
- **Auto-include Headers**: Tokens automatically added to API requests
- **Token Expiration**: Automatic logout on token expiry
- **Secure Logout**: Complete token and cache cleanup

## 📱 User Interface

### Sidebar Integration

- **User Dropdown**: Profile and logout options
- **Avatar Display**: User avatar or initials
- **Role Information**: Current user role display
- **Quick Access**: Profile and logout shortcuts

### Responsive Design

- **Mobile Friendly**: Works on all screen sizes
- **Touch Optimized**: Touch-friendly interface elements
- **Consistent Styling**: Matches application theme

## 🔧 Technical Implementation

### Authentication Context

```typescript
const { user, login, logout, isAuthenticated } = useAuth();
```

### Form Validation

- **react-hook-form**: Efficient form state management
- **zod**: Runtime validation with TypeScript support
- **Real-time Feedback**: Instant validation errors

### API Integration

- **GraphQL Mutations**: Login and registration
- **Error Handling**: Comprehensive error management
- **Loading States**: User feedback during operations

## 📝 Usage Examples

### Login Component

```typescript
import { useAuth } from "@/contexts/auth-context";

function LoginForm() {
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    const success = await login(email, password);
    if (success) {
      // Redirect to dashboard
    }
  };
}
```

### Protected Component

```typescript
import { ProtectedRoute } from "@/components/auth/protected-route";

function AdminPage() {
  return (
    <ProtectedRoute>
      <div>Admin content here</div>
    </ProtectedRoute>
  );
}
```

### User Information

```typescript
import { useAuth } from "@/contexts/auth-context";

function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <h1>Welcome, {user.first_name}!</h1>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🎯 Available Routes

### Public Routes

- `/login` - User login page
- `/register` - User registration page

### Protected Routes

- `/` - Dashboard (redirects to login if not authenticated)
- `/profile` - User profile page
- `/inquiries` - Inquiries management
- `/media` - Media management
- `/testimonials` - Testimonials management
- `/team` - Team management
- `/portfolio` - Portfolio management
- `/analytics` - Analytics dashboard
- `/settings` - Application settings

## 🔄 Authentication Flow

1. **Initial Load**: Check for existing authentication
2. **Login**: User enters credentials
3. **Validation**: Server validates credentials
4. **Token Storage**: JWT token stored locally
5. **State Update**: Authentication context updated
6. **Redirect**: User redirected to intended page
7. **API Requests**: Token automatically included in headers
8. **Logout**: Token cleared and user redirected to login

## 🚨 Error Handling

### Login Errors

- Invalid credentials
- Network errors
- Server errors
- Token expiration

### Registration Errors

- Email already exists
- Invalid email format
- Weak password
- Server validation errors

### General Errors

- Network connectivity
- Server unavailability
- Token expiration
- Session timeout

## 🧪 Testing

### Manual Testing

1. **Login Flow**: Test with valid/invalid credentials
2. **Registration Flow**: Test user creation
3. **Protected Routes**: Verify authentication requirements
4. **Logout Flow**: Test complete logout
5. **Token Expiry**: Test automatic logout

### Automated Testing

- Unit tests for auth context
- Form validation tests
- API integration tests
- Route protection tests

## 🔧 Configuration

### Environment Variables

```env
# Required
VITE_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
VITE_API_BASE_URL=http://localhost:4000

# Optional
VITE_APP_NAME=Zohar Media Admin
VITE_APP_VERSION=1.0.0
```

### Customization

- **Theme**: Modify colors and styling
- **Validation**: Adjust form validation rules
- **Redirects**: Customize post-login redirects
- **Error Messages**: Customize error text

## 📞 Support

For authentication-related issues:

1. **Check Console**: Look for error messages
2. **Verify Backend**: Ensure API is running
3. **Check Network**: Verify API connectivity
4. **Clear Storage**: Clear localStorage if needed
5. **Check Environment**: Verify environment variables

## 🚀 Next Steps

1. **Backend Integration**: Connect to your GraphQL API
2. **User Management**: Implement user CRUD operations
3. **Role-based Access**: Add role-based permissions
4. **Password Reset**: Implement password reset flow
5. **Two-Factor Auth**: Add 2FA support
6. **Social Login**: Add OAuth providers

The authentication system is now fully integrated and ready for use!
