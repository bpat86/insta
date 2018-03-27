# Insta
This is a simple Instagram media viewer built with [React.js](https://github.com/facebookincubator/create-react-app) and React Router Dom.

# Functionality basics
Begin by signing up for a valid Instagram API access token and adding it to the .env file in the root folder after renaming it to .env.

Similar to the web version of Instagram.com, click on a thumbnail to view it in the modal pop up window. From there you can view the next post as well as the previous post. If the post is a carousel, you'll see the dots at the bottom of the image as well as additional "next" and "previous" buttons within the edge of the image. If the post is a video, you can click play the video. Video sounds are muted by default, however if you click the unmute button on the top right of the video, you'll enable the sound. Each post has a dedicated media page for when a user is linked directly to the post. All Autoplaying video thumbnails will only play while visible in the viewport.
