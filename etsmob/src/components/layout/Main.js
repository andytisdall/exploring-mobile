import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import {
  fetchTiers,
  fetchPlaylists,
  fetchBand,
  initializeAudio,
} from '../../actions';
import Tier from '../tiers/Tier';
import Playlist from '../playlists/Playlist';
import baseStyle from '../../style/baseStyle';
import Audio from '../audio/Audio';
import Error from './Error';

const BodyContainer = ({
  fetchPlaylists,
  fetchTiers,
  tiers,
  playlists,
  band,
  fetchBand,
  route,
  initializeAudio,
}) => {
  const [tierList, setTierList] = useState([]);
  const [playlistList, setPlaylistList] = useState([]);

  useEffect(
    () => () => {
      initializeAudio();
    },
    [initializeAudio],
  );

  useEffect(() => {
    if (!band) {
      fetchBand(route.params.band);
    }
  }, [band, fetchBand, route.params.band]);

  useEffect(() => {
    if (band) {
      fetchTiers(band.id);
      fetchPlaylists(band.id);
    }
  }, [band, fetchTiers, fetchPlaylists]);

  useEffect(() => {
    if (band) {
      setTierList(
        band.tiers
          .map(id => tiers[id])
          .sort((a, b) => {
            if (a.position < b.position) {
              return -1;
            }
            if (b.position < a.position) {
              return 1;
            }
            return -1;
          }),
      );
    }
  }, [tiers, setTierList, band]);

  useEffect(() => {
    if (band) {
      setPlaylistList(
        band.playlists
          .map(id => playlists[id])
          .sort((a, b) => {
            if (a.position < b.position) {
              return -1;
            }
            if (b.position < a.position) {
              return 1;
            }
            return -1;
          }),
      );
    }
  }, [playlists, band]);

  const renderTiers = () => {
    if (band.tiers.length && !tierList[0]) {
      return <ActivityIndicator size="large" style={styles.spinner} />;
    }
    const tiersToRender = tierList.filter(tier => tier);
    return (
      <FlatList
        data={tiersToRender}
        renderItem={({ item }) => <Tier tier={item} />}
        keyExtractor={tier => tier.id}
      />
    );
  };

  const renderPlaylists = () => {
    const playlistsToRender = playlistList.filter(pl => pl);
    return (
      <FlatList
        data={playlistsToRender}
        renderItem={({ item }) => <Playlist playlist={item} />}
        keyExtractor={pl => pl.id}
      />
    );
  };

  const renderSection = ({ item }) => {
    return (
      <>
        <View style={styles.sectionHeader}>
          <Text style={[baseStyle.h2, styles.sectionTitle]}>{item.name}</Text>
        </View>
        {item.render()}
      </>
    );
  };

  const showContent = () => {
    if (band) {
      return (
        <>
          <Error />
          <FlatList
            data={sections}
            renderItem={renderSection}
            keyExtractor={section => section.name}
            contentContainerStyle={styles.listStyle}
          />
          <Audio />
        </>
      );
    }
  };

  const sections = [
    { name: 'Tiers', render: renderTiers },
    { name: 'Playlists', render: renderPlaylists },
  ];

  return (
    <SafeAreaView style={[styles.main, baseStyle.background]}>
      {showContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    height: '100%',
  },
  sectionHeader: {
    marginTop: 20,
    borderBottomColor: 'rgb(72, 145, 255)',
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 30,
    paddingBottom: 5,
    color: 'rgb(82, 236, 236)',
  },
  listStyle: {
    paddingHorizontal: 8,
    paddingBottom: 100,
  },
  noBand: {
    height: '100%',
  },
  spinner: {
    padding: 40,
  },
});

const mapStateToProps = state => {
  return {
    tiers: state.tiers,
    playlists: state.playlists,
    band: state.bands.currentBand,
  };
};

export default connect(mapStateToProps, {
  fetchTiers,
  fetchPlaylists,
  fetchBand,
  initializeAudio,
})(BodyContainer);
