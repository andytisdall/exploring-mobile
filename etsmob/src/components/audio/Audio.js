import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import TrackPlayer, {
  useTrackPlayerEvents,
  useProgress,
  Event,
  State,
} from 'react-native-track-player';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import {
  playAudio,
  pauseAudio,
  nextSong,
  prevSong,
  throwError,
  initializeAudio,
  syncAudioState,
} from '../../actions';
import PlayButton from '../../assets/images/play.svg';
import PauseButton from '../../assets/images/pause.svg';
import PrevButton from '../../assets/images/prev.svg';
import NextButton from '../../assets/images/next.svg';
import baseStyle from '../../style/baseStyle';

const Audio = (props) => {
  const { position, duration } = useProgress();

  const events = [Event.PlaybackState, Event.PlaybackError];

  // const syncronizeCurrentSong = async () => {
  //   const queue = await TrackPlayer.getQueue();
  //   const i = await TrackPlayer.getCurrentTrack();
  //   if (!currentSong || currentSong.id !== queue[i].id) {
  //     setCurrentSong(queue[i]);
  //   }
  // };

  useEffect(() => {
    props.syncAudioState();
    // if (!props.song) {
    //   props.pauseAudio();
    // }
  }, [props.song]);

  // useEffect(() => {
  //   syncronizeCurrentSong();
  // }, [position]);

  useTrackPlayerEvents(events, async (event) => {
    // syncronizeCurrentSong();

    if (event.type === Event.PlaybackError) {
      throwError('audio player had an error');
      console.log('track player crashed');
    }
    if (event.type === Event.PlaybackState) {
      if (event.state === State.Playing && !props.isPlaying) {
        props.syncAudioState();
      }
      if ((event.state = State.Paused && props.isPlaying)) {
        props.syncAudioState();
      }
    }
    if (event.type === Event.PlaybackTrackChanged) {
    }
  });

  const formatTime = (time) => {
    let minutes =
      time < 600 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60);
    let seconds =
      time % 60 < 10 ? `0${Math.floor(time % 60)}` : Math.floor(time % 60);
    return `${minutes}:${seconds}`;
  };

  const displayDate = (date) => {
    return moment.utc(date).format('MM/DD/yy');
  };

  const prevSong = () => {
    if (position < 1) {
      props.prevSong();
    } else {
      TrackPlayer.seekTo(0);
    }
  };

  const nextSong = () => {
    props.nextSong();
  };

  const onSliderChange = (value) => {
    TrackPlayer.seekTo(Math.round(value));
  };

  const onPauseButton = () => {
    if (props.isPlaying) {
      props.pauseAudio();
    } else {
      props.playAudio();
    }
  };

  const playButton = !props.isPlaying ? (
    <PlayButton style={styles.bigButton} />
  ) : (
    <PauseButton style={styles.bigButton} />
  );

  if (props.song) {
    return (
      <View style={styles.playbar}>
        <View style={styles.playbarHeader}>
          <View style={styles.playbarTitle}>
            <Text style={styles.songTitle}>{props.song.title}</Text>
          </View>

          <View style={styles.bigPlayContainer}>
            <Pressable onPress={prevSong}>
              <PrevButton style={styles.smallButton} />
            </Pressable>
            <Pressable onPress={onPauseButton}>{playButton}</Pressable>
            <Pressable onPress={nextSong}>
              <NextButton style={styles.smallButton} />
            </Pressable>
          </View>

          <View style={{ flex: 1 }}>
            <View style={[styles.playbarInfo]}>
              <Text style={[styles.playbarInfoDetail, baseStyle.text]}>
                Version:
              </Text>
              <Text style={[styles.playbarInfoDetail, baseStyle.text]}>
                {props.song.version}
              </Text>
            </View>
            <View style={[styles.playbarInfo]}>
              <Text style={[styles.playbarInfoDetail, baseStyle.text]}>
                Date:
              </Text>
              <Text style={[styles.playbarInfoDetail, baseStyle.text]}>
                {displayDate(props.song.date)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.playsliderContainer}>
          <Text style={[styles.playsliderTime, baseStyle.text]}>
            {formatTime(position)}
          </Text>
          <MultiSlider
            values={[Math.floor(position)]}
            max={Math.floor(duration) || 1000}
            onValuesChangeFinish={onSliderChange}
            markerStyle={styles.thumb}
          />
          <Text style={[styles.playsliderTime, baseStyle.text]}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  playbar: {
    backgroundColor: 'rgb(24, 24, 24)',
    borderColor: 'rgb(62, 255, 239)',
    borderWidth: 1,
    width: '100%',
    paddingVertical: 5,
  },
  playbarHeader: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  playbarTitle: {
    width: '30%',
    marginLeft: 5,
  },
  bigPlayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: '20%',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  bigButton: {
    height: 40,
    width: 40,
    marginHorizontal: 10,
  },
  smallButton: {
    height: 25,
    width: 25,
  },
  playbarInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
  },
  playbarInfoDetail: {
    fontSize: 10,
    marginBottom: 5,
  },
  playsliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playsliderTime: {
    fontSize: 10,
  },
  songTitle: {
    color: 'white',
    fontSize: 18,
  },
  thumb: {
    width: 7,
    height: 20,
    backgroundColor: 'red',
  },
});

const mapStateToProps = (state) => {
  return {
    song: state.audio.currentSong,
    isPlaying: state.audio.play,
  };
};

export default connect(mapStateToProps, {
  playAudio,
  pauseAudio,
  nextSong,
  prevSong,
  throwError,
  initializeAudio,
  syncAudioState,
})(Audio);
