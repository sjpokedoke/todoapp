import * as React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import { Icon } from 'react-native-elements';

export default class CustomSideBarMenu extends React.Component {
  constructor(){
    super()
    this.state = {
      image: '#',
      userID: firebase.auth().currentUser.email,
      name: '',
      docID: '',
    }
  }
  
  selectPicture=async()=>{
    const {cancelled, uri} = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    if (!cancelled) {
      this.setState({
        image: uri
      })
      this.uploadImage(uri, this.state.userID)
    }
  }

  uploadImage=async(uri, imageName)=>{
    //to upload image to cloud storage
    var response = await fetch(uri)
    var blob = await response.blob()
    var ref = firebase.storage().ref().child('user_profiles/'+imageName)
    return ref.put(blob).then((response)=>{this.fetchImage(imageName)})
  }

  fetchImage=(imageName)=>{
    //to get the image from the cloud storage
    var storageRef = firebase.storage().ref().child('user_profiles/'+imageName)
    //get the dowloaded uri
    storageRef.getDownloadURL().then((url)=>{
      this.setState({image: url}).catch((error)=>{this.setState({image:'#'})})
    })
  }

  getUserProfiles(){
    db.collection('Users').where('emailID', '==', this.state.userID)
    .onSnapshot((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        this.setState({
          name: doc.data().firstname+' '+doc.data().lastname,
          docID: doc.id,
          image: doc.data().image,
        })
      })
    })
  }

  componentDidMount(){
    this.fetchImage(this.state.userID)
    this.getUserProfiles()
  }

  render(){
    return(
      <View style={{flex:1}}>
        <View style={{flex:0.5, alignItems:'center', backgroundColor:'#85AEC0'}}>
          <Avatar rounded source={{uri: this.state.image}} size={'xlarge'} onPress={()=>{
            this.selectPicture()
          }} containerStyle={styles.imagecontainer} showEditButton/>
          <Text style={styles.avatarname}>{this.state.name}</Text>
        </View>
        <View style={styles.draweritemcontainer}>
          <DrawerItems {...this.props} />
        </View>
        <View style={styles.logoutcontainer}>
          <TouchableOpacity style={styles.logoutbutton} onPress={()=>{
            this.props.navigation.navigate('WelcomeScreen')
            firebase.auth().signOut()
          }}>
            <Icon name='logout' type='antdesign' size={15} color='#A65F2D'/>
            <Text style={styles.logouttext}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  draweritemcontainer: {
    flex: 0.8,
  },
  logoutcontainer: {
    flex: 0.2,
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  logoutbutton: {
    height: 30,
    width: '100%',
    justifyContent: 'center',
    padding: 10,
  },
  logouttext: {
    fontFamily: 'fantasy',
    fontWeight: 5,
    color: '#36385E',
  },
  imagecontainer: {
    flex: 0.75,
    width: '40%',
    height: '20%',
    marginLeft: 20,
    marginTop: 30,
    borderRadius: 40,
  },
  avatarname: {
    fontWeight:'bold',
    fontSize: 20,
    paddingTop: 10,
    fontFamily: 'monospace',
    color: '#36385E'
  },
})