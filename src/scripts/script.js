// Общая функция для перемещения элементов навигации
function moveNavigationElements($slider) {

    // Проверяем, есть ли уже созданный контейнер навигации
    if ($slider.siblings('.slider-navigation').length > 0) {
        return; // Если уже есть, выходим из функции
    }
    // Скрываем стандартные кнопки точек
    $slider.find('.slick-dots button').css('display', 'none');

    // Создаем контейнер для навигации
    const $navigation = $('<div class="slider-navigation"></div>');
    const $slickList = $slider.find('.slick-list');

    // Определяем класс точек для текущего слайдера
    const dotsClass = $slider.hasClass('catalog-slider') ? 'number-dots' : 'dot-circles';

    // Перемещаем элементы
    const $prevArrow = $slider.find('.slick-prev').detach();
    const $nextArrow = $slider.find('.slick-next').detach();
    const $dots = $slider.find(`.${dotsClass}`).detach();

    // Собираем новую структуру
    $navigation.append($prevArrow, $dots, $nextArrow);
    $navigation.insertAfter($slickList);
}

// Поиск товара в блоке #product
function selectProductInDropdown(productTitle) {
    const $select = $('#product');
    const $options = $select.find('option');
    let found = false;

    // Сначала пробуем найти точное совпадение
    $options.each(function() {
        if ($(this).text().trim() === productTitle) {
            $(this).prop('selected', true);
            found = true;
            return false; // Прерываем each
        }
    });

    // Если точного совпадения нет, ищем частичное
    if (!found) {
        const searchText = productTitle.toLowerCase();
        $options.each(function() {
            if ($(this).text().toLowerCase().includes(searchText)) {
                $(this).prop('selected', true);
                found = true;
                return false; // Прерываем each
            }
        });
    }

    if (found) {
        $select.trigger('change');
    }

    return found;
}

function moveTitlesOnMobile() {
    const isMobile = $(window).width() < 768;

    // 1. Обработка .present-title
    const $presentTitle = $('.present-title');
    const $presentText = $('.present-text');
    const $presentContainer = $('.present .container');

    if ($presentTitle.length && $presentText.length && $presentContainer.length) {
        if (isMobile) {
            // На мобилке: переносим в .container, если ещё не там
            if (!$presentTitle.parent().is($presentContainer)) {
                $presentTitle.prependTo($presentContainer);
            }
        } else {
            // На десктопе: возвращаем в .present-text, если сейчас в .container
            if ($presentTitle.parent().is($presentContainer)) {
                $presentTitle.prependTo($presentText);
            }
        }
    }

    // 2. Обработка .description-title
    $('.description-title').each(function() {
        const $title = $(this);
        const $descriptionText = $title.closest('.description-text');
        const $row = $title.closest('.row');

        if ($descriptionText.length && $row.length) {
            if (isMobile) {
                // На мобилке: переносим в .row, если ещё не там
                if ($title.parent().is($descriptionText)) {
                    $title.prependTo($row);
                }
            } else {
                // На десктопе: возвращаем в .description-text, если сейчас в .row
                if ($title.parent().is($row)) {
                    $title.prependTo($descriptionText);
                }
            }
        }
    });

    // 3. Обработка .contact-title
    const $contactTitle = $('.contact-title');
    const $contactsText = $('.contacts-text');
    const $contactsContainer = $('.contacts .container');

    if ($contactTitle.length && $contactsText.length && $contactsContainer.length) {
        if (isMobile) {
            // На мобилке: переносим в .container, если ещё не там
            if ($contactTitle.parent().is($contactsText)) {
                $contactTitle.prependTo($contactsContainer);
            }
        } else {
            // На десктопе: возвращаем в .contacts-text, если сейчас в .container
            if ($contactTitle.parent().is($contactsContainer)) {
                $contactTitle.prependTo($contactsText);
            }
        }
    }
}

function rearrangeSliderOnMobile() {
    const isMobile = $(window).width() < 660;
    let $sliderColumns = $('.catalog-slider .slider-column');
    const $catalogSlider = $('.catalog-slider');

    if (!$sliderColumns.length) return;

    // Собираем ВСЕ продукты (включая пустые)
    const $products = $('.catalog-slider .product');

    // Очищаем слайдер
    $sliderColumns.empty();

    // Распределяем продукты
    let productsPerSlide = isMobile ? 4 : 3;
    let currentColumnIndex = 0;

    $products.each(function(index) {
        // Если текущий слайд заполнен, переходим к следующему
        if (index > 0 && index % productsPerSlide === 0) {
            currentColumnIndex++;
        }

        // Создаём новый слайд, если нужно
        if (!$sliderColumns.eq(currentColumnIndex).length) {
            $catalogSlider.append('<div class="slider-column"></div>');
            $sliderColumns = $('.catalog-slider .slider-column');
        }

        // Переносим продукт (даже пустой)
        $(this).appendTo($sliderColumns.eq(currentColumnIndex));
    });
}



