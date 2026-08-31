import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import SearchBar from '../../components/SearchBar';
import {scale} from 'react-native-size-matters';
import ModalFilter from '../../components/ModalFilter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loadder';
import api from '../../utils/api';
import {colorGlobal} from '../../utils/GlobalStyles';
import BASE_URL from '../../utils/baseUrl';

export default function SearchAllPatients({navigation}) {
  const [search, setSearch] = useState('');
  const searchRef = useRef();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [oldData, setOldData] = useState([]);
  const [isModelVisible, setisModelVisible] = useState(false);

  const isFocused = useIsFocused();

  const getPatients = async () => {
    const userId = await AsyncStorage.getItem('userId');

    try {
      const response = await api.get(
        `/docReqAppointment/viewByDoctor/${userId}`,
      );

      const result = response.data.reqAppointment;
      console.log('id', response.data.reqAppointment);

      // Use reduce to create a map of unique requests based on patientId._id
      const uniqueRequestsMap = result.reduce((map, request) => {
        map[request.patientId._id] = request;
        return map;
      }, {});

      // Convert the map back to an array of objects
      const uniqueRequestsArray = Object.values(uniqueRequestsMap);

      setLoading(false);
      setData(uniqueRequestsArray);
      setOldData(uniqueRequestsArray);
    } catch (error) {
      console.error('Product:', error);
    }
  };

  const onSearch = text => {
    if (text === '') {
      setData(oldData);
    } else {
      let tempList = oldData.filter(item => {
        return (
          item?.city.toLowerCase().includes(text.toLowerCase()) ||
          item?.city.toLowerCase().includes(text.toLowerCase())
        );
      });

      setData(tempList);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getPatients();
    }
  }, [isFocused]);

  const filteredData = data.filter(item => item.status === 'Accept');

  return (
    <View style={styles.mainContainer}>
      {loading ? <Loader size="large" animating={loading} /> : null}
      <View style={{flex: 1}}>
        {loading ? null : (
          <View style={{flex: 1, paddingBottom: 10}}>
            <View style={styles.searchView}>
              <SearchBar
                onPress={() => {
                  setSearch('');
                  onSearch('');
                  setData(oldData);
                }}
                image={require('../../assets/backI.png')}
                placeholder="search"
                onChangeText={txt => {
                  onSearch(txt);
                  setSearch(txt);
                }}
                value={search}
              />
              <TouchableOpacity
                onPress={() => {
                  setisModelVisible(true);
                }}>
                <Image
                  style={styles.filterImage}
                  source={require('../../assets/filter.png')}
                />
              </TouchableOpacity>
            </View>
            {filteredData.length === 0 ? (
              <View style={styles.noDataView}>
                <Text style={styles.noDataText}>No patient available yet!</Text>
                <Text style={styles.noDataText}>
                  Go to the notification accept patient requests
                </Text>
                <Text style={styles.noDataText}>
                  only then you can see patient details
                </Text>
              </View>
            ) : (
              <FlatList
                ref={searchRef}
                data={filteredData}
                renderItem={({item}) => (
                  <TouchableOpacity style={{overflow: 'hidden'}}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('PatientDetails', {
                          id: item._id,
                          patientId: item.patientId._id,
                        });
                      }}
                      style={styles.listContainer}>
                      <View style={styles.listView}>
                        <View style={styles.imageView}>
                          <Image
                            style={styles.image}
                            source={{
                              uri: `${BASE_URL}Images/${item.patientId.image}`,
                            }}
                          />
                        </View>
                      </View>
                      <View style={{justifyContent: 'center'}}>
                        <Text style={styles.heading}>
                          {'Name: '}
                          {item.patientId.fullname}
                        </Text>
                        <View style={styles.ratingView}>
                          <Text style={styles.rateList}>
                            {'Email: '}
                            {item.patientId.email}
                          </Text>
                        </View>
                        <Text style={styles.lessText}>
                          {'city: '}
                          {item.patientId.city}
                        </Text>
                        <View style={styles.rateView}>
                          <Text style={styles.lessText}>
                            {'Mobile Number: '}
                            {item.patientId.mobileNumber}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item._id}
              />
            )}
          </View>
        )}
      </View>

      <ModalFilter
        title={'Filter'}
        name={'sort Name a-z'}
        btotop={'sort Name z-a'}
        onPressCancel={() => {
          setisModelVisible(false);
        }}
        onPressN={() => {
          let tempList = data.sort((a, b) =>
            a.patientId.fullname.toLowerCase() >
            b.patientId.fullname.toLowerCase()
              ? 1
              : -1,
          );
          setData(tempList);
          searchRef.current?.scrollToIndex({index: 0, animated: true});
          setisModelVisible(false);
        }}
        onPressB={() => {
          let tempList = data.sort((a, b) =>
            a.patientId.fullname.toLowerCase() <
            b.patientId.fullname.toLowerCase()
              ? 1
              : -1,
          );
          setData(tempList);
          searchRef.current?.scrollToIndex({index: 0, animated: true});
          setisModelVisible(false);
        }}
        onPressT={() => {
          setData(data.sort((a, b) => b.price - a.price));
          listRef.current?.scrollToIndex({index: 0, animated: true});
          setisModelVisible(false);
        }}
        onPressR={() => {
          setData(data.sort((a, b) => b.ratings - a.ratings));
          listRef.current?.scrollToIndex({index: 0, animated: true});
          setisModelVisible(false);
        }}
        visible={isModelVisible}
        animationType="slide"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
    // paddingHorizontal: 10,
    backgroundColor: colorGlobal.lightWhite,
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: colorGlobal.white,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 2.54,
    elevation: 3,
  },
  searchView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 5,
  },
  listView: {
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
  },
  filterImage: {width: 20, height: 20, tintColor: '#000'},
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 7,
  },
  imageTow: {
    borderRadius: 10,
    width: 100,
    height: 100,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  heading: {
    fontSize: scale(12),
    color: '#000',
    fontWeight: '500',
    marginLeft: 10,
  },
  ratingView: {
    marginLeft: 10,
    flexDirection: 'row',
  },
  rateView: {
    flexDirection: 'row',
  },
  rateList: {
    color: colorGlobal.gray,
    fontSize: scale(12),
  },
  lessText: {
    fontSize: scale(12),
    color: 'grey',
    marginHorizontal: 10,
  },
  offText: {
    color: 'red',
  },
  available: {
    fontSize: scale(12),
    color: colorGlobal.gray,
    marginLeft: 10,
  },
  innerView: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: colorGlobal.gray,
  },
});
