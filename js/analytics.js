// Mixpanel event tracking. The library itself is loaded and initialised in <head>.
(function ($) {
	"use strict";

	if (!window.mixpanel) return;

	// sendBeacon lets the event go out even when the click navigates away.
	var track = function (event, props) {
		mixpanel.track(event, props, { transport: 'sendBeacon' });
	};

	// Section Viewed: fire once per section per visit when it crosses the middle of the screen.
	if ('IntersectionObserver' in window) {
		var seen = {};
		var observer = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				var id = entry.target.id;
				if (entry.isIntersecting && !seen[id]) {
					seen[id] = true;
					mixpanel.track('Section Viewed', { section: id.replace('-section', '') });
					observer.unobserve(entry.target);
				}
			});
		}, { rootMargin: '-50% 0px -50% 0px' });

		$('section[id$="-section"]').each(function () {
			observer.observe(this);
		});
	}

	// Link clicks
	var socialNetworks = ['linkedin', 'github', 'twitter', 'instagram'];

	$(document).on('click', 'a[href]', function () {
		var href = this.getAttribute('href');
		var text = $.trim($(this).text());
		var section = ($(this).closest('section').attr('id') || 'footer').replace('-section', '');

		if (href.indexOf('drive.google.com/file') !== -1) {
			track('CV Clicked', { label: text || 'Download CV', section: section });
		} else if (href.indexOf('docs.google.com/forms') !== -1) {
			track('Question Form Clicked', { section: section });
		} else if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) {
			track('Contact Clicked', { method: href.indexOf('mailto:') === 0 ? 'email' : 'phone' });
		} else if (section === 'project' && href.indexOf('github.com/ar-vi-nd/') !== -1) {
			track('Project Clicked', { project: href.split('/').pop(), url: href });
		} else {
			for (var i = 0; i < socialNetworks.length; i++) {
				if (href.indexOf(socialNetworks[i] + '.com') !== -1) {
					track('Social Clicked', { network: socialNetworks[i], section: section, url: href });
					break;
				}
			}
		}
	});

})(jQuery);
