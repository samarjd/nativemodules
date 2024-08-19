<?php

namespace App\Controllers;

require_once __DIR__ . '/../database/Database.php';

use App\Database\Database;

class UserController
{
    protected $db;

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

        switch ($action) {
            case 'create':
                if ($method === 'POST') {
                    $response = $this->create($data);
                } else {
                    $response = ['status' => 'error', 'message' => 'Invalid request method'];
                }
                break;

            case 'read':
                if ($method === 'POST' && $id) {
                    $response = $this->read($id);
                } else {
                    $response = ['status' => 'error', 'message' => 'Invalid request method or missing ID'];
                }
                break;

            case 'update':
                if ($method === 'POST' && $id) {
                    $response = $this->update($id, $data);
                } else {
                    $response = ['status' => 'error', 'message' => 'Invalid request method or missing ID'];
                }
                break;

            case 'delete':
                if ($method === 'POST' && $id) {
                    $response = $this->delete($id);
                } else {
                    $response = ['status' => 'error', 'message' => 'Invalid request method or missing ID'];
                }
                break;

            case 'list':
                $response = $this->listUsers();
                break;

            default:
                $response = ['status' => 'error', 'message' => 'Invalid action', 'data' => $data];
                break;
        }
        echo json_encode($response);
    }

    // CRUD methods here...

    public function create($data)
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

    public function read($id)
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

    public function update($id, $data)
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

    public function delete($id)
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

    public function listUsers()
    {
        // Fetch all users
        $sql = "SELECT * FROM users";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        $users = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        return ['status' => 'success', 'data' => $users];
    }
}
