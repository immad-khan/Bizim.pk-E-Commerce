<?php

if ( ! defined( 'ABSPATH' ) ) exit;

//register plugin field settings
add_action( 'admin_init', 'woo_postex_plugin_settings' );
function woo_postex_plugin_settings() {
    register_setting( 'woo-postex-settings-group', 'dvs_postex_enable' );	
    register_setting( 'woo-postex-settings-group', 'dvs_postex_token' );
    register_setting( 'woo-postex-settings-group', 'dvs_postex_pickup' );
    register_setting( 'woo-postex-settings-group', 'dvs_postex_type' );
    register_setting( 'woo-postex-settings-group', 'dvs_postex_handling' );        
	register_setting( 'woo-postex-settings-group', 'dvs_postex_consignee' );       
    register_setting( 'woo-postex-settings-group', 'dvs_postex_remarks' );
    register_setting( 'woo-postex-settings-group', 'dvs_postex_product' );
    register_setting( 'woo-postex-settings-group', 'dvs_postex_product_check' );
    register_setting( 'woo-postex-settings-group', 'dvs_postex_pieces_check' );     
    register_setting( 'woo-postex-settings-group', 'dvs_postex_sku_check' );
    register_setting( 'woo-postex-settings-group', 'dvs_postex_weight_check' );
    register_setting( 'woo-postex-settings-group', 'dvs_postex_cod_check' ); 
    register_setting( 'woo-postex-settings-group', 'dvs_postex_status_check' );
    register_setting( 'woo-postex-settings-group', 'dvs_postex_notes_check' );                       
}

