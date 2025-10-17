<?php
// save-json.php
$data = file_get_contents('php://input');
if(file_put_contents('events.json', $data)){
  echo "✅ Events saved successfully!";
}else{
  echo "❌ Failed to save events!";
}
?>
