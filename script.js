  const API_KEY = "AIzaSyDDXnzDbRakS099ALwLFsBPbwQZ31i3hIU";
const CHANNEL_ID = "UC95FtUti_sXjcj913thinRQ";
const MAX_RESULTS = 3;

function showErrorFallback() {
  const gallery = document.getElementById("video-gallery");
  gallery.innerHTML = `
    <style>
      .social-icons a {
        display: inline-block;
        margin: 0 15px;
        transition: transform 0.3s ease, filter 0.3s ease;
      }
      .social-icons a:hover {
        transform: scale(1.2);
        filter: drop-shadow(0 0 8px #ff69b4);
      }
    </style>
    <div style="text-align: center; padding: 40px; background-color: #fff0f5; border-radius: 12px;">
      <h2 style="color: #e91e63;">💔 Oops! Something went wrong</h2>
      <p style="font-size: 16px; color: #555;">
        Mafi chaie… Video gallery abhi load nahi ho pa rahi hai.<br>
        Par tum hamari duniya kahin aur dekh sakte ho… 🥺❤️
      </p>
      <div class="social-icons" style="margin-top: 20px;">
        <a href="https://www.instagram.com/beats_of_honey_12" target="_blank">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" style="height: 40px;">
        </a>
        <a href="https://youtube.com/@beatsofhoney?si=vg2v4SFvIvdxpfwq" target="_blank">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube" style="height: 40px;">
        </a>
      </div>
      <p style="margin-top: 10px; font-size: 14px; color: #999;">Dil se dekhne ke liye profile pe aa jao... 💕</p>
    </div>
  `;
}


// 🎬 Load YouTube Videos with Like Button
async function loadYouTubeVideos() {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${MAX_RESULTS}&order=date&type=video&key=${API_KEY}`);
    const data = await res.json();
    const videoGallery = document.getElementById("video-gallery");
    videoGallery.innerHTML = "";

    data.items.forEach(item => {
      const videoId = item.id.videoId;
      const videoDiv = document.createElement("div");
      videoDiv.classList.add("video-card");
      videoDiv.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
        <div class="video-actions">
          <a href="https://youtube.com/watch?v=${videoId}" onclick="incrementVideoViews()" target="_blank" class="action-btn">▶️ Watch Now</a>
          <a href="https://www.instagram.com/beats_of_honey_12" target="_blank" class="action-btn" onclick="incrementInstaViews()">📸 Watch on Instagram</a>
          <a href="https://ssyoutube.com/watch?v=${videoId}" onclick="incrementDownloads()" target="_blank" class="action-btn">📥 Download</a>
          <button onclick="incrementLikes()" class="like-btn">❤️ Like</button>
        </div>
      `;
      videoGallery.appendChild(videoDiv);
    });
  } catch (error) {
    console.error("Video load error:", error);
    showErrorFallback();  // ✅ Show romantic error
  }
}

