import {
  PLAY_AUDIO,
  PAUSE_AUDIO,
  QUEUE_SONGS,
  NEXT_SONG,
  DELETE_BOUNCE,
  CHANGE_VOLUME,
  INITIALIZE_AUDIO,
  SYNC_AUDIO,
} from '../actions/types';

import { State } from 'react-native-track-player';

const initialState = {
  play: false,
  volume: 75,
  currentSong: null,
};

const audioReducer = (state = initialState, action) => {
  switch (action.type) {
    case PLAY_AUDIO:
      return { ...state, play: true };
    case PAUSE_AUDIO:
      return { ...state, play: false };
    case QUEUE_SONGS:
      const { song, parent } = action.payload;
      return { ...state, currentSong: song, play: true, parent };
    case NEXT_SONG:
      return { ...state, currentSong: action.payload };
    case DELETE_BOUNCE:
      if (
        state.currentSong &&
        action.payload.bounce.id === state.currentSong.audio
      ) {
        return { ...initialState };
      } else {
        return state;
      }
    case CHANGE_VOLUME:
      return { ...state, volume: action.payload };
    case INITIALIZE_AUDIO:
      console.log('initialize audio');
      return { ...initialState };
    case SYNC_AUDIO:
      const isPlaying = action.payload.playerState === State.Playing;
      const isPaused = action.payload.playerState === State.Paused;
      const { currentTrack } = action.payload;
      let currentSong = state.currentSong;
      const stateIsChanged =
        (isPlaying && !state.play) ||
        (isPaused && !state.play) ||
        !currentTrack ||
        !currentSong ||
        currentTrack.id !== currentSong.id;
      if (stateIsChanged) {
        return { ...state, currentSong: currentTrack };
      } else {
        return state;
      }
    default:
      return state;
  }
};

export default audioReducer;
