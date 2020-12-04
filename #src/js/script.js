'use strict';

const quizItemsTmpl = 
	`
	<form id="quiz">
	<div class="quiz-item">
	<div class="quiz-item__title">Рассчитайте стоимость проекта Какая у Вас квартира?</div>
	<div class="quiz-item__content">
		<div class="button"><a href="#" data-value="1" data-step="1">1 комнатная/студия</a></div>
		<div class="button"><a href="#" data-value="2" data-step="1">2 комнатная</a></div>
		<div class="button"><a href="#" data-value="3" data-step="1">3 комнатная</a></div>
		<div class="button"><a href="#" data-value="4" data-step="1">4 комнатная</a></div>
		<div class="button"><a href="#" data-value="0" data-step="1">Другое</a></div>
		<input type="hidden" name="rooms-number">
	</div>
</div>

<div class="quiz-item">
	<div class="quiz-item__title">Тип помещения</div>
	<div class="quiz-item__content nowrap">
		<div class="button"><a href="#" data-value="new" data-step="2">Новостройка</a></div>
		<div class="button"><a href="#" data-value="seconadary" data-step="2">Вторичка</a></div>
		<input type="hidden" name="premises-type">
	</div>
</div>

<div class="quiz-item">
	<div class="quiz-item__title">Название ЖК или адрес</div>
	<div class="quiz-item__content">
		<input type="text" name="adress" id="" placeholder="Необязательно">
		<div class="button"><a href="#" data-step="3">Продолжить</a></div>
	</div>
</div>

<div class="quiz-item">
	<div class="quiz-item__title">Ваш телефон</div>
	<div class="quiz-item__content">
		<div class="phone-input-wrapper">
			<input type="text" name="phone-code" class="phone" placeholder="+7" required value="+7">
			<input type="text" name="phone-number" class="phone" placeholder="(XXX) XXX XX XX" required>
			<div class="button disabled"><a href="#" data-step="4">Продолжить</a></div>
		</div>
	</div>
</div>

<div class="quiz-item">
	<div class="quiz-item__title">Код из СМС</div>
	<div class="quiz-item__content">
		<input type="text" name="sms-code-1" class="sms-digit" placeholder="X">
		<input type="text" name="sms-code-2" class="sms-digit" placeholder="X">
		<input type="text" name="sms-code-3" class="sms-digit" placeholder="X">
		<input type="text" name="sms-code-4" class="sms-digit" placeholder="X">
		<div class="quiz-item__message"></div>
	</div>
</div>
</form>
	`;

