const API_URL = import.meta.env.VITE_API_URL;

export const ITEM_POINTS = {
  "Mobile Phone": 50,
  Laptop: 150,
  Tablet: 100,
  "Charger / Cable": 10,
  Battery: 20,
  Earphones: 15,
  "Circuit Board": 30,
  "USB Drive": 10,
  "Keyboard / Mouse": 25,
  Other: 10,
};

async function _call(method, path, body = null) {
  const jwt = localStorage.getItem("echo_jwt");
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Server error.");
  return data.data;
}

// ── USERS ─────────────────────────────────────────────────
export async function resolveUser(email) {
  return _call("POST", "/api/users/resolve", { email });
}

export async function createUserProfile(name, email, userId = null) {
  return _call("POST", "/api/users/create-profile", { name, email, userId });
}

export async function getUserProfile() {
  return _call("GET", "/api/users/profile");
}

export async function updateUserProfile(name) {
  return _call("PUT", "/api/users/profile", { name });
}

export async function setVerified(name = "") {
  return _call("POST", "/api/users/set-verified", { name });
}

export async function getAllUsers() {
  return _call("GET", "/api/users/all");
}

export async function getUserByEmail(email) {
  return _call("GET", `/api/users/by-email?email=${encodeURIComponent(email)}`);
}

// ── ROLE MANAGEMENT ───────────────────────────────────────
export async function promoteToAdmin(targetUserId) {
  return _call("PUT", `/api/users/${targetUserId}/promote-admin`);
}

export async function promoteToSuperAdmin(targetUserId) {
  return _call("PUT", `/api/users/${targetUserId}/promote-superadmin`);
}

export async function demoteToUser(targetUserId) {
  return _call("PUT", `/api/users/${targetUserId}/demote`);
}

export async function deleteUser(targetUserId) {
  return _call("DELETE", `/api/users/${targetUserId}`);
}

// ── SUBMISSIONS ───────────────────────────────────────────
export async function createSubmission(_userId, { items, binId, groupId }) {
  return _call("POST", "/api/submissions", { items, binId, groupId });
}

export async function getUserSubmissions() {
  return _call("GET", "/api/submissions/mine");
}

export async function getAllSubmissions() {
  return _call("GET", "/api/submissions/all");
}

export async function updateSubmissionStatus(submissionId, newStatus) {
  return _call("PUT", `/api/submissions/${submissionId}/status`, { newStatus });
}

export async function deleteSubmission(submissionId) {
  return _call("DELETE", `/api/submissions/${submissionId}`);
}

// ── REWARDS ───────────────────────────────────────────────
export async function getAvailableRewards() {
  return _call("GET", "/api/rewards/available");
}

export async function getAllRewards() {
  return _call("GET", "/api/rewards/all");
}

export async function createReward(data) {
  return _call("POST", "/api/rewards", data);
}

export async function updateReward(rewardId, data) {
  return _call("PUT", `/api/rewards/${rewardId}`, data);
}

export async function deleteReward(rewardId) {
  return _call("DELETE", `/api/rewards/${rewardId}`);
}

// ── COUPON CODES ──────────────────────────────────────────
export async function addCouponCodesToReward(rewardId, codes) {
  return _call("POST", "/api/coupons/add", { rewardId, codes });
}

export async function getCouponCodesForReward(rewardId) {
  return _call("GET", `/api/coupons/${rewardId}/codes`);
}

export async function getAvailableCodeCount(rewardId) {
  const res = await _call("GET", `/api/coupons/${rewardId}/count`);
  return res.count;
}

export async function getAvailableCodeCounts(rewardIds) {
  const ids = rewardIds.join(",");
  return _call("GET", `/api/coupons/counts?ids=${ids}`);
}

export async function deleteCouponCode(codeId) {
  return _call("DELETE", `/api/coupons/${codeId}`);
}

// ── REDEMPTIONS ───────────────────────────────────────────
export async function redeemReward(_userId, rewardId) {
  return _call("POST", "/api/redemptions", { rewardId });
}

export async function getUserRedemptions() {
  return _call("GET", "/api/redemptions/mine");
}

// ── GROUPS ────────────────────────────────────────────────
export async function createGroup(name) {
  return _call("POST", "/api/groups", { name });
}

export async function getGroup(groupId) {
  return _call("GET", `/api/groups/${groupId}`);
}

export async function getGroups(groupIds) {
  if (!groupIds?.length) return [];
  return _call("POST", "/api/groups/multiple", { groupIds });
}

export async function getGroupLeaderboard() {
  return _call("GET", "/api/groups/leaderboard");
}

export async function leaveGroup(_userId, groupId) {
  return _call("DELETE", `/api/groups/${groupId}/leave`);
}

export async function sendInvite(
  groupId,
  email,
  _invitedBy,
  inviterName,
  inviterEmail,
) {
  return _call("POST", `/api/groups/${groupId}/invite`, {
    email,
    inviterName,
    inviterEmail,
  });
}

export async function getPendingInvites(email) {
  return _call("GET", `/api/groups/invites?email=${encodeURIComponent(email)}`);
}

export async function acceptInvite(inviteId, _userId, groupId) {
  return _call("POST", `/api/groups/invites/${inviteId}/accept`, { groupId });
}

export async function declineInvite(inviteId) {
  return _call("POST", `/api/groups/invites/${inviteId}/decline`);
}

export async function getGroupAchievements(groupId) {
  return _call("GET", `/api/groups/${groupId}/achievements`);
}
