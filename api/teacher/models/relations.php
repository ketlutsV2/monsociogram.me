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

function delRelationsByStudent($eleve_id,$sociogramme_id){
 global $user;
 $pdo = sqliteConnect();
 $stmt = $pdo->prepare("DELETE FROM socioRelations WHERE socioRelation_from=$eleve_id AND socioRelation_user=".$user['user_id']." AND socioRelation_user_type='user' AND socioRelation_sociogramme=".$sociogramme_id."");
 $stmt->execute();  
 return true;
}

function deleteRelationsByClasse($eleves,$sociogramme_id){
 global $user;
 $pdo = sqliteConnect();

$pdo->beginTransaction();
 $sql = "DELETE FROM socioRelations WHERE socioRelation_from=:eleve_id AND socioRelation_user=".$user['user_id']." AND socioRelation_user_type='user' AND socioRelation_sociogramme=".$sociogramme_id."";

        $stmt =$pdo->prepare($sql);

       
foreach ($eleves as $eleve_id) {
 $stmt->bindValue(':eleve_id', $eleve_id);
  $stmt->execute();
}
  $pdo->commit();

 return true;
}

function addRelation($relation,$sociogramme_id){

  global $_,$user;
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("INSERT INTO socioRelations (socioRelation_user,socioRelation_user_type,socioRelation_sociogramme,socioRelation_question,socioRelation_from,socioRelation_to,socioRelation_date) VALUES (:socioRelation_user,:socioRelation_user_type,:socioRelation_sociogramme,:socioRelation_question,:socioRelation_from,:socioRelation_to,:socioRelation_date)");
  $stmt->execute(
    array(':socioRelation_user' =>  $user['user_id'],
     ':socioRelation_user_type' => 'user',
     ':socioRelation_sociogramme' => $sociogramme_id,
     ':socioRelation_question' => $relation['question_id'],
     ':socioRelation_from' => $relation['from'],
     ':socioRelation_to' => $relation['to'],
     ':socioRelation_date' => $_['time']
   )
  );
  return true;
}

function getAllRelations($select){
 global $_,$user;
 $pdo = sqliteConnect(); 
 $stmt = $pdo->prepare("SELECT $select FROM socioRelations WHERE socioRelation_user=".$user['user_id']." AND socioRelation_user_type='user'"); 
 $stmt->execute();
 return $stmt->fetchAll();
}

function delAllRelations(){
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("DELETE FROM socioRelations");
  $stmt->execute();
}

function delRelationsByUser($user_id){
 $pdo = sqliteConnect();
 $stmt = $pdo->prepare("DELETE FROM socioRelations WHERE socioRelation_user='$user_id' AND socioRelation_user_type='user'");
 $stmt->execute();
}