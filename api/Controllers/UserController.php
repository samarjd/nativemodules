<?php

namespace App\Controllers;

require_once __DIR__ . '/../database/Database.php';
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config.php';

use App\Database\Database;
use Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class UserController
{

    protected $db;
    private $jwtSecret = JWT_SECRET;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function handle()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $data = $_POST;

        $action = $data['action'] ?? '';
        $id = $data['id'] ?? '';

        // Define the error responses
        $errorCreation = ["error" => "Creation error"];
        $errorAction = ["error" => "Action error"];
        $errorMethod = ["error" => "Invalid method"];

        // Check the method
        $response = ($method !== 'POST') ? $errorMethod : match ($action) {
            'create' => $this->create($data),
            'read' => $id ? $this->read($id) : $errorAction,
            'update' => $id ? $this->update($id, $data) : $errorAction,
            'delete' => $id ? $this->delete($id) : $errorAction,
            'list' => $this->listUsers(),
            default => array_merge($errorCreation, ["data" => $data]),
        };

        echo json_encode($response);
    }

    public function create(array $data): array
    {
        $sql = "INSERT INTO users (name, email, password, address, country, city, zip, created_at) VALUES (:name, :email, :password, :address, :country, :city, :zip, NOW())";
        $stmt = $this->db->prepare($sql);

        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':email', $data['email']);
        $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);
        $stmt->bindParam(':password', $passwordHash);
        $stmt->bindParam(':address', $data['address']);
        $stmt->bindParam(':country', $data['country']);
        $stmt->bindParam(':city', $data['city']);
        $stmt->bindParam(':zip', $data['zip']);

        if ($stmt->execute()) {
            return ['status' => 'success', 'message' => 'User created successfully'];
        } else {
            return ['status' => 'error', 'message' => 'Failed to create user'];
        }
    }

    public function read(int $id): array
    {
        $sql = "SELECT * FROM users WHERE id = :id";
        $stmt = $this->db->prepare($sql);

        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $user = $stmt->fetch(\PDO::FETCH_ASSOC);
        if ($user) {
            return ['status' => 'success', 'data' => $user];
        } else {
            return ['status' => 'error', 'message' => 'User not found'];
        }
    }

    public function update(int $id, array $data): array
    {
        $sql = "UPDATE users SET name = :name, email = :email, password = :password, updated_at = :updated_at, address = :address, country = :country, city = :city, zip = :zip WHERE id = :id";
        $stmt = $this->db->prepare($sql);

        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':email', $data['email']);
        $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);
        $stmt->bindParam(':password', $passwordHash);
        $updated_at = date('Y-m-d H:i:s');
        $stmt->bindParam(':updated_at', $updated_at);
        $stmt->bindParam(':address', $data['address']);
        $stmt->bindParam(':country', $data['country']);
        $stmt->bindParam(':city', $data['city']);
        $stmt->bindParam(':zip', $data['zip']);

        if ($stmt->execute()) {
            return ['status' => 'success', 'message' => 'User updated successfully'];
        } else {
            return ['status' => 'error', 'message' => 'Failed to update user'];
        }
    }

    public function delete(int $id): array
    {
        $sql = "DELETE FROM users WHERE id = :id";
        $stmt = $this->db->prepare($sql);

        $stmt->bindParam(':id', $id);

        if ($stmt->execute()) {
            return ['status' => 'success', 'message' => 'User deleted successfully'];
        } else {
            return ['status' => 'error', 'message' => 'Failed to delete user'];
        }
    }

    public function listUsers(): array
    {
        // Fetch all users
        $sql = "SELECT * FROM users";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        $users = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        return ['status' => 'success', 'data' => $users];
    }

    public function login(string $username, string $password): array
    {
        $sql = 'SELECT * FROM users WHERE email = :email';
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':email', $username);
        $stmt->execute();

        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            // Generate JWT token
            $payload = [
                'iat' => time(),
                'exp' => time() + 3600,
                'data' => [
                    'userId' => $user['id'],
                    'username' => $user['email']
                ]
            ];

            $jwt = JWT::encode($payload, $this->jwtSecret, 'RS256');

            return ['status' => 'success', 'message' => 'User logged in successfully', 'token' => $jwt];
        } else {
            return ['status' => 'error', 'message' => 'Invalid credentials'];
        }
    }

    public function logout(array $data): array
    {
        try {
            $decoded = JWT::decode($data['token'], new Key($this->jwtSecret, 'RS256'));
            $decoded->exp = date('Y-m-d H:i:s', strtotime('-1 second'));

            return ['status' => 'success', 'message' => 'User logged out successfully'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => 'Failed to decode token'];
        }
    }
}
