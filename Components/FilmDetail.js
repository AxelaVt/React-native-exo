// Components/FilmDetail.js 

import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Image, Button, TouchableOpacity } from 'react-native'
import { getFilmDetailFromApi } from '../API/TMDBApi'
import { getImageFromApi } from '../API/TMDBApi'
import moment from "moment"
import numeral from "numeral"
import { connect } from 'react-redux'


class FilmDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            film: undefined,
            isLoading: true,
            currentDate: new Date(),
            markedDate: moment(new Date()).format("DD-MM-YYYY")
        }
    }

    componentDidMount() {
        console.log("didMount")
        getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
            this.setState({
                film: data,
                isLoading: false
            })
        })
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }

    _toggleFavorite() {
        const action = { type: "TOGGLE_FAVORITE", value: this.state.film }
        this.props.dispatch(action)
    }

    componentDidUpdate() {
        console.log("componentDidUpdate : ")
        console.log(this.props.favoritesFilm)
    }

    _displayFavoriteImage(){
        var sourceImage = require('../Images/notfavorite.png')
        if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
            // Film dans nos favoris
            sourceImage = require('../Images/favorite.png')
        }
        return (
            <Image
                style={styles.favorite_image}
                source={sourceImage}
            />
        )
    }


    _displayFilm() {
        if (this.state.film != undefined) {
            return (
                <ScrollView style={styles.scrollview_container}>
                    <Image
                        style={styles.image}
                        source={{ uri: getImageFromApi(this.state.film.backdrop_path) }}
                    />
                    <Text style={styles.title} >{this.state.film.title}</Text>
                    <TouchableOpacity
                        style={styles.favorite_container}
                        onPress={() => this._toggleFavorite()}>
                        {this._displayFavoriteImage()}
                    </TouchableOpacity>
                    <View style={styles.descriptionView}>
                        <Text style={styles.description_text}>{this.state.film.overview}</Text>
                    </View>
                    <View style={styles.dateView}>
                        <Text style={styles.text}>Sorti le {moment(this.state.film.release_date).format("DD-MM-YYYY")}</Text>
                        <Text style={styles.text}>Note : {this.state.film.vote_average}</Text>
                        <Text style={styles.text}>Nombre de vote : {this.state.film.vote_count}</Text>
                        <Text style={styles.text}>Budget : {numeral(this.state.film.budget).format('0,0[.]00 $')}</Text>
                        <Text style={styles.text}>Genre(s) : 
                        {this.state.film.genres.map(function (genre) {
                        return genre.name;
                            }).join(" / ")}
                        </Text>
                        <Text style={styles.text}>Companie(s) : 
                        {this.state.film.production_companies.map(function (company) {
                            return company.name;
                            }).join(" / ")}
                        </Text>
                        
                    </View>
                    
                </ScrollView>
            )
        }
    }

    render() {
        console.log(this.props)
        return (
            <View style={styles.main_container}>
                {this._displayLoading()}
                {this._displayFilm()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        padding: 5
    },

    title:{
        fontWeight: 'bold',
        fontSize: 26,
        textAlign: 'center'
    },
    descriptionView: {
        flex: 1,
        marginBottom: 6
    },  
    image: {
        height: 180,
        width: 350,
        margin: 5,
        backgroundColor: 'gray'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 14
        
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollview_container: {
        flex: 1
    },
    favorite_container: {
        alignItems: 'center', // Alignement des components enfants sur l'axe secondaire, X ici
    },
    favorite_image: {
        width: 40,
        height: 40
    }
})
// on mappe le state de l'appli avec les components de FilmDetail et on specifie les éléments que l'on veut recup
const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//         dispatch: (action) => { dispatch(action) }
//     }
// }

//On connecte le state de l'application avec les props du component FilmDetail.
export default connect(mapStateToProps)(FilmDetail)
