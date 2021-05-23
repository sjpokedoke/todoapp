import * as React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Alert, ListItem, FlatList} from 'react-native';
import  db from '../config';
import firebase from 'firebase';
import { Card, Header, Icon } from 'react-native-elements';
import MyHeader from '../components/MyHeader'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize'

export default class MyDonations extends React.Component {
  static navigationOptions = { header: null };

  constructor(){
    super()
    this.state = {
      userID: firebase.auth().currentUser.email,
      allDonations: [],
      donorName: '',
    }
    this.requestRef=null
  }

  getAllDonations=()=>{
    this.requestRef=db.collection('AllDonations').where('DonorID', '==', this.state.userID)
    .onSnapshot((snapshot)=>{
      var allDonations = [];
      snapshot.docs.map((doc)=>{
        var donation = doc.data()
        donation['docID'] = doc.id
        allDonations.push(donation)
      })
      this.setState({
        allDonations: allDonations,
      })
    })
  }

  sendNotification=(bookDetails, requestedStatus)=>{
    var requestID = bookDetails.requestID
    var donorID = bookDetails.donorID
    db.collection('AllNotifications').where('RequestID', '==', requestID)
    .where('DonorID', '==', donorID).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var message = ''
        if (requestedStatus==='BookSent'){
          message = this.state.donorName + 'sent you an item!'
        } else {
          message = this.state.donorName + 'has shown intrest in donating the item'
        }
        db.collection('AllNotifications').doc(doc.id).update({
          message: message,
          notificationStatus: 'unread',
          date: firebase.firestore.FieldValue.serverTimestamp()
        })
      })
    })
  }

  sendBook=(bookDetails)=>{
    if(bookDetails.requestedStatus==='BookSent'){
      var requestedStatus = 'DonorIntrested'
      db.collection('AllNotifications').doc(bookDetails.docID).update({
        requestedStatus: 'DonorIntrested'
      })
      this.sendNotification(bookDetails, requestedStatus)
    } else {
      requestedStatus = 'BookSent'
      db.collection('AllDonations').doc(bookDetails.docID).update({
        requestedStatus: 'BookSent'
      })
      this.sendNotification(bookDetails, requestedStatus)
    }
  }

  keyExtractor=(item, index)=>index.toString()

  renderItem=({item, i})=>(
    <View>
      <ListItem
      key={i}
      title={item.bookName}
      titleStyle={styles.titlestyle}
      subtitle={'Requested by: '+item.requestedBy+'n\Status: '+item.requestedStatus}
      subtitleStyle={styles.subtitle}
      rightElement={
        <TouchableOpacity style={styles.button} onPress={()=>{
          this.sendBook(item)
        }}>
          <Text style={{color:'#A65F2D', fontFamily: 'monospace'}}>Send Item</Text>
        </TouchableOpacity>
      }
      bottomDivider
      />
    </View>
  )

  componentDidMount(){
     this.getAllDonations()
   }

   componentWillUnmount(){
     this.requestRef();
   }
  
  render(){
    return(
      <SafeAreaProvider>
      <View style={{flex: 1, backgroundColor:'#EF948B'}}>
        <MyHeader title='My Donations' navigation={this.props.navigation}/>
        <View style={{flex: 1}}>
          {
            this.state.allDonations.length===0
            ?(
              <View style={styles.subcontainer}>
                <Text style={{fontSize: RFValue(20), fontFamily:'monospace', color:'#774C8E'}}>List of All Item Donations</Text>
              </View>
            )
            : (
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allDonations}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
      </SafeAreaProvider>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    width: RFValue(300),
    height: RFValue(50),
    margin: RFValue(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
  },
  subcontainer: {
    flex: 1,
    fontSize: RFValue(20),
    justifyContent: 'center',
    alignItems: 'center'
  },
  titlestyle: {
    color:'#C99F81',
    fontFamily: 'monospace',
  },
  subtitle: {
    fontFamily: 'monospace',
    color: 'black',
    fontSize: RFValue(12),
  }
})