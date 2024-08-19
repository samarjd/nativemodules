<?php

namespace App\Database;

use PDO;
use PDOException;

class Database
{
    private $conn;

    public function __construct()
    {
        $this->conn = null;

        // Include the config file
        require_once __DIR__ . '/../config.php';

        try {
            $this->conn = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
                DB_USER,
                DB_PASSWORD
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
    }

    public function getConnection()
    {
        return $this->conn;
    }

    public function prepare($sql)
    {
        return $this->conn->prepare($sql);
    }
}
