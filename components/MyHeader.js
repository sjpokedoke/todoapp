import * as React from 'react';
import { Text, View } from 'react-native';
import { Header, Icon, Badge } from 'react-native-elements';
import db from '../config'

export default class MyHeader extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      value: '',
    }
  }

  getNumberOfUnreadNotifications(){
    db.collection('AllNotifications').where('notificationStatus', '==', 'unread')
    .onSnapshot((snapshot)=>{
      var unreadNotifications = snapshot.docs.map((doc)=>doc.data())
      this.setState({
        value: unreadNotifications.length
      })
    })
  }

  componentDidMount(){
    this.getNumberOfUnreadNotifications()
  }
  
  BellIconWithBadge=()=>{
    return(
      <View>
        <Icon name='bell' type='font-awesome' color='#A65F2D' size={25}
        onPress={()=>this.props.navigation.navigate('Notifications')}/>
        <Badge value={this.state.value} containerStyle={{position: 'absolute', top: -4, right: -4}}/>
      </View>
    )
  }

  render(){
    return(
      <Header
      leftComponent={<Icon name='bars' type='font-awesome' color='#A65F2D' onPress={()=>this.props.navigation.toggleDrawer()}/>}
      centerComponent={{text:this.props.title, style:{color:'#774C8E', fontSize:20, fontFamily: 'monospace'}}}
      rightComponent={<this.BellIconWithBadge {...this.props} />}
      backgroundColor='#C99F81'
    />
    )
  }
}