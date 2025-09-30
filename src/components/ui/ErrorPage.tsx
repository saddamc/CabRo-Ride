
import { useNavigate } from 'react-router-dom';
import { Button } from './button';
import RacingGame from './RacingGame';

interface ErrorPageProps {
  title?: string;
  message?: string;
  showGoBack?: boolean;
  showHome?: boolean;
}

const ErrorPage = ({
  title = "Oops! Looks like you're lost in the race!",
  message = "While you wait, why not play our racing game? Beat your high score and then head back home!",
  showGoBack = true,
  showHome = true
}: ErrorPageProps) => {
  const navigate = useNavigate();

  return (
    <section className='bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen'>
      <div className='container items-center min-h-screen mx-auto py-8'>
        <div className='flex flex-col items-center max-w-6xl mx-auto text-center'>
            <h1 className="text-4xl font-bold text-gray-800 mt-8 mb-4">{title}</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">{message}</p>

         <div className='flex flex-col items-center w-full mt-6 gap-y-6 shrink-0 sm:w-auto'>
           {showGoBack && (
             <div className="text-center w-full">
               <h2 className="text-2xl font-bold text-gray-700 mb-4">🏎️ Play the Racing Game! 🏎️</h2>
               <p className="text-gray-600 mb-6">Cross cars to earn points! Race for 60 seconds and see your final score!</p>
               <RacingGame />
             </div>
           )}

           {showHome && (
             <Button onClick={() => navigate('/')} variant="outline" className="mt-4 bg-white hover:bg-gray-50">
               Skip Game & Go Home
             </Button>
           )}
         </div>
        </div>
      </div>
    </section>
  )
}

export default ErrorPage