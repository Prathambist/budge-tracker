<?php
try {
    $conn = new PDO("pgsql:host=localhost;port=5432;dbname=budget_app", "postgres", "password");
    echo "CONNECTED SUCCESSFULLY";
} catch (PDOException $e) {
    echo "ERROR: " . $e->getMessage();
}
?>