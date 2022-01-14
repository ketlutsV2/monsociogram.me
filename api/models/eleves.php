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

function deleteEleve($eleves) {
  global $_;
  MainControl::init('school','backup'); 
  $pdo = sqliteConnect();


  $where = array();
  $where_rec= array();
  $where_relation= array();
  for ($i=0; $i < count($eleves); $i++) {     
    $where_eleves[] = "(eleve_id=".$eleves[$i].")"; 

    $where_rec[] = "(rec_eleve=".$eleves[$i].")"; 
    $where_relation[] = "(socioRelation_from=".$eleves[$i]." OR socioRelation_to=".$eleves[$i].")"; 
      }
  
  $stmt = $pdo->prepare("DELETE FROM eleves WHERE ".implode(" OR ", $where_eleves)."");
  $stmt->execute(); 
  $stmt = $pdo->prepare("DELETE FROM relations_eleves_classes WHERE ".implode(" OR ", $where_rec)."");
  $stmt->execute();
  $stmt = $pdo->prepare("DELETE FROM socioRelations WHERE ".implode(" OR ", $where_relation)."");
  $stmt->execute();  

  return true;
}


function getElevesByClasses() {
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("SELECT rec_eleve, rec_classe FROM relations_eleves_classes");
  $stmt->execute();
  return $stmt->fetchAll();
}


function removeElevesByClasseId($classe_id) {
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("SELECT rec_eleve FROM relations_eleves_classes WHERE rec_classe=$classe_id");
  $stmt->execute();
  $eleves=$stmt->fetchAll(PDO::FETCH_COLUMN, 0);

 $stmt = $pdo->prepare("DELETE FROM eleves WHERE eleve_id IN (SELECT rec_eleve FROM relations_eleves_classes WHERE rec_classe=$classe_id)");
  $stmt->execute(); 



}


function getAllEleves($select="*") {
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("SELECT $select FROM eleves");
  $stmt->execute();
  return $stmt->fetchAll();
}

function getEleveById($eleve_id) {
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("SELECT * FROM eleves 
    WHERE eleve_id=$eleve_id  LIMIT 1");
  $stmt->execute();
  $result = $stmt->fetch();
  return $result;
}

function addEleve($eleve, $eleve_classe) {
  $pdo = sqliteConnect();  
  if($eleve['eleve_id']==""){
    $stmt = $pdo->prepare("INSERT INTO eleves (eleve_nom,eleve_token,eleve_prenom,eleve_classe,eleve_genre,eleve_birthday) 
      VALUES (:eleve_nom, :eleve_token, :eleve_prenom,:eleve_classe,:eleve_genre,:eleve_birthday)");
    $stmt->execute(
      array(':eleve_nom' => $eleve['eleve_nom'],
        ':eleve_token'=> genereRandomStringNb(6),
        ':eleve_prenom'=> $eleve['eleve_prenom'],
        ':eleve_classe'=>"1",
        ':eleve_genre'=> $eleve['eleve_genre'],
        ':eleve_birthday'=> $eleve['eleve_birthday'],
      )
    );
    $eleve['eleve_id']=$pdo->lastInsertId('eleve_id');  
  }
  $stmt = $pdo->prepare("INSERT INTO relations_eleves_classes (rec_eleve,rec_classe) 
    VALUES (".$eleve['eleve_id'].",".$eleve_classe.")");
    $stmt->execute();
    $updEleve['eleve_id']=$eleve['eleve_id'];   
    $updEleve['eleve_classe']=1;
    updateEleve($updEleve);
    return;
  }

  function existEleve($eleve){ 
    $pdo = sqliteConnect();
    $stmt = $pdo->prepare("SELECT eleve_id FROM eleves 
      WHERE eleve_nom='".$eleve['eleve_nom']."' 
      AND eleve_prenom='".$eleve['eleve_prenom']."'
      LIMIT 1");
    $stmt->execute();
    $result = $stmt->fetchAll();
    if (count($result) != 0) {
      return true;
    } else {
      return false;
    }
  }
  function updateEleve($eleve) {
    $pdo = sqliteConnect();
    $updates = array();
    foreach ($eleve as $key => $value) {
      if ($key != 'eleve_id') {
        $updates[] = "" . $key . "=" . $pdo->quote($value) . "";
      }
    }
    $updateStr = implode(",", $updates);
    $sql="UPDATE eleves 
    SET " . $updateStr . "         
    WHERE eleve_id='" . $eleve['eleve_id'] . "'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
  }

  function delAllEleves(){
    $pdo = sqliteConnect();
    $stmt = $pdo->prepare("DELETE FROM eleves");
    $stmt->execute();
  }