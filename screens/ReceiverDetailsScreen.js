import * as React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Alert} from 'react-native';
import  db from '../config';
import firebase from 'firebase';
import { Card, Header, Icon } from 'react-native-elements';
import MyDonations from './MyDonations';
import { RFValue } from 'react-native-responsive-fontsize'

export default class ReceiverDetailsScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userID: firebase.auth().currentUser.email,
      receiverID: this.props.navigation.getParam('details')['userID'],
      requestID: this.props.navigation.getParam('details')['requestID'],
      bookName: this.props.navigation.getParam('details')['name'],
      reasonToRequest: this.props.navigation.getParam('details')['reasonToRequest'],
      receiverName: '',
      receiverContact: '',
      receiverAddress: '',
      receiverRequestDocID: '',
      userName: '',
    }
  }

  getReceiverDetails(){
    db.collection('Users').where('emailID', '==', this.state.receiverID).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        this.setState({
          receiverName: doc.data().firstName,
          receiverContact: doc.data().contact,
          receiverAddress: doc.data().address,
        })
      })
    })

    db.collection('Requests').where('requestID', '==', this.state.requestID).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        this.setState({
          receiverRequestDocID: doc.id,
        })
      })
    })
  }

  updateBookStatus=()=>{
    db.collection('AllDonations').add({
      name: this.state.bookName,
      requestID: this.state.requestID,
      requestedBy: this.state.receiverName,
      donorID: this.state.userID,
      requestedStatus: 'DonorIntrested'
    })
  }

  addNotifications=()=>{
    var message = this.state.userName + 'has shown intrest in donating this item'
    db.collection('AllNotifications').add({
      targetedUserID: this.state.receiverID,
      donorID: this.state.userID,
      requestID: this.state.requestID,
      name: this.state.bookName,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notificationStatus: 'unread',
      message: message,
    })
  }

  componentDidMount(){
    this.getReceiverDetails()
  }
  
  render(){
    return(
      <View style={styles.container}>
        <View style={{flex:0.1}}>
          <Header
          leftComponent={<Icon name='arrow-left' type='feather' color='#A65F2D' onPress={()=>{
            this.props.navigation.goBack();
          }}/>}
          centerComponent={{text:'Donate this item', style: {color:'#774C8E', fontSize:RFValue(20), fontFamily: 'monospace'}}}
          backgroundColor='#C99F81'
          />
        </View>

        <View style={{flex: 0.3}}>
          <Card title={'Item Information'} style={styles.titlestyles}>
            <Card>
              <Text style={styles.item}>Name: {this.state.bookName}</Text>
            </Card>
            <Card>
              <Text style={styles.item}>Reason: {this.state.reasonToRequest}</Text>
            </Card>
          </Card>
        </View>

        <View style={{flex: 0.3}}>
          <Card title={'Receiver Information'} style={styles.titlestyles}>
            <Card>
              <Text style={styles.item}>Name: {this.state.receiverName}</Text>
            </Card>
            <Card>
              <Text style={styles.item}>Contact: {this.state.receiverContact}</Text>
            </Card>
            <Card>
              <Text style={styles.item}>Address: {this.state.receiverAddress}</Text>
            </Card>
          </Card>
        </View>

        <View style={styles.buttonContainer}>
          {
            this.state.receiverID!==this.state.userID ? (
              <TouchableOpacity style={styles.button} onPress={()=>{
                this.updateBookStatus()
                this.addNotifications()
                this.props.navigation.navigate('MyDonations')
              }}>
                <Text style={styles.buttontext}>Exchange</Text>
              </TouchableOpacity>
            ) : null
          }
        </View>
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#EF948B'
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width:RFValue(200),
    height:RFValue(50),
    justifyContent:'center',
    alignItems : 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  titlestyles: {
    fontFamily:'monospace',
    color:'#A65F2D',
    fontSize: RFValue(20),
    fontWeight: RFValue(300),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  item: {
    color:'#C99F81',
    fontFamily: 'monospace',
  },
  buttontext: {
    fontFamily:'monospace',
    color:'#A65F2D',
    fontSize: RFValue(15),
    fontWeight: RFValue(300),
    alignSelf: 'center',
    justifyContent: 'center',
  },
})