// Управление модальным окном и валидация формы
document.addEventListener('DOMContentLoaded', function() {
    const dlg = document.getElementById('contactDialog');
    const openBtn = document.getElementById('openDialog');
    const closeBtn = document.getElementById('closeDialog');
    const form = document.getElementById('contactForm');
    let lastActive = null;

    // Открытие модального окна
    openBtn?.addEventListener('click', () => {
        lastActive = document.activeElement;
        dlg.showModal(); // модальный режим + затемнение
        dlg.querySelector('input,select,textarea,button')?.focus();
    });

    // Закрытие модального окна
    closeBtn?.addEventListener('click', () => dlg.close('cancel'));

    // Обработка отправки формы
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1) Сброс кастомных сообщений
        [...form.elements].forEach(el => el.setCustomValidity?.(''));
        
        // 2) Проверка встроенных ограничений
        if (!form.checkValidity()) {
            // Пример: таргетированное сообщение для email
            const email = form.elements.email;
            if (email?.validity.typeMismatch) {
                email.setCustomValidity('Введите корректный e-mail, например name@example.com');
            }
            
            // Пример: таргетированное сообщение для телефона
            const phone = form.elements.phone;
            if (phone?.validity.patternMismatch) {
                phone.setCustomValidity('Введите телефон в формате +7 (900) 000-00-00');
            }
            
            form.reportValidity(); // показать браузерные подсказки
            
            // A11y: подсветка проблемных полей
            [...form.elements].forEach(el => {
                if (el.willValidate) el.toggleAttribute('aria-invalid', !el.checkValidity());
            });
            return;
        }
        
        // 3) Успешная «отправка» (без сервера)
        alert('Спасибо! Ваше сообщение отправлено.');
        dlg.close('success');
        form.reset();
    });

    // Возврат фокуса после закрытия модального окна
    dlg?.addEventListener('close', () => { 
        lastActive?.focus(); 
    });

    // Маска для телефона
    const phone = document.getElementById('phone');
    phone?.addEventListener('input', () => {
        const digits = phone.value.replace(/\D/g,'').slice(0,11); // до 11 цифр
        const d = digits.replace(/^8/, '7'); // нормализуем 8 → 7
        const parts = [];
        if (d.length > 0) parts.push('+7');
        if (d.length > 1) parts.push(' (' + d.slice(1,4));
        if (d.length >= 4) parts[parts.length - 1] += ')';
        if (d.length >= 5) parts.push(' ' + d.slice(4,7));
        if (d.length >= 8) parts.push('-' + d.slice(7,9));
        if (d.length >= 10) parts.push('-' + d.slice(9,11));
        phone.value = parts.join('');
    });

    // Строгая проверка телефона
    phone?.setAttribute('pattern', '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$');
});
