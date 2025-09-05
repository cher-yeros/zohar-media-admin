# Redux Integration Guide

This document explains how Redux Toolkit with Redux Persist has been integrated into the Zohar Media Admin application, replacing the previous React Context authentication system.

## 🚀 Quick Start

### Dependencies Installed

- `@reduxjs/toolkit` - Modern Redux with less boilerplate
- `react-redux` - React bindings for Redux
- `redux-persist` - Persist Redux state to localStorage
- `react-toastify` - Toast notifications

### Project Structure

```
src/
├── redux/
│   ├── store.ts                 # Redux store configuration
│   ├── hooks.ts                 # Typed Redux hooks
│   └── slices/
│       └── authSlice.ts         # Authentication slice
├── main.tsx                     # Redux Provider setup
└── App.tsx                      # Updated to use Redux
```

## 🔧 Redux Store Configuration

### Store Setup (`src/redux/store.ts`)

```typescript
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist auth state
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
```

### Typed Hooks (`src/redux/hooks.ts`)

```typescript
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## 🔐 Authentication Slice

### Auth State Interface

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### Available Actions

#### Async Thunks

- `loginUser(credentials)` - User login
- `logoutUser()` - User logout
- `refreshAuth()` - Refresh authentication
- `updateUserProfile(user)` - Update user profile

#### Synchronous Actions

- `clearError()` - Clear error state
- `setLoading(boolean)` - Set loading state
- `initializeAuth()` - Initialize auth from localStorage

### Usage Example

```typescript
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser, logoutUser, clearError } from "@/redux/slices/authSlice";

function LoginComponent() {
  const dispatch = useAppDispatch();
  const { user, isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const handleLogin = async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      // Login successful
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };
}
```

## 📱 Main App Setup

### Provider Configuration (`src/main.tsx`)

```typescript
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store, persistor } from "./redux/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ToastContainer theme="colored" autoClose={500} />
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
```

### App Initialization (`src/App.tsx`)

```typescript
import { useAppDispatch } from "@/redux/hooks";
import { initializeAuth } from "@/redux/slices/authSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    // ... rest of app
  );
}
```

## 🔄 State Persistence

### Redux Persist Configuration

- **Storage**: localStorage
- **Whitelist**: Only `auth` state is persisted
- **Rehydration**: Automatic on app startup
- **Serialization**: Handles Redux Persist actions

### Persisted Data

```typescript
{
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean,
    isLoading: false,
    error: null
  }
}
```

## 🎯 Component Updates

### Login Page (`src/pages/auth/login.tsx`)

```typescript
// Before (Context)
const { login } = useAuth();

// After (Redux)
const dispatch = useAppDispatch();
const { isLoading, error, isAuthenticated } = useAppSelector(
  (state) => state.auth
);

const handleLogin = async (data) => {
  dispatch(clearError());
  const result = await dispatch(
    loginUser({ email: data.email, password: data.password })
  );

  if (loginUser.fulfilled.match(result)) {
    // Success handling
  }
};
```

### Protected Route (`src/components/auth/protected-route.tsx`)

```typescript
// Before (Context)
const { isAuthenticated, user } = useAuth();

// After (Redux)
const { isAuthenticated, user, isLoading } = useAppSelector(
  (state) => state.auth
);
```

### Sidebar (`src/components/layout/sidebar.tsx`)

```typescript
// Before (Context)
const { user, logout } = useAuth();

// After (Redux)
const dispatch = useAppDispatch();
const { user } = useAppSelector((state) => state.auth);

const handleLogout = () => {
  dispatch(logoutUser());
};
```

## 🔧 Redux DevTools

### Development Features

- **Redux DevTools Extension**: Available in development mode
- **Time Travel Debugging**: Step through state changes
- **Action Logging**: See all dispatched actions
- **State Inspection**: View current state tree

### Usage

1. Install Redux DevTools browser extension
2. Open browser DevTools
3. Navigate to Redux tab
4. Inspect state and actions

## 🚨 Error Handling

### Async Thunk Error Handling

```typescript
// In component
const result = await dispatch(loginUser(credentials));

if (loginUser.fulfilled.match(result)) {
  // Success
} else if (loginUser.rejected.match(result)) {
  // Error - result.payload contains error message
}
```

### Global Error State

```typescript
const { error } = useAppSelector((state) => state.auth);

// Clear errors
dispatch(clearError());
```

## 🔄 State Management Flow

### Login Flow

1. **User submits form** → `dispatch(loginUser(credentials))`
2. **Thunk executes** → Calls `AuthService.login()`
3. **Success** → Updates state with user data
4. **Persistence** → Saves to localStorage via Redux Persist
5. **UI Update** → Component re-renders with new state

### Logout Flow

1. **User clicks logout** → `dispatch(logoutUser())`
2. **Thunk executes** → Calls `AuthService.logout()`
3. **State cleared** → Resets auth state to initial values
4. **Persistence** → Removes from localStorage
5. **UI Update** → Redirects to login page

## 📊 Performance Benefits

### Redux Toolkit Advantages

- **Less Boilerplate**: createSlice reduces code
- **Immer Integration**: Immutable updates made easy
- **DevTools**: Built-in debugging support
- **TypeScript**: Full type safety

### Redux Persist Benefits

- **State Persistence**: Survives page refreshes
- **Selective Persistence**: Only persist necessary state
- **Rehydration**: Automatic state restoration
- **Performance**: Efficient serialization

## 🧪 Testing

### Testing Redux

```typescript
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";

// Create test store
const createTestStore = () => {
  return configureStore({
    reducer: { auth: authReducer },
  });
};

// Test async thunks
test("loginUser", async () => {
  const store = createTestStore();
  await store.dispatch(
    loginUser({ email: "test@test.com", password: "password" })
  );

  const state = store.getState();
  expect(state.auth.isAuthenticated).toBe(true);
});
```

## 🔧 Migration from Context

### What Changed

1. **Removed**: `src/contexts/auth-context.tsx`
2. **Added**: Redux store and auth slice
3. **Updated**: All components to use Redux hooks
4. **Enhanced**: State persistence with Redux Persist

### Benefits of Migration

- **Better Performance**: Redux is more efficient than Context
- **State Persistence**: Automatic localStorage integration
- **DevTools**: Better debugging experience
- **Scalability**: Easier to add more slices
- **Type Safety**: Full TypeScript support

## 🚀 Next Steps

### Potential Enhancements

1. **Additional Slices**: Add more feature-specific slices
2. **Middleware**: Add custom middleware for logging
3. **Selectors**: Create memoized selectors for performance
4. **Saga**: Add Redux Saga for complex async flows
5. **RTK Query**: Replace Apollo Client with RTK Query

### Adding New Slices

```typescript
// Example: Theme slice
const themeSlice = createSlice({
  name: "theme",
  initialState: { mode: "light" },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});
```

## 📞 Support

### Common Issues

1. **State not persisting**: Check persistConfig whitelist
2. **Type errors**: Ensure proper TypeScript setup
3. **DevTools not working**: Check if in development mode
4. **Performance issues**: Use memoized selectors

### Debugging

1. **Redux DevTools**: Inspect state and actions
2. **Console Logging**: Add logging to thunks
3. **Network Tab**: Check API calls
4. **LocalStorage**: Verify persisted data

The Redux integration is now complete and provides a robust, scalable state management solution for the Zohar Media Admin application!
