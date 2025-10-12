import { FullScreenLoading } from '@/components/ui/Loading';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useHandleGoogleCallback } from '@/utils/googleAuth';
import { useSearchParams } from 'react-router-dom';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useUserInfoQuery(undefined);
  
  // Get state parameter from URL (for redirection)
  const state = searchParams.get('state') || '/';
  
  // Get user's verification status
  const isVerified = data?.data?.isVerified;
  const isAuthenticated = !!data?.data?.email;
  
  // Use the hook to handle authentication flow
  useHandleGoogleCallback(isLoading, isAuthenticated, isVerified, state);

  return (
    <div className="h-screen flex items-center justify-center">
      <FullScreenLoading 
        text="Completing your login..." 
        variant="spinner" 
        size="lg" 
        color="primary"
      />
    </div>
  );
};

export default GoogleCallback;











// import { FullScreenLoading } from '@/components/ui/Loading';
// import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
// import { setUser } from '@/redux/features/authSlice';
// import { useHandleGoogleCallback } from '@/utils/googleAuth';
// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useSearchParams } from 'react-router-dom';

// const GoogleCallback = () => {
//   const [searchParams] = useSearchParams();
//   const { data, isLoading } = useUserInfoQuery(undefined);
//   const dispatch = useDispatch();

//   // Get state parameter from URL (for redirection)
//   const state = searchParams.get('state') || '/';

//   // Get user's verification status
//   const isVerified = data?.data?.isVerified;
//   const isAuthenticated = !!data?.data?.email;

//   // Set user in Redux when authenticated
//   useEffect(() => {
//     if (data?.data) {
//       dispatch(setUser({
//         id: data.data._id,
//         email: data.data.email,
//         name: data.data.name
//       }));
//     }
//   }, [data, dispatch]);

//   // Use the hook to handle authentication flow
//   useHandleGoogleCallback(isLoading, isAuthenticated, isVerified, state);

//   return (
//     <div className="h-screen flex items-center justify-center">
//       <FullScreenLoading 
//         text="Completing your login..." 
//         variant="spinner" 
//         size="lg" 
//         color="primary"
//       />
//     </div>
//   );
// };

// export default GoogleCallback;