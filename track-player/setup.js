import TrackPlayer, { Capability } from 'react-native-track-player';

import playbackService from './service';

const setup = async () => {
  TrackPlayer.registerPlaybackService(() => playbackService);

  await TrackPlayer.setupPlayer();
  await TrackPlayer.updateOptions({
    stopWithApp: true,
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.Stop,
      Capability.SeekTo,
    ],
  });
};

export default setup;
