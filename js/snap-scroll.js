import debounce from './debounce.js';

export default class SnapScroll {

	static init() {
		console.log('snap scroll init');
		// Prevent native scroll
		// document.documentElement.style.overflow = 'hidden !important';

		// The main scrolling container
		this.mainContainer = document.querySelector('main');

		const obs = new MutationObserver(this.applySnapScrollSections.bind(this));

		obs.observe(this.mainContainer, { subtree: true, childList: true });
	}

	static applySnapScrollSections() {
		const sections = Array.from(document.querySelectorAll('#hero,.vc_row,#project-nav'));

		// Will hold current section index
		this.currentSection = 0;

		// Filter only sections that has visible content (text,image,iframe,etc.)
		this.sections = sections.filter(section => (
			section.textContent.trim()
			|| section.querySelector('img,iframe,video')
		));

		// Set Initial row
		this.setInitialSectionInView();

		this.handleScroll();
		this.handleResize();
	}

	static handleScroll() {
		if ( 'ontouchstart' in document ) {
			this.scrollSwipe = new ScrollSwipe({
		    target: document.documentElement, // Element must be a single dom-node per ScrollSwipe Instance
		    scrollSensitivity: 0, // The lower the number, the more sensitive
		    touchSensitivity: 0, // The lower the number, the more senitive
		    // scrollPreventDefault: true, // prevent default option for scroll events
		    // touchPreventDefault: true, // prevent default option for touch events
		    scrollCb: debounce(this.scrollCallback.bind(this), 100, true),  // The action you wish to perform when a scroll reacts (details below)
		    touchCb: debounce(this.scrollCallback.bind(this), 100, true) // The action you wish to perform when a touch reacts (details below)
			});
		}
		else {
			window.addEventListener('mousewheel', debounce(this.onMouseWheel.bind(this), 50, true));
		}
	}

	static handleResize() {
		window.addEventListener('resize', debounce(this.onWindowResize.bind(this)));
	}

	static scrollCallback({ direction, intent }) {
		const windowHeight = window.innerHeight;
		const currentScroll = this.mainContainer.scrollTop;
		const scrollDirection = intent ? 'down' : 'up';

		// Handle vertical scroll only
		if ( direction === 'VERTICAL' ) {
			const currentSection = this.sections[this.currentSection];
			const sectionRect = currentSection.getBoundingClientRect();

			// -- WHEN SCROLL INTENT IS DOWN
			if ( scrollDirection === 'down' ) {
				console.log('scroll down');
				// If there's remaining part below the section, just scroll within
				if ( sectionRect.bottom > windowHeight ) {
					const scrollIncrement = (sectionRect.bottom - windowHeight < windowHeight) ? (sectionRect.bottom - windowHeight) : windowHeight;
					this.scrollToPx(currentScroll + scrollIncrement);
				}
				// Else, just go to next section
				else {
					this.scrollToSection(this.currentSection + 1, scrollDirection);
				}
			}
			// -- WHEN SCROLL INTENT IS UP
			else {
				console.log('scroll up');
				// If there's remaining part above the section, just scroll within
				if ( sectionRect.top < -1 ) {
					const scrollIncrement = (Math.abs(sectionRect.top) - windowHeight < windowHeight) ? sectionRect.top : windowHeight * -1;
					console.log('sectionRect.top',sectionRect.top);
					console.log({ scrollIncrement });
					this.scrollToPx(currentScroll + scrollIncrement);
				}
				// Else, just go to previous section
				else {
					this.scrollToSection(this.currentSection - 1, scrollDirection);
				}
			}
		}
	}

	static setInitialSectionInView() {
		const windowHeight = window.innerHeight;

		// Determine which section is in view
		this.sections.some((section,  index) => {
			const sectionRect = section.getBoundingClientRect();

			// Check if this section is within view
			if ( sectionRect.top < windowHeight && sectionRect.bottom > 0 ) {
				this.scrollToSection(index);

				// Must return true to break loop and stop checking for other sections
				return true;
			}
		});
	}

	static scrollToSection(sectionIndex, scrollDirection) {
		if ( this.sections[sectionIndex] ) {
			const windowHeight = window.innerHeight;

			this.currentSection = sectionIndex;

			const { top, bottom, height } = this.sections[sectionIndex].getBoundingClientRect();

			// If target section is fully visible in view, proceed to the next one instead
			if ( top >= 0 && bottom <= window.innerHeight ) {
				this.scrollToSection(sectionIndex + 1);
			}
			// If scroll direction is up and target section is long, just scroll into the bottom of section
			else if ( scrollDirection === 'up' && height > windowHeight ) {
				this.scrollToPx(this.mainContainer.scrollTop - windowHeight);
			}
			// By default, scroll into the top of the target section
			else {
				this.scrollToPx(top + this.mainContainer.scrollTop);
			}
		}
		else {
			console.log('no target section');
			this.handleScroll();
		}
	}

	static scrollToPx(targetScroll = 0) {
		// Scroll
		gsap.to(this.mainContainer, {
			scrollTo: targetScroll,
			ease: 'power2.inOut',
			duration: 1,
			onComplete: () => {
				if ( this.scrollSwipe ) {
					this.scrollSwipe.listen();
				}
			}
		})
	}

	static onMouseWheel(e) {
		const direction = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? 'VERTICAL' : 'HORIZONTAL';
		const intent = e.deltaY > 0 ? 1 : 0;

		e.preventDefault();
 		this.scrollCallback({ direction, intent });
	}

	static onWindowResize() {
		console.log('window resize');
		this.setInitialSectionInView();
	}

}