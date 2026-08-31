import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

export default function ReplyTicket() {
  const [message, setMessage] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type your message"
        placeholderTextColor={'gray'}
        multiline
        value={message}
        onChangeText={setMessage}
      />

      <TouchableOpacity style={styles.sendBtn}>
        <Text style={styles.sendText}>Send Reply</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  input: {
    color: '#000',
    height: 120,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
  },
  sendBtn: {
    marginTop: 20,
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendText: {color: '#fff', fontWeight: 'bold'},
});
