'use strict';

/*
This is the parent file for the entire application.  It houses the TabBar
Navigation and the Notification (drop down header)
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TabBarIOS,
  Animated,
  TouchableHighlight,
  Navigator,
} from 'react-native';

import HomeTabBarIOS          from "./HomeTabBarIOS.js"
import NotificationBannerView from "./NotificationBannerView.js"

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

class NavigationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'cardsTab',
      notificationBannerText: "notification (tap me, goes to chat)",
      pan: new Animated.ValueXY({x:0, y:-100}),
      profiles: [],
    };
  }

  // fetches new profiles and adds them to the profiles array
  // lastID: the lastID we got from the previous list of profiles
  // count: how many profiles to fetch. 0 or null is all
  _fetchProfiles(lastID, count) {
    //TODO incorporate lastID and count
    return fetch('https://jumbosmash2017.herokuapp.com/profile')
      .then((response) => response.json())
      .then((responseJson) => {
        shuffle(responseJson);
        console.log("hey!")
        this.setState({
          profiles: this.state.profiles.concat(responseJson),
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _hideNotificationBanner() {
    Animated.spring(
      this.state.pan,
      {
        toValue: {x:0, y:-100},
      }
    ).start();
  }

  _showNotificationBanner() {
    Animated.spring(
      this.state.pan,
      {
        toValue: {x:0, y:-25},
      }
    ).start();
  }

  _notificationBannerTapped() {
    this._hideNotificationBanner();
    this.setState({
      selectedTab: 'chatTab',
    });
  }

  componentDidMount() {
    // this._showNotificationBanner();
    //TODO @richard do something better here and pull from storage or something first
    this._fetchProfiles();
  }

  // Changes which tab is showing (swiping, settings, etc), check HomeTabBarIOS
  // for the tab names.  The reason why this is here is because notifications
  // will also need to change the tabs, and changes can only trickle downwards.
  // Thus, selectedTab is a property of the Navigator, and TabBar looks to
  // Navigator for this property.
  _changeTab(tabName) {
    this.setState({
      selectedTab: tabName,
    })
  }

  // Returns the content that the navigator should show.  Since route.name is "TabBar"
  // by default, it will show the TabBar.  In order to "push" a view on top of this view,
  // You have to give it its own route name and use navigator.push({name: route name})
  _renderNavigatorScene (route, navigator) {
    if (route.name == 'TabBar') {
      return (
        <View style={{flex:1}}>
          <HomeTabBarIOS
            navigator={navigator}
            selectedTab={this.state.selectedTab}
            changeTab={this._changeTab.bind(this)}
            fetchProfiles={this._fetchProfiles.bind(this)}
            profiles={this.state.profiles}
          />
          <Animated.View
            style={[styles.notificationBanner, {transform:this.state.pan.getTranslateTransform()}]}>
            <NotificationBannerView
              message={this.state.notificationBannerText}
              onPress={this._notificationBannerTapped.bind(this)}
            />
          </Animated.View>
        </View>
      );
    } else if (route.name == 'Chat') {
      return(<View navigator={navigator}><Text>@jared put your chat view here and use this.props.navigator.push("Chat") to render this page</Text></View>);
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{ name: 'TabBar' }}
        renderScene={this._renderNavigatorScene.bind(this)}
      />
    );
  }
}

const styles = StyleSheet.create({
  notificationBanner: {
    position: 'absolute',
    height: 100,
    top: 0,
    left: 0,
    right: 0,
  },
});

export default NavigationContainer;
