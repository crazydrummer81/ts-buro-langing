'use strict';

document.addEventListener('DOMContentLoaded', () => {
	window.addEventListener('scroll', function(e) {
		// Изменение главного меню при скролле
		// console.log('scroll', window.pageYOffset);
		const topMenuNode = document.querySelector('.top-menu');
		if (window.pageYOffset > 50) {
			topMenuNode.classList.add('scrolled');
			console.log('scrolled');
		} else {
			topMenuNode.classList.remove('scrolled');
			console.log('unscrolled');
		}
	});
});


function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});