import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from '@/router';

function RoutesRenderer() {
  const element = useRoutes(routes);
  return element;
}

export default function App() {
  return (
    <BrowserRouter>
      <RoutesRenderer />
    </BrowserRouter>
  );
}
