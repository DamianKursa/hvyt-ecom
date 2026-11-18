<?php

// Register custom strings for WMPL
function register_wpml_strings() {
    do_action( 'wpml_register_single_string', 'hvyt_api', 'Link: logowanie', 'logowanie' );
    do_action( 'wpml_register_single_string', 'hvyt_api', 'Link: potwierdzenie-email', 'potwierdzenie-email' );
    do_action( 'wpml_register_single_string', 'hvyt_api', 'Link: zapomniane-haslo', 'zapomniane-haslo' );
    do_action( 'wpml_register_single_string', 'hvyt_api', 'Komunikat: Rejestracja potwierdzenie', 'Potwierdzenie rejestracji' );
    do_action( 'wpml_register_single_string', 'hvyt_api', 'Komunikat: Rejestracja treść maila', '<b>Dziękujemy za rejestrację.</b><br>Kliknij poniższy link, aby aktywować swoje konto:<br><a href="%s">Aktywuj konto HVYT</a></br>Jeśli nie zakładałeś tego konta, możesz zignorować tę wiadomość.' );
    do_action( 'wpml_register_single_string', 'hvyt_api', 'Komunikat: Nieprawidlowy email', 'Podany adres e-mail nie istnieje.' );
    do_action( 'wpml_register_single_string', 'hvyt_api', 'Komunikat: Błąd generowania linku', 'Nie udało się wygenerować linku resetującego hasło.' );
    do_action( 'wpml_register_single_string', 'hvyt_api', 'Komunikat: Kliknij link resetowania hasła', 'Kliknij poniższy link, aby zresetować hasło: %s' );
    do_action( 'wpml_register_single_string', 'hvyt_api', 'Komunikat: Błąd wysłania emaila', 'Nie udało się wysłać e-maila.' );
    do_action( 'wpml_register_single_string', 'hvyt_api', 'Komunikat: Link resetowania wysłany', 'Link do resetowania hasła został wysłany na podany adres e-mail.' );
    do_action( 'wpml_register_single_string', 'hvyt_api', 'Komunikat: Nieprawidłowy klucz', 'Nieprawidłowy lub przeterminowany klucz.' );
    do_action( 'wpml_register_single_string', 'hvyt_api', 'Komunikat: Nieprawidłowa długość hasła', 'Hasło musi mieć co najmniej 8 znaków.' );
    do_action( 'wpml_register_single_string', 'hvyt_api', 'Komunikat: Nieprawidłowe znakiw w haśle', 'Hasło musi zawierać wielką literę, małą literę, cyfrę i znak specjalny.' );
    do_action( 'wpml_register_single_string', 'hvyt_api', 'Komunikat: Hasło zmienione', 'Hasło zostało pomyślnie zmienione.' );
    do_action( 'wpml_register_single_string', 'hvyt_api', 'Komunikat: Formularz wysłany', 'Formularz został wysłany pomyślnie!' );
    do_action( 'wpml_register_single_string', 'hvyt_api', 'Komunikat: Przekierowanie do płatności', 'Przekierowywanie do płatności... Proszę czekać.' );
    do_action( 'wpml_register_single_string', 'hvyt_api', 'Komunikat: Resetowanie hasła', 'Resetowanie hasła' );
}
add_action( 'init', 'register_wpml_strings' );

/**
 * Frontend shop URL (Next.js), never WordPress home_url().
 * Dynamic preview/local URLs are passed as `origin` in the activation link.
 * Optional wp-config fallbacks: HVYT_FRONTEND_URL_PL, HVYT_FRONTEND_URL_EN.
 */
function hvyt_is_allowed_frontend_origin( $origin ) {
    $parts = wp_parse_url( $origin );
    if ( empty( $parts['scheme'] ) || empty( $parts['host'] ) ) {
        return false;
    }
    if ( ! in_array( strtolower( $parts['scheme'] ), array( 'http', 'https' ), true ) ) {
        return false;
    }

    $host = strtolower( $parts['host'] );

    if ( $host === 'localhost' || $host === '127.0.0.1' || $host === '::1' ) {
        return true;
    }
    if ( filter_var( $host, FILTER_VALIDATE_IP ) && preg_match( '/^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/', $host ) ) {
        return true;
    }
    if ( preg_match( '/(^|\.)vercel\.app$/', $host ) ) {
        return true;
    }
    if ( preg_match( '/(^|\.)hvyt\.(pl|eu)$/', $host ) ) {
        return true;
    }

    return false;
}

function hvyt_sanitize_frontend_origin( $origin ) {
    if ( empty( $origin ) || ! is_string( $origin ) ) {
        return '';
    }

    $origin = trim( wp_unslash( $origin ) );
    if ( ! preg_match( '#^https?://#i', $origin ) ) {
        return '';
    }

    $parts = wp_parse_url( $origin );
    if ( empty( $parts['scheme'] ) || empty( $parts['host'] ) ) {
        return '';
    }

    $clean = strtolower( $parts['scheme'] ) . '://' . strtolower( $parts['host'] );
    if ( ! empty( $parts['port'] ) ) {
        $clean .= ':' . (int) $parts['port'];
    }

    if ( ! hvyt_is_allowed_frontend_origin( $clean ) ) {
        return '';
    }

    return $clean;
}

function hvyt_request_frontend_origin( $request = null ) {
    $candidates = array();

    if ( $request instanceof WP_REST_Request ) {
        $json = $request->get_json_params();
        if ( is_array( $json ) ) {
            if ( ! empty( $json['frontend'] ) ) {
                $candidates[] = $json['frontend'];
            }
            if ( ! empty( $json['origin'] ) ) {
                $candidates[] = $json['origin'];
            }
        }
        $candidates[] = $request->get_param( 'frontend' );
        $candidates[] = $request->get_param( 'origin' );
        $candidates[] = $request->get_header( 'x-hvyt-frontend' );
    }

    if ( ! empty( $_GET['frontend'] ) ) {
        $candidates[] = wp_unslash( $_GET['frontend'] );
    }
    if ( ! empty( $_GET['origin'] ) ) {
        $candidates[] = wp_unslash( $_GET['origin'] );
    }
    if ( ! empty( $_SERVER['HTTP_X_HVYT_FRONTEND'] ) ) {
        $candidates[] = wp_unslash( $_SERVER['HTTP_X_HVYT_FRONTEND'] );
    }

    $candidates[] = get_http_origin();

    foreach ( $candidates as $candidate ) {
        $clean = hvyt_sanitize_frontend_origin( $candidate );
        if ( $clean ) {
            return $clean;
        }
    }

    return '';
}

function hvyt_frontend_base_url( $lang = 'pl', $fallback_origin = '' ) {
    $lang = ( $lang === 'en' ) ? 'en' : 'pl';

    $from_link = hvyt_sanitize_frontend_origin( $fallback_origin );
    if ( $from_link ) {
        return $from_link;
    }

    $origin = hvyt_sanitize_frontend_origin( get_http_origin() );
    if ( $origin ) {
        return $origin;
    }

    if ( $lang === 'en' && defined( 'HVYT_FRONTEND_URL_EN' ) && HVYT_FRONTEND_URL_EN ) {
        return untrailingslashit( HVYT_FRONTEND_URL_EN );
    }
    if ( $lang === 'pl' && defined( 'HVYT_FRONTEND_URL_PL' ) && HVYT_FRONTEND_URL_PL ) {
        return untrailingslashit( HVYT_FRONTEND_URL_PL );
    }

    return $lang === 'en' ? 'https://hvyt.eu' : 'https://hvyt.pl';
}

function hvyt_frontend_url( $page_key, $lang = 'pl', $query = array(), $fallback_origin = '' ) {
    if ( $lang ) {
        do_action( 'wpml_switch_language', $lang );
    }

    $slug_map = array(
        'logowanie'           => __( 'logowanie', 'hvyt_api' ),
        'potwierdzenie-email' => __( 'potwierdzenie-email', 'hvyt_api' ),
        'zapomniane-haslo'    => __( 'zapomniane-haslo', 'hvyt_api' ),
    );
    $slug = isset( $slug_map[ $page_key ] ) ? $slug_map[ $page_key ] : $page_key;

    $url = hvyt_frontend_base_url( $lang, $fallback_origin ) . '/' . ltrim( $slug, '/' );
    if ( ! empty( $query ) ) {
        $url = add_query_arg( $query, $url );
    }

    return $url;
}

// ---------------------------------
// ------ Rejestracja użytkownika
// ---------------------------------

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/register', array(
        'methods' => 'POST',
        'callback' => 'custom_user_registration',
        'permission_callback' => '__return_true', // Allow public access for registration
        'args'                => [
            'lang' => [
                'required'    => false,
                'type'        => 'string',
                'description' => 'Language slug',
				'default'     => 'pl',
				'sanitize_callback' => 'sanitize_key',
            ],
            'origin' => [
                'required'    => false,
                'type'        => 'string',
                'description' => 'Frontend origin (Vercel preview / local)',
            ],
            'frontend' => [
                'required'    => false,
                'type'        => 'string',
                'description' => 'Frontend origin alias',
            ],
        ],
    ));
});

function custom_user_registration($request) {
    $first_name = sanitize_text_field($request['first_name']);
    $last_name  = sanitize_text_field($request['last_name']);
    $email      = sanitize_email($request['email']);
    $password   = sanitize_text_field($request['password']);
	$lang       = sanitize_text_field($request['lang']);
    $frontend_origin = hvyt_request_frontend_origin( $request );

    if (empty($first_name) || empty($last_name) || empty($email) || empty($password)) {
        return new WP_Error('missing_fields', 'All fields are required.', array('status' => 400));
    }

    if (email_exists($email)) {
        return new WP_Error('user_exists', 'User with this email already exists.', array('status' => 400));
    }
	
	do_action('wpml_switch_language', $lang);

// Generate a username
$username = strtolower($first_name . '.' . $last_name);
if ( username_exists($username) ) {
    // Append a random 4-character string if username already exists
    $username .= '.' . wp_generate_password(4, false);
}

$user_id = wp_create_user($username, $password, $email);
if ( is_wp_error($user_id) ) {
    return $user_id;
}


    // Assign the customer role
    $user = new WP_User($user_id);
    $user->set_role('customer');

    // Save first name and last name
    update_user_meta($user_id, 'first_name', $first_name);
    update_user_meta($user_id, 'last_name', $last_name);

    if ( ! empty( $frontend_origin ) ) {
        update_user_meta( $user_id, 'hvyt_frontend_origin', $frontend_origin );
    }

    // Generate and save activation token
    $activation_token = wp_generate_password(20, false);
    update_user_meta($user_id, 'activation_token', $activation_token);

    // Send activation email
    send_activation_email($email, $activation_token, $lang, $frontend_origin);

    return array(
        'user_id' => $user_id,
        'username' => $username,
        'first_name' => $first_name,
        'last_name' => $last_name,
        'email' => $email,
        'frontend_origin' => $frontend_origin,
    );
}

/*STILL WORKING ON AUTHENTICATE*/
function send_activation_email($email, $activation_token, $lang = 'pl', $origin = '') {	
    $query = array(
        'token' => $activation_token,
        'lang'  => $lang,
    );

    $slug = ( $lang === 'en' ) ? 'activate-account' : 'aktywacja-konta';

    if ( $origin ) {
        $activation_link = $origin . '/' . $slug . '?' . http_build_query( $query, '', '&', PHP_QUERY_RFC3986 );
    } else {
        $activation_link = add_query_arg( $query, rest_url( 'custom/v1/activate' ) );
    }
	


  //  $subject = 'Potwierdzenie rejestracji';
  //  $message = "Dziękujemy za rejestrację.\n\nKliknij poniższy link, aby aktywować swoje konto:\n\n";
  //  $message .= $activation_link;
  //  $message .= "\n\nJeśli nie zakładałeś tego konta, możesz zignorować tę wiadomość.";

    wp_mail(
		$email, 
		__('Potwierdzenie rejestracji', 'hvyt_api'), 
		sprintf(__('<b>Dziękujemy za rejestrację.</b><br>Kliknij poniższy link, aby aktywować swoje konto:<br><a href="%s">Aktywuj konto HVYT</a></br>Jeśli nie zakładałeś tego konta, możesz zignorować tę wiadomość.', 'hvyt_api'), $activation_link ),
		['Content-Type: text/html; charset=UTF-8']
	);
}

/**
 * Mark WooCommerce account email as confirmed and link matching guest orders.
 * Native WC 11+ checkbox: "Klient potwierdził, że ten adres email należy do niego."
 */
function hvyt_mark_woocommerce_email_verified( $user_id ) {
    $user_id = absint( $user_id );
    if ( ! $user_id ) {
        return;
    }

    $service_class = '\Automattic\WooCommerce\Internal\CustomerEmailVerification\EmailVerificationService';
    if ( class_exists( $service_class ) && function_exists( 'wc_get_container' ) ) {
        try {
            $service = wc_get_container()->get( $service_class );
            if ( $service && method_exists( $service, 'mark_verified' ) ) {
                $service->mark_verified( $user_id );
                return;
            }
        } catch ( Throwable $e ) {
            // Fall through to the meta + order-link fallback.
        }
    }

    $user = get_user_by( 'id', $user_id );
    if ( ! $user || empty( $user->user_email ) ) {
        return;
    }

    $verified_email = strtolower( $user->user_email );
    $users_class    = '\Automattic\WooCommerce\Internal\Utilities\Users';
    if ( class_exists( $users_class ) && method_exists( $users_class, 'update_site_user_meta' ) ) {
        $users_class::update_site_user_meta( $user_id, '_wc_email_verified', $verified_email );
    } else {
        update_user_meta( $user_id, '_wc_email_verified', $verified_email );
    }

    do_action( 'woocommerce_customer_email_verified', $user_id );

    if ( function_exists( 'wc_update_new_customer_past_orders' ) && ! has_action( 'woocommerce_customer_email_verified', 'wc_update_new_customer_past_orders' ) ) {
        wc_update_new_customer_past_orders( $user_id );
    }
}

function verify_activation_token_redirect($request) {
    $token = sanitize_text_field($request['token']);
	$lang  = sanitize_text_field($request->get_param('lang'));
	if ( $lang !== 'en' ) {
		$lang = 'pl';
	}

    $origin = hvyt_request_frontend_origin( $request );

    // Find the user by activation token
    $user_query = new WP_User_Query(array(
        'meta_key' => 'activation_token',
        'meta_value' => $token,
        'number' => 1,
    ));

    $users = $user_query->get_results();

    if (empty($users)) {
        wp_redirect( hvyt_frontend_url( 'logowanie', $lang, array( 'error' => 'invalid_token' ), $origin ) );
        exit;
    }

    $user_id = $users[0]->ID;

    // Remove the activation token and mark user as active
    delete_user_meta($user_id, 'activation_token');
    update_user_meta($user_id, 'is_active', 'true');
    hvyt_mark_woocommerce_email_verified( $user_id );

    if ( ! $origin ) {
        $origin = get_user_meta( $user_id, 'hvyt_frontend_origin', true );
    }

    wp_redirect( hvyt_frontend_url(
        'potwierdzenie-email',
        $lang,
        array( 'success' => 'account_activated' ),
        $origin
    ) );
    exit;
}


add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/activate', array(
        'methods' => 'GET',
        'callback' => 'verify_activation_token_redirect',
        'permission_callback' => '__return_true', // No auth required for activation
        'args'                => [
            'lang' => [
                'required'    => false,
                'type'        => 'string',
                'description' => 'Language slug',
				'default'     => 'pl',
				'sanitize_callback' => 'sanitize_key',
            ],
            'origin' => [
                'required'    => false,
                'type'        => 'string',
                'description' => 'Frontend origin (Vercel preview / local)',
            ],
        ],
    ));
});

/*
add_filter('authenticate', function ($user, $username, $password) {
    if (is_a($user, 'WP_User')) {
        $is_active = get_user_meta($user->ID, 'is_active', true);

        if ($is_active !== 'true') {
            return new WP_Error(
                'account_inactive',
                __('Your account is not active. Please check your email to activate your account.')
            );
        }
    }
    return $user;
}, 20, 3);	
*/
/*STILL WORKING ON AUTHENTICATE*/

/**PASSWORD RESET*/

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/reset-password', [
        'methods' => 'POST',
        'callback' => 'send_custom_password_reset_link',
        'permission_callback' => '__return_true',
        'args'                => [
            'lang' => [
                'required'    => false,
                'type'        => 'string',
                'description' => 'Language slug',
				'default'     => 'pl',
				'sanitize_callback' => 'sanitize_key',
            ],			
        ],		
    ]);

    register_rest_route('custom/v1', '/reset-password-confirm', [
        'methods' => 'POST',
        'callback' => 'custom_reset_password',
        'permission_callback' => '__return_true',
        'args'                => [
            'lang' => [
                'required'    => false,
                'type'        => 'string',
                'description' => 'Language slug',
				'default'     => 'pl',
				'sanitize_callback' => 'sanitize_key',
            ],			
        ],		
    ]);
});

// Function to send reset password link
function send_custom_password_reset_link($request) {
    $email = sanitize_email($request->get_param('email'));
	$lang  = sanitize_text_field($request->get_param('lang'));
	
	do_action('wpml_switch_language', $lang);
	
    if (!email_exists($email)) {
		// $t[$lang]['auth']['wrong_email']
        return new WP_Error('invalid_email', __('Podany adres e-mail nie istnieje.', 'hvyt_api'), ['status' => 404]);
    }

    $user = get_user_by('email', $email);
    $reset_key = get_password_reset_key($user);

    if (is_wp_error($reset_key)) {
        return new WP_Error('reset_error', __('Nie udało się wygenerować linku resetującego hasło.', 'hvyt_api'), ['status' => 500]);
    }

   $reset_url = hvyt_frontend_url(
        'zapomniane-haslo',
        $lang,
        array(
            'key'   => $reset_key,
            'login' => $user->user_login,
        ),
        get_http_origin()
    );

    $subject = __('Resetowanie hasła', 'hvyt_api');
    $message = sprintf(__('Kliknij poniższy link, aby zresetować hasło: %s', 'hvyt_api'), $reset_url);

    $mail_sent = wp_mail($email, $subject, $message);

    if (!$mail_sent) {
        return new WP_Error('mail_error', __('Nie udało się wysłać e-maila.', 'hvyt_api'), ['status' => 500]);
    }

    return [
        'success' => true,
        'message' => __('Link do resetowania hasła został wysłany na podany adres e-mail.', 'hvyt_api'),
    ];
}

// Function to reset password
function custom_reset_password($request) {
    $key   = sanitize_text_field($request->get_param('key'));
    $login = sanitize_text_field($request->get_param('login'));
    $lang  = sanitize_text_field($request->get_param('lang'));
    $password = $request->get_param('password');

    $user = check_password_reset_key($key, $login);
	
	do_action('wpml_switch_language', $lang);

    if (is_wp_error($user)) {
        return new WP_Error('invalid_key', __('Nieprawidłowy lub przeterminowany klucz.', 'hvyt_api'), ['status' => 400]);
    }

    // Password validation
    if (empty($password) || strlen($password) < 8) {
        return new WP_Error('invalid_password', __('Hasło musi mieć co najmniej 8 znaków.', 'hvyt_api'), ['status' => 400]);
    }
    if (!preg_match('/[A-Z]/', $password) || !preg_match('/[a-z]/', $password) || !preg_match('/[0-9]/', $password) || !preg_match('/[\W_]/', $password)) {
        return new WP_Error('invalid_password', __('Hasło musi zawierać wielką literę, małą literę, cyfrę i znak specjalny.', 'hvyt_api'), ['status' => 400]);
    }

    wp_set_password($password, $user->ID);

    return [
        'success' => true,
        'message' => __('Hasło zostało pomyślnie zmienione.', 'hvyt_api'),
    ];
}
/*KONTAKT FORM*/
function register_contact_form_route() {
  register_rest_route('custom/v1', '/contact', [
    'methods'             => 'POST',
    'callback'            => 'handle_contact_form_submission',
    'permission_callback' => '__return_true', // Adjust permission as needed
	'args'                => [
		'lang' => [
			'required'    => false,
			'type'        => 'string',
			'description' => 'Language slug',
			'default'     => 'pl',
			'sanitize_callback' => 'sanitize_key',
		],			
	],	
  ]);
}
add_action('rest_api_init', 'register_contact_form_route');

