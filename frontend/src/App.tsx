import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <header className="p-4 border-b">Header</header>
      <main>
        <Outlet />
      </main>
      <footer className="p-4 border-t">Footer</footer>
    </div>
  );
}

export default App;
