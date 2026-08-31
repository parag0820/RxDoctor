import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute, useNavigation} from '@react-navigation/native';
import {colorGlobal} from '../../utils/globalStyls';
import {Appbar} from 'react-native-paper';

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation(); // ✅ added
  const [chatHistory, setChatHistory] = useState([]);
  const patientName = route.params.patientName;
  const patientId = route.params.userId;

  useEffect(() => {
    chatHandler();
  }, []);

  const chatHandler = async () => {
    const userId = await AsyncStorage.getItem('userId');

    try {
      const response = await api.get(`/docChat/chatViewByDoctor/${userId}`);
      const data = response.data.Chat.filter(item => item._id === patientId);
      const chatMessages = data[0].messages;
      setChatHistory(chatMessages);
    } catch (error) {
      console.log(error);
    }
  };

  const sortedMessages = chatHistory.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  );

  const renderItem = ({item}) => {
    return (
      <View
        style={[
          styles.messageContainer,
          item.sender === 'doctor' ? styles.docSender : styles.user,
        ]}>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      {/* ✅ HEADER ADDED */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={patientName} />
      </Appbar.Header>

      {/* ✅ YOUR ORIGINAL FLATLIST (UNCHANGED) */}
      <FlatList
        data={sortedMessages.reverse()}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#gray',
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    maxWidth: '75%',
  },
  docSender: {
    alignSelf: 'flex-end',
    backgroundColor: colorGlobal.themeColor,
  },
  user: {
    alignSelf: 'flex-start',
    backgroundColor: colorGlobal.gray,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorGlobal.white,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: '400',
    color: colorGlobal.white,
    textAlign: 'right',
  },
});

export default ChatScreen;
