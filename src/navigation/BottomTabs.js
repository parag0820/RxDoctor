import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../screens/app/Home';
import Appointment from '../screens/app/Appointment';
import Profile from '../screens/app/Profile';
import { colorGlobal } from '../utils/globalStyls';
import Report from '../screens/app/Report';
import Prescription from '../screens/app/Prescription';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Appointment') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Report') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Prescription') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colorGlobal.themeColor,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 55,
          paddingBottom: 5,
          paddingTop: 5,
        },
      })}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ unmountOnBlur: false }}
      />
      <Tab.Screen
        name="Appointment"
        component={Appointment}
        options={{ unmountOnBlur: false }}
      />
      <Tab.Screen
        name="Report"
        component={Report}
        options={{ unmountOnBlur: false }}
      />
      <Tab.Screen
        name="Prescription"
        component={Prescription}
        options={{ unmountOnBlur: false }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ unmountOnBlur: false }}
      />
    </Tab.Navigator>
  );
}
