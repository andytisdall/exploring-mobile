import TrackPlayer from 'react-native-track-player';

import {
  PLAY_AUDIO,
  PAUSE_AUDIO,
  QUEUE_SONGS,
  NEXT_SONG,
  INITIALIZE_AUDIO,
  CHANGE_VOLUME,
  SYNC_AUDIO,
} from './types';

const convertForPlayer = (songArray, state) => {
  const artist = state.bands.currentBand.name;
  return songArray.map(song => {
    return {
      ...song,
      url: `https://exploring-the-space.com/api/audio/${song.audio}`,
      artist,
      id: song.audio,
    };
  });
};

export const playAudio = () => {
  TrackPlayer.play();
  return { type: PLAY_AUDIO };
};

export const pauseAudio = () => {
  TrackPlayer.pause();
  return { type: PAUSE_AUDIO };
};

export const queueSongs = (id, parent) => async (dispatch, getState) => {
  const state = getState();
  const newSong = { id, parent };

  const queue = await updateQueue('new', state, newSong);
  const convertedQueue = convertForPlayer(queue, state);

  TrackPlayer.removeUpcomingTracks();
  await TrackPlayer.remove(0);
  await TrackPlayer.add(convertedQueue);
  const prevQueue = await TrackPlayer.getQueue();
  if (prevQueue.length) {
    await TrackPlayer.skipToNext();
  }

  dispatch(playAudio());

  dispatch({
    type: QUEUE_SONGS,
    payload: { song: convertedQueue[0] },
  });
};

const orderTitles = (tier, state) => {
  const titleList = tier.trackList
    .map(id => state.titles[id])
    .filter(title => title && title.selectedBounce);

  if (tier.orderBy === 'date' || !tier.orderyBy) {
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

const updateQueue = async (action, state, currentSong = null) => {
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

  // parent is tier
  if (parent.trackList) {
    const allTitles = orderTitles(parent, state);

    const currentIndex = allTitles.findIndex(
      title => title.title === currentSong.title || title.id === currentSong.id,
    );

    const queue = allTitles.slice(currentIndex + increment);

    return queue.map(song => {
      const version = state.versions[song.selectedVersion.id];
      const bounce = state.bounces[song.selectedBounce.id];

      return {
        title: song.title,
        version: version.name,
        date: bounce.date,
        duration: bounce.duration,
        audio: bounce.id,
        parent,
      };
    });
  }

  // parent is playlist
  if (parent.songs) {
    const allSongs = parent.songs
      .map(id => state.playlistSongs[id])
      .filter(song => song.bounce)
      .sort((a, b) => (a.position < b.position ? -1 : 1));

    const queue = allSongs.slice(currentSong.position + (increment - 1));

    return queue.map(song => {
      const version = state.versions[song.version];
      const bounce = state.bounces[song.bounce];
      const title = state.titles[song.title];

      return {
        title: title.title,
        version: version.name,
        date: bounce.date,
        duration: bounce.duration,
        audio: bounce.id,
        position: song.position,
        parent,
      };
    });
  }
};

export const nextSong = () => async (dispatch, getState) => {
  const state = getState();
  const newQueue = await updateQueue('next', state);

  if (!newQueue.length) {
    return dispatch(initializeAudio());
  }

  // console.log(newQueue.map((t) => t.title));

  const convertedQueue = convertForPlayer(newQueue, state);

  TrackPlayer.removeUpcomingTracks();
  await TrackPlayer.add(convertedQueue);

  await TrackPlayer.skipToNext();

  if (convertedQueue[0]) {
    dispatch({ type: NEXT_SONG, payload: convertedQueue[0] });
  } else {
    dispatch(initializeAudio());
  }
};

export const prevSong = () => async (dispatch, getState) => {
  const state = getState();
  const newQueue = await updateQueue('prev', state);

  TrackPlayer.removeUpcomingTracks();
  await TrackPlayer.add(convertForPlayer(newQueue, state));

  await TrackPlayer.skipToNext();

  if (newQueue[0]) {
    dispatch({ type: NEXT_SONG, payload: newQueue[0] });
  } else {
    dispatch(initializeAudio());
  }
};

export const changeVolume = value => {
  return { type: CHANGE_VOLUME, payload: value };
};

export const initializeAudio = () => async dispatch => {
  TrackPlayer.removeUpcomingTracks();
  TrackPlayer.remove(0);
  TrackPlayer.pause();
  dispatch({ type: INITIALIZE_AUDIO });
};

export const syncAudioState = () => async dispatch => {
  let currentTrack;
  const queue = await TrackPlayer.getQueue();
  const i = await TrackPlayer.getCurrentTrack();
  if (i) {
    currentTrack = queue[i];
  }
  const playerState = await TrackPlayer.getState();
  dispatch({ type: SYNC_AUDIO, payload: { currentTrack, playerState } });
};
