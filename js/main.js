// =========================================================
// main.js — базовая интерактивность DeviceHub
// (основная оценка КР №3 — адаптивность и доступность,
//  JS здесь только поддерживает их)
// =========================================================

const desktopQuery = window.matchMedia('(min-width: 1024px)');


// ===============================
// 1. Адаптивное меню (бургер)
// ===============================
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');

function setNavOpen(isOpen) {
  if (!navToggle || !siteNav) return;

  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.querySelector('.nav-toggle__text').textContent = isOpen ? 'Закрыть' : 'Меню';
  siteNav.classList.toggle('site-nav--open', isOpen);
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    setNavOpen(!isOpen);
  });

  // Закрываем меню по Esc и возвращаем фокус на кнопку
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      setNavOpen(false);
      navToggle.focus();
    }
  });

  // Переход по якорной ссылке внутри страницы — закрываем меню
  siteNav.addEventListener('click', (event) => {
    if (event.target.closest('a') && !desktopQuery.matches) {
      setNavOpen(false);
    }
  });

  // При переходе на desktop-ширину сбрасываем состояние
  desktopQuery.addEventListener('change', () => setNavOpen(false));
}


// ===============================
// 2. Фильтр каталога: свёрнут на мобильном, раскрыт на desktop
// ===============================
const catalogFilters = document.getElementById('catalog-filters');

if (catalogFilters) {
  const syncFilters = () => {
    catalogFilters.open = desktopQuery.matches;
  };

  syncFilters();
  desktopQuery.addEventListener('change', syncFilters);

  // На desktop не даём свернуть фильтр (в т. ч. с клавиатуры)
  catalogFilters.querySelector('summary').addEventListener('click', (event) => {
    if (desktopQuery.matches) event.preventDefault();
  });
}


// ===============================
// 3. Проверка формы и вывод ошибок
// ===============================
function validateForm(form) {
  const fields = Array.from(form.elements).filter((element) => element.willValidate);
  let firstInvalid = null;

  fields.forEach((field) => {
    field.removeAttribute('aria-invalid');

    if (!field.checkValidity()) {
      field.setAttribute('aria-invalid', 'true');
      firstInvalid = firstInvalid || field;
    }
  });

  if (firstInvalid) {
    form.reportValidity();
    firstInvalid.focus();
    return false;
  }

  return true;
}

// Снимаем красную рамку, как только поле исправлено
document.addEventListener('input', (event) => {
  const field = event.target;
  if (field.hasAttribute && field.hasAttribute('aria-invalid') && field.checkValidity()) {
    field.removeAttribute('aria-invalid');
  }
});


// ===============================
// 4. Модальное окно заказа на главной
// ===============================
const orderDialog = document.getElementById('order-dialog');
const orderForm = document.getElementById('order-form');
const selectedProductInput = document.getElementById('selected-product');
const dialogProductText = document.getElementById('order-dialog-product');
const successMessage = document.getElementById('success-message');
let lastTrigger = null;

if (orderDialog && orderForm) {
  document.querySelectorAll('.product-card__button[data-product]').forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product;

      lastTrigger = button;
      selectedProductInput.value = productName;
      dialogProductText.textContent = `Товар: ${productName}`;

      orderDialog.showModal();
      orderDialog.querySelector('input:not([type="hidden"])').focus();
    });
  });

  orderDialog.querySelectorAll('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', () => orderDialog.close());
  });

  // Клик по затемнённому фону закрывает окно
  orderDialog.addEventListener('click', (event) => {
    if (event.target !== orderDialog) return;

    const rect = orderDialog.getBoundingClientRect();
    const isOutside =
      event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom;

    if (isOutside) orderDialog.close();
  });

  // Esc закрывает <dialog> сам; после закрытия возвращаем фокус на кнопку «Заказать»
  orderDialog.addEventListener('close', () => {
    if (lastTrigger) lastTrigger.focus();
  });

  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateForm(orderForm)) return;

    orderForm.reset();
    orderDialog.close();

    successMessage.hidden = false;
    console.log('Заявка из модального окна отправлена:', selectedProductInput.value);
  });
}


// ===============================
// 5. Отдельные формы: заказ и обратная связь
// ===============================
function setupPageForm(formId, successId) {
  const form = document.getElementById(formId);
  const success = document.getElementById(successId);

  if (!form || !success) return;

  form.addEventListener('submit', (event) => {
    // Отменяем отправку: на GitHub Pages нет сервера для POST
    event.preventDefault();

    if (!validateForm(form)) return;

    form.reset();
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });
}

setupPageForm('order-page-form', 'order-success');
setupPageForm('feedback-form', 'feedback-success');


// ===============================
// 6. Предвыбор товара на странице заказа (order.html?product=...)
// ===============================
const productSelect = document.getElementById('order-product');

if (productSelect) {
  const productId = new URLSearchParams(window.location.search).get('product');

  if (productId && productSelect.querySelector(`option[value="${CSS.escape(productId)}"]`)) {
    productSelect.value = productId;
  }
}
