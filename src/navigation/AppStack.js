import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
// import EditProfile from '../screens/app/EditProfile';
import Notifications from '../screens/app/Notifications';
import Wallet from '../screens/app/Wallet';
import OrderHistory from '../screens/app/OrderHistory';
import HelpCenter from '../screens/app/HelpCenter';
import FilterScreen from '../screens/app/FilterScreen';
import DoctorDetails from '../screens/app/DoctorDetails';
import MyAppointment from '../screens/app/MyAppoinment';
import History from '../screens/app/History';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import AgoraVideoCall from '../screens/app/AgoraVideoCall';
import AgoraVoiceCall from '../screens/app/AgoraVoiceCall';
import ChatHistory from '../screens/app/ChatHistory';
import CreateTicket from '../screens/app/CreateTicket';
import TicketCard from '../components/TicketCard';
import TicketDetail from '../screens/app/TicketDetail';
import TicketList from '../screens/app/TicketList';
import ReplyTicket from '../screens/app/ReplyTicket';
import PatientDetails from '../screens/app/PatientDetails';
import SearchAllPatients from '../screens/app/SearchAllPatients';
import PrescriptionDetail from '../screens/app/PrescriptionDetail';
import CancelAppointment from '../screens/app/CancelAppointment';
import CustomDatePicker from '../screens/app/CustomDatePicker';
import PatientPrescription from '../screens/app/PatientPrescription';
import PdfViewer from '../screens/app/PdfViewer';
import PrescribeTest from '../screens/app/PrescribeTest';
import PdfTestViewer from '../screens/app/PdfTestViewer';
import ChatSocketOi from '../screens/app/ChatSocketOi';
import Personal from '../screens/app/Personal';
import Password from '../screens/app/Password';
import Other from '../screens/app/Other';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {colorGlobal} from '../utils/globalStyls';
import ReportDetail from '../screens/app/ReportDetail';
import PrivacyPolicy from '../screens/app/PrivacyPolicy';
import TermsConditions from '../screens/app/TermsConditions';
import ChatScreen from '../screens/app/ChatScreen';

const Stack = createNativeStackNavigator();
const MaterialTab = createMaterialTopTabNavigator();

function TopViewNav() {
  return (
    <MaterialTab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontSize: 14},
        tabBarActiveTintColor: colorGlobal.white,
        tabBarInactiveTintColor: colorGlobal.black,
        tabBarPressColor: colorGlobal.seaGreen,
        tabBarStyle: {backgroundColor: colorGlobal.themeColor},
      }}>
      <MaterialTab.Screen name="Personal" component={Personal} />
      <MaterialTab.Screen name="Other" component={Other} />
      <MaterialTab.Screen name="Password" component={Password} />
    </MaterialTab.Navigator>
  );
}

export default function AppStack() {
  // const cartQty = Number(useSelector(state => state.doctor.cartQty)) || 0;
  // console.log('QTY Diagnoistic', cartQty);

  const navigation = useNavigation();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTabs" component={BottomTabs} />

      <Stack.Screen
        name="SearchAllPatients"
        component={SearchAllPatients}
        options={{headerShown: true, title: 'Search Patients '}}
      />
      <Stack.Screen
        name="PatientPrescription"
        component={PatientPrescription}
        options={{headerShown: true, title: 'Patient Prescriptions'}}
      />
      <Stack.Screen
        name="PdfViewer"
        component={PdfViewer}
        options={{headerShown: true, title: 'Pdf View'}}
      />
      <Stack.Screen
        name="PdfTestViewer"
        component={PdfTestViewer}
        options={{headerShown: true, title: 'Pdf Test View'}}
      />
      <Stack.Screen
        name="PrescribeTest"
        component={PrescribeTest}
        options={{headerShown: true, title: 'Prescribe Test'}}
      />
      <Stack.Screen
        name="ReportDetail"
        component={ReportDetail}
        options={{headerShown: true, title: 'Report Detail'}}
      />
      <Stack.Screen
        name="PatientDetails"
        component={PatientDetails}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="CancelAppointment"
        component={CancelAppointment}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="CustomDatePicker"
        component={CustomDatePicker}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="PrescriptionDetail"
        component={PrescriptionDetail}
        options={{headerShown: true, title: 'Prescription Details'}}
      />
      <Stack.Screen
        name="FilterScreen"
        component={FilterScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="DoctorDetails"
        component={DoctorDetails}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="History"
        component={History}
        options={{headerShown: true}}
      />

      <Stack.Screen name="ChatSIO" component={ChatSocketOi} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />

      <Stack.Screen
        name="MyAppointment"
        component={MyAppointment}
        options={{headerShown: true, title: 'My Appointment'}}
      />
      <Stack.Screen
        name="AgoraVoiceCall"
        component={AgoraVoiceCall}
        options={{headerShown: true, title: 'Voice Call'}}
      />
      <Stack.Screen
        name="ChatHistory"
        component={ChatHistory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AgoraVideoCall"
        component={AgoraVideoCall}
        options={{headerShown: true, title: 'Video Call'}}
      />
      <Stack.Screen
        name="EditProfile"
        component={TopViewNav}
        options={{headerShown: true, title: 'Edit Profile'}}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Wallet"
        component={Wallet}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="HelpCenter"
        component={HelpCenter}
        options={{headerShown: true}}
      />

      <Stack.Screen
        name="CreateTicket"
        component={CreateTicket}
        options={{headerShown: true, title: 'Create Ticket'}}
      />
      <Stack.Screen
        name="TicketCard"
        component={TicketCard}
        options={{headerShown: true, title: 'Ticket Card'}}
      />
      <Stack.Screen
        name="TicketDetail"
        component={TicketDetail}
        options={{headerShown: true, title: 'Ticket Detail'}}
      />
      <Stack.Screen
        name="TicketList"
        component={TicketList}
        options={{headerShown: true, title: 'Ticket List'}}
      />
      <Stack.Screen
        name="ReplyTicket"
        component={ReplyTicket}
        options={{headerShown: true, title: 'Reply Ticket'}}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{headerShown: true, title: 'Privacy Policy'}}
      />
      <Stack.Screen
        name="TermsConditions"
        component={TermsConditions}
        options={{headerShown: true, title: 'Terms & Conditions'}}
      />
    </Stack.Navigator>
  );
}
