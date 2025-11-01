// // // script.js — Web version with Firebase, FB Graph, PagesFM
// // import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
// // import {
// //   getDatabase,
// //   ref,
// //   get,
// //   child
// // } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// // async function fetchJSON(url, params = {}, retries = 5, delay = 1000) {
// //   const qs = new URLSearchParams(params).toString();
// //   const fullURL = `${url}?${qs}`;
// //   for (let i = 0; i < retries; i++) {
// //     try {
// //       const res = await fetch(fullURL);
// //       if (!res.ok) throw new Error(res.statusText);
// //       return await res.json();
// //     } catch (e) {
// //       console.warn(`⚠️ Fetch lỗi (${i + 1}/${retries}):`, e);
// //       await new Promise(r => setTimeout(r, delay));
// //     }
// //   }
// //   return {};
// // }

// // async function getPageAccessToken(pageId, userToken) {
// //   const url = `https://graph.facebook.com/${pageId}`;
// //   const data = await fetchJSON(url, { fields: "access_token", access_token: userToken });
// //   return data.access_token || null;
// // }

// // async function fetchComments(postId, accessToken, startDate, endDate) {
// //   let url = `https://graph.facebook.com/v17.0/${postId}/comments`;
// //   let params = { access_token: accessToken, fields: "id,message,from,created_time", limit: 100 };
// //   let all = [];

// //   while (url) {
// //     const res = await fetchJSON(url, params);
// //     const data = res.data || [];
// //     all.push(...data);
// //     url = res.paging?.next || null;
// //     params = {};
// //   }

// //   const inRange = d => {
// //     if (!startDate || !endDate) return true;
// //     const ds = d.split("T")[0];
// //     return ds >= startDate && ds <= endDate;
// //   };
// //   return all.filter(c => inRange(c.created_time || "")).length;
// // }

// // async function fetchFirebaseEvents(config, postId, startDate, endDate) {
// //   try {
// //     const app = initializeApp(config);
// //     const db = getDatabase(app);
// //     const snapshot = await get(child(ref(db), `facebook_events/${postId}`));
// //     const data = snapshot.val() || {};
// //     const inRange = k => {
// //       if (!startDate || !endDate) return true;
// //       return k >= startDate && k <= endDate;
// //     };
// //     const filtered = Object.keys(data).filter(k => inRange(k));
// //     console.log(`🔥 Firebase: ${filtered.length} sự kiện hợp lệ`);
// //     return filtered.length;
// //   } catch (err) {
// //     console.warn("⚠️ Firebase lỗi:", err);
// //     return 0;
// //   }
// // }

// // async function fetchAllOrders(shopId, apiKey, pageSize) {
// //   const first = await fetchJSON(`https://pos.pages.fm/api/v1/shops/${shopId}/orders`, {
// //     api_key: apiKey,
// //     page_size: pageSize
// //   });
// //   const totalPages = first.total_pages || 1;
// //   const all = [...(first.data || [])];

// //   for (let p = 2; p <= totalPages; p++) {
// //     const res = await fetchJSON(`https://pos.pages.fm/api/v1/shops/${shopId}/orders`, {
// //       api_key: apiKey,
// //       page_size: pageSize,
// //       page: p
// //     });
// //     all.push(...(res.data || []));
// //   }
// //   return all;
// // }

// // async function fetchAdSpend(pageId, adIds, startDate, endDate, tokenMap) {
// //   const token = tokenMap[pageId];
// //   if (!token) return 0;
// //   const since = Math.floor(new Date(startDate).getTime() / 1000);
// //   const until = Math.floor(new Date(endDate).getTime() / 1000);
// //   const res = await fetchJSON(
// //     `https://pages.fm/api/public_api/v1/pages/${pageId}/statistics/ads`,
// //     { page_access_token: token, type: "by_id", since, until }
// //   );
// //   const ads = Array.isArray(res.data) ? res.data : [];
// //   return ads
// //     .filter(a => adIds.includes(String(a.ad_id)))
// //     .reduce((s, a) => s + (parseFloat(a.spend) || 0), 0);
// // }

