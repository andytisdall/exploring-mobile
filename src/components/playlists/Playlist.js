import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { FlatList } from 'react-native';

import { fetchPlaylistSongs } from '../../actions';
import PlaylistSong from '../playlistsongs/PlaylistSong';
import ParentDetail from '../reusable/ParentDetail';

const Playlist = ({ playlist, fetchPlaylistSongs, playlistSongs }) => {
  const [songsToRender, setSongsToRender] = useState(null);

  useEffect(() => {
    fetchPlaylistSongs(playlist.id);
  }, [fetchPlaylistSongs, playlist]);

  useEffect(() => {
    setSongsToRender(
      playlist.songs
        .map(id => playlistSongs[id])
        .filter(song => song)
        .sort((a, b) => (a.position < b.position ? -1 : 1)),
    );
  }, [playlistSongs, playlist.songs]);

  const renderPlaylistSongs = () => {
    return (
      <FlatList
        data={songsToRender}
        renderItem={({ item }) => {
          return <PlaylistSong song={item} playlist={playlist} key={item.id} />;
        }}
        keyExtractor={song => song.id}
      />
    );
  };

  return (
    <ParentDetail
      item={playlist}
      childList={songsToRender}
      showChildren={renderPlaylistSongs}
    />
  );
};

const mapStateToProps = state => {
  return {
    playlistSongs: state.playlistSongs,
  };
};

export default connect(mapStateToProps, {
  fetchPlaylistSongs,
})(Playlist);