document.addEventListener('DOMContentLoaded', () => {
	window.addEventListener('scroll', function(e) {
		// Изменение главного меню при скролле
		// console.log('scroll', window.pageYOffset);
		const topMenuNode = document.querySelector('.top-menu');
		topMenuNode.classList.remove('mobile-active');
		if (window.pageYOffset > 50 && !document.body.classList.contains('blocked')) {
			topMenuNode.classList.add('scrolled');
			console.log('scrolled');
		} else {
			topMenuNode.classList.remove('scrolled');
			console.log('unscrolled');
		}
	});

	const buttonModalNodes = document.querySelectorAll('a[data-target]'),
			flatTypeSelect = document.querySelector('select[name="flat-type"]');
	
	buttonModalNodes.forEach(button => {
		button.addEventListener('click', function(e) {
			e.preventDefault();
			let step = 1, roomsCount = null;
			console.log('roomsCount', roomsCount);

			if (e.target.dataset.target === 'quiz2') {
				roomsCount = flatTypeSelect.value;
				step = 2;
			};
			if (e.target.dataset.target === 'quiz4') {
				step = 4;
			};
			runQuiz(step, roomsCount);
			
		});
	});


	function runQuiz(step = 1, roomsCount = null) {
		console.log('runQuiz');
		const modalNode =        document.getElementById('modal-quiz'),
				modalContentNode = modalNode.querySelector('.modal__content'),
				modalCloseButton = modalNode.querySelector('.button-close'),
				topMenuNode =      document.querySelector('.top-menu'),
				burgerNode =       topMenuNode.querySelector('.top-menu__burger');
		let currentStep = 1;

		modalCloseButton.addEventListener('click', closeModal);
		openModal();

		function openModal() {
			document.body.classList.add('blocked');
			modalNode.classList.add('active');
			console.dir(topMenuNode);
			topMenuNode.classList.remove('scrolled');
			topMenuNode.classList.add('white');
			burgerNode.classList.add('hide');
		};
		
		function closeModal() {
			modalContentNode.innerHTML = '';
			modalNode.classList.remove('active');
			topMenuNode.classList.remove('white');
			topMenuNode.classList.add('scrolled');
			document.body.classList.remove('blocked');
			burgerNode.classList.remove('hide');
		};

		modalContentNode.innerHTML = quizItemsTmpl;
		// const modalNavWrap = modalNode.querySelector('.modal__nav');
		// modalNavWrap.addEventListener('click', function(e) {
		// 	e.preventDefault();
		// 	if (e.target.classList.contains('modal__nav-prev')) {
		// 		if (currentStep > 1) {
		// 			setActiveStep(currentStep - 1);
		// 		}
		// 	}
		// 	if (e.target.classList.contains('modal__nav-next')) {
		// 		if (currentStep < 5) {
		// 			setActiveStep(currentStep + 1);
		// 		}
		// 	}
		// });

		const stepNodes = modalContentNode.querySelectorAll('.quiz-item'),
		      phoneInputs = modalContentNode.querySelectorAll('input.phone'),
				smsDigitNodes = modalContentNode.querySelectorAll('.sms-digit'),
				adressInputNode = modalContentNode.querySelector('input[name=adress]');
		
		setActiveStep(step);
		
		modalContentNode.addEventListener('click', function(e) {
			e.preventDefault();
			// console.log('click', e.target);
			
			if (e.target.dataset.value) {
				e.target.classList.toggle('selected');
				const parentNode = e.target.closest('.quiz-item__content');
				const input = parentNode.querySelector('input[type=hidden]');
				input.value = e.target.dataset.value;
				let timerId = setTimeout(() => {
					setActiveStep(currentStep+1);
					if (currentStep === 3) setInterval(adressInputNode.focus(), 700);
				}, 300); 
			};
			
			if (e.target.dataset.step == "3") {
				setActiveStep(4);
				setInterval(phoneInputs[1].focus(), 700);
			};
			
			if (e.target.dataset.step == "4") {
				
				const parentNode = e.target.closest('.quiz-item__content');
				
				let isErrors = false;
				phoneInputs[0].classList.remove('has-error');
				phoneInputs[1].classList.remove('has-error');
				if (!phoneInputs[0].value) {
					phoneInputs[0].classList.add('has-error');
					isErrors = true;
				}
				if (!phoneInputs[1].value) {
					phoneInputs[1].classList.add('has-error');
					isErrors = true;
				}
				if (!isErrors) {
					setActiveStep(5);
					setInterval(smsDigitNodes[0].focus(), 700);
				}
			};

		});

		smsDigitNodes.forEach((node,i) => {
			node.addEventListener('keypress', function(e) {
				e.preventDefault();
				console.log('key', e.key, 'type', typeof(e.key));
				const digitId = +e.target.name.match(/\d/)[0];
				console.log('digitId',digitId);
				if (e.key.match(/\d/)) {
					e.target.value = e.key;
					if (digitId < smsDigitNodes.length)
						smsDigitNodes[i+1].focus();
					if (digitId == smsDigitNodes.length)
						checkSms();
				} else {
					e.target.value = '';
				}
			});
		});

		function setActiveStep(step) {
			stepNodes.forEach((item,i) => {
				item.classList.remove('active');
				if (step === i+1) {item.classList.add('active')};
			});
			currentStep = step;
			console.log('setActiveStep()', currentStep);
		};

		function checkSms() {
			console.log('checkSms()');
		};
	}

	// Mobile menu
	const topMenuNode = document.querySelector('.top-menu'),
	      burgerNode = topMenuNode.querySelector('.top-menu__burger'),
			topMenuItemsNode = topMenuNode.querySelector('.top-menu__items');
			
	burgerNode.addEventListener('click', function(e) {
		e.preventDefault();
		console.log('burger');
		// topMenuItemsNode.classList.toggle('hidden');
		topMenuNode.classList.toggle('mobile-active');
		// burgerNode.classList.toggle('active');
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


