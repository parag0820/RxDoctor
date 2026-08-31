import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';

import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  RtcSurfaceView,
  VideoSourceType,
} from 'react-native-agora';

const APP_ID = '110d0f15b9ca4574a4c92832f37b8e66';
const CHANNEL = 'test';
const TOKEN = null;

export default function AgoraVideoCall({navigation}) {
  const engineRef = useRef(null);

  const [joined, setJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);

  // =========================
  // PERMISSIONS
  // =========================
  const requestPermissions = async () => {
    if (Platform.OS !== 'android') return true;

    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);

    return (
      result['android.permission.CAMERA'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      result['android.permission.RECORD_AUDIO'] ===
        PermissionsAndroid.RESULTS.GRANTED
    );
  };

  // =========================
  // INIT AGORA
  // =========================
  const startCall = async () => {
    const granted = await requestPermissions();
    if (!granted) {
      Alert.alert('Permission required');
      return;
    }

    const engine = createAgoraRtcEngine();
    engineRef.current = engine;

    engine.initialize({
      appId: APP_ID,
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
    });

    engine.setClientRole(ClientRoleType.ClientRoleBroadcaster);

    engine.enableVideo();

    engine.setVideoEncoderConfiguration({
      dimensions: {width: 640, height: 360},
      frameRate: 15,
      bitrate: 800,
    });

    engine.registerEventHandler({
      onJoinChannelSuccess: () => {
        setJoined(true);
      },
      onUserJoined: (_connection, uid) => {
        setRemoteUid(uid);
      },
      onUserOffline: () => {
        setRemoteUid(null);
      },
    });

    engine.startPreview();

    engine.joinChannel(TOKEN, CHANNEL, 0, {
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    });
  };

  // =========================
  // END CALL
  // =========================
  const endCall = () => {
    try {
      engineRef.current?.leaveChannel();
      engineRef.current?.release();
    } catch (e) {}

    navigation.goBack();
  };

  // =========================
  // TIMER
  // =========================
  useEffect(() => {
    if (!joined) return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          endCall();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [joined]);

  // =========================
  // UI
  // =========================
  if (!joined) {
    return (
      <View style={styles.center}>
        <TouchableOpacity style={styles.startBtn} onPress={startCall}>
          <Text style={styles.btnText}>Start Video Call</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* REMOTE VIDEO */}
      {remoteUid !== null && (
        <RtcSurfaceView
          style={styles.remoteVideo}
          canvas={{uid: remoteUid, renderMode: 1}}
        />
      )}

      {/* LOCAL VIDEO */}
      <RtcSurfaceView
        style={styles.localVideo}
        canvas={{
          uid: 0,
          sourceType: VideoSourceType.VideoSourceCamera,
          renderMode: 1,
        }}
      />

      {/* TIMER */}
      <Text style={styles.timer}>
        {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, '0')}
      </Text>

      {/* END CALL */}
      <TouchableOpacity style={styles.endBtn} onPress={endCall}>
        <Text style={styles.endText}>END</Text>
      </TouchableOpacity>
    </View>
  );
}

// =========================
// STYLES
// =========================
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  startBtn: {
    backgroundColor: 'green',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  remoteVideo: {
    flex: 1,
  },
  localVideo: {
    width: 120,
    height: 160,
    position: 'absolute',
    right: 10,
    top: 10,
  },
  timer: {
    position: 'absolute',
    top: 20,
    left: 20,
    color: '#fff',
    fontSize: 16,
  },
  endBtn: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'red',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
  },
  endText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
