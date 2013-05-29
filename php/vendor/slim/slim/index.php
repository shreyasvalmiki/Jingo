<?php

require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

session_start();

function getConnection() {
	$dbhost = "127.0.0.1";
	$dbuser = "root";
	$dbpass = "  ";
	$dbname = "jingo";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
	$dbh -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}




// GET route
$app -> get('/', function() {
	$template = '<a href="../../../../index.html">Jingo!</a>';
	echo $template;
});

$app -> get('/dummy', function() {
	$template = 'dummy';
	echo $template;
});

$app -> get('/isloggedin', function() {
	$out = array();
	if (isset($_SESSION['usernm'])) {
		//$out = array('out'=>'true');
		echo $_SESSION['usernm'];
	} else {
		//$out = array('out'=>'false');
		echo "false";
	}
	//echo json_encode($out);
});

$app -> post('/logout', function() {
	$out = array();
	if (isset($_SESSION['usernm'])) {
		//$out = array('out'=>'true');
		$_SESSION['usernm'] = null;
	}
	//echo json_encode($out);
});

$app -> get('/isexistinguser/:userNm', function($userNm) {
	$sql = "SELECT userNm FROM User WHERE userNm = :userNm";
	try {
		$db = getConnection();
		$prep = $db -> prepare($sql);
		$prep -> bindParam("userNm", $userNm);
		$prep -> execute();
		if ($dbUser = $prep -> fetch()) {
			echo "true";
		} else {
			echo 'false';
		}
	} catch(PDOException $e) {
		echo '{"error":{"text":' . $e -> getMessage() . '}}';
	}
});

$app -> post('/verifyuser', function() use($app) {
	//$request = \Slim\Slim::getInstance() -> request();
	$request = $app -> request();
	//parse_str($request -> getBody(),$userData);
	$userData = json_decode($request -> getBody());
	//echo $request -> getBody();
	$sql = "SELECT userNm, passwd, salt FROM User WHERE userNm = :userNm";
	try {
		$db = getConnection();
		$prep = $db -> prepare($sql);
		$prep -> bindParam("userNm", $userData -> userNm);
		$prep -> execute();
		if ($dbUser = $prep -> fetch()) {
			$userPass = hash('md5', $userData -> passwd . $dbUser['salt']);
			if($userPass == $dbUser['passwd']){
				$_SESSION['usernm'] = $dbUser['userNm'];
				echo "true";
			}
			else {
				echo "false";
			}
		} else {
			echo 'false';
		}
	} catch(PDOException $e) {
		echo '{"error":{"text":' . $e -> getMessage() . '}}';
	}
});

$app -> post('/newuser', function() use($app){
	
	$request = $app->request();
	$userData = json_decode($request -> getBody());
	$randomSalt = hash('md5', uniqid(mt_rand(1, mt_getrandmax()), true));
	$password = hash('md5', $userData -> passwd . $randomSalt);
	$userNm = $userData -> userNm;
	$email = $userData -> email;
	$db = getConnection();
	try {
		$db -> beginTransaction();
		$sql = "INSERT INTO User(userNm,email,passwd,salt) VALUES (:userNm,:email,:passwd,:salt)";
		$prep = $db -> prepare($sql);
		$prep -> bindParam("userNm", $userNm);
		$prep -> bindParam("email", $email);
		$prep -> bindParam("passwd", $password);
		$prep -> bindParam("salt", $randomSalt);
		$prep -> execute();
		
		$statusNm = "open";
		$statusMsg = "Open to receive all notes";
		$radius = 5;
		$isCurrentStatus = "y";
		$privId = 0;
		
		$sql1 = "INSERT INTO UserStatus(userNm,statusNm,statusMsg,radius,isCurrStatus,privId) VALUES (:userNm,:statusNm,:statusMsg,:radius,:isCurrStatus,:privId)";
		$prep = $db -> prepare($sql1);

		$prep -> bindParam("userNm", $userNm);
		$prep -> bindParam("statusNm", $statusNm);
		$prep -> bindParam("statusMsg", $statusMsg);
		$prep -> bindParam("radius", $radius);
		$prep -> bindParam("isCurrStatus", $isCurrentStatus);
		$prep -> bindParam("privId", $privId);
		$prep -> execute();
		$db -> commit();
		$db = null;
		$_SESSION['usernm'] = $userNm;
		echo $userNm . " created.";
	} catch(Exception $e) {
		$db -> rollback();
		echo '{"error":{"text":' . $e -> getMessage() . '}}';
	}
	
});


