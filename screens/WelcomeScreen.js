import * as React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, Modal, KeyboardAvoidingView, ScrollView} from 'react-native';
import  db from '../config';
import firebase from 'firebase';
import { RFValue } from 'react-native-responsive-fontsize'

export default class WelcomeScreen extends React.Component {
  constructor(){
    super();
    this.state = {
      emailID: '',
      password: '',
      firstname: '',
      lastname: '',
      contact: '',
      address: '',
      confirmpassword: '',
      isModalVisible: false,
      currencyCode: '',
    }
  }

  signup=(emailID, password, confirmpassword)=>{
    if(password!==confirmpassword){
      return alert("Passwords don't match. Please try again")
    } else {
    firebase.auth().createUserWithEmailAndPassword(emailID, password)
    .then(()=>{
      db.collection('Users').add({
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        contact: this.state.contact,
        address: this.state.address,
        emailID: this.state.emailID,
        isBookRequestActive: false,
        currencyCode: this.state.currencyCode,
      })
      return alert('User added successfully', "", [
        {text:'OK', onPress: ()=>this.setState({isModalVisible: false})}
      ])
    })
    .catch(function(error){
      var errorcode = error.code
      var errormessage = error.message
      return alert(errormessage)
    })
  }
  }

  login=(emailID, password)=>{
    firebase.auth().signInWithEmailAndPassword(emailID, password)
    .then(()=>{
      this.props.navigation.navigate('Donate')
    })
    .catch((error)=>{
      var errorcode = error.code
      var errormessage = error.message
      return alert(errormessage)
    })
  }

  showModal=()=>{
    return(
      <Modal animationType='fade' transparent={true} visible={this.state.isModalVisible}>
        <View style={styles.modalcontainer}>
          <ScrollView style={{width:'100%'}}>
            <KeyboardAvoidingView style={styles.keyboard}>
              <Text style={styles.modaltitle}>Registration</Text>
              <TextInput style={styles.form} placeholder={'First Name'} maxLength={10} onChangeText={(text)=>{
                this.setState({firstname:text})
              }}/>
              <TextInput style={styles.form} placeholder={'Last Name'} maxLength={10} onChangeText={(text)=>{
                this.setState({lastname:text})
              }}/>
              <TextInput style={styles.form} placeholder={'Contact'} keyboardType={'numeric'} onChangeText={(text)=>{
                this.setState({contact:text})
              }}/>
              <TextInput style={styles.form} placeholder={'Address'} multiline={true} onChangeText={(text)=>{
                this.setState({address:text})
              }}/>
              <TextInput style={styles.form} placeholder={'Email ID'} keyboardType={'email-address'} onChangeText={(text)=>{
                this.setState({emailID:text})
              }}/>
              <TextInput style={styles.form} placeholder={'Password'} secureTextEntry={true} onChangeText={(text)=>{
                this.setState({password:text})
              }}/>
              <TextInput style={styles.form} placeholder={'Confirm Password'} secureTextEntry={true} onChangeText={(text)=>{
                this.setState({confirmpassword:text})
              }}/>
              <TextInput style={styles.form} placeholder={'Country currency code'} maxLength={8}onChangeText={(text)=>{
                this.setState({currencyCode: text})
              }}/>
              <View>
                <TouchableOpacity style={styles.registerbutton} onPress={()=>{
                  this.signup(this.state.emailID, this.state.password, this.state.confirmpassword)
                }}>
                  <Text style={styles.registerbuttontext}>Register</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalbackbutton}>
                <TouchableOpacity style={styles.registerbutton} onPress={()=>{
                  this.setState({isModalVisible:false})
                }}>
                  <Text style={styles.registerbuttontext}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    )
  }

  render(){
    return(
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Barter App</Text>
          <Text style={styles.subtitle}>Trade items you no longer want for items that you do!</Text>
          <Image
            style={{width:RFValue(300), height:RFValue(150),alignSelf:'center'}}
            source={require('../assets/logo.png')}
          />
        </View>

        {this.showModal()}

          <TextInput
            style={styles.loginbox}
            placeholder='abc@gmail.com'
            keyboardType='email-adress'
            onChangeText={(text)=>{
              this.setState({
                emailID: text
              })
            }}/>

          <TextInput
            style={styles.loginbox}
            placeholder='Enter password here'
            secureTextEntry={true}
            onChangeText={(text)=>{
              this.setState({
                password: text
              })
            }}
          />

          <TouchableOpacity style={styles.button} onPress={()=>{
            this.setState({isModalVisible:true})
          }}>
            <Text style={styles.buttontext}>Sign-up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={()=>{
            this.login(this.state.emailID, this.state.password)}
          }>
            <Text style={styles.buttontext}>Login</Text>
          </TouchableOpacity>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor:'#EF948B'
  },
  title:{
    fontFamily:'monospace',
    color:'#A65F2D',
    fontSize: RFValue(30),
    fontWeight: RFValue(300),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  subtitle:{
    fontFamily:'monospace',
    color:'#774C8E',
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  loginbox:{
    backgroundColor: '#EF948B',
    width: RFValue(300),
    height: RFValue(50),
    margin: RFValue(10),
    paddingLeft: RFValue(10),
    borderWidth: 1,
    fontFamily: 'monospace',
    color: '#774C8E'
  },
  button:{
    width: RFValue(300),
    height: RFValue(50),
    margin: RFValue(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
  },
  buttontext:{
    fontFamily: 'monospace',
    color: '#A65F2D',
    fontSize:RFValue(20),
  },
  modalcontainer:{
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C99F81',
    margin: RFValue(20),
  },
  keyboard:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modaltitle:{
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: RFValue(30),
    color: '#A65F2D',
    fontFamily: 'monospace',
  },
  form:{
    width: '75%',
    height: RFValue(35),
    alignSelf: 'center',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: RFValue(20),
    fontFamily: 'monospace',
    color: '#774C8E',
  },
  registerbutton:{
    width: RFValue(200),
    height: RFValue(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    fontFamily: 'monospace',
    margin: RFValue(3),
  },
  registerbuttontext:{
    fontSize: RFValue(15),
    fontFamily:'monospace',
    color:'#A65F2D',
  },
})