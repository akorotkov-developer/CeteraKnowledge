<?php
/**
 * Основные параметры WordPress.
 *
 * Скрипт для создания wp-config.php использует этот файл в процессе
 * установки. Необязательно использовать веб-интерфейс, можно
 * скопировать файл в "wp-config.php" и заполнить значения вручную.
 *
 * Этот файл содержит следующие параметры:
 *
 * * Настройки MySQL
 * * Секретные ключи
 * * Префикс таблиц базы данных
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** Параметры MySQL: Эту информацию можно получить у вашего хостинг-провайдера ** //
if (getenv('RUN_MODE', true) === 'development') {
    define('DB_NAME', 'cetera');
    define('DB_USER', 'cetera');
    define('DB_PASSWORD', 'cetera');
    define('DB_HOST', 'db');
    define('DB_CHARSET', 'utf8mb4');
    define('DB_COLLATE', '');
} else {
    /** Имя базы данных для WordPress */
    define('DB_NAME', 'имя базы на сервере');

    /** Имя пользователя MySQL */
    define('DB_USER', 'пользователь на сервер');

    /** Пароль к базе данных MySQL */
    define('DB_PASSWORD', 'пароль на сервере');

    /** Имя сервера MySQL */
    define('DB_HOST', 'localhost');

    /** Кодировка базы данных для создания таблиц. */
    define('DB_CHARSET', 'utf8mb4');

    /** Схема сопоставления. Не меняйте, если не уверены. */
    define('DB_COLLATE', '');
}

// standard stuff