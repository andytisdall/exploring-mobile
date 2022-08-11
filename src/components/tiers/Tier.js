import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { FlatList, Pressable, Text, View, StyleSheet } from 'react-native';

import { createTier, fetchTitles, setOrder } from '../../actions';
import Title from '../titles/Title';

import ParentDetail from '../reusable/ParentDetail';

const Tier = ({ tier, titles, fetchTitles, setOrder }) => {
  const [titlesToRender, setTitlesToRender] = useState(null);
  const [orderedTitles, setOrderedTitles] = useState({});

  useEffect(() => {
    fetchTitles(tier.id);
  }, [fetchTitles, setOrder, tier.id]);

  useEffect(() => {
    const trackListTitles = tier.trackList
      .map((id) => titles[id])
      .filter((title) => title);

    setTitlesToRender(trackListTitles);

    trackListTitles.map((t) => {
      if (t?.selectedBounce?.latest && t.selectedVersion?.current) {
        findLatest(t, t.selectedBounce);
      }
      return;
    });
  }, [titles, tier.trackList]);

  const findLatest = (title, bounce) => {
    setOrderedTitles((state) => {
      if (bounce) {
        return {
          ...state,
          [title.id]: new Date(bounce.date),
        };
      } else {
        return {
          ...state,
          [title.id]: null,
        };
      }
    });
  };

  const orderTitles = useCallback(
    (t) => {
      const titleList = [...t];

      if (!tier.orderBy || tier.orderBy === 'date') {
        titleList.sort((a, b) => {
          if (orderedTitles[a.id] && orderedTitles[b.id]) {
            if (orderedTitles[a.id] > orderedTitles[b.id]) {
              return -1;
            } else {
              return 1;
            }
          } else if (orderedTitles[a.id]) {
            return -1;
          } else if (orderedTitles[b.id]) {
            return 1;
          } else if (a.title < b.title) {
            return -1;
          } else {
            return 1;
          }
        });
      }

      if (tier.orderBy === 'name') {
        titleList.sort((a, b) => {
          return a.title < b.title ? -1 : 1;
        });
      }
      return titleList;
    },
    [orderedTitles, tier.orderBy]
  );

  const renderTitles = () => {
    const titlesList = orderTitles(titlesToRender);
    return (
      <FlatList
        data={titlesList}
        renderItem={({ item }) => {
          return <Title title={item} tier={tier} findLatest={findLatest} />;
        }}
        keyExtractor={(title) => title.id}
      />
    );
  };

  const renderOrderButton = () => {
    let nameButton, dateButton;
    const getLabel = (type) => (type === 'date' ? 'Date' : 'ABC');

    const activeButton = (type) => {
      return (
        <View style={[styles.orderButton, styles.active]}>
          <Text>{getLabel(type)}</Text>
        </View>
      );
    };

    const inActiveButton = (type) => {
      return (
        <Pressable
          style={styles.orderButton}
          onPress={() => {
            setOrder(tier.id, type);
          }}
        >
          <Text style={styles.orderText}>{getLabel(type)}</Text>
        </Pressable>
      );
    };

    if (!tier.orderBy || tier.orderBy === 'date') {
      dateButton = activeButton('date');
      nameButton = inActiveButton('name');
    }
    if (tier.orderBy === 'name') {
      nameButton = activeButton('name');
      dateButton = inActiveButton('date');
    }
    return (
      <View style={styles.orderBy}>
        <Text style={styles.orderText}>Order titles by: </Text>
        {dateButton}
        {nameButton}
      </View>
    );
  };

  return (
    <ParentDetail
      item={tier}
      childList={titlesToRender}
      showChildren={renderTitles}
      options={renderOrderButton}
    />
  );
};

const styles = StyleSheet.create({
  orderBy: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 5,
    paddingLeft: 20,
  },
  orderButton: {
    borderColor: 'rgb(212, 179, 255)',
    borderWidth: 1,
    borderRadius: 50,
    paddingVertical: 2,
    paddingHorizontal: 5,
    marginLeft: 8,
  },
  active: {
    backgroundColor: 'rgb(212, 179, 255)',
  },
  orderText: {
    color: 'white',
    fontFamily: 'Fira Sans',
  },
});

const mapStateToProps = (state) => {
  return {
    titles: state.titles,
    band: state.bands.currentBand,
    tiers: state.tiers,
  };
};

export default connect(mapStateToProps, {
  createTier,
  fetchTitles,
  setOrder,
})(Tier);