function reorganizeLayoutOnMobile() {
    const isMobile = $(window).width() < 476;

    // Обработка footer
    const $footerContainer = $('.footer .container');
    let $logoInfo = $('.logo-info');

    if ($footerContainer.length) {
        if (isMobile) {
            if ($logoInfo.length && $logoInfo.find('.logo, .email, .rights').length) {
                $logoInfo.find('.logo, .email, .rights').appendTo($footerContainer);
                $logoInfo.remove();
            }
        } else {
            const $scatteredElements = $footerContainer.find('.logo, .email, .rights');
            if ($scatteredElements.length) {
                if (!$logoInfo.length) {
                    $footerContainer.prepend('<div class="logo-info"></div>');
                    $logoInfo = $('.logo-info');
                }
                $scatteredElements.appendTo($logoInfo);
            }
        }
    }

    // Обработка header
    const $headerContainer = $('.header .container');
    const $menu = $('.header .menu');
    const $call = $('.header .call');
    const $close = $('.header .close');

    if ($headerContainer.length) {
        if (isMobile) {
            // Проверяем, не создан ли уже header-action-container
            if (!$('.header-action-container').length) {
                // Создаём основной контейнер
                const $actionContainer = $('<div class="header-action-container"></div>');

                // Создаём внутренний контейнер для действий
                const $headerAction = $('<div class="header-action"></div>');
                $headerAction.append($menu, $call, $close);

                // Добавляем оба контейнера в header
                $actionContainer.append($headerAction);
                $headerContainer.append($actionContainer);
            }
        } else {
            // Возвращаем элементы на место
            const $actionContainer = $('.header-action-container');
            if ($actionContainer.length) {
                $actionContainer.find('.header-action').children().appendTo($headerContainer);
                $actionContainer.remove();
            }
        }
    }
}

