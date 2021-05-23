import * as React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator';
import { Icon } from 'react-native-elements';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingScreen from '../screens/SettingScreen';
import MyDonations from '../screens/MyDonations';
import NotificationScreen from '../screens/NotificationScreen';
import MyReceivedItemsScreen from '../screens/MyReceivedItemsScreen'

export const AppDrawerNavigator = createDrawerNavigator({
    Home: {
      screen: AppTabNavigator,
      navigationOptions: {
        drawerIcon: <Icon name='home' type='font-awesome' color='#A65F2D'/>
      }
    },
    MyBarters: {
      screen: MyDonations,
      navigationOptions: {
        drawerIcon: <Icon name='gift' type='font-awesome' color='#A65F2D'/>
      }
    },
    Notifications: {
      screen: NotificationScreen,
      navigationOptions: {
        drawerIcon: <Icon name='bell' type='font-awesome' color='#A65F2D'/>
      }
    },
    Settings: {
      screen: SettingScreen,
      navigationOptions: {
        drawerIcon: <Icon name='settings' type='font-awesome5' color='#A65F2D'/>
      }
    },
    ReceivedItems: {
      screen: MyReceivedItemsScreen,
      navigationOptions: {
        drawerIcon: <Icon name='gift' type='font-awesome' color='#A65F2D'/>
      }
    }
  },
  
  {
    contentComponent: CustomSideBarMenu,
  },
  {
    initialRouteName: 'Home'
  }
)