import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';
import Loader from '../../components/LoadingSpinner';

export default class InstagramFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false
        };
    }

    getPostMedia = (post) => {
        if (post.type === "carousel") {
            return (
                <div className="carouselContainer">
                    <img
                        alt={post.caption ? post.caption.text : null}
                        src={post.images.standard_resolution.url}
                        />
                    <div className="carouselThumbnailControlsSprite"></div>
                </div>
            );
        }
        if (post.type === "video") {
            return (
                <div className="videoContainer">
                    <video
                        ref="video"
                        poster={post.images.standard_resolution.url}
                        src={post.videos.low_resolution.url}
                        type="video/mp4"
                        playsInline
                        preload={true.toString()}
                        >
                    </video>
                    <div className="videoThumbnailControlsSprite"></div>
                </div>
            );
        }
        if (post.type === "image") {
            return (
                <img
                    alt={post.caption ? post.caption.text : null}
                    src={post.images.standard_resolution.url}
                    />
            );
        }
    }

    prepareVideosForAutoPlay = () => {
        // Wait for videos to render before doing anything
        if (! this.refs.video) return false;

        let videoElement = document.querySelectorAll('.instagramFeedContainer .videoContainer');
        videoElement = Array.prototype.slice.call(videoElement);

        videoElement.forEach((element, index) => {
            this.autoPlayVideoHandler(element, index);
        });
    }

    determineIfVideoIsInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        const doc = document.documentElement;
        const top = rect.top + ((window.innerHeight || doc.clientHeight) * 0.3) >= 0;
        const left = rect.left >= 0;
        const bottom = rect.bottom - ((window.innerHeight || doc.clientHeight) * 0.3) <= (window.innerHeight || doc.clientHeight);
        const right = rect.right <= (window.innerWidth || doc.clientWidth);

        return top && left && bottom && right;
    }

    autoPlayVideoHandler = (element, index) => {
        const { showModal } = this.props;
        const videoTag = element.children[0];
        const videoIsdetermineIfVideoIsInViewport = this.determineIfVideoIsInViewport(videoTag);

        if (! showModal && videoIsdetermineIfVideoIsInViewport) {
            this.playVideo(videoTag);
        } else {
            this.pauseVideo(videoTag);
        }
    }

    playVideo = (videoTag) => {
        this.setState({
            isPlaying: true
        });

        videoTag.classList.add("playing");
        videoTag.muted = true;
        videoTag.loop = true;
        videoTag.play();
    }

    pauseVideo = (videoTag) => {
        this.setState({
            isPlaying: false
        });

        videoTag.classList.remove("playing");
        videoTag.muted = false;
        videoTag.loop = false;
        videoTag.pause();
    }

    addScrollListener = () => {
        const debouncedprepareVideosForAutoPlayFunction = debounce(this.prepareVideosForAutoPlay, 500, { "maxWait": 1000 });

        window.addEventListener("scroll", debouncedprepareVideosForAutoPlayFunction, false);
    }

    removeScrollListener = () => {
        window.removeEventListener("scroll", this.prepareVideosForAutoPlay, false);
    }

    componentDidUpdate(prevProps) {
        const { showModal } = this.props;

        if (showModal !== prevProps.showModal) {
            this.prepareVideosForAutoPlay();
        }
    }

    componentDidMount() {
        this.addScrollListener();
    }

    componentWillUnmount() {
        this.removeScrollListener();
    }

    render() {
        const { loading, instagramPosts, openInstagramPostContentModal } = this.props;

        return (
            <div>
                {
                    loading ? <Loader /> :
                	<div className="instagramFeedContainer">
        				{
        					instagramPosts.map((post, index) =>
        					    <div
                                    key={index}
                                    id={post.id}
                                    className="post"
                                    >
        					    	<Link
                                        className="postLinks"
                                        to={{pathname: `/instagram/${post.id}/?taken-by=${post.user.username}`}}
                                        title={post.caption ? post.caption.text : null}
                                        onClick={() => openInstagramPostContentModal(post, index)}
                                        >
        						        <div className="content">
        						        	<div className="info">
        				                    	<h3 className="caption">
                                                    {post.caption ? post.caption.text : null}
                                                </h3>
        				                    	<h5 className="likes">
                                                    <i className="fa fa-heart" aria-hidden="true"></i>
                                                    {post.likes.count}
                                                </h5>
        				                    </div>
        				                    { this.getPostMedia(post) }
        				                </div>
        				            </Link>
        						</div>
        					)
        				}
        			</div>
                }
            </div>
        );
    }
}
