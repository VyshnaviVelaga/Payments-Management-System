<template>
  <div class="payment-detail" v-if="payment">
    <h1>Payment Details</h1>

    <div class="card">
      <div class="row">
        <span class="label">Payment ID</span>
        <span class="value">{{ payment.id }}</span>
      </div>

      <div class="row">
        <span class="label">Amount</span>
        <span class="value">₹{{ payment.amount }}</span>
      </div>

      <div class="row">
        <span class="label">Status</span>
        <span class="value" :class="payment.status.toLowerCase()">
          {{ payment.status }}
        </span>
      </div>

      <div class="row">
        <span class="label">Category</span>
        <span class="value">{{ payment.category }}</span>
      </div>

      <div class="row">
        <span class="label">User ID</span>
        <span class="value">{{ payment.userId }}</span>
      </div>
    </div>

    <router-link to="/payments" class="back-link">
      ← Back to Payments
    </router-link>
  </div>

  <div v-else-if="notFound" class="loading">
    Payment not found
  </div>

  <div v-else class="loading">
    Loading payment details...
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "PaymentDetail",

  computed: {
    payment() {
      return this.$store.getters.getPaymentById(this.$route.params.id);
    },

    notFound() {
      const payments = this.$store.getters.getPayments || [];
      return payments.length > 0 && !this.payment;
    },
  },

  mounted() {
    this.loadPayments();
  },

  watch: {
    "$route.params.id"() {
    },
  },

  methods: {
    ...mapActions(["loadPayments"]),
  },
};
</script>


<style scoped>
.payment-detail {
  padding: 24px;
}

.card {
  background: #f8fafc;
  padding: 24px;
  border-radius: 8px;
  max-width: 500px;
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.label {
  font-weight: 600;
  color: #475569;
}

.value {
  color: #1e293b;
}

.completed {
  color: #16a34a;
  font-weight: bold;
}

.pending {
  color: #d97706;
  font-weight: bold;
}

.failed {
  color: #dc2626;
  font-weight: bold;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  color: #2563eb;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.loading {
  padding: 24px;
  font-style: italic;
}
</style>
