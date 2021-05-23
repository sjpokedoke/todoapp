import * as React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import  db from '../config';
import firebase from 'firebase';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MyHeader from '../components/MyHeader';
import { RFValue } from 'react-native-responsive-fontsize'

export default class Request extends React.Component {
  constructor(){
    super();
    this.state = {
      userID: firebase.auth().currentUser.email,
      name: '',
      reasonToRequest: '',
      isBookRequestActive: '',
      requestedBookName: '',
      bookStatus: '',
      requestID: '',
      userDocID: '',
      docID: '',
      currencyCode: '',
      itemValue: '',
    }
  }

  createUniqueID(){
    return Math.random().toString(36).substring(7);
  }

  getBookRequest=()=>{
    var bookRequests = db.collection('Requests')
    .where('userID', '==', this.state.userID).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        if (doc.data().bookStatus !== 'received'){
          this.setState({
            requestID: doc.data().requestID,
            requestedBookName: doc.data().name,
            bookStatus: doc.data().bookStatus,
            docID: doc.id,
            itemValue: doc.data().itemValue,
          })
        }
      })
    })
  }

  getIsBookRequestActive(){
    db.collection('Users').where('emailID', '==', this.state.userID)
    .onSnapshot((snapshot)=>{
      snapshot.forEach((doc)=>{
        this.setState({
          isBookRequestActive: doc.data().isBookRequestActive,
          userDocID: doc.id,
          currencyCode: doc.data().currencyCode
        })
      })
    })
  }

  componentDidMount(){
    this.getBookRequest()
    this.getIsBookRequestActive()
    this.getData()
  }

  addRequest= async(name, reasonToRequest)=>{
    var userID = this.state.userID
    var randomRequestID = this.createUniqueID()
    db.collection('Requests').add({
      'userID': userID,
      'name': name,
      'reasonToRequest': reasonToRequest,
      'requestID': randomRequestID,
      'status': 'requested',
      'data': firebase.firestore.FieldValue.serverTimestamp(),
    })
    //to set the is book reactive to true
    await this.getBookRequest();
    db.collection('Users').where('emailID', '==', userID).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection('Users').doc(doc.id).update({
          isBookRequestActive: true,
        })
      })
    })
    this.setState({
      name: '',
      reasonToRequest: '',
      itemValue: ''
    })
    return alert('Item requested successfully!')
  }

  sendNotification=()=>{
    //to get the first name and last name of the user
    db.collection('Users').where('emailID', '==', this.state.userID).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var name = doc.data().firstname
        var lastname = doc.data().lastname

        //to get donor id and book name
        db.collection('AllNotifications').where('requestID', '==', this.state.requestID).get()
        .then((snapshot)=>{
          snapshot.forEach((doc)=>{
            var donorID = doc.data().donorID
            var name = doc.data().name

        //target user id is the donor id to send notification to the user
        db.collection('AllNotifications').add({
          targetedUserID: donorID,
          message: name+' '+lastname+' received the item '+name,
          notificationStatus: 'unread',
          name: name
        })
      })
    })
  })
  })
  }

  updateBookRequestStatus=()=>{
    //updating the book status after receiving the book
    db.collection('Requests').doc(this.state.docID)
    .update({
      status: 'received'
    })
    //getting the doc id to update the users document
    db.collection('Users').where('emailID', '==', this.state.userID).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        //updating the document
        db.collection('Users').doc(doc.id).update({
          isBookRequestActive: false
        })
      })
    })
  }

  receivedBooks=(name)=>{
    var userID = this.state.userID
    var requestID = this.state.requestID
    db.collection('ReceivedBooks').add({
      userID: userID,
      name: name,
      requestID: requestID,
      bookStatus: 'received'
    })
  }

  getData(){
  fetch("http://data.fixer.io/api/latest?access_key=1f7dd48123a05ae588283b5e13fae944&format=1")
  .then(response=>{
    return response.json();
  }).then(responseData =>{
    var currencyCode = this.state.currencyCode
    var currency = responseData.rates.INR
    var value =  69 / currency
    console.log(value);
  })
  }

  render(){
     if (this.state.isBookRequestActive===true){
        return(
          //status screen
          <SafeAreaProvider>
          <View style={{flex: 1, justifyContent: 'center', backgroundColor:'#EF948B'}}>
          
            <View style={{backgroundColor: '#EF948B', width: RFValue(300), height: RFValue(50), margin: RFValue(10), paddingLeft: RFValue(10), borderWidth: 1, fontFamily: 'monospace', color: '#774C8E'}}>
              <Text style={styles.buttontext}>Item Name</Text>
              <Text style={{alignSelf: 'center', fontFamily: 'monospace', color: '#774C8E'}}>{this.state.requestedBookName}</Text>
            </View>

            <View style={{backgroundColor: '#EF948B', width: RFValue(300), height: RFValue(50), margin: RFValue(10), paddingLeft: RFValue(10),borderWidth: 1, fontFamily: 'monospace', color: '#774C8E'}}>
              <Text style={styles.buttontext}>Item value</Text>
              <Text style={{alignSelf: 'center', fontFamily: 'monospace', color: '#774C8E'}}>{this.state.itemValue}</Text>
            </View>

            <View style={{backgroundColor: '#EF948B', width: RFValue(300), height: RFValue(50), margin: RFValue(10), paddingLeft: RFValue(10),borderWidth: 1, fontFamily: 'monospace', color: '#774C8E'}}>
              <Text style={styles.buttontext}>Item status</Text>
              <Text style={{alignSelf: 'center', fontFamily: 'monospace', color: '#774C8E'}}>{this.state.status}</Text>
            </View>

            <TouchableOpacity style={{backgroundColor: '#EF948B', width: RFValue(300), height: RFValue(50), margin: RFValue(10), paddingLeft: RFValue(10), borderWidth: 1, fontFamily: 'monospace', color: '#774C8E'}} onPress={()=>{
              this.sendNotification()
              this.updateBookRequestStatus()
              this.receivedBooks(this.state.requestedBookName)
            }}>
              <Text style={styles.buttontext}>I received the item</Text>
            </TouchableOpacity>
            
          </View>
          </SafeAreaProvider>
        )
    } else {
    return(
      <SafeAreaProvider>
      <View style={{flex:1, backgroundColor:'#EF948B'}}>
        <MyHeader title='Request An Item'/>
        <KeyboardAvoidingView style={styles.keyboardstyle}>
          <TextInput style={styles.formtextinput} placeholder={'Enter Item Name'} onChangeText={(text)=>{
            this.setState({
              name:text
            })
          }} value={this.state.name}/>

          <TextInput style={styles.formtextinput} placeholder={'Enter Item Value'} onChangeText={(text)=>{
            this.setState({
              itemValue:text
            })
          }} value={this.state.itemValue}/>

          <TextInput style={[styles.formtextinput, {height: RFValue(300)}]} placeholder={'Why do you need this item?'}
          multiline numberOfLines={8} onChangeText={(text)=>{
            this.setState({
              reasonToRequest: text,
            })
          }} value={this.state.reasonToRequest}/>

          <TouchableOpacity style={styles.button} onPress={()=>{
            this.addRequest(this.state.name, this.state.reasonToRequest)
          }}>
            <Text style={styles.buttontext}>Request</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
      </SafeAreaProvider>
    )
  }
  }
}

const styles = StyleSheet.create({
  keyboardstyle:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formtextinput:{
    width:'75%',
    height: RFValue(35),
    alignSelf:'center',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: RFValue(20),
    padding: RFValue(10),
    fontFamily: 'monospace',
    color: '#774C8E'
  },
  button:{
    backgroundColor: '#EF948B',
    width: '75%',
    height: RFValue(50),
    marginTop: RFValue(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width:RFValue(0),
      height: RFValue(8)
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  buttontext:{
    fontFamily: 'fantasy',
    color: '#A65F2D',
    fontSize:RFValue(20),
    alignSelf: 'center'
  },
})