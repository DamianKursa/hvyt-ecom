<?php
/**
 * Plugin Name: HVYT Cache Flush
 * Description: Czyści cache Redis sklepu (staging albo produkcja) oraz transienty tej instalacji WordPressa z paska administratora.
 * Version: 1.0.0
 *
 * Instalacja: wp-content/mu-plugins/hvyt-cache-flush.php
 * Katalog mu-plugins trzeba utworzyć ręcznie, jeśli go nie ma.
 *
 * Opcjonalnie w wp-config.php:
 * define('HVYT_CACHE_ENV', 'prod'); // albo 'staging' — która instalacja WP to jest
 * define('HVYT_CACHE_FLUSH_URL', 'https://hvyt.pl/api/cache/flush');
 */

if (!defined('ABSPATH')) {
    exit;
}

final class Hvyt_Cache_Flush_Admin_Bar {
    private const AJAX_ACTION = 'hvyt_flush_cache';
    private const NONCE_ACTION = 'hvyt_flush_cache';

    /** @var array<string, string> */
    private const ENVIRONMENTS = [
        'staging' => 'Staging',
        'prod' => 'Produkcja',
    ];

    /**
     * Prefiksy option_name w wp_options (wartość i timeout).
     * Odpowiadają kluczom z wpml-wc-multilang-product.php.
     *
     * @var string[]
     */
    private const TRANSIENT_PREFIXES = [
        '_transient_wc_slug_to_ids_',
        '_transient_timeout_wc_slug_to_ids_',
        '_transient_wc_multilang_ids_',
        '_transient_timeout_wc_multilang_ids_',
        '_transient_hvyt_page_by_slug_',
        '_transient_timeout_hvyt_page_by_slug_',
    ];

    public static function init(): void {
        add_action('admin_bar_menu', [self::class, 'register_menu'], 80);
        add_action('wp_ajax_' . self::AJAX_ACTION, [self::class, 'handle_ajax']);
        add_action('admin_footer', [self::class, 'print_script']);
        add_action('wp_footer', [self::class, 'print_script']);
    }

    public static function register_menu(WP_Admin_Bar $bar): void {
        if (!current_user_can('manage_options')) {
            return;
        }

        $current = self::current_wp_env();
        $current_label = self::ENVIRONMENTS[$current];

        $bar->add_node([
            'id' => 'hvyt-cache',
            'parent' => 'top-secondary',
            'title' => 'Cache',
            'href' => false,
            'meta' => [
                'title' => 'Ta instalacja WordPressa: ' . $current_label,
            ],
        ]);

        foreach (self::ENVIRONMENTS as $env => $label) {
            $bar->add_node([
                'id' => 'hvyt-cache-flush-' . $env,
                'parent' => 'hvyt-cache',
                'title' => 'Wyczyść ' . $label,
                'href' => '#hvyt-flush-' . $env,
            ]);
        }
    }

    public static function handle_ajax(): void {
        check_ajax_referer(self::NONCE_ACTION, 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Brak uprawnień.'], 403);
        }

        $env = isset($_POST['env']) ? sanitize_key(wp_unslash($_POST['env'])) : '';
        if (!isset(self::ENVIRONMENTS[$env])) {
            wp_send_json_error(['message' => 'Nieznane środowisko.'], 400);
        }

        $label = self::ENVIRONMENTS[$env];
        $parts = [];
        $ok = false;

        $redis = self::flush_redis($env);
        if ($redis['ok']) {
            $ok = true;
            $parts[] = sprintf('Redis „%s”: usunięto %d kluczy.', $label, $redis['deleted']);
        } else {
            $parts[] = sprintf('Redis „%s”: %s', $label, $redis['error']);
        }

        if ($env === self::current_wp_env()) {
            $rows = self::flush_transients();
            $ok = true;
            $parts[] = sprintf('Transienty WordPressa: usunięto %d wierszy.', $rows);
        } else {
            $parts[] = 'Transienty tej instalacji WordPressa pozostawione, bo dotyczą innego środowiska.';
        }

        $message = implode(' ', $parts);
        if (!$ok) {
            wp_send_json_error(['message' => $message], 502);
        }

        wp_send_json_success([
            'message' => $message,
            'env' => $env,
        ]);
    }

