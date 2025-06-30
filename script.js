// In-memory storage for user data (replaces localStorage)
let userData = {};
let currentUser = null;

// Blog posts data
const blogPosts = [
  {
    id: 1,
    title: "Building Meaningful Connections in the Digital Age",
    content: `
                    <p>In today's hyperconnected world, building genuine relationships has become both easier and more challenging than ever before. Social media platforms allow us to connect with people across the globe, yet many of us feel more isolated than previous generations.</p>
                    
                    <h3>The Paradox of Digital Connection</h3>
                    <p>We have hundreds of "friends" online, but how many of them do we truly know? The challenge lies in transforming digital interactions into meaningful connections that enrich our lives.</p>
                    
                    <h3>Quality Over Quantity</h3>
                    <p>Rather than focusing on the number of connections, we should prioritize the depth of our relationships. A few genuine friendships are worth more than hundreds of superficial online connections.</p>
                    
                    <h3>Tips for Building Real Connections</h3>
                    <p>Start by being authentic in your interactions. Share your true thoughts and feelings, listen actively to others, and make an effort to meet people in person when possible. Remember, behind every screen is a real person with their own hopes, fears, and dreams.</p>
                    
                    <p>Building meaningful connections takes time and effort, but the rewards are immeasurable. In a world that often feels disconnected, be the person who brings people together.</p>
                `,
    date: "2025-05-20",
    category: "Social",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=300&fit=crop",
    excerpt:
      "Exploring how to build genuine relationships in our digital world and create meaningful connections that last.",
  },
  {
    id: 2,
    title: "The Art of Storytelling: Why Everyone Has a Story Worth Sharing",
    content: `
                    <p>Every person you meet has lived through experiences that no one else has. Every individual carries stories that could inspire, educate, or comfort others. Yet, many people believe their stories aren't worth telling.</p>
                    
                    <h3>Your Story Matters</h3>
                    <p>Whether it's overcoming a challenge, learning a valuable lesson, or simply observing something interesting about life, your perspective is unique. What seems ordinary to you might be extraordinary to someone else.</p>
                    
                    <h3>The Power of Vulnerability</h3>
                    <p>The most impactful stories often come from our most vulnerable moments. Sharing our struggles, failures, and moments of growth creates connections and helps others feel less alone in their own journeys.</p>
                    
                    <h3>How to Start Sharing</h3>
                    <p>Begin with small stories. Share an interesting observation, a lesson learned, or a moment that made you smile. Don't worry about being perfect – authenticity is more valuable than polish.</p>
                    
                    <p>Remember, storytelling isn't just about entertainment. It's about human connection, empathy, and understanding. Your story might be exactly what someone else needs to hear today.</p>
                `,
    date: "2025-05-15",
    category: "Writing",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=300&fit=crop",
    excerpt:
      "Discovering the power of personal narratives and why every person's experiences are worth sharing with the world.",
  },
  {
    id: 3,
    title: "Mindful Living: Finding Balance in a Busy World",
    content: `
                    <p>In our fast-paced society, it's easy to get caught up in the constant rush of daily life. We're always moving, always connected, always "on." But what if we took a step back and embraced a more mindful approach to living?</p>
                    
                    <h3>What is Mindful Living?</h3>
                    <p>Mindful living isn't about meditation retreats or complex spiritual practices. It's simply about being present in your own life, paying attention to the moments that make up your days, and making conscious choices about how you spend your time and energy.</p>
                    
                    <h3>Small Steps, Big Changes</h3>
                    <p>Start small. Take five minutes each morning to sit quietly with your coffee. Put your phone away during meals. Take a walk without listening to anything – just notice the world around you.</p>
                    
                    <h3>The Benefits of Slowing Down</h3>
                    <p>When we slow down and become more mindful, we often discover that we have more time than we thought. We become more creative, more patient, and more appreciative of the simple pleasures in life.</p>
                    
                    <p>Mindful living isn't about perfection – it's about intention. It's about choosing to be present in your own life, one moment at a time.</p>
                `,
    date: "2025-05-10",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop",
    excerpt:
      "Exploring how to slow down and find peace in our hectic modern lives through mindful practices and intentional living.",
  },
];

// Comments storage
let comments = {};
let currentPostId = null;

// Initialize the blog
function init() {
  renderPosts();
  setupEventListeners();
  updateAuthUI();
}

// Authentication functions
function signup(name, email, password) {
  if (userData[email]) {
    return {
      success: false,
      message: "An account with this email already exists.",
    };
  }

  userData[email] = {
    name: name,
    email: email,
    password: password,
    createdAt: new Date().toISOString(),
  };

  return { success: true, message: "Account created successfully!" };
}

function login(email, password) {
  const user = userData[email];
  if (!user) {
    return {
      success: false,
      message: "No account found with this email address.",
    };
  }

  if (user.password !== password) {
    return { success: false, message: "Incorrect password." };
  }

  currentUser = user;
  return { success: true, message: "Logged in successfully!" };
}

function logout() {
  currentUser = null;
  updateAuthUI();
  showSection("home");
}

function updateAuthUI() {
  const authButtons = document.getElementById("auth-buttons");

  if (currentUser) {
    authButtons.innerHTML = `
                    <span class="user-info">Welcome, ${currentUser.name}</span>
                    <button class="auth-btn logout-btn" onclick="logout()">Logout</button>
                `;
  } else {
    authButtons.innerHTML = `
                    <button class="auth-btn login-btn" onclick="showSection('login')">Login</button>
                    <button class="auth-btn signup-btn" onclick="showSection('signup')">Sign Up</button>
                `;
  }
}