//Courier settings input fields
function woo_postex_api_page() { ?>
<div class="wrap">
<form method="post" action="options.php">
    <?php 
	settings_fields( 'woo-postex-settings-group' );
	do_settings_sections( 'woo-postex-settings-group' ); 
	$dvs_postex_type = get_option('dvs_postex_type');
	$dvs_postex_handling = get_option('dvs_postex_handling');
	$dvs_postex_consignee = get_option('dvs_postex_consignee');
    $dvs_postex_token = get_option('dvs_postex_token');
    $dvs_postex_pickup = get_option('dvs_postex_pickup');
 	?>
    <img src="<?php echo plugin_dir_url( __DIR__ ) . 'images/postex-logo.png'; ?>">
    <h2>PostEx Settings</h2>
    <table class="form-table">

        <tr>
        <th scope="row">Enable PostEx API</th>
        <td>
	    <?php
	    echo '<input type="checkbox" name="dvs_postex_enable" value="1" ' . checked( 1, get_option( 'dvs_postex_enable' ), false ) . ' />';?>
        </td>
        </tr>               

        <tr>
        <th scope="row">API Token</th>
        <td><input class="regular-text" placeholder="" type="password" name="dvs_postex_token" value="<?php echo esc_attr( get_option('dvs_postex_token') ); ?>" /></td>
        </tr>

        <?php

        if (!empty($dvs_postex_token)) {

            $curl = curl_init();
            curl_setopt_array($curl, array(
              CURLOPT_URL => 'https://api.postex.pk/services/integration/api/order/v1/get-merchant-address',
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => '',
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_FOLLOWLOCATION => true,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => 'GET',
              CURLOPT_HTTPHEADER => array(
                'token: '.$dvs_postex_token
              ),
            ));
            $response = curl_exec($curl);
            curl_close($curl);
            $result = json_decode($response, true);
			
            if($result['statusCode'] == 200) {

                $curl = curl_init();
                curl_setopt_array($curl, array(
                CURLOPT_URL => 'https://api.postex.pk/services/integration/api/order/v1/get-order-types',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'GET',
                CURLOPT_HTTPHEADER => array(
                    'token: '.$dvs_postex_token
                ),
                ));
                $postex_order_types = curl_exec($curl);
                curl_close($curl);
                $postex_order_types = json_decode($postex_order_types, true);


        ?>         
 
        <tr>
        <th scope="row">Pickup Address</th>
        <td>
            <select id="dvs_postex_pickup" name="dvs_postex_pickup" >
            <?php
            foreach ($result['dist'] as $pickup) { ?>
                <option value="<?php echo $pickup['addressCode'] ?>" <?php selected($dvs_postex_pickup, $pickup['addressCode']); ?>><?php echo $pickup['address'] ?></option>
            <?php } ?>
            </select>    
        </td>
        </tr>

        <tr>
        <th scope="row">Shipment Type</th>
        <td>
            <select id="dvs_postex_type" name="dvs_postex_type" >
                <?php
                foreach ($postex_order_types['dist'] as $postex_type) { ?>
                    <option value="<?php echo $postex_type ?>" <?php selected($dvs_postex_type, $postex_type); ?>><?php echo $postex_type ?></option>
                <?php } ?>
            </select>
        <td>        
        </tr>

        <tr>
        <th scope="row">Handling Type</th>
        <td>
            <select id="dvs_postex_handling" name="dvs_postex_handling" >
            	<option value="Yes" <?php selected($dvs_postex_handling,'Yes'); ?>>Fragile</option>
            </select>
        <td>        
        </tr>        

        <tr>
        <th scope="row">Consginee Details</th>
        <td>
            <select id="dvs_postex_consignee" name="dvs_postex_consignee" >
            <option value="Billing Details" <?php selected($dvs_postex_consignee,'Billing Details'); ?>>Billing Details</option>
            <option value="Shipping Details" <?php selected($dvs_postex_consignee,'Shipping Details'); ?>>Shipping Details</option>
            </select>
        <td>        
        </tr>

        <tr>
        <th scope="row">Remarks</th>
        <td><input class="regular-text" placeholder="" type="text" name="dvs_postex_remarks" value="<?php echo esc_attr( get_option('dvs_postex_remarks') ); ?>" required="true" /></td>
        </tr>

        <tr>
        <th scope="row">Default Products</th>
        <td><input class="regular-text" placeholder="" type="text" name="dvs_postex_product" value="<?php echo esc_attr( get_option('dvs_postex_product') ); ?>" /></td>
        </tr>    

        <tr>
        <th scope="row">Print Item Name in Label</th>
        <td>
        <?php
        echo '<input type="checkbox" name="dvs_postex_product_check" value="1" ' . checked( 1, get_option( 'dvs_postex_product_check' ), false ) . ' />';?>
        </td>
        </tr>

        <tr>
        <th scope="row">Print SKU Name in Label</th>
        <td>
        <?php
        echo '<input type="checkbox" name="dvs_postex_sku_check" value="1" ' . checked( 1, get_option( 'dvs_postex_sku_check' ), false ) . ' />';?>
        </td>
        </tr>      

        <tr>
        <th scope="row">Auto Calculate Weight</th>
        <td>
        <?php
        echo '<input type="checkbox" name="dvs_postex_weight_check" value="1" ' . checked( 1, get_option( 'dvs_postex_weight_check' ), false ) . ' />';?>
        </td>
        </tr>


        <tr>
        <th scope="row">Auto Calculate Pieces</th>
        <td>
        <?php
        echo '<input type="checkbox" name="dvs_postex_pieces_check" value="1" ' . checked( 1, get_option( 'dvs_postex_pieces_check' ), false ) . ' />';?>
        </td>
        </tr>           

        <tr>
        <th scope="row">Calculate Non-COD as Zero</th>
        <td>
        <?php
        echo '<input type="checkbox" name="dvs_postex_cod_check" value="1" ' . checked( 1, get_option( 'dvs_postex_cod_check' ), false ) . ' />';?>
        </td>
        </tr>

        <tr>
        <th scope="row">Print Order Notes in Remarks</th>
        <td>
        <?php
        echo '<input type="checkbox" name="dvs_postex_notes_check" value="1" ' . checked( 1, get_option( 'dvs_postex_notes_check' ), false ) . ' />';?>
        </td>
        </tr>         

        <th scope="row">Add PostEx Order Status</th>
        <td>
        <?php
        echo '<input type="checkbox" name="dvs_postex_status_check" value="1" ' . checked( 1, get_option( 'dvs_postex_status_check' ), false ) . ' />';?>
        </td>
        </tr>

        <?php
           }
            else {
                echo '<div class="notice notice-error is-dismissible"><p>Error: Invalid API Token. Please contact support: babar@postex.pk</p></div>';
            }
        }
        ?>        
    </table>

    <?php 	
	submit_button('Submit'); 
	?>
</form>

<br>
<a href="https://www.youtube.com/watch?v=aPI89EzyjCU" target="blank" class="woocommerce-Button button">Video Tutorial</a>
<br>
<br>
<a href="https://postex.pk" target="blank" class="woocommerce-Button button">Get Support</a>

</div>

<?php 
}


function woo_postex_orders_data($order_id) {

        if( empty(get_option( 'dvs_postex_token' ) )) {
            die('Please add API Token in PostEx plugin setting page');
        }

        $order = wc_get_order($order_id);

        foreach ($order->get_items() as $item_key => $item ) {
            $order_product = $item->get_product();
            $orders_items[] = array(
                'item_name' => $item['name'],
                'item_qty' => $item['qty'],
                'item_sku' => $order_product->get_sku(),
                'item_weight' => $order_product->get_weight(),

            );
        }
        
        $orders_data = array(
            'status' => $order->get_meta('_dvs_courier_check'),
            'order_id' => $order->get_id(),
            'order_number' => $order->get_order_number(),
            'gateway_name' => $order->get_payment_method_title(),
            'gateway' => $order->get_payment_method(),
            'amount' => $order->get_total(),
            'phone' => $order->get_billing_phone(),
            'email' => $order->get_billing_email(),
            'notes' => $order->get_customer_note(),
            'billing_name' => $order->get_billing_first_name() . ' ' . $order->get_billing_last_name(),
            'billing_address' => $order->get_billing_address_1() . ' ' . $order->get_billing_address_2(),
            'billing_city' => $order->get_billing_city(),
            'shipping_name' => $order->get_shipping_first_name() . ' ' . $order->get_shipping_last_name(),
            'shipping_address' => $order->get_shipping_address_1() . ' ' . $order->get_shipping_address_2(),
            'shipping_city' => $order->get_shipping_city(),
            'orders_items' => $orders_items,
        );

        return $orders_data;
}



function woo_postex_body_data($orders_data) {
    $response = [
        'orders' => $orders_data,
        'dvs_courier' => 'PostEx',
        'dvs_slug' => 'postex',
		'dvs_postex_token' => get_option('dvs_postex_token'),
        'dvs_type' => get_option( 'dvs_postex_type' ),
        'dvs_handling' => get_option( 'dvs_postex_handling' ),
        'dvs_consignee' => get_option( 'dvs_postex_consignee' ),
        'dvs_remarks' => get_option( 'dvs_postex_remarks' ),
        'dvs_product' => get_option( 'dvs_postex_product' ),
        'dvs_product_check' => get_option( 'dvs_postex_product_check' ),
        'dvs_sku_check' => get_option( 'dvs_postex_sku_check' ),
        'dvs_weight_check' => get_option( 'dvs_postex_weight_check' ), 
        'dvs_pieces_check' => get_option( 'dvs_postex_pieces_check' ),
        'dvs_notes_check' => get_option( 'dvs_postex_notes_check' ),
        'dvs_cod_check' => get_option( 'dvs_postex_cod_check' ),
    ];
    $body = json_encode($response, true);
    $url = 'https://app-woo.postex.pk/woo/form.php';
    $output = wp_remote_post( $url, array('method'=> 'POST','sslverify' => false,'timeout'=> 300,'body'=> $body));
    if (is_wp_error($output)) {
        $error = $output->get_error_message();
        echo "Error: $error";
    }
    else {
        $json = $output['body'];
        echo $json;
    }
}


