import {View, StyleSheet, TextInput, Image} from 'react-native';
import {scale} from 'react-native-size-matters';
// import {colorGlobal} from '../utils/GlobalStyles';
import {colorGlobal} from '../utils/GlobalStyles';
export default function Input({
  placeholder,
  onChangeText,
  value,
  image,
  secureTextEntry,
  maxLength,
  keyboardType,
  onBlur,
  autoCapitalize,
  editable = true,
}) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputStyle}
        placeholder={placeholder}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        onBlur={onBlur}
        placeholderTextColor="gray"
        value={value}
        editable={editable}
      />
      {image ? (
        <View style={{marginRight: 20}}>
          <Image style={image} source={image} />
        </View>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: 50,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: colorGlobal.lightWhite,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputStyle: {
    width: '100%',
    marginLeft: 10,
    color: '#000',
    fontSize: scale(14),
  },
  image: {
    width: 24,
    height: 24,
    alignSelf: 'center',
  },
});
