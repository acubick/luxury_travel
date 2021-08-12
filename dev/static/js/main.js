// document.body.style.background = 'blue';
$(document).ready(function () {


	let headerH = $('.header__menu').height(),
			scrollPos = $(window).scrollTop(),
		navH = $('.header').innerHeight();
	checkScroll(scrollPos, headerH);
	$(document).on('scroll', onScroll);

	/* Fixed header when scroll
	====================================*/


	$(window).on('scroll resize', function () {

		// headerH   = $('.header__menu').height();
		scrollPos = $(this).scrollTop();
		checkScroll(scrollPos, headerH);

	});

	function checkScroll(scrollPos, headerH) {
		if (scrollPos > headerH) {
			$('.navigation').addClass('fixed');
			$('.intro').css({
				'paddingTop': navH
			});
		} else {
			$('.navigation').removeClass('fixed');
			$('.header').removeAttr('style');
		}
	}



//	подсветка пункта меню, в зависимости от текущего местоположения на странице
	$(document).on('scroll', onScroll);

	function onScroll(event) {
		let scrollPos = $(document).scrollTop();
		$('#nav a').each(function () {
			let currLink = $(this),
				refElement = $(currLink.attr('href'));
			if (refElement.position().top <= (
					scrollPos + navH
				) && refElement.position().top + refElement.height() > (
					scrollPos + navH
				)) {
				$('#nav  a').removeClass('active');
				currLink.addClass('active');
			} else {
				currLink.removeClass('active');
			}
		});
	}


	// анимация перехода по id
	$('#nav a').on('click', function (event) {
		//отменяем стандартную обработку нажатия по ссылке
		event.preventDefault();
		//забираем идентификатор блока с атрибута href
		let id = $(this).attr('href'),
			scrollPos = $(document).scrollTop(),
			lenth = $(id).offset().top - (navH - 55),
			distance = lenth - scrollPos,
			time = 300,
			count = Math.abs(distance / 1000);
		// console.log('id  :>> ', id);
		//  console.log('lenth :', lenth );
		// console.log('scrollPos:', scrollPos);
		// console.log( 'distance / 1000: ', distance / 1000 );

		time *= parseInt(count);
		if (time < 500) {
			time += 700;
		}

		// console.log( 'count: ', parseInt(count) );
		// console.log( 'time: ', time );
		//анимируем переход на расстояние - top за 1000 мс
		$('body,html').animate({
			scrollTop: lenth
		}, time);
		$('.menu-burger__header, .header__menu').removeClass('open-menu');
		$('body').removeClass('fixed-page');
	});



	$('.header__search').on('click', (e) => {
		$('.find-tours').toggleClass('active')
	})

	$('.menu-burger__header').click(function () {
		$('.menu-burger__header, .header__menu').toggleClass('open-menu');
		// $('.header__menu').toggleClass('open-menu');
		$('body').toggleClass('fixed-page');
	});
})