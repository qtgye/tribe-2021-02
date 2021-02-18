export default class SwiperOverrides {
	static init() {
		const swiperContainers = document.querySelectorAll('.swiper-container');

		console.log({ swiperContainers });

		swiperContainers.forEach(swiperContainer => {
			const swiperParent = swiperContainer.parentElement;
			swiperParent.classList.add('swiper-parent');
		});
	}
}