// // async function runDashboard() {
// //   const inputs = document.querySelectorAll("header .inputs input");
// //   const [adIdInput, postIdInput, startInput, endInput, tokenInput] = inputs;
// //   const adIds = adIdInput.value.trim().split(",").map(x => x.trim());
// //   const postId = postIdInput.value.trim();
// //   const startDate = startInput.value;
// //   const endDate = endInput.value;
// //   const userToken = tokenInput.value.trim();
// //   const PAGE_ID = postId.split("_")[0];

// //   const API_KEY = "08289b6880954e0db77eee3bd22bc550";
// //   const SHOP_ID = "1328235099";
// //   const PAGE_SIZE = 800;
// //   const PAGE_ACCESS_TOKENS = {
// //     "103241425850911":
// //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMzI0MTQyNTg1MDkxMSIsInRpbWVzdGFtcCI6MTc2MDc2NTQ4Mn0.zvT012R7oV62aDRxQXDnPoEbHoUvzATy8FOxnGTvK38",
// //     "107101568655272":
// //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwNzEwMTU2ODY1NTI3MiIsInRpbWVzdGFtcCI6MTc2MDc3MDUxOH0.d5MZbDx_cBYYFO91JnEZQythjwx1scVKd1ZIABBIR-8",
// //     "114507341749438":
// //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExNDUwNzM0MTc0OTQzOCIsInRpbWVzdGFtcCI6MTc2MDc3MDU0Mn0.J17Q1sHwqpnWYSY7f_-pXovr16QvLzxNknp6RrWqlCI",
// //   };

// //   // 🔥 Thông tin Firebase từ key.json
// //   const FIREBASE_CONFIG = {
// //     apiKey: "AIzaSy...",
// //     authDomain: "dash1-d9de2.firebaseapp.com",
// //     databaseURL: "https://dash1-d9de2-default-rtdb.asia-southeast1.firebasedatabase.app",
// //     projectId: "dash1-d9de2",
// //     storageBucket: "dash1-d9de2.appspot.com",
// //     messagingSenderId: "xxxxxx",
// //     appId: "1:xxxxxx:web:xxxxxx"
// //   };

// //   const grid = document.getElementById("dashboardGrid");
// //   grid.querySelectorAll(".value").forEach(v => (v.textContent = "⏳ Đang tải..."));

// //   try {
// //     const pageAccessToken = await getPageAccessToken(PAGE_ID, userToken);
// //     const [commentCount, firebaseEvents, orders, spendTotal] = await Promise.all([
// //       fetchComments(postId, pageAccessToken, startDate, endDate),
// //       fetchFirebaseEvents(FIREBASE_CONFIG, postId, startDate, endDate),
// //       fetchAllOrders(SHOP_ID, API_KEY, PAGE_SIZE),
// //       fetchAdSpend(PAGE_ID, adIds, startDate, endDate, PAGE_ACCESS_TOKENS)
// //     ]);

// //     let totalCod = 0,
// //       totalPrepaid = 0,
// //       totalPriceAll = 0,
// //       totalCostAll = 0,
// //       totalEntries = 0;

// //     for (const order of orders) {
// //       if (String(order.post_id || "") !== postId) continue;
// //       const date = (order.inserted_at || "").split("T")[0];
// //       if (startDate && endDate && !(date >= startDate && date <= endDate)) continue;

// //       const cod =
// //         order.partner?.cod ||
// //         (order.shipments || []).reduce((s, sh) => s + (sh.cod_amount || 0), 0) ||
// //         order.cod ||
// //         0;
// //       const prepaid = order.prepaid || 0;
// //       const totalPrice = order.total_price_after_sub_discount || 0;
// //       const cost = (order.items || []).reduce((sum, it) => {
// //         const price = it.variation_info?.last_imported_price || 0;
// //         const q = it.quantity || 0;
// //         return sum + price * q;
// //       }, 0);

