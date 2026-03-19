/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const { useState, useEffect } = React;

const WORDS = [
  "react",
  "javascript",
  "coding",
  "design",
  "website",
  "developer",
  "function",
  "object",
  "array",
  "storage"
];

function App() {
  const MAX_STRIKES = 5;
  const MAX_PASSES = 3;

  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [passes, setPasses] = useState(MAX_PASSES);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scrambleGame"));

    if (saved) {
      setWords(saved.words);
      setCurrentWord(saved.currentWord);
      setScrambled(saved.scrambled);
      setScore(saved.score);
      setStrikes(saved.strikes);
      setPasses(saved.passes);
      setGameOver(saved.gameOver);
    } else {
      startGame();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "scrambleGame",
      JSON.stringify({
        words,
        currentWord,
        scrambled,
        score,
        strikes,
        passes,
        gameOver
      })
    );
  }, [words, currentWord, scrambled, score, strikes, passes, gameOver]);

  function startGame() {
    const shuffled = shuffle([...WORDS]);
    const first = shuffled[0];

    setWords(shuffled.slice(1));
    setCurrentWord(first);
    setScrambled(shuffle(first));
    setScore(0);
    setStrikes(0);
    setPasses(MAX_PASSES);
    setGameOver(false);
    setMessage("");
  }

  function nextWord(list) {
    if (list.length === 0) {
      setGameOver(true);
      return;
    }

    const next = list[0];
    setWords(list.slice(1));
    setCurrentWord(next);
    setScrambled(shuffle(next));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (guess.toLowerCase() === currentWord) {
      setScore(score + 1);
      setMessage("✅ Correct!");
      nextWord(words);
    } else {
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      setMessage("❌ Incorrect!");

      if (newStrikes >= MAX_STRIKES) {
        setGameOver(true);
      }
    }

    setGuess("");
  }

  function handlePass() {
    if (passes > 0) {
      setPasses(passes - 1);
      setMessage("⏭ Passed!");
      nextWord(words);
    }
  }

  function restartGame() {
    localStorage.removeItem("scrambleGame");
    startGame();
  }

  return (
    <div className="app">
      <h1>Scramble Game</h1>

      {gameOver ? (
        <div>
          <h2>Game Over</h2>
          <p>Final Score: {score}</p>
          <button onClick={restartGame}>Play Again</button>
        </div>
      ) : (
        <div>
          <h2>{scrambled}</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter your guess"
            />
          </form>

          <p>{message}</p>
          <p>Score: {score}</p>
          <p>Strikes: {strikes}</p>
          <p>Passes: {passes}</p>

          <button onClick={handlePass}>Pass</button>
        </div>
      )}
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);