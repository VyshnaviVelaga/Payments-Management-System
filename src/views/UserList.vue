<template>
  <div class="users-page">
    <!-- Header -->
    <div class="top-bar">
      <h2>User Management</h2>
      <router-link to="/users/new" class="add-user">
        + Add User
      </router-link>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <select v-model="selectedRole">
        <option value="">All Roles</option>
        <option>ADMIN</option>
        <option>USER</option>
      </select>

      <select v-model="selectedStatus">
        <option value="">All Status</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="INACTIVE">INACTIVE</option>
      </select>
    </div>

    <!-- Table -->
    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th class="actions">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.id }}</td>

            <!-- Name -->
            <td v-if="editingUserId !== user.id">{{ user.name }}</td>
            <td v-else>
              <input v-model="editingUser.name" type="text" />
            </td>

            <!-- Email -->
            <td v-if="editingUserId !== user.id">{{ user.email }}</td>
            <td v-else>
              <input v-model="editingUser.email" type="email" />
            </td>

            <!-- Phone -->
            <td v-if="editingUserId !== user.id">{{ user.phone }}</td>
            <td v-else>
              <input v-model="editingUser.phone" type="text" />
            </td>

            <!-- Role -->
            <td v-if="editingUserId !== user.id">{{ user.role }}</td>
            <td v-else>
              <select v-model="editingUser.role">
                <option>ADMIN</option>
                <option>USER</option>
              </select>
            </td>

            <!-- Status -->
            <td v-if="editingUserId !== user.id">
              <span
                class="status"
                :class="user.isActive ? 'active' : 'inactive'"
              >
                {{ user.isActive ? "ACTIVE" : "INACTIVE" }}
              </span>
            </td>
            <td v-else>
              <select v-model="editingUser.isActive">
                <option :value="true">ACTIVE</option>
                <option :value="false">INACTIVE</option>
              </select>
            </td>

            <!-- Actions -->
            <td class="actions" v-if="editingUserId !== user.id">
              <button class="edit-btn" @click="editUser(user.id)">
                Edit
              </button>
              <button class="delete-btn" @click="confirmDelete(user.id)">
                Delete
              </button>
            </td>

            <td class="actions" v-else>
              <button class="edit-btn" @click="saveEdit(user.id)">
                Save
              </button>
              <button class="delete-btn" @click="cancelEdit">
                Cancel
              </button>
            </td>
          </tr> 

          <tr v-if="filteredUsers.length === 0">
            <td colspan="7" class="empty">
              No users found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "UserListView",

  data() {
    return {
      /* filters */
      selectedRole: "",
      selectedStatus: "",

      /* inline edit state */
      editingUserId: null,
      editingUser: null,
    };
  },

  computed: {
  users() {
    return this.$store.getters.getUsers || [];
  },

  filteredUsers() {
    return this.users.filter(user => {
      const roleMatch =
        !this.selectedRole || user.role === this.selectedRole;

      const statusMatch =
        !this.selectedStatus ||
        (this.selectedStatus === "ACTIVE" && user.isActive) ||
        (this.selectedStatus === "INACTIVE" && !user.isActive);

      return roleMatch && statusMatch;
    });
  },
},


  mounted() {
  this.$store.dispatch("loadUsers");
},


  methods: {
    ...mapActions({
      loadUsers: "loadUsers",
      saveUser: "saveUser",
      deleteUser: "deleteUser",
    }),

    editUser(id) {
      if (this.editingUserId && this.editingUserId !== id) {
        if (!confirm("Discard unsaved changes?")) return;
      }

      const user = this.users.find(u => u.id === id);
      this.editingUserId = id;
      this.editingUser = { ...user };
    },

    saveEdit() {
      if (!this.editingUser.name || !this.editingUser.email) {
        alert("Name and email are required.");
        return;
      }

      this.saveUser(this.editingUser);
      this.cancelEdit();
    },

    cancelEdit() {
      this.editingUserId = null;
      this.editingUser = null;
    },

    confirmDelete(id) {
      if (!confirm("Are you sure you want to delete this user?")) return;

      if (this.editingUserId === id) {
        this.cancelEdit();
      }

      this.deleteUser(id);
    },
  },
};
</script>



<style scoped>
.users-page {
  padding: 24px;
  background: #f5f7fb;
  min-height: 100vh;
}

/* Header */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-top: 6px;
  padding-bottom: 6px;
}

.top-bar h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.right {
  text-align: right;
  padding-right: 6px;
}   

.add-user {
  background: #6366f1;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
}

.add-user:hover {
  background: #4f46e5;
}

/* Filters */
.filters-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
  flex-wrap: wrap;
}

/* Users page: indigo-accent filters */
.filters-bar select,
.filters-bar input,
.id-input {
  padding: 12px 16px;
  border-radius: 10px;

  border: 2px solid rgba(99,102,241,0.4); /* thicker + more visible */
  background: linear-gradient(180deg, #ffffff, #f8fbff);

  font-size: 14px;
  color: #0f172a;

  box-shadow: 0 4px 12px rgba(15,23,42,0.04);
  transition: border-color 160ms ease,
              box-shadow 160ms ease,
              transform 120ms ease,
              outline 160ms ease;

  outline: 2px solid transparent;
  outline-offset: 2px;
}


.filters-bar select:hover,
.filters-bar input:hover {
  border-color: rgba(99,102,241,0.24);
  box-shadow: 0 8px 20px rgba(99,102,241,0.06);
}

.filters-bar select:focus,
.filters-bar input:focus {
  border-color: #6366f1; /* indigo */
  box-shadow: 0 8px 26px rgba(99,102,241,0.14);
  outline: 2px solid #c7d2fe;
  outline-offset: 2px;
  transform: translateY(-1px);
}

/* Table Card */
.table-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* Table */
table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #e0e7ff;
}

th {
  padding: 14px;
  font-size: 13px;
  color: #3730a3;
  text-align: left;
  font-weight: 600;
}

td {
  padding: 14px;
  border-top: 1px solid #e5e7eb;
  font-size: 14px;
  color: #334155;
}

.right {
  text-align: right;
}

/* Status */
.status {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status.active {
  /*background: #dcfce7;*/
  color: #166534;
}

.status.inactive {
  /* background: #fee2e2;*/
  color: #991b1b;
}

/* Actions */
.edit-btn {
  background: linear-gradient(90deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  border: none;
  margin-right: 6px;
  cursor: pointer;
  box-shadow: 0 6px 14px rgba(79,70,229,0.12);
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(79,70,229,0.18);
  opacity: 0.98;
}

.delete-btn {
  background: linear-gradient(90deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  border: none;
  margin-right: 6px;
  cursor: pointer;
  box-shadow: 0 6px 14px rgba(79,70,229,0.12);
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(79,70,229,0.18);
  opacity: 0.98;
}

/* Center action cells and evenly space buttons */
.actions {
  text-align: center;
  padding: 14px;
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
}

.empty {
  text-align: center;
  padding: 20px;
  color: #6b7280;
}

/* Edit mode inputs */
td input,
td select {
  padding: 8px 10px;
  border: 1.5px solid #c7d2fe;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  background: #f8fbff;
  color: #0f172a;
  transition: border-color 140ms ease, background-color 140ms ease, box-shadow 140ms ease;
}

td input:focus,
td select:focus {
  outline: none;
  border-color: #6366f1;
  background: #ffffff;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}
</style>
