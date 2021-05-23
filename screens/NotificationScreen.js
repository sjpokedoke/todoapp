import * as React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, Modal, ScrollView, KeyboardAvoidingView, Alert, ListItem, Icon, FlatList} from 'react-native';
import  db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SwipeFlatList } from '../components/SwipeFlatList';
import { RFValue } from 'react-native-responsive-fontsize'

export default class NotificationScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      userID: firebase.auth().currentUser.email,
      allNotifications: [],
    }
    this.notificationRef = null
  }
  
  getNotifications=()=>{
    this.requestRef = db.collection('AllNotifications').where('notificationStatus', '==', 'unread')
    .where('targetedUserID', '==', this.state.userID)
    .onSnapshot((snapshot)=>{
      var allNotifications = []
      snapshot.docs.map((doc)=>{
        var notification = doc.data()
        notification['docID'] = doc.id
        allNotifications.push(notification)
      })
      this.setState({
        allNotifications: allNotifications
      })
    })
  }

  componentDidMount(){
    this.getNotifications()
  }

  componentWillUnmount(){
    this.notificationRef()
  }

  keyExtractor=(item, index) => index.toString()

  renderItem = ({item, i}) =>{
    return (
      <View>
        <ListItem
        key={i}
        title={item.bookName}
        titleStyle={styles.titlestyle}
        subtitle={item.message}
        subtitleStyle={styles.subtitle}
        bottomDivider
        />
      </View>
    )
  }

  render(){
    return(
      <SafeAreaProvider>
      <View style={styles.container}>
        <View style={{flex: 0.1}}>
          <MyHeader title='Notifications'/>
        </View>
        <View style={{flex: 0.9}}>
          {
            this.state.allNotifications.length===0
            ?(
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: RFValue(20), fontFamily:'monospace', color:'#774C8E'}}>You have no notifications!</Text>
              </View>
            )
            :(
              <SwipeFlatList allNotifications={this.state.allNotifications}/>
            )
          }
        </View>
      </View>
      </SafeAreaProvider>
    )
  }
}

const styles=StyleSheet.create({
  titlestyle: {
    color:'#C99F81',
    fontFamily: 'monospace',
  },
  subtitle: {
    fontFamily: 'monospace',
    color: 'black',
    fontSize: RFValue(12),
  },
  container: {
    flex: 1,
    backgroundColor:'#EF948B'
  },
})