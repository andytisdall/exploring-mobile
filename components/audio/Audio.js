import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import {
  playAudio,
  pauseAudio,
  nextSong,
  prevSong,
  throwError,
  initializeAudio,
} from '../../actions';
import PlayButton from '../../assets/images/play.svg';
import PauseButton from '../../assets/images/pause.svg';
import PrevButton from '../../assets/images/prev.svg';
import NextButton from '../../assets/images/next.svg';
import baseStyle from '../../style/baseStyle';

class AudioDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.audio = React.createRef();
  }

  state = { volume: 50, sliderPosition: 0 };

  formatTime(time) {
    let minutes =
      time < 600 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60);
    let seconds =
      time % 60 < 10 ? `0${Math.floor(time % 60)}` : Math.floor(time % 60);
    return `${minutes}:${seconds}`;
  }

  displayDate = (date) => {
    return moment.utc(date).format('MM/DD/yy');
  };

  wrapUrl(id) {
    return `${this.url}/api/audio/${id}.mp3`;
  }

  updateSlider = () => {
    const position =
      (this.audio.current.currentTime / this.audio.current.duration) * 1000;
    this.time = this.formatTime(this.audio.current.currentTime);
    if (!isNaN(position)) {
      this.setState({
        sliderPosition: position,
      });
    }
  };

  setSpaceBarToPlay = (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (this.props.pause) {
        this.play();
      } else {
        this.pause();
      }
    }
  };

  audioError = () => {
    const message =
      "The audio player had an error, probably can't connect to server.";
    this.props.throwError(message);
  };

  // componentDidMount() {
  //   // if there's no audio element created, create one with the current song
  //   // add event listener to link the slider position to the time of the song

  //   // this.audio.current = new Audio();

  //   // this.audio.current.addEventListener('timeupdate', this.updateSlider);

  //   // this.audio.current.addEventListener('error', this.audioError);

  //   // // load next song at song end

  //   // this.audio.current.addEventListener('ended', this.nextSong);

  //   // // space bar stop/start

  //   // document.addEventListener('keydown', this.setSpaceBarToPlay);

  //   // this.audio.current.addEventListener('loadedmetadata', this.playOnLoad);
  // }

  // componentDidUpdate(prevProps) {
  //   // scroll down to compensate for the playbar pushing content down

  //   // if (!this.scrolled) {
  //   //   window.scroll(window.scrollX, window.scrollY + 96);
  //   //   this.scrolled = true;
  //   // }

  //   // if (this.props.song) {
  //   //   // if the current song is changed to something other than what is already loaded, change the src url and play the audio
  //   //   // if redux gets a signal to play, play if not already
  //   //   // reverse for pause
  //   //   if (this.props.song !== prevProps.song) {
  //   //     this.audio.current.src = this.wrapUrl(this.props.song.audio);
  //   //     this.audio.current.volume = this.props.volume / 100;
  //   //     // this.audio.current.play();
  //   //   } else if (this.props.play && prevProps.pause) {
  //   //     this.audio.current.play();
  //   //   } else if (this.props.pause && prevProps.play) {
  //   //     this.audio.current.pause();
  //   //   }
  //   //   if (this.props.volume !== prevProps.volume) {
  //   //     this.audio.current.volume = this.props.volume / 100;
  //   //   }
  //   // } else {
  //   //   this.audio.current.pause();
  //   }
  // }

  // componentWillUnmount() {
  //   document.removeEventListener('keydown', this.setSpaceBarToPlay);

  //   this.audio.current.src = '';
  //   this.audio.current.removeEventListener('timeupdate', this.updateSlider);
  //   this.audio.current.removeEventListener('error', this.audioError);
  //   this.audio.current.removeEventListener('ended', this.nextSong);
  //   this.audio.current.removeEventListener('loadedmetadata', this.playOnLoad);

  //   this.props.initializeAudio();
  // }

  playOnLoad = () => {
    if (this.props.play) {
      // this.audio.current.play();
    }
  };

  prevSong = () => {
    if (this.audio.current.currentTime < 1) {
      // this.props.prevSong();
    } else {
      // this.audio.current.currentTime = 0;
    }
  };

  nextSong = () => {
    this.props.nextSong();
  };

  play = () => {
    this.props.playAudio();
  };

  pause = () => {
    this.props.pauseAudio();
  };

  onSliderChange = (e) => {
    const position = (e.target.value / 1000) * this.audio.current.duration;
    this.audio.current.currentTime = position;
  };

  onPauseButton = () => {
    if (this.props.play) {
      this.pause();
    } else {
      this.play();
    }
  };

  render() {
    const playButton = this.props.play ? (
      <PlayButton style={styles.bigButton} />
    ) : (
      <PauseButton style={styles.bigButton} />
    );
    if (this.props.song) {
      return (
        <View style={styles.playbar}>
          <View style={styles.playbarHeader}>
            <View style={styles.playbarTitle}>
              <Text style={styles.songTitle}>
                {this.props.song.title.title}
              </Text>
            </View>

            <View style={styles.bigPlayContainer}>
              <Pressable onPress={this.prevSong}>
                <PrevButton style={styles.smallButton} />
              </Pressable>
              <Pressable onPress={this.onPauseButton}>{playButton}</Pressable>
              <Pressable onPress={this.nextSong}>
                <NextButton style={styles.smallButton} />
              </Pressable>
            </View>

            <View style={{ flex: 1 }}>
              <View style={[styles.playbarInfo]}>
                <Text style={[styles.playbarInfoDetail, baseStyle.text]}>
                  Version:
                </Text>
                <Text style={[styles.playbarInfoDetail, baseStyle.text]}>
                  {this.props.song.version}
                </Text>
              </View>
              <View style={[styles.playbarInfo]}>
                <Text style={[styles.playbarInfoDetail, baseStyle.text]}>
                  Date:
                </Text>
                <Text style={[styles.playbarInfoDetail, baseStyle.text]}>
                  {this.displayDate(this.props.song.date)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.playsliderContainer}>
            <Text style={[styles.playsliderTime, baseStyle.text]}>
              {this.time}
            </Text>
            <Text style={[styles.playsliderTime, baseStyle.text]}>
              {this.formatTime(this.props.song.duration)}
            </Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
}

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
  },
  playsliderTime: {
    fontSize: 10,
  },
  songTitle: {
    color: 'white',
    fontSize: 18,
  },
});

const mapStateToProps = (state) => {
  return {
    song: state.audio.currentSong,
    play: state.audio.play,
    pause: state.audio.pause,
    volume: state.audio.volume,
  };
};

export default connect(mapStateToProps, {
  playAudio,
  pauseAudio,
  nextSong,
  prevSong,
  throwError,
  initializeAudio,
})(AudioDisplay);
