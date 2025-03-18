<?php
$servername = "localhost";
$username = "carefs8w_scs";
$password = "Scs@2024";
$dbname = "carefs8w_scs";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$limit = 10;
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$start = ($page - 1) * $limit;

$sql = "SELECT name, rating, comment FROM reviews ORDER BY id DESC LIMIT ?, ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $start, $limit);
$stmt->execute();
$result = $stmt->get_result();

$reviews = [];
while ($row = $result->fetch_assoc()) {
    $reviews[] = $row;
}

$sqlTotal = "SELECT COUNT(*) FROM reviews";
$resultTotal = $conn->query($sqlTotal);
$rowTotal = $resultTotal->fetch_row();
$total = $rowTotal[0];

$stmt->close();
$conn->close();

echo json_encode([
    "reviews" => $reviews,
    "total" => $total,
    "page" => $page,
    "limit" => $limit
]);
?>
