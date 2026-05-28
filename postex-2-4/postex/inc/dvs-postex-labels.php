<?php

add_action('init', 'woo_postex_print_label');
function woo_postex_print_label() {
	if(isset($_POST['hxs_print_btn'])) {
		$orders = $_POST['order'];
		$trackings = [];
		foreach($orders as $order) {
			if(isset($order['check'])) {
				$trackings[] = $order['tracking'];
			}
		}
		$trackings = implode(',', $trackings);
 		?>
 		<script>window.open('https://merchant.postex.pk/get-invoice?trackingNumbers=<?php echo $trackings ?>', '_newtab');</script>
     	<?php
    }
}


function woo_postex_labels_page() {

	$courier_folder = 'postex';

	$orderStatusId = 1;
	$orderStartDate = date('Y-m-d');
	$orderEndDate = date('Y-m-d');
	$hxs_date = $orderStartDate . ' - ' . $orderEndDate;

	if (isset($_POST['hxs_date_btn'])) {
		$orderStatusId = $_POST['hxs_status'];
		$orderStartDate = substr($_POST['hxs_date'], 0, 10);
		$orderEndDate = substr($_POST['hxs_date'], -10);
		$hxs_date = $orderStartDate . ' - ' . $orderEndDate;
	}

	$curl = curl_init();
	curl_setopt_array($curl, array(
	  CURLOPT_URL => 'https://api.postex.pk/services/integration/api/order/v1/get-all-order?orderStatusId='.$orderStatusId.'&startDate='.$orderStartDate.'&endDate='.$orderEndDate,
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
	$response = curl_exec($curl);
	curl_close($curl);
	$response = json_decode($response, true);

	if(isset($response['statusCode']) && $response['statusCode'] != 200) {
		echo '<br><br><center>';
		die('Error: Problem with PostEx Get all orders API connection');
		echo '</center>';
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
		</style>

		<script>
		$(document).on("click", "#hxs_print_btn", function() {
			$('#hxs_date').prop('required',false);
			$('#hxs_status').prop('required',false);
		});
		</script>		

	</head>

	<body>

		<center>
			<img src="<?php echo plugin_dir_url( __DIR__ ) . 'images/postex-logo.png'; ?>">	
			<h6 class="mt-2">Print Labels</h6>
		</center>	
		<br>

	    <form method="post" action="" id="hxs-sheet-form"> 
			<div id="hxs-form-filters" class="container-fluid">
				<div class="row">
					<div class="col-4">
						<input class="form-control" type="text" id="hxs_date" name="hxs_date" value="<?= $hxs_date ?>" autocomplete="off" placeholder="Select date range" style="height: 38px;" required>
					</div>

					<div class="col-2">
						<select class="form-select" id="hxs_status" name="hxs_status" required style="height: 38px;">
							<option selected disabled value="">Select Status</option>
							<option value="1">Unbooked</option>
							<option value="2">Booked</option>
							<option value="3">PostEx WareHouse</option>
							<option value="4">Out For Delivery</option>
							<option value="5">Delivered</option>
							<option value="6">Returned</option>
							<option value="7">Un-Assigned By Me</option>
							<option value="8">Expired</option>
							<option value="9">Delivery Under Review</option>
							<option value="15">Picked By PostEx</option>
							<option value="16">Out For Return</option>
							<option value="17">Attempted</option>
							<option value="13">En-Route to PostEx warehouse</option>
						</select>
					</div>

					<div class="col-2">
						<button class="btn btn-outline-success" name="hxs_date_btn" type="submit">Search</button>
					</div>

					<div class="col-md-4">
						<button class="btn btn-primary float-end ms-2" id="hxs_print_btn" name="hxs_print_btn" type="submit">Print Labels</button>
					</div>

				</div>
			</div>
			<br>
		
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

	            if(empty($response['dist'])) {
	            	?>
					<div class="container-fluid">
						<div class="alert alert-danger" role="alert">Sorry, No shipment found in this date range.</div>
					</div>
					<script>
						document.getElementById("hxs_print_btn").style.display = "none";
					</script>
					<?php
	            }

	            $parcels = $response['dist'];

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
			  $('input[name="hxs_date"]').daterangepicker({
					autoUpdateInput: <?php echo empty($hxs_date) ? 'false' : 'true' ?>,
			      	locale: {
			          cancelLabel: 'Clear',
					  format: "YYYY-MM-DD"
			      }
			  });
			  $('input[name="hxs_date"]').on('apply.daterangepicker', function(ev, picker) {
			      $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
			  });

			  $('input[name="hxs_date"]').on('cancel.daterangepicker', function(ev, picker) {
			      $(this).val('');
			  });

			});
		</script>
	</body>	

<?php
}