$app -> get('/getnotes/:lat/:lng', function($lat,$lng) use($app){

	$db = getConnection();
	try {
		
		$sql = "CALL pc_GetNotes(:userNm,now(),:lat,:lng)";
		$prep = $db -> prepare($sql);
		$prep -> bindParam("userNm", $_SESSION['usernm']);
		//$prep -> bindParam("now", $now);
		$prep -> bindParam("lat", $lat);
		$prep -> bindParam("lng", $lng);
		$prep -> execute();
		
		$sql1 = "SELECT userNm,noteId,distance,noteTxt,notedBy,allowComm,dtNoted,lat,lng,shouldReceive,dtReceived FROM Notification WHERE userNm = :userNm ORDER BY dtReceived,dtNoted DESC";
		$prep = $db -> prepare($sql1);
		$prep -> bindParam("userNm", $_SESSION['usernm']);
		$prep -> execute();
		$result = $prep -> fetchAll();
		echo json_encode($result);
		$db = null;
		//$db -> commit();
		
	} catch(Exception $e) {
		//$db -> rollback();
		echo '{"error":{"text":' . $e -> getMessage() . '}}';
	}
	
});


$app -> post('/addnote', function() use ($app){
	//echo("in PHP");
	$request = $app->request();
	$noteData = json_decode($request -> getBody());
	//echo($request -> getBody());
	$noteId = 0;
	$db = getConnection();
	try{
		$db -> beginTransaction();
		for($i = 0; $i < count($noteData -> topics); ++$i){
			$sql = "REPLACE INTO Topic (topicId) VALUES(:topic)";
			$prep = $db -> prepare($sql);
			$prep -> bindParam("topic",$noteData -> topics[$i]);
			$prep -> execute();
		}
		
		$sql = "INSERT INTO Note (noteTxt,dtTime,lat,lng) VALUES (:noteTxt,:dtTime,:lat,:lng)";
		$prep = $db -> prepare($sql);
		$prep -> bindParam("noteTxt",$noteData -> noteTxt);
		$prep -> bindParam("dtTime", $noteData -> dtTime);
		$prep -> bindParam("lat", $noteData -> lat);
		$prep -> bindParam("lng", $noteData -> lng);
		$prep -> execute();
		$noteId = $db -> lastInsertId();
		
		$sql = "INSERT INTO NotedBy (userNm,noteId,radius,allowComm,shouldRecur,privId,schId) VALUES (:userNm,:noteId,:radius,:allowComm,:shouldRecur,:privId,:schId)";
		$prep = $db -> prepare($sql);
		$prep -> bindParam("userNm", $_SESSION['usernm']);
		$prep -> bindParam("noteId", $noteId);
		$prep -> bindParam("radius", $noteData -> radius);
		$prep -> bindParam("allowComm", $noteData -> allowComm);
		$prep -> bindParam("shouldRecur", $noteData -> shouldRecur);
		$prep -> bindParam("privId", $noteData -> privId);
		$prep -> bindParam("schId", $noteData -> schId);
		$prep -> execute();
		
		for($i = 0; $i < count($noteData -> topics); ++$i){
			$sql = "REPLACE INTO NoteAbout (noteId,topicId) VALUES(:noteId,:topic)";
			$prep = $db -> prepare($sql);
			$prep -> bindParam("noteId",$noteId);
			$prep -> bindParam("topic",$noteData -> topics[$i]);
			$prep -> execute();
		}
		
		$db -> commit();
		$db = null;
		echo("Note Added.");
	} catch(PDOException $e){
		$db -> rollback();
		echo '{"error":{"text":' . $e -> getMessage() . '}}';
	}
	
});

$app -> get('/getmyscheds', function(){
	$sql = "SELECT schId, schNm FROM UserSchedule WHERE userNm = :userNm";
	try {
		$db = getConnection();
		$prep = $db -> prepare($sql);
		$prep -> bindParam("userNm", $_SESSION["usernm"]);
		$prep -> execute();
		$result = $dbUser = $prep -> fetchAll();
		echo json_encode($result);
			
	} catch(PDOException $e) {
		echo '{"error":{"text":' . $e -> getMessage() . '}}';
	}
});
$app -> post('/makecurrstatus/:statusNm',function($statusNm){
	$db = getConnection();
	try {
		$db -> beginTransaction();
		$sql = "UPDATE UserStatus SET isCurrStatus = 'n' WHERE isCurrStatus = 'y' AND userNm = :userNm";
		$prep = $db -> prepare($sql);
		$prep -> bindParam("userNm", $_SESSION["usernm"]);
		$prep -> execute();
		
		$sql = "UPDATE UserStatus SET isCurrStatus = 'y' WHERE statusNm = :statusNm AND userNm = :userNm";
		$prep = $db -> prepare($sql);
		$prep -> bindParam("userNm", $_SESSION["usernm"]);
		$prep -> bindParam("statusNm", $statusNm);
		$prep -> execute();
		$db -> commit();
	} catch(PDOException $e) {
		$db -> rollback();
		echo '{"error":{"text":' . $e -> getMessage() . '}}';
	}
});


