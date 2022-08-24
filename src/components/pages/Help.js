import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Linking,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';

import baseStyle from '../../style/baseStyle';
import Error from '../layout/Error';
import { throwError } from '../../actions';

class Help extends React.Component {
  onPressLink = () => {
    try {
      Linking.openURL('https://exploring-the-space.com');
    } catch (err) {
      throwError('Could not open link!');
    }
  };

  helpText = () => {
    // filter out current band to avoid duplicates
    return (
      <View>
        <Text style={styles.helpText}>
          This is a mobile app for listening to your Exploring the Space music
          catalog. Bands and artists can upload and organize their music on the
          Exploring the Space website, and then listen to it on this app. You
          can create a profile and start uploading music on the home page. It's
          free and we don't ask for any personal information at all.
        </Text>
        <Pressable style={styles.linkButton} onPress={this.onPressLink}>
          <Text style={styles.linkText}>
            Go to the Exploring the Space home page
          </Text>
        </Pressable>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={[baseStyle.container]}>
        <ScrollView>
          <Error />
          <View style={styles.help}>
            <Text style={[baseStyle.h1, baseStyle.headerColor, styles.header]}>
              What's the Deal with Exploring the Space?
            </Text>
            {this.helpText()}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  help: {
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 50,
  },
  header: {
    fontSize: 40,
    paddingBottom: 30,
    textAlign: 'center',
  },
  helpText: {
    color: 'white',
    fontSize: 23,
    lineHeight: 30,
  },
  linkButton: {
    marginTop: 50,
    backgroundColor: '#65d478',
    borderColor: 'white',
    borderWidth: 2,
    padding: 15,
  },
  linkText: {
    fontSize: 25,
    textAlign: 'center',
  },
});

export default connect(null, { throwError })(Help);
