'use strict';

/*
This is the parent file for the IOS TabBar and loading relevant content.
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TabBarIOS,
} from 'react-native';

import SwipingPage            from "../cards/SwipingPage.js";
import ChatPage               from "../chat/ChatPage.js";
import LoginPage              from "../login/LoginPage.js";
import SettingsPage           from "../settings/SettingsPage.js"

class HomeTabBarIOS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatNotifCount: 0,
    };
  }

  // Function for generating the tab items.  This includes the icon at the bottom
  // and the content that is displayed
  _renderTabBarItem(unselectedIcon, selectedIcon, tabName, content) {
    return (
      <TabBarIOS.Item
        icon={unselectedIcon}
        selectedIcon={selectedIcon}
        renderAsOriginal
        selected={this.props.selectedTab === tabName}
        onPress={() => {
          this.props.changeTab(tabName);
        }}
      >
        {content}
      </TabBarIOS.Item>
    );
  }

  render() {
    return (
      <TabBarIOS
        navigator={this.props.navigator}
        barTintColor="white">
        {/* @jade temporary to access the login page until login code is complete */}
        {this._renderTabBarItem(require('./icons/search.png'), require('./icons/search2.png'), "loginTab", <LoginPage/>)}

        {this._renderTabBarItem(require('./icons/heart.png'), require('./icons/heart2.png'), "cardsTab",
          <SwipingPage
            navigator={this.props.navigator}
            profiles={this.props.profiles}
            fetchProfiles={this.props.fetchProfiles}
          />
        )}

        {this._renderTabBarItem(require('./icons/chat.png'), require('./icons/chat2.png'), "chatTab", <ChatPage chatroomId={this.props.chatroomId} navigator={this.props.navigator}/>)}

        {this._renderTabBarItem(require('./icons/user.png'), require('./icons/user2.png'), "settingsTab",
          <SettingsPage
            profile={this.props.profiles.length > 0 ? this.props.profiles[0] : {} /* TODO: @richard change this once we get actual profile info */}
          />
        )}
      </TabBarIOS>
    );
  }
}

export default HomeTabBarIOS;
