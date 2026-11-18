<?php

/*
 *
 *
 *
 *
 *
 *
 *
 * CUSTOM CODE START HERE
 *
 *
 *
 *
 * */
// --- Helpers to repair Polish diacritics mojibake in API outputs ---
function hvyt_fix_pl_str($s) {
    if (!is_string($s) || $s === '') return $s;
    // fast bail if no typical mojibake markers
    if (!preg_match('/[ÃÅÄÂ]/', $s)) return $s;
    $map = array(
        'Ä…'=>'ą','Ä™'=>'ę','Ä‡'=>'ć','Å‚'=>'ł','Å„'=>'ń','Ã³'=>'ó','Å›'=>'ś','Åº'=>'ź','Å¼'=>'ż',
        'Ä‚'=>'Ą','Ä˜'=>'Ę','Ä†'=>'Ć','Å�'=>'Ł','Åƒ'=>'Ń','Ã“'=>'Ó','Åš'=>'Ś','Å¹'=>'Ź','Å»'=>'Ż',
        'Â '=>' ', 'Â'=>'' // stray NBSP/control leftovers
    );
    return strtr($s, $map);
}
function hvyt_fix_pl_array($arr) {
    if (!is_array($arr)) return $arr;
    foreach ($arr as $k => $v) {
        $arr[$k] = is_array($v) ? hvyt_fix_pl_array($v) : hvyt_fix_pl_str($v);
    }
    return $arr;
}
// Force JSON UTF-8 header for REST responses
add_filter('rest_pre_serve_request', function($result, $server, $request){
    if (!headers_sent()) {
        header('Content-Type: application/json; charset=UTF-8');
    }
    return $result;
}, 9, 3);
// --- end helpers ---

/*
function add_cors_http_header() {
    header("Access-Control-Allow-Origin: *");
}
add_action('init','add_cors_http_header');
*/
/*
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/register', array(
        'methods' => 'POST',
        'callback' => 'custom_user_registration',
        'permission_callback' => '__return_true', // Allow public access for registration
    ));
});


function custom_user_registration($request) {
    $first_name = sanitize_text_field($request['first_name']);
    $last_name = sanitize_text_field($request['last_name']);
    $email = sanitize_email($request['email']);
    $password = sanitize_text_field($request['password']);

    if (empty($first_name) || empty($last_name) || empty($email) || empty($password)) {
        return new WP_Error('missing_fields', 'All fields are required.', array('status' => 400));
    }

    if (email_exists($email)) {
        return new WP_Error('user_exists', 'User with this email already exists.', array('status' => 400));
    }

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

    // Generate and save activation token
    $activation_token = wp_generate_password(20, false);
    update_user_meta($user_id, 'activation_token', $activation_token);

    // Send activation email
    send_activation_email($email, $activation_token);

    return array(
        'user_id' => $user_id,
        'username' => $username,
        'first_name' => $first_name,
        'last_name' => $last_name,
        'email' => $email,
    );
}
*/

/*STILL WORKING ON AUTHENTICATE*/
/*
function send_activation_email($email, $activation_token) {
    // Build activation link
    $activation_link = add_query_arg(
        ['token' => $activation_token],
        rest_url('custom/v1/activate')
    );

    // Prepare HTML email
    $subject = 'Aktywacja konta';
    $headers = ['Content-Type: text/html; charset=UTF-8'];

    ob_start();
    ?>
    <!DOCTYPE html>
    <html lang="pl" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Aktywacja konta</title>
      <style>
        body, table, td, p { margin:0; padding:0; font-family:'Neue Haas Grotesk Display Pro',Arial,sans-serif; color:#661F30; line-height:1.4; }
        a { color:#661F30; text-decoration:none; }
        .email-container { width:600px; background-color:#F0E0CF; padding:80px; }
        .header { text-align:center; margin-bottom:40px; }
        .body-text { font-size:18px; padding:20px 0; }
        .body-text p { margin-bottom:1em; }
        .btn { display:inline-block; border:1px solid #661F30; border-radius:60px; padding:12px 24px; text-decoration:none; font-weight:bold; }
        .footer { text-align:center; font-size:12px; padding:10px 0; }
        .social-icons a { display:inline-block; margin:0 5px; }
      </style>
    </head>
    <body>
      <table class="email-container" role="presentation">
        <tr><td class="header">
          <img src="https://wp.hvyt.pl/wp-content/uploads/2025/06/Almost-in-HVYT-crew-1.png" width="425" alt="Almost in HVYT crew"/>
        </td></tr>
        <tr><td class="body-text">
          <p>Dziękujemy za rejestrację ツ</p>
          <p>Kliknij poniższy link, aby aktywować swoje konto:</p>
          <p><a class="btn" href="<?php echo esc_url($activation_link); ?>">Aktywuj konto &gt;</a></p>
          <p>Jeśli nie zakładałeś tego konta, możesz zignorować tę wiadomość.</p>
        </td></tr>
        <tr><td style="text-align:center; padding-top:30px;">
          <p>Bye,</p>
          <p><strong>H V Y T</strong></p>
        </td></tr>
        <tr><td>
          <hr style="border:1px solid #661F30; margin:30px 0;" />
        </td></tr>
        <tr><td class="footer" style="text-align:center;">
          <p class="social-icons">
            <a href="https://www.facebook.com/HVYTPL/" target="_blank"><img width="24" height="24" src="https://wp.hvyt.pl/wp-content/uploads/2025/06/Facebook.png"/></a>
            <a href="https://www.instagram.com/hvyt_pl/"    target="_blank"><img width="24" height="24" src="https://wp.hvyt.pl/wp-content/uploads/2025/06/Vector.png"/></a>
            <a href="https://in.pinterest.com/meethvyt/"   target="_blank"><img width="24" height="24" src="https://wp.hvyt.pl/wp-content/uploads/2025/06/Pinterest.png"/></a>
          </p>
          <p>HVYT Głogoczów 996, 32-444 Głogoczów</p>
        </td></tr>
      </table>
    </body>
    </html>
    <?php
    $html_message = ob_get_clean();

    wp_mail($email, $subject, $html_message, $headers);
}
*/
/*
function verify_activation_token_redirect($request) {
    $token = sanitize_text_field($request['token']);

    // Find the user by activation token
    $user_query = new WP_User_Query(array(
        'meta_key' => 'activation_token',
        'meta_value' => $token,
        'number' => 1,
    ));

    $users = $user_query->get_results();

    if (empty($users)) {
        wp_redirect('https://hvyt.pl/logowanie?error=invalid_token'); // Redirect with error
        exit;
    }

    $user_id = $users[0]->ID;

    // Remove the activation token and mark user as active
    delete_user_meta($user_id, 'activation_token');
    update_user_meta($user_id, 'is_active', 'true');

    // Redirect to hvyt.pl/potwierdzenie-email after successful activation
    wp_redirect('https://hvyt.pl/potwierdzenie-email?success=account_activated');
    exit;
}


add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/activate', array(
        'methods' => 'GET',
        'callback' => 'verify_activation_token_redirect',
        'permission_callback' => '__return_true', // No auth required for activation
    ));
});
*/

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


