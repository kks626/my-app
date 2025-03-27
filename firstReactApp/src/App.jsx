import { CountUp } from "./components/CountUp";
import { HeaderComp } from "./components/Header";
import { TitleText } from "./components/TitleText";
import "./reset.css";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <HeaderComp />
      <TitleText />
      <CountUp />
    </div>
  );
}
