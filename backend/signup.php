<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_DEFAULT);

// check if user exists
$stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
$stmt->execute(['email' => $email]);

if ($stmt->rowCount() > 0) {
    echo json_encode(["status" => "error", "message" => "User already exists"]);
    exit();
}

// insert user
$stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (:email, :password)");
$stmt->execute([
    'email' => $email,
    'password' => $password
]);

echo json_encode(["status" => "success"]);
?>