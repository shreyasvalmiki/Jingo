<?php
//echo "trying to connect";
// Connecting, selecting database
$link = mysql_connect('localhost', 'root','DeeyaT1489')

    or die('Could not connect: ' . mysql_error());
// echo 'Connected successfully';
mysql_select_db('jingo') or die('Could not select database');

$error = array();
$results = array();

if (isset($_POST['user'])){

$username = $_POST['user'];
$Password = $_POST['pass'];

$query = "select userNm,passwd from user where userNm='".$username."' and passwd = '".$Password."' limit 1";
$result = mysql_query($query);

if (mysql_num_rows($result)== 1)
{echo "successful";
exit();}
else
{echo "failed";
exit();}
}

else {echo "not logged in";}
?>