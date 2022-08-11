import TrackPlayer, { State } from 'react-native-track-player';

import {
  PLAY_AUDIO,
  PAUSE_AUDIO,
  INITIALIZE_AUDIO,
  SYNC_AUDIO,
  SET_CURRENT_SONG,
} from './types';

export const playAudio = () => async (dispatch) => {
  await TrackPlayer.play();
  dispatch({ type: PLAY_AUDIO });
};

export const pauseAudio = () => {
  TrackPlayer.pause();
  return { type: PAUSE_AUDIO };
};

const orderTitles = (tierId, state) => {
  const tier = state.tiers[tierId];
  const titleList = tier.trackList
    .map((id) => state.titles[id])
    .filter((title) => title && title.selectedBounce);

  if (tier.orderBy === 'date' || !tier.orderBy) {
    return titleList.sort((a, b) => {
      if (new Date(a.selectedBounce.date) > new Date(b.selectedBounce.date)) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  if (tier.orderBy === 'name') {
    return titleList.sort((a, b) => {
      return a.title < b.title ? -1 : 1;
    });
  }
};

const getQueue = (action, state, currentSong = null) => {
  let increment;

  if (action === 'next') {
    increment = 1;
  } else if (action === 'prev') {
    increment = -1;
  } else {
    increment = 0;
  }

  if (!currentSong) {
    currentSong = state.audio.currentSong;
  }
  const { parent } = currentSong;

  let songArray = [];

  // parent is tier
  if (parent.trackList) {
    const allTitles = orderTitles(parent.id, state);

    const currentIndex = allTitles.findIndex(
      (title) =>
        title.title === currentSong.title || title.id === currentSong.title.id
    );

    if (currentIndex + increment < 0) {
      return [];
    }

    const queue = allTitles.slice(currentIndex + increment);

    songArray = queue.map((song) => {
      const version = song.selectedVersion;
      const bounce = song.selectedBounce;

      return {
        title: song.title,
        version: version.name,
        date: bounce.date,
        duration: bounce.duration,
        audio: bounce.id,
      };
    });
  }

  // parent is playlist
  if (parent.songs) {
    const allSongs = parent.songs
      .map((id) => state.playlistSongs[id])
      .filter((song) => song.bounce)
      .sort((a, b) => (a.position < b.position ? -1 : 1));

    if (currentSong.position + (increment - 1) < 0) {
      return [];
    }

    const queue = allSongs.slice(currentSong.position + (increment - 1));

    songArray = queue.map((song, i) => {
      const title = state.titles[song.title];

      return {
        title: title.title,
        version: song.version.name,
        date: song.bounce.date,
        duration: song.bounce.duration,
        audio: song.bounce.id,
        position: song.position,
      };
    });
  }

  const artist = state.bands.currentBand.name;
  return songArray.map((song) => {
    return {
      ...song,
      // url: `http://localhost:8000/api/audio/${song.audio}`,
      url: `https://exploring-the-space.com/api/audio/${song.audio}`,
      artist,
      id: song.audio,
      parent,
    };
  });
};

const playQueue = async (queue, dispatch) => {
  if (!queue.length) {
    return dispatch(initializeAudio());
  }

  const prevQueue = await TrackPlayer.getQueue();
  if (prevQueue.length) {
    TrackPlayer.removeUpcomingTracks();
    await TrackPlayer.add(queue);
    await TrackPlayer.skipToNext();
    await TrackPlayer.remove(0);
  } else {
    await TrackPlayer.add(queue);
  }

  // let player get ready to avoid hiccups
  let playerReady;
  while (!playerReady) {
    let playerState = await TrackPlayer.getState();
    playerReady = playerState === State.Ready;
  }

  dispatch(playAudio());
  dispatch({ type: SET_CURRENT_SONG, payload: queue[0] });
};

export const queueSongs = (song) => async (dispatch, getState) => {
  const queue = getQueue(undefined, getState(), song);
  playQueue(queue, dispatch);
};

export const nextSong = () => (dispatch, getState) => {
  const queue = getQueue('next', getState());
  playQueue(queue, dispatch);
};

export const prevSong = () => (dispatch, getState) => {
  const queue = getQueue('prev', getState());
  playQueue(queue, dispatch);
};

export const updateQueue = () => async (dispatch, getState) => {
  const queue = getQueue('next', getState());
  TrackPlayer.removeUpcomingTracks();
  await TrackPlayer.add(queue);
};

export const initializeAudio = () => async (dispatch) => {
  const queue = await TrackPlayer.getQueue();
  if (queue.length) {
    TrackPlayer.removeUpcomingTracks();
  }
  TrackPlayer.pause();
  dispatch({ type: INITIALIZE_AUDIO });
};

export const syncAudioState = () => async (dispatch) => {
  let currentTrack;
  const queue = await TrackPlayer.getQueue();
  const i = await TrackPlayer.getCurrentTrack();
  if (i !== null) {
    currentTrack = queue[i];
  }

  const playerState = await TrackPlayer.getState();
  dispatch({ type: SYNC_AUDIO, payload: { currentTrack, playerState } });
};