/*
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
    ];

    $query = new WP_Query($args);

    $products = [];
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $product = wc_get_product(get_the_ID());

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

            // Add sale date strings and flags
            $sale_from = $product->get_date_on_sale_from();
            $sale_to   = $product->get_date_on_sale_to();
            $sale_from_str = $sale_from ? $sale_from->date('Y-m-d H:i:s') : null;
            $sale_to_str   = $sale_to ? $sale_to->date('Y-m-d H:i:s') : null;

            $products[] = [
                'id' => $product->get_id(),
                'slug' => $product->get_slug(),
                'name' => $product->get_name(),
                'price' => $product->get_price(),
                'regular_price' => $product->get_regular_price(),
                'sale_price' => $product->get_sale_price(),
                'on_sale' => $product->is_on_sale(),
                'date_on_sale_from' => $sale_from_str,
                'date_on_sale_to' => $sale_to_str,
                'attributes' => $product->get_attributes(),
                'images' => $images,
                'date_created'=> $product->get_date_created()->date('Y-m-d H:i:s'),
            ];
        }
    }
    wp_reset_postdata();

    return new WP_REST_Response([
        'products' => $products,
        'total' => $query->found_posts,
    ], 200);
}


function get_filtered_attributes($data) {
    $category_id = $data['category'];

    // Fetch all products in the given category
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
    ]);

    $product_ids = $query->posts;

    // Ensure there are products in the category
    if (empty($product_ids)) {
        return new WP_REST_Response([], 200); // Return an empty array if no products
    }

    // Fetch attributes related to the products
    $attributes = wc_get_attribute_taxonomies();
    $response = [];

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

    return new WP_REST_Response($response, 200);
}

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
        ],
    ]);
});


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
        'phone'     => get_user_meta($current_user->ID, 'billing_phone', true),
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

    if (is_wp_error($updated)) {
        return new WP_Error('update_failed', 'Failed to update user data', array('status' => 500));
    }
if ( ! empty( $phone ) ) {
    update_user_meta( (int) $id, 'billing_phone', $phone );
}
    return rest_ensure_response(array('message' => 'User updated successfully'));
}

add_action('rest_api_init', function () {
    register_rest_route('custom-api/v1', '/change-password', array(
        'methods' => 'POST',
        'callback' => 'change_user_password',
        'permission_callback' => function () {
            return is_user_logged_in();
        },
    ));
});

function change_user_password($request) {
    $user_id = get_current_user_id();
    $current_password = $request->get_param('currentPassword');
    $new_password = $request->get_param('newPassword');

    if (!$user_id || !$current_password || !$new_password) {
        return new WP_Error('missing_params', 'Missing required parameters', array('status' => 400));
    }

    // Verify current password
    $user = get_userdata($user_id);
    if (!wp_check_password($current_password, $user->user_pass, $user_id)) {
        return new WP_Error('invalid_password', 'Current password is incorrect', array('status' => 403));
    }

    // Update password
    wp_set_password($new_password, $user_id);
    return rest_ensure_response(array('message' => 'Password updated successfully'));
}

*/
/**Forgot pass**/




/**Adresses*/
/*
add_action('rest_api_init', function () {
    register_rest_route('custom-api/v1', '/user-addresses', array(
        'methods' => 'GET',
        'callback' => 'get_user_addresses',
        'permission_callback' => function () {
            return is_user_logged_in();
        },
    ));

    register_rest_route('custom-api/v1', '/user-addresses/add', array(
        'methods' => 'POST',
        'callback' => 'add_new_address',
        'permission_callback' => function () {
            return is_user_logged_in();
        },
    ));

    register_rest_route('custom-api/v1', '/user-addresses/update', array(
        'methods' => 'POST',
        'callback' => 'update_user_addresses',
        'permission_callback' => function () {
            return is_user_logged_in();
        },
    ));
});

function get_user_addresses($request) {
    $user_id = get_current_user_id();

    // Fetch the default shipping address
    $default_address = array(
        'street' => get_user_meta($user_id, 'shipping_address_1', true),
        'address_line_2' => get_user_meta($user_id, 'shipping_address_2', true),
        'city' => get_user_meta($user_id, 'shipping_city', true),
        'postalCode' => get_user_meta($user_id, 'shipping_postcode', true),
        'country' => get_user_meta($user_id, 'shipping_country', true),
    );

    // Include default address if it exists
    $all_addresses = [];
    if (!empty($default_address['street']) && !empty($default_address['city'])) {
        $all_addresses[] = $default_address;
    }

    // Fetch additional addresses from the custom meta field
    $additional_addresses = get_user_meta($user_id, 'user_addresses', true);
    if (!empty($additional_addresses) && is_array($additional_addresses)) {
        $all_addresses = array_merge($all_addresses, $additional_addresses);
    }
    $all_addresses = hvyt_fix_pl_array($all_addresses);
    return rest_ensure_response($all_addresses);
}
function add_new_address($request) {
    $user_id = get_current_user_id();
    $new_address = $request->get_param('address');

    // Validate the new address
    if (!is_array($new_address) || empty($new_address['street']) || empty($new_address['city']) || empty($new_address['postalCode']) || empty($new_address['country'])) {
        return new WP_Error('invalid_address', 'Invalid address. All fields are required.', array('status' => 400));
    }

    // Check if there is already a default shipping address
    $default_street = get_user_meta($user_id, 'shipping_address_1', true);

    if (empty($default_street)) {
        // If no default address exists, save this as the default shipping address
        update_user_meta($user_id, 'shipping_address_1', $new_address['street']);
        update_user_meta($user_id, 'shipping_address_2', $new_address['address_line_2']);
        update_user_meta($user_id, 'shipping_city', $new_address['city']);
        update_user_meta($user_id, 'shipping_postcode', $new_address['postalCode']);
        update_user_meta($user_id, 'shipping_country', $new_address['country']);
    } else {
        // Otherwise, treat it as an additional address
        $existing_addresses = get_user_meta($user_id, 'user_addresses', true);
        if (empty($existing_addresses)) {
            $existing_addresses = [];
        }

        // Check if the user already has the maximum allowed addresses
        if (count($existing_addresses) >= 2) { // 1 default + 2 additional = 3 max
            return new WP_Error('address_limit', 'You can only save up to 3 addresses.', array('status' => 400));
        }

        // Add the new address to the additional addresses
        $existing_addresses[] = $new_address;
        update_user_meta($user_id, 'user_addresses', $existing_addresses);
    }

    return rest_ensure_response(['message' => 'Address added successfully']);
}


function update_user_addresses($request) {
    $user_id = get_current_user_id();
    $addresses = $request->get_param('addresses');

    if (!is_array($addresses) || count($addresses) > 3) {
        return new WP_Error('address_limit_exceeded', 'You can only save up to 3 addresses.', array('status' => 400));
    }

    // Save the first address as the default shipping address
    if (!empty($addresses[0])) {
        update_user_meta($user_id, 'shipping_address_1', $addresses[0]['street']);
        update_user_meta($user_id, 'shipping_address_2', $addresses[0]['address_line_2']); // Add address line 2
        update_user_meta($user_id, 'shipping_city', $addresses[0]['city']);
        update_user_meta($user_id, 'shipping_postcode', $addresses[0]['postalCode']);
        update_user_meta($user_id, 'shipping_country', $addresses[0]['country']);
    }

    // Save additional addresses to the custom meta field
    $additional_addresses = array_slice($addresses, 1);
    update_user_meta($user_id, 'user_addresses', $additional_addresses);

    return rest_ensure_response(['message' => 'Addresses updated successfully']);
}



//Billing
add_action('rest_api_init', function () {
    // Route to fetch billing addresses
    register_rest_route('custom-api/v1', '/billing-addresses', array(
        'methods' => 'GET',
        'callback' => 'get_billing_addresses',
        'permission_callback' => function () {
            return is_user_logged_in();
        },
    ));

    // Route to add a new billing address
    register_rest_route('custom-api/v1', '/billing-addresses/add', array(
        'methods' => 'POST',
        'callback' => 'add_billing_address',
        'permission_callback' => function () {
            return is_user_logged_in();
        },
    ));

    // Route to update existing billing addresses
    register_rest_route('custom-api/v1', '/billing-addresses/update', array(
        'methods' => 'POST',
        'callback' => 'update_billing_addresses',
        'permission_callback' => function () {
            return is_user_logged_in();
        },
    ));
});

*/

