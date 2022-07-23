import TrackPlayer, { Event } from 'react-native-track-player';

export default function service() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());

  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());

  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.destroy());

  TrackPlayer.addEventListener(Event.RemoteNext, () =>
    TrackPlayer.skipToNext(),
  );

  TrackPlayer.addEventListener(Event.RemotePrevious, () =>
    TrackPlayer.skipToPrevious(),
  );

  TrackPlayer.addEventListener(Event.RemoteSeek, e => {
    TrackPlayer.seekTo(e.position);
    // background controls on ios reset to previous position for some reason
    // so seek again after a delay and the progress bar should match the actual time
    const DELAY = 50;
    const newTime = parseFloat(e.position) + DELAY / 1000;
    setTimeout(() => {
      TrackPlayer.seekTo(newTime);
    }, DELAY);
  });
}
