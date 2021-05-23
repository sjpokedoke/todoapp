import * as React from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { ListItem } from 'react-native-elements';
import  db from '../config';
import firebase from 'firebase';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MyHeader from '../components/MyHeader';
import ReceiverDetailsScreen from './ReceiverDetailsScreen'
import { RFValue } from 'react-native-responsive-fontsize'

export default class Donate extends React.Component{
  constructor(){
    super()
    this.state={
      requestedBooksList : []
    }
    this.requestRef= null
  }

  getRequestedBooksList=()=>{
    this.requestRef = db.collection('Requests')
    .onSnapshot((snapshot)=>{
      var requestedBooksList = snapshot.docs.map((doc) => doc.data());
      this.setState({
        requestedBooksList : requestedBooksList
      })
    })
  }

  componentDidMount(){
    this.getRequestedBooksList()
  }

  componentWillUnmount(){
    this.requestRef()
  }

  keyExtractor=(item, index) => index.toString()

  renderItem = ({item, i}) =>{
    return (
      <View>
      <ListItem
      key={i}
      title={item.name}
      titleStyle={styles.titlestyle}
      subtitle={item.reasonToRequest}
      subtitleStyle={styles.subtitle}
      rightElement={
        <TouchableOpacity style={styles.button} onPress={()=>{
            this.props.navigation.navigate('ReceiverDetails', {"details":item})
        }}>
          <Text style={{color:'#774C8E', fontFamily: 'monospace'}}>View</Text>
        </TouchableOpacity>
      }
      bottomDivider
      />
      </View>
    )
  }

  render(){
    return(
      <SafeAreaProvider>
        <View style={{flex:1, backgroundColor:'#EF948B'}}>
          <MyHeader title='Donate An Item' navigation={this.props.navigation}/>
          <View style={{flex:1}}>
            {
              this.state.requestedBooksList.length === 0
              ?(
                <View style={styles.subContainer}>
                  <Text style={{fontSize: RFValue(20), fontFamily:'monospace', color:'#774C8E'}}>List Of All Requested Items</Text>
                </View>
              )
              :(
                <FlatList
                  keyExtractor={this.keyExtractor}
                  data={this.state.requestedBooksList}
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
  button:{
    width:RFValue(100),
    height:RFValue(30),
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#EF948B',
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