loadYouTubeVideos();

  let nextPageToken = "";
  let currentFilter = "video"; // video | playlist | shorts

  async function fetchVideos(reset = false) {
    if (reset) {
      nextPageToken = "";
      document.getElementById("all-videos-list").innerHTML = "";
    }

    let url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&maxResults=6&type=${currentFilter === "shorts" ? "video" : currentFilter}`;
    if (nextPageToken) url += `&pageToken=${nextPageToken}`;
    if (currentFilter === "shorts") url += "&videoDuration=short";

    const res = await fetch(url);
    const data = await res.json();
    nextPageToken = data.nextPageToken || "";

    data.items.forEach(item => {
      const videoId = item.id.videoId || item.id.playlistId;
      const isPlaylist = currentFilter === "playlist";
      const videoURL = isPlaylist
        ? `https://www.youtube.com/playlist?list=${videoId}`
        : `https://www.youtube.com/watch?v=${videoId}`;
      const embedURL = isPlaylist
        ? ""
        : `https://www.youtube.com/embed/${videoId}`;

      const card = document.createElement("div");
      card.className = "video-card";
      card.innerHTML = `
        ${embedURL ? `<iframe src="${embedURL}" allowfullscreen></iframe>` : ""}
        <h4>${item.snippet.title}</h4>
        <div class="video-actions">
          <a href="${videoURL}" target="_blank" onclick="incrementVideoViews()" class="action-btn">▶️ Watch Now</a>
          <a href="https://www.instagram.com/beats_of_honey_12" target="_blank" class="action-btn" onclick="incrementInstaViews()">📸 Watch on Instagram</a>
          <a href="https://ssyoutube.com/watch?v=${videoId}" target="_blank" onclick="incrementDownloads()" class="action-btn">📥 Download</a>
          <button onclick="incrementLikes()" class="like-btn">❤️ Like</button>
        </div>
      `;
      document.getElementById("all-videos-list").appendChild(card);
    });

    document.getElementById("load-more-btn").style.display = nextPageToken ? "block" : "none";
  }

  function openAllVideosModal() {
    document.getElementById("allVideosModal").style.display = "block";
    fetchVideos(true);
  }

  function closeAllVideosModal() {
    document.getElementById("allVideosModal").style.display = "none";
  }

  function setFilter(type) {
    currentFilter = type;
    fetchVideos(true);
  }

   

  document.getElementById("loveForm").addEventListener("submit", function (e) {
    e.preventDefault(); // stop default form behavior

    const form = e.target;
    const data = new FormData(form);

    fetch("https://formspree.io/f/xkgblnoq", {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
      },
    })
      .then(response => {
        if (response.ok) {
          form.reset();
          const popup = document.getElementById("successPopup");
          popup.classList.add("popup-show");

          // Hide popup after 5 seconds
          setTimeout(() => {
            popup.classList.remove("popup-show");
          }, 5000);
        } else {
          alert("Oops! Something went wrong 😢");
        }
      })
      .catch(error => {
        alert("Network error! Please try again later.");
      });
  });
  function updateStatsDisplay(snapshot) {
  const stats = snapshot.val();
  document.getElementById("visitCount").textContent = stats.visits || 0;
  document.getElementById("videoViewsCount").textContent = stats.videoViews || 0; // ✅ Corrected ID
  document.getElementById("downloadCount").textContent = stats.downloads || 0;
  document.getElementById("likeCount").textContent = stats.likes || 0;
  document.getElementById("instaViewsCount").textContent = stats.views || 0;
}



// 🔁 Real-time stats listener
database.ref("stats").on("value", updateStatsDisplay);


// 🔼 Visit increment when page loads
window.addEventListener("load", () => {
  const statsRef = database.ref("stats/visits");
  statsRef.transaction(current => (current || 0) + 1);
});
// ✅ Increment YouTube video view count in Firebase
function incrementVideoViews() {
  const videoViewsRef = firebase.database().ref("stats/videoViews");
  videoViewsRef.transaction(current => (current || 0) + 1);
}

// ✅ Increment Instagram view count in Firebase
function incrementInstaViews() {
  const instaViewsRef = firebase.database().ref("stats/views");
  instaViewsRef.transaction(current => (current || 0) + 1);
}
function incrementDownloads() {
  const ref = database.ref("stats/downloads");
  ref.transaction(current => (current || 0) + 1);
}

function incrementLikes() {
  const ref = database.ref("stats/likes");
  ref.transaction(current => (current || 0) + 1);
}

  // ✅ Show stats from Firebase on website
  function showStats() {
  const statsRef = ref(db, 'stats');
  onValue(statsRef, (snapshot) => {
    const stats = snapshot.val();
    document.getElementById("visitCount").textContent = stats.visits || 0;
    document.getElementById("videoViewsCount").textContent = stats.videoViews || 0;
    document.getElementById("downloadCount").textContent = stats.downloads || 0;
    document.getElementById("likeCount").textContent = stats.likes || 0;
    document.getElementById("instaViewsCount").textContent = stats.views || 0;
  });
}

 // 🔐 Toggle Slide Panel
document.getElementById("admin-login-btn").addEventListener("click", () => {
  document.getElementById("admin-login-panel").classList.toggle("active");
});

