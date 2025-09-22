# Authentication Flow Documentation

This document explains the authentication flow implemented in the application, including both email/password and Google OAuth authentication.

## Authentication Methods

### 1. Email/Password Authentication

- **Login**: User enters email and password in the `LoginForm` component
- **Verification Check**: After successful login, system checks if the user is verified
  - If not verified, redirects to `/verify` page
  - If verified, redirects to home or specified redirect path
- **Success Notification**: Shows "Logged in successfully" toast message

### 2. Google OAuth Authentication

- **Login Initiation**: User clicks "Login with Google" in the `LoginForm` component
- **Redirect Flow**:
  1. Front-end calls `initiateGoogleLogin()` from `googleAuth.ts` utility
  2. User is redirected to Google consent screen
  3. After consent, Google redirects to server's callback URL
  4. Server processes authentication and redirects to `/auth/google/callback` on front-end
  5. `GoogleCallback` component handles this redirect, showing a loading state
  6. `useHandleGoogleCallback` hook manages user state and redirects appropriately
- **Success Notification**: Shows "Logged in successfully with Google" toast message

## Key Components

1. **LoginForm.tsx**
   - Handles both credential login and Google OAuth initiation
   - Shows loading state during Google redirect

2. **GoogleCallback.tsx**
   - Dedicated component to handle OAuth redirect
   - Shows loading indicator while processing authentication
   - Uses the `useUserInfoQuery` to fetch the authenticated user's data

3. **googleAuth.ts**
   - Utility functions for Google authentication
   - `initiateGoogleLogin()`: Starts Google OAuth flow
   - `useHandleGoogleCallback()`: Custom hook to handle redirect after Google authentication

## Server-Side Flow

1. **Google Strategy** (passport.ts)
   - Configures Google OAuth with client ID, secret, and callback URL
   - Creates a new user if email doesn't exist
   - Updates existing user information if needed
   - Automatically marks Google-authenticated users as verified

2. **Google Callback Controller** (auth.controller.ts)
   - Processes the Google OAuth callback
   - Creates JWT tokens and sets cookies
   - Redirects to front-end with proper query parameters

## Implementation Notes

- Google-authenticated users are automatically marked as verified
- Both authentication methods use JWT tokens stored in cookies
- Success notifications are shown for both login methods
- Loading indicators are shown during authentication processes