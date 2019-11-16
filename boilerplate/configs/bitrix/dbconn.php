<?

// standard stuff

if (getenv('RUN_MODE', true) === 'development') {
    $DBHost = "db";
    $DBLogin = "cetera";
    $DBPassword = "cetera";
    $DBName = "cetera";
    $_SERVER["SERVER_PORT"] = "80";
    define('BX_SECURITY_SESSION_MEMCACHE_HOST', 'memcached');
    define('BX_SECURITY_SESSION_MEMCACHE_PORT', 11211);
} else {
    define('BX_SECURITY_SESSION_MEMCACHE_HOST', 'localhost');
    define('BX_SECURITY_SESSION_MEMCACHE_PORT', 11211);
}
