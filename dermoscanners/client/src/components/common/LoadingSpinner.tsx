import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
}

export default function LoadingSpinner({ size = 48, message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="animate-spin text-indigo-600 mb-4" size={size} />
      {message && <p className="text-gray-600 font-medium">{message}</p>}
    </div>
  );
}
