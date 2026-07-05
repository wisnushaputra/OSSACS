import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Unknown error';
  }

  return (
    <div
      id="error-page"
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800"
    >
      <h1 className="text-4xl font-bold text-red-600">Oops!</h1>
      <p className="text-xl mt-4">Sorry, an unexpected error has occurred.</p>
      <p className="text-md italic text-gray-600 mt-2">
        <i>{errorMessage}</i>
      </p>
    </div>
  );
}
