// Register SW
if ('serviceWorker' in navigator) {
	//register our service worker
	navigator.serviceWorker
		.register('/sw.js', {
			updateViaCache: 'none',
			scope: '/',
		})
		.then(() => {
			//finished registering
		})
		.catch((err) => {
			console.warn('Failed to register', err.message);
		});

	//listen for messages
	navigator.serviceWorker.addEventListener('message', ({ data }) => {
		//received a message from the service worker
		console.log(data, 'message from service worker');
	});
}

// SYNC
const registerPeriodicCheck = async () => {
	const registration = await navigator.serviceWorker.ready;
	try {
		await registration.periodicSync.register('latest-update', {
			minInterval: 24 * 60 * 60 * 1000,
		});
	} catch {
		console.log('Periodic Sync could not be registered!');
	}
};

navigator.serviceWorker.ready.then(async (registration) => {
	const tags = await registration.periodicSync.getTags();
	if (tags.includes('latest-update')) skipDownloadingLatestUpdateOnPageLoad();
});

// Read more init:
ReadMore.init();

// Youtube lazy loading
(() => {
	const youtubeVideos = document.querySelectorAll('.youtube');

	youtubeVideos.forEach((video) => {
		const source = `https://img.youtube.com/vi/${video.dataset.embed}/sddefault.jpg`;

		// Create an image
		const image = new Image();
		image.src = source;
		image.setAttribute('alt', 'Youtube video thumbnail');
		image.addEventListener('load', () => {
			video.appendChild(image);
		});

		// Create an iframe
		video.addEventListener('click', function () {
			const iframe = document.createElement('iframe');
			iframe.setAttribute('frameborder', '0');
			iframe.setAttribute('allowfullscreen', '');
			iframe.setAttribute(
				'src',
				`https://www.youtube.com/embed/${this.dataset.embed}?rel=0&showinfo=0&autoplay=1`,
			);

			this.innerHTML = '';
			this.append(iframe);
		});
	});
})();