// 🔐 Login Handler
function handleAdminLogin() {
  const username = document.getElementById("admin-username").value;
  const password = document.getElementById("admin-password").value;

  if (username === "admin" && password === "radha@143") {
    loggedInAdmin = "fanadmin";
    document.getElementById("fan-form-panel").style.display = "block";
    document.getElementById("admin-login-panel").style.display = "none";
    document.getElementById("admin-logout-btn").style.display = "block";

  } else if (username === "admin" && password === "Radha@143") {
    loggedInAdmin = "shayariadmin";
    document.getElementById("shayari-admin-panel").style.display = "block";
    document.getElementById("admin-login-panel").style.display = "none";
    document.getElementById("admin-logout-btn").style.display = "block";

    loadShayarisForAdmin();
  } else {
    document.getElementById("login-error").style.display = "block";
  }
}
function logoutAdmin() {
  loggedInAdmin = null;
  document.getElementById("fan-form-panel").style.display = "none";
  document.getElementById("shayari-admin-panel").style.display = "none";
  document.getElementById("logout-btn").style.display = "none";
}

function showLogoutButton() {
  document.getElementById("logout-btn").style.display = "block";
}

// ❌ Close Button Click
document.getElementById("close-login-panel").addEventListener("click", () => {
  document.getElementById("admin-login-panel").classList.remove("active");
});

// 🖱️ Outside Click to Close Panel
document.addEventListener("click", function (event) {
  const panel = document.getElementById("admin-login-panel");
  const button = document.getElementById("admin-login-btn");

  // If panel is open and clicked outside panel and not on button
  if (
    panel.classList.contains("active") &&
    !panel.contains(event.target) &&
    event.target !== button
  ) {
    panel.classList.remove("active");
  }
});
function submitFanEntry() {
  const name = document.getElementById("fanName").value;
  const tags = parseInt(document.getElementById("fanTags").value);
  const badge = document.getElementById("fanBadge").value;
  const photo = document.getElementById("fanPhoto").value;

  if (!name || !tags || !badge || !photo) {
    alert("Please fill all fields");
    return;
  }

  // 🔍 Check if image exists
  const img = new Image();
  img.onload = function () {
    const newFanRef = database.ref("fans").push(); // auto-id
    newFanRef.set({
      name: name,
      tags: tags,
      badge: badge,
      photo: photo,
      timestamp: Date.now(),
    });

    document.getElementById("fanSubmitMsg").style.display = "block";
    setTimeout(() => {
      document.getElementById("fanSubmitMsg").style.display = "none";
    }, 3000);

    document.getElementById("fanName").value = "";
    document.getElementById("fanTags").value = "";
  };

  img.onerror = function () {
    alert("❌ Photo not found in images/ folder! Please check the name.");
  };

  img.src = `images/${photo}`;
}

