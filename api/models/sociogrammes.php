<?php
// Copyright 2022 Pierre GIRARDOT

// This file is part of Sociogram.me.

// Sociogram.me is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version GPL-3.0-or-later of the License.

// Sociogram.me is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Sociogram.me.  If not, see <https://www.gnu.org/licenses/>.
function getSociogrammeById($sociogramme_id){
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("SELECT * FROM sociogrammesForms 
    WHERE sociogramme_id='$sociogramme_id'
    LIMIT 1");
  $stmt->execute();
  return $stmt->fetch();
}

function addSociogrammeSave($sociogramme){  
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("INSERT INTO sociogrammesSaves (sociogrammeSave_data,sociogrammeSave_classe,sociogrammeSave_user,sociogrammeSave_sociogramme,sociogrammeSave_picture,sociogrammeSave_date) VALUES (:sociogrammeSave_data,:sociogrammeSave_classe,:sociogrammeSave_user,:sociogrammeSave_sociogramme,:sociogrammeSave_picture,:sociogrammeSave_date)");
  $stmt->execute(
    array(':sociogrammeSave_data' => $sociogramme['sociogramme_data'],
      ':sociogrammeSave_classe' => $sociogramme['sociogramme_classe'],
      ':sociogrammeSave_user' => $sociogramme['sociogramme_user'],
      ':sociogrammeSave_sociogramme' => $sociogramme['sociogramme_id'],
      ':sociogrammeSave_picture' => $sociogramme['sociogramme_picture'],
      ':sociogrammeSave_date' => $sociogramme['sociogramme_date']
    )
  );
  return true;
}

function getSociogrammesSave($select="*"){
  global $user;
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("SELECT $select FROM sociogrammesSaves
    INNER JOIN classes
    ON 'classes'.'classe_id' = 'sociogrammesSaves'.'sociogrammeSave_classe' 
    WHERE sociogrammeSave_user='".$user['user_id']."'");
  $stmt->execute();
  return $stmt->fetchAll();
}

function delSociogrammeSave($sociogramme){
  global $user;
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("DELETE FROM sociogrammesSaves WHERE sociogrammeSave_sociogramme=".$sociogramme['sociogramme_id']." AND sociogrammeSave_user=".$user['user_id']." AND sociogrammeSave_classe=".$sociogramme['sociogramme_classe']." LIMIT 1");
  $stmt->execute();    
}

function createSociogramme($sociogramme){
 global $user;
 $pdo = sqliteConnect();
 $stmt = $pdo->prepare("INSERT INTO sociogrammesForms (sociogramme_name,sociogramme_questions,sociogramme_date,sociogramme_user) VALUES (:sociogramme_name,:sociogramme_questions,:sociogramme_date,:sociogramme_user)");
 $stmt->execute(
  array(':sociogramme_name' => $sociogramme['sociogramme_name'],
    ':sociogramme_questions' => $sociogramme['sociogramme_questions'],
    ':sociogramme_date' => $sociogramme['sociogramme_date'],
    ':sociogramme_user' =>$user['user_id']
  )
);
 return true;
}

function getSociogrammesByUser($select="*"){
  global $user;
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("SELECT $select FROM sociogrammesForms
   WHERE sociogramme_user='".$user['user_id']."'");
  $stmt->execute();
  return $stmt->fetchAll();
}

function updateSociogramme($sociogramme) {
  global $user;
  $pdo = sqliteConnect();
  $updates = array();
  foreach ($sociogramme as $key => $value) {
    if ($key != 'sociogramme_id') {
      $updates[] = "" . $key . "=" . $pdo->quote($value) . "";
    }
  }
  $updateStr = implode(",", $updates);
  $stmt = $pdo->prepare("UPDATE sociogrammesForms 
    SET " . $updateStr . "         
    WHERE sociogramme_id='" . $sociogramme['sociogramme_id'] . "' AND sociogramme_user='".$user['user_id']."'");
  $stmt->execute(); 
}

function deleteSociogramme($sociogramme_id){
  global $user;
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("DELETE FROM sociogrammesForms WHERE sociogramme_id=".$sociogramme_id." AND sociogramme_user=".$user['user_id']." LIMIT 1");
  $stmt->execute();    
  $stmt = $pdo->prepare("DELETE FROM sociogrammesSaves WHERE sociogrammeSave_sociogramme=".$sociogramme_id." AND sociogrammeSave_user=".$user['user_id']."");
  $stmt->execute();  
  $stmt = $pdo->prepare("DELETE FROM socioRelations WHERE socioRelation_sociogramme=".$sociogramme_id."");
  $stmt->execute();  
}