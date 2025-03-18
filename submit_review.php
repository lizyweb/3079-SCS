<?php
$servername = "localhost";
$username = "carefs8w_scs";
$password = "Scs@2024";
$dbname = "carefs8w_scs";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST["name"]);
    $rating = intval($_POST["rating"]);
    $comment = trim($_POST["comment"]);

    if (!empty($name) && !empty($comment) && $rating > 0) {
        $stmt = $conn->prepare("INSERT INTO reviews (name, rating, comment) VALUES (?, ?, ?)");
        $stmt->bind_param("sis", $name, $rating, $comment);

        if ($stmt->execute()) {
            echo "success";
        } else {
            echo "error";
        }

        $stmt->close();
    } else {
        echo "error";
    }
}

$conn->close();
?>
