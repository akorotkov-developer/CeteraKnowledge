# Как настроить среду для сборки в Windows 10

1. Поставим последние обновления для windows 10
2. Включим Режим Разработчика (Developer Mode). Без него Windows 10 откажется устанавливать подсистему Ubuntu Linux. Чтобы это сделать, идем в **Пуск > Параметры > Обновление и безопасность > Для разработчиков** и включаем **Режим разработчика**.
3. Теперь включим WSL. Идем **Пуск > Параметры > Система > Приложения и возможности > Программы и компоненты**. В появившемся окне нажимаем **Включение или отключение компонентов Windows**. В появившемся окне ставим галочку рядом с пунктом **Подсистема Linux для Windows (бета-версия)**. Перезагружаемся.
4. Открываем командную строчку (Пуск > Командная строка). Там печатаем bash.
    
    ```
    C:\Users\AwesomeMe> bash
    ```
    
5. Надо будет нажать **Y** и подождать какое-то (10-30 минут) время, пока Windows загрузит и настроит linux-подсистему. Дальше надо будет создать пользователя и пароль. Все это можно посмотреть в [этом видео](https://youtu.be/Mzbgcc68DtM).
6. После этого, устанавливаем git
    
    ```
    awesomeme@MYPC:/mnt/Users/AwesomeMe$ sudo apt-get install git
    ```
    
7. Устанавливаем nodejs 7й версии
    
    ```
    awesomeme@MYPC:/mnt/Users/AwesomeMe$ curl -sL https://deb.nodesource.com/setup_7.x | sudo -e bash
    ...
    awesomeme@MYPC:/mnt/Users/AwesomeMe$ sudo apt-get install nodejs npm
    ```
    
8. Клонируем себе репозиторий проекта, в который нужно внести изменения. Надо будет ввести логин и пароль от gitlab.cetera.ru
    
    ```
    awesomeme@MYPC:/mnt/Users/AwesomeMe$ git clone https://gitlab.cetera.ru/Cetera/PROJECT_CODE.git
    ```
    
9. Идем в каталог с версткой и запускаем сборку
    
    ```
    awesomeme@MYPC:/mnt/Users/AwesomeMe$ сd PROJECT_CODE/working/layout && npm install && npm run minify
    ```
    
10. В каталоге `PROJECT_CODE/working/layout/dist` у вас теперь есть сборка статики из исходников в каталоге `PROJECT_CODE/working/layout`  