export default function VimeoVideo() {
	const vimeoVideoIframes = Array.from(document.querySelectorAll('iframe[src*="player.vimeo.com"]'));

	vimeoVideoIframes.forEach(vimeoIframe => {

		// Reference vimeo video player
		const player = new Vimeo.Player(vimeoIframe);

		// // Create observable that will control video playback on viewport entry
		// const obs = new IntersectionObserver(([{ isIntersecting }]) => {
		// 	if ( isIntersecting ) {
		// 		player.play();
		// 	}
		// 	else {
		// 		player.pause();
		// 	}
		// });

		// obs.observe(vimeoIframe);

		vimeoIframe.addEventListener('click', () => player.play());

    player.on('play', function() {
      console.log('Played the video');
    });

    player.getVideoTitle().then(function(title) {
      console.log('title:', title);
    });

	});
}