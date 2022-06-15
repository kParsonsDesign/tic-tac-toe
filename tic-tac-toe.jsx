const Square = ({
  id,
  playerNames,
  player,
  setPlayer,
  squares,
  setSquares,
  endGame,
  status,
  setStatus
}) => {
  let clickable = true;
  if (squares[id] !== undefined) {
    clickable = false;
  }

  // determine if component is being rerendered
  // useEffect is done (returns) only when component is done (unmounted)?
  React.useEffect(() => {
    // console.log(`Square ${id} rendered`);
    // return () => console.log(`Unmounting square ${id}`);
  });

  function handleClick(e) {
    if (clickable) {
      // add player marker to visible sqaure
      e.target.innerHTML = playerNames[player];

      // notify gameboard of square marked
      let tempArray = [...squares];
      tempArray[id] = player;
      setSquares(tempArray);
      
      // check for win / game end
      endGame(player, tempArray);

    }
  }

  return <button className='btn btn-light' onClick={handleClick} disabled={!clickable}></button>;
};

const Message = ({ status, statusType }) => {
  return (
    <div className='container'>
      <p className={`alert alert-${statusType} lead mt-4`}>{status}</p>
    </div>
  )
}

const Board = () => {
  const [player, setPlayer] = React.useState(1);
  const playerNames = ['O', 'X'];
  // let status = `Next Player: ${playerNames[player]}`;
  const [status, setStatus] = React.useState(`Next Player: ${playerNames[player]}`);
  const [statusType, setStatusType] = React.useState('info');
  const [squares, setSquares] = React.useState([]);
  const [mounted, setMounted] = React.useState(true);
  const [wins, setWins] = React.useState([0, 0]);

  const clearGame = () => {
    setMounted(!mounted);
    setSquares([]);
    if (player === 0) {
      setPlayer(1);
    } else {
      setPlayer(0);
    }
    setStatus(`Current Score: X:${wins[1]} O:${wins[0]}`);
    setStatusType('info');
    document.getElementById('clearGame').classList.remove('btn-primary');
    document.getElementById('clearGame').classList.add('btn-outline-secondary');
    document.getElementById('newGame').classList.remove('btn-outline-secondary');
    document.getElementById('newGame').classList.add('btn-primary');
  };

  const newGame = () => {
    if (mounted) return;
    setMounted(!mounted);
    setStatus(`Next Player: ${playerNames[player]}`);
    document.getElementById('newGame').classList.remove('btn-primary');
    document.getElementById('newGame').classList.add('btn-outline-secondary');
  }

  // const winStatus = (player) => {
  //   status = `${playerNames[player]} Wins!`;
  // }

  function endGame(player, squares) {
    console.log(squares);
    // if there is a winner
    if (
      // rows
      (squares[0] === player && squares[1] === player && squares[2] === player) ||
      (squares[3] === player && squares[4] === player && squares[5] === player) ||
      (squares[6] === player && squares[7] === player && squares[8] === player) ||
      // columns
      (squares[0] === player && squares[3] === player && squares[6] === player) ||
      (squares[1] === player && squares[4] === player && squares[7] === player) ||
      (squares[2] === player && squares[5] === player && squares[8] === player) ||
      // diaganals
      (squares[0] === player && squares[4] === player && squares[8] === player) ||
      (squares[2] === player && squares[4] === player && squares[6] === player)
    ) {
      // alert win
      setStatusType('warning');
      setStatus(`Game over. ${playerNames[player]} wins!`);

      // disable unselected buttons
      let tempArray = [...squares];
      for (let i = 0; i <= 8; i++) {
        if (tempArray[i] === undefined) tempArray[i] = null;
      }
      setSquares(tempArray);

      // add win to wins array
      let tempWins = [...wins];
      tempWins[player] += 1;
      setWins(tempWins);

      // make "Clear Game" button more visible
      document.getElementById('clearGame').classList.remove('btn-outline-secondary');
      document.getElementById('clearGame').classList.add('btn-primary');

      // stop checking
      return `${player} wins!`;
    }

    // game over no winner
    // squares array is full length && has no unselected items
    if ((squares.length === 9) && (!squares.includes(undefined))) {
      setStatusType('warning');
      setStatus(`Game over. Draw.`);
      return 'Draw.';
    }

    let nextPlayer = (player + 1) % 2;
    setStatus(`Next Player: ${playerNames[nextPlayer]}`);
    setPlayer(nextPlayer);
  }

  function renderSquare(i) {
    return (
      <Square
        id={i}
        playerNames={playerNames}
        player={player}
        setPlayer={setPlayer}
        squares={squares}
        setSquares={setSquares}
        endGame={endGame}
        status={status}
        setStatus={setStatus}
      />
    );
  }

  return (
    <>
      <Message status={status} statusType={statusType} />

      <div className='container my-3 game-board'>
        {mounted && renderSquare(0)}
        {mounted && renderSquare(1)}
        {mounted && renderSquare(2)}
        {mounted && renderSquare(3)}
        {mounted && renderSquare(4)}
        {mounted && renderSquare(5)}
        {mounted && renderSquare(6)}
        {mounted && renderSquare(7)}
        {mounted && renderSquare(8)}
      </div>
      
      <div className='container'>
        <button id='clearGame' className='btn btn-outline-secondary mx-1' onClick={clearGame}>Clear Game</button>
        <button id='newGame' className='btn btn-outline-secondary mx-1' onClick={newGame}>New Game</button>
        <div className='float-end h4 text-secondary'><span className='mx-3'>Score </span>{`X: ${wins[1]}`}<span className='mx-2'> </span>{`O: ${wins[0]}`}</div>
      </div>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Board />);
