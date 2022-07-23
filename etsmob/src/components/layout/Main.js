import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
} from 'react-native';

import {
  fetchTiers,
  fetchPlaylists,
  createTier,
  createPlaylist,
  editTier,
  editPlaylist,
} from '../../actions';
import Tier from '../tiers/Tier';
// import Playlist from '../playlists/Playlist';
// import AddButton from '../reusable/AddButton';
import requireAuth from '../reusable/requireAuth';
// import AddTier from '../tiers/AddTier';
import baseStyle from '../../style/baseStyle';
// import DragContainer from './DragContainer';

const BodyContainer = ({
  fetchPlaylists,
  fetchTiers,
  tiers,
  playlists,
  band,
  authorized,
  createPlaylist,
  currentSong,
  handleUpdate,
  user,
  editTier,
  editPlaylist,
}) => {
  const [tierList, setTierList] = useState([]);
  const [playlistList, setPlaylistList] = useState([]);

  useEffect(() => {
    fetchTiers(band.id);
    fetchPlaylists(band.id);
  }, [band, fetchTiers, fetchPlaylists]);

  useEffect(() => {
    handleUpdate();
  }, [user, handleUpdate]);

  useEffect(() => {
    setTierList(
      band.tiers
        .map((id) => tiers[id])
        .sort((a, b) => {
          if (a.position < b.position) {
            return -1;
          }
          if (b.position < a.position) {
            return 1;
          }
          return -1;
        })
    );
  }, [tiers, setTierList, band]);

  useEffect(() => {
    setPlaylistList(
      band.playlists
        .map((id) => playlists[id])
        .sort((a, b) => {
          if (a.position < b.position) {
            return -1;
          }
          if (b.position < a.position) {
            return 1;
          }
          return -1;
        })
    );
  }, [playlists, band]);

  const renderTiers = () => {
    const tiersToRender = tierList.filter((tier) => tier);
    return (
      <FlatList
        data={tiersToRender}
        renderItem={({ item }) => <Tier tier={item} />}
        keyExtractor={(tier) => tier.id}
      />
    );
  };

  // const renderTierAddButton = () => {
  //   if (authorized) {
  //     return <AddTier />;
  //   }
  // };

  // const renderPlaylistAddButton = () => {
  //   if (authorized) {
  //     return (
  //       <AddButton
  //         onSubmit={(formValues) => createPlaylist(formValues)}
  //         title="Add a Playlist"
  //         image="/images/add.png"
  //         fields={[
  //           {
  //             label: 'Playlist Name',
  //             name: 'playlistName',
  //             type: 'input',
  //             required: true,
  //           },
  //         ]}
  //         addClass="add-left"
  //       />
  //     );
  //   }
  // };

  // const renderPlaylists = () => {
  //   const renderedPlaylists = playlistList.map((playlist) => {
  //     if (playlist) {
  //       return <Playlist playlist={playlist} key={playlist.id} />;
  //     }
  //     return null;
  //   });

  //   if (authorized) {
  //     return (
  //       <DragContainer listType="playlists" action={editPlaylist}>
  //         {renderedPlaylists}
  //       </DragContainer>
  //     );
  //   } else {
  //     return renderedPlaylists;
  //   }
  // };

  const playbarActive = currentSong ? 'playbar-active' : '';

  const renderSection = ({ item }) => {
    return (
      <>
        <View style={styles.sectionHeader}>
          <Text style={[baseStyle.h2, styles.sectionTitle]}>{item.name}</Text>
          {/* <div className="section-add">{renderTierAddButton()}</div> */}
        </View>
        {item.render()}
      </>
    );
  };

  const sections = [{ name: 'Tiers', render: renderTiers }];

  return (
    <View style={styles.main}>
      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(section) => section.name}
        contentContainerStyle={styles.listStyle}
      />
      {/* <div className="playlists">
        <div className="section-header">
          <h2 className="section-title">Playlists</h2>
          <div className="section-add">{renderPlaylistAddButton()}</div>
        </div>
        <hr />
        {/* {playlists && renderPlaylists()} */}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    paddingTop: 20,
    paddingHorizontal: 8,
    backgroundColor: 'rgb(56, 56, 56)',
    height: '100%',
  },
  sectionHeader: {
    marginTop: 10,
    borderBottomColor: 'rgb(72, 145, 255)',
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 27,
    paddingBottom: 5,
  },
  listStyle: {
    paddingBottom: 400,
  },
});

const mapStateToProps = (state) => {
  return {
    tiers: state.tiers,
    playlists: state.playlists,
    currentSong: state.audio.currentSong,
    user: state.auth.user,
    band: state.bands.currentBand,
  };
};

export default connect(mapStateToProps, {
  fetchTiers,
  fetchPlaylists,
  createTier,
  createPlaylist,
  editTier,
  editPlaylist,
})(requireAuth(BodyContainer));
