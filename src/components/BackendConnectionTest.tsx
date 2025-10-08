import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLoginMutation, useLogoutMutation, useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useState } from 'react';

const BackendConnectionTest = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [login, { isLoading: loginLoading, error: loginError }] = useLoginMutation();
  const { data: userInfo, isLoading: userLoading, error: userError, refetch } = useUserInfoQuery(undefined, {
    skip: !localStorage.getItem('accessToken')
  });
  console.log(userInfo);
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();

  // Debug helper function
  const debugAuthState = () => {
    console.log('🔍 DEBUG AUTH STATE:');
    console.log('🔍 accessToken in localStorage:', localStorage.getItem('accessToken'));
    console.log('🔍 token in localStorage:', localStorage.getItem('token'));
    console.log('🔍 accessToken in sessionStorage:', sessionStorage.getItem('accessToken'));
    console.log('🔍 auth_failed flag:', localStorage.getItem('auth_failed'));
    console.log('🔍 VITE_BASE_URL:', import.meta.env.VITE_BASE_URL);
  };

  // Improved backend health check with more diagnostic information
  const checkBackendHealth = async () => {
    try {
      console.log('🏥 CHECKING BACKEND HEALTH...');
      console.log('🏥 Using URL:', import.meta.env.VITE_BASE_URL);
      
      // Show timeout message if it takes too long
      const timeout = setTimeout(() => {
        console.log('🏥 Backend health check is taking longer than expected...');
      }, 3000);
      
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      
      clearTimeout(timeout);
      
      // Get response data if possible
      let responseData = null;
      try {
        responseData = await response.json();
      } catch (e) {
        console.log('🏥 Response is not JSON:', e);
      }
      
      console.log('🏥 Backend health response:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      alert(`Backend Health: ${response.ok ? '✅ OK' : '❌ NOT OK'} (${response.status})\n\n${
        responseData ? JSON.stringify(responseData) : response.statusText
      }`);
    } catch (error) {
      console.error('🏥 Backend health check failed:', error);
      alert(`Backend Health Check Failed: ${error}\n\nThis usually means the backend server is not running or the URL is incorrect.\n\nCurrent URL: ${import.meta.env.VITE_BASE_URL}`);
    }
  };

  // Add a simple connectivity test
  const testConnectivity = async () => {
    try {
      console.log('🧪 TESTING BACKEND CONNECTIVITY...');
      console.log('🧪 Base URL:', import.meta.env.VITE_BASE_URL);

      // Test basic connectivity without auth
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/login`, {
        method: 'OPTIONS', // Use OPTIONS to test CORS/connectivity
      });

      console.log('🧪 Connectivity test result:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      alert(`Connectivity Test: ${response.ok ? 'SUCCESS' : 'FAILED'} (${response.status})`);
    } catch (error) {
      console.error('🧪 Connectivity test failed:', error);
      alert(`Connectivity Test Failed: ${error}`);
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const result = await login(loginData).unwrap();
      console.log('Login successful:', result);
      
      // Store the access token
      if (result.data?.accessToken) {
        localStorage.setItem('accessToken', result.data.accessToken);
        alert('Login successful! Token stored. You can now test User Info.');
      } else {
        alert('Login successful but no token received.');
      }
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed! Check console for error.');
    }
  };

  const handleTestConnection = () => {
    // Check if we have a token before trying to refetch
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('No access token found. Please login first.');
      return;
    }
    
    // This will trigger the user info query
    console.log('Testing connection to backend...');
    refetch();
  };

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      localStorage.removeItem('accessToken');
      alert('Logged out successfully!');
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Logout failed!');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Backend Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 text-lg font-semibold">Test Login</h3>
          <p className="mb-2 text-sm text-gray-600">Test credentials: test@example.com / password123</p>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-2">
            <Input
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
            />
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
            <Button
              type="submit"
              disabled={loginLoading}
              className="w-full"
            >
              {loginLoading ? 'Logging in...' : 'Test Login'}
            </Button>
          </form>
          {loginError ? (
            <div className="mt-2 text-sm text-red-500">
              Login error: {loginError && typeof loginError === 'object' && 'data' in loginError ? JSON.stringify(loginError.data) : 'Connection failed'}
            </div>
          ) : null}
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold">Backend Connectivity Tests</h3>
          <Button
            onClick={testConnectivity}
            variant="secondary"
            className="w-full mb-2"
          >
            Test Backend Connectivity
          </Button>
          <Button
            onClick={debugAuthState}
            variant="secondary"
            className="w-full mb-2"
          >
            Debug Auth State
          </Button>
          <Button
            onClick={checkBackendHealth}
            variant="secondary"
            className="w-full mb-2"
          >
            Check Backend Health
          </Button>
          <Button
            onClick={handleTestConnection}
            disabled={userLoading}
            variant="outline"
            className="w-full mb-2"
          >
            {userLoading ? 'Loading...' : 'Test User Info (/users/me)'}
          </Button>
          <Button
            onClick={handleLogout}
            disabled={logoutLoading}
            variant="destructive"
            className="w-full"
          >
            {logoutLoading ? 'Logging out...' : 'Logout'}
          </Button>
          {userInfo && (
            <p className="mt-2 text-sm text-green-500">
              User data: {JSON.stringify(userInfo)}
            </p>
          )}
          {userError ? (
            <p className="mt-2 text-sm text-red-500">
              User info error: {String(userError)}
            </p>
          ) : null}
        </div>

        <div className="text-sm text-gray-600">
          <p><strong>Backend URL:</strong> {import.meta.env.VITE_BASE_URL}</p>
          <p><strong>Status:</strong> {userError ? '❌ Connection failed' : userInfo ? '✅ Connected' : '⏳ Testing...'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackendConnectionTest;