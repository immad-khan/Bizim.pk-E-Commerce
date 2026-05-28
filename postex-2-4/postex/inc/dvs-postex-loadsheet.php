<?php


// GENERATE LOADSHEET
add_action('init', 'woo_postex_print_loadsheet');
function woo_postex_print_loadsheet() {
	if( isset($_POST['hxs_loadsheet_btn']) && !empty($_POST['order']) ) {

		$orders = $_POST['order'];
		$pickUpAddressCode = $_POST['hxs_pickup'];

		foreach($orders as $order){
			if(isset($order['check'])){
				$trackings[] = $order['tracking'];
			}
		}

		$data = [
			"pickupAddress" => $pickUpAddressCode,
			"trackingNumbers" => $trackings,	
		];

		$loadsheet_data = json_encode($data);

		$curl = curl_init();
		curl_setopt_array($curl, array(
		  CURLOPT_URL => 'https://api.postex.pk/services/integration/api/order/v2/generate-load-sheet',
		  CURLOPT_RETURNTRANSFER => true,
		  CURLOPT_ENCODING => '',
		  CURLOPT_MAXREDIRS => 10,
		  CURLOPT_TIMEOUT => 30,
		  CURLOPT_FOLLOWLOCATION => true,
		  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		  CURLOPT_CUSTOMREQUEST => 'POST',
		  CURLOPT_POSTFIELDS => $loadsheet_data,
		  CURLOPT_HTTPHEADER => array(
		    'token: '.get_option('dvs_postex_token'),
		    'Content-Type: application/json'
		  ),
		));
		$loadsheet_response = curl_exec($curl);
		curl_close($curl);		
		header('Content-type: application/pdf');
		header('Content-Disposition: attachment; filename="postex-loadsheet.pdf"');
		echo $loadsheet_response;
		curl_close($curl);
		// $reload_url = '/wp-admin/admin.php?page=woo_postex_loadsheet';
		// wp_redirect($reload_url);
		// exit;
	}
}