function closeFanForm() {
  document.getElementById("fan-form-panel").style.display = "none";
}
window.addEventListener("click", function(event) {
  const panel = document.getElementById("fan-form-panel");
  if (event.target === panel) {
    panel.style.display = "none";
  }
});
// ⏳ Get Current Week
function getCurrentWeek() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// 📝 Submit Fan Entry to Firebase
document.getElementById("fan-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("fan-username").value.trim();
  const tagCount = parseInt(document.getElementById("fan-tagcount").value.trim());
  const photo = document.getElementById("fan-photo").value.trim();

  if (!username || !photo || isNaN(tagCount)) {
    alert("Please fill all fields correctly.");
    return;
  }

const fanData = {
  username: username,
  tagCount: tagCount,
  photo: photo,
  week: getCurrentWeek()
};

const fansRef = firebase.database().ref("fans");
fansRef.push(fanData)
  .then(() => {
    alert("🎉 Fan added successfully!");
    document.getElementById("fan-form").reset();
    document.getElementById("fan-form-panel").style.display = "none";
  })
  .catch(error => {
    console.error("Error adding fan:", error);
    alert("❌ Failed to add fan. Please try again.");
  });
})
function loadTopFans() {
  const fansRef = firebase.database().ref("fans");

  fansRef.once("value", (snapshot) => {
    const fans = [];
    snapshot.forEach((child) => {
      fans.push(child.val());
    });

    // 🔁 Sort by tagCount DESC
    fans.sort((a, b) => b.tagCount - a.tagCount);

    const top10 = fans.slice(0, 10);
    const grid = document.getElementById("topFans");
    const messageDiv = document.getElementById("leaderboard-message");
    grid.innerHTML = "";
    messageDiv.innerHTML = "";

    if (top10.length === 0) {
      messageDiv.innerHTML = `
        💡 अभी तक कोई टॉप फैन नहीं बना है! 
        <br>शायद अगला नाम <strong>आपका</strong> हो सकता है...
        <br><span style="font-size:14px; color:#999;">
          <a href="https://www.instagram.com/beats_of_honey_12" target="_blank" style="color: #ff1493; font-weight: bold;">@beats_of_honey_12</a> को Instagram स्टोरी में ज़रूर mention करें!
        </span>
      `;
    } else {
      messageDiv.innerHTML = `
        👑 क्या आप अगले टॉप फैन बनना चाहते हैं?
        <br>तो अभी Instagram पर हमें story में tag करें!
        <br><span style="font-size:14px; color:#999;">
          Mention करें: 
          <a href="https://www.instagram.com/beats_of_honey_12" target="_blank" style="color: #ff1493; font-weight: bold;">@beats_of_honey_12</a>
        </span>
      `;
    }

    // ⬇️ Render fan cards
    top10.forEach((fan, index) => {
      const fanDiv = document.createElement("div");
      fanDiv.innerHTML = renderFanCard(fan, index);
      grid.appendChild(fanDiv);

// ✅ Leaderboard Rendering (Fixed undefined badge logic)
function renderFanCard(fan, index) {
  let badgeText = "💟 Love Squad";
  let badgeClass = "default";

  if (index === 0) {
    badgeText = "🥇 Gold";
    badgeClass = "gold";
  } else if (index === 1) {
    badgeText = "🥈 Silver";
    badgeClass = "silver";
  } else if (index === 2) {
    badgeText = "🥉 Bronze";
    badgeClass = "bronze";
  }

  return `
    <div class="fan-card">
      <img src="images/${fan.photo}" alt="${fan.username}" class="fan-photo" />
      <span class="badge ${badgeClass}">${badgeText}</span>
      <h3>${fan.username}</h3>
      <p>Tags: ${fan.tagCount}</p>
    </div>
  `;
}
// Assuming 'fans' is your sorted array from Firebase
const html = fans.map((fan, i) => renderFanCard(fan, i)).join("");
document.getElementById("leaderboard").innerHTML = html;

  grid.appendChild(fanDiv);
});

  });
}
loadTopFans();
// 🔁 Get Current Week (already defined)
function getCurrentWeek() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// ⏳ Helper: Get current week
function getCurrentWeek() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
// 📅 Get Current Week
function getCurrentWeek() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// 📦 Render Fan Card (same as your working renderFanCard)
function renderFanCard(fan, index) {
  let badgeText = "💟 Love Squad";
  let badgeClass = "default";

  if (index === 0) {
    badgeText = "🥇 Gold";
    badgeClass = "gold";
  } else if (index === 1) {
    badgeText = "🥈 Silver";
    badgeClass = "silver";
  } else if (index === 2) {
    badgeText = "🥉 Bronze";
    badgeClass = "bronze";
  }

  return `
    <div class="fan-card ${badgeClass}">
      <img src="images/${fan.photo}" alt="${fan.username}" class="fan-photo" />
      <span class="badge">${badgeText}</span>
      <h3>${fan.username}</h3>
      <p>Tags: ${fan.tagCount}</p>
    </div>
  `;
}
document.getElementById("viewPastBtn").addEventListener("click", function () {
  const currentWeek = getCurrentWeek();
  const pastWinnersList = document.getElementById("past-winners-list");
  pastWinnersList.innerHTML = "";

  firebase.database().ref("fans").once("value", snapshot => {
    const pastFans = [];

    snapshot.forEach(child => {
      const fan = child.val();
      if (fan.week && fan.week !== currentWeek) {
        pastFans.push(fan);
      }
    });

    if (pastFans.length === 0) {
      pastWinnersList.innerHTML = `
        <p style="text-align:center; font-size: 18px; color: #d9534f;">
          😢 No Past Winners Found.
        </p>`;
    } else {
      // Sort by tag count
      pastFans.sort((a, b) => b.tagCount - a.tagCount);
      pastFans.forEach((fan, i) => {
        const fanDiv = document.createElement("div");
        fanDiv.innerHTML = renderFanCard(fan, i);
        pastWinnersList.appendChild(fanDiv);
      });
    }

    // ✅ Show modal popup
    document.getElementById("pastWinnersModal").style.display = "flex";
  });
});

