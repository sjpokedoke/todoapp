import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Donate from '../screens/Donate';
import Request from '../screens/Request';
import { AppStackNavigator } from './AppStackNavigator'

export const AppTabNavigator = createBottomTabNavigator({
  Donate: {
    screen: AppStackNavigator,
    navigationOptions:{
      tabBarIcon: <Image source={require('../assets/donate.png')} style={{width: 20, height: 20}}/>,
      tabBarLabel: 'Donate',
    }
  },
  Request: {
    screen: Request,
    navigationOptions: {
      tabBarIcon: <Image source={require('../assets/request.png')} style={{width:20, height:20}}/>,
      tabBarLabel: 'Request'
    }
  }
})