// //       totalCod += cod;
// //       totalPrepaid += prepaid;
// //       totalPriceAll += totalPrice;
// //       totalCostAll += cost;
// //       totalEntries++;
// //     }

// //     const totalRevenue = totalCod + totalPrepaid;
// //     const grossProfit = totalRevenue - totalCostAll - spendTotal;
// //     const conversations = firebaseEvents + commentCount;

// //     // cập nhật UI
// //     const vals = grid.querySelectorAll(".card .value");
// //     vals[1].textContent = spendTotal.toLocaleString("vi-VN") + " đ";
// //     vals[3].textContent = totalEntries;
// //     vals[4].textContent = conversations;
// //     vals[6].textContent = totalPriceAll.toLocaleString("vi-VN") + " đ";
// //     vals[7].textContent = totalCostAll.toLocaleString("vi-VN") + " đ";
// //     vals[8].textContent = grossProfit.toLocaleString("vi-VN") + " đ";
// //     vals[9].textContent =
// //       totalEntries > 0 ? (spendTotal / totalEntries).toLocaleString("vi-VN") + " đ" : "-";
// //     vals[10].textContent =
// //       conversations > 0 ? (spendTotal / conversations).toLocaleString("vi-VN") + " đ" : "-";

// //     console.log("✅ Dashboard payload:", {
// //       spendTotal,
// //       totalEntries,
// //       firebaseEvents,
// //       commentCount,
// //       conversations,
// //       grossProfit
// //     });
// //   } catch (err) {
// //     console.error("⛔ Lỗi Dashboard:", err);
// //   }
// // }

// // document.getElementById("updateBtn").addEventListener("click", runDashboard);


// // script.js — Dashboard logic (with Firebase, Facebook Graph, Orders, Spend)
// // Bạn cần thay phần firebaseConfig dưới đây bằng config của bạn

// // === Firebase SDK import via CDN (module) ===

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, get } from "firebase/database";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCvIRiRqZNHYjtQpDXIfAea1JDQYXsFGk0",
//   authDomain: "dash1-d9de2.firebaseapp.com",
//   databaseURL: "https://dash1-d9de2-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "dash1-d9de2",
//   storageBucket: "dash1-d9de2.firebasestorage.app",
//   messagingSenderId: "599994064805",
//   appId: "1:599994064805:web:fd51e8aaf89a4f4e85924c"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// // Load Firebase modules dynamically
// const scriptFirebaseApp = document.createElement("script");
// scriptFirebaseApp.src = "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
// document.head.appendChild(scriptFirebaseApp);

// const scriptFirebaseDatabase = document.createElement("script");
// scriptFirebaseDatabase.src = "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
// document.head.appendChild(scriptFirebaseDatabase);

// scriptFirebaseDatabase.onload = () => {
//   firebase.initializeApp(firebaseConfig);
//   const database = firebase.database();

//   // Utility fetch
//   async function fetchJSON(url, params = {}, retries = 5, delay = 1000) {
//     const qs = new URLSearchParams(params).toString();
//     const full = `${url}${qs ? "?" + qs : ""}`;
//     for (let i = 0; i < retries; i++) {
//       try {
//         const res = await fetch(full);
//         if (!res.ok) throw new Error(res.statusText);
//         return await res.json();
//       } catch (e) {
//         console.warn(`⚠️ Fetch lỗi ${i+1}/${retries}:`, e);
//         await new Promise(r => setTimeout(r, delay));
//       }
//     }
//     return {};
//   }

//   async function getPageAccessToken(pageId, userToken) {
//     const url = `https://graph.facebook.com/${pageId}`;
//     const data = await fetchJSON(url, { fields: "access_token", access_token: userToken });
//     return data.access_token || null;
//   }

