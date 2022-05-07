import logo from "./logo.svg";
import "./App.css";
import intl from "react-intl-universal";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {intl.get("pages.game.Impciltswptnvfy")}
        {intl.get("themes.themename")}
        <p>k8s部署成功,2022.05.07.11.01, main</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
