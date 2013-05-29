
<?php
// Connecting, selecting database
$link = mysql_connect('localhost', 'root','DeeyaT1489')

    or die('Could not connect: ' . mysql_error());
// echo 'Connected successfully';
mysql_select_db('jingo') or die('Could not select database');


$username = "";
$Password = "";
$Email = "";

$error = array();
$results = array();

$username = $_POST['UserName'];
$Password = $_POST['Password'];
$Email = $_POST['Email'];

if(mysql_query("INSERT INTO user values('".$username."','".$Password."','".$Email."')"))
echo "success";
else
echo "failed";

// Closing connection
mysql_close($link);


?>