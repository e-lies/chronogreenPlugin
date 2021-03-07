<?php
//require '../vendor/autoload.php'; // If you're using Composer (recommended)
// Comment out the above line if not using Composer
 require 'static/sendgrid-php.php';
// If not using Composer, uncomment the above line and
// download sendgrid-php.zip from the latest release here,
// replacing <PATH TO> with the path to the sendgrid-php.php file,
// which is included in the download:
// https://github.com/sendgrid/sendgrid-php/releases

//$dotenv = new Dotenv\Dotenv(__DIR__);
//$dotenv->load();

//var_dump(getenv('SENDGRID_API_KEY'));
//die(0);
//echo getenv();die(0);
function sendMail($to,$subject,$message,$attachements,$replyTo){
    $email = new \SendGrid\Mail\Mail(); 
    $email->setFrom("iseddik@mtek-informatique.com", "Mtek");
    $email->setReplyTo($replyTo);
    $email->setSubject($subject);
    $email->addTo($to, "");
    $email->addContent("text/plain", $message);
    $email->addContent("text/html", $message);
    for ($i=0; $i < count($attachements); $i++) { 
        $attachement = $attachements[$i];
        $email->addAttachment(
            $attachement['content'],
            $attachement['type'],
            $attachement['name'],
            "attachment"
         );
         
    }
	$sendgrid = new \SendGrid("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");
         try {
             $response = $sendgrid->send($email);
             print $response->statusCode() . "\n";
             print_r($response->headers());
             print $response->body() . "\n";
         } catch (Exception $e) {
             echo 'Caught exception: '. $e->getMessage() ."\n";
         }
}

?>