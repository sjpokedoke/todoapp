import * as React from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity, Dimensions } from 'react-native';
import { ListItem, Icon } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import SwipeListView from 'react-native-swipe-list-view';

export default class SwipeFlatList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      allNotifications: this.props.allNotifications
    }
  }

  updateMarkAsRead=(notification)=>{
    db.collection('AllNotifications').doc(notification.docID).update({notificationStatus: 'read'})
  }

  onSwipeValueChange=swipeData=>{
   var allNotifications = this.state.allNotifications
   const {key, value} = swipeData
   if (value < -Dimensions.get("window").width){
     const newData = [...allNotifications]
     this.updateMarkAsRead(allNotifications[key])
     newData.splice(key, 1)
     this.setState({
       allNotifications: newData
     })
   }
  }

  renderItem=data=>{
    <ListItem
    leftElement={<Icon name='book' type='font-awesome' color='#774C8E'/>}
    title={data.item.bookName}
    titleStyle={{color:'black'}}
    subtitle={data.item.message}
    bottomDivider
    />
  }

  renderHiddenItem=()=>{
    <View style={styles.rowback}>
      <View style={[styles.backrightbutton, styles.backrightbuttonright]}>
        <Text style={styles.backtextwhite}>Mark as read</Text>
      </View>
    </View>
  }
  
  render(){
    return(
      <View style={styles.container}>
        <SwipeListView
          disableRightSwipe
          data={this.state.allNotifications}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderHiddenItem}
          rightOpenValue={-Dimensions.get("window").width}
          previewRowKey={"0"}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onSwipeValueChange={this.onSwipeValueChange}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#EF948B',
  },
  backtextwhite: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
  rowback: {
    alignItems: "center",
    backgroundColor: '#C99F81',
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backrightbutton: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: "absolute",
    top: 0,
    width: 100,
  },
  backrightbuttonright: {
    backgroundColor: '#C99F81',
    right: 0
  }
});