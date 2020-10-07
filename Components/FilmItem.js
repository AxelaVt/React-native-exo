import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native'
import { getImageFromApi } from '../API/TMDBApi'

class FilmItem extends React.Component {

  _displayFavoriteImage() {
    if (this.props.isFilmFavorite) {
      // Si la props isFilmFavorite vaut true, on affiche le 🖤
      return (
        <Image
          style={styles.favorite_image}
          source={require('../Images/favorite.png')}
        />
      )
    }
  }

  render() {
    console.log(this.props);
    // const film = this.props.film
    // const displayDetailForFilm = this.props.displayDetailForFilm
    const {film, displayDetailForFilm} = this.props
    return (
      <TouchableOpacity
        onPress={() => displayDetailForFilm(film.id)}
        style={styles.main_container}>
        <Image
          style={styles.image}
          source={{uri: getImageFromApi(film.poster_path)}}
        />
        <View style={styles.contentView}>
          <View style={styles.headerView}>
            <Text style={styles.title_text}>{film.title}</Text>
            <Text style={styles.vote}>{film.vote_average}</Text>
          </View>
          <View style={styles.descriptionView}>
          <Text style={styles.description_text} numberOfLines={6}>{film.overview}</Text>
          </View>
          <View style={styles.dateView}><Text style={styles.date_text}>Sorti le {film.release_date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    height: 190,
    flexDirection: 'row',
    marginTop: 2
  },
  image: {
    height: 180,
    width: 120,
    margin: 5,
    backgroundColor: 'gray'
  },
  contentView: {
    flex: 1,
    margin: 5
  },
  descriptionView: {
    backgroundColor: 'pink',
    flex: 5
  },
  description_text: {
    fontStyle: 'italic',
    color: '#666666'
  },
  headerView: {
    flexDirection: 'row'
  },
  dateView: {
    backgroundColor: 'green',
    flex: 1
  },
  date_text: {
    textAlign: 'right',
    fontStyle: 'italic',
    fontSize: 14
  },
  title_text: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
    paddingRight: 2
  },
  vote: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'right',
    flex: 1
  }
})

export default FilmItem
