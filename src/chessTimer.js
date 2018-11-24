const modulo = (m, n) => ((m % n) + n) % n;

const range = count => Array.apply(null, { length: count });

const getDelay = (player, period) => period - modulo(player.elapsed, period);

const getNextPlayerIndex = (count, currentPlayerIndex) =>
  currentPlayerIndex < count - 1 ? currentPlayerIndex + 1 : 0;

export const chessTimer = props => {
  /*
    Shared state
  */

  // private
  let timeout;
  const timestamps = range(props.count).map(() => null);

  // public (returned in the callback)
  let playerIndex = 0;
  const players = range(props.count).map(() => ({ elapsed: 0 }));

  /*
    Executed each period of the current player
  */

  const onTick = () => {
    const now = Date.now();
    players[playerIndex].elapsed += now - timestamps[playerIndex];
    timestamps[playerIndex] = now;
    timeout = setTimeout(onTick, getDelay(players[playerIndex], props.period));
    props.cb({ playerIndex, players });
  };

  /*
    Public
  */

  const play = () => {
    if (timeout) return;
    timestamps[playerIndex] = Date.now();
    const delay = getDelay(players[playerIndex], props.period);
    timeout = setTimeout(onTick, delay);
  };

  const pause = () => {
    if (!timeout) return;
    timeout = clearTimeout(timeout);
    players[playerIndex].elapsed += Date.now() - timestamps[playerIndex];
    props.cb({ playerIndex, players });
  };

  const next = () => {
    if (!timeout) {
      playerIndex = getNextPlayerIndex(props.count, playerIndex);
      props.cb({ playerIndex, players });
      return;
    }
    timeout = clearTimeout(timeout);
    const currentPlayer = players[playerIndex];
    const now = Date.now();
    currentPlayer.elapsed += now - timestamps[playerIndex] - props.increment;
    playerIndex = getNextPlayerIndex(props.count, playerIndex);
    const nextPlayer = players[playerIndex];
    timestamps[playerIndex] = now;
    const delay = getDelay(nextPlayer, props.period);
    timeout = setTimeout(onTick, delay);
    props.cb({ playerIndex, players });
  };

  const stop = () => clearTimeout(timeout);

  props.cb({ playerIndex, players });

  return {
    play,
    pause,
    next,
    stop,
  };
};
