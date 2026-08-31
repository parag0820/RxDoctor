import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Dimensions,
} from 'react-native';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_HEIGHT = Dimensions.get('window').height;
export default function TicketDetail({route, navigation}) {
  const {ticket} = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const reversedData = [...messages].reverse();
  const [adminId, setAdminId] = useState(null);
  const isFocused = useIsFocused();

  console.log('TicketDetail', ticket?._id);

  const getStatusStyle = status => {
    switch (status) {
      case 'Open':
        return styles.statusOpen;
      case 'In Progress':
        return styles.statusProgress;
      case 'Closed':
        return styles.statusClosed;
      default:
        return styles.statusDefault;
    }
  };
  const isoDate = ticket.createdAt;

  // pending
  /* ========================
     FETCH CONVERSATION
  ======================== */
  const conversationHistory = async () => {
    const userId = await AsyncStorage.getItem('userId');
    setLoading(true);

    try {
      const res = await api.get(`/doctor-conversation/get-by-doctor/${userId}`);

      const conversation = res?.data?.data?.find(
        item => item._id === ticket._id,
      );

      setAdminId(conversation?.adminId);
      setMessages(conversation?.messages || []);
    } catch (err) {
      console.log('Conversation error', err);
    } finally {
      setLoading(false);
    }
  };

  /* ========================
     DATE FORMAT
  ======================== */
  const d = new Date(ticket.createdAt);
  const displayDate = `${d.getDate().toString().padStart(2, '0')}-${(
    d.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}-${d.getFullYear()}`;

  /* ========================
     MESSAGE BUBBLE
  ======================== */
  const MessageBubble = ({item}) => {
    const isAdmin = item.senderType === 'admin';

    return (
      <View
        style={[
          styles.bubble,
          isAdmin ? styles.leftBubble : styles.rightBubble,
        ]}>
        <Text style={styles.bubbleText}>{item.message}</Text>
        <Text style={styles.time}>
          {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  // pending
  const handleSendMessage = async () => {
    const userId = await AsyncStorage.getItem('userId');
    console.log('adminID', adminId);

    const payload = {
      adminId,
      doctorId: userId,
      ticketId: ticket?._id,
      senderType: 'doctor',
      message: message,
    };
    try {
      const response = await api.post(`/doctor-conversation/send`, payload);
      console.log('reply Ticket response ', response?.data);
      conversationHistory();
      setMessage('');
      // Alert.alert('Successful Ticket Reply');
    } catch (error) {
      console.log(error);
    }
  };

  // const getConversaion = async () => {
  //   const doctoreId = await AsyncStorage.getItem('userId');
  //   try {
  //     const conversationResponse = await api.get(
  //       `/doctor-conversation/get-by-doctor/${doctoreId}`,
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    if (isFocused) {
      // getConversaion();
      conversationHistory();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {/* Ticket Header */}
      <View style={styles.card}>
        <Text style={styles.subject}>{ticket?.ticketTitle}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Title</Text>
          <Text style={styles.value}>{ticket?.ticketTitle || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{displayDate}</Text>
        </View>

        <View
          style={[
            styles.row,
            {
              marginTop: 10,
              // backgroundColor: '#f0f0f0',
              // padding: 10,
              borderRadius: 8,
            },
          ]}>
          <Text style={[styles.label, {alignSelf: 'center'}]}>Status</Text>
          <View style={[styles.statusBadge, getStatusStyle(ticket.status)]}>
            <Text style={styles.statusText}>{ticket.status}</Text>
          </View>
        </View>
      </View>

      {/* ================= Conversation ================= */}
      <Text style={styles.sectionTitle}>Conversation</Text>

      <View style={styles.chatContainer}>
        <FlatList
          data={reversedData}
          keyExtractor={item => item._id}
          renderItem={({item}) => <MessageBubble item={item} />}
          showsVerticalScrollIndicator={false}
          inverted
          contentContainerStyle={{paddingVertical: 10}}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No messages yet</Text>
          }
        />
      </View>

      {/* ================= Reply ================= */}
      {ticket.status !== 'Closed' && (
        <View style={styles.chatInputContainer}>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Type a message"
              placeholderTextColor="#888"
              value={message}
              onChangeText={setMessage}
              style={styles.textInput}
              multiline
            />

            <TouchableOpacity
              style={[styles.sendBtn, {opacity: message.trim() ? 1 : 0.5}]}
              disabled={!message.trim()}
              onPress={handleSendMessage}>
              <Text style={styles.sendText}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
  },

  subject: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D47A1',
    marginBottom: 15,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  label: {
    color: '#666',
    fontSize: 14,
  },

  value: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },

  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    // marginTop: 10,
  },

  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },

  statusOpen: {
    backgroundColor: '#388E3C',
  },

  statusProgress: {
    backgroundColor: '#1976D2',
  },

  statusClosed: {
    backgroundColor: '#F57C00',
  },

  statusDefault: {
    backgroundColor: '#757575',
  },

  sectionTitle: {
    marginTop: 25,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  /* ================= CHAT ================= */
  chatContainer: {
    height: SCREEN_HEIGHT * 0.5,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 10,
  },

  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
  },

  leftBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#ddd',
    borderTopLeftRadius: 0,
  },

  rightBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#9fbad4',
    borderTopRightRadius: 0,
  },

  bubbleText: {
    color: '#000',
  },

  time: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    alignSelf: 'flex-end',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },

  replyBtn: {
    marginTop: 16,
    backgroundColor: '#1976D2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  replyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  chatInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F0F0F0',
    padding: 10,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  textInput: {
    flex: 1,
    maxHeight: 120,
    fontSize: 16,
    color: '#000',
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
