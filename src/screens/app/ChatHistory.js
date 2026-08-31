import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, ScrollView, SafeAreaView} from 'react-native';
import {Text, Appbar} from 'react-native-paper';
import api from '../../utils/api';
import {colorGlobal} from '../../utils/globalStyls';
import Loader from '../../components/Loadder';

const ChatHistory = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [chatHistory, setChatHistory] = useState([]);
  const {doctorName} = route.params;
  const {roomId} = route.params;
  const [loading, setLoading] = useState(true);

  const chatHandler = async () => {
    const userId = await AsyncStorage.getItem('userId');

    try {
      const response = await api.get(
        `/patientPanel-chatHistory/view-by-patientId/${userId}`,
      );
      const data = response.data.chat.filter(item => item._id === roomId);

      const chatMessages = data[0].messages;
      setChatHistory(chatMessages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatHandler();
  }, []);
  if (loading) {
    return (
      <View style={styles.loading}>
        <Loader
          animating={loading}
          size={'large'}
          color={colorGlobal.themeColor}
        />
      </View>
    );
  }
  const sortedMessages = chatHistory.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  );

  const renderItem = ({item}) => {
    const isUserMessage = item.sender === 'patient';
    return (
      <ScrollView>
        <View
          style={[
            styles.messageContainer,
            isUserMessage ? styles.user : styles.docSender,
          ]}>
          <Text style={styles.messageText}>{item.message}</Text>
          <Text style={styles.messageTime}>
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={doctorName} />
      </Appbar.Header>
      <FlatList
        data={sortedMessages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
        inverted
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  messageContainer: {
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: colorGlobal.themeColor,
  },
  docSender: {
    alignSelf: 'flex-start',
    backgroundColor: colorGlobal.gray,
  },
  messageText: {
    fontSize: 16,
    color: colorGlobal.white,
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
    color: colorGlobal.white,
    marginTop: 5,
  },
});

export default ChatHistory;
