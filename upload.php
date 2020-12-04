<?php
//print_r($_FILES); //this will print out the received name, temp name, type, size, etc.


$size = $_FILES['audio_data']['size']; //the size in bytes
$input = $_FILES['audio_data']['tmp_name']; //temporary name that PHP gave to the uploaded file
$output = $_FILES['audio_data']['name'].".wav"; //letting the client control the filename is a rather bad idea

//move the file from temp name to local folder using $output name
move_uploaded_file($input, $output);
// print_r('audio=@/Users/tuanminh/Desktop/RADC/' . $output);

$curl = curl_init();
$file_path = 'audio=@/Users/tuanminh/Desktop/RADC/' . $output;
curl_setopt_array($curl, array(
  CURLOPT_URL => "https://vaisapis.vais.vn/analytic/v1/digitalization/audio-upsert-execute",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => array('audiosource_id' => '5fc87c34b4e02536e1899e31','audio'=> new CURLFILE('./' . $output)),
  CURLOPT_HTTPHEADER => array(
    "api-key: 2ff05476-352b-11eb-bf66-0242ac120004"
  ),
));
$response = curl_exec($curl);

curl_close($curl);
$decoded = json_decode($response,true);

// echo ($decoded["id"]);
echo ($response);

?>