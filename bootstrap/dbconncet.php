<?php
// Connecting, selecting database
$link = mysql_connect('localhost', 'root','DeeyaT1489')

    or die('Could not connect: ' . mysql_error());
// echo 'Connected successfully';
mysql_select_db('jingo') or die('Could not select database');
?>