// ❌ Close Button Logic
document.getElementById("closePastModal").addEventListener("click", () => {
  document.getElementById("pastWinnersModal").style.display = "none";
});
function getCurrentWeek() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function loadFanOfTheWeek() {
  const currentWeek = getCurrentWeek();
  const fansRef = firebase.database().ref("fans");

  fansRef.once("value", (snapshot) => {
    const fans = [];
    snapshot.forEach((child) => {
      const fan = child.val();
      if (fan.week === currentWeek) {
        fans.push(fan);
      }
    });

    if (fans.length === 0) {
      document.getElementById("fanHighlightBox").innerHTML = "😢 No top fan this week.";
      return;
    }

    // Sort by tag count descending
    fans.sort((a, b) => b.tagCount - a.tagCount);
    const topFan = fans[0];

    const fanHTML = `
      <img src="images/${topFan.photo}" alt="${topFan.username}" />
      <h3>${topFan.username}</h3>
      <p>🏷️ Tags: ${topFan.tagCount}</p>
      <span class="badge">🏆 Fan of the Week</span>
    `;
    document.getElementById("fanHighlightBox").innerHTML = fanHTML;
  });
}

loadFanOfTheWeek(); // ✅ Call this on page load
 document.getElementById('viewAllFansBtn').addEventListener('click', () => {
    document.getElementById('fanWallPopup').classList.remove('hidden');
    loadFanWall();
  });

  function closeFanWall() {
    document.getElementById('fanWallPopup').classList.add('hidden');
  }

  function loadFanWall() {
    const container = document.getElementById('fanWallContainer');
    container.innerHTML = "";

    const dbRef = firebase.database().ref('fans');
    dbRef.orderByChild('timestamp').limitToLast(10).once('value', (snapshot) => {
      const fans = [];
      snapshot.forEach(child => fans.push(child.val()));
      fans.reverse().forEach(fan => {
        const fanCard = document.createElement('div');
        fanCard.innerHTML = `
          <div style="text-align:center;">
            <img src="images/${fan.photo}" alt="${fan.username}" style="width:80px; height:80px; border-radius:50%; border:2px solid pink;">
            <div style="margin-top:6px;"><b>${fan.username}</b></div>
            <div style="font-size:12px; color:gray;">Tags: ${fan.tags}</div>
          </div>
        `;
        container.appendChild(fanCard);
      });
    });
  }
  // 🧱 Fan Wall Toggle Logic
const fanWallModal = document.getElementById("fanWallModal");
const viewAllFansBtn = document.getElementById("viewAllFansBtn");
const closeFanWallBtn = document.getElementById("closeFanWallBtn");

viewAllFansBtn.addEventListener("click", () => {
  fanWallModal.style.display = "block";
});

closeFanWallBtn.addEventListener("click", () => {
  fanWallModal.style.display = "none";
});