function showMessage(elementId, message, isError = false) {
  const messageElement = document.getElementById(elementId);
  messageElement.innerHTML = `
                <div class="${isError ? "error-message" : "success-message"}">
                    ${message}
                </div>
            `;

  // Clear message after 5 seconds
  setTimeout(() => {
    messageElement.innerHTML = "";
  }, 5000);
}

// Render blog posts
function renderPosts() {
  const postsGrid = document.getElementById("posts-grid");
  postsGrid.innerHTML = "";

  blogPosts.forEach((post) => {
    const postCard = document.createElement("div");
    postCard.className = "post-card";
    postCard.innerHTML = `
                    <img src="${post.image}" alt="${
      post.title
    }" class="post-image">
                    <div class="post-content">
                        <div class="post-category">${post.category}</div>
                        <h3 class="post-title">${post.title}</h3>
                        <div class="post-date">${formatDate(post.date)}</div>
                        <p class="post-excerpt">${post.excerpt}</p>
                    </div>
                `;
    postCard.addEventListener("click", () => showPost(post.id));
    postsGrid.appendChild(postCard);
  });
}

// Show single post
function showPost(postId) {
  currentPostId = postId;
  const post = blogPosts.find((p) => p.id === postId);

  const singlePostContent = document.getElementById("single-post-content");
  singlePostContent.innerHTML = `
                <div class="single-post">
                    <div class="post-header">
                        <div class="post-category">${post.category}</div>
                        <h1>${post.title}</h1>
                        <div class="post-date">${formatDate(post.date)}</div>
                        <img src="${post.image}" alt="${post.title}">
                    </div>
                    <div class="post-body">
                        ${post.content}
                    </div>
                </div>
            `;

  showSection("single-post");
  renderCommentArea();
  renderComments(postId);
}

// Render comment area based on auth status
function renderCommentArea() {
  const commentArea = document.getElementById("comment-area");

  if (currentUser) {
    commentArea.innerHTML = `
                    <form class="comment-form" id="comment-form">
                        <textarea id="comment-text" placeholder="Write your comment..." required></textarea>
                        <button type="submit" class="submit-btn">Post Comment</button>
                    </form>
                `;
  } else {
    commentArea.innerHTML = `
                    <div class="auth-required">
                        <h3>Join the Conversation</h3>
                        <p>Please log in to post a comment and share your thoughts.</p>
                        <button class="auth-btn login-btn" onclick="showSection('login')">Login</button>
                        <button class="auth-btn signup-btn" onclick="showSection('signup')">Sign Up</button>
                    </div>
                `;
  }
}

// Show section
function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });

  // Show target section
  document.getElementById(sectionName).classList.add("active");

  // Update navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });

  if (
    sectionName !== "single-post" &&
    sectionName !== "login" &&
    sectionName !== "signup"
  ) {
    const activeLink = document.querySelector(
      `[data-section="${sectionName}"]`
    );
    if (activeLink) activeLink.classList.add("active");
  }

  // Close mobile menu
  closeMobileMenu();
}

// Render comments
function renderComments(postId) {
  const commentsList = document.getElementById("comments-list");
  const postComments = comments[postId] || [];

  commentsList.innerHTML = "";

  if (postComments.length === 0) {
    commentsList.innerHTML =
      '<p style="color: #666; text-align: center; padding: 2rem;">No comments yet. Be the first to comment!</p>';
    return;
  }

  postComments.forEach((comment) => {
    const commentElement = document.createElement("div");
    commentElement.className = "comment";
    commentElement.innerHTML = `
                    <div class="comment-header">${comment.name}</div>
                    <div class="comment-text">${comment.text}</div>
                `;
    commentsList.appendChild(commentElement);
  });
}

// Setup event listeners
function setupEventListeners() {
  // Hamburger menu
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Navigation links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const section = link.getAttribute("data-section");
      showSection(section);
    });
  });

  // Signup form
  document.getElementById("signup-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById(
      "signup-confirm-password"
    ).value;

    if (password !== confirmPassword) {
      showMessage("signup-message", "Passwords do not match.", true);
      return;
    }

    const result = signup(name, email, password);
    showMessage("signup-message", result.message, !result.success);

    if (result.success) {
      document.getElementById("signup-form").reset();
      setTimeout(() => showSection("login"), 2000);
    }
  });

  // Login form
  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    const result = login(email, password);
    showMessage("login-message", result.message, !result.success);

    if (result.success) {
      document.getElementById("login-form").reset();
      updateAuthUI();
      setTimeout(() => showSection("home"), 2000);
    }
  });

  // Comment form (delegated event listener)
  document.addEventListener("submit", (e) => {
    if (e.target && e.target.id === "comment-form") {
      e.preventDefault();

      const text = document.getElementById("comment-text").value.trim();

      if (text && currentPostId && currentUser) {
        if (!comments[currentPostId]) {
          comments[currentPostId] = [];
        }

        comments[currentPostId].push({
          name: currentUser.name,
          text: text,
        });

        document.getElementById("comment-form").reset();
        renderComments(currentPostId);
      }
    }
  });

  // Contact form
  document.getElementById("contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    document.getElementById("contact-form").reset();
  });
}

// Close mobile menu
function closeMobileMenu() {
  document.getElementById("hamburger").classList.remove("active");
  document.getElementById("nav-menu").classList.remove("active");
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", init);