    public static function print_script(): void {
        if (!is_admin_bar_showing() || !current_user_can('manage_options')) {
            return;
        }

        $current = self::current_wp_env();
        $config = [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce(self::NONCE_ACTION),
            'action' => self::AJAX_ACTION,
            'envs' => [],
        ];

        foreach (self::ENVIRONMENTS as $env => $label) {
            if ($env === $current) {
                $confirm = sprintf(
                    'Wyczyścić cache „%s”? Zostanie wyczyszczony Redis tego środowiska oraz transienty tej instalacji WordPressa.',
                    $label
                );
            } else {
                $confirm = sprintf(
                    'Wyczyścić Redis „%s”? Transienty tej instalacji WordPressa nie zostaną ruszone.',
                    $label
                );
            }

            $config['envs'][$env] = [
                'confirm' => $confirm,
            ];
        }

        $json = wp_json_encode($config);
        if (!is_string($json)) {
            return;
        }
        ?>
        <script>
        (function () {
            var config = <?php echo $json; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_json_encode ?>;
            var pending = false;

            Object.keys(config.envs).forEach(function (env) {
                var link = document.querySelector('#wp-admin-bar-hvyt-cache-flush-' + env + ' > a');
                if (!link) return;

                link.addEventListener('click', function (event) {
                    event.preventDefault();
                    if (pending) return;
                    if (!window.confirm(config.envs[env].confirm)) return;

                    pending = true;
                    var label = link.textContent;
                    link.textContent = 'Czyszczenie…';

                    var body = new URLSearchParams();
                    body.set('action', config.action);
                    body.set('nonce', config.nonce);
                    body.set('env', env);

                    fetch(config.ajaxUrl, {
                        method: 'POST',
                        credentials: 'same-origin',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        body: body.toString()
                    })
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (payload) {
                            var message = payload && payload.data && payload.data.message
                                ? payload.data.message
                                : 'Nie udało się wyczyścić cache.';
                            window.alert(message);
                        })
                        .catch(function () {
                            window.alert('Nie udało się wyczyścić cache.');
                        })
                        .then(function () {
                            pending = false;
                            link.textContent = label;
                        });
                });
            });
        }());
        </script>
        <?php
    }

    /**
     * @return array{ok: bool, deleted: int, error: string}
     */
    private static function flush_redis(string $env): array {
        $url = add_query_arg(
            [
                'env' => $env,
                'flushAll' => 'true',
            ],
            self::endpoint()
        );

        $response = wp_remote_post($url, [
            'timeout' => 25,
            'headers' => [
                'Accept' => 'application/json',
            ],
        ]);

        if (is_wp_error($response)) {
            return [
                'ok' => false,
                'deleted' => 0,
                'error' => 'nie udało się połączyć z API (' . $response->get_error_message() . ').',
            ];
        }

        $code = (int) wp_remote_retrieve_response_code($response);
        $data = json_decode(wp_remote_retrieve_body($response), true);
        if (!is_array($data)) {
            $data = [];
        }

        if ($code < 200 || $code >= 300 || empty($data['success'])) {
            $error = isset($data['error']) && is_string($data['error'])
                ? $data['error']
                : 'API zwróciło błąd HTTP ' . $code . '.';

            return [
                'ok' => false,
                'deleted' => 0,
                'error' => $error,
            ];
        }

        return [
            'ok' => true,
            'deleted' => isset($data['deleted']) ? (int) $data['deleted'] : 0,
            'error' => '',
        ];
    }

    private static function flush_transients(): int {
        global $wpdb;

        $where = [];
        $args = [];
        foreach (self::TRANSIENT_PREFIXES as $prefix) {
            $where[] = 'option_name LIKE %s';
            $args[] = $wpdb->esc_like($prefix) . '%';
        }

        $sql = "DELETE FROM {$wpdb->options} WHERE " . implode(' OR ', $where);
        $deleted = $wpdb->query($wpdb->prepare($sql, $args));

        if (function_exists('wp_cache_supports') && wp_cache_supports('flush_group')) {
            wp_cache_flush_group('options');
        }

        return (int) $deleted;
    }

    private static function current_wp_env(): string {
        if (defined('HVYT_CACHE_ENV')) {
            $env = sanitize_key((string) HVYT_CACHE_ENV);
            if (isset(self::ENVIRONMENTS[$env])) {
                return $env;
            }
        }

        $url = home_url();
        if (stripos($url, 'staging') !== false) {
            return 'staging';
        }

        return 'prod';
    }

    private static function endpoint(): string {
        $url = defined('HVYT_CACHE_FLUSH_URL')
            ? HVYT_CACHE_FLUSH_URL
            : 'https://hvyt.pl/api/cache/flush';

        return (string) apply_filters('hvyt_cache_flush_url', $url);
    }
}

Hvyt_Cache_Flush_Admin_Bar::init();
