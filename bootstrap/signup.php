
<?php
// Connecting, selecting database
$link = mysql_connect('localhost', 'root','DeeyaT1489')

    or die('Could not connect: ' . mysql_error());
// echo 'Connected successfully';
mysql_select_db('jingo') or die('Could not select database');

//include('login1.html');

$error = array();
$results = array();


$username = "";
$Password = "";
$Email = "";



$username = mysql_real_escape_string($_POST['UserName']);
$Password = mysql_real_escape_string($_POST['Password']);
$Email = $_POST['Email'];
$enc_password = md5($Password);


if(mysql_query("INSERT INTO user values('".$username."','".$enc_password."','".$Email."')"))
{echo "success";}
else
{echo "failed";}

// Closing connection
mysql_close($link);


?>

