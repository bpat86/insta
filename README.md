# Insta
This is a simple Instagram media viewer built with [React.js](https://github.com/facebookincubator/create-react-app) and React Router Dom.

![alt text][gif]
[gif]: https://thumbs.gfycat.com/DenseDelectableGoldenretriever-size_restricted.gif "Insta"

# Set up
* Register your app in the [Instagram Developer's section](https://www.instagram.com/developer/) to receive an API access token
* Rename .env-placeholder to .env in the project's root
* Paste your access token into .env
* npm start

# Functionality basics
Similar to viewing your own user profile via the desktop web version of Instagram.com, click on a thumbnail to view it in the modal pop up window. From there you can view the next post as well as the previous post. If the post is a carousel, you'll see the dots at the bottom of the image as well as additional "next" and "previous" buttons within the edges of the image/carousel. If the post is a video, you can click to play the video. Video sounds are muted by default, however if you click the unmute button on the top right of the video, you'll enable the sound. Each post has a dedicated media page for when a user is linked directly to the post. All Autoplaying video thumbnails will only play while visible in the viewport.
