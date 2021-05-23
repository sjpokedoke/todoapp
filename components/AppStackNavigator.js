import * as React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Donate from '../screens/Donate';
import ReceiverDetailsScreen from '../screens/ReceiverDetailsScreen';

export const AppStackNavigator = createStackNavigator({
  BookDonateList: {
    screen: Donate,
    navigationOptions: {
      headerShown: false
    }
  },

  ReceiverDetails: {
    screen: ReceiverDetailsScreen,
    navigationOptions: {
      headerShown: false
    }
  }
  
},
{
  initialRouteName: 'BookDonateList'
}

)