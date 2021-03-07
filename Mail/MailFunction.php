<?php

require_once '../../vendor/autoload.php';
//require '../controllers/mailservice/static/sendgrid-php.php';

//use SendGrid\Mail\Mail;
function defaultCallback($resp){
    print_r($resp);
    return false;
}
function SendMail($tos,$ccs,$subject,$content,$attachments=[],$replyTo=[],$callback="defaultCallback"){

    $email = new \SendGrid\Mail\Mail();
    $email->setFrom("iseddik@mtek-informatique.com" , "Seddik ilyes");
    foreach ($tos as $mail => $label) {
        $email->addTo($mail,$label);//$tos is an associative array that contains key/value pairs:("recepient@"=>"label")
    }
    foreach ($ccs as $mail => $label) {
        $email->addCc($mail,$label);
    }    
    //$email->addCcs($ccs);//$css is an associative array that contains key/value pairs:("recepiend@"=>"label"
    $email->setSubject($subject);// $subject is a variable of string type
    $email->addContent("text/html", $content);//$content is a variable of text type
    $email->addAttachments($attachments);//$attachments  can be an  array or an  array of arrays 
    foreach ($replyTo as $mail => $label) {
        $email->setReplyTo($mail,$label);//$replyTo is an associative array that contains key/value pairs:("reply@"=>"label")
    }

    $sendgrid = new \SendGrid('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');
    try {
        $response = $sendgrid->send($email);
        $callback($response);
        
    } catch (Exception $e) {
        echo 'Caught exception: '.  $e->getMessage(). "\n";
    }
}
?>