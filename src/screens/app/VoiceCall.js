import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {colorGlobal} from '../../utils/globalStyls';
import {vs, verticalScale, scale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function VoiceCall() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const togglePlayback = () => {
    setIsAudioPlaying(!isAudioPlaying);
  };

  return (
    <View style={{flex: 1, backgroundColor: colorGlobal.white}}>
      <View
        style={{
          flexDirection: 'row',
          height: verticalScale(100),
          width: '100%',
          alignItems: 'center',
          padding: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          justifyContent: 'space-evenly',
        }}>
        <Image
          source={require('../image/Doc.png')}
          style={{
            height: verticalScale(75),
            width: scale(75),
            borderRadius: 10,
            marginTop: verticalScale(5),
          }}
        />

        <View style={{justifyContent: 'space-between'}}>
          <Text style={styles.DrText}>Dr Prem Dubey</Text>
          <Text style={{fontSize: scale(12), color: 'gray'}}>Voice Call</Text>
          <Text style={{fontSize: scale(12), color: 'gray'}}>
            Today | 10:AM
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            marginLeft: scale(15),
            backgroundColor: '#CCE9E5',
            height: 65,
            width: 65,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* <FontAwesome name='phone' style={{ color: colorGlobal.themeColor, fontSize: scale(18) }} /> */}
          <Image
            source={require('../image/phone.png')}
            style={{height: 24, width: 24}}
            tintColor={colorGlobal.themeColor}
          />
        </View>
      </View>

      <View
        style={{
          width: '90%',
          height: verticalScale(0.5),
          borderWidth: 0.3,
          marginTop: verticalScale(20),
          alignSelf: 'center',
        }}></View>

      <Text
        style={{
          padding: scale(20),
          fontSize: scale(14),
          color: 'black',
          fontWeight: '700',
        }}>
        30 minutes of voice calls have been recorded
      </Text>

      {!isPlaying ? (
        <TouchableOpacity
          style={{
            height: verticalScale(40),
            width: '80%',
            backgroundColor: colorGlobal.themeColor,
            alignSelf: 'center',
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}
          onPress={() => setIsPlaying(true)}>
          <AntDesign
            name="play"
            style={{fontSize: scale(14), color: colorGlobal.white}}
          />
          <Text
            style={{
              fontSize: scale(14),
              color: 'white',
              fontWeight: '700',
              marginLeft: scale(5),
            }}>
            Play Audio Recording
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontSize: scale(14),
              color: 'black',
              fontWeight: '700',
              marginBottom: verticalScale(10),
            }}>
            Playing Audio...
          </Text>
          {/* <Slider
                        style={{ width: '80%', height: 40 }}
                        minimumValue={0}
                        maximumValue={1}
                        minimumTrackTintColor={colorGlobal.themeColor}
                        maximumTrackTintColor="#000000"
                    /> */}
          <View style={{flexDirection: 'row', marginTop: verticalScale(10)}}>
            <TouchableOpacity
              style={{
                height: verticalScale(40),
                width: '40%',
                backgroundColor: colorGlobal.themeColor,
                alignSelf: 'center',
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginRight: scale(10),
              }}
              onPress={togglePlayback}>
              <AntDesign
                name={isAudioPlaying ? 'pause' : 'caretright'}
                style={{fontSize: scale(14), color: colorGlobal.white}}
              />
              <Text
                style={{
                  fontSize: scale(14),
                  color: 'white',
                  fontWeight: '700',
                  marginLeft: scale(5),
                }}>
                {isAudioPlaying ? 'Pause' : 'Play'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: verticalScale(40),
                width: '40%',
                backgroundColor: 'red',
                alignSelf: 'center',
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}
              onPress={() => {
                setIsPlaying(false);
                setIsAudioPlaying(false);
              }}>
              <AntDesign
                name="close"
                style={{fontSize: scale(14), color: colorGlobal.white}}
              />
              <Text
                style={{
                  fontSize: scale(14),
                  color: 'white',
                  fontWeight: '700',
                  marginLeft: scale(5),
                }}>
                Stop
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  Image: {
    height: vs(70),
    width: scale(70),
    // backgroundColor: 'gray',
    borderRadius: 40,
    justifyContent: 'center',
    marginTop: verticalScale(5),
  },
  DrText: {
    fontSize: scale(16),
    color: 'black',
    fontWeight: '700',
  },
});
