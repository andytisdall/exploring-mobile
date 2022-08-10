import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import PlayContainer from '../reusable/PlayContainer';
import baseStyle from '../../style/baseStyle';
import { styles } from '../titles/Title';

const PlaylistSong = ({
  playlist,
  song,
  playlistSongs,
  versions,
  bounces,
  titles,
  audio,
}) => {
  const [playSong, setPlaySong] = useState(null);

  useEffect(() => {
    if (titles[song.title]) {
      setPlaySong({
        song,
        title: titles[song.title],
        version: song.version,
        bounce: song.bounce,
        position: song.position,
        parent: playlist,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song]);

  const renderPlayContainer = () => {
    if (playSong && playSong.bounce && playSong.version) {
      return <PlayContainer song={playSong} parentType="playlist" />;
    } else {
      return (
        <View className="playlistsong-no-bounce">
          <Text>
            {song.version ? `${song.version.name}` : 'No Version Selected'}
          </Text>
          <Text>No Bounce Selected</Text>
        </View>
      );
    }
  };

  const current = audio.currentSong ? audio.currentSong.audio : null;
  const parent = audio.currentSong ? audio.currentSong.parent.id : null;

  const regularColors = [
    'rgba(233, 255, 255, 0.479)',
    'rgba(213, 247, 255, 0.616)',
    'rgb(181, 188, 255)',
    'rgba(168, 209, 255, 0.781)',
    'rgba(210, 255, 210, 0)',
  ];
  const currentSongColors = [
    'rgba(255, 233, 233, 0.479)',
    'rgba(255, 218, 183, 0.616)',
    'rgb(244, 255, 83)',
    'rgba(255, 240, 108, 0.781)',
    'rgba(255, 243, 210, 0)',
  ];

  let colors = regularColors;

  if (current && song.bounce) {
    colors =
      parent === playlist.id && current === song.bounce.id
        ? currentSongColors
        : regularColors;
  }

  return (
    <View style={styles.titleMargin}>
      <View style={styles.topBorder}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[baseStyle.marqee, styles.title]}
        >
          <View style={styles.titleName}>
            <View style={styles.songPositionContainer}>
              <Text style={styles.songPosition}>{song.position}</Text>
            </View>
            <Text style={baseStyle.h3}>
              {song && titles[song.title] && titles[song.title].title}
            </Text>
          </View>
          {renderPlayContainer()}
        </LinearGradient>
      </View>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    playlistSongs: state.playlistSongs,
    versions: state.versions,
    bounces: state.bounces,
    titles: state.titles,
    audio: state.audio,
  };
};

export default connect(mapStateToProps, {})(PlaylistSong);
