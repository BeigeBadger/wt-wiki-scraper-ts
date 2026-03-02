import { toast } from 'sonner';
import { ApolloError } from '@apollo/client';

const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 text-red-600"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

export function handleGqlError(
  error: ApolloError,
  message = 'Something went wrong when fetching data',
  logToConsole = true
) {
  toast.error(message, {
    icon: <ErrorIcon />,
  });

  if (logToConsole) {
    console.error('Error type:', error.name);
    console.error('Error details:', error);
  }
}