function handle_contact_form_submission( WP_REST_Request $request ) {
  $lang  = sanitize_text_field($request->get_param('lang'));	
	
  // Sanitize and retrieve form data
  $name    = sanitize_text_field( $request->get_param('name') );
  $email   = sanitize_email( $request->get_param('email') );
  $message = sanitize_textarea_field( $request->get_param('message') );
  
  do_action('wpml_switch_language', $lang);

	
  $to      = 'hello@hvyt.pl';
  $subject = 'HVYT| Formularz kontaktowy';
  $body    = "Name: $name\nEmail: $email\nMessage: $message";
  wp_mail( $to, $subject, $body );

return new WP_REST_Response( [ 'success' => true, 'message' => __('Formularz został wysłany pomyślnie!', 'hvyt_api') ], 200 );

}


//Wait list */



add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/waiting-list', array(
        'methods'             => 'POST',
        'callback'            => 'custom_waiting_list_callback',
        'permission_callback' => '__return_true', // Adjust permissions as needed
    ));
});

function custom_waiting_list_callback(WP_REST_Request $request) {
    $email      = sanitize_email($request->get_param('email'));
    $product_id = absint($request->get_param('product_id'));

    if ( !is_email($email) || !$product_id ) {
        return new WP_Error('invalid_params', 'Invalid email or product ID', array('status' => 400));
    }

    // Use the global function provided by the YITH Waiting List free version
    if ( function_exists('yith_wcwl_add_to_waitinglist') ) {
        $result = yith_wcwl_add_to_waitinglist( $email, $product_id );
        if ( $result ) {
            return rest_ensure_response( array('message' => 'Email added to waiting list.') );
        }
    }
    
    return new WP_Error('add_failed', 'Could not add email to waiting list', array('status' => 500));
}

// Disable nonce verification for YITH WooCommerce Waiting List AJAX calls
add_filter('yith_wcwl_disable_ajax_nonce', '__return_true');




/*ORDERS VIEWS*/
add_filter( 'woocommerce_rest_shop_order_object_query', 'customize_customer_orders_query', 10, 2 );
function customize_customer_orders_query( $args, $request ) {
    // If the current user is not a shop manager (or administrator)
    if ( ! current_user_can( 'manage_woocommerce' ) ) {
        $current_user_id = get_current_user_id();
        // Force the query to only return orders for the current user.
        $args['customer'] = $current_user_id;
    }
    return $args;
}

add_filter( 'woocommerce_rest_check_permissions', 'customize_woocommerce_orders_permissions', 10, 4 );
function customize_woocommerce_orders_permissions( $permission, $context, $object_id, $post_type ) {
    // Only modify permission checks for shop orders in read context.
    if ( 'shop_order' === $post_type && 'read' === $context ) {
        $current_user_id = get_current_user_id();
        // For collection requests (listing orders) where no specific order ID is requested.
        if ( empty( $object_id ) ) {
            return true; // Allow the request if the user is logged in.
        } else {
            // For single order retrieval, allow only if the order belongs to the current user.
            $order = wc_get_order( $object_id );
            if ( $order && $order->get_customer_id() === $current_user_id ) {
                return true;
            }
        }
    }
    return $permission;
}


function my_order_pay_overlay() {
    // Check if the current URL is an order-pay endpoint
    if ( function_exists( 'is_wc_endpoint_url' ) && is_wc_endpoint_url( 'order-pay' ) ) {
        ?>
        <!-- Inline CSS for fullscreen overlay -->
        <style>
            #global-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: #ffffff; 
                z-index: 99999999999 !important;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: #333;
            }
        
            header, footer {
                display: none !important;
            }
        </style>

        <!-- Overlay Markup -->
        <div id="global-overlay">
            <div><?php echo __('Przekierowywanie do płatności... Proszę czekać.', 'hvyt_api'); ?></div>
        </div>

        <!-- Auto-redirect Script -->
        <script>
        (function() {

            function appendOverlay() {
                if (document.body) {
                    var overlay = document.getElementById('global-overlay');

                    if (!overlay) {
                        overlay = document.createElement('div');
                        overlay.id = 'global-overlay';
                        overlay.innerHTML = '<div><?php echo __('Przekierowywanie do płatności... Proszę czekać.', 'hvyt_api'); ?></div>';
                        document.body.appendChild(overlay);
                    }

                    setTimeout(function() {
                        var payOrderButton = document.getElementById('place_order');
                        if (payOrderButton) {
                            payOrderButton.click();
                        } else {
                            console.log("place_order button not found");
                        }
                    }, 500); 
                } else {
                    setTimeout(appendOverlay, 50);
                }
            }
            window.addEventListener('load', appendOverlay, false);
        })();
        </script>
        <?php
    }
}
add_action( 'wp_footer', 'my_order_pay_overlay' );

// --------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------

// ---------------------------------
// ------ Język z parametrze dla CPT Kolekcje 
// ---------------------------------
function wpml_rest_api_filter_by_language($args, $request) {
    $lang = $request->get_param('lang');
    
    if (!empty($lang)) {
        do_action('wpml_switch_language', $lang);
        
        $args['suppress_filters'] = false;
    }
    
    return $args;
}

add_filter('rest_kolekcje_query', 'wpml_rest_api_filter_by_language', 10, 2);

/**
 * Plugin Name: WC Products Multilang API (WPML)
 */


add_action('rest_api_init', function () {
    register_rest_route('api/v1', '/product-multilang', [
        'methods'  => 'GET',
        'callback' => 'wc_product_multilang_api',
        'args'                => [
            'id' => [
                'required'    => true,
                'type'        => 'integer',
                'description' => 'Product ID',
            ],			
        ],		
        'permission_callback' => '__return_true',
    ]);
});


// ---------------------------------
// ------ pobranie slugów oraz id produktu na podstawie SLUGa 
// ---------------------------------

add_action('rest_api_init', function () {
    register_rest_route('api/v1', '/product-id-by-slug', [
        'methods'  => 'GET',
        'callback' => 'wc_product_id_by_slug_api',
        'args'                => [
            'slug' => [
                'required'    => true,
                'type'        => 'string',
                'description' => 'Product slug',
				'sanitize_callback' => 'sanitize_key',
            ],			
        ],		
        'permission_callback' => '__return_true',
    ]);
});

function wc_product_multilang_api(WP_REST_Request $request) {
    $id = sanitize_title($request->get_param('id'));

    if (!$id) {
        return new WP_Error('missing_id', 'Missing product id', ['status' => 400]);
    }
	
    $cache_key = 'wc_multilang_ids_' . md5((string) $id);
    $cached = get_transient($cache_key);

    if ($cached !== false) {
        return $cached;
    }


    $post_id = $id;

    if (!$post_id) {
        return new WP_Error('not_found', 'Product not found', ['status' => 404]);
    }

    $trid = apply_filters('wpml_element_trid', null, $post_id, 'post_product');
    if (!$trid) {
        return new WP_Error('no_trid', 'No WPML translations', ['status' => 404]);
    }

    $translations = apply_filters(
        'wpml_get_element_translations',
        null,
        $trid,
        'post_product'
    );

    $ids   = [];
	$slugs = [];
	
    foreach ($translations as $lang => $data) {
		$slugs[$lang] = get_post_field( 'post_name', ( int ) $data->element_id );
        $ids[$lang] = ( int ) $data->element_id;
    }
	
    $response = [
        'slugs' => $slugs,
        'ids'  => $ids,
    ];

    // cache 12h
    set_transient($cache_key, $response, 12 * HOUR_IN_SECONDS);

    return $response;
}

function wc_product_id_by_slug_api(WP_REST_Request $request) {
    $slug = sanitize_title($request->get_param('slug'));

    if (!$slug) {
        return new WP_Error('missing_slug', 'Missing product slug', ['status' => 400]);
    }
	
    $cache_key = 'wc_slug_to_ids_' . md5($slug);
    $cached = get_transient($cache_key);

    if ($cached !== false) {
        return $cached;
    }


    $post_id = find_product_id_by_slug_any_language($slug);

    if (!$post_id) {
        return new WP_Error('not_found', 'Product not found', ['status' => 404]);
    }

    $trid = apply_filters('wpml_element_trid', null, $post_id, 'post_product');
    if (!$trid) {
        return new WP_Error('no_trid', 'No WPML translations', ['status' => 404]);
    }

    $translations = apply_filters(
        'wpml_get_element_translations',
        null,
        $trid,
        'post_product'
    );

    $ids   = [];
	$slugs = [];
	
    foreach ($translations as $lang => $data) {
		$slugs[$lang] = get_post_field( 'post_name', ( int ) $data->element_id );
        $ids[$lang] = ( int ) $data->element_id;
    }
	
    $response = [
        'slugs' => $slugs,
        'ids'  => $ids,
    ];

    // cache 12h
    set_transient($cache_key, $response, 12 * HOUR_IN_SECONDS);

    return $response;
}

function wc_api_authenticate_request() {
     $user_id = get_current_user_id();

    if (!$user_id) {
        return new WP_Error(
            'woocommerce_rest_cannot_view',
            'Unauthorized',
            ['status' => 401]
        );
    }

    return true;
}

function find_product_id_by_slug_any_language(string $slug): int {
    global $wpdb;

    return (int) $wpdb->get_var(
        $wpdb->prepare(
            "SELECT ID FROM {$wpdb->posts}
             WHERE post_name = %s
             AND post_type = 'product'
             AND post_status = 'publish'
             LIMIT 1",
            $slug
        )
    );
}



// ---------------------------------
// ------ lista atrybutów z kategorii 
// ---------------------------------

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/attributes', [
        'methods'             => 'GET',
        'callback'            => 'get_filtered_attributes',
        'permission_callback' => '__return_true',
        'args'                => [
            'category' => [
                'required'    => true,
                'type'        => 'integer',
                'description' => 'Category ID',
            ],
            'lang' => [
                'required'    => false,
                'type'        => 'string',
                'description' => 'Language slug',
				'default'     => 'pl',
				'sanitize_callback' => 'sanitize_key',
            ],			
        ],
    ]);
});


