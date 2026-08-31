import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import io from 'socket.io-client';
import {useRoute, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {colorGlobal} from '../../utils/GlobalStyles';
import api from '../../utils/api';

const ChatSocketOi = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(null);
  const flatListRef = useRef(null);
  const [chatStartTime, setChatStartTime] = useState(null); // Track chat start time
  const [chatEndTime, setChatEndTime] = useState(null); // Track chat end time
  const [chatDuration, setChatDuration] = useState(null); // Chat duration in seconds
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const [bothSentMessages, setBothSentMessages] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(false);
  const role = 'doctor'; // Or 'patient', based on user role
  const route = useRoute();
  const navigation = useNavigation();
  const roomId = route.params.roomId;
  const {patientName, doctorId, patientId} = route.params;

  // Disconnect chat function
  const disconnectChat = () => {
    stopCountdown();
    setChatEndTime(Date.now()); // Mark chat end time
    if (socket) {
      socket.disconnect();
    }
    setIsDisconnected(true);
  };

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('https://node.rxchartsquare.com/', {
      query: {role},
    });
    setSocket(newSocket);

    // Join room
    newSocket.emit('joinRoom', roomId);

    // Listen for messages
    newSocket.on('chatMessage', data => {
      setMessages(prevMessages => [...prevMessages, data]);
    });

    // Start countdown when both users have sent messages
    newSocket.on('startCountdown', () => {
      setBothSentMessages(true);
      startCountdown();
    });

    // Handle disconnection
    newSocket.on('userDisconnected', () => {
      stopCountdown();
      setIsDisconnected(true);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, role]);

  // Save chat history
  const chatHistory = async () => {
    const currentDate = moment().format('YYYY-MM-DD');
    const durationInSeconds = Math.floor((chatEndTime - chatStartTime) / 1000); // Calculate duration

    const body = {
      patientId,
      doctorId,
      patientName,
      messages: messages,
      callDuration: `${Math.floor(durationInSeconds / 60)}:${String(
        durationInSeconds % 60,
      ).padStart(2, '0')}`,
      totalAmount: '1000', // Replace with actual value
      date: currentDate,
    };

    try {
      const response = await api.post(`/docChat/chatAdd`, body);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isDisconnected) {
      chatHistory();
      navigation.goBack(); // Navigate back after saving history
    }
  }, [isDisconnected]);

  // Countdown logic
  const startCountdown = () => {
    setChatStartTime(Date.now()); // Set the chat start time
    setCountdown(600); // 10 minutes (600 seconds)

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(interval);
          setChatEndTime(Date.now()); // Mark chat end time when countdown finishes
          setChatDuration(Date.now() - chatStartTime); // Set chat duration
          navigation.goBack();
          navigation.navigate('PatientPrescription', {
            patientId,
            doctorId,
            patientName,
          });
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  const stopCountdown = () => {
    setCountdown(null);
  };

  // Send message function
  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        roomId,
        message,
        sender: role,
        timestamp: new Date().toISOString(),
      };

      socket.emit('chatMessage', messageData);
      setHasSentMessage(true);
      setMessage('');
    }
  };

  const renderItem = ({item}) => (
    <View
      style={[
        styles.messageWrapper,
        item.sender === 'patient' ? styles.userWrapper : styles.botWrapper,
      ]}>
      <View>
        <Text style={{color: colorGlobal.white}}>{item.message}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.countdownContainer}>
        <Text style={styles.countdownText}>
          {countdown !== null
            ? `Time left: ${Math.floor(countdown / 60)}:${String(
                countdown % 60,
              ).padStart(2, '0')}`
            : 'Waiting for both users to send messages...'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.disconnectButton}
        onPress={disconnectChat}>
        <Text style={styles.disconnectText}>Disconnect Chat</Text>
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({animated: true})
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor={'gray'}
        />
        {/* <TouchableOpacity style={styles.buttonView} onPress={sendMessage}>
          <Text style={styles.sendButton}>SEND</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[styles.sendBtn, {opacity: message.trim() ? 1 : 0.5}]}
          // disabled={!message.trim()}
          onPress={sendMessage}>
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  countdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  countdownText: {
    fontSize: 16,
    fontWeight: '500',
    color: colorGlobal.gray,
  },
  messageList: {
    height: '100%',
    justifyContent: 'flex-end',
  },
  messageWrapper: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  userWrapper: {
    maxWidth: '60%',
    borderRadius: 8,
    padding: 10,
    alignSelf: 'flex-start',
    backgroundColor: colorGlobal.gray,
  },
  botWrapper: {
    maxWidth: '60%',
    borderRadius: 8,
    padding: 10,
    alignSelf: 'flex-end',
    backgroundColor: colorGlobal.themeColor,
  },
  messageCard: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  userMessage: {
    maxWidth: '60%',
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-start',
  },

  botMessage: {
    maxWidth: '60%',
    alignSelf: 'flex-start',
    backgroundColor: '#ccc',
  },
  messageText: {
    fontSize: 14,
    color: 'white',
  },
  timestamp: {
    fontSize: 12,
    color: 'white',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 10,
  },
  disconnectButton: {
    width: '30%',
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  disconnectText: {
    color: colorGlobal.error,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 40,
    color: 'black',
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: '#1976D2',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ChatSocketOi;
// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Modal,
//   StyleSheet,
// } from 'react-native';
// import io from 'socket.io-client';

// const SOCKET_URL = 'https://node.rxchartsquare.com';

// const DoctorChat = () => {
//   const roomId = 'Ai123456';

//   const [socket, setSocket] = useState(null);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [connected, setConnected] = useState(false);

//   useEffect(() => {
//     const newSocket = io(SOCKET_URL, {
//       transports: ['websocket'],
//     });

//     setSocket(newSocket);

//     newSocket.on('connect', () => {
//       console.log('Doctor connected');

//       newSocket.emit('joinRoom', roomId);
//     });

//     newSocket.on('bothConnected', () => {
//       setLoading(false);
//       setConnected(true);
//     });

//     newSocket.on('chatMessage', data => {
//       setMessages(prev => [...prev, data]);
//     });

//     return () => newSocket.disconnect();
//   }, []);

//   const sendMessage = () => {
//     if (!message.trim()) return;

//     const msg = {
//       roomId,
//       sender: 'doctor',
//       message,
//       timestamp: new Date().toISOString(),
//     };

//     socket.emit('chatMessage', msg);

//     setMessages(prev => [...prev, msg]);

//     setMessage('');
//   };

//   return (
//     <View style={{flex: 1}}>
//       <Modal visible={loading} transparent>
//         <View style={styles.popup}>
//           <Text style={styles.popupText}>Connecting to Patient...</Text>
//         </View>
//       </Modal>

//       <Modal visible={connected} transparent>
//         <View style={styles.popup}>
//           <Text style={styles.popupText}>You are connected with Patient</Text>

//           <TouchableOpacity
//             onPress={() => setConnected(false)}
//             style={styles.okBtn}>
//             <Text style={{color: '#fff'}}>OK</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>

//       <FlatList
//         data={messages}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({item}) => (
//           <View
//             style={
//               item.sender === 'doctor' ? styles.myMessage : styles.otherMessage
//             }>
//             <Text>{item.message}</Text>
//           </View>
//         )}
//       />

//       <View style={styles.inputRow}>
//         <TextInput
//           value={message}
//           onChangeText={setMessage}
//           placeholder="Type message..."
//           style={styles.input}
//         />

//         <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
//           <Text style={{color: '#fff'}}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default DoctorChat;

// const styles = StyleSheet.create({
//   popup: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#000000aa',
//   },

//   popupText: {
//     fontSize: 18,
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 10,
//   },

//   okBtn: {
//     marginTop: 10,
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//   },

//   inputRow: {
//     flexDirection: 'row',
//     padding: 10,
//   },

//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//   },

//   sendBtn: {
//     marginLeft: 10,
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//   },

//   myMessage: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#DCF8C6',
//     margin: 5,
//     padding: 10,
//     borderRadius: 8,
//   },

//   otherMessage: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#fff',
//     margin: 5,
//     padding: 10,
//     borderRadius: 8,
//   },
// });