function woo_postex_loadsheet_page() {

    $start_date = '';
    $end_date = '';
    $hxs_form_date = '';
	$hxs_operation_city = '';
	$unbooked_orders_status = false;

	// GET OPERATION CITIES
	$curl = curl_init();
	curl_setopt_array($curl, array(
	  CURLOPT_URL => "https://api.postex.pk/services/integration/api/order/v2/get-operational-city?operationalCityType=pickup",
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING => '',
	  CURLOPT_MAXREDIRS => 10,
	  CURLOPT_TIMEOUT => 30,
	  CURLOPT_FOLLOWLOCATION => true,
	  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST => 'GET',
	  CURLOPT_HTTPHEADER => array(
	    'token: '.get_option('dvs_postex_token'),
	    'Content-Type: application/json'
	  ),
	));
	$operation_cities_response = curl_exec($curl);
	curl_close($curl);

	$operation_cities = json_decode($operation_cities_response,true);

	if(isset($operation_cities['statusCode']) && $operation_cities['statusCode'] != 200) {
		echo '<br><br><center>';
		die('Error: Problem with PostEx operational cities API connection');
		echo '</center>';
	}


	// GET UNBOOKED ORDERS
	if ( isset($_POST['hxs_city_btn']) && !empty($_POST['hxs_operation_city']) ) {

		$hxs_form_date = $_POST['hxs_form_date'];
		$start_date = substr($_POST['hxs_form_date'], 0, 10);
		$end_date = substr($_POST['hxs_form_date'], -10);
		$hxs_operation_city = $_POST['hxs_operation_city'];

		$curl = curl_init();
		curl_setopt_array($curl, array(
		  CURLOPT_URL => 'https://api.postex.pk/services/integration/api/order/v2/get-unbooked-orders?startDate='.$start_date.'&endDate='.$end_date.'&cityName='.$hxs_operation_city,
		  CURLOPT_RETURNTRANSFER => true,
		  CURLOPT_ENCODING => '',
		  CURLOPT_MAXREDIRS => 10,
		  CURLOPT_TIMEOUT => 30,
		  CURLOPT_FOLLOWLOCATION => true,
		  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		  CURLOPT_CUSTOMREQUEST => 'GET',
		  CURLOPT_HTTPHEADER => array(
		    'token: '.get_option('dvs_postex_token'),
		    'Content-Type: application/json'
		  ),
		));
		$unbooked_orders_response = curl_exec($curl);
		curl_close($curl);

		$unbooked_orders = json_decode($unbooked_orders_response, true);

		if(isset($unbooked_orders['statusCode']) && $unbooked_orders['statusCode'] != 200) {
			echo '<br><br><center>';
			die('Error: Problem with PostEx Get Unbooked API connection');
			echo '</center>';
		}
		else {
			$unbooked_orders_status = true;
		}


		// GET MERCHANT ADDRESS
		$curl = curl_init();
		curl_setopt_array($curl, array(
		  CURLOPT_URL => 'https://api.postex.pk/services/integration/api/order/v1/get-merchant-address?cityName='.$hxs_operation_city,
		  CURLOPT_RETURNTRANSFER => true,
		  CURLOPT_ENCODING => '',
		  CURLOPT_MAXREDIRS => 10,
		  CURLOPT_TIMEOUT => 30,
		  CURLOPT_FOLLOWLOCATION => true,
		  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		  CURLOPT_CUSTOMREQUEST => 'GET',
		  CURLOPT_HTTPHEADER => array(
		    'token: '.get_option('dvs_postex_token'),
		    'Content-Type: application/json'
		  ),
		));
		$merchant_address_response = curl_exec($curl);
		curl_close($curl);

		$merchant_address = json_decode($merchant_address_response, true);

		if(isset($merchant_address['statusCode']) && $merchant_address['statusCode'] != 200) {
			echo '<br><br><center>';
			die('Error: Problem with PostEx Get Merchant Address API connection');
			echo '</center>';
		}
	}

	?>

	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
		<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet">		
		<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
		<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
		<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
		<script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
		<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>

		<style>
				.hxs-upload-table tr {
				font-size: 14px;
			}

			.hxs-upload-table td {
			    padding: 2px 3px !important;
			}

			.hxs-upload-table .form-control {
			    font-size: 13px;
			    border: none;
			}
			.form-check-input:checked {
				background-color: unset;
			}
			.wp-core-ui select {
				min-height: 38px;
			}
			.postex_hide {
				display: none !important;
			}
		</style>

		<script type="text/javascript">
			jQuery(function($) { 
			    $('body').on('change', '#bulkcheckbox', function(e) {
					$('.singlecheckbox').prop('checked', e.currentTarget.checked);
					$('.singlecheckbox').change();
			    });
			});
		</script>

		<script type="text/javascript">
			$(function() {
				$('input[name="hxs_form_date"]').daterangepicker({
					maxDate: new Date(),
					autoUpdateInput: <?php echo empty($hxs_form_date) ? 'false' : 'true' ?>,
					locale: {
						cancelLabel: 'Clear',
						format: "YYYY-MM-DD",
					}
				});
				$('input[name="hxs_form_date"]').on('apply.daterangepicker', function(ev, picker) {
					$(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
				});
				$('input[name="hxs_form_date"]').on('cancel.daterangepicker', function(ev, picker) {
					$(this).val('');
				});
			});
		</script>

		<script>
			// $(document).on("click", "#hxs_form_date_btn", function(){
			//   $('#hxs_city_btn').prop('required',false);
			// });
		</script>
	</head>

	<body>
		<center>
			<img src="<?php echo plugin_dir_url( __DIR__ ) . 'images/postex-logo.png'; ?>">	
			<h6 class="mt-2">Generate Loadsheet</h6>
		</center>	
		<br>

	<div class="container-fluid">
		<div class="row">
			<div class="col-6">
				<form method="post" action="" id="hxs-sheet-form"> 
					<div id="hxs-form-filters" class="">
						<div class="row">
							<div class="col-6">
								<input class="form-control" type="text" id="hxs_form_date" name="hxs_form_date" value="<?php echo $hxs_form_date ?>" autocomplete="off" placeholder="Filter by date range" required="true" style="border-color:#000000;height:39px">
							</div>
							<div class="col-4" style="padding: 0px">
								<select class="form-select" name="hxs_operation_city" id="hxs_operation_city" required="true" style="border-color:#000000">
                                    <option value="">Select Pickup City</option>
									<?php
									foreach ($operation_cities['dist'] as $operation_city) {
										if ($operation_city['operationalCityName'] == $hxs_operation_city) {
											echo "<option value='" . $operation_city['operationalCityName'] ."' selected>" . $operation_city['operationalCityName'] . "</option>";
										}
										else {										
											echo "<option value='" . $operation_city['operationalCityName'] ."'>" . $operation_city['operationalCityName'] . "</option>";
										}
									}
									?>
								</select>			
							</div>
							<div class="col-2">
								<button class="btn btn-outline-success" id="hxs_city_btn" name="hxs_city_btn" type="submit">Search</button>
							</div>
						</div>
					</div>
				</form>
			</div>

			<?php
			 if($unbooked_orders_status == true) { ?>
				<div class="col">
					<form method="post" action="">
						<div class="row mb-4">
							<div class="col-8">
								<select class="form-select" name="hxs_pickup" id="hxs_pickup" required>
									<option value="">Select Pickup Address</option>
									<?php
									foreach ($merchant_address['dist'] as $pickup_address) {
										echo "<option value='" . $pickup_address['address'] ."'>" . $pickup_address['address'] . "</option>";
									}
									?>
								</select>			
							</div>				
							<div class="col">
								<button class="btn btn-success" id="hxs_loadsheet_btn" name="hxs_loadsheet_btn" type="submit">Generate Loadsheet</button>
							</div>
						</div>	
				</div>
		</div>		
	</div>


		<div class="container-fluid">		
		        <table class="table table-bordered table-sm table-responsive hxs-upload-table">
		            <thead class="table-dark" style="text-align: center;">
		                <tr>
		                	<th scope="col"><input type="checkbox" class="form-check-input bulkcheckbox" value="" id="bulkcheckbox" name="bulkcheckbox" ></th>
		                    <th scope="col">#</th>
		                    <th scope="col">Date</th>                
		                    <th scope="col">Order</th>
		                    <th scope="col">Name</th>
		                    <th scope="col">Phone</th>
		                    <th scope="col">Address</th>
		                    <th scope="col">City</th>
		                    <th scope="col">COD</th>
		                    <th scope="col">Tracking</th>
		                    <th scope="col">Status</th>
		                </tr>
		            </thead>
		     
		            <tbody>

		            <?php

		            $count = 1;

		            if(empty($unbooked_orders['dist'])) {
						?>
						<div class="container-fluid">
							<div class="alert alert-danger" role="alert">Sorry, No shipment found in this date range.</div>
						</div>
						<script>
							document.getElementById("hxs_loadsheet_btn").style.display = "none";
						</script>
						<?php
		            }

		            $parcels = $unbooked_orders['dist'];
		            $parcels = array_reverse($parcels);

					foreach ($parcels as $parcel) {
						$transactionDate = $parcel['transactionDate'];				
						$orderRefNumber = $parcel['orderRefNumber'];
						$customerName = $parcel['customerName'];
						$customerPhone = $parcel['customerPhone'];
						$deliveryAddress = $parcel['deliveryAddress'];
						$cityName = $parcel['cityName'];				
						$invoicePayment = $parcel['invoicePayment'];
						$trackingNumber = $parcel['trackingNumber'];
						$transactionStatus = $parcel['transactionStatus'];

						?>

							<tr>
								<td width="2%">
									<input type="checkbox" class="form-check-input singlecheckbox" value="" id="check_<?= $count ?>" name="order[<?= $count ?>][check]" >
								</td>				

		                        <td width= "4%">  
		                            <input type="text" class="form-control form-control-sm hxs-center" readonly id="<?= $count ?>" name="<?= $count ?>" value="<?= $count ?>" />
		                        </td>

		                        <td width= "10%">  
		                            <input type="text" class="form-control form-control-sm hxs-center" readonly id="" name="" value="<?= $transactionDate ?>" required />
		                        </td> 

		                        <td width= "8%">  
		                            <input type="text" class="form-control form-control-sm hxs-center" readonly id="" name="" value="<?= $orderRefNumber ?>" required />
		                        </td> 

		                         <td width= "10%">  
		                            <input type="text" class="form-control form-control-sm" readonly id="" name="" value="<?= $customerName ?>" required />
		                        </td>
		                       
		                        <td width= "10%">  
		                            <input type="text" class="form-control form-control-sm hxs-center" readonly id="" name="" value="<?= $customerPhone ?>" required />
		                        </td> 

		                        <td width= "20%">  
		                            <input type="text" class="form-control form-control-sm" readonly id="" name="" value="<?= $deliveryAddress ?>" required />
		                        </td>                          

		                        <td width= "10%">  
		                            <input type="text" class="form-control form-control-sm hxs-center" readonly id="" name="" value="<?= $cityName ?>" required />
		                        </td> 

		                         <td width= "6%">  
		                            <input type="text" class="form-control form-control-sm hxs-center" readonly id="" name="" value="<?= $invoicePayment ?>" required />
		                        </td> 

		                        <td width= "12%">  
		                            <input type="text" class="form-control form-control-sm hxs-center" readonly id="tracking_<?= $count ?>" name="order[<?= $count ?>][tracking]" value="<?= $trackingNumber ?>" required />
		                        </td> 

		                         <td width= "15%">  
		                            <input type="text" class="form-control form-control-sm hxs-center" readonly id="" name="" value="<?= $transactionStatus ?>" required />
		                        </td>                      
							</tr> 

						<?php
						$count++;
					}
					?>
					</tbody>
				</table>
			</form>
		</div>
		<?php
		}
		?>		
	</body>

<?php
}