function get_filtered_attributes($data) {
    $category_id = $data['category'];
	$lang = $data['lang'] ?? 'pl';

    // Fetch all products in the given category
	
	// Switch language
	do_action('wpml_switch_language', $lang);

    $query = new WP_Query([
        'post_type'      => 'product',
        'posts_per_page' => -1,
        'fields'         => 'ids', // Fetch only IDs for performance
        'tax_query'      => [
            [
                'taxonomy' => 'product_cat',
                'field'    => 'term_id',
                'terms'    => $category_id,
            ],
        ],
		'suppress_filters' => false,
    ]);
	
	// Restore original language
	do_action('wpml_switch_language', null);

    $product_ids = $query->posts;

    // Ensure there are products in the category
    if (empty($product_ids)) {
        return new WP_REST_Response([], 200); // Return an empty array if no products
    }

    // Fetch attributes related to the products
    $attributes = wc_get_attribute_taxonomies();
    $response = [];

/*
    foreach ($attributes as $attribute) {
        $taxonomy = 'pa_' . $attribute->attribute_name;

        // Get terms associated with the products for this attribute
        $terms = wp_get_object_terms($product_ids, $taxonomy, ['fields' => 'all']);
        if (!empty($terms) && !is_wp_error($terms)) {
            $response[] = [
                'id'      => $attribute->attribute_id,
                'name'    => $attribute->attribute_label,
                'slug'    => $attribute->attribute_name,
                'options' => array_map(function ($term) {
                    return [
                        'id'   => $term->term_id,
                        'name' => $term->name,
                        'slug' => $term->slug,
                    ];
                }, $terms),
            ];
        }
    }
*/
	
	foreach ($attributes as $attribute) {
		$taxonomy = 'pa_' . $attribute->attribute_name;
		
		// Użyj wp_get_object_terms z filtrami WPML
		$terms = wp_get_object_terms($product_ids, $taxonomy, ['fields' => 'all']);
		
		if ( !empty( $terms ) && !is_wp_error( $terms ) ) {
			
			// Pobierz przetłumaczoną nazwę atrybutu
			
			$translated_label = apply_filters(
				'wpml_translate_single_string',
				$attribute->attribute_label,
				'WordPress',
				'taxonomy singular name: ' . $attribute->attribute_label,
				$lang
			);
			
			// Pobierz przetłumaczone termy
			$translated_terms = [];
			
			foreach ($terms as $term) {
				
				// Użyj filtru WPML do tłumaczenia termów
				$translated_term = apply_filters('wpml_get_term', null, $term->term_id, $taxonomy);
				
				if ( $translated_term && !is_wp_error( $translated_term ) ) {
					$translated_terms[] = [
						'id'   => $term->term_id,
						'name' => $translated_term->name,
						'slug' => $translated_term->slug,

					];
				} else {
					$translated_terms[] = [
						'id'   => $term->term_id,
						'name' => $term->name,
						'slug' => $term->slug,

					];
				}
			}
		
			// Usuń duplikaty (jeśli jakieś się pojawiły)
			
			$translated_terms = array_map("unserialize", 
				array_unique(array_map("serialize", $translated_terms))
			);
			
			
			$response[] = [
				'id'      => $attribute->attribute_id,
				'name'    => $translated_label,
				'slug'    => $attribute->attribute_name,
				'options' => array_values($translated_terms),
			];
		}
	}	

    return new WP_REST_Response($response, 200);
}


// ---------------------------------
// ------ lista przefiltrowane produkty 
// ---------------------------------


add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/filtered-products', [
        'methods' => 'GET',
        'callback' => 'get_filtered_products',
        'permission_callback' => '__return_true',
        'args' => [
            'category' => [
                'required' => true,
                'type' => 'string',
                'description' => 'Category slug or ID',
            ],
            'attributes' => [
                'required' => false,
                'type' => 'array',
                'description' => 'List of attributes to filter by',
                'items' => [
                    'type' => 'object',
                    'properties' => [
                        'key' => ['type' => 'string'],
                        'value' => ['type' => 'string'],
                    ],
                ],
            ],
            'per_page' => [
                'required' => false,
                'type' => 'integer',
                'default' => 20,
                'sanitize_callback' => 'absint',
            ],
            'page' => [
                'required' => false,
                'type' => 'integer',
                'default' => 1,
                'sanitize_callback' => 'absint',
            ],
            'lang' => [
                'required' => false,
                'type' => 'string',
                'default' => 'pl',
                'sanitize_callback' => 'sanitize_key',
            ],			
        ],
    ]);
});

function get_filtered_products($data) {
    $category_id = $data['category'];
    $attributes = $data['attributes'] ?? [];
    $per_page = $data['per_page'] ?? 20;
    $page = $data['page'] ?? 1;
    $min_price = isset($data['min_price']) ? (float) $data['min_price'] : 0;
    $max_price = isset($data['max_price']) ? (float) $data['max_price'] : PHP_INT_MAX;
	$lang = $data['lang'] ?? 'pl';

    // Separate category query to prevent conflicts
    $tax_query = [
        [
            'taxonomy' => 'product_cat',
            'field' => 'id',
            'terms' => $category_id,
        ],
    ];

    // Attribute queries should be OR-based
    $attribute_queries = [];

    if (!empty($attributes)) {
        foreach ($attributes as $attribute) {
            $attribute_queries[] = [
                'taxonomy' => $attribute['key'], // Example: 'pa_color'
                'field' => 'slug',
                'terms' => $attribute['value'],
                'operator' => 'IN', // At least one of the selected values
            ];
        }
    }

    if (!empty($attribute_queries)) {
        $tax_query[] = [
            'relation' => 'AND', // Ensure OR logic applies to attributes
            ...$attribute_queries, // Merge all attribute conditions
        ];
    }

    // Build meta_query for price range
    $meta_query = [
        [
            'key' => '_price',
            'value' => [$min_price, $max_price],
            'compare' => 'BETWEEN',
            'type' => 'NUMERIC',
        ],
    ];

    $args = [
        'post_type' => 'product',
        'posts_per_page' => $per_page,
        'paged' => $page,
        'tax_query' => $tax_query,
        'meta_query' => $meta_query,
		'lang' => $lang,
		 'suppress_filters' => false,
    ];

	do_action('wpml_switch_language', $lang);
    
	$query = new WP_Query($args);
	
	do_action('wpml_switch_language', null);

    $products = [];
	
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
			
			$product = wc_get_product( get_the_ID() );
			
			if($product->get_price() < $min_price || $product->get_price() > $max_price) {
				continue;
			}

            $images = [];
            $main_image = wp_get_attachment_image_src($product->get_image_id(), 'full');
			
            if ($main_image) {
                $images[] = ['src' => $main_image[0]];
            }

            $gallery_image_ids = $product->get_gallery_image_ids();
			
            if (!empty($gallery_image_ids)) {
                foreach ($gallery_image_ids as $gallery_image_id) {
                    $image_url = wp_get_attachment_image_src($gallery_image_id, 'full');
                    if ($image_url) {
                        $images[] = ['src' => $image_url[0]];
                    }
                }
            }

            if (empty($images)) {
                $images[] = ['src' => '/path-to-fallback-image.jpg'];
            }

            $products[] = [
                'id' => $product->get_id(),
                'slug' => $product->get_slug(),
                'name' => $product->get_name(),
                'price' => $product->get_price(),
                'attributes' => $product->get_attributes(),
                'images' => $images,
				
            ];
        }
    }
    wp_reset_postdata();

    return new WP_REST_Response([
        'products' => $products,
        'total' => $query->found_posts,
    ], 200);
}


// ---------------------------------
// ------ Konto użytkownika 
// ---------------------------------

add_action('rest_api_init', function () {
    register_rest_route('custom-api/v1', '/user-data', [
        'methods'  => 'GET',
        'callback' => 'get_user_data',
        'permission_callback' => function () {
            return is_user_logged_in(); // Only allow logged-in users
        },
    ]);
});

function get_user_data() {
    $current_user = wp_get_current_user();

    if (!$current_user || $current_user->ID === 0) {
        return new WP_Error('unauthorized', 'You must be logged in to access this data', ['status' => 401]);
    }

    return [
        'firstName' => get_user_meta($current_user->ID, 'first_name', true),
        'lastName'  => get_user_meta($current_user->ID, 'last_name', true),
        'email'     => $current_user->user_email,
    ];
}
add_action('rest_api_init', function () {
    register_rest_route('custom-api/v1', '/user-data/(?P<id>\d+)', array(
        'methods' => 'PUT',
        'callback' => 'update_user_data',
'permission_callback' => function ($request) {
    $user_id = get_current_user_id();
    $target_user_id = $request->get_param('id');
    return current_user_can('edit_user') || (int) $user_id === (int) $target_user_id;
},

    ));
});

function update_user_data($request) {
    $id = $request->get_param('id');
    $firstName = sanitize_text_field($request->get_param('firstName'));
    $lastName = sanitize_text_field($request->get_param('lastName'));
    $email = sanitize_email($request->get_param('email'));
	$phone = sanitize_text_field($request->get_param('phone'));

    $user_data = array(
        'ID' => $id,
        'first_name' => $firstName,
        'last_name' => $lastName,
        'user_email' => $email,
    );

    $updated = wp_update_user($user_data);
	
	// update phone in Woocommerce
	update_user_meta( $id, 'billing_phone', $phone );

    if (is_wp_error($updated)) {
        return new WP_Error('update_failed', 'Failed to update user data', array('status' => 500));
    }

    return rest_ensure_response(array('message' => 'User updated successfully'));
}


// ---------------------------------
// ------ Kupony 
// ---------------------------------

/**
 * Endpoint: GET /wp-json/custom-api/v1/coupon/{code_or_id}?currency=EUR
 *
 * Zwraca pełne dane kuponu WooCommerce z kwotami przeliczonymi na wybraną walutę przez WCML.
 * Jeśli parametr ?currency nie zostanie podany, używa domyślnej waluty sklepu.
 */
add_action('rest_api_init', function () {

    register_rest_route('api/v1', '/coupon', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'args' => [
            'code' => [
                'required'          => true,
                'validate_callback' => function ($value) {
                    return ! empty($value);
                },
				'sanitize_callback' => 'sanitize_text_field',
            ],
            'currency' => [
                'required'          => false,
                'default'           => null,
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'lang' => [
                'required'          => false,
                'default'           => null,
                'sanitize_callback' => 'sanitize_text_field',
            ],			
        ],
        'callback' => 'wcml_rest_get_coupon_with_currency',
    ]);

});

