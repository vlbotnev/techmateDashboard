document.addEventListener("DOMContentLoaded", function() {
    function adjustScale() {
        var width = window.innerWidth;
        var height = window.innerHeight;

        var overlayActive = document.getElementById('overlay').style.display !== 'none';

        // Только если разрешение меньше 1920x1080
        if (width < 1920 || height < 1080) {
            var scaleX = width / 1920;
            var scaleY = height / 1080;
            var scale = Math.min(scaleX, scaleY);

            document.getElementById('main-content').style.transform = `scale(${scale})`;
            document.getElementById('main-content').style.transformOrigin = 'top left';
            document.getElementById('main-content').style.width = `${1920 / scale}px`;
            document.getElementById('main-content').style.height = `${1080 / scale}px`;
        } else {
            document.getElementById('main-content').style.transform = 'none';
            document.getElementById('main-content').style.width = '100%';
            document.getElementById('main-content').style.height = '100%';
        }

        updateScroller(); // Обновляем высоту скроллера после каждого изменения масштаба
    }

    function updateScroller() {
        var container = document.getElementById('calls-result-container');
        var containerMail = document.getElementById('mail-result-container');
        if (!container) return;
        if (!containerMail) return;

        var scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
        if (window.innerWidth < 1920 || window.innerHeight < 1080) {
            // Высчитываем высоту контейнера, чтобы скроллер работал правильно
            container.style.height = `${window.innerHeight / scale}px`;
            containerMail.style.height = `${window.innerHeight / scale}px`;
        } else {
            // Если масштаб не применяется, устанавливаем высоту на 100vh
            container.style.height = '100vh';
            containerMail   .style.height = '100vh';
        }
    }

    // Вызываем функцию при загрузке страницы и при изменении размера окна
    window.onload = adjustScale;
    window.onresize = adjustScale;


    document.querySelectorAll('.menu-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));

            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
        });
    });

    let dropArea = document.getElementById('drop-area-audio');
    let dropAreaMail = document.getElementById('drop-area-mail');

    dropArea.addEventListener('dragenter', highlight, false);
    dropArea.addEventListener('dragover', highlight, false);
    dropArea.addEventListener('dragleave', unhighlight, false);
    dropArea.addEventListener('drop', handleDrop, false);

    dropAreaMail.addEventListener('dragenter', highlightMail, false);
    dropAreaMail.addEventListener('dragover', highlightMail, false);
    dropAreaMail.addEventListener('dragleave', unhighlightMail, false);
    dropAreaMail.addEventListener('drop', handleDropMail, false);

    function highlight(e) {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.add('highlight');
    }

    function unhighlight(e) {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.remove('highlight');
    }

    function handleDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.remove('highlight');
      let dt = e.dataTransfer;
      let files = dt.files;
      handleFiles(files);
    }

    function highlightMail(e) {
      e.preventDefault();
      e.stopPropagation();
      dropAreaMail.classList.add('highlight');
    }

    function unhighlightMail(e) {
      e.preventDefault();
      e.stopPropagation();
      dropAreaMail.classList.remove('highlight');
    }

    function handleDropMail(e) {
      e.preventDefault();
      e.stopPropagation();
      dropAreaMail.classList.remove('highlight');
      let dt = e.dataTransfer;
      let files = dt.files;
      handleFilesMail(files);
    }

    let inputElement = document.querySelector('input[type="file"]');
    if (inputElement) {
        inputElement.addEventListener('change', function(event) {
            handleFiles(event.target.files);
        });
    }

    var inputElementMail = document.getElementById('mailfile');
    inputElementMail.addEventListener('change', function(event) {
        handleFilesMail(event.target.files);
    });

    function handleFiles(files) {
      if (files.length > 0) {
        let file = files[0];
        if (file.type.startsWith('audio/')) {
          updateUI(file.name);
          currentFileName = file.name;
        } else {
          alert('Please upload an audio file.');
        }
      }
    }

    function handleFilesMail(files) {
      if (files.length > 0) {
        let file = files[0];
        if (file.name.endsWith('.eml')) {
          updateUIMail(file.name);
          currentFileName = file.name;
        } else {
          alert('Please upload a .eml file.');
        }
      }
    }

    function updateUI(fileName) {
      document.getElementById('drop-down-info-audio').style.display = 'none';
      document.getElementById('audio-file-name').innerHTML = fileName;
      document.getElementById('drop-row-container').style.alignItems = 'center';
      document.querySelector('.audio-file-details').style.display = 'flex';
      document.getElementById('visualization-options-text').style.display = 'block';
      document.getElementById('visualization-options').style.display = 'flex';
      const checkboxes = document.querySelectorAll('.row-container input[type="checkbox"]');
      const analysisButton = document.getElementById('analyze-calls-button');
      analysisButton.style.display = 'block'; // Делаем кнопку видимой
      toggleButtonState(); // Проверяем состояние чекбоксов сразу после загрузки файла

      // Добавляем обработчики для чекбоксов
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', toggleButtonState);
      });

      function toggleButtonState() {
        // Проверяем, активирован ли хотя бы один чекбокс
        const isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

        // Устанавливаем доступность кнопки
        analysisButton.disabled = !isChecked;
      }
    }

    // Получаем все чекбоксы в контейнере
    var checkboxes = document.querySelectorAll('.row-container input[type="checkbox"]');

    // Для каждого чекбокса добавляем обработчик события
    checkboxes.forEach(function(checkbox) {
      checkbox.addEventListener('change', function() {
        if (this.checked) {
          this.parentNode.style.backgroundColor = 'rgba(0, 0, 0, 0.03)'; // изменить фон при выборе
        } else {
          this.parentNode.style.backgroundColor = ''; // очистить фон, если чекбокс не выбран
        }
      });
    });

    function updateUIMail(fileName) {
      document.getElementById('drop-down-info-mail').style.display = 'none';
      document.getElementById('mail-file-name').innerHTML = fileName;
      document.getElementById('drop-row-container-mail').style.alignItems = 'center';
      document.getElementById('mail-file-details').style.display = 'flex';
      analysisButtonMail.style.display = 'block'; // Делаем кнопку видимой
    };

    const analysisButtonMail = document.getElementById('analyze-mail-button');
    const uploadForm = document.getElementById('audio-upload-form');
    const fileInput = uploadForm.querySelector('input[type="file"]');

    document.getElementById('analyze-calls-button').addEventListener('click', function() {
        document.getElementById('overlay').style.display = 'flex';
        rotateSVG();

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        fetch('/start-analysis', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('audio-file-name-result').innerHTML = currentFileName;
            const dialog_transcribed_formatted = data.dialog_transcribed.replace(/\n/g, '<br>');
            const text_analysed_formatted = data.text_analysed.replace(/\n/g, '<br>');
            const general_ranking_formatted = data.general_ranking.replace(/\n/g, '<br>');
            const agreements_formatted = data.agreements.replace(/\n/g, '<br>');
            const score_formatted = data.score.replace(/\n/g, '<br>');
            document.getElementById('audio-analysis-start').style.display = 'none';
            document.getElementById('audio-analysis-results').style.display = 'block';
            document.getElementById('dialogTranscribed').querySelector('.scroll-box').innerHTML = dialog_transcribed_formatted;
            document.getElementById('textAnalysis').querySelector('.scroll-box').innerHTML = text_analysed_formatted;
            document.getElementById('generalRanking').querySelector('.scroll-box').innerHTML = general_ranking_formatted;
            document.getElementById('agreements').querySelector('.scroll-box').innerHTML = agreements_formatted;
            document.getElementById('score').querySelector('.scroll-box').innerHTML = score_formatted;
            downloadUrl = data.excel_link;
            clearInterval(interval)

        })
        .catch(error => {
            document.getElementById('waiting-text').innerHTML = 'Error occurred... Moving back to main page';
            setTimeout(
              () => {
                document.getElementById('overlay').style.display = 'none';
              },
              4 * 1000
            );
        });
    });

    const downloadButton = document.getElementById('download-excel');
    let downloadUrl = ''; // Ссылка на скачивание файла
    downloadButton.addEventListener('click', function() {
        if (downloadUrl) {
            window.location.href = '/download-excel?url=' + encodeURIComponent(downloadUrl); // Перенаправление на URL скачивания файла
        } else {
            alert('Link is not ready yet. Try again later');
        }
    });

    let interval;
    function rotateSVG() {
        const svgElement = document.getElementById('loading-svg');
        let angle = 0;
        interval = setInterval(function() {
            angle = (angle + 90) % 360;  // Увеличиваем угол на 90 каждые 3 секунды
            svgElement.style.transform = `rotate(${angle}deg)`;
        }, 3000);  // 3000 миллисекунд = 3 секунды
    }


    const checkboxes1 = document.querySelectorAll('input[type="checkbox"][name="options"]');

    // Функция для обновления видимости кнопок
    function updateButtonVisibility() {
        checkboxes1.forEach(checkbox => {
            const buttonSelector = checkbox.value; // значение чекбокса соответствует data-target кнопки
            const button = document.querySelector(`button[data-target="${buttonSelector}"]`);
            if (button) {
                if (checkbox.checked) {
                    button.style.display = ''; // Показываем кнопку
                } else {
                    button.style.display = 'none'; // Скрываем кнопку
                }
            }
        });
    }

    // Вешаем событие на изменение состояния каждого чекбокса
    checkboxes1.forEach(checkbox => {
        checkbox.addEventListener('change', updateButtonVisibility);
    });

    // Инициализируем видимость кнопок при загрузке страницы
    updateButtonVisibility();


    const buttons = document.querySelectorAll('.results-buttons-calls');
    const resultBoxes = document.querySelectorAll('.result-box');

    function setActiveButton(button) {
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    function showResultBox(targetId) {
        resultBoxes.forEach(box => {
            box.style.display = 'none'; // Убедитесь, что все блоки скрыты
        });
        const targetBox = document.getElementById(targetId);
        if (targetBox) {
            targetBox.style.display = 'block'; // Показываем нужный блок
        } else {
            console.error('No element found with ID:', targetId); // Логирование ошибки, если элемент не найден
        }
    }

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            setActiveButton(this);
            showResultBox(targetId);
        });
    });

    // Активируем кнопку Transcription по умолчанию
    const defaultButton = document.getElementById('transcription-result-calls');
    if (defaultButton) {
        defaultButton.click();
    } else {
        console.error('Default button not found'); // Логирование ошибки, если кнопка не найдена
    }

    const backButton = document.getElementById('back-button');
    const backButtonMail = document.getElementById('back-button-mail');

    backButton.addEventListener('click', function() {
        document.getElementById('audio-analysis-results').style.display = 'none';
        document.getElementById('audio-analysis-start').style.display = 'block';
    });

    backButtonMail.addEventListener('click', function() {
        document.getElementById('mail-analysis-results').style.display = 'none';
        document.getElementById('mail-analysis-start').style.display = 'block';
    });

    function switchContent(type) {
        // Находим кнопки и контейнеры
        var audioButton = document.getElementById('audio-analysis-button');
        var mailButton = document.getElementById('mail-analysis-button');
        var audioContent = document.getElementById('audio-analysis-content');
        var mailContent = document.getElementById('mail-analysis-content');

        // Убираем класс active и скрываем оба контейнера
        audioButton.classList.remove('active');
        mailButton.classList.remove('active');
        audioContent.style.display = 'none';
        mailContent.style.display = 'none';

        // Активируем нужные элементы в зависимости от выбранного типа
        if (type === 'audio') {
            audioButton.classList.add('active');
            audioContent.style.display = 'block';
        } else {
            mailButton.classList.add('active');
            mailContent.style.display = 'block';
        }
    }

    // Добавляем обработчики событий на кнопки
    document.getElementById('audio-analysis-button').addEventListener('click', function() {
        switchContent('audio');
    });

    document.getElementById('mail-analysis-button').addEventListener('click', function() {
        switchContent('mail');
    });

    analysisButtonMail.addEventListener('click', function() {
        document.getElementById('overlay').style.display = 'flex';
        rotateSVG();

        const formData = new FormData();
        formData.append("file", inputElementMail.files[0]);

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
                        document.getElementById('overlay').style.display = 'none';
                        document.getElementById('mail-file-name-result').innerHTML = currentFileName;

                        json_relevant_items_string = JSON.parse(data.relevant_items_string);
                        json_specifications_string = JSON.parse(data.specifications_string);
                        const formattedJson_relevant_items_string = JSON.stringify(json_relevant_items_string, null, 2);
                        const formattedJson_specifications_string = JSON.stringify(json_specifications_string, null, 2);
                        document.getElementById('relevant-items-mail').querySelector('.scroll-box').innerHTML = `<pre>${formattedJson_relevant_items_string}</pre>`;
                        document.getElementById('specifications-mail').querySelector('.scroll-box').innerHTML = `<pre>${formattedJson_specifications_string}</pre>`;
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
            document.getElementById('waiting-text').innerHTML = 'Error occurred... Moving back to main page';
            setTimeout(
              () => {
                document.getElementById('overlay').style.display = 'none';
              },
              4 * 1000
            );
        });
    });
});