//   async function fetchComments(postId, token, startDate, endDate) {
//     let url = `https://graph.facebook.com/v17.0/${postId}/comments`;
//     let params = { access_token: token, fields: "id,message,from,created_time", limit: 100 };
//     let all = [];
//     while (url) {
//       const res = await fetchJSON(url, params);
//       const data = Array.isArray(res.data) ? res.data : [];
//       all.push(...data);
//       url = res.paging?.next || null;
//       params = {};
//     }
//     const inRange = d => {
//       if (!startDate || !endDate) return true;
//       const ds = d.split("T")[0];
//       return ds >= startDate && ds <= endDate;
//     };
//     return all.filter(c => inRange(c.created_time || "")).length;
//   }

//   async function fetchFirebaseEvents(postId, startDate, endDate) {
//     const refPath = `facebook_events/${postId}`;
//     const snapshot = await database.ref(refPath).get();
//     const data = snapshot.val() || {};
//     const inRange = k => {
//       if (!startDate || !endDate) return true;
//       return k >= startDate && k <= endDate;
//     };
//     let count = 0;
//     for (const k in data) {
//       if (inRange(k)) count++;
//     }
//     return count;
//   }

//   async function fetchAllOrders(shopId, apiKey, pageSize) {
//     const first = await fetchJSON(
//       `https://pos.pages.fm/api/v1/shops/${shopId}/orders`,
//       { api_key: apiKey, page_size: pageSize }
//     );
//     const totalPages = first.total_pages || 1;
//     const all = (first.data || []).slice();
//     for (let p = 2; p <= totalPages; p++) {
//       const res = await fetchJSON(
//         `https://pos.pages.fm/api/v1/shops/${shopId}/orders`,
//         { api_key: apiKey, page_size: pageSize, page: p }
//       );
//       all.push(...(res.data || []));
//     }
//     return all;
//   }

//   async function fetchAdSpend(pageId, adIds, startDate, endDate, tokenMap) {
//     const token = tokenMap[pageId];
//     if (!token) {
//       console.warn("⚠️ Không tìm token cho pageId:", pageId);
//       return 0;
//     }
//     const since = Math.floor(new Date(startDate).getTime() / 1000);
//     const until = Math.floor(new Date(endDate).getTime() / 1000);
//     const res = await fetchJSON(
//       `https://pages.fm/api/public_api/v1/pages/${pageId}/statistics/ads`,
//       { page_access_token: token, type: "by_id", since, until }
//     );
//     const ads = Array.isArray(res.data) ? res.data : [];
//     return ads
//       .filter(a => adIds.includes(String(a.ad_id)))
//       .reduce((s, a) => s + (parseFloat(a.spend) || 0), 0);
//   }

//   async function runDashboard() {
//     const inputs = document.querySelectorAll("header .inputs input");
//     const adIds = inputs[0].value.trim().split(",").map(x => x.trim()).filter(x => x);
//     const postId = inputs[1].value.trim();
//     const startDate = inputs[2].value;
//     const endDate = inputs[3].value;
//     const userToken = inputs[4].value.trim();
//     const PAGE_ID = postId.includes("_") ? postId.split("_")[0] : null;

//     const API_KEY = "08289b6880954e0db77eee3bd22bc550";
//     const SHOP_ID = "1328235099";
//     const PAGE_SIZE = 800;
//     const PAGE_ACCESS_TOKENS = {
//       "103241425850911": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMzI0MTQyNTg1MDkxMSIsInRpbWVzdGFtcCI6MTc2MDc2NTQ4Mn0.zvT012R7oV62aDRxQXDnPoEbHoUvzATy8FOxnGTvK38",
//     "107101568655272": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwNzEwMTU2ODY1NTI3MiIsInRpbWVzdGFtcCI6MTc2MDc3MDUxOH0.d5MZbDx_cBYYFO91JnEZQythjwx1scVKd1ZIABBIR-8",
//     "114507341749438": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExNDUwNzM0MTc0OTQzOCIsInRpbWVzdGFtcCI6MTc2MDc3MDU0Mn0.J17Q1sHwqpnWYSY7f_-pXovr16QvLzxNknp6RrWqlCI"
//     };

