
import { useNavigate } from 'react-router-dom';
import { Button } from './button';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <section className='bg-white '>
      <div className='container items-center min-h-screen mx-auto'>
        <div className='flex flex-col items-center max-w-6xl mx-auto text-center'>
            <div>
              <img src="https://res.cloudinary.com/drtzgyetn/image/upload/v1757069493/ErrorPage_fslinp.jpg" alt="" />

            </div>
   

         <div className='flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto'>
           <Button onClick={() => navigate(-1)} variant="outline" className='gap-x-2'>
             <svg
               xmlns='http://www.w3.org/2000/svg'
               fill='none'
               viewBox='0 0 24 24'
               strokeWidth='1.5'
               stroke='currentColor'
               className='w-5 h-5 rtl:rotate-180'
             >
               <path
                 strokeLinecap='round'
                 strokeLinejoin='round'
                 d='M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18'
               />
             </svg>
             Go Back
           </Button>
           <Button onClick={() => navigate('/')}>
             Back Home
           </Button>
         </div>
        </div>
      </div>
    </section>
  )
}

export default ErrorPage