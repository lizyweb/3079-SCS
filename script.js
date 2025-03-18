document.addEventListener("DOMContentLoaded", function() {
    loadReviews();
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', setRating);
        star.addEventListener('mouseover', hoverRating);
        star.addEventListener('mouseout', clearHover);
    });
});

function setRating(event) {
    const value = event.target.getAttribute('data-value');
    document.getElementById('rating').value = value;
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.classList.remove('selected');
        if (star.getAttribute('data-value') <= value) {
            star.classList.add('selected');
        }
    });
}

function hoverRating(event) {
    const value = event.target.getAttribute('data-value');
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.classList.remove('hover');
        if (star.getAttribute('data-value') <= value) {
            star.classList.add('hover');
        }
    });
}

function clearHover() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.classList.remove('hover');
    });
}


function submitReview() {
    const name = document.getElementById("name").value;
    const rating = document.getElementById("rating").value;
    const comment = document.getElementById("comment").value;

    if (name && rating && comment) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("rating", rating);
        formData.append("comment", comment);

        fetch("submit_review.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            if (data === "success") {
                loadReviews(1);  // Reload the first page of reviews
                document.getElementById("review-form").reset();
                document.querySelectorAll('.star').forEach(star => star.classList.remove('selected'));
            } else {
                alert("Failed to submit review.");
            }
        })
        .catch(error => console.error("Error:", error));
    } else {
        alert("Please fill in all fields.");
    }
}

function loadReviews(page) {
    fetch(`load_reviews.php?page=${page}`)
        .then(response => response.json())
        .then(data => {
            const reviewsContainer = document.getElementById("reviews");
            reviewsContainer.innerHTML = "";
            data.reviews.forEach(review => {
                const reviewElement = document.createElement("div");
                reviewElement.classList.add("review");
                reviewElement.innerHTML = `
                    <div class="name"><strong>${review.name}</strong></div>
                    <div class="stars">${"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}</div>
                    <p>${review.comment}</p>
                `;
                reviewsContainer.appendChild(reviewElement);
            });
            renderPagination(data.total, data.page, data.limit);
        })
        .catch(error => console.error("Error:", error));
}

function renderPagination(total, currentPage, limit) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(total / limit);

    for (let page = 1; page <= totalPages; page++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = page;
        pageButton.disabled = page === currentPage;
        pageButton.addEventListener('click', () => loadReviews(page));
        paginationContainer.appendChild(pageButton);
    }
}
