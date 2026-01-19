import { Analytics } from '@vercel/analytics/react';
import { Game } from './components/Game';
import './index.css';

function App() {
  return (
    <>
      <Game />
      <Analytics />
    </>
  );
}

export default App;