$app -> post('/addstatus',function() use ($app){
	$request = $app->request();
	$statusData = json_decode($request -> getBody());
	$db = getConnection();
	try {
		$db -> beginTransaction();
		$sql = "INSERT INTO UserStatus VALUES (:userNm,:statusNm,:statusMsg,:radius,'n',:privId)";
		$prep = $db -> prepare($sql);
		$prep -> bindParam("userNm", $_SESSION["usernm"]);
		$prep -> bindParam("statusNm", $statusData -> statusNm);
		$prep -> bindParam("statusMsg", $statusData -> statusMsg);
		$prep -> bindParam("radius", $statusData -> radius);
		$prep -> bindParam("privId", $statusData -> privId);
		$prep -> execute();
		$db -> commit();
		echo "done";
	} catch(PDOException $e) {
		$db -> rollback();
		echo '{"error":{"text":' . $e -> getMessage() . '}}';
	}
});


$app -> get('/getnotifbytag/:tag',function($tag){
	$sql = "SELECT userNm,n.noteId,distance,noteTxt,notedBy,allowComm,dtNoted,lat,lng,shouldReceive,dtReceived FROM Notification n JOIN NoteAbout na ON n.noteId = na.noteId WHERE n.userNm = :userNm AND na.topicId LIKE ('%$tag%')";
	try {
		$db = getConnection();
		$prep = $db -> prepare($sql);
		$prep -> bindParam("userNm", $_SESSION["usernm"]);
		//$prep -> bindParam("topic", $tag);
		$prep -> execute();
		$result = $dbUser = $prep -> fetchAll();
		echo json_encode($result);
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":' . $e -> getMessage() . '}}';
	}
});


$app -> get('/getnotifbycontent/:tag',function($tag){
	$sql = "SELECT userNm,noteId,distance,noteTxt,notedBy,allowComm,dtNoted,lat,lng,shouldReceive,dtReceived FROM Notification WHERE userNm = ? AND noteTxt LIKE ('%$tag%')";
	try {
		$db = getConnection();
		$prep = $db -> prepare($sql);
		$prep -> bindParam(1, $_SESSION["usernm"]);
		//$prep -> bindParam(2, $tag);
		$prep -> execute();
		$result = $dbUser = $prep -> fetchAll();
		echo json_encode($result);
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":' . $e -> getMessage() . '}}';
	}
});




$app -> get('/getnotifbyloc/:lat/:lng/:radius',function($lat,$lng,$radius){
	try {
		
		$sql = "SELECT userNm,noteId,distance,noteTxt,notedBy,allowComm,dtNoted,lat,lng,shouldReceive,dtReceived FROM Notification WHERE userNm = :userNm AND fn_GetDistance(lat,lng,:lat,:lng) <= :radius";
		
		$db = getConnection();
		$prep = $db -> prepare($sql);
		$prep -> bindParam("userNm", $_SESSION["usernm"]);
		$prep -> bindParam("lat", $lat);
		$prep -> bindParam("lng", $lng);
		$prep -> bindParam("radius", $radius);
		$prep -> execute();
		$result = $dbUser = $prep -> fetchAll();
		echo json_encode($result);
		$db = null;	
	} catch(PDOException $e) {
		echo '{"error":{"text":' . $e -> getMessage() . '}}';
	}
});



$app -> get('/getmystatuses', function(){
	$sql = "SELECT statusNm,statusMsg,radius,isCurrStatus,privId FROM UserStatus WHERE userNm = :userNm";
	try {
		$db = getConnection();
		$prep = $db -> prepare($sql);
		$prep -> bindParam("userNm", $_SESSION["usernm"]);
		$prep -> execute();
		$result = $dbUser = $prep -> fetchAll();
		echo json_encode($result);
			
	} catch(PDOException $e) {
		echo '{"error":{"text":' . $e -> getMessage() . '}}';
	}
});

$app -> get('/getprivops', function(){
	$sql = "SELECT privId, privDesc FROM Privacy";
	try {
		$db = getConnection();
		$prep = $db -> prepare($sql);
		$prep -> execute();
		$result = $dbUser = $prep -> fetchAll();
		echo json_encode($result);
			
	} catch(PDOException $e) {
		echo '{"error":{"text":' . $e -> getMessage() . '}}';
	}
});



// POST route
$app -> post('/post', function() {
	echo 'This is a POST route';
});

// PUT route
$app -> put('/put', function() {
	echo 'This is a PUT route';
});

// DELETE route
// PUT route
$app -> put('/put', function() {
	echo 'This is a PUT route';
});
$app -> delete('/delete', function() {
	echo 'This is a DELETE route';
});

$app -> run();
