import './App.css';
import Navbar from './components/Navbar.js'
import Bridge from './components/Bridge.js'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
        <div className="Content">
          <Bridge />
        </div>
      </header>
    </div>
  );
}

export default App;
