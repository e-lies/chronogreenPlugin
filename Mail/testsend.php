<?php
//require './mailsender.php'; // If you're using Composer (recommended)
// Comment out the above line if not using Composer
// require("<PATH TO>/sendgrid-php.php");
// If not using Composer, uncomment the above line and
// download sendgrid-php.zip from the latest release here,
// replacing <PATH TO> with the path to the sendgrid-php.php file,
// which is included in the download:
// https://github.com/sendgrid/sendgrid-php/releases
require './MailFunction.php';
//$dotenv = new Dotenv\Dotenv(__DIR__);
//$dotenv->load();
$attachements[] = array(
    base64_encode(file_get_contents('ICICS2019.pdf')),
    '"application/pdf"',
    'MyPublish.pdf',
    "attachment"
);
/*[
    'content' => base64_encode(file_get_contents('ICICS2019.pdf')),
    'type' => '"application/pdf"',
    'name' => 'MyPublish.pdf'
];*/
$tos = array("racha.nairbenrekia@gmail.com"=>"Seddik Ilias","iliesseddik24@gmail.com"=>"Seed Ilies");
$ccs = array("iseddik@inttic.dz"=>"Mtek Ilias");
$replyTo = array("e-lies@hotmail.com"=>"e-lies");
$content = "<h3> Bonjour </h3><br/><p> Veuillez trouver vos affaires ci-joint...</p><br/><p> Cordialement </p>";
function testCallback($resp){
    echo "_ <pre>";
    print_r($resp);
}
SendMail($tos,$ccs,"Test mail",$content,$attachements,$replyTo,"testCallback");

/*$to = "iseddik@inttic.dz";
$subject = "Email service";
$message = "<p><strong> Réponse Auto </strong>\nCi-joint, votre fichier</p>";
$attachements[] = [
    'content' => base64_encode(file_get_contents('ICICS2019.pdf')),
    'type' => '"application/pdf"',
    'name' => 'test.pdf'
];
try {
    sendMail($to,$subject,$message,$attachements);
} catch (\Throwable $th) {
    echo 'Caught exception: '. $th->getMessage() ."\n";
}*/