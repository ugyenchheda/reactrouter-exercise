import { useRouteError } from "react-router-dom";

// ErrorPage component to display when there is a route error
export default function ErrorPage() {
  // Get the route error using useRouteError hook
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}