/**
 * Fetch billing addresses for the current user
 */
 
 /*
function get_billing_addresses($request) {
    $user_id = get_current_user_id();

    if (!$user_id) {
        return new WP_Error('not_logged_in', 'You must be logged in to access this endpoint.', array('status' => 403));
    }

    // Always try to have an email fallback for logged in user
    $current_user = wp_get_current_user();
    $fallback_email = ( $current_user && $current_user->ID ) ? $current_user->user_email : '';

    // Log raw user meta for debugging
    error_log('Fetching billing addresses for user ID: ' . $user_id);

    $individual_address = array(
        'type' => 'individual',
        'firstName' => get_user_meta($user_id, 'billing_first_name', true) ?: '',
        'lastName' => get_user_meta($user_id, 'billing_last_name', true) ?: '',
        'email' => ( get_user_meta($user_id, 'billing_email', true) ?: $fallback_email ),
        'phone' => '', // phone intentionally blank
        'street' => get_user_meta($user_id, 'billing_address_1', true) ?: '',
        'billing_address_2' => get_user_meta($user_id, 'billing_address_2', true) ?: '',
        'buildingNumber' => '',
        'apartmentNumber' => '',
        'city' => get_user_meta($user_id, 'billing_city', true) ?: '',
        'postalCode' => get_user_meta($user_id, 'billing_postcode', true) ?: '',
    );

    // Parse building and apartment number
    if (!empty($individual_address['billing_address_2'])) {
        list($individual_address['buildingNumber'], $individual_address['apartmentNumber']) =
            array_pad(explode('/', $individual_address['billing_address_2']), 2, '');
    }

    $company_raw = get_user_meta($user_id, 'billing_company_address', true);
    $company_address = $company_raw ? json_decode( wp_unslash( $company_raw ), true ) : [];
    if (!is_array($company_address)) { $company_address = []; }
    if (!empty($company_address)) {
        $company_address['email'] = ( get_user_meta($user_id, 'billing_email', true) ?: $fallback_email );
        $company_address['phone'] = '';
    }

    $all_addresses = [];
    if (!empty($individual_address['street'])) {
        $all_addresses[] = $individual_address;
    }
    if (!empty($company_address)) {
        $all_addresses[] = array_merge($company_address, ['type' => 'company']);
    }

    return rest_ensure_response($all_addresses);
}
*/

/**
 * Add a new billing address for the current user
 */
 /*
function add_billing_address($request) {
    $user_id = get_current_user_id();
    $new_address = $request->get_param('address');

    // Log the received data
    error_log('add_billing_address - Payload: ' . print_r($new_address, true));

    if (!$user_id) {
        return new WP_Error('not_logged_in', 'You must be logged in to add an address.', ['status' => 403]);
    }

    if (!is_array($new_address) || empty($new_address['street']) || empty($new_address['city'])) {
        return new WP_Error('invalid_address', 'Invalid billing address format.', ['status' => 400]);
    }

    try {
        if ($new_address['type'] === 'company') {
            // Save company address, company name, and billing_company field
            update_user_meta($user_id, 'billing_company_name', $new_address['companyName']);
            update_user_meta($user_id, 'billing_company', $new_address['companyName']); // Add this line
            update_user_meta($user_id, 'billing_company_address', wp_json_encode($new_address, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        } elseif ($new_address['type'] === 'individual') {
            // Save individual address
            update_user_meta($user_id, 'billing_first_name', $new_address['firstName']);
            update_user_meta($user_id, 'billing_last_name', $new_address['lastName']);
            update_user_meta($user_id, 'billing_address_1', $new_address['street']);
            update_user_meta($user_id, 'billing_address_2', $new_address['billing_address_2']);
            update_user_meta($user_id, 'billing_city', $new_address['city']);
            update_user_meta($user_id, 'billing_postcode', $new_address['postalCode']);
        }

        return rest_ensure_response(['message' => 'Billing address saved successfully']);
    } catch (Exception $e) {
        error_log('add_billing_address - Error: ' . $e->getMessage());
        return new WP_Error('server_error', 'Failed to save billing address.', ['status' => 500]);
    }
}
*/

/**
 * Update existing billing addresses for the current user
 */
 
 /*
function update_billing_addresses($request) {
    $user_id = get_current_user_id();
    $addresses = $request->get_param('addresses');

    if (!is_array($addresses)) {
        return new WP_Error('invalid_addresses', 'Invalid billing addresses format.', ['status' => 400]);
    }

    try {
        foreach ($addresses as $address) {
            if ($address['type'] === 'individual') {
                update_user_meta($user_id, 'billing_first_name', $address['firstName']);
                update_user_meta($user_id, 'billing_last_name', $address['lastName']);
                update_user_meta($user_id, 'billing_address_1', $address['street']);
                update_user_meta($user_id, 'billing_address_2', $address['billing_address_2']);
                update_user_meta($user_id, 'billing_city', $address['city']);
                update_user_meta($user_id, 'billing_postcode', $address['postalCode']);
            } elseif ($address['type'] === 'company') {
                update_user_meta($user_id, 'billing_company_name', $address['companyName']);
                update_user_meta($user_id, 'billing_company_address', json_encode($address));
            }
        }

        return rest_ensure_response(['message' => 'Billing addresses updated successfully']);
    } catch (Exception $e) {
        error_log('update_billing_addresses - Error: ' . $e->getMessage());
        return new WP_Error('server_error', 'Failed to update billing addresses.', ['status' => 500]);
    }
}

*/
//NIP SAVING AND DISPLAYING