function wcml_rest_get_coupon_with_currency(WP_REST_Request $request) {

    $coupon_param = $request->get_param('code');
    $currency     = $request->get_param('currency');
	$lang         = $request->get_param( 'lang' );

    // Wymuś załadowanie multi-currency WCML (potrzebne w kontekście REST/AJAX)
    do_action('wcml_load_multi_currency_in_ajax');

    // Pobierz kupon — przyjmujemy kod lub ID
    if (is_numeric($coupon_param)) {
        $coupon = new WC_Coupon((int) $coupon_param);
    } else {
        $coupon = new WC_Coupon($coupon_param);
    }

    if (! $coupon->get_id()) {
        return new WP_Error(
            'coupon_not_found',
            sprintf('Kupon "%s" nie istnieje.', $coupon_param),
            ['status' => 404]
        );
    }

    // --- Ustal walutę docelową ---
    $default_currency = get_woocommerce_currency();
    $resolved_by      = 'default';

    if ( ! empty( $lang ) && $lang !== 'pl' ) {
        // Tryb: język → waluta
        $currency_from_lang = wcml_get_currency_by_language( $lang );

        if ( empty( $currency_from_lang ) ) {
            return new WP_Error(
                'language_currency_not_found',
                sprintf( 'Nie znaleziono waluty przypisanej do języka "%s" w ustawieniach WCML.', $lang ),
                [ 'status' => 422 ]
            );
        }

        $target_currency = $currency_from_lang;
        $resolved_by     = 'language';

    } elseif ( ! empty( $currency ) ) {
        // Tryb: bezpośredni kod waluty
        $target_currency = strtoupper( $currency );
        $resolved_by     = 'currency';

    } else {
        $target_currency = $default_currency;
    }

    // Pomocnicza funkcja do przeliczania kwot przez WCML
    $convert = function ( $amount ) use ( $target_currency, $default_currency ) {
        if ( '' === $amount || null === $amount ) {
            return $amount;
        }
        $float = (float) $amount;
        if ( $float === 0.0 ) {
            return '0.00';
        }
        // Jeśli waluta docelowa = domyślna, nie przeliczaj
        if ( $target_currency === $default_currency ) {
            return number_format( $float, 2, '.', '' );
        }
        return number_format(
            (float) apply_filters( 'wcml_raw_price_amount', $float, $target_currency ),
            2, '.', ''
        );
    };

    // --- Pełne dane kuponu ---
	$date_created  = $coupon->get_date_created();
	$date_modified = $coupon->get_date_modified();
	$date_expires  = $coupon->get_date_expires();
			
    $data = [

        // Identyfikacja
        'id'                          => $coupon->get_id(),
        'code'                        => $coupon->get_code(),
        'description'                 => $coupon->get_description(),
        'status'                      => $coupon->get_status(),

        // Typ i wartość rabatu
        'discount_type'               => $coupon->get_discount_type(),

        // Kwota — przeliczona na walutę docelową
        'amount'                      => $convert( $coupon->get_amount() ),
        'amount_original'             => $coupon->get_amount(),

        // Daty ważności
        'date_created'                => $date_created ? $date_created->date('c') : null,
        'date_modified'                => $date_modified ? $date_modified->date('c') : null,
        'date_expires'                => $date_expires ? $date_expires->date('c') : null,

        // Limity użycia
        'usage_count'                 => $coupon->get_usage_count(),
        'usage_limit'                 => $coupon->get_usage_limit(),
        'usage_limit_per_user'        => $coupon->get_usage_limit_per_user(),
        'individual_use'              => $coupon->get_individual_use(),

        // Minimalne i maksymalne kwoty zamówienia — przeliczone
        'minimum_amount'              => $convert($coupon->get_minimum_amount()),
        'minimum_amount_original'     => $coupon->get_minimum_amount(),
        'maximum_amount'              => $convert($coupon->get_maximum_amount()),
        'maximum_amount_original'     => $coupon->get_maximum_amount(),

        // Waluta
        'currency'                    => $target_currency,
        'default_currency'            => $default_currency,

        // Produkty i kategorie
        'product_ids'                 => $coupon->get_product_ids(),
        'excluded_product_ids'        => $coupon->get_excluded_product_ids(),
        'product_categories'          => $coupon->get_product_categories(),
        'excluded_product_categories' => $coupon->get_excluded_product_categories(),

        // Flagi
        'exclude_sale_items'          => $coupon->get_exclude_sale_items(),
        'free_shipping'               => $coupon->get_free_shipping(),

        // Maile dozwolone
        'email_restrictions'          => $coupon->get_email_restrictions(),

        // Meta danych (zawiera m.in. surowe dane WCML per waluta, jeśli były ustawiane ręcznie)
        'meta_data'                   => array_map(function (WC_Meta_Data $meta) {
            return [
                'id'    => $meta->get_data()['id'],
                'key'   => $meta->get_data()['key'],
                'value' => $meta->get_data()['value'],
            ];
        }, $coupon->get_meta_data()),
    ];

    return new WP_REST_Response([$data], 200);
}

/**
 * Zwraca walutę przypisaną do języka w ustawieniach WCML.
 * WCML przechowuje mapowanie w tablicy: $wcml_settings['currency_options'][CURRENCY]['languages'][LANG]
 *
 * Struktura: currency_options['EUR']['languages']['en'] = 1  (1 = włączona dla tego języka)
 */
function wcml_get_currency_by_language( string $lang ): ?string {

    global $woocommerce_wpml;

    if ( empty( $woocommerce_wpml ) ) {
        return null;
    }

    $settings = $woocommerce_wpml->get_settings();
    $currency_options = $settings['currency_options'] ?? [];

    // Szukamy waluty, której language[$lang] = 1 (aktywna dla tego języka)
    foreach ( $currency_options as $currency_code => $options ) {
        $languages = $options['languages'] ?? [];
        if ( ! empty( $languages[ $lang ] ) ) {
            return $currency_code;
        }
    }

    // Fallback: zapytaj bazę danych (starsze wersje WCML)
    // (tabela icl_languages_currencies łączy język z walutą)
    global $wpdb;
    $result = $wpdb->get_var(
        $wpdb->prepare(
            "SELECT c.code 
             FROM {$wpdb->prefix}icl_languages_currencies lc
             JOIN {$wpdb->prefix}icl_currencies c ON lc.currency_id = c.id
             WHERE lc.language_code = %s
             LIMIT 1",
            $lang
        )
    );

    return $result ?: null;
}

/**
 * Endpoint: GET /wp-json/api/v1/shipping/zones/{zone_id}/methods
 *
 * Parametry (opcjonalne, lang ma pierwszeństwo nad currency):
 *   ?lang=en          → waluta dobrana na podstawie języka z WCML
 *   ?currency=EUR     → bezpośredni kod waluty
 *
 * Jeśli nie podano żadnego → domyślna waluta sklepu.
 *
 * Obsługuje automatyczne przeliczanie przez kurs WCML
 * ORAZ ręczne ceny per waluta zapisane przez panel WCML 4.9+
 */
add_action('rest_api_init', function () {

    register_rest_route('api/v1', '/shipping/zones/(?P<zone_id>\d+)/methods', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true', // lub: fn() => current_user_can('manage_woocommerce')
        'args' => [
            'zone_id'  => [
                'required'          => true,
                'validate_callback' => fn($v) => is_numeric($v),
            ],
            'lang'     => [
                'required'          => false,
                'default'           => null,
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'currency' => [
                'required'          => false,
                'default'           => null,
                'sanitize_callback' => 'sanitize_text_field',
            ],
        ],
        'callback' => 'wcml_rest_get_shipping_methods_with_currency',
    ]);

    register_rest_route('api/v1', '/shipping/countries', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'args' => [
            'lang'     => [
                'required'          => false,
                'default'           => 'pl',
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'currency' => [
                'required'          => false,
                'default'           => null,
                'sanitize_callback' => 'sanitize_text_field',
            ],
        ],
        'callback' => 'hvyt_rest_get_shipping_countries',
    ]);

});

/**
 * True when a flat-rate class cost field was left empty.
 * "0" and "0.00" are explicit prices and are not blank.
 */
function hvyt_shipping_class_cost_is_blank( $value ): bool {
    if ( $value === null ) {
        return true;
    }

    return is_string( $value ) && trim( $value ) === '';
}

/**
 * Option keys for a shipping class cost saved in WooCommerce.
 * Only term ids. Slug keys and get_instance_option() are omitted on purpose:
 * an empty class field must stay unset, while the flat-rate default cost is "0".
 *
 * @return string[]
 */
function hvyt_collect_shipping_class_cost_candidate_keys( WP_Term $class ): array {
    $term_id        = (int) $class->term_id;
    $candidate_keys = [ 'class_cost_' . $term_id ];

    if ( function_exists( 'icl_object_id' ) ) {
        $default_lang     = apply_filters( 'wpml_default_language', 'pl' );
        $original_term_id = icl_object_id( $term_id, 'product_shipping_class', true, $default_lang );

        if ( $original_term_id ) {
            $candidate_keys[] = 'class_cost_' . (int) $original_term_id;
        }
    }

    global $sitepress;
    if ( $sitepress && method_exists( $sitepress, 'term_translations' ) ) {
        $wpml_original_id = $sitepress->term_translations()->get_original_element( $term_id );
        if ( $wpml_original_id ) {
            $candidate_keys[] = 'class_cost_' . (int) $wpml_original_id;
        }
    }

    return array_values( array_unique( $candidate_keys ) );
}

/**
 * Find WCML manual class cost for a target currency.
 *
 * @return array{value: string, key: string}|null
 */
function hvyt_find_manual_shipping_class_cost(
    array $raw_settings,
    array $candidate_keys,
    string $target_currency
): ?array {
    foreach ( $candidate_keys as $key ) {
        $manual_key = $key . '_' . $target_currency;
        if ( array_key_exists( $manual_key, $raw_settings ) && ! hvyt_shipping_class_cost_is_blank( $raw_settings[ $manual_key ] ) ) {
            return [
                'value' => (string) $raw_settings[ $manual_key ],
                'key'   => $manual_key,
            ];
        }
    }

    $suffixes = array_map(
        static fn( $key ) => substr( $key, 11 ),
        $candidate_keys
    );

    foreach ( $raw_settings as $setting_key => $value ) {
        if ( hvyt_shipping_class_cost_is_blank( $value ) ) {
            continue;
        }
        if ( ! preg_match( '/^class_cost_(.+)_' . preg_quote( $target_currency, '/' ) . '$/', $setting_key, $matches ) ) {
            continue;
        }
        if ( in_array( $matches[1], $suffixes, true ) ) {
            return [
                'value' => (string) $value,
                'key'   => $setting_key,
            ];
        }
    }

    return null;
}

