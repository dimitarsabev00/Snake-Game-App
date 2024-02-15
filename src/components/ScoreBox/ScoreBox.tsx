import "./ScoreBox.scss";
interface ScoreBoxProps {
  score: number;
}
const ScoreBox: React.FC<ScoreBoxProps> = ({ score }) => {
  return (
    <div className="scoreBox">
      <h2>Score: {score}</h2>
      <h2>
        High Score:{" "}
        {!localStorage.getItem("highScore")
          ? 0
          : localStorage.getItem("highScore")}
      </h2>
    </div>
  );
};

export default ScoreBox;
