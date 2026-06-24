<?php
try {
    $pdo = new PDO('mysql:host=mysql;port=3306;dbname=mydb', 'root', 'root', [
        PDO::ATTR_TIMEOUT => 5,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    echo "Success: Connection established\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
