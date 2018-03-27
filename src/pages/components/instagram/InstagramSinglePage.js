import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Loader from '../../components/LoadingSpinner';

export default class InstagramSinglePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false,
            isMuted: true,
            mediaInlineStyle: null,
            buttonContainerInlineStyle: null
        };
    }

    parseDate = (value) => {
        const parsedDate = new Date(1000*value);
        var monthAndDay = moment(parsedDate).format("MMMM D, YYYY");

        return monthAndDay;
    }

    calculateMediaAspectRatio = (srcWidth, srcHeight, maxWidth, maxHeight) => {
        const ratio = Math.min(maxWidth/srcWidth, maxHeight/srcHeight);

        return { width: srcWidth*ratio, height: srcHeight*ratio };
    }

    getMediaDimensions = () => {
        const { mediaWidth, mediaHeight } = this.props;

        const square = mediaWidth === mediaHeight;
        const maxMediaWidth = (! square && mediaHeight >= 640) ? mediaWidth - 120 : 620;
        const maxMediaHeight = (! square && mediaHeight >= 640) ? mediaHeight - 120 : 620;
        const mediaDimensions = this.calculateMediaAspectRatio(mediaWidth, mediaHeight, maxMediaWidth, maxMediaHeight);
        const buttonContainerDimensions = {
            height: mediaDimensions.height
        }

        this.setState({
            mediaInlineStyle: mediaDimensions,
            buttonContainerInlineStyle: buttonContainerDimensions
        });
    }

    resetVideo = (videoTag) => {
        this.setState({
            isPlaying: false,
            isMuted: true
        });

        if (! videoTag) return false;

        videoTag.classList.remove("playing");
        videoTag.muted = false;
        videoTag.loop = false;
    }

    pauseVideo = (videoTag) => {
        this.setState({
            isPlaying: false
        });

        if (! videoTag) return false;

        videoTag.classList.remove("playing");
        videoTag.muted = false;
        videoTag.loop = false;
        videoTag.pause();
    }

    playVideo = (videoTag) => {
        const { isMuted } = this.state;

        this.setState({
            isPlaying: true
        });

        if (! videoTag) return false;

        videoTag.classList.add("playing");
        videoTag.muted = isMuted;
        videoTag.loop = true;
        videoTag.play();
    }

    muteVideoToggle = (e) => {
        const videoTag = e.target.parentNode.children[0];

        this.setState({
            isMuted: !this.state.isMuted
        });

        videoTag.muted = !this.state.isMuted;
    }

    playVideoHandler = (e) => {
        const { isPlaying } = this.state;
        const videoTag = e.currentTarget.children[0].children[0];
        const muteBtn = e.currentTarget.children[0].children[0].nextSibling;

        if (videoTag.tagName.toLowerCase() !== 'video') return false;
        if (e.target === muteBtn) return false;

        if (! isPlaying) {
            this.playVideo(videoTag);
        } else {
            this.pauseVideo(videoTag);
        }
    }

    getPostMedia = () => {
        const { isPlaying, mediaInlineStyle, buttonContainerInlineStyle, isMuted } = this.state;

        const { post, carouselPostIndex, numberOfCarouselPosts,
                getPreviousCarouselPost, getNextCarouselPost } = this.props;

        let hidePlayBtnClass = isPlaying ? "hide" : "";

        if (post.type === "carousel") {
            return (
                <div>
                    <div
                        className="carouselContainer"
                        onClick={(e) => this.playVideoHandler(e)}
                        >
                        { this.getCarouselPostMedia() }
                        <div
                            className="buttons"
                            style={buttonContainerInlineStyle}>
                            <div
                                className={"prevButton"}
                                onClick={() => getPreviousCarouselPost()}
                                >
                                <i className="fa fa-angle-left" aria-hidden="true"></i>
                            </div>
                            <div
                                className={"nextButton"}
                                onClick={() => getNextCarouselPost()}
                                >
                                <i className="fa fa-angle-right" aria-hidden="true"></i>
                            </div>
                        </div>
                        <ul className="dots">
                            {
                                numberOfCarouselPosts.map((index, i) =>
                                    <li
                                        key={i}
                                        className={i === carouselPostIndex ? "active" : ""}
                                        >
                                        <button></button>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
            );
        }
        if (post.type === "video") {
            return (
                <div>
                    <div
                        className="videoContainer"
                        onClick={(e) => this.playVideoHandler(e)}
                        >
                        <div
                            style={mediaInlineStyle}
                            className="videoImageContainer"
                            >
                            <video
                                poster={post.images.standard_resolution.url}
                                src={post.videos.standard_resolution.url}
                                type="video/mp4"
                                playsInline
                                preload={true.toString()}
                                >
                            </video>
                            {
                                isMuted ?
                                <div
                                    title="unmute"
                                    className="muteButton"
                                    onClick={(e) => this.muteVideoToggle(e)}
                                    >
                                </div> :
                                <div
                                    title="mute"
                                    className="unmuteButton"
                                    onClick={(e) => this.muteVideoToggle(e)}
                                    >
                                </div>
                            }
                            <img
                                alt={post.caption ? post.caption.text : null}
                                src={post.images.standard_resolution.url}
                                />
                            <div className={`videoControlsSprite ${hidePlayBtnClass}`}></div>
                        </div>
                    </div>
                </div>
            );
        }
        if (post.type === "image") {
            return (
                <div className="mediaContainer">
                    <div
                        style={mediaInlineStyle}
                        className="imageContainer"
                        >
                        <img
                            alt={post.caption ? post.caption.text : null}
                            src={post.images.standard_resolution.url}
                            />
                    </div>
                </div>
            );
        }
    }

    getCarouselPostMedia = () => {
        const { isPlaying, mediaInlineStyle, isMuted } = this.state;
        const { post, carouselPost } = this.props;

        let hidePlayBtnClass = isPlaying ? "hide" : "";

        if (carouselPost.type === "image") {
            return (
                <div
                    style={mediaInlineStyle}
                    className="carouselMediaContainer"
                    >
                    <img alt={post.caption ? post.caption.text : null} src={carouselPost.images.standard_resolution.url} />
                </div>
            );
        }
        if (carouselPost.type === "video") {
            return (
                <div
                    style={mediaInlineStyle}
                    className="carouselMediaContainer"
                    >
                    <video
                        src={carouselPost.videos.standard_resolution.url}
                        type="video/mp4"
                        playsInline
                        preload={true.toString()}
                        >
                    </video>
                    {
                        isMuted ?
                        <div
                            title="unmute"
                            className="muteButton"
                            onClick={(e) => this.muteVideoToggle(e)}
                            >
                        </div> :
                        <div
                            title="mute"
                            className="unmuteButton"
                            onClick={(e) => this.muteVideoToggle(e)}
                            >
                        </div>
                    }
                    <div className={`videoControlsSprite ${hidePlayBtnClass}`}></div>
                </div>
            );
        }
    }

    componentDidUpdate(prevProps) {
        const { loading } = this.props;

        if (loading !== prevProps.loading) {
            this.getMediaDimensions();

            window.scrollTo(0, 0);
        }
    }

    render(){
        const { post, loading, recentPostComments } = this.props;

        return (
            <div>
                {
                    loading ? <Loader /> :
                    <div className="InstagramSinglePage">
                        <Link
                            title="Go back to the main page"
                            className="backButton"
                            to="/">
                            Go Back
                        </Link>
                        <article
                            id={post.id}
                            className="contentModal"
                            >
                            <div className="mainContent">
                                <div className="mediaContainer">
                                    { this.getPostMedia() }
                                </div>
                            </div>
                            <div className="contentSideBar">
                                <div className="sideBarInfo">
                                    <header className="profileInfo">
                                        <Link
                                            title="View on Instagram.com"
                                            target="blank"
                                            to={post.link}
                                            >
                                            <div className="profilePicture">
                                                <img src={post.user.profile_picture} alt={post.user.username} />
                                            </div>
                                        </Link>
                                        <Link
                                            title="View on Instagram.com"
                                            target="blank"
                                            to={post.link}
                                            >
                                            <div className="username">{post.user.username}</div>
                                        </Link>
                                    </header>
                                    <Link
                                        title="View on Instagram.com"
                                        target="blank"
                                        to={post.link}
                                        >
                                        <div className="postedDate">
                                            { this.parseDate(post.created_time) }
                                        </div>
                                    </Link>
                                    { !post.location ? null :
                                        <Link
                                            title="View on Instagram.com"
                                            target="blank"
                                            to={post.link}
                                            >
                                            <div className="postedLocation">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                { post.location.name }
                                            </div>
                                        </Link>
                                    }
                                    <Link
                                        title="View on Instagram.com"
                                        target="blank"
                                        to={post.link}
                                        >
                                        <h5 className="likes">
                                            <i className="fa fa-heart" aria-hidden="true"></i> {post.likes.count}
                                        </h5>
                                        <hr/>
                                    </Link>
                                    <Link
                                        title="View on Instagram.com"
                                        target="blank"
                                        to={post.link}
                                        >
                                        {
                                            !post.caption ? null :
                                            <div>
                                                <div className="username">
                                                    {post.user.username}
                                                </div>
                                                <div className="caption">
                                                    {post.caption.text}
                                                </div>
                                            </div>
                                        }
                                    </Link>
                                    {
                                        !recentPostComments ? null :
                                        <div>
                                            <hr/>
                                            <div className="username">
                                                {post.user.username}
                                            </div>
                                            <div className="comment">
                                                {recentPostComments.text}
                                            </div>
                                        </div>
                                    }
                                    <Link
                                        target="blank"
                                        className="button"
                                        to={post.link}
                                        >
                                        View on Instagram.com
                                    </Link>
                                </div>
                            </div>
                        </article>
                    </div>
                }
            </div>
        )
    }
}
