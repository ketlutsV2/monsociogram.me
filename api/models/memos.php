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

function addMemo($memo){  
    global $user;
    $pdo = sqliteConnect();
    $stmt = $pdo->prepare("DELETE FROM memos WHERE memo_type='".$memo['memo_type']."' AND memo_type_id='".$memo['memo_type_id']."' LIMIT 1");
    $stmt->execute();
    if(trim($memo['memo_data'])==""){
      return true;
    }
    $stmt = $pdo->prepare("INSERT INTO memos (memo_user,memo_type,memo_type_id,memo_data) VALUES (:memo_user,:memo_type,:memo_type_id,:memo_data)");
    $stmt->execute(
        array(
         	':memo_user' => $memo['memo_user'],
          ':memo_type' => $memo['memo_type'],
          ':memo_type_id' => $memo['memo_type_id'],
          ':memo_data' => $memo['memo_data'],
            )
        );
    return true;
}
function getMemosByUser(){
   global $user;
   $pdo = sqliteConnect();
   $stmt = $pdo->prepare("SELECT * FROM memos
    WHERE memo_user='".$user['user_id']."'");
   $stmt->execute();
   $result=$stmt->fetchAll();
   return $result;

}
function delAllMemos(){
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("DELETE FROM memos");
  $stmt->execute();
}
function delMemosByUser($user_id){
 $pdo = sqliteConnect();
 $stmt = $pdo->prepare("DELETE FROM memos WHERE memo_user='$user_id'");
 $stmt->execute();
}