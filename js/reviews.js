/* 
    The JavaScript file for managing the reviews functionality.
    Handles both the review submission page (customers.html) and the reviews display page (reviews.html).
    
    Major Functions:
    - Star rating system: Uses event listeners to allow users to select a rating visually with stars (★ and ☆).
    - Form validation and error checking: Ensures that mandatory fields (review and date) are filled, displaying "Required!" messages for errors.
    - LocalStorage: Saves submitted reviews and dynamically loads them on the reviews page.
    - DOM concept: Dynamically updates the reviews display and star ratings.

    Techniques used:
    - JavaScript logic from course lectures on event listeners, DOM objects, and dynamic updates(chapters 8 and 9).
    - All stars (★ and ☆) were copied from symbl.cc for an easier and more aesthetic implementation.
*/


// The DOM Elements
const reviewForm = document.getElementById("review-form");
const reviewsContainer = document.getElementById("reviews-container");
const starRating = document.getElementById("star-rating");
const ratingInput = document.getElementById("rating");

// Checks if the user is currently on the reviews.html page
if (reviewsContainer) {
    // Load reviews from localStorage and display them
    document.addEventListener("DOMContentLoaded", () => {
        const storedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
        storedReviews.forEach(addReviewToDOM);
    });

    // Created a function to add a review to the DOM
    function addReviewToDOM({ name, review, rating, date }) {
        const reviewDiv = document.createElement("div");
        reviewDiv.className = "review-item";
        reviewDiv.innerHTML = `
            <strong>${name}:</strong>
            <div class="stars">${renderStars(rating)}</div>
            <p>${review}</p>
            <small>${date}</small>
        `;
        reviewsContainer.appendChild(reviewDiv);
    }

    // Created this function to render the stars
    function renderStars(rating) {
        let starsHTML = "";
        for (let i = 1; i <= 5; i++) {
            starsHTML += i <= rating ? "★" : "☆";
        }
        return starsHTML;
    }
}

// Checks if the user is currently on the write-review.html page
if (reviewForm) {
    
    starRating.addEventListener("click", (e) => {
        if (e.target.classList.contains("star")) {
            const stars = document.querySelectorAll(".star");
            const rating = e.target.getAttribute("data-value");

            // Updates the hidden input value
            ratingInput.value = rating;

            // This fills the stars up to the clicked star when pressed
            stars.forEach((star, index) => {
                star.textContent = index < rating ? "★" : "☆";
            });
        }
    });

    // Submit Review Form
    reviewForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Collect form data
        let name = document.getElementById("name").value.trim();
        const review = document.getElementById("review").value;
        const rating = ratingInput.value || 0;
        const date = document.getElementById("date").value;

        // Error message elements
    const reviewError = document.getElementById("review-error");
    const dateError = document.getElementById("date-error");

    // Resets error messages
    reviewError.style.display = "none";
    dateError.style.display = "none";

   
    let hasError = false;

    // Validates a user  review
    if (!review) {
        reviewError.textContent = "Required!";
        reviewError.style.display = "block";
        hasError = true;
    }

    // Date validation
    if (!date) {
        dateError.textContent = "Required!";
        dateError.style.display = "block";
        hasError = true;
    }

    // Making sure to stop submission if there are errors
    if (hasError) return;

        // If the name is empty, default to "Anonymous". This way the user doesnt have to ad their name if they don't want to
        if (!name) {
            name = "Anonymous";
        }

        // Creates review object
        const newReview = {
            name,
            review,
            rating,
            date: new Date(date).toLocaleDateString("en-US"),
        };

        // Saves the review to localStorage first
        const existingReviews = JSON.parse(localStorage.getItem("reviews")) || [];
        existingReviews.push(newReview);
        localStorage.setItem("reviews", JSON.stringify(existingReviews));

        // Then redirects the review to reviews page so that it appears under the hard coded reviews
        window.location.href = "reviews.html";
    });
}