//     const grid = document.getElementById("dashboardGrid");
//     grid.querySelectorAll(".value").forEach(v => v.textContent = "⏳ Đang tải...");

//     try {
//       const pageToken = await getPageAccessToken(PAGE_ID, userToken);
//       if (!pageToken) {
//         alert("Không lấy được PAGE_ACCESS_TOKEN.");
//         return;
//       }
//       const [comments, fbEvents, orders, spend] = await Promise.all([
//         fetchComments(postId, pageToken, startDate, endDate),
//         fetchFirebaseEvents(postId, startDate, endDate),
//         fetchAllOrders(SHOP_ID, API_KEY, PAGE_SIZE),
//         fetchAdSpend(PAGE_ID, adIds, startDate, endDate, PAGE_ACCESS_TOKENS)
//       ]);

//       let totalCod = 0, totalPrepaid = 0, totalPriceAll = 0, totalCostAll = 0, totalEntries = 0;
//       for (const order of orders) {
//         if (String(order.post_id || "") !== postId) continue;
//         const date = (order.inserted_at || "").split("T")[0];
//         if (startDate && endDate && !(date >= startDate && date <= endDate)) continue;

//         const cod = order.partner?.cod || (order.shipments || []).reduce((s, sh) => s + (sh.cod_amount || 0), 0) || order.cod || 0;
//         const prepaid = order.prepaid || 0;
//         const totalPrice = order.total_price_after_sub_discount || 0;
//         const cost = (order.items || []).reduce((sum, it) => {
//           const price = it.variation_info?.last_imported_price || 0;
//           const q = it.quantity || 0;
//           return sum + price * q;
//         }, 0);

//         totalCod += cod;
//         totalPrepaid += prepaid;
//         totalPriceAll += totalPrice;
//         totalCostAll += cost;
//         totalEntries++;
//       }

//       const totalRevenue = totalCod + totalPrepaid;
//       const grossProfit = totalRevenue - totalCostAll - spend;
//       const conversations = comments + fbEvents;

//       const values = grid.querySelectorAll(".card .value");
//       // mapping index:
//       // 0: Ad ID, 1: Spend, 2: Post ID, 3: Orders, 4: Conversations
//       // 5: Conversion, 6: Revenue, 7: Cost Goods, 8: Profit, 9: Cost/Order, 10: Cost/Conversation
//       values[0].textContent = adIds.join(", ");
//       values[2].textContent = postId;
//       values[1].textContent = spend.toLocaleString("vi-VN") + " đ";
//       values[3].textContent = totalEntries;
//       values[4].textContent = conversations;
//       values[6].textContent = totalPriceAll.toLocaleString("vi-VN") + " đ";
//       values[7].textContent = totalCostAll.toLocaleString("vi-VN") + " đ";
//       values[8].textContent = grossProfit.toLocaleString("vi-VN") + " đ";
//       values[9].textContent = totalEntries > 0 ? (spend / totalEntries).toLocaleString("vi-VN") + " đ" : "-";
//       values[10].textContent = conversations > 0 ? (spend / conversations).toLocaleString("vi-VN") + " đ" : "-";
//       values[5].textContent = conversations > 0 ? ((totalEntries / conversations) * 100).toFixed(2) + " %" : "-";

//     } catch (e) {
//       console.error("❌ Lỗi chạy dashboard:", e);
//     }
//   }

//   document.getElementById("updateBtn").addEventListener("click", runDashboard);
// };




// ====== FIREBASE CONFIG ======
const firebaseConfig = {
  apiKey: "AIzaSyCvIRiRqZNHYjtQpDXIfAea1JDQYXsFGk0",
  authDomain: "dash1-d9de2.firebaseapp.com",
  databaseURL: "https://dash1-d9de2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dash1-d9de2",
  storageBucket: "dash1-d9de2.appspot.com",
  messagingSenderId: "599994064805",
  appId: "1:599994064805:web:fd51e8aaf89a4f4e85924c"
};