/**
 * Resolve flat-rate shipping class cost from instance settings.
 * Handles WPML term_id mismatches and WCML per-currency manual prices.
 * A blank class field is not set (caller should use the method base cost).
 * A stored "0" is an explicit free class cost.
 *
 * @return array{base: ?string, key: ?string, source: string, manual_only: bool, pln_base: ?string}
 */
function hvyt_resolve_shipping_class_cost(
    array $raw_settings,
    $method,
    WP_Term $class,
    string $target_currency,
    string $default_currency
): array {
    $candidate_keys = hvyt_collect_shipping_class_cost_candidate_keys( $class );
    $pln_base       = null;
    $pln_base_key   = null;

    foreach ( $candidate_keys as $key ) {
        if ( ! array_key_exists( $key, $raw_settings ) ) {
            continue;
        }

        $value = $raw_settings[ $key ];
        if ( hvyt_shipping_class_cost_is_blank( $value ) ) {
            continue;
        }

        $pln_base     = (string) $value;
        $pln_base_key = $key;
        break;
    }

    if ( $target_currency !== $default_currency ) {
        $manual = hvyt_find_manual_shipping_class_cost( $raw_settings, $candidate_keys, $target_currency );
        if ( $manual !== null ) {
            return [
                'base'        => $manual['value'],
                'key'         => $manual['key'],
                'source'      => 'manual_wcml',
                'manual_only' => true,
                'pln_base'    => $pln_base,
            ];
        }
    }

    if ( $pln_base !== null ) {
        return [
            'base'        => $pln_base,
            'key'         => $pln_base_key,
            'source'      => 'settings',
            'manual_only' => false,
            'pln_base'    => $pln_base,
        ];
    }

    return [
        'base'        => null,
        'key'         => null,
        'source'      => 'not_set',
        'manual_only' => false,
        'pln_base'    => null,
    ];
}

function wcml_rest_get_shipping_methods_with_currency(WP_REST_Request $request) {

    do_action('wcml_load_multi_currency_in_ajax');

    $zone_id  = (int) $request->get_param('zone_id');
    $lang     = $request->get_param('lang');
    $currency = $request->get_param('currency');

    // 1. Ustal walutę docelową
    // $default_currency = get_woocommerce_currency();
    $default_currency = 'PLN';
    $resolved_by      = 'default';

    if (!empty($lang)) {
        $currency_from_lang = wcml_get_currency_by_language($lang);
        if (empty($currency_from_lang)) {
            return new WP_Error(
                'unknown_lang',
                "Nie znaleziono waluty dla języka: {$lang}",
                ['status' => 422]
            );
        }
        $target_currency = $currency_from_lang;
        $resolved_by     = 'language';

    } elseif (!empty($currency)) {
        $target_currency = strtoupper($currency);
        $resolved_by     = 'currency';

    } else {
        $target_currency = $default_currency;
    }

    // 2. Pobierz strefę dostawy
    $zone = new WC_Shipping_Zone($zone_id);
    if (!$zone->get_id() && $zone_id !== 0) {
        return new WP_Error(
            'zone_not_found',
            "Strefa wysyłki #{$zone_id} nie istnieje.",
            ['status' => 404]
        );
    }

    // 3. Pobierz metody wysyłki ze strefy
    $zone_methods = $zone->get_shipping_methods(false); // false = wszystkie, nie tylko aktywne

    if (empty($zone_methods)) {
        return new WP_REST_Response([], 200);
    }
	
	
// Po sekcji 3. (pobieranie metod wysyłki ze strefy), a przed pętlą foreach:

// ── SHIPPING CLASSES ────────────────────────────────────────────────────────

$shipping_classes_result = [];
$shipping_classes         = WC()->shipping()->get_shipping_classes(); // WP_Term[]

foreach ($zone_methods as $instance_id => $method) {

    // Interesują nas tylko metody, które obsługują klasy (np. flat_rate)
    if (!in_array($method->id, ['flat_rate', 'wf_shipping_ups', 'wf_shipping_fedex'], true)) {
        // Możesz rozszerzyć tablicę o własne metody obsługujące klasy
        // Alternatywnie sprawdź: method->supports('shipping-classes')
    }

    $option_key   = "woocommerce_{$method->id}_{$instance_id}_settings";
    $raw_settings = get_option($option_key, []);

    $classes_for_method = [];

    foreach ($shipping_classes as $class) {
        $slug = $class->slug;
        $resolved = hvyt_resolve_shipping_class_cost(
            $raw_settings,
            $method,
            $class,
            $target_currency,
            $default_currency
        );

        if ($resolved['base'] === null) {
            $classes_for_method[] = [
                'class_id'      => $class->term_id,
                'class_slug'    => $slug,
                'class_name'    => $class->name,
                'cost'          => null,
                'cost_original' => null,
                'price_source'  => 'not_set',
            ];
            continue;
        }

        $base_class_cost = $resolved['base'];
        $class_key       = $resolved['key'];
        $cost_original   = $resolved['pln_base'] ?? $base_class_cost;

        if ( $resolved['manual_only'] ) {
            $final_class_cost = $base_class_cost;
            $price_source     = 'manual_wcml';
        } else {
            $manual_cost_key  = $class_key . '_' . $target_currency;
            $has_manual_price = isset( $raw_settings[ $manual_cost_key ] ) && $raw_settings[ $manual_cost_key ] !== '';

            if ( $has_manual_price && $target_currency !== $default_currency ) {
                $final_class_cost = $raw_settings[ $manual_cost_key ];
                $price_source     = 'manual_wcml';
            } else {
                $base_float       = (float) $base_class_cost;
                $final_class_cost = $target_currency !== $default_currency
                    ? number_format(
                        (float) apply_filters( 'wcml_raw_price_amount', $base_float, $target_currency ),
                        2, '.', ''
                      )
                    : number_format( $base_float, 2, '.', '' );
                $price_source = $target_currency !== $default_currency ? 'auto_converted' : 'default';
            }
        }

        $classes_for_method[] = [
            'class_id'       => $class->term_id,
            'class_slug'     => $slug,
            'class_name'     => $class->name,
            'cost'           => $final_class_cost,
            'cost_original'  => $cost_original,
            'price_source'   => $price_source,
        ];
    }

    // Dodaj "brak klasy" (no_class_cost) — produkty bez przypisanej klasy
    $no_class_base = $raw_settings['no_class_cost'] ?? null;

    if ($no_class_base !== null && $no_class_base !== '') {
        $manual_no_class_key  = 'no_class_cost_' . $target_currency;
        $has_manual_no_class  = isset($raw_settings[$manual_no_class_key]) && $raw_settings[$manual_no_class_key] !== '';

        if ($has_manual_no_class && $target_currency !== $default_currency) {
            $final_no_class_cost = $raw_settings[$manual_no_class_key];
            $nc_source           = 'manual_wcml';
        } else {
            $nc_base             = (float) $no_class_base;
            $final_no_class_cost = $target_currency !== $default_currency
                ? number_format(
                    (float) apply_filters('wcml_raw_price_amount', $nc_base, $target_currency),
                    2, '.', ''
                  )
                : number_format($nc_base, 2, '.', '');
            $nc_source = $target_currency !== $default_currency ? 'auto_converted' : 'default';
        }

        $classes_for_method[] = [
            'class_id'      => 0,
            'class_slug'    => '_no_class',
            'class_name'    => __('No shipping class', 'woocommerce'),
            'cost'          => $final_no_class_cost,
            'cost_original' => $no_class_base,
            'price_source'  => $nc_source,
        ];
    }

    $shipping_classes_result[$instance_id] = $classes_for_method;
}	


// ── SHIPPING ZONES ────────────────────────────────────────────────────────

    $result = [];

    foreach ($zone_methods as $instance_id => $method) {

        // 4. Pobierz surowe ustawienia instancji z bazy danych
        //    Klucz: woocommerce_{method_id}_{instance_id}_settings
        $option_key      = "woocommerce_{$method->id}_{$instance_id}_settings";
        $raw_settings    = get_option($option_key, []);

        // 5. Pobierz koszt w domyślnej walucie
        $base_cost = $raw_settings['cost'] ?? '0';

        // 6. Sprawdź czy WCML zapisał ręczną cenę dla tej waluty
        //    WCML przechowuje je jako: cost_{CURRENCY} w tym samym kluczu opcji
        $manual_cost_key  = 'cost_' . $target_currency;
        $has_manual_price = isset($raw_settings[$manual_cost_key]) && $raw_settings[$manual_cost_key] !== '';

        if ($has_manual_price && $target_currency !== $default_currency) {
            // Ręczna cena ustawiona w panelu WCML — użyj jej bezpośrednio
            $final_cost    = $raw_settings[$manual_cost_key];
            $price_source  = 'manual_wcml';
        } else {
            // Brak ręcznej ceny — przelicz automatycznie przez kurs WCML
            $base_float   = (float) $base_cost;
            $final_cost   = $target_currency !== $default_currency
                ? number_format(
                    (float) apply_filters('wcml_raw_price_amount', $base_float, $target_currency),
                    2, '.', ''
                  )
                : number_format($base_float, 2, '.', '');
            $price_source = $target_currency !== $default_currency ? 'auto_converted' : 'default';
        }

        // 7. Minimum order (free shipping threshold) — jeśli istnieje
        $min_amount_base = $raw_settings['min_amount'] ?? null;
        $min_amount_manual_key = 'min_amount_' . $target_currency;

        if ($min_amount_base !== null) {
            if (isset($raw_settings[$min_amount_manual_key]) && $raw_settings[$min_amount_manual_key] !== '') {
                $final_min_amount = $raw_settings[$min_amount_manual_key];
            } else {
                $final_min_amount = $target_currency !== $default_currency
                    ? number_format(
                        (float) apply_filters('wcml_raw_price_amount', (float)$min_amount_base, $target_currency),
                        2, '.', ''
                      )
                    : number_format((float)$min_amount_base, 2, '.', '');
            }
        } else {
            $final_min_amount = null;
        }

        // 8. Zbuduj odpowiedź dla tej metody
        $result[] = [
            'id'          	       => $instance_id,
            'instance_id'          => $instance_id,
            'method_id'            => $method->id,
            'title'                => $method->get_title(),
            'enabled'              => $method->is_enabled(),
            'order'                => $method->method_order ?? 0,

            // Ceny w żądanej walucie
            'cost'                 => $final_cost,
            'cost_original'        => $base_cost,
            'min_amount'           => $final_min_amount,
            'min_amount_original'  => $min_amount_base,

            // Waluta
            'currency'             => $target_currency,
            'currency_symbol'      => get_woocommerce_currency_symbol($target_currency),
            'default_currency'     => $default_currency,
            'price_source'         => $price_source, // 'manual_wcml' | 'auto_converted' | 'default'

            // Wszystkie surowe ustawienia (np. klasy wysyłki, typ kalkulacji)
            'settings' => [
                'type'              => $raw_settings['type'] ?? null,   // 'class' | 'order' | 'item'
                'requires'          => $raw_settings['requires'] ?? null, // dla free_shipping: 'coupon'|'min_amount' itd.
                'tax_status'        => $raw_settings['tax_status'] ?? 'taxable',
                'no_class_cost'     => $raw_settings['no_class_cost'] ?? null,

                // Wszystkie ręczne ceny WCML per waluta (dla diagnostyki)
                'wcml_manual_costs' => array_filter(
                    $raw_settings,
                    fn($key) => preg_match('/^cost_[A-Z]{3}$/', $key),
                    ARRAY_FILTER_USE_KEY
                ),
            ],
			
			'shipping_classes' => $shipping_classes_result[$instance_id] ?? [],
        ];
    }

    return new WP_REST_Response([
        '_resolved_currency_by' => $resolved_by,
        '_requested_lang'       => $lang,
        '_requested_currency'   => $currency,
        'zone_id'               => $zone->get_id(),
        'zone_name'             => $zone->get_zone_name(),
        'methods'               => $result,
    ], 200);
}

