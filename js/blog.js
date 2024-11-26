//array holding post objects 
const initialPosts = [
    {
        id: 1,
        title: "Meet The Chef!",
        image: "../images/MouseEatingMacAndCheese.jpg",
        date: "Nov. 12, 2024",
        likes: 0,
        comments: [],
        description: "Chef Mouster Cheese, the founder of Take It Cheesy! Ever since he was a little mouse he knew he loved cheese. And now, we have Take It Cheesy!!"
    },
    {
        id: 2,
        title: "Easy Cheesy Meals",
        image: "../images/SuperCheesyMeal.jpg",
        date: "Nov. 5, 2024",
        likes: 0,
        comments: [],
        description: "The grand opening of Take It Cheesy!"
    }
];

//retrieve posts and liked posts from localStorage or use the initial data
//use JSON to store array in local storage
let posts = JSON.parse(localStorage.getItem("posts")) || initialPosts;
let likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];

//function to save posts and liked posts to localStorage
function savePosts() {
    localStorage.setItem("posts", JSON.stringify(posts));
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
}

//function to generate all blog posts 
function generatePosts() {
    const blogList = document.querySelector(".blogList"); //modify bloglist of html doc
    blogList.innerHTML = ""; //clear existing content

    //iterate through all posts
    posts.forEach(post => {
        const postDiv = document.createElement("div"); //create div for each post 
        postDiv.classList.add("post"); //add class to div

        //write innerhtml for post including the title, date, image, and decription
        postDiv.innerHTML = "<h2>" + post.title + "</h2>" + 
		post.date +
		"<img src='" + post.image + "' alt='" + post.title + "'>" +
		"<p>" + post.description + "</p>";
        
		//likes and comments section
        const likesDiv = document.createElement("div"); //create div for likes
        likesDiv.classList.add("postLikes"); //add class for div likes

        const isLiked = likedPosts.includes(post.id); //checks if current post is already liked by user

        //likes and unlike button
        likesDiv.innerHTML = `
            <p>${post.likes} likes</p>
            <button type="button" onclick="toggleLike(${post.id})" class="buttons">${isLiked ? "Unlike" : "Like"}</button>
            <h4>Comments:</h4>
        `;
        
        //display comments with delete buttons, iterates through posts comments
        post.comments.forEach((comment, index) => {
            const commentDiv = document.createElement("div"); //create div for comment
            commentDiv.classList.add("comment"); //add class to comment

            const commentText = document.createElement("p"); //create paragraph for written comment
            commentText.textContent = comment; //set text content to the comment

            //create button to delete a comment
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("buttons"); //add class to button
            deleteButton.textContent = "Delete"; //give a value to the button
            deleteButton.onclick = () => deleteComment(post.id, index); //delete the comment

            commentDiv.appendChild(commentText); //add elements to DOM (comment div)
            commentDiv.appendChild(deleteButton);

            likesDiv.appendChild(commentDiv); //add elements to DOM (likes div)
        });

        //add comment form
        const commentForm = document.createElement("form");
        commentForm.onsubmit = (event) => handleComment(event, post.id);
        commentForm.innerHTML = "<input type='text' name='comment' class='typeComment' placeholder='Leave a comment...' required>" + 
        "<button type='submit' class='buttons'>Comment</button>";
        likesDiv.appendChild(commentForm);

        //append likes and comments section to post
        postDiv.appendChild(likesDiv);

        //append the complete post to the blog list
        blogList.appendChild(postDiv);
    });
}

//function to toggle like/unlike for a post
function toggleLike(id) {
    const post = posts.find(post => post.id === id); //find post by ID
    if (post) {
    	//check if post is liked
        if (likedPosts.includes(id)) {
            //unlike post
            post.likes--;
            likedPosts = likedPosts.filter(likedId => likedId !== id); //remove from likedPosts
        } 
        else {
            //like the post
            post.likes++;
            likedPosts.push(id); //add to likedPosts
        }
        savePosts(); //save posts and likedPosts to localStorage
        generatePosts(); //re-gerneate posts to update liked count
    }
}

//function to delete a comment
function deleteComment(postId, commentIndex) {
    const post = posts.find(post => post.id === postId); //find the post by ID
    if (post) {
        post.comments.splice(commentIndex, 1); //remove the comment at the specified index
        savePosts(); //save updated data to localStorage
        generatePosts(); //re-gerneate posts to update liked count
    }
}

//function to handle adding a comment
function handleComment(event, id) {
    event.preventDefault(); //prevent form submission refresh
    const comment = event.target.comment.value; //get the input value
    const post = posts.find(post => post.id === id); //find post by ID
    if (post) {
        post.comments.push(comment); //add comment to post
        savePosts();
        event.target.reset(); //reset form to clear typed input
        generatePosts(); //re-gerneate posts to update liked count
    }
}

//initialize and generate posts
generatePosts();