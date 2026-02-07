<template>
  <div class="user-form">
    <h1>Add User</h1>

    <form @submit.prevent="submitForm">
      <div class="field">
        <label>Name</label>
          <input type="text" v-model="user.name" placeholder="e.g., Jane Doe" required />
      </div>

      <div class="field">
        <label>Email</label>
          <input type="email" v-model="user.email" placeholder="name@example.com" required />
      </div>

      <div class="field">
        <label>Phone</label>
          <input type="text" v-model="user.phone" placeholder="e.g., +1 555 555 5555" required />
      </div>

      <div class="field">
        <label>Role</label>
          <select v-model="user.role">
            <option value="" disabled>Select role</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
            <option value="FINANCE">FINANCE</option>
        </select>
      </div>

      <div class="field">
        <label>Status</label>
          <select v-model="user.isActive">
            <option value="" disabled>Select status</option>
            <option :value="true">ACTIVE</option>
            <option :value="false">INACTIVE</option>
        </select>
      </div>

      <button type="submit">Create User</button>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "UserFormView",

  data() {
    return {
      isEdit: false,
      userId: null,
      user: {
        name: "",
        email: "",
        phone: "",
        role: "",
        isActive: null,
      },
    };
  },

  computed: {
    ...mapGetters(["userById"]),
  },

  mounted() {
    this.loadUsers();

    const id = this.$route.params.id;
    if (id) {
      this.isEdit = true;
      this.userId = Number(id);

      const existing = this.userById(this.userId);
      if (existing) {
        this.user = { ...existing };
      }
    }
  },

  methods: {
    ...mapActions(["loadUsers", "saveUser"]),

    submitForm() {
      this.saveUser({
        ...(this.isEdit ? { id: this.userId } : {}),
        ...this.user,
      });

      this.$router.push("/users");
    },
  },
};
</script>



<style scoped>
.user-form {
  padding: 24px;
  max-width: 520px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #f8fbff, #ffffff); /* light indigo */
  border: 1px solid #e6e9ef;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(99,102,241,0.06);
}

.user-form h1 {
  margin: 0 0 18px 0;
  color: #0f172a;
  text-align: center;
}

form {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  width: 100%;
}

label {
  font-weight: 600;
  margin-bottom: 6px;
  color: #334155;
}

input,
select {
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #e6e9ef;
  width: 100%;
  box-sizing: border-box;
}

button {
  padding: 10px 18px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  align-self: center;
  min-width: 160px;
}

button:hover {
  background: #4f46e5;
}

@media (max-width: 560px) {
  .user-form { padding: 16px; margin: 20px 12px; }
  button { width: 100%; min-width: unset; }
}
</style>