// ====== LOAD FIREBASE SDK SEQUENTIALLY ======
const loadScript = src => new Promise(r => {
  const s = document.createElement("script");
  s.src = src;
  s.onload = r;
  document.head.appendChild(s);
});

(async () => {
  await loadScript("https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js");
  await loadScript("https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js");

  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

  // ====== FETCH UTIL ======
  async function fetchJSON(url, params = {}, retries = 5, delay = 1000) {
    const qs = new URLSearchParams(params).toString();
    const full = `${url}${qs ? "?" + qs : ""}`;
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(full);
        if (!res.ok) throw new Error(res.statusText);
        return await res.json();
      } catch (e) {
        console.warn(`⚠️ Fetch lỗi ${i + 1}/${retries}:`, e);
        await new Promise(r => setTimeout(r, delay));
      }
    }
    return {};
  }

  // ====== FB & POS FUNCTIONS ======
  async function getPageAccessToken(pageId, userToken) {
    const data = await fetchJSON(`https://graph.facebook.com/${pageId}`, {
      fields: "access_token",
      access_token: userToken
    });
    return data.access_token || null;
  }

  async function fetchComments(postId, token, startDate, endDate) {
    let url = `https://graph.facebook.com/v17.0/${postId}/comments`;
    let params = { access_token: token, fields: "id,message,from,created_time", limit: 100 };
    let all = [];
    while (url) {
      const res = await fetchJSON(url, params);
      const data = Array.isArray(res.data) ? res.data : [];
      all.push(...data);
      url = res.paging?.next || null;
      params = {};
    }
    const inRange = d => {
      const ds = (d || "").split("T")[0];
      return !startDate || !endDate || (ds >= startDate && ds <= endDate);
    };
    return all.filter(c => inRange(c.created_time)).length;
  }

  async function fetchFirebaseEvents(postId, startDate, endDate) {
    const refPath = `facebook_events/${postId}`;
    const snapshot = await database.ref(refPath).get();
    const data = snapshot.val() || {};
    const inRange = k => !startDate || !endDate || (k >= startDate && k <= endDate);
    let count = 0;
    for (const k in data) if (inRange(k)) count++;
    return count;
  }

  async function fetchAllOrders(shopId, apiKey, pageSize) {
    const first = await fetchJSON(
      `https://pos.pages.fm/api/v1/shops/${shopId}/orders`,
      { api_key: apiKey, page_size: pageSize }
    );
    const totalPages = first.total_pages || 1;
    const all = (first.data || []).slice();
    for (let p = 2; p <= totalPages; p++) {
      const res = await fetchJSON(
        `https://pos.pages.fm/api/v1/shops/${shopId}/orders`,
        { api_key: apiKey, page_size: pageSize, page: p }
      );
      all.push(...(res.data || []));
    }
    return all;
  }

  async function fetchAdSpend(pageId, adIds, startDate, endDate, tokenMap) {
    const token = tokenMap[pageId];
    if (!token) return 0;
    const since = Math.floor(new Date(startDate).getTime() / 1000);
    const until = Math.floor(new Date(endDate).getTime() / 1000);
    const res = await fetchJSON(
      `https://pages.fm/api/public_api/v1/pages/${pageId}/statistics/ads`,
      { page_access_token: token, type: "by_id", since, until }
    );
    const ads = Array.isArray(res.data) ? res.data : [];
    return ads
      .filter(a => adIds.includes(String(a.ad_id)))
      .reduce((s, a) => s + (parseFloat(a.spend) || 0), 0);
  }

  // ====== MAIN DASHBOARD RUNNER ======
  async function runDashboard() {
    const inputs = document.querySelectorAll("header .inputs input");
    const adIds = inputs[0].value.trim().split(",").map(x => x.trim()).filter(Boolean);
    const postId = inputs[1].value.trim();
    const startDate = inputs[2].value;
    const endDate = inputs[3].value;
    const userToken = inputs[4].value.trim();
    const PAGE_ID = postId.includes("_") ? postId.split("_")[0] : null;

    const API_KEY = "08289b6880954e0db77eee3bd22bc550";
    const SHOP_ID = "1328235099";
    const PAGE_SIZE = 800;
       const PAGE_ACCESS_TOKENS = {
      "103241425850911": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMzI0MTQyNTg1MDkxMSIsInRpbWVzdGFtcCI6MTc2MDc2NTQ4Mn0.zvT012R7oV62aDRxQXDnPoEbHoUvzATy8FOxnGTvK38",
    "107101568655272": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwNzEwMTU2ODY1NTI3MiIsInRpbWVzdGFtcCI6MTc2MDc3MDUxOH0.d5MZbDx_cBYYFO91JnEZQythjwx1scVKd1ZIABBIR-8",
    "114507341749438": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExNDUwNzM0MTc0OTQzOCIsInRpbWVzdGFtcCI6MTc2MDc3MDU0Mn0.J17Q1sHwqpnWYSY7f_-pXovr16QvLzxNknp6RrWqlCI"
    };

    const grid = document.getElementById("dashboardGrid");
    grid.querySelectorAll(".value").forEach(v => v.textContent = "⏳ Đang tải...");

    try {
      const pageToken = await getPageAccessToken(PAGE_ID, userToken);
      if (!pageToken) return alert("Không lấy được PAGE_ACCESS_TOKEN.");

      const [comments, fbEvents, orders, spend] = await Promise.all([
        fetchComments(postId, pageToken, startDate, endDate),
        fetchFirebaseEvents(postId, startDate, endDate),
        fetchAllOrders(SHOP_ID, API_KEY, PAGE_SIZE),
        fetchAdSpend(PAGE_ID, adIds, startDate, endDate, PAGE_ACCESS_TOKENS)
      ]);

      let totalCod = 0, totalPrepaid = 0, totalPriceAll = 0, totalCostAll = 0, totalEntries = 0;
      for (const order of orders) {
        if (String(order.post_id || "") !== postId) continue;
        const date = (order.inserted_at || "").split("T")[0];
        if (startDate && endDate && !(date >= startDate && date <= endDate)) continue;

        const cod = order.partner?.cod || (order.shipments || []).reduce((s, sh) => s + (sh.cod_amount || 0), 0) || order.cod || 0;
        const prepaid = order.prepaid || 0;
        const totalPrice = order.total_price_after_sub_discount || 0;
        const cost = (order.items || []).reduce((sum, it) => {
          const price = it.variation_info?.last_imported_price || 0;
          const q = it.quantity || 0;
          return sum + price * q;
        }, 0);

        totalCod += cod;
        totalPrepaid += prepaid;
        totalPriceAll += totalPrice;
        totalCostAll += cost;
        totalEntries++;
      }

      const totalRevenue = totalCod + totalPrepaid;
      const grossProfit = totalRevenue - totalCostAll - spend;
      const conversations = comments + fbEvents;

      const values = grid.querySelectorAll(".card .value");
      values[0].textContent = adIds.join(", ");
      values[1].textContent = spend.toLocaleString("vi-VN") + " đ";
      values[2].textContent = postId;
      values[3].textContent = totalEntries;
      values[4].textContent = conversations;
      values[5].textContent = conversations > 0 ? ((totalEntries / conversations) * 100).toFixed(2) + " %" : "-";
      values[6].textContent = totalPriceAll.toLocaleString("vi-VN") + " đ";
      values[7].textContent = totalCostAll.toLocaleString("vi-VN") + " đ";
      values[8].textContent = grossProfit.toLocaleString("vi-VN") + " đ";
      values[9].textContent = totalEntries > 0 ? (spend / totalEntries).toLocaleString("vi-VN") + " đ" : "-";
      values[10].textContent = conversations > 0 ? (spend / conversations).toLocaleString("vi-VN") + " đ" : "-";

    } catch (e) {
      console.error("❌ Lỗi chạy dashboard:", e);
    }
  }

  document.getElementById("updateBtn").addEventListener("click", runDashboard);
})();
