<?php
/**
 * Plugin Name: HVYT product reviews
 * Description: Zapis opinii z karty produktu Next.js i media CusRev w odpowiedzi REST.
 * Place this file in wp-content/mu-plugins/ on wp.hvyt.pl.
 * Define the same secret as HVYT_REVIEW_UPLOAD_KEY in the Next app:
 * define('HVYT_REVIEW_UPLOAD_KEY', '...');
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/product-review', array(
        array(
            'methods' => 'GET',
            'callback' => 'hvyt_product_review_limits',
            'permission_callback' => '__return_true',
        ),
        array(
            'methods' => 'POST',
            'callback' => 'hvyt_product_review_create',
            'permission_callback' => 'hvyt_product_review_secret_ok',
        ),
    ));

    register_rest_route('custom/v1', '/product-review-media', array(
        'methods' => 'POST',
        'callback' => 'hvyt_product_review_upload',
        'permission_callback' => '__return_true',
    ));

    register_rest_route('custom/v1', '/review-media', array(
        'methods' => 'POST',
        'callback' => 'hvyt_review_media_upload',
        'permission_callback' => '__return_true',
    ));
});

function hvyt_product_review_attachment_thumb($id) {
    foreach (array('woocommerce_thumbnail', 'medium', 'thumbnail') as $size) {
        $thumb = wp_get_attachment_image_url((int) $id, $size);
        if ($thumb) {
            return $thumb;
        }
    }
    return '';
}

function hvyt_product_review_push_media(&$media, $type, $url, $thumb = '') {
    if (!is_string($url) || $url === '') {
        return;
    }
    if ($type !== 'image' || !is_string($thumb) || $thumb === '') {
        $thumb = $type === 'image' ? $url : '';
    }
    $item = array('type' => $type, 'url' => $url);
    if ($thumb !== '') {
        $item['thumb'] = $thumb;
    }
    $media[] = $item;
}

function hvyt_product_review_prepare_response($response, $review) {
    $data = $response->get_data();
    $media = array();

    foreach ((array) get_comment_meta($review->comment_ID, 'ivole_review_image') as $pic) {
        if (is_array($pic) && !empty($pic['url'])) {
            hvyt_product_review_push_media($media, 'image', $pic['url'], $pic['url']);
        }
    }
    foreach ((array) get_comment_meta($review->comment_ID, 'ivole_review_image2') as $id) {
        $url = wp_get_attachment_url((int) $id);
        if ($url) {
            hvyt_product_review_push_media($media, 'image', $url, hvyt_product_review_attachment_thumb($id));
        }
    }
    foreach ((array) get_comment_meta($review->comment_ID, 'ivole_review_video') as $vid) {
        if (is_array($vid) && !empty($vid['url'])) {
            hvyt_product_review_push_media($media, 'video', $vid['url']);
        }
    }
    foreach ((array) get_comment_meta($review->comment_ID, 'ivole_review_video2') as $id) {
        $url = wp_get_attachment_url((int) $id);
        if ($url) {
            hvyt_product_review_push_media($media, 'video', $url);
        }
    }

    $data['media'] = $media;
    $response->set_data($data);
    return $response;
}
add_filter('woocommerce_rest_prepare_product_review', 'hvyt_product_review_prepare_response', 10, 2);

function hvyt_review_media_upload(WP_REST_Request $request) {
    if (isset($_FILES['file']) && $_FILES['file']['size'] > 10 * 1024 * 1024) {
        return new WP_Error(
            'file_size',
            'Twój plik jest za duży. Maksymalnie 10 MB ',
            array('status' => 400)
        );
    }

    $file = $_FILES['file'];
    require_once ABSPATH . 'wp-admin/includes/file.php';
    $upload = wp_handle_upload($file, array('test_form' => false));

    if (isset($upload['error'])) {
        return new WP_Error('upload_error', $upload['error'], array('status' => 500));
    }

    return array(
        'success' => true,
        'url' => $upload['url'],
    );
}

function hvyt_product_review_secret() {
    if (defined('HVYT_REVIEW_UPLOAD_KEY') && HVYT_REVIEW_UPLOAD_KEY) {
        return (string) HVYT_REVIEW_UPLOAD_KEY;
    }
    $env = getenv('HVYT_REVIEW_UPLOAD_KEY');
    if (is_string($env) && $env !== '') {
        return $env;
    }
    return (string) get_option('hvyt_review_upload_key', '');
}

function hvyt_product_review_secret_ok(WP_REST_Request $request) {
    $secret = hvyt_product_review_secret();
    $given = (string) $request->get_header('x-hvyt-upload-key');
    if ($secret === '' || $given === '' || !hash_equals($secret, $given)) {
        return new WP_Error('hvyt_forbidden', 'Forbidden', array('status' => 401));
    }
    return true;
}

function hvyt_product_review_limits() {
    $max_files = (int) get_option('ivole_attach_image_quantity', 5);
    $max_mb = (int) get_option('ivole_attach_image_size', 25);
    if ($max_files < 1) {
        $max_files = 5;
    }
    if ($max_mb < 1) {
        $max_mb = 25;
    }
    return array(
        'maxFiles' => $max_files,
        'maxFileSizeMb' => $max_mb,
    );
}

function hvyt_product_review_b64url_encode($binary) {
    return rtrim(strtr(base64_encode($binary), '+/', '-_'), '=');
}

function hvyt_product_review_b64url_decode($value) {
    $pad = strlen($value) % 4;
    if ($pad) {
        $value .= str_repeat('=', 4 - $pad);
    }
    return base64_decode(strtr($value, '-_', '+/'), true);
}

function hvyt_product_review_read_token($token) {
    $secret = hvyt_product_review_secret();
    $parts = explode('.', (string) $token, 2);
    if ($secret === '' || count($parts) !== 2) {
        return new WP_Error('hvyt_token', 'Invalid upload token', array('status' => 401));
    }
    $expected = hvyt_product_review_b64url_encode(hash_hmac('sha256', $parts[0], $secret, true));
    if (!hash_equals($expected, $parts[1])) {
        return new WP_Error('hvyt_token', 'Invalid upload token', array('status' => 401));
    }
    $json = hvyt_product_review_b64url_decode($parts[0]);
    $data = is_string($json) ? json_decode($json, true) : null;
    if (!is_array($data) || ($data['purpose'] ?? '') !== 'review-media' || empty($data['nonce'])) {
        return new WP_Error('hvyt_token', 'Invalid upload token', array('status' => 401));
    }
    if (empty($data['exp']) || (int) round(microtime(true) * 1000) > (int) $data['exp']) {
        return new WP_Error('hvyt_token', 'Upload token expired', array('status' => 401));
    }
    return $data;
}

function hvyt_product_review_allowed_mimes() {
    return array(
        'jpg|jpeg|jpe' => 'image/jpeg',
        'png' => 'image/png',
        'gif' => 'image/gif',
        'webp' => 'image/webp',
        'mp4|m4v' => 'video/mp4',
        'webm' => 'video/webm',
        'ogv|ogg' => 'video/ogg',
        'mov|qt' => 'video/quicktime',
        'avi' => 'video/avi',
        'mpeg|mpg' => 'video/mpeg',
    );
}

function hvyt_product_review_upload(WP_REST_Request $request) {
    $raw = (string) $request->get_param('token');
    if ($raw === '') {
        $raw = (string) $request->get_header('x-hvyt-upload-token');
    }
    if ($raw === '') {
        return new WP_Error('hvyt_token', 'Invalid upload token', array('status' => 401));
    }
    $token = hvyt_product_review_read_token($raw);
    if (is_wp_error($token)) {
        return $token;
    }

    $limits = hvyt_product_review_limits();
    $files = $request->get_file_params();
    $file = $files['file'] ?? null;
    if (!is_array($file) || empty($file['tmp_name']) || (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        return new WP_Error('hvyt_file', 'File is required', array('status' => 400, 'code' => 'file_type'));
    }
    if ((int) $file['size'] > $limits['maxFileSizeMb'] * 1024 * 1024) {
        return new WP_Error('hvyt_file_size', 'File is too large', array('status' => 400, 'code' => 'file_too_large'));
    }

    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';

    $upload = wp_handle_upload($file, array(
        'test_form' => false,
        'mimes' => hvyt_product_review_allowed_mimes(),
    ));
    if (!empty($upload['error']) || empty($upload['file'])) {
        return new WP_Error('hvyt_file_type', 'Unsupported file type', array('status' => 400, 'code' => 'file_type'));
    }

    $attachment_id = wp_insert_attachment(array(
        'post_mime_type' => $upload['type'],
        'post_title' => sanitize_file_name(pathinfo($file['name'], PATHINFO_FILENAME)),
        'post_content' => '',
        'post_status' => 'inherit',
    ), $upload['file']);
    if (!$attachment_id || is_wp_error($attachment_id)) {
        return new WP_Error('hvyt_upload', 'Upload failed', array('status' => 500, 'code' => 'upload_failed'));
    }

    $metadata = wp_generate_attachment_metadata($attachment_id, $upload['file']);
    if (is_array($metadata)) {
        wp_update_attachment_metadata($attachment_id, $metadata);
    }
    update_post_meta($attachment_id, '_hvyt_review_nonce', sanitize_text_field($token['nonce']));

    return array(
        'id' => (int) $attachment_id,
        'url' => wp_get_attachment_url($attachment_id),
        'mime' => get_post_mime_type($attachment_id),
    );
}

function hvyt_product_review_create(WP_REST_Request $request) {
    $product_id = (int) $request->get_param('product_id');
    $name = sanitize_text_field((string) $request->get_param('reviewer'));
    $email = sanitize_email((string) $request->get_param('reviewer_email'));
    $content = sanitize_textarea_field((string) $request->get_param('review'));
    $rating = (int) $request->get_param('rating');
    $nonce = sanitize_text_field((string) $request->get_param('nonce'));
    $ids = $request->get_param('attachment_ids');

    if ($product_id < 1 || get_post_type($product_id) !== 'product' || $name === '' || !is_email($email) || $content === '' || $rating < 1 || $rating > 5) {
        return new WP_Error('hvyt_review', 'Invalid review', array('status' => 400, 'code' => 'validation'));
    }
    if (!is_array($ids) || $nonce === '') {
        return new WP_Error('hvyt_review', 'Invalid attachments', array('status' => 400, 'code' => 'validation'));
    }

    $limits = hvyt_product_review_limits();
    $ids = array_values(array_unique(array_map('intval', $ids)));
    if (count($ids) < 1 || count($ids) > $limits['maxFiles']) {
        return new WP_Error('hvyt_review', 'Too many files', array('status' => 400, 'code' => 'too_many_files'));
    }

    $accepted = array();
    foreach ($ids as $attachment_id) {
        if (get_post_type($attachment_id) !== 'attachment') {
            return new WP_Error('hvyt_review', 'Invalid attachment', array('status' => 400, 'code' => 'validation'));
        }
        $stored_nonce = (string) get_post_meta($attachment_id, '_hvyt_review_nonce', true);
        if ($stored_nonce === '' || !hash_equals($stored_nonce, $nonce)) {
            return new WP_Error('hvyt_review', 'Invalid attachment', array('status' => 400, 'code' => 'validation'));
        }
        $path = get_attached_file($attachment_id);
        if (!$path || filesize($path) > $limits['maxFileSizeMb'] * 1024 * 1024) {
            return new WP_Error('hvyt_review', 'File is too large', array('status' => 400, 'code' => 'file_too_large'));
        }
        if (wp_attachment_is('image', $attachment_id)) {
            $accepted[] = array('id' => $attachment_id, 'meta' => 'ivole_review_image2');
        } elseif (wp_attachment_is('video', $attachment_id)) {
            $accepted[] = array('id' => $attachment_id, 'meta' => 'ivole_review_video2');
        } else {
            return new WP_Error('hvyt_review', 'Unsupported file type', array('status' => 400, 'code' => 'file_type'));
        }
    }

    $ip = (string) $request->get_param('client_ip');
    if (!filter_var($ip, FILTER_VALIDATE_IP)) {
        $ip = '';
    }

    $comment_id = wp_new_comment(array(
        'comment_post_ID' => $product_id,
        'comment_author' => $name,
        'comment_author_email' => $email,
        'comment_author_IP' => $ip,
        'comment_content' => $content,
        'comment_type' => 'review',
        'comment_approved' => 0,
        'comment_agent' => 'hvyt-pdp',
    ), true);
    if (is_wp_error($comment_id)) {
        return new WP_Error('hvyt_review', $comment_id->get_error_message(), array('status' => 400, 'code' => 'review_rejected'));
    }

    wp_update_comment(array(
        'comment_ID' => (int) $comment_id,
        'comment_approved' => 0,
    ));
    update_comment_meta($comment_id, 'rating', $rating);
    foreach ($accepted as $file) {
        add_comment_meta($comment_id, $file['meta'], $file['id'], false);
        delete_post_meta($file['id'], '_hvyt_review_nonce');
    }
    update_comment_meta($comment_id, 'ivole_media_count', count($accepted));

    return array('id' => (int) $comment_id, 'status' => 'hold');
}

function hvyt_upload_review_media(WP_REST_Request $request) {
    $secret = isset($_SERVER['HTTP_X_HVYT_UPLOAD_KEY']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_X_HVYT_UPLOAD_KEY'])) : '';
    $expected = defined('HVYT_UPLOAD_SECRET') ? HVYT_UPLOAD_SECRET : get_option('hvyt_upload_secret');

    if ($expected === '' || $expected === false || $secret === '' || !hash_equals((string) $expected, (string) $secret)) {
        return new WP_Error('forbidden', __('Invalid upload key', 'hvyt'), array('status' => 403));
    }

    if (empty($_FILES) || empty($_FILES['file']) || empty($_FILES['file']['tmp_name'])) {
        return new WP_Error('no_file', __('No file provided. Use multipart/form-data with field "file".', 'hvyt'), array('status' => 400));
    }

    $file = $_FILES['file'];
    $allowed_mimes = array('image/jpeg', 'image/png', 'image/webp', 'image/gif');
    $type = isset($file['type']) ? $file['type'] : '';
    $size = isset($file['size']) ? (int) $file['size'] : 0;

    if (!defined('HVYT_UPLOAD_MAX_BYTES') || $size <= 0 || $size > HVYT_UPLOAD_MAX_BYTES) {
        $limit = defined('HVYT_UPLOAD_MAX_BYTES') ? HVYT_UPLOAD_MAX_BYTES : 0;
        return new WP_Error('file_size', sprintf(__('Max file size is %d bytes', 'hvyt'), $limit), array('status' => 400));
    }
    if (!in_array($type, $allowed_mimes, true)) {
        return new WP_Error('file_type', __('Only JPG, PNG, WEBP, GIF are allowed.', 'hvyt'), array('status' => 400));
    }

    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';

    $attachment_id = media_handle_upload('file', 0);
    if (is_wp_error($attachment_id)) {
        return new WP_Error('upload_failed', $attachment_id->get_error_message(), array('status' => 500));
    }

    return rest_ensure_response(array(
        'id' => $attachment_id,
        'url' => wp_get_attachment_url($attachment_id),
        'mime' => get_post_mime_type($attachment_id),
    ));
}
