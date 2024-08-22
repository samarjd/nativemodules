<?php
namespace App\Controllers;

require_once __DIR__ . '/../database/Database.php';

use App\Database\Database;

class ProductController
{
    protected $db;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function handle(){
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
            'list' => $this->list(),
            default => array_merge($errorCreation, ["data" => $data]),
        };

        echo json_encode($response);
    }

    private function create($data){
        $sql = "INSERT INTO products (name, price, created_at) VALUES (:name, :price, NOW())";
        $stmt = $this->db->prepare($sql);

        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':price', $data['price']);

        $stmt->execute();

        return $stmt->rowCount() ? ["message" => "Product created"] : ["error" => "Creation error"];
    }

    private function update($id, $data){
        $sql = "UPDATE products SET name = :name, price = :price WHERE id = :id";
        $stmt = $this->db->prepare($sql);

        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':id', $id);

        $stmt->execute();

        return $stmt->rowCount() ? ["message" => "Product updated"] : ["error" => "Update error"];
    }

    private function delete($id){
        $sql = "DELETE FROM products WHERE id = :id";
        $stmt = $this->db->prepare($sql);

        $stmt->bindParam(':id', $id);

        $stmt->execute();

        return $stmt->rowCount() ? ["message" => "Product deleted"] : ["error" => "Delete error"];
    }

    private function read($id){
        $sql = "SELECT * FROM products WHERE id = :id";
        $stmt = $this->db->prepare($sql);

        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $product = $stmt->fetch(\PDO::FETCH_ASSOC);

        return $product ? ["data" => $product] : ["error" => "Product not found"];
    }

    private function list(){
        $sql = "SELECT * FROM products";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
    
        $products = $stmt->fetchAll(\PDO::FETCH_ASSOC);
    
        return ["data" => $products];
    }

}