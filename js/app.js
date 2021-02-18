import Vendors from './vendors.js';
import VimeoVideo from './vimeo-video.js';
import SnapScroll from './snap-scroll.js';
import SwiperOverrides from './swiper-overrides.js';

Vendors({
	// Callback must return TRUE to stop check
	gsap: () => {
		if ( 'gsap' in window ) {
			// Register GSAP Plugins
			gsap.registerPlugin(ScrollToPlugin);

			return true;
		}
	},
	// scrollSwipe: () => {
	// 	if ( 'ScrollSwipe' in window && 'gsap' in window ) {
	// 		SnapScroll.init();
	// 		return true;
	// 	}
	// }
});

VimeoVideo();
SwiperOverrides.init();

window.app = Object.assign(window.app || {}, {
	initSnapScroll() {
		// SnapScroll.init();
	}
})