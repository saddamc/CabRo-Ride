// import Loading from '@/components/ui/Loading';
// import config from '@/config';
// import { Status, Wrapper } from '@googlemaps/react-wrapper';
// import type { ReactNode } from 'react';

// interface GoogleMapsWrapperProps {
//   children: ReactNode;
// }

// function LoadingComponent() {
//   return <Loading size="lg" text="Loading Google Maps..." />;
// }

// function ErrorComponent() {
//   return (
//     <div className="flex items-center justify-center h-full bg-gray-100">
//       <div className="text-center">
//         <div className="text-red-500 text-lg font-semibold mb-2">
//           Google Maps Error
//         </div>
//         <div className="text-gray-600">
//           Unable to load Google Maps. Please check your API key configuration.
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function GoogleMapsWrapper({ children }: GoogleMapsWrapperProps) {
//   const apiKey = config.googleMapsApiKey;

//   // If no API key or it's the placeholder, show fallback
//   if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
//     return (
//       <div className="flex items-center justify-center h-full bg-gray-100">
//         <div className="text-center">
//           <div className="text-blue-500 text-lg font-semibold mb-2">
//             Google Maps
//           </div>
//           <div className="text-gray-600 text-sm max-w-md">
//             To enable Google Maps functionality, please add your Google Maps API key to the .env file:
//             <br />
//             <code className="bg-gray-200 px-2 py-1 rounded text-xs mt-2 block">
//                 {/* Google Maps API Key */}
//               googleMapsApiKey
//             </code>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const render = (status: Status) => {
//     switch (status) {
//       case Status.LOADING:
//         return <LoadingComponent />;
//       case Status.FAILURE:
//         return <ErrorComponent />;
//       case Status.SUCCESS:
//         return <>{children}</>;
//       default:
//         return <LoadingComponent />;
//     }
//   };

//   return (
//     <Wrapper
//       apiKey={apiKey}
//       libraries={['places', 'geometry']}
//       render={render}
//     >
//       {children}
//     </Wrapper>
//   );
// }