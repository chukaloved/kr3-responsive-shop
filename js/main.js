// ===============================
// Модальное окно заказа на главной
// ===============================

const orderDialog = document.getElementById('order-dialog');
const orderButtons = document.querySelectorAll('.product-card__button');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');
const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');


// Проверяем, что мы на странице с модальным окном
if (
  orderDialog &&
  closeDialogButton &&
  selectedProductInput &&
  orderForm &&
  successMessage
) {

  // Кнопки «Заказать» в карточках товаров
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product;

      selectedProductInput.value = productName;

      orderDialog.showModal();
    });
  });


  // Закрытие модального окна
  closeDialogButton.addEventListener('click', () => {
    orderDialog.close();
  });


  // Отправка формы в модальном окне
  orderForm.addEventListener('submit', (event) => {

    // Не отправляем POST на сервер
    event.preventDefault();

    // Сбрасываем предыдущие признаки ошибок
    const formElements = Array.from(orderForm.elements);

    formElements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });


    // Проверяем HTML-валидацию
    if (!orderForm.checkValidity()) {

      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });

      orderForm.reportValidity();

      return;
    }


    // Показываем сообщение
    successMessage.hidden = false;

    // Очищаем форму
    orderForm.reset();

    // Закрываем модальное окно
    orderDialog.close();
  });
}



// ===============================
// Отдельная страница заказа
// ===============================

const orderPageForm = document.getElementById('order-page-form');

if (orderPageForm) {

  orderPageForm.addEventListener('submit', (event) => {

    // Отменяем обычную отправку формы
    // и не отправляем POST на GitHub Pages
    event.preventDefault();


    // Показываем сообщение вместо формы
    orderPageForm.innerHTML = `
      <div class="success-message">
        <h2>Заявка успешно отправлена!</h2>

        <p>
          Спасибо за заказ. Мы свяжемся с вами
          для подтверждения.
        </p>

        <a class="button" href="index.html">
          Вернуться на главную
        </a>
      </div>
    `;
  });
}