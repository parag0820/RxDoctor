import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {colorGlobal} from '../../utils/globalStyls';
import axios from 'axios';
import BASE_URL from '../../utils/baseUrl';

const FilterScreen = ({navigation}) => {
  const [cities, setCities] = useState([
    {name: 'Indore', selected: false},
    {name: 'Bhopal', selected: false},
    {name: 'Ujjain', selected: false},
  ]);
  const [availability, setAvailability] = useState({
    online: false,
    offline: false,
  });
  const [experience, setExperience] = useState({
    fiveYears: false,
    aboveFiveYears: false,
  });
  const [specializations, setSpecializations] = useState({
    cardiologist: false,
    generalPhysician: false,
    gastroenterologist: false,
    nephrologist: false,
  });

  const handleCityChange = index => {
    const newCities = [...cities];
    newCities[index].selected = !newCities[index].selected;
    setCities(newCities);
  };

  const handleSpecializationChange = field => {
    setSpecializations({...specializations, [field]: !specializations[field]});
  };

  const handleSubmit = async () => {
    const selectedCities = cities
      .filter(city => city.selected)
      .map(city => city.name);
    const selectedSpecializations = Object.keys(specializations).filter(
      key => specializations[key],
    );

    const selectedFilters = {
      city: selectedCities,
      availability,
      experience,
      specializations: selectedSpecializations,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}doctorPanel/filterDoctor`,
        selectedFilters,
      );
      // Handle the response as needed
      navigation.navigate('Search', {data: response.data});
    } catch (error) {
      console.error('Error submitting filters', error);
      // Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading}>By City</Text>
        {cities.map((city, index) => (
          <View key={index} style={styles.checkboxContainer}>
            <CheckBox
              value={city.selected}
              onValueChange={() => handleCityChange(index)}
            />
            <Text style={styles.label}>{city.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Availability</Text>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={availability.online}
            onValueChange={() =>
              setAvailability({...availability, online: !availability.online})
            }
          />
          <Text style={styles.label}>Online</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={availability.offline}
            onValueChange={() =>
              setAvailability({...availability, offline: !availability.offline})
            }
          />
          <Text style={styles.label}>Offline</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Experience</Text>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={experience.fiveYears}
            onValueChange={() =>
              setExperience({...experience, fiveYears: !experience.fiveYears})
            }
          />
          <Text style={styles.label}>1 to 5 Years</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={experience.aboveFiveYears}
            onValueChange={() =>
              setExperience({
                ...experience,
                aboveFiveYears: !experience.aboveFiveYears,
              })
            }
          />
          <Text style={styles.label}>Above 5 Years</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Specialization</Text>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={specializations.cardiologist}
            onValueChange={() => handleSpecializationChange('cardiologist')}
          />
          <Text style={styles.label}>Cardiologist</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={specializations.generalPhysician}
            onValueChange={() => handleSpecializationChange('generalPhysician')}
          />
          <Text style={styles.label}>General Physician</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={specializations.gastroenterologist}
            onValueChange={() =>
              handleSpecializationChange('gastroenterologist')
            }
          />
          <Text style={styles.label}>Gastroenterologist</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={specializations.nephrologist}
            onValueChange={() => handleSpecializationChange('nephrologist')}
          />
          <Text style={styles.label}>Nephrologist</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.Button} onPress={handleSubmit}>
        <Text style={styles.ButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    tintColor: 'black',
  },
  label: {
    marginLeft: 8,
    color: 'black',
    fontSize: 16,
  },
  Button: {
    alignSelf: 'center',
    backgroundColor: colorGlobal.themeColor,
    height: 45,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  ButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
  },
});

export default FilterScreen;
