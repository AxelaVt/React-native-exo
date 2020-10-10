// Components/FilmDetail.js 

import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Image, Button, TouchableOpacity, Share, Platform } from 'react-native'
import { getFilmDetailFromApi } from '../API/TMDBApi'
import { getImageFromApi } from '../API/TMDBApi'
import moment from "moment"
import numeral from "numeral"
import { connect } from 'react-redux'
import EnlargeShrink from '../Animations/EnlargeShrink'


class FilmDetail extends React.Component {


    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state
        // On accède à la fonction shareFilm et au film via les paramètres qu'on a ajouté à la navigation
        if (params.film != undefined && Platform.OS === 'ios') {
            return {
                // On a besoin d'afficher une image, il faut donc passe par une Touchable une fois de plus
                headerRight: <TouchableOpacity
                    style={styles.share_touchable_headerrightbutton}
                    onPress={() => params.shareFilm()}>
                    <Image
                        style={styles.share_image}
                        source={require('../Images/ic_share.png')} />
                </TouchableOpacity>
            }
        }
    }


    constructor(props) {
        super(props)
        this.state = {
            film: undefined,
            isLoading: false,
            currentDate: new Date(),
            markedDate: moment(new Date()).format("DD-MM-YYYY"),
            // Ne pas oublier de binder la fonction _shareFilm sinon, lorsqu'on va l'appeler depuis le headerRight de la navigation, this.state.film sera undefined et fera planter l'application
        }
        
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

    _displayFavoriteImage() {
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

    // Fonction pour faire passer la fonction _shareFilm et le film aux paramètres de la navigation. Ainsi on aura accès à ces données au moment de définir le headerRight
    _updateNavigationParams() {
        this.props.navigation.setParams({
            shareFilm: this._shareFilm,
            film: this.state.film
        })
    }
    _shareFilm() {
        const { film } = this.state
        Share.share({ title: film.title, message: film.overview })
    }

    componentDidMount() {
        const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.navigation.state.params.idFilm)
        if (favoriteFilmIndex !== -1) { // Film déjà dans nos favoris, on a déjà son détail
            // Pas besoin d'appeler l'API ici, on ajoute le détail stocké dans notre state global au state de notre component
            this.setState({
                film: this.props.favoritesFilm[favoriteFilmIndex]
            }, () => { this._updateNavigationParams() })
            return
        }
        // Le film n'est pas dans nos favoris, on n'a pas son détail
        // On appelle l'API pour récupérer son détail
        this.setState({ isLoading: true })
        getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
            this.setState({
                film: data,
                isLoading: false
            }, () => { this._updateNavigationParams() })
        })
    }


    
    _toggleFavorite() {
        const action = { type: "TOGGLE_FAVORITE", value: this.state.film }
        this.props.dispatch(action)
    }

    componentDidUpdate() {
        console.log("componentDidUpdate : ")
        console.log(this.props.favoritesFilm)
    }

    

    _displayFavoriteImage() {
        var sourceImage = require('../Images/notfavorite.png')
        var shouldEnlarge = false // Par défaut, si le film n'est pas en favoris, on veut qu'au clic sur le bouton, celui-ci s'agrandisse => shouldEnlarge à true
        if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
            sourceImage = require('../Images/favorite.png')
            shouldEnlarge = true // Si le film est dans les favoris, on veut qu'au clic sur le bouton, celui-ci se rétrécisse => shouldEnlarge à false
        }
        return (
            <EnlargeShrink
                shouldEnlarge={shouldEnlarge}>
                <Image
                    style={styles.favorite_image}
                    source={sourceImage}
                />
            </EnlargeShrink>
        )
    }

    _displayFilm() {
        if (this.state.film != undefined) {
            return (
                <ScrollView style={styles.scrollview_container}>
                    <EnlargeShrink>
                    <Image
                        style={styles.image}
                        source={{ uri: getImageFromApi(this.state.film.backdrop_path) }}
                    />
                    </EnlargeShrink>
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

    _displayFloatingActionButton() {
        const { film } = this.state
        if (film != undefined && Platform.OS === 'android') { // Uniquement sur Android et lorsque le film est chargé
            return (
                <TouchableOpacity
                    style={styles.share_touchable_floatingactionbutton}
                    onPress={() => this._shareFilm()}>
                    <Image
                        style={styles.share_image}
                        source={require('../Images/ic_share.png')} />
                </TouchableOpacity>
            )
        }
    }

    render() {
        console.log(this.props)
        return (
            <View style={styles.main_container}>
                {this._displayLoading()}
                {this._displayFilm()}
                {this._displayFloatingActionButton()}
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
        flex:1,
        width: null,
        height: null
    },
    share_touchable_floatingactionbutton: {
        position: 'absolute',
        width: 60,
        height: 60,
        right: 30,
        bottom: 30,
        borderRadius: 30,
        backgroundColor: '#e91e63',
        justifyContent: 'center',
        alignItems: 'center'
    },
    share_image: {
        width: 30,
        height: 30
    },
    share_touchable_headerrightbutton: {
        marginRight: 8
    }
})
// on mappe le state de l'appli avec les components de FilmDetail et on specifie les éléments que l'on veut recup

const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: (action) => { dispatch(action) }
    }
}

//On connecte le state de l'application avec les props du component FilmDetail.
export default connect(mapStateToProps, mapDispatchToProps)(FilmDetail)
