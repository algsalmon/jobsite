<?php 
	//------------------- Edit here --------------------//
	$sendy_url = 'https://dealgrabba.online/sendy';
	$list = 'WP38972oOmDmNWssItdhwA';
	//------------------ /Edit here --------------------//

	//--------------------------------------------------//
	//POST variables
	$name = $_POST['name'];
	$email = $_POST['email'];
	$country = $_POST['country'];
	$referrer= $_POST['referrer'];
	$ipaddress = $_POST['ipaddress'];
	$gdpr = $_POST['gdpr'];
	$timeStamp = $_POST['timeStamp'];
	$gender = $_POST['gender'];
	$age = $_POST['age'];
	$lastName = $_POST['lastName'];
	
	//subscribe
	$postdata = http_build_query(
	    array(
			'name' => $name,
			'lastName' => $lastName,
			'email' => $email,
			'list' => $list,
			'country' => $country,
			'referrer' => $referrer,
			'ipaddress' => $ipaddress,
			'timeStamp' => $timeStamp,
			'gender' => $gender,
			'gdpr' => $gdpr,
			'age' => $age,
	    'boolean' => 'true'
	    )
	);
	$opts = array('http' => array('method'  => 'POST', 'header'  => 'Content-type: application/x-www-form-urlencoded', 'content' => $postdata));
	$context  = stream_context_create($opts);
	$result = file_get_contents($sendy_url.'/subscribe', false, $context);
	//--------------------------------------------------//
	
	echo $result;
?>