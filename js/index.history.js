const clockDisplay = document.createElement('div');
clockDisplay.classList.add('clock-display');
const historySection = document.querySelector('.history-section');
if (historySection) {
    historySection.prepend(clockDisplay);
} else {

    document.body.prepend(clockDisplay);
}

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    clockDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}


updateClock();
setInterval(updateClock, 1000);



const textModal = document.createElement('div');
textModal.classList.add('text-modal');
textModal.innerHTML = `
    <span class="text-modal-close">&times;</span>
    <div class="text-modal-content">
        <h3>Детальніше про історію нашої компанії</h3>
        
        <p><strong>Початок: Заснування у 1995 році</strong></p>
        <p>Наша подорож розпочалася у невеликій майстерні, де засновники об'єднали пристрасть до традиційних ремесел та інноваційне бачення майбутнього. Перші роки були присвячені пошуку ідеальних матеріалів та унікального стилю, який би виділяв нас серед конкурентів. Ця епоха заклала міцний фундамент для нашої філософії: якість понад усе.</p>

        <p><strong>Епоха Зростання: 2005 - 2015</strong></p>
        <p>Протягом наступного десятиліття ми розширили свою присутність на національному ринку, відкривши п'ять нових філій. Це був час активного впровадження нових технологій виробництва, що дозволило нам не лише збільшити обсяги, а й підтримувати бездоганну якість. Ми пишаємося тим, що навіть під час швидкого зростання ми зберегли повагу до ручної праці.</p>
        
        <p><strong>Сучасність та Майбутнє</strong></p>
        <p>Сьогодні ми є лідером у своїй галузі, обслуговуючи клієнтів по всьому світу. Наше зобов'язання перед клієнтами залишається незмінним: створювати продукти, які не просто відповідають очікуванням, а перевершують їх. Ми продовжуємо інвестувати у сталість та інновації, щоб наступні покоління могли насолоджуватися нашою спадщиною.</p>
    </div>
`;
document.body.appendChild(textModal);

const textModalClose = textModal.querySelector('.text-modal-close');
textModalClose.addEventListener('click', closeTextModal);
textModal.addEventListener('click', e => { if (e.target === textModal) closeTextModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeTextModal(); });

function closeTextModal() {
    textModal.style.display = 'none';
    document.body.style.overflow = '';
}


function openTextModal(e) {
    e.preventDefault();
    textModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}


document.querySelectorAll('.history-text a').forEach(link => {
    link.addEventListener('click', openTextModal);
});



const historyButtons = document.querySelectorAll('.history-buttons button');

historyButtons.forEach((button, index) => {

    button.addEventListener('mouseover', () => button.style.transform = 'scale(1.05)');
    button.addEventListener('mouseout', () => button.style.transform = 'scale(1)');


    if (index === 0) {
        button.addEventListener('click', openTextModal);
    }


    if (index === 1) {
        button.addEventListener('click', () => {
            const quoteSection = document.querySelector('.quote');
            if (quoteSection) {
                quoteSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});


const modalStyle = document.createElement('style');
modalStyle.textContent = `

.clock-display {
    font-family: 'Consolas', monospace; 
    font-size: 28px;
    color: #a67c52; 
    margin-bottom: 20px;
    padding: 10px 20px;
    border: 2px solid #a67c52;
    display: inline-block;
    border-radius: 6px;
    background: #fff;
    letter-spacing: 2px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}


.text-modal {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    justify-content: center;
    align-items: center;
    z-index: 10000;
}


.text-modal-content {
    background: #fff;
    padding: 30px;
    max-width: 600px;
    width: 90%;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    animation: zoomIn 0.3s ease;
    text-align: left; 
    max-height: 80vh; 
    overflow-y: auto;
}

.text-modal-content h3 {
    font-size: 24px;
    color: #a67c52; 
    margin-bottom: 20px;
    text-align: center;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
}

.text-modal-content p {
    color: #333;
    line-height: 1.8;
    margin-bottom: 15px;
    font-size: 15px;
}

.text-modal-content p strong {
    color: #a67c52;
    display: block; 
    margin-top: 20px;
    font-size: 16px;
}


.text-modal .text-modal-close {
    position: absolute;
    top: 20px;
    right: 30px;
    color: #fff;
    font-size: 30px;
    font-weight: bold;
    cursor: pointer;
    text-shadow: 0 0 5px rgba(0,0,0,0.5); 
    z-index: 10001; 
}

.text-modal .text-modal-close:hover {
    color: #a67c52;
}

@keyframes zoomIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}



@media (max-width: 768px) {
    .clock-display {
       
        font-size: 24px;
    }
}

@media (max-width: 480px) {
    .clock-display {
     
        font-size: 20px;
        padding: 8px 15px;
    }
}
`;
document.head.appendChild(modalStyle);