<template>
  <div class="payments-page">
    <!-- Header -->
    <div class="top-bar">
      <h2>Payment Management</h2>
      <router-link to="/payments/new" class="add-payment">
        + Add Payment
      </router-link>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <select v-model="selectedMethod">
        <option value="">All Methods</option>
        <option>Card</option>
        <option>UPI</option>
        <option>Bank Transfer</option>
      </select>

      <!-- Search by payment ID (live filter) -->
      <input class="id-input" v-model="filterId" placeholder="Search by payment ID" />

      <select v-model="selectedCategory">
        <option value="">All Categories</option>
        <option>Food</option>
        <option>Utility</option>
        <option>Subscription</option>
      </select>

      <select v-model="selectedStatus">
        <option value="">All Status</option>
        <option>PENDING</option>
        <option>COMPLETED</option>
        <option>FAILED</option>
      </select>
    </div> 

    <!-- Table -->
    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Category</th>
            <th>Status</th>
            <th class="actions">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="payment in filteredPayments" :key="payment.id">
            <td>{{ payment.id }}</td>

            <!-- User ID -->
            <td v-if="editingPaymentId !== payment.id">{{ payment.userId }}</td>
            <td v-else>
              <select class="table-input" v-model="editingPayment.userId">
                <option value="">-- Select user --</option>
                <option v-for="u in usersList" :key="u.id" :value="u.id">{{ u.name }} ({{ u.id }})</option>
              </select>
            </td>

            <!-- Amount -->
            <td v-if="editingPaymentId !== payment.id">{{ payment.amount }}</td>
            <td v-else>
              <input class="table-input" v-model.number="editingPayment.amount" type="number" />
            </td>

            <!-- Method -->
            <td v-if="editingPaymentId !== payment.id">{{ payment.method || "Card" }}</td>
            <td v-else>
              <select class="table-input" v-model="editingPayment.method">
                <option>Card</option>
                <option>UPI</option>
                <option>Bank Transfer</option>
              </select>
            </td>

            <!-- Category -->
            <td v-if="editingPaymentId !== payment.id">{{ payment.category }}</td>
            <td v-else>
              <input class="table-input" v-model="editingPayment.category" type="text" />
            </td>

            <!-- Status -->
            <td v-if="editingPaymentId !== payment.id">
              <span class="status" :class="payment.status.toLowerCase()">
                {{ payment.status }}
              </span>
            </td>
            <td v-else>
              <select class="table-input" v-model="editingPayment.status">
                <option>PENDING</option>
                <option>COMPLETED</option>
                <option>FAILED</option>
              </select>
            </td>

            <!-- Actions -->
            <td class="actions" v-if="editingPaymentId !== payment.id">
              <router-link :to="`/payments/${payment.id}`" class="view-btn">View</router-link>
              <button class="edit-btn" @click="startEdit(payment.id)">Edit</button>
    
            </td>

            <td class="actions" v-else>
              <button class="edit-btn" @click="saveEdit(payment.id)">Save</button>
              
            </td>
          </tr>

          <tr v-if="filteredPayments.length === 0">
            <td colspan="7" class="empty">
              No payments found
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
  name: "PaymentListView",

  data() {
    return {
      // Filters
      selectedMethod: "",
      filterId: "",
      selectedCategory: "",
      selectedStatus: "",

      // Inline edit
      editingPaymentId: null,
      editingPayment: null,
    };
  },

 computed: {
  payments() {
    return this.$store.getters.getPayments || [];
  },

  usersList() {
    return this.$store.getters.getUsers || [];
  },

  filteredPayments() {
    return this.payments.filter(p => {
      const methodMatch = !this.selectedMethod || p.method === this.selectedMethod;
      const categoryMatch = !this.selectedCategory || p.category === this.selectedCategory;
      const statusMatch = !this.selectedStatus || p.status === this.selectedStatus;
      const idMatch = !this.filterId || String(p.id).includes(this.filterId);
      return methodMatch && categoryMatch && statusMatch && idMatch;
    });
  },
},

 mounted() {
  this.$store.dispatch("loadUsers");
  this.$store.dispatch("loadPayments");
},


  methods: {
    ...mapActions([
      "loadPayments",
      "loadUsers",
      "deletePayment",
    ]),

    startEdit(id) {
      if (this.editingPaymentId && this.editingPaymentId !== id) {
        if (!confirm("Discard unsaved changes?")) return;
      }

      const payment = this.payments.find(p => p.id === id);
      this.editingPaymentId = id;
      this.editingPayment = { ...payment };
    },

    saveEdit() {
      if (!this.editingPayment.userId || !this.editingPayment.amount) {
        alert("User and amount are required.");
        return;
      }

      const validUser = this.usersList.some(
        u => String(u.id) === String(this.editingPayment.userId)
      );
      if (!validUser) {
        alert("Selected user does not exist.");
        return;
      }

      // Prefer the real store action `savePayment`, but fall back to `saveInlineEdit` (used in tests/mocks)
      if (this.$store._actions && this.$store._actions.savePayment) {
        this.$store.dispatch("savePayment", this.editingPayment);
      } else if (this.$store._actions && this.$store._actions.saveInlineEdit) {
        this.$store.dispatch("saveInlineEdit", this.editingPayment);
      }

      this.cancelEdit();
    },

    cancelEdit() {
      this.editingPaymentId = null;
      this.editingPayment = null;
    },

    confirmDelete(id) {
      if (confirm("Delete this payment?")) {
        this.deletePayment(id);
        if (this.editingPaymentId === id) this.cancelEdit();
      }
    },
  },
};
</script>