// Save billing_nip from REST API request to the order meta

/*
add_action('woocommerce_rest_insert_shop_order_object', 'save_billing_nip_from_rest_api', 10, 2);
function save_billing_nip_from_rest_api($order, $request) {
    if (!empty($request['billing']['billing_nip'])) {
        try {
            $order->update_meta_data('_billing_nip', sanitize_text_field($request['billing']['billing_nip']));
            $order->save(); // Save the meta data
        } catch (Exception $e) {
            // Log the error and send a response message
            error_log('Error saving billing_nip: ' . $e->getMessage());
            throw new Exception('Error saving billing_nip: ' . $e->getMessage());
        }
    }
}

// Include billing_nip in REST API response under meta_data
add_filter('woocommerce_rest_prepare_shop_order_object', 'add_billing_nip_to_meta_data', 10, 3);
function add_billing_nip_to_meta_data($response, $order, $request) {
    try {
        $billing_nip = $order->get_meta('_billing_nip');
        if (!empty($billing_nip)) {
            $response->data['meta_data'][] = [
                'key' => '_billing_nip',
                'value' => $billing_nip,
            ];
        }
    } catch (Exception $e) {
        error_log('Error adding billing_nip to REST API response: ' . $e->getMessage());
    }

    return $response;
}

// Save billing_nip during checkout (if applicable)
add_action('woocommerce_checkout_update_order_meta', 'save_billing_nip_to_order_meta');
function save_billing_nip_to_order_meta($order_id) {
    if (!empty($_POST['billing_nip'])) {
        try {
            update_post_meta($order_id, '_billing_nip', sanitize_text_field($_POST['billing_nip']));
        } catch (Exception $e) {
            error_log('Error saving billing_nip during checkout: ' . $e->getMessage());
        }
    }
}

// Display billing_nip in WooCommerce admin order page
add_action('woocommerce_admin_order_data_after_billing_address', 'display_billing_nip_in_admin_order', 10, 1);
function display_billing_nip_in_admin_order($order) {
    try {
        $billing_nip = $order->get_meta('_billing_nip');
        if (!empty($billing_nip)) {
            echo '<p><strong>' . __('NIP:', 'woocommerce') . '</strong> ' . esc_html($billing_nip) . '</p>';
        }
    } catch (Exception $e) {
        error_log('Error displaying billing_nip in admin order page: ' . $e->getMessage());
    }
}

// Log and return error messages for the REST API
add_filter('woocommerce_rest_insert_shop_order_object', function($order, $request) {
    try {
        // Debug incoming data
        $nip = $order->get_meta('_billing_nip');
    } catch (Exception $e) {
        throw new Exception('Error logging billing data: ' . $e->getMessage());
    }
}, 10, 2);

// Add REST API custom error response
add_filter('rest_pre_serve_request', function($result, $server, $request) {
    if (is_wp_error($result)) {
        $error_data = $result->get_error_data();
        $error_message = $result->get_error_message();
        error_log('REST API Error: ' . $error_message . ' | Data: ' . print_r($error_data, true));
    }

    return $result;
}, 10, 3);
*/


add_filter( 'woocommerce_package_rates', 'hvyt_force_zadbano_shipping_for_class', 100, 2 );



/**
 * Force only the "Zadbano" shipping method (instance 14) and make it free
 * whenever the cart contains a product that uses the "zadbano" shipping class.
 *
 * @param array $rates   Available shipping rates.
 * @param array $package Shipping package data.
 *
 * @return array
 */
function hvyt_force_zadbano_shipping_for_class( $rates, $package ) {
    if ( empty( $package['contents'] ) || ! is_array( $package['contents'] ) ) {
        return $rates;
    }

    $requires_zadbano = false;

    foreach ( $package['contents'] as $line ) {
        if ( empty( $line['data'] ) || ! is_object( $line['data'] ) ) {
            continue;
        }

        $product = $line['data'];
        if ( ! method_exists( $product, 'get_shipping_class' ) ) {
            continue;
        }

        $shipping_class = $product->get_shipping_class();

        if ( ! $shipping_class && $product->is_type( 'variation' ) ) {
            $parent_id = $product->get_parent_id();
            if ( $parent_id ) {
                $parent = wc_get_product( $parent_id );
                if ( $parent && method_exists( $parent, 'get_shipping_class' ) ) {
                    $shipping_class = $parent->get_shipping_class();
                }
            }
        }

        if ( ! $shipping_class ) {
            $class_id = method_exists( $product, 'get_shipping_class_id' ) ? $product->get_shipping_class_id() : 0;
            if ( $class_id ) {
                $term = get_term( $class_id, 'product_shipping_class' );
                if ( $term && ! is_wp_error( $term ) ) {
                    $shipping_class = $term->slug;
                }
            }
        }

        if ( $shipping_class && 'zadbano' === strtolower( $shipping_class ) ) {
            $requires_zadbano = true;
            break;
        }
    }

    if ( ! $requires_zadbano ) {
        return $rates;
    }

    foreach ( $rates as $rate_id => $rate ) {
        $instance_id = method_exists( $rate, 'get_instance_id' ) ? $rate->get_instance_id() : 0;
        $rate_matches = (string) $instance_id === '14';

        if ( method_exists( $rate, 'get_id' ) ) {
            $identifier = $rate->get_id();
            if ( $identifier === 'flat_rate:14' || $identifier === 'zadbano:14' ) {
                $rate_matches = true;
            }
        }

        if ( ! $rate_matches ) {
            unset( $rates[ $rate_id ] );
            continue;
        }

        if ( method_exists( $rate, 'set_cost' ) ) {
            $rate->set_cost( 0 );
        } else {
            $rates[ $rate_id ]->cost = 0;
        }

        if ( method_exists( $rate, 'set_taxes' ) ) {
            $rate->set_taxes( [] );
        } else {
            $rates[ $rate_id ]->taxes = [];
        }
    }

    return $rates;
}

