<?php
$senha = "cemtec1234";
$hash = password_hash($senha, PASSWORD_BCRYPT);
echo $hash;