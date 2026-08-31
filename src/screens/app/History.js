import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale, verticalScale, vs} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {colorGlobal} from '../../utils/globalStyls';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function History({route}) {
  const navigation = useNavigation();
  const [selectedButton, setSelectedButton] = useState('message');
  const [upcomingMessage, setUpcomingMessage] = useState([]);
  const [upcomingVoicecall, setUpcomingVoicecall] = useState([]);
  const [upcomingVideocall, setUpcomingVideocall] = useState([]);
  const [upcomingPhysicalVisit, setUpcomingPhysicalVisit] = useState([]);

  const buttons = [
    {label: 'Message', key: 'message'},
    {label: 'Voice Call', key: 'voicecall'},
    {label: 'Video Call', key: 'videocall'},
    {label: 'Physical Visit', key: 'physicalvisit'},
  ];

  //get api call for chat
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = await AsyncStorage.getItem(`userId`);
      try {
        const response = await api.get(`/docChat/chatViewByDoctor/${userId}`);
        setUpcomingMessage(response.data.Chat);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserDetails();
  }, []);

  // type of appointment
  useEffect(() => {
    if (route.params?.type) {
      setSelectedButton(route.params.type);
    }
  }, [route.params?.type]);

  // get api for voice call
  useEffect(() => {
    const fetchVoiceCallDetails = async () => {
      const userId = await AsyncStorage.getItem(`userId`);

      try {
        const response = await api.get(`/docVoice/voicebyDoctor/${userId}`);
        setUpcomingVoicecall(response.data.voice || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVoiceCallDetails();
  }, []);

  // get api for video call
  useEffect(() => {
    const fetchVideoCallDeatils = async () => {
      try {
        const response = await api.get('docVideo/videoView');
        setUpcomingVideocall(response.data.video);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVideoCallDeatils();
  }, []);

  // get api for physical visit
  useEffect(() => {
    const fetchPhysicalVisitDetails = async () => {
      try {
        const response = await api.get('docPhysical/visitView');
        setUpcomingPhysicalVisit(response.data.PhyVisit);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPhysicalVisitDetails();
  }, []);

  const renderUpcomingmessageItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={10}
      onPress={() =>
        navigation.navigate('ChatScreen', {
          patientName: item.patientName,
          userId: item._id,
        })
      }>
      <View style={styles.listView}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.image}>
            <AntDesign
              name="mail"
              style={{
                color: colorGlobal.themeColor,
                fontSize: scale(24),
                marginLeft: scale(0),
              }}
            />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.DrText}> {item.patientName}</Text>
            <Text style={styles.DignosistText}>
              Amount: ₹{item.totalAmount}
            </Text>
          </View>
          <View style={{flex: 1.2}}>
            <Text style={styles.DignosistText}>
              Date: {item.updatedAt?.slice(0, 10)}
            </Text>
            <Text style={styles.DignosistText}>
              Chat Duration: {item.callDuration}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderVoicecallItem = ({item}) => (
    <View key={item.id} style={styles.listView}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.image}>
          <Feather
            name="phone"
            style={{
              color: colorGlobal.themeColor,
              fontSize: scale(24),
              marginLeft: scale(0),
            }}
          />
        </View>
        <View style={{flex: 1, paddingHorizontal: 10, justifyContent: 'center'}}>
          <Text style={styles.DrText}> {item.patientName}</Text>
          <Text style={styles.DignosistText}>
            Date: {item.date?.slice(0, 10)}
          </Text>
          <Text style={styles.DignosistText}>
            Call Duration: {item.callDuration}
          </Text>
          <Text style={styles.DignosistText}>Amount: ₹{item.totalAmount}</Text>
        </View>
      </View>
    </View>
  );

  const renderVideocallItem = ({item}) => (
    <View key={item.id} style={styles.listView}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.image}>
          <AntDesign
            name="videocamera"
            style={{
              color: colorGlobal.themeColor,
              fontSize: scale(24),
              marginLeft: scale(0),
            }}
          />
        </View>
        <View style={{flex: 1, paddingHorizontal: 10, justifyContent: 'center'}}>
          <Text style={styles.DrText}> {item.patientName}</Text>
          <Text style={styles.DignosistText}>
            Date: {item.createdAt?.slice(0, 10)}
          </Text>
          <Text style={styles.DignosistText}>
            Duration: {item.callDuration}
          </Text>
          <Text style={styles.DignosistText}>Amount: ₹{item.totalAmount}</Text>
        </View>
      </View>
    </View>
  );

  const renderPhysicalVisitItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={10}
      // onPress={() => navigation.navigate("ChatScreen", { doctorName: item.doctorName })}
    >
      <View style={styles.listView}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.image}>
            <AntDesign
              name="user"
              style={{
                color: colorGlobal.themeColor,
                fontSize: scale(24),
                marginLeft: scale(0),
              }}
            />
          </View>
          <View style={{flex: 1, marginRight: 5}}>
            <Text style={styles.DrText}> {item.patientName}</Text>
            <Text style={styles.DignosistText}> Amount: ₹{item.payment}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.DignosistText}>
              Date: {item.createdAt?.slice(0, 10)}
            </Text>
            <Text style={styles.DignosistText}> Address: {item.address}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getSelectedAppointments = () => {
    switch (selectedButton) {
      case 'message':
        return upcomingMessage;
      case 'voicecall':
        return upcomingVoicecall;
      case 'videocall':
        return upcomingVideocall;
      case 'physicalvisit':
        return upcomingPhysicalVisit;
      default:
        return [];
    }
  };
  const renderButton = ({item}) => (
    <TouchableOpacity
      key={item.key}
      activeOpacity={0.9}
      onPress={() => setSelectedButton(item.key)}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: vs(35),
        width: scale(100),

        marginRight: 10,
        backgroundColor:
          selectedButton === item.key ? colorGlobal.themeColor : 'white',
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: colorGlobal.themeColor,
      }}>
      <Text
        style={{
          fontSize: scale(14),
          color: selectedButton === item.key ? 'white' : 'black',
          fontWeight: '600',
        }}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  // empty
  const EmptyState = ({title, subtitle, icon}) => (
    <View style={styles.emptyContainer}>
      {icon}
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
    </View>
  );
  const selectedData = [...(getSelectedAppointments() || [])].reverse();
  const isEmpty = selectedData.length === 0;
  console.log('SELECTED DATA', selectedData);

  return (
    <View style={styles.container}>
      {/* Top Tabs */}
      <View style={styles.tabWrapper}>
        <FlatList
          data={buttons}
          renderItem={renderButton}
          keyExtractor={item => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.navigation}
        />
      </View>

      {/* Content */}
      <View style={styles.body}>
        {isEmpty ? (
          <View style={styles.emptyWrapper}>
            {selectedButton === 'message' && (
              <AntDesign name="mail" size={70} color="#D3D3D3" />
            )}
            {selectedButton === 'voicecall' && (
              <Feather name="phone" size={70} color="#D3D3D3" />
            )}
            {selectedButton === 'videocall' && (
              <AntDesign name="videocamera" size={70} color="#D3D3D3" />
            )}
            {selectedButton === 'physicalvisit' && (
              <AntDesign name="calendar" size={70} color="#D3D3D3" />
            )}

            <Text style={styles.emptyTitle}>
              {selectedButton === 'message'
                ? 'No Messages Yet'
                : selectedButton === 'voicecall'
                ? 'No Voice Calls Found'
                : selectedButton === 'videocall'
                ? 'No Video Calls Found'
                : 'No Physical Visits Found'}
            </Text>

            <Text style={styles.emptySubtitle}>
              Your appointment history will appear here once available.
            </Text>
          </View>
        ) : (
          <FlatList
            data={selectedData}
            renderItem={
              selectedButton === 'message'
                ? renderUpcomingmessageItem
                : selectedButton === 'voicecall'
                ? renderVoicecallItem
                : selectedButton === 'videocall'
                ? renderVideocallItem
                : renderPhysicalVisitItem
            }
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 30}}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerMain: {
    elevation: 5,
    alignSelf: 'center',
    marginTop: verticalScale(10),
    backgroundColor: 'white',
    borderRadius: 10,
    height: verticalScale(70),
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(320),
  },
  containerMainVoice: {
    elevation: 5,
    margin: verticalScale(15),
    marginTop: verticalScale(5),
    backgroundColor: 'white',
    borderRadius: 10,
    height: verticalScale(100),
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(320),
  },
  container: {backgroundColor: colorGlobal.lightWhite},

  navigation: {
    // paddingVertical: 8,
    marginHorizontal: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,

    paddingVertical: 10,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: vs(35),
    width: scale(90),
    borderRadius: 10,
  },
  listView: {
    width: '95%',
    borderRadius: 10,
    marginVertical: 5,
    alignSelf: 'center',
    backgroundColor: colorGlobal.white,
    justifyContent: 'center',
    alignItems: 'left',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    padding: 10,
  },
  image: {
    height: 50,
    width: 55,
    marginHorizontal: 10,
    borderRadius: 40,
    justifyContent: 'center',
  },
  imageVoice: {
    height: vs(70),
    width: scale(70),
    borderRadius: 40,
    justifyContent: 'center',
    marginTop: verticalScale(5),
    marginLeft: scale(-10),
  },
  textList: {
    fontSize: 16,
    color: colorGlobal.black,
    marginTop: 5,
    marginLeft: 5,
  },
  button: {
    height: 42,
    backgroundColor: colorGlobal.themeColor,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
  },
  DrText: {
    fontSize: scale(14),
    color: 'black',
    fontWeight: '700',
    paddingTop: 5,
  },
  DignosistText: {
    fontSize: scale(12),
    color: 'gray',
    fontWeight: '600',
    marginTop: vs(2),
    marginLeft: scale(4),
    paddingTop: 5,
  },
  // empty
  container: {
    flex: 1,
    backgroundColor: colorGlobal.lightWhite,
  },

  tabWrapper: {
    backgroundColor: '#fff',
    elevation: 4,
  },

  body: {
    flex: 1,
  },

  navigation: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },

  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: scale(18),
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },

  emptySubtitle: {
    fontSize: scale(14),
    color: '#777',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});
