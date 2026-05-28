<?php
if ( ! defined( 'ABSPATH' ) ) exit;

add_filter( 'woocommerce_shop_order_search_fields', 'woo_postex_marketing_search_fields', 10, 1 );
function woo_postex_marketing_search_fields( $meta_keys ){
    $meta_keys[] = '_dvs_courier_list';
    $meta_keys[] = '_dvs_courier_tracking';
    return $meta_keys;
}

add_action( 'woocommerce_order_details_before_order_table', 'woo_postex_tracking_single_order', 10, 1 );
function woo_postex_tracking_single_order( $order ) {
    $dvs_courier_list = get_post_meta( $order->get_id(), '_dvs_courier_list', true );
    $dvs_courier_tracking = get_post_meta( $order->get_id(), '_dvs_courier_tracking', true );
    // Output Tracking box
    if( ! empty( $dvs_courier_list ) && $dvs_courier_list == 'PostEx' )
        echo '<p>Your order has been shipped via '. $dvs_courier_list .' and Tracking # is '. $dvs_courier_tracking .' . <a href="https://merchant.postex.pk/?cn='.$dvs_courier_tracking.'" target="blank" rel="no_follow">Get Live Tracking</a></p>';
}

add_filter( 'manage_edit-shop_order_columns', 'woo_postex_add_tracking_admin_list_column' );
function woo_postex_add_tracking_admin_list_column( $columns ) {
    $columns['woo_postex_show_tracking'] = 'PostEx';
    return $columns;
}

add_action( 'manage_shop_order_posts_custom_column', 'woo_postex_add_tracking_admin_list_column_content' );
function woo_postex_add_tracking_admin_list_column_content( $column ) {
    global $post;
    global $the_order;
    if ( 'woo_postex_show_tracking' === $column ) {
        $order = wc_get_order( $post->ID );
        $dvs_courier_list = get_post_meta( $order->get_id(), '_dvs_courier_list', true );
        $dvs_courier_tracking = get_post_meta( $order->get_id(), '_dvs_courier_tracking', true );
        if( ! empty( $dvs_courier_list ) && $dvs_courier_list == 'PostEx' ) {
            echo '<a href="https://merchant.postex.pk/?cn='.$dvs_courier_tracking.'" target="blank" rel="no_follow" style="font-size:12px">'.$dvs_courier_tracking.'</a>';
        }
    }
}


// Register Custom Order Status
add_filter( 'woocommerce_register_shop_order_post_statuses', 'woo_postex_new_custom_status' );
function woo_postex_new_custom_status( $order_statuses ){
    $order_statuses['wc-postex'] = array(                                 
   'label'                     => _x( 'Booked at PostEx', 'Order status Booked at PostEx', 'woocommerce' ),
   'public'                    => true,                                 
   'exclude_from_search'       => false,                                 
   'show_in_admin_all_list'    => true,                                 
   'show_in_admin_status_list' => true,                                 
   'label_count'               => _n_noop( 'Booked at PostEx <span class="count">(%s)</span>', 'Booked at PostEx <span class="count">(%s)</span>', 'woocommerce' ),                              
   ); 
   return $order_statuses;
}

add_filter( 'wc_order_statuses', 'woo_postex_custom_single_order_list' );
function woo_postex_custom_single_order_list( $order_statuses ) {
    $order_statuses['wc-postex'] = _x( 'Booked at PostEx', 'Order status', 'woocommerce' );
   return $order_statuses;
}


add_action('admin_head', 'woo_postex_custom_status_styling');
function woo_postex_custom_status_styling() {
echo '<style>
    .status-postex {
        color: #000000;
        background: #ffffff;
        border: 1px solid #94ce5b;
    }
</style>';
}
