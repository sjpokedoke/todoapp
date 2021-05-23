import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MyHeader from '../components/MyHeader';
import { RFValue } from 'react-native-responsive-fontsize'

export default class MyReceivedBooksScreen extends Component{
  constructor(){
    super()
    this.state = {
      userID  : firebase.auth().currentUser.email,
      receivedBooksList : []
    }
  this.requestRef= null
  }

  getReceivedBooksList=()=>{
    this.requestRef = db.collection("Requests")
    .where('userID','==',this.state.userID)
    .where('status', '==','received')
    .onSnapshot((snapshot)=>{
      var receivedBooksList = snapshot.docs.map((doc) => doc.data())
      this.setState({
        receivedBooksList : receivedBooksList
      });
    })
  }

  componentDidMount(){
    this.getReceivedBooksList()
  }

  componentWillUnmount(){
    this.requestRef()
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
      key={i}
      title={item.name}
      titleStyle={styles.titlestyle}
      subtitle={item.status}
      subtitleStyle={styles.subtitle}
      bottomDivider
      />
    )
  }

  render(){
    return(
      <SafeAreaProvider>
      <View style={{flex:1, backgroundColor:'#EF948B'}}>
        <MyHeader title = 'Received Items'/>
        <View style={{flex:1}}>
          {
            this.state.receivedBooksList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{fontSize: RFValue(20), fontFamily:'monospace', color:'#774C8E'}}>List Of All Received Books</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.receivedBooksList}
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
  subContainer:{
    flex:1,
    fontSize: RFValue(20),
    justifyContent:'center',
    alignItems:'center',
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