/*Sorting*/
/*
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/sorted-products', [
        'methods' => 'GET',
        'callback' => 'custom_get_products',
        'permission_callback' => '__return_true', // Public access
    ]);
});

function custom_get_products(WP_REST_Request $request) {
    $args = [
        'post_type' => 'product',
        'posts_per_page' => $request->get_param('per_page') ?: 12,
        'paged' => $request->get_param('page') ?: 1,
    ];

    // Add category filtering
    if ($category = $request->get_param('category')) {
        $args['tax_query'] = [
            [
                'taxonomy' => 'product_cat',
                'field' => 'id',
                'terms' => $category,
            ],
        ];
    }

    // Handle sorting
    if ($orderby = $request->get_param('orderby')) {
        switch ($orderby) {
            case 'price':
                $args['meta_key'] = '_price';
                $args['orderby'] = 'meta_value_num';
                $args['order'] = $request->get_param('order') ?: 'asc';
                break;
            case 'rating':
                $args['meta_key'] = '_wc_average_rating';
                $args['orderby'] = 'meta_value_num';
                $args['order'] = $request->get_param('order') ?: 'desc';
                break;
            case 'popularity':
                $args['meta_key'] = 'total_sales';
                $args['orderby']  = 'meta_value_num';
                $args['order']    = $request->get_param('order') ?: 'desc';
                break;
            case 'date':
                $args['orderby'] = 'date';
                $args['order'] = $request->get_param('order') ?: 'desc';
                break;
            default:
                $args['orderby'] = 'menu_order';
                break;
        }
    }

    // Query products
    $query = new WP_Query($args);

    // Format response
    $products = [];
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $product = wc_get_product(get_the_ID());
            $sale_from = $product->get_date_on_sale_from();
            $sale_to   = $product->get_date_on_sale_to();
            $sale_from_str = $sale_from ? $sale_from->date('Y-m-d H:i:s') : null;
            $sale_to_str   = $sale_to ? $sale_to->date('Y-m-d H:i:s') : null;

            $products[] = [
                'id' => $product->get_id(),
                'name' => $product->get_name(),
                'price' => $product->get_price(),
                'regular_price' => $product->get_regular_price(),
                'sale_price' => $product->get_sale_price(),
                'on_sale' => $product->is_on_sale(),
                'total_sales' => (int) $product->get_total_sales(),
                'date_on_sale_from' => $sale_from_str,
                'date_on_sale_to' => $sale_to_str,
                'categories' => wp_get_post_terms($product->get_id(), 'product_cat', ['fields' => 'names']),
                'image' => wp_get_attachment_url($product->get_image_id()),
                'permalink' => $product->get_permalink(),
            ];
        }
        wp_reset_postdata();
    }

    return [
        'products' => $products,
        'total' => $query->found_posts,
        'total_pages' => $query->max_num_pages,
    ];
}

*/
/**PASSWORD RESET*/
/*
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/reset-password', [
        'methods' => 'POST',
        'callback' => 'send_custom_password_reset_link',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('custom/v1', '/reset-password-confirm', [
        'methods' => 'POST',
        'callback' => 'custom_reset_password',
        'permission_callback' => '__return_true',
    ]);
});

// Function to send reset password link
function send_custom_password_reset_link($request) {
    $email = sanitize_email($request->get_param('email'));

    if (!email_exists($email)) {
        return new WP_Error('invalid_email', __('Podany adres e-mail nie istnieje.', 'your-text-domain'), ['status' => 404]);
    }

    $user = get_user_by('email', $email);
    $reset_key = get_password_reset_key($user);

    if (is_wp_error($reset_key)) {
        return new WP_Error('reset_error', __('Nie udało się wygenerować linku resetującego hasło.', 'your-text-domain'), ['status' => 500]);
    }

    $reset_url = "https://hvyt.pl/zapomniane-haslo?key={$reset_key}&login=" . rawurlencode($user->user_login);

    // Send an HTML email
    $headers = ['Content-Type: text/html; charset=UTF-8'];
    $subject = 'Resetowanie hasła?';
    $first_name = get_user_meta($user->ID, 'first_name', true) ?: $user->user_login;

    ob_start();
    ?>
    <!DOCTYPE html>
    <html lang="pl" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Resetowanie hasła</title>
      <style type="text/css">
        body, table, td, p { margin:0; padding:0; font-family:'Neue Haas Grotesk Display Pro', Arial, sans-serif; color:#661F30; line-height:1.4; }
        a { color:#661F30; text-decoration:none; }
        .email-container { width:600px; background-color:#F0E0CF; padding:80px; }
        .header { text-align:center; font-family:'Nieuk Mono', Courier, monospace; font-size:24px; margin-bottom:40px; }
        .body-text { font-size:18px; padding:20px 0; }
        .body-text p { margin-bottom:1em; }
        .btn { display:inline-block; border-radius: 60px; border:1px solid #661F30; color:#661F30 !important; padding:12px 24px; text-decoration:none; font-weight:bold; }
        .footer { text-align:center; font-size:12px; padding-top:30px;  margin-top:30px; }
        .social-icons a { display:inline-block; margin:0 5px; }
      </style>
    </head>
    <body>
      <table class="email-container" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td class="header">
            <img src="https://wp.hvyt.pl/wp-content/uploads/2025/06/oops-forgot-your-password_.png" width="425" />
          </td>
        </tr>
        <tr>
          <td class="body-text">
            <p>Cześć <?php echo esc_html($first_name); ?>,</p>
            <p>Niedawno wysłano prośbę o zresetowanie hasła. Użyj poniższego przycisku, aby zresetować hasło. Link jest ważny przez 24 godziny.</p>
            <p><a class="btn" href="<?php echo esc_url($reset_url); ?>">Zresetuj swoje hasło &gt;</a></p>
            <p>Jeśli nie prosiłeś o reset, zignoruj ten e-mail lub napisz na <a href="mailto:hello@hvyt.pl">hello@hvyt.pl</a>.</p>
            <p>Jeśli masz problem z powyższym przyciskiem, skopiuj poniższy adres URL i wklej go w przeglądarce internetowej:</p>
            <p><a href="<?php echo esc_url($reset_url); ?>"><?php echo esc_html($reset_url); ?></a></p>
          </td>
        </tr>
            <tr>
      <td style="text-align:center; padding-top:30px;">
        <p>Bye,</p>
        <p><strong>H V Y T</strong></p>
      </td>
    </tr>

    <!-- Divider -->
    <tr>
      <td>
        <hr style="border:1px solid #661F30; margin:30px 0;" />
      </td>
    </tr>
        <tr>
          <td class="footer">
            <p class="social-icons">
              <a href="https://www.facebook.com/HVYTPL/" target="_blank"><img width="24" height="24" src="https://wp.hvyt.pl/wp-content/uploads/2025/06/Facebook.png"/></a>
              <a href="https://www.instagram.com/hvyt_pl/" target="_blank"><img width="24" height="24" src="https://wp.hvyt.pl/wp-content/uploads/2025/06/Vector.png"/></a>
              <a href="https://in.pinterest.com/meethvyt/" target="_blank"><img width="24" height="24" src="https://wp.hvyt.pl/wp-content/uploads/2025/06/Pinterest.png"/></a>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    <?php
    $html_message = ob_get_clean();
    $mail_sent = wp_mail($email, $subject, $html_message, $headers);

    if ( ! $mail_sent ) {
        return new WP_Error('mail_error', __('Nie udało się wysłać e-maila.', 'your-text-domain'), ['status' => 500]);
    }

    return [
        'success' => true,
        'message' => __('Link do resetowania hasła został wysłany na podany adres e-mail.', 'your-text-domain'),
    ];
}

// Function to reset password
function custom_reset_password($request) {
    $key = sanitize_text_field($request->get_param('key'));
    $login = sanitize_text_field($request->get_param('login'));
    $password = $request->get_param('password');

    $user = check_password_reset_key($key, $login);

    if (is_wp_error($user)) {
        return new WP_Error('invalid_key', __('Nieprawidłowy lub przeterminowany klucz.', 'your-text-domain'), ['status' => 400]);
    }

    // Password validation
    if (empty($password) || strlen($password) < 8) {
        return new WP_Error('invalid_password', __('Hasło musi mieć co najmniej 8 znaków.', 'your-text-domain'), ['status' => 400]);
    }
    if (!preg_match('/[A-Z]/', $password) || !preg_match('/[a-z]/', $password) || !preg_match('/[0-9]/', $password) || !preg_match('/[\W_]/', $password)) {
        return new WP_Error('invalid_password', __('Hasło musi zawierać wielką literę, małą literę, cyfrę i znak specjalny.', 'your-text-domain'), ['status' => 400]);
    }

    wp_set_password($password, $user->ID);

    return [
        'success' => true,
        'message' => __('Hasło zostało pomyślnie zmienione.', 'your-text-domain'),
    ];
}

*/


