import React, { Component } from 'react';
import axios from 'axios';
import InstagramSinglePage from '../../../components/instagram/InstagramSinglePage';

export default class InstagramSinglePageContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            instagramPosts: [],
            carouselPosts: [],
            carouselPost: null,
            videoPosts: [],
            imagePosts: [],
            index: null,
            post: null,
            mediaWidth: null,
            mediaHeight: null,
            carouselPostIndex: 0,
            numberOfCarouselPosts: [],
            recentPostComments: [],
            propHistory: []
        };
    }

    getPostIndex = (value, arr, param) => {
        for(var i = 0; i < arr.length; i++){
            if(arr[i][param] === value) {
                return i;
            }
        }

        return -1; // To handle the case where the value doesn't exist
    }

    fetchInstagramApiData = () => {
        const profileId = process.env.REACT_APP_INSTAGRAM_USER_ID;
        const accessToken = process.env.REACT_APP_INSTAGRAM_API;
        const instagramApi = `https://api.instagram.com/v1/users/${profileId}/media/recent/?access_token=${accessToken}`;

        axios(instagramApi)
            .then(response => {
                const instagramApiData = response.data.data;
                const getPostIdFromUrlParam = window.location.pathname.split('/')[2]; // returns Id
                const postIndex = this.getPostIndex(getPostIdFromUrlParam, instagramApiData, 'id'); // returns index

                this.setState({
                    instagramPosts: instagramApiData,
                    post: instagramApiData[postIndex]
                });

                this.postTypeHandler(instagramApiData[postIndex], postIndex);
            })
            .catch(error => {
                console.log(error);
            });
    }

    postTypeHandler = (value, index) => {
        const { instagramPosts } = this.state;

        if (value.type === "carousel") {
            const carouselPostsFiltered =
                instagramPosts
                    .map(carousel => carousel)
                        .filter(post => post.id === value.id)[0];

            const carouselPostMedia =
                instagramPosts
                    .map(carousel => carousel)
                        .filter(post => post.id === value.id)
                            .map(media => media.carousel_media)[0];

            this.setState({
                carouselPost: carouselPostMedia[0],
                carouselPosts: carouselPostMedia,
                numberOfCarouselPosts: carouselPostsFiltered.carousel_media,
            });

            this.getPostDimensions(value, index);
        }

        if (value.type === "video") {
            this.getPostDimensions(value, index);
        }

        if (value.type === "image") {
            this.getPostDimensions(value, index);
        }
    }

    getPostDimensions = (value, index) => {
        if (value.type === "carousel") {
            this.setState({
                mediaWidth: value.images.standard_resolution.width,
                mediaHeight: value.images.standard_resolution.height,
                loading: false
            });

            this.getPostRecentComments(value);
        }

        if (value.type === "video") {
            this.setState({
                mediaWidth: value.images.standard_resolution.width || value.videos.standard_resolution.width,
                mediaHeight: value.images.standard_resolution.height || value.videos.standard_resolution.height,
                loading: false
            });

            this.getPostRecentComments(value);
        }

        if (value.type === "image") {
            this.setState({
                mediaWidth: value.images.standard_resolution.width,
                mediaHeight: value.images.standard_resolution.height,
                loading: false
            });

            this.getPostRecentComments(value);
        }
    }

    getPostRecentComments = (value) => {
        const accessToken = process.env.REACT_APP_INSTAGRAM_API;

        axios(`https://api.instagram.com/v1/media/${value.id}/comments?access_token=${accessToken}`)
            .then(response => {
                const postComments = response.data.data.map(comment => comment)[0];

                this.setState({
                    recentPostComments: postComments
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    getNextCarouselPost = () => {
        const { carouselPostIndex, carouselPosts } = this.state;
        const { history } = this.props;

        let carouselPostIndexState = carouselPostIndex;
        let nextPostInCarouselIndex = carouselPostIndex === carouselPosts.length - 1 ?
            carouselPostIndexState = 0 :
            carouselPostIndexState = carouselPostIndex + 1;

        this.setState({
            carouselPost: carouselPosts[nextPostInCarouselIndex],
            carouselPostIndex: carouselPostIndexState,
            carouselPosts: carouselPosts,
            propHistory: history
        });
    }

    getPreviousCarouselPost = () => {
        const { carouselPostIndex, carouselPosts } = this.state;
        const { history } = this.props;

        let carouselPostIndexState = carouselPostIndex;
        let prevPostInCarouselIndex = carouselPostIndex === 0 ?
            carouselPostIndexState = carouselPosts.length - 1 :
            carouselPostIndexState = carouselPostIndex - 1;

        this.setState({
            carouselPost: carouselPosts[prevPostInCarouselIndex],
            carouselPostIndex: carouselPostIndexState,
            carouselPosts: carouselPosts,
            propHistory: history
        });
    }

    componentDidMount() {
        this.fetchInstagramApiData();
    }

    render() {
        const { instagramPosts, carouselPost, carouselPosts, post, index, loading, propHistory,
                carouselPostIndex, numberOfCarouselPosts, mediaWidth, mediaHeight,
                recentPostComments } = this.state;

        return (
            <div>
                <div className="InstagramSinglePageContainer">
                    <InstagramSinglePage
                        post={post}
                        index={index}
                        loading={loading}
                        instagramPosts={instagramPosts}
                        carouselPosts={carouselPosts}
                        carouselPost={carouselPost}
                        mediaWidth={mediaWidth}
                        mediaHeight={mediaHeight}
                        carouselPostIndex={carouselPostIndex}
                        numberOfCarouselPosts={numberOfCarouselPosts}
                        getNextCarouselPost={this.getNextCarouselPost}
                        getPreviousCarouselPost={this.getPreviousCarouselPost}
                        recentPostComments={recentPostComments}
                        propHistory={propHistory}
                        />
                </div>
            </div>
        );
    }
}
