import React, { Component } from 'react';
import axios from 'axios';
import InstagramFeed from '../../../components/instagram/InstagramFeed';
import ContentModal from '../../../components/instagram/ContentModal';

export default class InstagramFeedContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            instagramPosts: [],
            carouselPosts: [],
            carouselPost: null,
            index: null,
            post: null,
            mediaWidth: null,
            mediaHeight: null,
            carouselPostIndex: 0,
            numberOfCarouselPosts: [],
            recentPostComments: [],
            loading: true,
            showModal: false,
            propHistory: []
        };
    }

    fetchInstagramApiData = () => {
        const profileId = process.env.REACT_APP_INSTAGRAM_USER_ID;
        const accessToken = process.env.REACT_APP_INSTAGRAM_API;
        const instagramApi = `https://api.instagram.com/v1/users/${profileId}/media/recent/?access_token=${accessToken}`;

        axios(instagramApi)
            .then(response => {
                const instagramApiData = response.data.data;

                this.setState({
                    instagramPosts: instagramApiData,
                    loading: false
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    openInstagramPostContentModal = (value, index) => {
        const { history } = this.props;

        this.setState({
            index: index,
            post: value,
            propHistory: history
        });

        this.toggleClassHandler(true);
        this.postTypeHandler(value, index);
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
                numberOfCarouselPosts: carouselPostsFiltered.carousel_media
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
                mediaHeight: value.images.standard_resolution.height
            });

            this.getPostRecentComments(value);
        }

        if (value.type === "video") {
            this.setState({
                mediaWidth: value.images.standard_resolution.width || value.videos.standard_resolution.width,
                mediaHeight: value.images.standard_resolution.height || value.videos.standard_resolution.height
            });

            this.getPostRecentComments(value);
        }

        if (value.type === "image") {
            this.setState({
                mediaWidth: value.images.standard_resolution.width,
                mediaHeight: value.images.standard_resolution.height
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
                    recentPostComments: postComments,
                    showModal: true
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    getNextPost = () => {
        const { index, instagramPosts } = this.state;
        const { history } = this.props;

        let indexState = index;
        let nextPostIndex = index === instagramPosts.length - 1 ? indexState = 0 : indexState = index + 1;
        let nextPostValue = instagramPosts[nextPostIndex];

        history.push("/instagram/"+nextPostValue.id+"/?taken-by="+nextPostValue.user.username);

        this.setState({
            index: indexState,
            post: nextPostValue,
            showModal: true,
            propHistory: history
        });

        this.postTypeHandler(nextPostValue, nextPostIndex);
    }

    getPreviousPost = () => {
        const { index, instagramPosts } = this.state;
        const { history } = this.props;

        let indexState = index;
        let prevPostIndex = index === 0 ? indexState = instagramPosts.length - 1 : indexState = index - 1;
        let prevPostValue = instagramPosts[prevPostIndex];

        history.push("/instagram/"+prevPostValue.id+"/?taken-by="+prevPostValue.user.username);

        this.setState({
            index: indexState,
            post: prevPostValue,
            showModal: true,
            propHistory: history
        });

        this.postTypeHandler(prevPostValue, prevPostIndex);
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

    closeInstagramPost = (e) => {
        const { history } = this.props;

        e.stopPropagation();

        history.push('/');

        this.setState({
            post: null,
            index: null,
            showModal: false,
            mediaWidth: null,
            mediaHeight: null,
            carouselPost: null,
            carouselPostIndex: 0,
            numberOfCarouselPosts: [],
            recentPostComments: [],
            propHistory: []
        });

        this.toggleClassHandler(false);
    }

    toggleClassHandler = (isModalVisible) => {
        const html = document.getElementsByTagName("html")[0];

        html.setAttribute("class", `${isModalVisible ? "modalVisible" : ""}`);
    }

    componentDidMount() {
        this.fetchInstagramApiData();
    }

    render() {
        const { loading, showModal, instagramPosts, carouselPosts, carouselPost, post, index,
                carouselPostIndex, numberOfCarouselPosts, mediaWidth, mediaHeight,
                propHistory, recentPostComments } = this.state;

        return (
            <div className="Instagram">
            	<div className="instagramFeed">
    				<div className="container-lg">
    					<span className="title">A Simple Instagram Media Viewer</span>
                        <span className="sub">Similar to the web version of Instagram.com, click on a thumbnail to view it in the modal pop up window. From there you can view the next post as well as the previous post. If the post is a carousel, you'll see the dots at the bottom of the image as well as additional "next" and "previous" buttons within the edges of the image/carousel. If the post is a video, you can click to play the video. Video sounds are muted by default, however if you click the unmute button on the top right of the video, you'll enable the sound. Each post has a dedicated media page for when a user is linked directly to the post. All Autoplaying video thumbnails will only play while visible in the viewport.</span>
            			<InstagramFeed
                            post={post}
                            index={index}
                            loading={loading}
                            showModal={showModal}
                            propHistory={propHistory}
                            instagramPosts={instagramPosts}
                            openInstagramPostContentModal={this.openInstagramPostContentModal}
                            />
            		</div>
            	</div>
                {
                    !showModal ? <div></div> :
                    <ContentModal
                        post={post}
                        index={index}
                        loading={loading}
                        showModal={showModal}
                        mediaWidth={mediaWidth}
                        mediaHeight={mediaHeight}
                        carouselPost={carouselPost}
                        carouselPosts={carouselPosts}
                        carouselPostIndex={carouselPostIndex}
                        numberOfCarouselPosts={numberOfCarouselPosts}
                        closeInstagramPost={this.closeInstagramPost}
                        getNextCarouselPost={this.getNextCarouselPost}
                        getPreviousCarouselPost={this.getPreviousCarouselPost}
                        getNextPost={this.getNextPost}
                        getPreviousPost={this.getPreviousPost}
                        recentPostComments={recentPostComments}
                        propHistory={propHistory}
                        />
                }
            </div>
        );
    }
}
