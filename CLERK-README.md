# Clerk Authentication Setup Guide

## 1. Create a Clerk Application

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Choose your authentication methods (Email, Social providers, etc.)

## 2. Get Your API Keys

1. Go to your Clerk dashboard
2. Navigate to API Keys section
3. Copy the following values:
   - **Publishable key**: Starts with `pk_test_` or `pk_live_`
   - **Secret key**: Starts with `sk_test_` or `sk_live_`

## 3. Set Up Environment Variables

1. Update `.env.local` (or `.env` in production):
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key
   CLERK_SECRET_KEY=sk_test_your-secret-key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
   ```

## 4. Set Up Roles and Permissions (RBAC)

1. In your Clerk dashboard, go to **Users** → **Roles & Permissions**
2. Create roles like:
   - `admin`: Full access to all features including settings
   - `user`: Standard user access to dashboard, accounts, transfers, etc.
   - `analyst`: Access to monitoring and alerts

3. Assign permissions to each role as needed

## 5. Configure User Metadata

For displaying roles in the UI, you can set public metadata on users:

```javascript
// In Clerk dashboard or via API
{
  "publicMetadata": {
    "role": "admin"
  }
}
```

## 6. Test the Authentication

Run the development server:

```bash
npm run dev
```

The app should now use Clerk for authentication with RBAC.

## Features Implemented

- **Sign In/Sign Up**: Custom styled Clerk components
- **Middleware Protection**: Route protection with role-based access
- **User Management**: UserButton for profile management
- **RBAC**: Role-based navigation and route protection
- **Session Management**: Automatic session handling

## Role-Based Access Control

- **All authenticated users**: Can access dashboard, accounts, transfers, monitoring, simulator, alerts
- **Admin users only**: Can access settings and admin features

## Customization

The Clerk components are styled to match your app's dark theme. You can further customize the appearance in the `appearance` prop of `SignIn`, `SignUp`, and `UserButton` components.

## Troubleshooting

- **Environment variables not loading**: Make sure `.env.local` is in the root directory
- **Role checks not working**: Ensure roles are properly assigned in Clerk dashboard
- **Styling issues**: Check that CSS variables are properly defined in your Tailwind config
