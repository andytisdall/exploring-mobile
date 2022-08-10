import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import { fetchBands, fetchBand } from '../../actions';
import baseStyle from '../../style/baseStyle';
import Error from '../layout/Error';

class Home extends React.Component {
  componentDidMount() {
    this.props.fetchBands();
  }

  renderBands = () => {
    // filter out current band to avoid duplicates
    const bandsWithOutCurrentBand = { ...this.props.bands };
    delete bandsWithOutCurrentBand.currentBand;

    const bands = Object.values(bandsWithOutCurrentBand);
    if (bands.length) {
      const onPress = band => {
        this.props.fetchBand(band);
        this.props.navigation.navigate('Band', { band });
      };

      return bands.map(band => {
        return (
          <Pressable key={band.id} onPress={() => onPress(band)}>
            <Text style={[baseStyle.h2, styles.bandItem]}>{band.name}</Text>
          </Pressable>
        );
      });
    }
  };

  render() {
    return (
      <View style={[baseStyle.container, baseStyle.background]}>
        <Error />
        <Text style={[baseStyle.h1, styles.homeHeader, baseStyle.headerColor]}>
          Exploring the Space
        </Text>
        <Text style={baseStyle.h1}>All Bands:</Text>
        <View style={[styles.bandList]}>{this.renderBands()}</View>
        <ActivityIndicator
          animating={!Object.values(this.props.bands).length}
          size="large"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bandItem: {
    flexDirection: 'row',
    marginTop: 20,
    fontSize: 35,
  },
  bandList: {
    margin: 15,
  },
  homeHeader: {
    textAlign: 'center',
    fontSize: 70,
    paddingTop: 100,
    marginBottom: 30,
  },
});

const mapStateToProps = state => {
  return {
    bands: state.bands,
  };
};

export default connect(mapStateToProps, { fetchBands, fetchBand })(Home);