/*KONTAKT FORM*/

/*
function register_contact_form_route() {
  register_rest_route('custom/v1', '/contact', [
    'methods'             => 'POST',
    'callback'            => 'handle_contact_form_submission',
    'permission_callback' => '__return_true', // Adjust permission as needed
  ]);
}
add_action('rest_api_init', 'register_contact_form_route');

function handle_contact_form_submission( WP_REST_Request $request ) {
  // Sanitize and retrieve form data
  $name    = sanitize_text_field( $request->get_param('name') );
  $email   = sanitize_email( $request->get_param('email') );
  $message = sanitize_textarea_field( $request->get_param('message') );

    
  $to      = 'hello@hvyt.pl';
  $subject = 'HVYT| Formularz kontaktowy';
  $body    = "Name: $name\nEmail: $email\nMessage: $message";
  wp_mail( $to, $subject, $body );

return new WP_REST_Response( [ 'success' => true, 'message' => 'Formularz został wysłany pomyślnie!' ], 200 );

}
*/

//Wait list */


/*
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

*/ 

// Disable nonce verification for YITH WooCommerce Waiting List AJAX calls
add_filter('yith_wcwl_disable_ajax_nonce', '__return_true');




/*ORDERS VIEWS*/

/*
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
            <div>Przekierowywanie do płatności... Proszę czekać.</div>
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
                        overlay.innerHTML = '<div>Przekierowywanie do płatności... Proszę czekać.</div>';
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



*/


/*
function redirect_wp_404_to_nextjs() {
    // Only perform the redirect if this is a 404 and the request is not already for the 404 page.
    if ( is_404() ) {
        // Normalize the request URI (remove trailing slash)
        $current_uri = rtrim($_SERVER['REQUEST_URI'], '/');
        // If the current URI is not already "/404"
        if ( $current_uri !== '/404' ) {
            // Redirect explicitly to the Next.js 404 page on hvyt.pl
            wp_redirect( 'https://hvyt.pl/404', 302 );
            exit;
        }
    }
}
add_action( 'template_redirect', 'redirect_wp_404_to_nextjs' );


/*add_action('wp_ajax_nopriv_check_order_status', 'check_order_status_callback');
add_action('wp_ajax_check_order_status', 'check_order_status_callback');

function check_order_status_callback() {
    $order_id = isset($_GET['orderId']) ? sanitize_text_field($_GET['orderId']) : '';

    // Try to load the order.
    $order = wc_get_order( $order_id );
    $order_ready = ($order && is_a( $order, 'WC_Order' ));

    wp_send_json_success(array('order_ready' => $order_ready));
}
*/


/*function register_custom_order_status_endpoint() {
    register_rest_route( 'custom/v1', '/order-status', array(
        'methods'             => 'GET',
        'callback'            => 'custom_order_status_callback',
        'permission_callback' => '__return_true',
        'args'                => array(
            'orderId' => array(
                'required'          => true,
                'validate_callback' => function ( $param, $request, $key ) {
                    return is_numeric( $param );
                },
            ),
            'orderKey' => array(
                'required' => true,
            ),
        ),
    ) );
}
add_action( 'rest_api_init', 'register_custom_order_status_endpoint' );

function custom_order_status_callback( WP_REST_Request $request ) {
    $order_id  = absint( $request->get_param( 'orderId' ) );
    $order_key = sanitize_text_field( $request->get_param( 'orderKey' ) );

    if ( ! $order_id || empty( $order_key ) ) {
        return new WP_Error( 'invalid_params', __( 'Invalid order parameters.' ), array( 'status' => 400 ) );
    }

    $order = wc_get_order( $order_id );

    if ( ! $order || ! is_a( $order, 'WC_Order' ) ) {
        return new WP_Error( 'order_not_found', __( 'Order not found.' ), array( 'status' => 404 ) );
    }

    // Verify that the order key matches.
    if ( $order->get_order_key() !== $order_key ) {
        return new WP_Error( 'invalid_order_key', __( 'Invalid order key.' ), array( 'status' => 403 ) );
    }

    // Retrieve the order status. WooCommerce returns a slug like "new", "processing", etc.
    $status = $order->get_status();
    
    // Return the order status in uppercase (e.g., NEW, CONFIRMED, etc.)
    return rest_ensure_response( array(
        'orderId' => $order_id,
        'status'  => strtoupper( $status ),
    ) );
}
*/

add_filter( 'rest_url', function( $url ) {
    // swap the hvyt.pl host for the wp.hvyt.pl host
    return str_replace(
      'https://hvyt.pl/wp-json',
      'https://wp.hvyt.pl/wp-json',
      $url
    );
});

// Custom endpoint to delete the current user’s account
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/delete-account', [
        'methods'             => 'POST',
        'callback'            => 'custom_delete_account',
        'permission_callback' => function () {
            return is_user_logged_in();
        },
    ]);
});

function custom_delete_account(WP_REST_Request $request) {
    $user_id = get_current_user_id();
    if (!$user_id) {
        return new WP_Error('unauthorized', 'User not logged in', ['status' => 401]);
    }
    require_once ABSPATH . 'wp-admin/includes/user.php';
    wp_delete_user($user_id);
    return rest_ensure_response(['success' => true, 'message' => 'Account deleted']);
}

