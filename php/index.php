<?php
require 'vendor/autoload.php';
//\Slim\Slim::registerAutoloader();

$app = \Slim\Slim();
$app->get('/hello', function () {
    echo "HELLO SLIM";
  });
$app->run();

// echo "hello";
// 
// function isLoggedIn() {
	// // session_start();
	// // if(!$_SESSION['loggedin']){
		// // echo "false";
	// // }
	// // else{
		// // echo "true";
	// // };
	// echo "hello";
// }
// 
// function getConnection() {
	// $dbhost = "127.0.0.1";
	// $dbuser = "root";
	// $dbpass = "  ";
	// $dbname = "jingo";
	// $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
	// $dbh -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	// return $dbh;
// }
?>