/**
 * Country code from a WooCommerce zone location (object or array).
 */
function hvyt_shipping_location_code( $location ): string {
    if ( is_object( $location ) ) {
        return (string) ( $location->code ?? '' );
    }
    if ( is_array( $location ) ) {
        return (string) ( $location['code'] ?? '' );
    }
    return '';
}

/**
 * Location type: country, continent, state, or postcode.
 */
function hvyt_shipping_location_type( $location ): string {
    if ( is_object( $location ) ) {
        return (string) ( $location->type ?? '' );
    }
    if ( is_array( $location ) ) {
        return (string) ( $location['type'] ?? '' );
    }
    return '';
}

/**
 * Expand zone locations to country codes.
 * States and postcodes are ignored, same as the storefront walker.
 * Continents are expanded from WooCommerce country data in this process.
 *
 * @param array $locations
 * @return string[]
 */
function hvyt_expand_shipping_location_country_codes( array $locations ): array {
    $codes      = [];
    $continents = ( function_exists( 'WC' ) && WC()->countries )
        ? WC()->countries->get_continents()
        : [];

    foreach ( $locations as $location ) {
        $type = hvyt_shipping_location_type( $location );
        $code = hvyt_shipping_location_code( $location );
        if ( $code === '' ) {
            continue;
        }

        if ( $type === 'country' ) {
            $codes[] = strtoupper( $code );
            continue;
        }

        if ( $type === 'continent' ) {
            $continent = $continents[ strtoupper( $code ) ] ?? null;
            foreach ( $continent['countries'] ?? [] as $country_code ) {
                $codes[] = strtoupper( (string) $country_code );
            }
        }
    }

    return $codes;
}

/**
 * Active methods for one zone, reusing the per-zone currency serializer.
 *
 * @return array|WP_Error
 */
function hvyt_rest_shipping_zone_active_methods( int $zone_id, $lang, $currency ) {
    $subrequest = new WP_REST_Request( 'GET' );
    $subrequest->set_param( 'zone_id', $zone_id );
    $subrequest->set_param( 'lang', $lang );
    $subrequest->set_param( 'currency', $currency );

    $response = wcml_rest_get_shipping_methods_with_currency( $subrequest );
    if ( is_wp_error( $response ) ) {
        return $response;
    }

    $data = $response instanceof WP_REST_Response ? $response->get_data() : $response;
    if ( ! is_array( $data ) ) {
        return [];
    }

    $methods = [];
    if ( isset( $data['methods'] ) && is_array( $data['methods'] ) ) {
        $methods = $data['methods'];
    } elseif ( $data === [] || array_keys( $data ) === range( 0, count( $data ) - 1 ) ) {
        $methods = $data;
    }

    $active = [];
    foreach ( $methods as $method ) {
        if ( empty( $method['enabled'] ) ) {
            continue;
        }
        $active[] = [
            'id'            => (int) ( $method['instance_id'] ?? $method['id'] ?? 0 ),
            'title'         => (string) ( $method['title'] ?? '' ),
            'cost'          => $method['cost'] ?? '0',
            'cost_original' => $method['cost_original'] ?? '0',
            'currency'      => $method['currency'] ?? 'PLN',
        ];
    }

    return $active;
}

/**
 * Endpoint: GET /wp-json/api/v1/shipping/countries?lang=pl
 *
 * One response for every shipping zone, its locations, and its methods.
 * Later zones overwrite earlier ones for the same country, matching WooCommerce zone order.
 *
 * @return WP_REST_Response|WP_Error
 */
function hvyt_rest_get_shipping_countries( WP_REST_Request $request ) {
    $lang     = $request->get_param( 'lang' ) ?: 'pl';
    $currency = $request->get_param( 'currency' );

    do_action( 'wpml_switch_language', $lang );

    $zones = function_exists( 'WC' ) ? WC_Shipping_Zones::get_zones() : [];
    $names = ( function_exists( 'WC' ) && WC()->countries )
        ? WC()->countries->get_countries()
        : [];

    $by_country = [];

    foreach ( $zones as $zone_data ) {
        $zone_id = (int) ( $zone_data['zone_id'] ?? $zone_data['id'] ?? 0 );
        if ( $zone_id === 0 ) {
            continue;
        }

        $methods = hvyt_rest_shipping_zone_active_methods( $zone_id, $lang, $currency );
        if ( is_wp_error( $methods ) ) {
            do_action( 'wpml_switch_language', null );
            return $methods;
        }

        $entry = [
            'zoneId'   => $zone_id,
            'zoneName' => (string) ( $zone_data['zone_name'] ?? '' ),
            'methods'  => $methods,
        ];

        foreach ( hvyt_expand_shipping_location_country_codes( $zone_data['zone_locations'] ?? [] ) as $code ) {
            $by_country[ $code ] = $entry;
        }
    }

    $result = [];
    foreach ( $by_country as $code => $zone ) {
        $result[] = array_merge(
            [
                'code' => $code,
                'name' => (string) ( $names[ $code ] ?? $code ),
            ],
            $zone
        );
    }

    do_action( 'wpml_switch_language', null );

    return new WP_REST_Response( $result, 200 );
}


// ---------------------------------
// ------ Fix WCML product prices in native WC REST API
// ---------------------------------

/**
 * WCML obcina ceny w /wc/v3/products do liczb całkowitych (np. 6.50 PLN → 1 EUR).
 * Przeliczamy od surowych meta w PLN — ten sam wzorzec co kupony / wysyłka powyżej.
 */
add_filter('woocommerce_rest_prepare_product_object', 'hvyt_fix_wc_rest_product_prices', 999, 3);
add_filter('woocommerce_rest_prepare_product_variation_object', 'hvyt_fix_wc_rest_product_prices', 999, 3);

/**
 * Baselinker dodaje baselinker_variations często PO prepare_product_object.
 * rest_post_dispatch działa na finalnej odpowiedzi JSON — bez dodatkowych requestów z Next.js.
 */
add_filter('rest_post_dispatch', 'hvyt_fix_wc_rest_prices_post_dispatch', 10, 3);

/**
 * @return string|null Docelowa waluta albo null gdy brak konwersji (PLN / brak parametru).
 */
function hvyt_wcml_resolve_rest_target_currency(WP_REST_Request $request): ?string {
    // Sklep bazuje na PLN; nie używaj get_woocommerce_currency() — REST może być już przełączony na EUR.
    $default_currency = 'PLN';
    $currency         = $request->get_param('currency');
    $lang             = $request->get_param('lang');

    if (! empty($currency)) {
        $target_currency = strtoupper(sanitize_text_field($currency));
    } elseif (! empty($lang) && $lang !== 'pl' && function_exists('wcml_get_currency_by_language')) {
        $target_currency = wcml_get_currency_by_language($lang);
        if (empty($target_currency)) {
            return null;
        }
    } else {
        return null;
    }

    if ($target_currency === $default_currency) {
        return null;
    }

    return $target_currency;
}

function hvyt_get_default_language(): string {
    $lang = apply_filters('wpml_default_language', null);

    return is_string($lang) && $lang !== '' ? $lang : 'pl';
}

/**
 * ID produktu/wariantu w języku bazowym (PL), z którego czytamy ceny w PLN.
 */
function hvyt_get_pl_source_product_id($object): int {
    if (! is_object($object) || ! method_exists($object, 'get_id')) {
        return 0;
    }

    $product_id   = (int) $object->get_id();
    $default_lang = hvyt_get_default_language();
    $post_type    = (method_exists($object, 'is_type') && $object->is_type('variation'))
        ? 'product_variation'
        : 'product';

    $pl_id = (int) apply_filters('wpml_object_id', $product_id, $post_type, true, $default_lang);

    return $pl_id > 0 ? $pl_id : $product_id;
}

/**
 * Odczyt ceny PLN z postmeta — bez filtrów WCML na get_post_meta().
 */
function hvyt_get_product_pln_meta_price($object, string $meta_key): string {
    global $wpdb;

    $product_id = hvyt_get_pl_source_product_id($object);
    if ($product_id <= 0) {
        return '';
    }

    $value = $wpdb->get_var(
        $wpdb->prepare(
            "SELECT meta_value FROM {$wpdb->postmeta} WHERE post_id = %d AND meta_key = %s LIMIT 1",
            $product_id,
            $meta_key
        )
    );

    return ($value === null || $value === '') ? '' : (string) $value;
}

