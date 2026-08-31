export const colorGlobal = {
  black: '#000',
  white: '#fff',
  yellow: 'yellow',
  blue: 'blue',
  gray: 'gray',
  lightGray: '#ccc',
  medicine: '#883d3d',
  // themeColor: '#1A81C4',
  themeColor: '#009281',
  seaGreen: '#20B2AA',
  lightSeaGreen: '#DBF7F2',
  lightWhite: '#F1F1F1',
  messageSender: '#d1f7c4',
  error: '#F33E3E',
};
import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';

export default styles = StyleSheet.create({
  error: {
    color: '#ED4337',
    alignSelf: 'flex-end',
    fontSize: scale(12),
  },
  headerIcon: {width: 24, height: 24, marginRight: 10},
  spaceLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
    marginVertical: scale(5),
  },
  image: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
  profileImageView: {
    width: 110,
    height: 110,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 5,
    // elevation: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  inputHeading: {
    color: colorGlobal.black,
    fontWeight: '500',
    fontSize: scale(16),
    //paddingBottom: 5,
  },
  inputPassView: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,

    paddingRight: 10,

    backgroundColor: colorGlobal.lightWhite,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
});