add_filter( 'bulk_actions-edit-shop_order', 'woo_postex_bulk_actions',101 );
function woo_postex_bulk_actions( $bulk_array ) {
    $dvs_postex_enable = get_option( 'dvs_postex_enable' );
    if ($dvs_postex_enable == 1 ) {
        $bulk_array['mark_postex_orders'] = 'PostEx Bulk Booking';
    }
    return $bulk_array;
}


add_filter( 'handle_bulk_actions-edit-shop_order', 'woo_postex_bulk_action_handler', 10, 4 );
function woo_postex_bulk_action_handler( $redirect, $doaction, $object_ids ) {
	if ( $doaction !== 'mark_postex_orders' ) {
	    return $redirect;
	}
    $orders_data = [];
    $orders_items = [];
	foreach( $object_ids as $order_id ) {
        $orders_data[] = woo_postex_orders_data($order_id);

    }
    woo_postex_body_data($orders_data);
}


add_action('woocommerce_order_actions', 'woo_postex_single_order_action', 10, 1 );
function woo_postex_single_order_action( $actions ) {
    $dvs_postex_enable = get_option( 'dvs_postex_enable' );
    if ($dvs_postex_enable == 1 ) {    
        if ( is_array( $actions ) ) {
            $actions['postex_action'] = __( 'Book at PostEx' );
        }
    }
    return $actions;
}


add_action( 'woocommerce_order_action_postex_action', 'woo_postex_single_order_booking' );
function woo_postex_single_order_booking($order_id) {
    $orders_data = [];
    $orders_items = [];    
    $orders_data[] = woo_postex_orders_data($order_id);
    woo_postex_body_data($orders_data);
    die();
}


