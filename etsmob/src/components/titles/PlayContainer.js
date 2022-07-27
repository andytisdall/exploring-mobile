import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import { queueSongs, queuePlaylistSongs, playAudio } from '../../actions';
import { spinner } from '../reusable/Spinner';
import PlayButton from '../../assets/images/play.svg';
import baseStyle from '../../style/baseStyle';

const PlayContainer = ({ song, queueSongs }) => {
  const [loaded, setLoaded] = useState(false);

  const displayDate = date => {
    return moment.utc(date).format('MM/DD/YY');
  };

  const displayTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds =
      Math.floor(time % 60) < 10
        ? '0' + Math.floor(time % 60)
        : Math.floor(time % 60);
    return `${minutes}:${seconds}`;
  };

  const onPlay = () => {
    queueSongs(song.title.id, song.parent);
  };

  return (
    <View style={styles.playContainer}>
      <Text style={styles.playContainerTime}>
        {displayTime(song.bounce.duration)}
      </Text>
      {/* {!loaded && spinner()} */}
      <Pressable onPress={onPlay}>
        <PlayButton style={styles.playButton} />
      </Pressable>
      <View style={[styles.playContainerDisplay]}>
        <Text style={styles.playContainerText}>{song.version.name}</Text>
        <Text style={styles.playContainerText}>
          {displayDate(song.bounce.date)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 37,
  },
  playContainerTime: {
    fontSize: 15,
    width: 36,
  },
  playContainerDisplay: {
    marginLeft: 10,
  },
  playContainerText: {
    fontSize: 13,
    marginBottom: 4,
  },
  playButton: {
    height: 35,
    width: 35,
    marginHorizontal: 4,
  },
});

export default connect(null, { queueSongs, queuePlaylistSongs, playAudio })(
  PlayContainer,
);