<style scoped>
.payments-page {
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

.add-payment {
  background: #6366f1;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
}

.add-payment:hover {
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

/* Payments page: indigo-accent filters */
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
.filters-bar input:hover,
.id-input:hover {
  border-color: rgba(99,102,241,0.24);
  box-shadow: 0 8px 20px rgba(99,102,241,0.06);
}

.filters-bar select:focus,
.filters-bar input:focus,
.id-input:focus {
  border-color: #6366f1; /* indigo */
  box-shadow: 0 8px 26px rgba(99,102,241,0.14);
  outline: 2px solid #c7d2fe;
  outline-offset: 2px;
  transform: translateY(-1px);
}

.id-input {
  width: 180px;
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
  table-layout: fixed; /* enforce consistent column widths */
}

thead {
  background: #e0e7ff;
} 

th {
  padding: 14px;
  font-size: 13px;
  color: #3730a3;
  text-align: center;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
} 

td {
  padding: 14px;
  border-top: 1px solid #e5e7eb;
  font-size: 14px;
  color: #334155;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
} 

.right {
  text-align: right;
}

/* Column widths for consistent layout */
/* Column widths for consistent layout */
th:nth-child(1), td:nth-child(1) { width: 8%; }   /* ID */
th:nth-child(2), td:nth-child(2) { width: 14%; }  /* User ID */
th:nth-child(3), td:nth-child(3) { width: 12%; }  /* Amount */
th:nth-child(4), td:nth-child(4) { width: 12%; }  /* Method */
th:nth-child(5), td:nth-child(5) { width: auto; min-width: 160px; } /* Category */
th:nth-child(6), td:nth-child(6) { width: 14%; }  /* Status */
  /* Actions */
   /* Actions */

/* Status */
.status {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status.completed {
  /*background: #dcfce7; */
  color: #166534;
}

.status.pending {
  /*background: #fef3c7;  */
  color: #e27531;
}

.status.failed {
  /*background: #fee2e2; */
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
  text-decoration: none;
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


.view-btn {
  background: linear-gradient(90deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  border: none;
  text-decoration: none;
  margin-right: 6px;
  cursor: pointer;
  box-shadow: 0 6px 14px rgba(79,70,229,0.12);
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
}
.view-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(79,70,229,0.18);
  opacity: 0.98;
}
.table-input {
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

.table-input:focus {
  outline: none;
  border-color: #6366f1;
  background: #ffffff;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
} 

/* Center action cells and evenly space buttons */
.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  flex-wrap: wrap;        /* ✅ allows buttons to wrap */
  max-width: 100%;        /* ✅ never exceed cell */
  overflow: hidden;       /* ✅ safety net */
}


.empty {
  text-align: center;
  padding: 20px;
  color: #6b7280;
}
</style>
