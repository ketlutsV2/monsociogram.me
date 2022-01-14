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

function delUser($user) {
  global $_;
  MainControl::init('school','backup');
  $pdo = sqliteConnect();
  if($user['user_pseudo']!=$_["pseudo_utilisateur"]){
    $stmt = $pdo->prepare("DELETE FROM users WHERE user_id=:user_id LIMIT 1");
    $stmt->bindValue(':user_id', $user['user_id']);
    $stmt->execute();
  }
  $stmt = $pdo->prepare("DELETE FROM sociogrammesSaves WHERE sociogrammeSave_user=:user_id");
  $stmt->bindValue(':user_id', $user['user_id']);
  $stmt->execute();
  $stmt = $pdo->prepare("DELETE FROM sociogrammesForms WHERE sociogramme_user=:user_id");
  $stmt->bindValue(':user_id', $user['user_id']);
  $stmt->execute();
  $stmt = $pdo->prepare("DELETE FROM groupes WHERE groupe_user=:user_id");
  $stmt->bindValue(':user_id', $user['user_id']);
  $stmt->execute();
  $stmt = $pdo->prepare("DELETE FROM agenda WHERE event_user=:user_id");
  $stmt->bindValue(':user_id', $user['user_id']);
  $stmt->execute();


delMemosByUser($user['user_id']);
delRelationsByUser($user['user_id']);
return true;
}

function existUser($user_pseudo) {
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("SELECT * FROM users WHERE user_pseudo=:user_pseudo  LIMIT 1");
  $stmt->bindValue(':user_pseudo', $user_pseudo);
  $stmt->execute();
  $result = $stmt->fetchAll();
  if (count($result) != 0) {
    return $result;
  } 
  return false;  
}

function addUser($user){  
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("INSERT INTO users (user_nom,user_prenom,user_pseudo,user_password,user_type,user_mail) VALUES (:user_nom,:user_prenom,:user_pseudo,:user_password,:user_type,:user_mail)");
  $stmt->execute(
    array(':user_nom' => $user['user_nom'],
      ':user_prenom' => $user['user_prenom'],
      ':user_pseudo' => $user['user_pseudo'],
      ':user_password' => $user['user_password'],
      ':user_type' => $user['user_type'],
      ':user_mail' => $user['user_mail'],    
    )
  );
  return true;
}

function verifUser($user_pseudo, $user_pass) {
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("SELECT * FROM users WHERE user_pseudo=:user_pseudo  LIMIT 1");
  $stmt->bindValue(':user_pseudo', $user_pseudo);
  $stmt->execute();
  $user = $stmt->fetch();
  if (!password_verify($user_pass, $user['user_password'])) {
    return false;
  } else {
    return $user;
  }
}

function getUserBySessionID($token_uuid){
  $pdo = sqliteConnect();

  $stmt = $pdo->prepare("SELECT * FROM tokens WHERE token_uuid=:token_uuid LIMIT 1");
  $stmt->bindValue(':token_uuid', $token_uuid);
  $stmt->execute();
  $token = $stmt->fetch();

  if ($token==false) {
    return false;
  }

  $stmt = $pdo->prepare("SELECT * FROM users WHERE user_id=:user_id  LIMIT 1");
  $stmt->bindValue(':user_id', $token['token_user']);
  $stmt->execute();
  $user = $stmt->fetch();

  $user['sessionID']=$token_uuid;
  if ($user!=false) {
    return $user;
  } else {
    return false;
  }
}

function getUsers($select="*") {
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("SELECT $select FROM users ORDER BY user_pseudo ASC");
  $stmt->execute();
  return $stmt->fetchAll();
}

function getUserById($user_id){
 $pdo = sqliteConnect();
 $stmt = $pdo->prepare("SELECT * FROM users WHERE user_id=$user_id LIMIT 1");
 $stmt->execute();
 return $stmt->fetch();
}

function isAdmin() {
  global $_,$user;
  $admins=getAdmins();
  if(in_array($user['user_id'],$admins) OR count($admins)==0){
    return true;
  }
  return false;
}

function getAdmins(){
 global $_;
 $pdo = sqliteConnect();
 $stmt = $pdo->prepare("SELECT user_id FROM users WHERE user_type='admin'");
 $stmt->execute();
 $result =$stmt->fetchAll();
 $admins=array();
 foreach ($result as $users) {
  $admins[]=$users['user_id'];
}
return $admins;
}

function updateUser($user) {
  $pdo = sqliteConnect();
  $updates = array();
  foreach ($user as $key => $value) {
    if ($key != 'user_id') {
      $updates[] = "" . $key . "=:" . $key  . "";
    }
  }
  $updateStr = implode(",", $updates);
  $sql="UPDATE users 
  SET " . $updateStr . "         
  WHERE user_id='" . $user['user_id'] . "' LIMIT 1";

  $stmt = $pdo->prepare($sql);

  foreach ($user as $key => &$value){
    if ($key != 'user_id') {
      $stmt->bindParam(':'.$key.'', $value);   
    }
  }
  $stmt->execute();
}

function updateUserToken($user_token,$user_id){
 $pdo = sqliteConnect();
 $stmt = $pdo->prepare("UPDATE users SET user_token='".$user_token."' WHERE user_id='".$user_id."' LIMIT 1");
 $stmt->execute();
 return true;
}

function updateUserPasswordWithToken($user_pseudo,$user_token,$user_passe){
 $pdo = sqliteConnect();
 $stmt = $pdo->prepare("UPDATE users SET user_password='".password_hash($user_passe, PASSWORD_DEFAULT)."', user_token=null 
  WHERE user_pseudo='".$user_pseudo."' AND user_token='".$user_token."' LIMIT 1");
 $stmt->execute();
 $count = $stmt->rowCount();
 if($count==0){
  return false;
}
return true;
}

function updateUserPassword($user_passe){
  global $user;
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("UPDATE users SET user_password='".password_hash($user_passe, PASSWORD_DEFAULT)."', user_token=null 
    WHERE user_id='".$user['user_id']."' LIMIT 1");
  $stmt->execute();
  $count = $stmt->rowCount();
  if($count==0){
    return false;
  }
  return true;
}