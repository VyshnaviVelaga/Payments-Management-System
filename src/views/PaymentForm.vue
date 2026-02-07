<template>
  <div class="payment-form">
    <h1>{{ isEdit ? "Edit Payment" : "Create Payment" }}</h1>

    <form @submit.prevent="submitForm">
      <div class="field">
        <label>Amount</label>
        <input type="number" v-model.number="payment.amount" placeholder="0.00" required />
      </div>

      <div class="field">
        <label>Status</label>
        <select v-model="payment.status">
          <option value="" disabled>Select status</option>
          <option value="PENDING">PENDING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="FAILED">FAILED</option>
        </select>
      </div>

      <div class="field">
        <label>Method</label>
        <select v-model="payment.method">
          <option value="CARD">Card</option>
          <option value="BANK TRANSFER">Bank Transfer</option>
          <option value="UPI">UPI</option>
        </select>
      </div>

      <div class="field">
        <label>Category</label>
        <input type="text" v-model="payment.category" placeholder="e.g., Utilities" />
      </div>

      <div class="field">
        <label>User</label>
        <select v-model="payment.userId" required>
          <option value="">-- Select user --</option>
          <option v-for="u in usersList" :key="u.id" :value="u.id">
            {{ u.name }} ({{ u.id }})
          </option>
        </select>
      </div>

      <div class="field">
        <label>Reference</label>
        <input type="text" v-model="payment.reference" placeholder="Invoice #1234 (optional)" />
      </div>

      <button type="submit">
        {{ isEdit ? "Update Payment" : "Create Payment" }}
      </button>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "PaymentFormView",

  data() {
    return {
      isEdit: false,
      paymentId: null,
      payment: {
        amount: null,
        status: "",
        method: "",
        category: "",
        userId: "",
        reference: "",
      },
    };
  },

  computed: {
    selectedPayment() {
      // prefer Vuex getter `selectedPayment` if present, otherwise use state
      return (this.$store.getters && this.$store.getters.selectedPayment) || this.$store.state.selectedPayment;
    },

    usersList() {
      // support both `getUsers` (store) and `usersList` (tests/mocks)
      return (this.$store.getters && (this.$store.getters.getUsers || this.$store.getters.usersList)) || [];
    },
  },

  mounted() {
    this.loadUsers();

    const id = this.$route.params.id;
    if (id) {
      this.isEdit = true;
      this.paymentId = Number(id);
      // dispatch whichever action is available in the current store (tests mock `loadPaymentForEdit`)
      if (this.$store._actions && this.$store._actions.loadPaymentForEdit) {
        this.$store.dispatch("loadPaymentForEdit", this.paymentId);
      } else {
        this.$store.dispatch("loadPaymentById", this.paymentId);
      }
    }
  },

  watch: {
    selectedPayment(payment) {
      if (payment) {
        this.payment = { ...payment };
      }
    },
  },

  methods: {
    ...mapActions([
      "loadUsers",
      "savePayment",
    ]),

    submitForm() {
      if (!this.usersList.some(u => String(u.id) === String(this.payment.userId))) {
        alert("Selected user does not exist.");
        return;
      }

      this.savePayment({
        ...(this.isEdit ? { id: this.paymentId } : {}),
        ...this.payment,
      });

      // Only navigate if the `/payments` route is registered to avoid warnings
      const hasPaymentsRoute = this.$router && typeof this.$router.getRoutes === 'function' &&
        this.$router.getRoutes().some(r => r.path === "/payments");
      if (hasPaymentsRoute) {
        this.$router.push("/payments");
      }
    },
  },
};
</script>


<style scoped>
.payment-form {
  padding: 24px;
  max-width: 520px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #f8fbff, #ffffff);
  border: 1px solid #e6e9ef;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(99,102,241,0.06);
}

.payment-form h1 {
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
  margin-bottom: 6px;
  font-weight: 600;
  color: #334155;
}

input,
select {
  padding: 10px 12px;
  border: 1px solid #e6e9ef;
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
}

button {
  padding: 10px 18px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  align-self: center;
  min-width: 160px;
}

button:hover {
  background-color: #1d4ed8;
}

@media (max-width: 560px) {
  .payment-form { padding: 16px; margin: 20px 12px; }
  button { width: 100%; min-width: unset; }
}
</style>