add_action('rest_api_init', function() {
    register_rest_route('custom/v1', '/review-media', [
        'methods' => 'POST',
        'callback' => function(WP_REST_Request $request) {
            // Only check if file exceeds allowed size
            if (isset($_FILES['file']) && $_FILES['file']['size'] > 10 * 1024 * 1024) { // 10 MB
                return new WP_Error(
                    'file_size',
                    'Twój plik jest za duży. Maksymalnie 10 MB ',
                    ['status' => 400]
                );
            }

            // Continue with your existing upload process
            $file = $_FILES['file'];
            require_once(ABSPATH . 'wp-admin/includes/file.php');
            $upload = wp_handle_upload($file, ['test_form' => false]);

            if (isset($upload['error'])) {
                return new WP_Error('upload_error', $upload['error'], ['status' => 500]);
            }

            return [
                'success' => true,
                'url' => $upload['url']
            ];
        },
        'permission_callback' => '__return_true'
    ]);
});

/**
 * Custom coupon restrictions (BFFORBFF, CASA10 etc.).
 *
 * @return array<string, array<string, mixed>>
 */
function hvyt_coupon_restrictions() {
    $rules = [
        // 10% code for handles – no extra exclusions.
        // CASA10 – should never discount furniture category at all.
        'casa10' => [
            'exclude_categories' => [ 'meble' ],
            'message' => __( 'Kod nie obejmuje produktów z kategorii Meble.', 'hello-elementor' ),
        ],
    ];

    return apply_filters( 'hvyt_coupon_restrictions', $rules );
}

/**
 * Check whether a product (or its parent) belongs to the provided taxonomy terms.
 *
 * @param array<int|string>|int|string $terms
 * @param string                       $taxonomy
 * @param WC_Product|mixed             $product
 */
function hvyt_coupon_product_has_term( $terms, $taxonomy, $product ) {
    if ( empty( $terms ) || ! is_object( $product ) || ! is_callable( [ $product, 'get_id' ] ) ) {
        return false;
    }

    $ids = [ $product->get_id() ];

    if ( is_callable( [ $product, 'is_type' ] ) && $product->is_type( 'variation' ) && is_callable( [ $product, 'get_parent_id' ] ) ) {
        $ids[] = $product->get_parent_id();
    }

    foreach ( array_filter( array_unique( $ids ) ) as $id ) {
        if ( has_term( $terms, $taxonomy, (int) $id ) ) {
            return true;
        }
    }

    return false;
}

/**
 * Robust sale detector (supports variations and price comparisons).
 *
 * @param WC_Product|mixed $product
 */
