document.getElementById('toggle-button').addEventListener('change', function() {
    const extraButton = document.getElementById('extra-button');
    const circleButtons = document.querySelectorAll('.circle-button');
    if (this.checked) {
        extraButton.style.opacity = '1';
        extraButton.style.transform = 'scale(1)';
        circleButtons.forEach(button => {
            button.style.opacity = '1';
            button.style.transform = 'scale(1)';
        });
    } else {
        extraButton.style.opacity = '0';
        extraButton.style.transform = 'scale(0)';
        circleButtons.forEach(button => {
            button.style.opacity = '0';
            button.style.transform = 'scale(0)';
        });
    }
});

function showScreen(screenId) {
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('back-button').classList.add('active');
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function goBack() {
    document.getElementById('main-screen').classList.remove('hidden');
    document.getElementById('back-button').classList.remove('active');
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
}