// 🔒 Also close modal on clicking outside
window.addEventListener("click", (event) => {
  if (event.target === fanWallModal) {
    fanWallModal.style.display = "none";
  }
});
async function loadFanWall() {
  const fanWallList = document.getElementById("fan-wall-list");
  fanWallList.innerHTML = "Loading... 💗";
  
  const snapshot = await database.ref("fans").limitToLast(10).once("value");
  const fans = snapshot.val();

  fanWallList.innerHTML = "";

  if (fans) {
    Object.values(fans).reverse().forEach(fan => {
      const card = document.createElement("div");
      card.classList.add("fan-card");
      card.innerHTML = `
        <img src="images/${fan.photo}" alt="${fan.username}" />
        <h3>${fan.username}</h3>
        <p>Tags: ${fan.tagCount}</p>
      `;
      fanWallList.appendChild(card);
    });
  } else {
    fanWallList.innerHTML = "No fans yet 😢";
  }
}
viewAllFansBtn.addEventListener("click", () => {
  fanWallModal.style.display = "block";
  loadFanWall(); // 🔁 Fetch latest fans
});
function submitShayari() {
  const style = document.getElementById("shayari-style").value;
  const text = document.getElementById("shayari-text").value.trim();
  const date = new Date().toISOString();

  if (text.length === 0) {
    alert("Please enter a shayari.");
    return;
  }

  const newShayariRef = database.ref("shayaris").push();
  newShayariRef.set({
    style: style,
    text: text,
    date: date
  }, (error) => {
    if (error) {
      alert("Kuch galti ho gayi! Try again.");
    } else {
      document.getElementById("shayari-text").value = "";
      document.getElementById("shayari-submit-success").style.display = "block";
      setTimeout(() => {
        document.getElementById("shayari-submit-success").style.display = "none";
      }, 3000);
    }
  });
}
function loadShayarisForAdmin() {
  const listDiv = document.getElementById("shayari-list");
  listDiv.innerHTML = "<p>Loading shayaris...</p>";

  // Get winner first
  database.ref("winnerShayari").once("value").then((winnerSnap) => {
    const winner = winnerSnap.val();

    // Then get all shayaris
    database.ref("shayaris").once("value", (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        listDiv.innerHTML = "<p>No shayaris submitted yet.</p>";
        return;
      }

      let html = "";
      Object.entries(data).forEach(([id, entry]) => {
        let buttonHtml = "";

        if (winner && winner.id === id) {
          // If this is the winner shayari, show Remove button
          buttonHtml = `
            <button onclick="removeWinningShayari()" style="margin-top: 10px; background: #999; color: white; padding: 8px 16px; font-size: 14px; border: none; border-radius: 10px; cursor: pointer; font-family: 'Poppins', sans-serif;">❌ Remove Winner</button>
          `;
        } else {
          // Otherwise show Select as Winner
          buttonHtml = `
            <button onclick="selectWinningShayari('${id}')" style="margin-top: 10px; background: #ff3385; color: white; padding: 8px 16px; font-size: 14px; border: none; border-radius: 10px; cursor: pointer; font-family: 'Poppins', sans-serif;">🏆 Select as Winner</button>
          `;
        }

        html += `
          <div style="border: 2px dashed #ff80b3; padding: 20px; border-radius: 15px; margin-bottom: 20px; background: #fff; box-shadow: 0 4px 12px rgba(255, 128, 192, 0.1); font-family: 'Dancing Script', cursive;">
            <p style="font-size: 16px; margin-bottom: 8px; color: #cc0066;"><strong>🌷 Style:</strong> ${entry.style}</p>
            <p style="white-space: pre-wrap; font-size: 18px; color: #800040; background: #fff0f5; padding: 12px; border-radius: 10px; line-height: 1.6;">${entry.text}</p>
            ${buttonHtml}
          </div>
        `;
      });

      listDiv.innerHTML = html;
    });
  });
}

// ✅ Select as winner
function selectWinningShayari(id) {
  database.ref("winnerShayari").set({ id: id }).then(() => {
    alert("🎉 Shayari marked as winner!");
    loadShayarisForAdmin(); // Refresh after update
  });
}

// ✅ Remove winner
function removeWinningShayari() {
  database.ref("winnerShayari").remove().then(() => {
    alert("❌ Winner removed.");
    loadShayarisForAdmin(); // Refresh after removal
  });
}

// ✅ Load current winning shayari on public page
database.ref("winnerShayari").once("value", (snapshot) => {
  const winner = snapshot.val();
  if (winner && winner.id) {
    database.ref("shayaris/" + winner.id).once("value", (shayariSnap) => {
      const data = shayariSnap.val();
      if (data) {
        document.getElementById("winner-text").textContent = data.text;
        document.getElementById("winning-shayari").style.display = "block";
      }
    });
  }
});

window.logoutAdmin = function () {
  localStorage.removeItem("adminLoggedIn");
  localStorage.removeItem("adminType");

  // 🧽 Immediately hide logout button BEFORE reload
  document.getElementById("admin-logout-btn").style.display = "none";

  alert("Logged out successfully.");
  location.reload(); // Refresh to reset UI
}
incrementInstagramViews()
// ✅ Add hidden SEO keywords for Google
window.addEventListener("load", () => {
  const seoDiv = document.createElement("div");
  seoDiv.style.display = "none"; // hidden
  seoDiv.innerHTML = `
    Beats of Honey - Romantic Shayari, Sad Shayari, Love Quotes, Hindi Shayari, 
    Romantic Beats, Sad Vibes, Dosti Shayari, Emotional Shayari, Love Poems, 
    Music Beats, Heart Touching Lines, Couple Shayari.
  `;
  document.body.appendChild(seoDiv);
});
