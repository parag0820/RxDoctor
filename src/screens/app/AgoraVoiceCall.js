import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import moment from 'moment';

import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
} from 'react-native-agora';

import {colorGlobal} from '../../utils/globalStyls';
import api from '../../utils/api';

const APP_ID = '110d0f15b9ca4574a4c92832f37b8e66';
const CHANNEL = 'test';
const TOKEN = null;

export default function AgoraVoiceCall({navigation}) {
  const engineRef = useRef(null);
  const callEndedRef = useRef(false);

  const [voiceCall, setVoiceCall] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

  const route = useRoute();
  const {patientName, doctorId, patientId} = route.params;

  const currentDate = moment().format('DD-MM-YYYY');

  // ======================
  // PERMISSION
  // ======================
  const requestAudioPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // ======================
  // INIT AGORA AUDIO
  // ======================
  const initAgora = async () => {
    const engine = createAgoraRtcEngine();
    engineRef.current = engine;

    engine.initialize({
      appId: APP_ID,
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
    });

    engine.enableAudio();

    engine.joinChannel(TOKEN, CHANNEL, 0, {
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    });
  };

  // ======================
  // END CALL
  // ======================
  const endCallHandler = async () => {
    if (callEndedRef.current) return;
    callEndedRef.current = true;

    try {
      engineRef.current?.leaveChannel();
      engineRef.current?.release();
      engineRef.current = null;
    } catch (e) {}

    const totalDuration = 600 - timeLeft;

    const data = {
      patientId,
      doctorId,
      patientName,
      callDuration: formatTime(totalDuration),
      totalAmount: '1000',
      date: currentDate,
    };

    try {
      await api.post('/docVoice/voiceAdd', data);
    } catch (error) {
      console.log('Voice API error:', error);
    }

    setVoiceCall(false);
    navigation.goBack();
    navigation.navigate('PatientPrescription', {
      patientId,
      doctorId,
      patientName,
    });
  };

  // ======================
  // TIMER
  // ======================
  useEffect(() => {
    let timer;
    if (voiceCall && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      endCallHandler();
    }

    return () => clearInterval(timer);
  }, [voiceCall, timeLeft]);

  // ======================
  // INIT FLOW
  // ======================
  useEffect(() => {
    const start = async () => {
      const granted = await requestAudioPermission();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Microphone permission is required',
          [{text: 'OK', onPress: () => navigation.goBack()}],
        );
        return;
      }
      await initAgora();
    };

    start();

    return () => {
      engineRef.current?.leaveChannel();
      engineRef.current?.release();
    };
  }, []);

  // ======================
  // MUTE / UNMUTE
  // ======================
  const toggleMute = () => {
    const muted = !isMuted;
    setIsMuted(muted);
    engineRef.current?.muteLocalAudioStream(muted);
  };

  // ======================
  // TIME FORMAT
  // ======================
  const formatTime = seconds => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ======================
  // UI
  // ======================
  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{currentDate}</Text>

      {voiceCall && (
        <View style={styles.controls}>
          <TouchableOpacity onPress={toggleMute} style={styles.muteUnmute}>
            <Text style={styles.buttonText}>{isMuted ? 'UNMUTE' : 'MUTE'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={endCallHandler} style={styles.endButton}>
            <Text style={styles.buttonText}>END CALL</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ======================
// STYLES
// ======================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colorGlobal.black,
  },
  dateText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: colorGlobal.white,
  },
  controls: {
    flex: 1,
    justifyContent: 'flex-end',
    bottom: 50,
  },
  muteUnmute: {
    marginBottom: 40,
    backgroundColor: '#448EE4',
    padding: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  endButton: {
    backgroundColor: 'red',
    padding: 14,
    borderRadius: 30,
    width: 160,
    alignItems: 'center',
  },
  buttonText: {
    color: colorGlobal.white,
    fontWeight: 'bold',
  },
});