$(document).ready(() => {

    // Инициализация WOW.js
    new WOW({
        animateClass: 'animate__animated', // Соответствует классам Animate.css v4+
    }).init();

    // Выполняем при загрузке и при изменении размера окна (для перераспределения некоторых
    // элементов на мобильных экранах
    // Вызываем функции при загрузке
    moveTitlesOnMobile();
    rearrangeSliderOnMobile();
    reorganizeLayoutOnMobile();

    $(window).on('resize', function() {
        moveTitlesOnMobile();
        rearrangeSliderOnMobile();
        reorganizeLayoutOnMobile();
    });


    // Открытие бургер-меню
    $('#burger').click(() => {
        $('.header-action-container').css('display', 'block');
    });

    // $('.header-action-container *').click(() => {
    //      $('.header-action-container').css('display', 'none');
    // })

    $('.header-action-container').click(() => {
        $('.header-action-container').css('display', 'none');
    })

    $('.header-action').click(() => {
        $('.header-action-container').css('display', 'none');
    })

    $('#nav-close').click(() => {
        $('.header-action-container').css('display', 'none');
    })

    $('#call').click(() => {
        $('.header-action-container').css('display', 'none');
    });

    $('.header-action .menu-item').click(() => {
        $('.header-action-container').css('display', 'none');
    })



    let catalogSlider = $('.catalog-slider');
    let feedbackSlider = $('.feedback-slider');

    // Настройка слайдера товаров (каталога) - с цифрами
    catalogSlider.slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev custom-arrow" aria-label="Previous"><img src="dist/images/icons/prev.png"></button>',
        nextArrow: '<button type="button" class="slick-next custom-arrow" aria-label="Next"><img src="dist/images/icons/next.png"></button>',
        dots: true,
        dotsClass: 'number-dots',
        customPaging: function(slider, i) {
            return '<span class="number-dot">' + (i + 1) + '</span>';
        },
        responsive: [
            {
                breakpoint: 1111,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 660,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: true,
                    prevArrow: false, // Скрываем стрелку "назад"
                    nextArrow: '<button type="button" class="btn show-more-btn">Показать ещё 4 из ' + catalogSlider.find('.product').length + '</button>',
                    dots: false // Отключаем пагинацию
                }
            }
        ]
    });

    // Настройка слайдера отзывов - с кружками
    feedbackSlider.slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev custom-arrow" aria-label="Previous"><img src="dist/images/icons/prev2.png"></button>',
        nextArrow: '<button type="button" class="slick-next custom-arrow" aria-label="Next"><img src="dist/images/icons/next2"></button>',
        dots: true,
        dotsClass: 'dot-circles', // другой класс для стилизации кружков
        customPaging: function(slider, i) {
            return '<span class="dot-circle"></span>'; // просто пустой блок для кружка
        },
        responsive: [
            {
                breakpoint: 1111,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 660,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false
                }
            }
        ]
    });

    // Явный вызов сразу после инициализации
    moveNavigationElements(catalogSlider);
    moveNavigationElements(feedbackSlider);

    // Обработчик для переинициализации
    $('.catalog-slider, .feedback-slider').on('init reInit breakpoint', function() {
        moveNavigationElements($(this));
    });


    let call_popup = $('.phone-order-container');

    $('#call').click(() => {
        // Удаляем все предыдущие обработчики animationend
        call_popup.off('animationend');

        call_popup
            .css('display', 'block')
            .addClass('animate__animated animate__fadeIn')
            .removeClass('animate__fadeOut');
    });

    let loader = $('.loader');

    //Валидация формы заказа звонка
    $('#phone-order-btn').click(() => {
        let burger_menu = $('.header-action-container');
        console.log(burger_menu);
        if (burger_menu) {
            burger_menu.css('display', 'none');
        }

        $('.phone-order .error-input').hide();
        $('#phone-order-name, #phone-order-number').css('border-color', '');

        let name = $('#phone-order-name');
        let phone = $('#phone-order-number');

        let is_error = false;

        if (!name.val()) {
            name.css('border-color', 'red');
            name.next().show();
            is_error = true;
        }

        if (!phone.val()) {
            phone.css('border-color', 'red');
            phone.next().show();
            is_error = true;
        }

        if (!is_error) {

            loader.css('display', 'flex');

            $.ajax({
                method: "POST",
                url: "https://testologia.ru/checkout",
                data: {name: name.val(), phone: phone.val()}
            })
                .done(function (msg) {
                    loader.hide();
                    if (msg.success) {
                        // Находим все элементы формы, кроме phone-order-close и скрываем их
                        $('.phone-order .order-form').children().not('.phone-order-close').hide();

                        // Показываем phone-order-close и центрируем его
                        $('.phone-order-close')
                            .show()
                            .css({
                                'display': 'block',
                                'text-align': 'center',
                                'height': '100%' // или нужную вам высоту
                            });
                    } else {
                        alert('Возникла ошибка при оформлении заказа, позвоните нам и сделайте заказ');
                    }
                });
        }
    });

    $('#phone-order-number').inputmask("+7 (999) 999-99-99");
    $('#phone').inputmask("+7 (999) 999-99-99");

    $('#phone-close').click(() => {
        // Удаляем все предыдущие обработчики animationend
        call_popup.off('animationend');

        call_popup
            .addClass('animate__animated animate__fadeOut')
            .removeClass('animate__fadeIn')
            .on('animationend', function() {
                $(this).css('display', 'none');
                $(this).removeClass('animate__animated animate__fadeOut');
            });
    });

    $('#phone-close-btn').click(() => {

        $('.phone-order-close').hide();

        $('.phone-order .order-form').children().not('.phone-order-close').show();

        $('.phone-order .error-input').hide();
    })



    // Нажатие на кнопку "Заказать" в карточках товара
    $('.product-btn').click(function() {
        // Находим ближайший родительский элемент с классом .main-product или .product
        var $productCard = $(this).closest('.main-product, .product');

        // Внутри этого элемента ищем блок с классом product-title и получаем его текст
        var productTitle = $productCard.find('.product-title').text().trim();

        // Прокручиваем к форме заказа
        $('#order').get(0)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Выбираем товар в select
        const isSelected = selectProductInDropdown(productTitle);

        if (!isSelected) {
            console.warn('Товар не найден в списке:', productTitle);
            // Можно добавить fallback-логику, например:
            // $('#product').val('').trigger('change'); // Сброс выбора
        }
    });

    // Валидация формы заказа

    $('#order-btn').click(() => {

        $('.order-main .error-input').hide();

        $('#name, #phone').css('border-color', '');

        let name = $('#name');
        let phone = $('#phone');
        let product = $('#product');
        let agreement = $('#agreement');

        let is_error2 = false;

        if (!name.val()) {
            name.css('border-color', 'red');
            name.next().show();
            is_error2 = true;
        }

        if (!phone.val()) {
            phone.css('border-color', 'red');
            phone.next().show();
            is_error2 = true;
        }

        if (!agreement.is(':checked')) {
            agreement.css('border-color', 'red');
            $('.form-checkbox-label').next().show().css('margin', '5px 0 0 0');
            is_error2 = true;
        }

        if (!is_error2) {

            loader.css('display', 'flex');

            $.ajax({
                method: "POST",
                url: "https://testologia.ru/checkout",
                data: {product: product.find('option:selected').text(), name: name.val(), phone: phone.val()}
            })
                .done(function (msg) {
                    loader.hide();
                    if (msg.success) {
                        $('.order-main').hide();
                        $('.order-gratitude').show();
                    } else {
                        alert('Возникла ошибка при оформлении заказа, позвоните нам и сделайте заказ');
                    }
                });
        }
    });

    $('#gratitude-btn').click (() => {

        $('.order-gratitude').hide();
        $('.order-main').show();

    })

});