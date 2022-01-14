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


function addToken($uuid){
	global $user;
	$pdo = sqliteConnect();
	$stmt = $pdo->prepare("INSERT INTO tokens (token_uuid,token_user,token_expire) 
		VALUES (:token_uuid,:token_user,:token_expire)");
	$stmt->execute(
		array(':token_uuid' => $uuid,
			'token_user'=>$user['user_id'],
			'token_expire'=>time()+43200
		)
	);
	return true;
}

function deleteTokenByUUID($uuid){
	$pdo = sqliteConnect();
	$stmt = $pdo->prepare("DELETE FROM tokens WHERE token_uuid=:token_uuid LIMIT 1");
	$stmt->execute(
		array(':token_uuid' => $uuid)
	);
	return true;
}

function deleteExpiredTokens(){
	$pdo = sqliteConnect();
	$time=time();
	$stmt = $pdo->prepare("DELETE FROM tokens WHERE token_expire<$time");
	$stmt->execute();
	return true;
}