import * as React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, Modal, ScrollView, KeyboardAvoidingView} from 'react-native';
import  db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize'

export default class SettingScreen extends React.Component {
  constructor(){
    super();
    this.state = {
      emailID: '',
      firstname: '',
      lastname: '',
      address: '',
      contact: '',
      docID: '',
    }
  }

  getUserDetails(){
    var user = firebase.auth().currentUser
    var emailID = user.email
    db.collection('Users').where('emailID','==',emailID).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var data = doc.data()
        this.setState({
          emailID: data.emailID,
          firstname: data.firstname,
          lastname: data.lastname,
          address: data.address,
          contact: data.contact,
          docID: doc.id,
        })
      })
    })
  }

  componentDidMount(){
    this.getUserDetails();
  }

  updateUserDetails=()=>{
    console.log(this.state.docID)
    db.collection('Users').doc(this.state.docID).update({
      'firstname': this.state.firstname,
      'lastname': this.state.lastname,
      'address': this.state.address,
      'contact': this.state.contact
    })
    alert('User Profile Updated Successfully')
  }

  render(){
    return(
      <SafeAreaProvider>
      <MyHeader title='Settings'/>
      <View style={styles.container}>
        <View style={styles.formcontainer}>
          <Text style={styles.starttext}>First name: </Text>
          <TextInput style={styles.formtextinput} placeholder={'First Name'} maxLength={8}
            onChangeText={(text)=>{
              this.setState({firstname: text})
            }}
            value={this.state.firstname}
          />
          <Text style={styles.starttext}>Last name: </Text>
          <TextInput style={styles.formtextinput} placeholder={'Last Name'} maxLength={8}
            onChangeText={(text)=>{
              this.setState({lastname: text})
            }}
            value={this.state.lastname}
          />
          <Text style={styles.starttext}>Contact: </Text>
          <TextInput style={styles.formtextinput} placeholder={'Contact'} maxLength={10}
          keyboardType={"numeric"}
            onChangeText={(text)=>{
              this.setState({contact: text})
            }}
            value={this.state.contact}
          />
          <Text style={styles.starttext}>Address: </Text>
          <TextInput style={styles.formtextinput} placeholder={'Address'} multiline
            onChangeText={(text)=>{
              this.setState({address: text})
            }}
            value={this.state.address}
          />
          <TouchableOpacity style={styles.button} onPress={()=>{
            this.updateUserDetails()
          }}>
            <Text style={styles.buttontext}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      </SafeAreaProvider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#EF948B'
  },
  formcontainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  formtextinput: {
    width: '75%',
    height: RFValue(35),
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: RFValue(20),
    padding: RFValue(10),
    borderColor: 'black',
    fontFamily: 'monospace',
    color: '#774C8E',
  },
  button: {
    width: RFValue(200),
    height: RFValue(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    fontFamily: 'monospace',
    margin: RFValue(3),
  },
  buttontext: {
    fontFamily: 'fantasy',
    color:'#A65F2D',
    fontSize:RFValue(20),
  },
  starttext: {
    fontSize: RFValue(15), 
    color: '#A65F2D',
    marginLeft: RFValue(20),
    padding: RFValue(10),
    fontFamily: 'monospace',
  },
})