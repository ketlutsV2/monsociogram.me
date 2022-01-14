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

function addOption($option){
  $pdo = sqliteConnect();
  $stmt = $pdo->prepare("INSERT INTO options (option_name,option_value) VALUES (:option_name,:option_value)");
  $stmt->execute(
    array(':option_name' => $option['option_name'],
        ':option_value' => $option['option_value']
        )
    );
}

function updateOption($key,$value){
	$pdo = sqliteConnect();  
	$stmt = $pdo->prepare("UPDATE options SET option_value='$value' WHERE option_name='$key' LIMIT 1");
  $stmt->execute();
  $n=$stmt->rowCount();
  if($n==0){
   $stmt = $pdo->prepare("INSERT INTO options (option_name,option_value) VALUES (:option_name,:option_value)");
   $stmt->execute(
    array(':option_name' => $key,
        ':option_value' => $value
        )
    );
}
}

function getOption($key){
	$pdo = sqliteConnect();
  $stmt = $pdo->prepare("SELECT option_value FROM options WHERE option_name='$key'  LIMIT 1");
  $stmt->execute();
  return $stmt->fetch();
}