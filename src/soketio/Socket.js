import io from 'socket.io-client';

const socket = io(`https://node.rxchartsquare.com/`);

export default socket;
