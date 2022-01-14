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

function addGroupe($groupe){  
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("INSERT INTO groupes (groupe_classe, groupe_user, groupe_name, groupe_data) VALUES (:groupe_classe, :groupe_user, :groupe_name, :groupe_data)");
  $stmt->execute(
    array(':groupe_classe' => $groupe['groupe_classe'],
     ':groupe_user' => $groupe['groupe_user'],
     ':groupe_name' => $groupe['groupe_name'],
     ':groupe_data' => $groupe['groupe_data']
   )
  );
  return true;
}
function getGroupesByUser(){
  global $user;
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("SELECT groupe_id,groupe_user,groupe_classe,groupe_name,groupe_data FROM groupes 
    INNER JOIN classes
    ON 'classes'.'classe_id' = 'groupes'.'groupe_classe' 
    WHERE groupe_user='".$user['user_id']."'");
  $stmt->execute();
  $result=$stmt->fetchAll();
  return $result;
}
function delGroupe($groupe){
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("DELETE FROM groupes WHERE groupe_id=".$groupe['groupe_id']." AND groupe_user=".$groupe['groupe_user']." LIMIT 1");
  $stmt->execute();
}

function delGroupesByUser($user_id){
 $pdo = sqliteConnect();
 $stmt = $pdo->prepare("DELETE FROM groupes WHERE groupe_user='$user_id'");
 $stmt->execute();
}
function delAllGroupes(){
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("DELETE FROM groupes");
  $stmt->execute();
}