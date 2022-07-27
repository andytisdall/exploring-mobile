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

const Audio = ({
  song,
  syncAudioState,
  nextSong,
  prevSong,
  isPlaying,
  playAudio,
  pauseAudio,
  show,
}) => {
  const { position, duration } = useProgress();
  const [playerState, setPlayerState] = useState(State.Paused);

  const events = [Event.PlaybackState, Event.PlaybackError];

  // const syncronizeCurrentSong = async () => {
  //   const queue = await TrackPlayer.getQueue();
  //   const i = await TrackPlayer.getCurrentTrack();
  //   if (!currentSong || currentSong.id !== queue[i].id) {
  //     setCurrentSong(queue[i]);
  //   }
  // };

  useEffect(() => {
    syncAudioState();
  }, [song, syncAudioState]);

  // useEffect(() => {
  //   syncronizeCurrentSong();
  // }, [position]);

  useTrackPlayerEvents(events, async event => {
    syncAudioState();

    if (event.type === Event.PlaybackError) {
      throwError('audio player had an error');
      console.log('track player crashed');
    }
    if (event.type === Event.PlaybackState) {
      setPlayerState(event.state);
    }
    if (event.type === Event.PlaybackTrackChanged) {
      // syncAudioState();
    }
  });

  const formatTime = time => {
    let minutes =
      time < 600 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60);
    let seconds =
      time % 60 < 10 ? `0${Math.floor(time % 60)}` : Math.floor(time % 60);
    return `${minutes}:${seconds}`;
  };

  const displayDate = date => {
    return moment.utc(date).format('MM/DD/yy');
  };

  const prev = () => {
    if (position < 1) {
      prevSong();
    } else {
      TrackPlayer.seekTo(0);
    }
  };

  const next = () => {
    nextSong();
  };

  const onSliderChange = value => {
    TrackPlayer.seekTo(Math.round(value));
  };

  const onPauseButton = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const showPlayerState = () => {
    const statesToShow = [State.Buffering];
    if (statesToShow.includes(playerState)) {
      return <Text style={styles.playerState}>{playerState}</Text>;
    }
  };

  const playButton = !isPlaying ? (
    <PlayButton style={styles.bigButton} />
  ) : (
    <PauseButton style={styles.bigButton} />
  );

  if (song && show) {
    return (
      <View style={styles.playbar}>
        <View style={styles.playbarHeader}>
          <Text style={styles.songTitle}>{song.title}</Text>

          <View style={[styles.playbarMain]}>
            <View style={[styles.playbarInfo]}>
              <Text style={[baseStyle.text, styles.playbarInfoDetail]}>
                Version:
              </Text>
              <Text style={[baseStyle.text, styles.playbarInfoDetailData]}>
                {song.version}
              </Text>
            </View>

            <View style={styles.bigPlayContainer}>
              <Pressable onPress={prev}>
                <PrevButton style={styles.smallButton} />
              </Pressable>
              <Pressable onPress={onPauseButton}>{playButton}</Pressable>
              <Pressable onPress={next}>
                <NextButton style={styles.smallButton} />
              </Pressable>
            </View>

            <View style={[styles.playbarInfo, styles.right]}>
              <Text style={[baseStyle.text, styles.playbarInfoDetail]}>
                Date:
              </Text>
              <Text style={[baseStyle.text, styles.playbarInfoDetailData]}>
                {displayDate(song.date)}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.playsliderContainer]}>
          <Text style={[baseStyle.text, styles.playsliderTime]}>
            {formatTime(position)}
          </Text>
          <MultiSlider
            values={[Math.floor(position)]}
            max={Math.floor(duration) || 1000}
            onValuesChangeFinish={onSliderChange}
            markerStyle={styles.thumb}
            trackStyle={styles.track}
            containerStyle={styles.slider}
          />
          <Text style={[baseStyle.text, styles.playsliderTime]}>
            {formatTime(duration)}
          </Text>
        </View>
        {showPlayerState()}
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
    paddingTop: 7,
  },
  playbarHeader: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  songTitle: {
    color: 'white',
    fontSize: 28,
    letterSpacing: 1,
    textAlign: 'center',
  },
  playbarMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  bigPlayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bigButton: {
    height: 55,
    width: 55,
    marginHorizontal: 20,
  },
  smallButton: {
    height: 30,
    width: 30,
  },
  playbarInfo: {
    width: '25%',
    justifyContent: 'center',
  },
  right: {
    alignItems: 'flex-end',
  },
  playbarInfoDetail: {
    fontSize: 15,
  },
  playbarInfoDetailData: {
    fontSize: 15,
    color: 'yellow',
  },
  playsliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingleft: 10,
  },
  playsliderTime: {
    fontSize: 15,
    marginLeft: 10,
  },
  slider: {
    height: 40,
  },
  track: {
    backgroundColor: 'yellow',
  },
  thumb: {
    width: 7,
    height: 20,
    backgroundColor: 'red',
  },
  playerState: {
    color: 'white',
    alignSelf: 'center',
  },
});

const mapStateToProps = state => {
  return {
    song: state.audio.currentSong,
    isPlaying: state.audio.play,
    show: state.audio.show,
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
