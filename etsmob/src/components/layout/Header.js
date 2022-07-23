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
  const [expand, setExpand] = useState(false);
  const menu = useRef(null);

  useEffect(() => {
    fetchBand('paranoidorchestra');
    // document.addEventListener('click', clickToDismiss, { capture: true });
    // return () => {
    //   document.removeEventListener('click', clickToDismiss, { capture: true });
    // };
  }, [fetchBand]);

  useEffect(() => {
    handleUpdate();
  }, [band, user, handleUpdate]);

  const clickToDismiss = (e) => {
    if (menu.current && menu.current.contains(e.target)) {
      return;
    }
    setExpand(false);
  };

  const renderAdmin = () => {
    // return (
    //   <View className="menu">
    //     <Link className="menu-item" to="/">
    //       Home
    //     </Link>
    //     <Link className="menu-item" to="/user">
    //       User Home
    //     </Link>
    //     <Link className="menu-item" to="/help">
    //       Help
    //     </Link>
    //     <View className="menu-item" onClick={signOut}>
    //       Sign Out
    //     </View>
    //   </View>
    // );
  };

  const renderHomeLink = () => {
    // return (
    //   <View className="menu">
    //     <Link className="menu-item" to="/">
    //       Home
    //     </Link>
    //     <Link className="menu-item" to="/help">
    //       Help
    //     </Link>
    //     <Link className="menu-item" to="/signin">
    //       Sign In
    //     </Link>
    //   </View>
    // );
  };

  const showContent = () => {
    if (!band) {
      return (
        <View style={styles.noBand}>
          <Text>No Band!</Text>
        </View>
      );
    }
    if (band.id === 404) {
      return (
        <View className="no-band">
          <h1>
            This band does not exist on Exploring the Space, but you can create
            it.
          </h1>
          <View className="home-buttons">
            {/* <Link to="/">Home</Link>
            <Link to="/help">What Is It?</Link> */}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.bandHeader}>
        <Text style={baseStyle.h1}>{band && band.name}</Text>
        <View
          // className="menu-button"
          ref={menu}
          onPress={() => setExpand(!expand)}
        >
          {/* <img src="images/dots.png" alt="navigation" /> */}
          {expand && (authorized ? renderAdmin() : renderHomeLink())}
        </View>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={volume}
          onValueChange={(e) => changeVolume(e)}
        />
        {/* <img src="/images/volume.svg" alt="volume" /> */}
      </View>
    );
  };

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

const mapStateToProps = (state) => {
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
  requireAuth(Header)
);
