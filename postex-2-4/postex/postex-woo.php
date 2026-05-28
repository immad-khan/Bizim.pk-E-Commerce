<?php

/**
 * Plugin Name: PostEx
 * Plugin URI: https://postex.pk/cod.html
 * Description: Create shipment bookings in PostEx. Get tracking updates, generate loadsheet and cancel shipments within Woocommerce dashboard. 
 * Version: 2.4
 * Author: PostEx 
 * Author URI: https://postex.pk
 * Developer: PostEx
 * Requires at least: 4.7
**/

/* WooCommerce CRUD ready */

if ( ! defined( 'ABSPATH' ) ) exit;

include_once('inc/dvs-postex-settings.php');
include_once('inc/dvs-meta-box.php');
include_once('inc/dvs-custom-functions.php');
include_once('inc/dvs-postex-loadsheet.php');
include_once('inc/dvs-postex-labels.php');
include_once('inc/dvs-postex-cancel.php');


add_action('admin_menu', 'woo_postex_menu');
function woo_postex_menu() {
    add_menu_page(
        'PostEx', 
        'PostEx', 
        'manage_options', 
        'woo_postex_api', 
        '', 
        'dashicons-admin-site');

    add_submenu_page( 
        'woo_postex_api', 
        'Settings', 
        'Settings',
        'manage_options', 
        'woo_postex_api', 
        'woo_postex_api_page');

    add_submenu_page( 
        'woo_postex_api', 
        'Print Labels', 
        'Print Labels',
        'manage_options', 
        'woo_postex_labels', 
        'woo_postex_labels_page');

    add_submenu_page( 
        'woo_postex_api', 
        'Generate Loadsheet', 
        'Generate Loadsheet',
        'manage_options', 
        'woo_postex_loadsheet', 
        'woo_postex_loadsheet_page');

    add_submenu_page( 
        'woo_postex_api', 
        'Cancel Shipments', 
        'Cancel Shipments',
        'manage_options', 
        'woo_postex_cancel', 
        'woo_postex_cancel_page');    

}

add_filter('plugin_action_links_' . plugin_basename( __FILE__ ), 'woo_postex_plugin_settings_link');
function woo_postex_plugin_settings_link($links) {
    $plugin_links = array('<a href="' . admin_url( 'admin.php?page=woo_postex_api' ) . '">' . __( 'Settings', '' ) . '</a>');
    return array_merge($plugin_links, $links);
}

