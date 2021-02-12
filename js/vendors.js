export default function Vendors(vendorCallbacks = {}) {
	const vendors = {
		gsap: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.0/gsap.min.js',
		gsapScrollToPlugin: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.0/ScrollToPlugin.min.js',
		scrollSwipe: './js/scroll-swipe.js',
	};

	Object.entries(vendors).forEach(([key, url]) => {
		const script = document.createElement('SCRIPT');
		// script.setAttribute('async', true);
		script.src = url;
		document.body.appendChild(script);

		if ( key in vendorCallbacks ) {
			const callback = vendorCallbacks[key];
			let vendorCheckInterval = setInterval(() => {
				const done = callback();

				// Stop callback check if done
				if ( done ) { clearInterval(vendorCheckInterval) };
			}, 100);
		}
	});
}