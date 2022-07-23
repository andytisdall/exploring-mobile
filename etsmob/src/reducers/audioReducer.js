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
      const { song } = action.payload;
      return { ...state, currentSong: song, play: true };
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
      const newState = { ...state };
      if (action.payload.playerState === State.Playing) {
        newState.play = true;
      }
      if (action.payload.playerState === State.Paused) {
        newState.play = false;
      }
      let currentSong = state.currentSong;
      if (action.payload.currentTrack) {
        currentSong = action.payload.currentTrack;
      }
      return { ...newState, currentSong };
    default:
      return state;
  }
};

export default audioReducer;