/**
 * Odczyt ceny PLN z postmeta po ID obiektu (bez filtrów WCML na get_post_meta()).
 */
function hvyt_get_postmeta_value_by_id(int $post_id, string $meta_key): string {
    global $wpdb;

    if ($post_id <= 0) {
        return '';
    }

    $value = $wpdb->get_var(
        $wpdb->prepare(
            "SELECT meta_value FROM {$wpdb->postmeta} WHERE post_id = %d AND meta_key = %s LIMIT 1",
            $post_id,
            $meta_key
        )
    );

    return ($value === null || $value === '') ? '' : (string) $value;
}

/**
 * Mapuj id wariantu na wersję w języku bazowym (PL).
 */
function hvyt_get_pl_source_variation_id(int $variation_id): int {
    if ($variation_id <= 0) return $variation_id;

    $default_lang = hvyt_get_default_language();
    $pl_id = (int) apply_filters('wpml_object_id', $variation_id, 'product_variation', true, $default_lang);

    return $pl_id > 0 ? $pl_id : $variation_id;
}

/**
 * Poprawia ceny w tablicy baselinker_variations (array lub stdClass).
 *
 * @param array<string, mixed> $data
 */
function hvyt_fix_baselinker_variations_array(array &$data, string $target_currency): void {
    if (! isset($data['baselinker_variations']) || ! is_array($data['baselinker_variations'])) {
        return;
    }

    foreach ($data['baselinker_variations'] as $index => $bv) {
        $variation_id = 0;

        if (is_array($bv) && isset($bv['id'])) {
            $variation_id = (int) $bv['id'];
        } elseif (is_object($bv) && isset($bv->id)) {
            $variation_id = (int) $bv->id;
        } else {
            continue;
        }

        $pl_variation_id = hvyt_get_pl_source_variation_id($variation_id);

        $pln_regular = hvyt_get_postmeta_value_by_id($pl_variation_id, '_regular_price');
        $pln_sale    = hvyt_get_postmeta_value_by_id($pl_variation_id, '_sale_price');
        $pln_price   = hvyt_get_postmeta_value_by_id($pl_variation_id, '_price');

        $set_field = static function ($key, $value) use (&$data, $index, $bv) {
            if (is_array($data['baselinker_variations'][$index])) {
                $data['baselinker_variations'][$index][$key] = $value;
            } elseif (is_object($data['baselinker_variations'][$index])) {
                $data['baselinker_variations'][$index]->{$key} = $value;
            }
        };

        if ($pln_regular !== '') {
            $set_field('regular_price', round((float) hvyt_wcml_convert_pln_amount($pln_regular, $target_currency), 2));
        }

        if ($pln_sale !== '') {
            $set_field('sale_price', round((float) hvyt_wcml_convert_pln_amount($pln_sale, $target_currency), 2));
        } else {
            $set_field('sale_price', 0);
        }

        $source_price = $pln_price !== '' ? $pln_price : ($pln_sale !== '' ? $pln_sale : $pln_regular);
        if ($source_price !== '') {
            $set_field('price', round((float) hvyt_wcml_convert_pln_amount($source_price, $target_currency), 2));
        }
    }
}

/**
 * Ostatnia szansa: poprawka po złożeniu całej odpowiedzi REST (w tym pól od Baselinkera).
 *
 * @param WP_REST_Response|WP_HTTP_Response|WP_Error|mixed $result
 */
function hvyt_fix_wc_rest_prices_post_dispatch($result, $server, $request) {
    if (! ($result instanceof WP_REST_Response) || ! ($request instanceof WP_REST_Request)) {
        return $result;
    }

    $route = $request->get_route();
    if (! preg_match('#^/wc/v3/products/\d+$#', $route)) {
        return $result;
    }

    $target_currency = hvyt_wcml_resolve_rest_target_currency($request);
    if (! $target_currency) {
        return $result;
    }

    $data = $result->get_data();
    if (! is_array($data)) {
        return $result;
    }

    hvyt_fix_baselinker_variations_array($data, $target_currency);
    $result->set_data($data);

    return $result;
}

function hvyt_wcml_convert_pln_amount($pln_amount, string $target_currency): string {
    if ($pln_amount === '' || $pln_amount === null) {
        return '';
    }

    $float = (float) $pln_amount;
    if ($float === 0.0) {
        return '0.00';
    }

    do_action('wcml_load_multi_currency_in_ajax');

    global $woocommerce_wpml;
    if (isset($woocommerce_wpml->multi_currency) && method_exists($woocommerce_wpml->multi_currency, 'set_client_currency')) {
        $woocommerce_wpml->multi_currency->set_client_currency($target_currency);
    }

    return number_format(
        (float) apply_filters('wcml_raw_price_amount', $float, $target_currency),
        2,
        '.',
        ''
    );
}

/**
 * @param WP_REST_Response $response
 * @param WC_Product       $object
 * @param WP_REST_Request  $request
 */
function hvyt_fix_wc_rest_product_prices($response, $object, $request) {
    if (! $request instanceof WP_REST_Request || ! is_object($object) || ! method_exists($object, 'get_id')) {
        return $response;
    }

    $target_currency = hvyt_wcml_resolve_rest_target_currency($request);
    if (! $target_currency) {
        return $response;
    }

    $pln_regular = hvyt_get_product_pln_meta_price($object, '_regular_price');
    $pln_sale    = hvyt_get_product_pln_meta_price($object, '_sale_price');
    $pln_price   = hvyt_get_product_pln_meta_price($object, '_price');

    if ($pln_regular !== '') {
        $response->data['regular_price'] = hvyt_wcml_convert_pln_amount($pln_regular, $target_currency);
    }

    if ($pln_sale !== '') {
        $response->data['sale_price'] = hvyt_wcml_convert_pln_amount($pln_sale, $target_currency);
    }

    if ($pln_price !== '') {
        $response->data['price'] = hvyt_wcml_convert_pln_amount($pln_price, $target_currency);
    } elseif ($pln_sale !== '' && $pln_regular !== '' && (float) $pln_sale < (float) $pln_regular) {
        $response->data['price'] = hvyt_wcml_convert_pln_amount($pln_sale, $target_currency);
    } elseif ($pln_regular !== '') {
        $response->data['price'] = hvyt_wcml_convert_pln_amount($pln_regular, $target_currency);
    }

    hvyt_fix_baselinker_variations_array($response->data, $target_currency);

    return $response;
}


/**
 * Custom REST API endpoint do pobierania strony po slug
 * Zwraca: tytuł, content oraz wszystkie pola ACF
 */

add_action('rest_api_init', function () {
    register_rest_route( 'api/v1', '/page-by-slug/(?P<slug>[a-zA-Z0-9_-]+)', [
        'methods' => 'GET',
        'callback' => 'get_page_by_slug_with_acf',
        'permission_callback' => '__return_true', // Publiczny endpoint (dla opublikowanych stron)
        'args' => [
            'slug' => [
                'required' => true,
                'type'        => 'string',
                'description' => 'Page slug',
				'sanitize_callback' => 'sanitize_key',				
                'validate_callback' => function( $param ) {
                    return !empty( $param );
                }
            ]
        ],
    ]);
});

function get_page_by_slug_with_acf( $request ) {
	
    $slug = $request->get_param( 'slug' );

    $cache_key = 'hvyt_page_by_slug_' . md5( (string) $slug );
    $cached = get_transient( $cache_key );

    if ( $cached !== false ) {
        return rest_ensure_response( $cached );
    }
    
    $page = get_page_by_path( $slug, OBJECT, 'page' );
    
    if ( !$page ) {
        return new WP_Error(
            'page_not_found',
            'Strona o podanym slug nie istnieje',
            array('status' => 404)
        );
    }
    
    // Pobranie wszystkich pól ACF dla tej strony
    $acf_fields = [];
    if ( function_exists( 'get_fields' ) ) {
        $acf_fields = get_fields( $page->ID );
		
        if ( !$acf_fields ) {
            $acf_fields = [];
        }
    }
    
    // odpowiedź
    $response = [
        'id' => $page->ID,
        'title' => get_the_title( $page ),
        'slug' => $page->post_name,
        'content' => apply_filters( 'the_content', $page->post_content ), // Przetworzony content z shortcodes
        'content_raw' => $page->post_content, // Surowy content bez przetwarzania
        'acf' => $acf_fields,
        'excerpt' => get_the_excerpt( $page ),
        'featured_image' => get_the_post_thumbnail_url( $page, 'full' ),
        'permalink' => get_permalink( $page ),
        'status' => $page->post_status,
        'date' => $page->post_date,
        'modified' => $page->post_modified
    ];
    
    // Dodatkowe pola
    // $response['author'] = get_the_author_meta('display_name', $page->post_author);
    // $response['parent'] = $page->post_parent ? get_the_title($page->post_parent) : null;
    
    set_transient( $cache_key, $response, DAY_IN_SECONDS );
	  
    return rest_ensure_response( $response );
}


// reviews filter for attaching media urls to reviews
add_filter('woocommerce_rest_prepare_product_review', function ($response, $review) {
    $data = $response->get_data();
    $media = array();
    $push = function ($type, $url) use (&$media) {
        if (!is_string($url) || $url === '') {
            return;
        }
        $media[] = array('type' => $type, 'url' => $url);
    };
    foreach ((array) get_comment_meta($review->comment_ID, 'ivole_review_image') as $pic) {
        if (is_array($pic) && !empty($pic['url'])) {
            $push('image', $pic['url']);
        }
    }
    foreach ((array) get_comment_meta($review->comment_ID, 'ivole_review_image2') as $id) {
        $url = wp_get_attachment_url((int) $id);
        if ($url) {
            $push('image', $url);
        }
    }
    foreach ((array) get_comment_meta($review->comment_ID, 'ivole_review_video') as $vid) {
        if (is_array($vid) && !empty($vid['url'])) {
            $push('video', $vid['url']);
        }
    }
    foreach ((array) get_comment_meta($review->comment_ID, 'ivole_review_video2') as $id) {
        $url = wp_get_attachment_url((int) $id);
        if ($url) {
            $push('video', $url);
        }
    }
    $data['media'] = $media;
    $response->set_data($data);
    return $response;
}, 10, 2);