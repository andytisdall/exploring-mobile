import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { View, Text } from 'react-native';

import { selectVersion, fetchVersions } from '../../actions';
import Bounce from '../bounces/Bounce';
import DetailBox from '../reusable/DetailBox';

const Version = ({ versions, selectVersion, title, song, fetchVersions }) => {
  const [selectedVersion, setSelectedVersion] = useState(title.selectedVersion);
  const [versionList, setVersionList] = useState([]);

  useEffect(() => {
    fetchVersions(title.id);
  }, [fetchVersions, title.id]);

  useEffect(() => {
    setVersionList(title.versions.map(id => versions[id]));
  }, [title.versions, versions]);

  useEffect(() => {
    // console.log(selectedVersion);
    // console.log('a');
    if (
      selectedVersion &&
      title.selectedVersion &&
      selectedVersion.id !== title.selectedVersion.id
    ) {
      selectVersion(selectedVersion, title.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVersion, selectVersion]);

  useEffect(() => {
    // console.log('b');
    if (versionList[0] && !selectedVersion) {
      setSelectedVersion(versionList.find(v => v.current));
    } else if (
      selectedVersion &&
      versionList[0] &&
      !versionList.includes(selectedVersion)
    ) {
      setSelectedVersion(versionList.find(v => v.id === selectedVersion.id));
    }
  }, [versionList, selectedVersion]);

  useEffect(() => {
    // console.log('c');
    if (selectedVersion !== title.selectedVersion) {
      setSelectedVersion(title.selectedVersion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title.selectedVersion]);

  const renderBounces = () => {
    if (selectedVersion) {
      return <Bounce title={title} version={selectedVersion} song={song} />;
    }
  };

  const renderArrow = () => {
    if (selectedVersion) {
      return <Text>&rarr;</Text>;
    }
  };

  const itemList = () => {
    return versionList.filter(v => v && v.id !== selectedVersion.id);
  };

  const displayVersion = v => {
    return `${v.name}`;
  };

  return (
    <>
      <DetailBox
        selectedItem={selectedVersion}
        itemType="Version"
        itemList={itemList}
        displayItem={displayVersion}
        setSelected={setSelectedVersion}
      />
      <View>{renderArrow()}</View>
      {renderBounces()}
    </>
  );
};

const mapStateToProps = state => {
  return {
    band: state.bands.currentBand,
    versions: state.versions,
  };
};

export default connect(mapStateToProps, {
  selectVersion,
  fetchVersions,
})(Version);
