/**
 *  Read More JS
 *  truncates text via specfied character length with more/less actions.
 *  Maintains original format of pre truncated text.
 *  @author stephen scaff
 *  @todo   Add destroy method for ajaxed content support.
 * @edited Ante Budimir (separated mobile and desktop functionality - added separate read more that opens modal on desktop)
 *

 */
var ReadMore = (function () {
	var s;

	return {
		settings: function () {
			return {
				content: document.querySelectorAll('.js-read-more'),
				originalContentArr: [],
				truncatedContentArr: [],
				moreLink: 'Read More',
				lessLink: 'Close',
			};
		},

		init: function () {
			s = this.settings();
			this.bindEvents();
		},

		bindEvents: function () {
			ReadMore.truncateText();
		},

		/**
		 * Count Words
		 * Helper to handle word count.
		 * @param {string} str - Target content string.
		 */
		countWords: function (str) {
			return str.split(/\s+/).length;
		},

		/**
		 * Ellpise Content
		 * @param {string} str - content string.
		 * @param {number} wordsNum - Number of words to show before truncation.
		 */
		ellipseContent: function (str, wordsNum) {
			return str.split(/\s+/).slice(0, wordsNum).join(' ') + '...';
		},

		/**
		 * Truncate Text
		 * Truncate and ellipses contented content
		 * based on specified word count.
		 * Calls createLink() and handleClick() methods.
		 *
		 */
		truncateText: function () {
			for (var i = 0; i < s.content.length; i++) {
				var originalContent = s.content[i].innerHTML;
				var numberOfWords = s.content[i].dataset.rmWords;
				var truncateContent = ReadMore.ellipseContent(
					originalContent,
					numberOfWords,
				);
				var originalContentWords = ReadMore.countWords(originalContent);

				s.originalContentArr.push(originalContent);
				s.truncatedContentArr.push(truncateContent);

				if (numberOfWords < originalContentWords) {
					s.content[i].innerHTML = s.truncatedContentArr[i];
					var self = i;
					ReadMore.createLink(self);
				}
			}
			ReadMore.handleClick(s.content);
		},

		/**
		 * Create Link
		 * Creates and Inserts Read More Link
		 * @param {number} index - index reference of looped item
		 */
		createLink: function (index) {
			var readMoreButton = document.createElement('button');
			readMoreButton.setAttribute('id', `read-more_${index}`);
			readMoreButton.setAttribute('class', 'btn-more');
			readMoreButton.setAttribute('tabindex', '0');
			readMoreButton.textContent = `${s.moreLink}`;

			s.content[index].appendChild(readMoreButton, s.content[index]);
		},

		/**
		 * Handle Click
		 * Toggle Click event
		 */
		handleClick: function (el) {
			const readMoreButton = document.querySelectorAll('.btn-more');

			// Read more < 1024px
			if (window.innerWidth < 1024) {
				for (var j = 0, l = readMoreButton.length; j < l; j++) {
					readMoreButton[j].addEventListener('click', function () {
						var moreLinkID = this.getAttribute('id');
						var index = moreLinkID.split('_')[1];

						el[index].classList.toggle('is-expanded');

						if (this.dataset.clicked !== 'true') {
							el[index].innerHTML = s.originalContentArr[index];
							this.textContent = s.lessLink; // upper inner HTML removed the link, appending it back
							el[index].append(this);
							this.dataset.clicked = true;
						} else {
							el[index].innerHTML = s.truncatedContentArr[index];
							this.textContent = s.moreLink;
							el[index].append(this);
							this.dataset.clicked = false;
						}
					});
				}
			}
			// Read more > 1023px
			else if (window.innerWidth > 1023) {
				readMoreButton.forEach((button) => {
					button.addEventListener('click', () => {
						const moreLinkID = button.getAttribute('id');
						const index = moreLinkID.split('_')[1];

						const modal = document.createElement('div');
						modal.setAttribute('class', 'modal');
						modal.innerHTML = `<div class="content">
												<button class="close-button" title="Close the window">&times;</button>
												${s.originalContentArr[index]}
											</div>`;

						const main = document.querySelector('#about'),
							body = document.querySelector('body');

						main.append(modal);
						modal.classList.add('open');
						body.style.overflow = 'hidden';

						// disable closing of modal on click inside of the content box
						document
							.querySelector('.content')
							.addEventListener('click', (event) => {
								event.stopPropagation();
							});

						document
							.querySelector('.close-button')
							.addEventListener('click', () => {
								modal.style.display = 'none';
								body.style.overflow = 'unset';
								modal.remove();
							});

						// close on outside click
						modal.addEventListener('click', () => {
							modal.style.display = 'none';
							body.style.overflow = 'unset';
							modal.remove();
						});
					});
				});
			}
		},

		/**k
		 * Open All
		 * Method to expand all instances on the page.
		 */
		openAll: function () {
			el = document.querySelectorAll('.btn-more');
			for (var i = 0; i < el.length; i++) {
				content[i].innerHTML = s.truncatedContentArr[i];
				el[i].innerHTML = s.moreLink;
			}
		},
	};
})();
