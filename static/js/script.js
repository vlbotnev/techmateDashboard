document.addEventListener('DOMContentLoaded', function() {

    const uploadForm = document.getElementById('upload-form');
    const fileInput = uploadForm.querySelector('input[type="file"]');


    function handleFileSelect(event) {
        const filenameDisplay = document.querySelector('.inner-container p');
        if (event.target.files.length === 0) {
            console.error("No file selected.");
            filenameDisplay.textContent = 'Please select an audio file for transcription.';
        } else {
            console.log("File selected: ", event.target.files[0].name);
            filenameDisplay.textContent = event.target.files[0].name;
        }
    }
    fileInput.addEventListener('change', handleFileSelect);

    const fileInputMail = document.querySelector('#upload-form-mail input[type="file"]');

    fileInputMail.addEventListener('change', function() {
        const fileNameDisplay = document.getElementById('mail-file-name');
        if (this.files.length > 0) {
            fileNameDisplay.textContent = this.files[0].name; // Обновляем название файла
        } else {
            fileNameDisplay.textContent = 'Please select a .eml file for analysis'; // Стандартный текст, если файл не выбран
        }
    });

    var animation = lottie.loadAnimation({
        container: document.getElementById('lottie-container'), // Указываем контейнер для анимации
        renderer: 'svg',
        loop: true,
        autoplay: true, // Не начинать автоматическое воспроизведение
        path: '/static/lottie/Animation_-_1721608187797.json' // Путь к файлу анимации
    });

    var mail_animation = lottie.loadAnimation({
        container: document.getElementById('lottie-container-mail'), // Указываем контейнер для анимации
        renderer: 'svg',
        loop: true,
        autoplay: true, // Не начинать автоматическое воспроизведение
        path: '/static/lottie/Animation_-_1721608187797.json' // Путь к файлу анимации
    });


    const audioServiceButton = document.getElementById('audio-transcription-button');
    const mailServiceButton = document.getElementById('msg-analysis-button')

    const callsContainer = document.getElementById('calls-container');
    const mailContainer = document.getElementById('mail-container');

    const analyzeCallsButton = document.getElementById('analyze-calls-button');
    const analyzeMailButton = document.getElementById('analyze-mail-button');

    audioServiceButton.addEventListener('click', function() {
        audioServiceButton.style.backgroundColor = "#9489F5";
        mailServiceButton.style.backgroundColor = "";
        mailContainer.style.display = "none";
        callsContainer.style.display = "block";
        analyzeMailButton.style.display = "none";
        analyzeCallsButton.style.display = "flex";
    });

    mailServiceButton.addEventListener('click', function() {
        mailServiceButton.style.backgroundColor = "#9489F5";
        audioServiceButton.style.backgroundColor = "";
        callsContainer.style.display = "none";
        mailContainer.style.display = "block";
        analyzeMailButton.style.display = "flex";
        analyzeCallsButton.style.display = "none";
    });



    const columnContainer = document.querySelector('.column-container');
    const lottieContainer = document.getElementById('lottie-container');
    const lottieContainerMail = document.getElementById('lottie-container-mail');

    const analysisText = document.getElementById('analysis-text');
    const analysisTextMail = document.getElementById('analysis-text-mail');
    const buttonContainer = document.querySelector('.buttons-container');
    const checkboxes = document.querySelectorAll('.options-container input[type="checkbox"]'); // Получаем все чекбоксы
    const backButton = document.getElementById('back-button');
    const backButtonMail = document.getElementById('back-button-mail');
    const downloadButton = document.getElementById('download-excel');

    //const mainContainer = document.getElementById('main-container');

    const callsResultContainer = document.getElementById('calls-result-container');
    const serviceButtons = document.getElementById('service-buttons');
    const callsResultOptions = document.getElementById('calls-result-options')
    const mailResultOptions = document.getElementById('mail-result-options')

    const selectResultButtonsCalls = document.querySelectorAll('.results-buttons-calls');
    const resultCalls = document.querySelectorAll('.result-box');

    const resultsContainer = document.getElementById('results');
    const resultsContainerMail = document.getElementById('results-mail');

    const buttons = document.querySelectorAll('.results-buttons-calls');
    const generalButton = document.getElementById('general-results-calls');

    let downloadUrl = ''; // Ссылка на скачивание файла

    analyzeCallsButton.addEventListener('click', function() {
        if (fileInput.files.length === 0) {
            console.error("No file selected.");
            alert("Please select a file before analyzing.");
            return;
        }
        callsContainer.style.display = 'none';
        analyzeCallsButton.style.display = 'none';
        callsResultContainer.style.display = 'flex';
        callsResultContainer.style.borderRadius = "20px";
        lottieContainer.style.display = 'block';
        analysisText.style.display = 'block';
        serviceButtons.style.display = 'none';
        callsResultContainer.style.width = "400px";

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        fetch('/start-analysis', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            callsResultOptions.style.display = "block";
            callsResultContainer.style.width = "";
            //callsResultContainer.style.width = "75vw";
            //callsResultContainer.style.height = "65vh";
            callsResultContainer.style.borderTopLeftRadius = "0px"; /* Закругляем правый верхний угол */
            callsResultContainer.style.borderBottomLeftRadius = "0px"; /* Закругляем правый нижний угол */
            lottieContainer.style.display = 'none';
            analysisText.style.display = 'none';
            resultsContainer.style.display = 'flex';
            downloadUrl = data.excel_link
            displayResults(data);
        })
        .catch(error => {
            console.error('Error:', error);

            resultsContainer.innerHTML = 'Error occurred... Moving back to main page';
            resultsContainer.style.display = 'flex';
            resultsContainer.style.width = 'inherit';
            lottieContainer.style.display = 'none';
            analysisText.style.display = 'none';
            setTimeout(
              () => {
                resultsContainer.style.display = 'none';
                callsResultContainer.style.display = 'none';
                callsContainer.style.display = 'flex';
                serviceButtons.style.display = 'flex';
                //buttonContainer.style.display = 'none';
                columnContainer.style.display = 'block';
                analyzeCallsButton.style.display = 'flex';
              },
              4 * 1000
            );
        });
    });


    const mailResultContainer = document.getElementById('mail-result-container');

    analyzeMailButton.addEventListener('click', function() {
      if (fileInputMail.files.length === 0) {
          console.error("No file selected.");
          alert("Please select a file before analyzing.");
          return;
      }
        mailContainer.style.display = 'none';
        analyzeMailButton.style.display = 'none';
        mailResultContainer.style.display = 'flex';
        mailResultContainer.style.borderRadius = "20px";
        lottieContainerMail.style.display = 'block';
        analysisTextMail.style.display = 'block';
        serviceButtons.style.display = 'none';

        const formData = new FormData();
        formData.append("file", fileInputMail.files[0]);

        fetch('/mail-upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Создание второго запроса с использованием имени файла, полученного из первого API
            const request = {
                name: "some request",
                path: "/home/ds/projects/vbotnev/inferit_vbotnevCopy-08-20/eml_processor/"+data.filename, // Имя файла из первого ответа
                date: "2024/08/25"
            };

            return fetch('/mail-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            });
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response data:", data.data.request_id)
            const requestId = data.data.request_id;
            console.log("Request ID:", requestId);
            // Функция для периодической проверки статуса запроса
            function checkRequestStatus() {
                fetch("/mail-analysis-check", {  // Используйте ваш Flask сервер (предполагается, что он работает на порту 5000)
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ request_id: requestId })  // Передаем request_id в теле запроса
                })
                .then(response => response.json())
                .then(data => {
                    if (data.is_ready) {
                        console.log('Запрос готов:', data);
                        mailResultOptions.style.display = "block";
                        mailResultContainer.style.borderTopLeftRadius = "0px"; /* Закругляем правый верхний угол */
                        mailResultContainer.style.borderBottomLeftRadius = "0px"; /* Закругляем правый нижний угол */
                        lottieContainerMail.style.display = 'none';
                        analysisTextMail.style.display = 'none';
                        resultsContainerMail.style.display = 'block';
                        json_relevant_items_string = JSON.parse(data.relevant_items_string);
                        json_specifications_string = JSON.parse(data.specifications_string);
                        const formattedJson_relevant_items_string = JSON.stringify(json_relevant_items_string, null, 2);
                        const formattedJson_specifications_string = JSON.stringify(json_specifications_string, null, 2);
                        document.getElementById('relevant_items').querySelector('.scroll-box').innerHTML = `<pre>${formattedJson_relevant_items_string}</pre>`;
                        document.getElementById('specifications').querySelector('.scroll-box').innerHTML = `<pre>${formattedJson_specifications_string}</pre>`;
                    } else {
                        console.log('Запрос все еще обрабатывается...');
                        setTimeout(checkRequestStatus, 5000); // Повторная проверка через 5 секунд
                    }
                })
                .catch(error => console.error('Ошибка при проверке статуса запроса:', error));
            }

            checkRequestStatus();
        })
        .catch(error => {
            console.error('Ошибка в процессе обработки:', error);
        });
    });





    function displayResults(data) {
    // Обновляем содержимое блоков данными с сервера
    const dialog_transcribed_formatted = data.dialog_transcribed.replace(/\n/g, '<br>');
    const text_analysed_formatted = data.text_analysed.replace(/\n/g, '<br>');
    const general_ranking_formatted = data.general_ranking.replace(/\n/g, '<br>');
    const agreements_formatted = data.agreements.replace(/\n/g, '<br>');
    const score_formatted = data.score.replace(/\n/g, '<br>');
    document.getElementById('dialogTranscribed').querySelector('.scroll-box').innerHTML = dialog_transcribed_formatted;
    document.getElementById('textAnalysis').querySelector('.scroll-box').innerHTML = text_analysed_formatted;
    document.getElementById('generalRanking').querySelector('.scroll-box').innerHTML = general_ranking_formatted;
    document.getElementById('agreements').querySelector('.scroll-box').innerHTML = agreements_formatted;
    document.getElementById('score').querySelector('.scroll-box').innerHTML = score_formatted;

    // Отображение блоков на основе выбранных чекбоксов и активация кнопок
    checkboxes.forEach(checkbox => {
        const resultId = checkbox.value;
        const resultDiv = document.getElementById(resultId);
        const button = document.querySelector(`button[data-target="${resultId}"]`);
        if (checkbox.checked && resultDiv) {
            resultDiv.style.display = 'block';
            button.disabled = false; // Кнопка активна
            button.style.opacity = 1; // Визуальное отображение активности
        } else {
            resultDiv.style.display = 'none';
            button.disabled = true; // Кнопка неактивна
            button.style.opacity = 0.5; // Визуальное отображение неактивности
        }
    });

    // Установка кнопки General активной и отображение всех активных блоков
    generalButton.click();
    generalButton.style.background = 'purple'; // Визуальное выделение
}

    backButton.addEventListener('click', function() {
        callsContainer.style.display = 'block';
        analyzeCallsButton.style.display = 'flex';
        callsResultContainer.style.display = 'none';
        callsResultContainer.style.borderRadius = "0px";
        analysisText.style.display = 'none';
        serviceButtons.style.display = 'flex';
        callsResultOptions.style.display = "none";
        callsResultContainer.style.width = "";
        callsResultContainer.style.height = "";

        resultsContainer.style.display = 'none';
        //buttonContainer.style.display = 'none';
        //columnContainer.style.display = 'block';
        //analyzeCallsButton.style.display = 'block';
    });

    backButtonMail.addEventListener('click', function() {
        mailContainer.style.display = 'block';
        analyzeMailButton.style.display = 'flex';
        mailResultContainer.style.display = 'none';
        serviceButtons.style.display = 'flex';
        mailResultOptions.style.display = "none";
        mailResultContainer.style.borderTopLeftRadius = "0px"; /* Закругляем правый верхний угол */
        mailResultContainer.style.borderBottomLeftRadius = "0px"; /* Закругляем правый нижний угол */
        lottieContainerMail.style.display = 'none';
        analysisTextMail.style.display = 'none';
        resultsContainerMail.style.display = 'none';
    });

    downloadButton.addEventListener('click', function() {
        if (downloadUrl) {
            window.location.href = '/download-excel?url=' + encodeURIComponent(downloadUrl); // Перенаправление на URL скачивания файла
        } else {
            alert('Link is not ready yet. Try again later');
        }
    });

    // Функция для сброса стилей всех кнопок
    function resetButtonStyles() {
        buttons.forEach(button => {
            button.style.background = ''; // Сбрасываем фоновый цвет
            button.style.color = ''; // Сбрасываем цвет текста
        });
    }

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            resetButtonStyles(); // Сбрасываем стили всех кнопок
            this.style.background = 'purple'; // Применяем фиолетовый фон для активной кнопки
            this.style.color = 'white'; // Устанавливаем белый цвет текста для активной кнопки

            const targetId = this.getAttribute('data-target');
            if (targetId) {
                const allResults = document.querySelectorAll('.result-box');
                allResults.forEach(result => result.style.display = 'none'); // Скрываем все блоки
                const targetResult = document.getElementById(targetId);
                if (targetResult) targetResult.style.display = 'block';
            } else {
                // Если нажата кнопка General, показываем все блоки, соответствующие выбранным чекбоксам
                checkboxes.forEach(checkbox => {
                    const resultDiv = document.getElementById(checkbox.value);
                    resultDiv.style.display = checkbox.checked ? 'block' : 'none';
                });
            }
        });
    });

    // Обеспечиваем, чтобы кнопка General изначально была фиолетовой
    generalButton.style.background = 'purple';
    generalButton.style.color = 'white';

    // Код для кнопки General
    generalButton.addEventListener('click', function() {
        resetButtonStyles(); // Сбрасываем стили всех кнопок
        generalButton.style.background = 'purple'; // Применяем фиолетовый фон
        generalButton.style.color = 'white'; // Устанавливаем белый цвет текста

        // Показываем все блоки, соответствующие выбранным чекбоксам
        checkboxes.forEach(checkbox => {
            const resultDiv = document.getElementById(checkbox.value);
            resultDiv.style.display = checkbox.checked ? 'block' : 'none';
        });
    });

});