<?php
if ( ! defined( 'ABSPATH' ) ) exit;

// Add Tracking meta box
add_action( 'add_meta_boxes', 'postex_tracking_box' );
function postex_tracking_box() {
    add_meta_box(
        'postex-tracking-modal',
        'PostEx Details',
        'postex_tracking_meta_box_callback',
        'shop_order',
        'side',
        'core'
    );
}

// Callback
function postex_tracking_meta_box_callback( $post ) {
    $dvs_courier_list = get_post_meta($post->ID, '_dvs_courier_list', true);
    $dvs_courier_tracking = get_post_meta( $post->ID, '_dvs_courier_tracking', true );
    $dvs_courier_check = get_post_meta( $post->ID, '_dvs_courier_check', true );
    echo '<input type="hidden" name="dvs_tracking_box_nonce" value="' . wp_create_nonce() . '">';

    if( ! empty( $dvs_courier_list ) && $dvs_courier_list == 'PostEx' ) {

    ?>

    <select name="dvs_courier_check" id="dvs_courier_check" class="postbox">
        <option value="Un-Booked" <?php selected($dvs_courier_check, 'Un-Booked'); ?>>Un-Booked</option>
        <option value="Booked" <?php selected($dvs_courier_check, 'Booked'); ?>>Booked</option>            
    </select>

    <select name="dvs_courier_list" id="dvs_courier_list" class="postbox">
        <option value="">Select Courier</option>
        <option value="PostEx" <?php selected($dvs_courier_list, 'PostEx'); ?>>PostEx</option>
    </select>

    <input style="width:100%;" type="text" name="dvs_courier_tracking" id="dvs_courier_tracking" placeholder="Tracking #" value="<?php echo $dvs_courier_tracking;?>"/> 

<?php   add_thickbox();

    if(!empty($dvs_courier_list) && !empty($dvs_courier_tracking)) { 

        echo '<a href="https://merchant.postex.pk/?cn='.$dvs_courier_tracking.'" target="blank" rel="no_follow" class="woocommerce-Button button" style="width: 48%; text-align:center; margin: 20px 0px 0px 0px; background: #107f61; border-color: #107f61; color: #ffffff;">View Tracking</a>';

        echo'<a href="#TB_inline?width=400&height=300&inlineId=postex-content-cancel" class="button-primary thickbox" onclick="postexcancelparcel(\'' . $post->ID . '\', \'' . $dvs_courier_list . '\', \'' . $dvs_courier_tracking . '\')" style="width: 48%; text-align:center; margin: 20px 0px 0px 4%; background: #ff4e4e; border-color: #ff4e4e">Cancel Shipment</a>';
        }

    }

?>

        <style>
            #TB_ajaxContent {
                width: 90% !important;
                margin: 0 auto !important;
            }
        </style>

        <div id="postex-content-cancel" style="display:none;">
            <div class="cancel-thickbox">
                <center><img src="<?php echo plugin_dir_url( __DIR__ ) . 'images/loader.gif'; ?>"></center>
            </div>
        </div>

        <script type='text/javascript'>
        function postexcancelparcel(orderId, courier, tracking) {
            loading = "<center><img src=\"<?php echo plugin_dir_url( __DIR__ ) . 'images/loader.gif'; ?>\"></center>"
            jQuery(".cancel-thickbox").html(loading);
            jQuery.ajax({
                type: 'POST',
                url: '<?php echo admin_url('/admin-ajax.php'); ?>',
                data: {
                    'action':   'postex_courier_cancel_tracking',
                    'dvs_order_id' : orderId,
                    'dvs_courier_list' : courier,                                     
                    'dvs_courier_tracking' : tracking,
                },                     
                success: function (response) {
                //  console.log(response);
                    jQuery(".cancel-thickbox").html(response);
                }                
            });
        }
        </script>



<?php }

add_action('wp_ajax_postex_courier_cancel_tracking', 'get_postex_courier_cancel_tracking');
function get_postex_courier_cancel_tracking() {
    $order_id = $_POST['dvs_order_id'];
    $order = new WC_Order( $order_id );
    $order_no = $order->get_order_number();
    $courier = $_POST['dvs_courier_list'];    
    $tracking = $_POST['dvs_courier_tracking'];

    if ($courier == 'PostEx') {

        $dvs_postex_token = get_option( 'dvs_postex_token' );

        $curl = curl_init();
        curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://api.postex.pk/services/integration/api/order/v1/cancel-order',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'PUT',
        CURLOPT_POSTFIELDS =>'{"trackingNumber": "' . $tracking . '"}',
        CURLOPT_HTTPHEADER => array(
        'token: '.$dvs_postex_token,
        'Content-Type: application/json'
        ),
        ));
        $result = curl_exec($curl);
        curl_close($curl);

        $response = json_decode($result, true);

        if($response['statusCode'] == '200') {
            $cancel_responce = "Success: Shipment has been cancelled at PostEx with Tracking # ".$tracking;

            $dvs_postex_status_check = get_option( 'dvs_postex_status_check' );

            if ($dvs_postex_status_check == 1) {
                $order->update_status( 'wc-processing' );
            }

            $order->add_order_note($cancel_responce);
            update_post_meta( $order->get_id(), '_dvs_courier_list', '');   
            update_post_meta( $order->get_id(), '_dvs_courier_tracking', '' );
            update_post_meta( $order->get_id(), '_dvs_courier_check', 'Un-Booked' );            
        }
        else {
            $cancel_responce = 'Error: There is an error during cancellation. Try again or contact support. <br><br>'.$result;
        }
    }       

    $current_page = admin_url( "post.php?post=".$order_id.'&action=edit' );

    echo '<center>';
    echo '<h3>Cancellation Result</h3>';
    echo $cancel_responce;
    echo '<br>';
    echo '<br>';
    echo 'Please click on Refresh Button to finalize cancellation process.';
    echo '<br>';
    echo '<br>';
    echo '<a href="'.$current_page.'" class="button-primary">Refresh</a>';
    echo '</center>';
    exit();
}




add_action( 'save_post', 'postex_tracking_save_meta_box_data' );
function postex_tracking_save_meta_box_data( $post_id ) {
    if ( isset($_POST[ 'post_type' ]) && 'shop_order' != $_POST[ 'post_type' ] )
        return $post_id;
    if ( ! isset( $_POST[ 'dvs_tracking_box_nonce' ] ) )
        return $post_id;

    $nonce = $_POST[ 'dvs_tracking_box_nonce' ];
    if ( ! wp_verify_nonce( $nonce ) )
        return $post_id;
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE )
        return $post_id;
    if ( ! current_user_can( 'edit_shop_order', $post_id ) && ! current_user_can( 'edit_shop_orders', $post_id ) )
        return $post_id;
    update_post_meta( $post_id, '_dvs_courier_list', sanitize_text_field( $_POST[ 'dvs_courier_list' ] ) );   
    update_post_meta( $post_id, '_dvs_courier_tracking', sanitize_text_field( $_POST[ 'dvs_courier_tracking' ] ) );  
    update_post_meta( $post_id, '_dvs_courier_check', sanitize_text_field( $_POST[ 'dvs_courier_check' ] ) );   
}
