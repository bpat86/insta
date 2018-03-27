import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

export default class ContentModal extends Component {
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
        const { showModal } = this.props;
        const videoTag = e.currentTarget.children[0].children[0];
        const muteBtn = e.currentTarget.children[0].children[0].nextSibling;

        if (videoTag.tagName.toLowerCase() !== 'video') return false;
        if (e.target === muteBtn) return false;

        if (! isPlaying && showModal) {
            this.playVideo(videoTag);
        } else {
            this.pauseVideo(videoTag);
        }
    }

    getContentModal = () => {
        const { buttonContainerInlineStyle } = this.state;
        const { post, recentPostComments, getPreviousPost, getNextPost, closeInstagramPost } = this.props;

        return (
            <div>
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
                            {
                                !post.location ? null :
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
                            <Link
                                title="View other comments on Instagram.com"
                                target="blank"
                                to={post.link}
                                >
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
                            </Link>
                            <Link
                                title="View on Instagram.com"
                                className="button"
                                target="blank"
                                to={post.link}
                                >
                                View on Instagram.com
                            </Link>
                        </div>
                    </div>
                </article>
                <div className="buttonContainer">
                    <div
                        title="close"
                        className="closeButton"
                        onClick={closeInstagramPost}
                        >
                        <button>
                            <svg viewBox="0 0 40 40"><filter id="blur-filter" x="-10" y="-10" width="140" height="140"><feGaussianBlur in="SourceGraphic" stdDeviation="1.25"></feGaussianBlur></filter><path className="shadow" fill="none" strokeWidth="4" strokeMiterlimit="10" stroke="#000" d="M 9,9 L 31,31 M 31,9 L 9,31"></path><path className="closeX" d="M 10,10 L 30,30 M 30,10 L 10,30"></path></svg>
                        </button>
                    </div>
                    <div
                        className="buttons"
                        style={buttonContainerInlineStyle}
                        >
                        <div
                            title="Previous Post"
                            className={"prevButton"}
                            onClick={getPreviousPost}
                            >
                            <i className="fa fa-angle-left" aria-hidden="true"></i>
                        </div>
                        <div
                            title="Next Post"
                            className={"nextButton"}
                            onClick={getNextPost}
                            >
                            <i className="fa fa-angle-right" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    getPostMedia = () => {
        const { isPlaying, isMuted, mediaInlineStyle, buttonContainerInlineStyle } = this.state;
        const { post, carouselPostIndex, numberOfCarouselPosts, getPreviousCarouselPost,
                getNextCarouselPost } = this.props;
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
                            style={buttonContainerInlineStyle}
                            >
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
                        title={`${isPlaying ? "pause" : "play"}`}
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

    componentDidMount() {
        this.resetVideo();
        this.getMediaDimensions();
    }

    componentWillUpdate(nextProps) {
        const { index, carouselPostIndex } = this.props;

        if (index !== nextProps.index) {
            this.resetVideo();
            this.getMediaDimensions();
        }

        if (carouselPostIndex !== nextProps.carouselPostIndex) {
            this.resetVideo();
        }
    }

    componentDidUpdate(prevProps) {
        const { index, carouselPostIndex } = this.props;

        if (index !== prevProps.index) {
            this.resetVideo();
            this.getMediaDimensions();
        }

        if (carouselPostIndex !== prevProps.carouselPostIndex) {
            this.resetVideo();
        }
    }

	render() {
        const { closeInstagramPost } = this.props;

        return (
            <div>
                <div className="LightBox">
                    <div className="contentModalContainer">
                        { this.getContentModal() }
                        <div
                            className="contentModalBackground"
                            onClick={closeInstagramPost}
                            >
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