function hvyt_coupon_product_is_on_sale( $product ) {
    if ( ! is_object( $product ) ) {
        return false;
    }

    if ( is_callable( [ $product, 'is_on_sale' ] ) && $product->is_on_sale() ) {
        return true;
    }

    $get_price = static function( $obj, $method ) {
        return is_callable( [ $obj, $method ] ) ? $obj->{ $method }() : null;
    };

    $sale     = wc_format_decimal( $get_price( $product, 'get_sale_price' ) );
    $regular  = wc_format_decimal( $get_price( $product, 'get_regular_price' ) );
    $price    = wc_format_decimal( $get_price( $product, 'get_price' ) );
    $sale_raw = $get_price( $product, 'get_meta' ) ? $product->get_meta( '_sale_price' ) : '';

    if ( $sale && $regular && (float) $sale > 0 && (float) $regular > 0 && (float) $sale < (float) $regular ) {
        return true;
    }

    if ( '' !== $sale_raw && $regular && (float) $regular > 0 && (float) $sale_raw < (float) $regular ) {
        return true;
    }

    if ( $price && $regular && (float) $price > 0 && (float) $regular > 0 && (float) $price < (float) $regular ) {
        return true;
    }

    // Inherit from parent (variations).
    if ( is_callable( [ $product, 'get_parent_id' ] ) ) {
        $parent_id = (int) $product->get_parent_id();
        if ( $parent_id > 0 ) {
            $parent = wc_get_product( $parent_id );
            if ( $parent && hvyt_coupon_product_is_on_sale( $parent ) ) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Decide if coupon can touch a given product according to the configured rule.
 *
 * @param WC_Product|mixed $product
 */
function hvyt_coupon_product_is_allowed( $product, array $rule ) {
    if ( ! is_object( $product ) ) {
        return true;
    }

    if ( ! empty( $rule['exclude_categories'] ) && hvyt_coupon_product_has_term( $rule['exclude_categories'], 'product_cat', $product ) ) {
        return false;
    }

    if (
        ! empty( $rule['exclude_sale_items'] )
        && hvyt_coupon_product_is_on_sale( $product )
    ) {
        return false;
    }

    if (
        ! empty( $rule['exclude_categories_on_sale'] )
        && hvyt_coupon_product_has_term( $rule['exclude_categories_on_sale'], 'product_cat', $product )
        && hvyt_coupon_product_is_on_sale( $product )
    ) {
        return false;
    }

    if ( ! empty( $rule['include_categories'] ) && ! hvyt_coupon_product_has_term( $rule['include_categories'], 'product_cat', $product ) ) {
        return false;
    }

    return true;
}

/**
 * Prevent duplicated WooCommerce notices.
 */
function hvyt_coupon_notice_once( $message ) {
    if ( empty( $message ) || ! function_exists( 'wc_add_notice' ) ) {
        return;
    }

    if ( function_exists( 'wc_has_notice' ) && wc_has_notice( $message, 'error' ) ) {
        return;
    }

    wc_add_notice( $message, 'error' );
}

/**
 * Skip restricted items but keep the coupon active for the rest of the cart.
 */
function hvyt_coupon_filter_product_validity( $valid, $product, $coupon, $values ) {
    if ( ! $valid ) {
        return $valid;
    }

    $rules = hvyt_coupon_restrictions();
    $code  = strtolower( $coupon->get_code() );

    if ( empty( $rules[ $code ] ) ) {
        return $valid;
    }

    return hvyt_coupon_product_is_allowed( $product, $rules[ $code ] );
}
add_filter( 'woocommerce_coupon_is_valid_for_product', 'hvyt_coupon_filter_product_validity', 10, 4 );

/**
 * Allow coupons such as BFFORBFF/CASA10 even if cart also contains blocked products.
 */
function hvyt_coupon_allow_mixed_cart( $valid, $coupon ) {
    $rules = hvyt_coupon_restrictions();
    $code  = strtolower( $coupon->get_code() );

    if ( empty( $rules[ $code ] ) || ! function_exists( 'WC' ) || ! is_object( WC()->cart ) ) {
        return $valid;
    }

    $has_allowed = false;
    $has_blocked = false;

    foreach ( WC()->cart->get_cart() as $cart_item ) {
        if ( empty( $cart_item['data'] ) ) {
            continue;
        }

        if ( hvyt_coupon_product_is_allowed( $cart_item['data'], $rules[ $code ] ) ) {
            $has_allowed = true;
        } else {
            $has_blocked = true;
        }
    }

    if ( $has_allowed && $has_blocked && function_exists( 'wc_add_notice' ) ) {
        wc_add_notice(
            __( 'Rabat naliczony tylko dla produktów nieprzecenionych.', 'hello-elementor' ),
            'notice'
        );
        return true;
    }

    if ( $has_allowed ) {
        return true;
    }

    if ( ! empty( $rules[ $code ]['message'] ) ) {
        hvyt_coupon_notice_once( $rules[ $code ]['message'] );
    }

    return false;
}
add_filter( 'woocommerce_coupon_is_valid', 'hvyt_coupon_allow_mixed_cart', 99, 2 );

/**
 * Zero out discount on disallowed cart lines (keeps coupon active for others).
 */
function hvyt_coupon_filter_discount_amount( $amount, $discounting_amount, $cart_item, $single, $coupon ) {
    $rules = hvyt_coupon_restrictions();
    $code  = strtolower( $coupon->get_code() );

    if ( empty( $rules[ $code ] ) || empty( $cart_item['data'] ) ) {
        return $amount;
    }

    return hvyt_coupon_product_is_allowed( $cart_item['data'], $rules[ $code ] ) ? $amount : 0;
}
add_filter( 'woocommerce_coupon_get_discount_amount', 'hvyt_coupon_filter_discount_amount', 99, 5 );
function hvyt_upload_review_media( WP_REST_Request $request ) {
    // 1) Check shared secret header
    $secret = isset($_SERVER['HTTP_X_HVYT_UPLOAD_KEY']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_X_HVYT_UPLOAD_KEY'])) : '';
    $expected = defined('HVYT_UPLOAD_SECRET') ? HVYT_UPLOAD_SECRET : get_option('hvyt_upload_secret');

    if ( empty($expected) || empty($secret) || ! hash_equals((string) $expected, (string) $secret) ) {
        return new WP_Error('forbidden', __('Invalid upload key', 'hvyt'), ['status' => 403]);
    }

    // 2) Basic file presence
    if ( empty($_FILES) || empty($_FILES['file']) || empty($_FILES['file']['tmp_name']) ) {
        return new WP_Error('no_file', __('No file provided. Use multipart/form-data with field "file".', 'hvyt'), ['status' => 400]);
    }

    $file = $_FILES['file'];

    // 3) Validate size & type
    $allowed_mimes = [ 'image/jpeg', 'image/png', 'image/webp', 'image/gif' ];
    $type = isset($file['type']) ? $file['type'] : '';
    $size = isset($file['size']) ? (int) $file['size'] : 0;

    if ( $size <= 0 || $size > HVYT_UPLOAD_MAX_BYTES ) {
        return new WP_Error('file_size', sprintf(__('Max file size is %d bytes', 'hvyt'), HVYT_UPLOAD_MAX_BYTES), ['status' => 400]);
    }
    if ( ! in_array($type, $allowed_mimes, true) ) {
        return new WP_Error('file_type', __('Only JPG, PNG, WEBP, GIF are allowed.', 'hvyt'), ['status' => 400]);
    }

    // 4) Hand off to WP media handler
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';

    // Force uploads to treat as from a form field named 'file'
    $attachment_id = media_handle_upload('file', 0);

    if ( is_wp_error($attachment_id) ) {
        return new WP_Error('upload_failed', $attachment_id->get_error_message(), ['status' => 500]);
    }

    $url  = wp_get_attachment_url($attachment_id);
    $mime = get_post_mime_type($attachment_id);

    return rest_ensure_response([
        'id'   => $attachment_id,
        'url'  => $url,
        'mime' => $mime,
    ]);
}

// Ensure product_search_clicks table exists (lightweight tracking)
if ( ! function_exists( 'hvyt_ensure_search_clicks_table' ) ) {
    function hvyt_ensure_search_clicks_table() {
        global $wpdb;
        $table   = $wpdb->prefix . 'product_search_clicks';
        $exists  = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $table ) );
        if ( $exists === $table ) {
            return;
        }
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset = $wpdb->get_charset_collate();
        $sql = "CREATE TABLE {$table} (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            product_id BIGINT UNSIGNED NOT NULL,
            clicked_at DATETIME NOT NULL,
            PRIMARY KEY (id),
            KEY product_id (product_id),
            KEY clicked_at (clicked_at)
        ) {$charset};";
        dbDelta( $sql );
    }
}
add_action( 'init', 'hvyt_ensure_search_clicks_table' );

add_action('rest_api_init', function() {
    register_rest_route('hvyt/v1', '/log-search-click', [
        'methods' => 'POST',
        'callback' => function(WP_REST_Request $request) {
            global $wpdb;
            hvyt_ensure_search_clicks_table();
            $table = $wpdb->prefix . 'product_search_clicks';
            $product_id = intval($request->get_param('productId'));
            if ($product_id) {
                $wpdb->insert($table, [
                    'product_id' => $product_id,
                    'clicked_at' => current_time('mysql')
                ]);
            }
            return ['success' => true];
        },
        'permission_callback' => '__return_true'
    ]);

    register_rest_route('hvyt/v1', '/top-clicked-products', [
        'methods' => 'GET',
        'args'                => [
            'lang' => [
                'required'    => false,
                'type'        => 'string',
                'description' => 'Language slug',
				'default'     => 'pl',
				'sanitize_callback' => 'sanitize_key',
            ],			
        ],			
        'callback' => function($request) {
            global $wpdb;
			
			$lang = $request->get_param('lang');
			
            hvyt_ensure_search_clicks_table();
            $table = $wpdb->prefix . 'product_search_clicks';
			/*
            $ids = $wpdb->get_col("
                SELECT product_id
                FROM $table
                GROUP BY product_id
                ORDER BY COUNT(*) DESC
                LIMIT 3
            ");
			*/
			
			$ids = $wpdb->get_col("
				SELECT DISTINCT t.product_id
				FROM {$table} t
				INNER JOIN {$wpdb->prefix}icl_translations wpml_trans
					ON t.product_id = wpml_trans.element_id
				WHERE wpml_trans.element_type = 'post_product' 
					AND wpml_trans.language_code = '{$lang}'
				GROUP BY t.product_id
				ORDER BY COUNT(*) DESC
				LIMIT 3
			");
			
            if (empty($ids)) {
                return [];
            }
            $out = [];
            foreach ($ids as $pid) {
                $product = wc_get_product($pid);
                if (! $product) continue;
                $image_url = wp_get_attachment_url($product->get_image_id());
                $out[] = [
                    'id'    => $product->get_id(),
                    'slug'  => $product->get_slug(),
                    'name'  => $product->get_name(),
                    'image' => $image_url,
                ];
            }
            return rest_ensure_response($out);
        },
        'permission_callback' => '__return_true'
    ]);
});































