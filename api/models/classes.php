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

function getClasses() {   
    $pdo = sqliteConnect();
    $stmt = $pdo->prepare("SELECT * FROM classes ORDER BY classe_nom ASC");
    $stmt->execute();

    return $stmt->fetchAll();
}
function delClasse($classe_id) {
    $pdo = sqliteConnect();
       $stmt = $pdo->prepare("DELETE FROM groupes WHERE groupe_classe='".$classe_id."'");
    $stmt->execute();

    $stmt = $pdo->prepare("DELETE FROM sociogrammesSaves WHERE sociogrammeSave_classe='".$classe_id."'");
    $stmt->execute();
    $stmt = $pdo->prepare("DELETE FROM memos WHERE memo_type_id='".$classe_id."' AND memo_type='classroom'");
    $stmt->execute();   


removeElevesByClasseId($classe_id);

 $stmt = $pdo->prepare("DELETE FROM classes WHERE classe_id=".$classe_id." LIMIT 1");
    $stmt->execute();
    $stmt = $pdo->prepare("DELETE FROM relations_eleves_classes WHERE rec_classe=".$classe_id."");
    $stmt->execute();  

    return true;
}
function getOneClasse($classe_id) {
    $pdo = sqliteConnect();
    $stmt = $pdo->prepare("SELECT * FROM classes WHERE classe_id=$classe_id LIMIT 1");
    $stmt->execute();
    $result = $stmt->fetch();
    return $result;
}

function existClasse($classe_nom) {
    $pdo = sqliteConnect();
    $stmt = $pdo->prepare("SELECT classe_id FROM classes WHERE classe_nom='$classe_nom' LIMIT 1");
    $stmt->execute();
    $result = $stmt->fetchAll();
    if (count($result) != 0) {
        return $result[0]['classe_id'];
    } else {
        return false;
    }
}
function addClasse($classe_nom) {
    $pdo = sqliteConnect();
    $stmt = $pdo->prepare("INSERT INTO classes (classe_nom) VALUES (:classe_nom)");
    $stmt->execute(
        array(':classe_nom' => "$classe_nom"
        )
    );
    return $pdo->lastInsertId('classe_id');
}
function updateClasse($classe) {
    $pdo = sqliteConnect();
    $updates = array();
    foreach ($classe as $key => $value) {
        if ($key != 'classe_id') {
            $updates[] = "" . $key . "='" . $value . "'";
        }
    }
    $updateStr = implode(",", $updates);
    $sql="UPDATE classes 
    SET " . $updateStr . "         
    WHERE classe_id='" . $classe['classe_id'] . "' LIMIT 1";     
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
}