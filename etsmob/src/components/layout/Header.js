import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

import { fetchBand, signOut, changeVolume } from '../../actions';
import Main from './Main';
import Audio from '../audio/Audio';
import requireAuth from '../reusable/requireAuth';
import baseStyle from '../../style/baseStyle';
// import { spinner } from '../reusable/Spinner';
// import Error from './Error';

const Header = ({
  fetchBand,
  band,
  match,
  authorized,
  handleUpdate,
  user,
  signOut,
  volume,
  changeVolume,
}) => {
  return (
    <View>
      <View style={[styles.header, baseStyle.background]}>
        {/* <Error /> */}
        <Audio />
        {showContent()}
      </View>

      {band && band.id !== 404 && <Main />}
    </View>
  );
};

const mapStateToProps = state => {
  return {
    band: state.bands.currentBand,
    user: state.auth.currentUser,
    volume: state.audio.volume,
  };
};

const styles = StyleSheet.create({
  header: {
    position: 'static',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 16,
    boxSizing: 'border-box',
  },
  bandHeader: {
    flexDirection: 'row',
    marginTop: 8,
    borderBottomColor: 'rgb(62, 255, 239)',
    borderBottomWidth: 1,
    justifyContent: 'space-around',
    position: 'relative',
    width: '95%',
    // backgroundColor: ''
  },
  slider: {
    width: '30%',
  },
  noBand: {
    height: '100%',
  },
});

export default connect(mapStateToProps, { fetchBand, signOut, changeVolume })(
  requireAuth(Header),
);
