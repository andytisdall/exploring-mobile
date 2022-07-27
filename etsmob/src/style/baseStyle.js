import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  background: {
    backgroundColor: 'rgb(56, 56, 56)',
  },
  container: {
    paddingHorizontal: 8,
    flex: 1,
  },
  headerColor: {
    color: '#65d478',
  },
  h1: {
    fontSize: 33,
    margin: 10,
    color: 'white',
  },
  h2: {
    fontSize: 25,
    color: 'rgb(227, 210, 255)',
  },
  h3: {
    fontSize: 20,
    paddingVertical: 5,
  },
  h5: {
    fontSize: 15,
    letterSpacing: 0.5,
    color: 'rgb(248, 147, 240)',
  },
  marqee: {
    alignItems: 'center',
    minHeight: 50,
    flexDirection: 'row',
  },
  tier: {
    padding: 1,
    borderBottomColor: 'rgb(72, 145, 255)',
    borderBottomWidth: 1,
  },
  arrow: {
    height: 30,
    width: 30,
    paddingBottom: 1,
  },
  text: {
    fontSize: 13,
    color: 'rgb(212, 234, 255)',
    marginRight: 10,
  },
  redBorder: {
    borderColor: 'red',
    borderWidth: 1,
  },
});
