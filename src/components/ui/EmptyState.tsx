import { FileX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  showHomeButton?: boolean;
  homeButtonText?: string;
  className?: string;
}

const EmptyState = ({
  title = "No Data Found",
  message = "We couldn't find any content to display here. Try refreshing the page or go back home.",
  icon = <FileX className="h-16 w-16 text-gray-400" />,
  showHomeButton = true,
  homeButtonText = "Go Home",
  className = ""
}: EmptyStateProps) => {
  const navigate = useNavigate();

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="mb-6">
        {icon}
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>

      <p className="text-gray-600 mb-8 max-w-md mx-auto">{message}</p>

      {showHomeButton && (
        <Button onClick={() => navigate('/')}>
          {homeButtonText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;