add_action( 'init', 'woo_postex_submit_form' );
function woo_postex_submit_form() {    
    if(!empty($_POST['dvs_courier']) && $_POST['dvs_courier'] == 'postex' ) {

        $orders = $_POST['order'];
        $msgs = '';
        $count = 0;
        $uncount = 0;
        $actualcount = 0;       
        $allcount = 1;

        $postex_labels = [];

        foreach($orders as $order) {

            if(!isset($order['check']))
            continue;

            $book_packet_array = array(
                'dvs_courier' => "POSTEX",
				'dvs_postex_token' => get_option('dvs_postex_token'),
                'dvs_postex_pickup' => get_option('dvs_postex_pickup'),
                'order' => $order,
            );

            $booking = json_encode($book_packet_array);

            $url = 'https://app-woo.postex.pk/woo/booking.php';
            $output = wp_remote_post( $url, array('method'=> 'POST','sslverify' => false,'timeout'=> 300,'body'=> $booking));
            if ( is_wp_error( $output ) ) {
                $error = $output->get_error_message();
                echo "Error: $error";
            }
            else {
                $json = $output['body'];
                $response = json_decode($json,true);
            }

            $order_id = $order['order_id'];
            $order_number = $order['order_number'];  

            if($response['statusCode'] == '0200') {

                $order = new WC_Order($order_id);

                $postex_tracking = $response['dist']['trackingNumber'];

                $postex_labels[] = $postex_tracking;

                $msgs .= "<div style='background-color:#107f61; color:#ffffff; padding:5px 10px; border: 1px solid #107f61; border-radius: 5px; margin: 5px 0px';><strong>${allcount}: </strong>Order # ".$order_number;

                $msgs .= "<span> [ Booked: ".$postex_tracking." ]</span></div>";
                
                $order->add_order_note("Order has been booked at PostEx with Tracking # ".$postex_tracking);

                $dvs_postex_status_check = get_option( 'dvs_postex_status_check' );

                if ($dvs_postex_status_check == 1) {
                    $order->update_status( 'wc-postex' );
                }
                
                update_post_meta( $order->get_id(), '_dvs_courier_list', 'PostEx');   
                update_post_meta( $order->get_id(), '_dvs_courier_tracking', $postex_tracking );
                update_post_meta( $order->get_id(), '_dvs_courier_check', 'Booked' );
                $count++;
            }
            else {
                $msgs .= "<div style='background-color:#ff4e4e; color:#ffffff; padding:5px 10px; border: 1px solid #ff4e4e; border-radius: 5px; margin: 5px 0px';'><strong>${allcount}: </strong>Order # ".$order_number;
                $msgs .= "<br><span> [ Error: ".$json." ]</span></div>";
                $uncount++;
            }
            $allcount++;
            $actualcount++;
        }   

        if($msgs!='') { ?>

        <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

        h3 {
            text-align: center;
        }

        .dvs-booking-result {
            width: 600px;
            margin: 0 auto;
            font-family: 'Roboto', sans-serif;
            margin-top: 20px;
        }               

        .dvs-btn-back {
            float: right;
            border: 1px solid #107f61;
            border-radius: 5px;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            background-color: #ffffff;
            color: #107f61;
            font-size: 16px;        
        }

        .dvs-btn-print {
            float: left;
            border: 1px solid #107f61;
            border-radius: 5px;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            background-color: #107f61;
            color: #ffffff;
            font-size: 16px;        
        }           

        </style>

        <?php
            echo '<div class="dvs-booking-result">';?>
            <center>    
            <img src="<?php echo plugin_dir_url( __DIR__ ) . 'images/postex-logo.png'; ?>">    
            <h3>PostEx Booking Summary</h3>
            </center>
            <?php 
            echo "Booked Packets = ${count}";
            echo '<br/>';
            echo '<br/>';       
            echo "Un-Booked Packets = ${uncount}";
            echo '<br/>';
            echo '<br/>';
            echo $msgs;
            echo '<br/>';
            echo '<br/>';
            $print_labels = implode(',', $postex_labels);

            ?>

            <script type="text/javascript">
                var shipperToken = "<?= get_option('dvs_postex_token') ?>";
                var trackingArray = "<?= $print_labels ?>".split(',');
                var trackingJson = JSON.stringify(trackingArray);
                fetch('https://api.postex.pk/services/reporting/api/report/integration/airway-bill', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': shipperToken
                    },
                    body: trackingJson
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok: ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.statusCode === '200') {
                        var pdfBase64 = data.dist;
                        var base64ToArrayBuffer = function(base64) {
                            var binaryString = window.atob(base64);
                            var len = binaryString.length;
                            var bytes = new Uint8Array(len);
                            for (var i = 0; i < len; i++) {
                                bytes[i] = binaryString.charCodeAt(i);
                            }
                            return bytes.buffer;
                        };
                        var pdfData = base64ToArrayBuffer(pdfBase64);
                        var blob = new Blob([pdfData], { type: 'application/pdf' });
                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = "postex-labels.pdf";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        $('#LabelSuccess').show();
                        setTimeout(function() {
                            $('#LabelSuccess').hide();
                        }, 4000);
                    } else {
                        $('#LabelError').show();
                        setTimeout(function() {
                            $('#LabelError').hide();
                        }, 4000);
                        console.error('Failed to download labels:', data);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            </script>

            <?php

            // echo '<a href="https://merchant.postex.pk/get-invoice?trackingNumbers='.$print_labels.'" target="blank" class="dvs-btn-print">Print Labels</a>';

            if($_SERVER['REQUEST_URI'] == '/wp-admin/post.php') {
                $btn_url = get_admin_url(null, 'post.php?post='.$order_id.'&action=edit');
            }
            else {
                $btn_url = get_admin_url(null, 'edit.php?post_type=shop_order');
            }
            echo '<a href="'.$btn_url.'" class="dvs-btn-back">Go Back</a>';
            echo '</div>';
        }
        die();   
    }
}

