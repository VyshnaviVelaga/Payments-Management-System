<template>
  <div class="dashboard">
    <h1>Dashboard</h1>

    <!--Stats cards -->
    <div class="stats">
      <div class="card clickable" @click="goToUsers">
        <h3>Total Users</h3>
        <p>{{ totalUsers }}</p>
      </div>

      <div class="card clickable" @click="goToPayments">
        <h3>Total Payments</h3>
        <p>{{ totalPayments }}</p>
      </div>

      <div class="card completed">
        <h3>Completed</h3>
        <p>{{ completedPayments }}</p>
      </div>

      <div class="card pending">
        <h3>Pending</h3>
        <p>{{ pendingPayments }}</p>
      </div>

      <div class="card failed">
        <h3>Failed</h3>
        <p>{{ failedPayments }}</p>
      </div>
    </div>

    <!-- Charts -->
    <div class="charts">
      <div class="card chart-card">
        <h3>Payments by Status</h3>
        <canvas ref="statusCanvas"></canvas>
      </div>

      <div class="card chart-card">
        <h3>Payments by Category</h3>
        <canvas ref="categoryCanvas"></canvas>
      </div>
    </div>

    <!-- Recent payments -->
    <div class="table-card">
      <h2>Recent Payments</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Category</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in recentPayments" :key="p.id">
            <td>{{ p.id }}</td>
            <td>{{ p.userId }}</td>
            <td>{{ p.amount }}</td>
            <td>
              <span class="status" :class="p.status.toLowerCase()">
                {{ p.status }}
              </span>
            </td>
            <td>{{ p.category }}</td>
          </tr>

          <tr v-if="recentPayments.length === 0">
            <td colspan="5" class="empty">No payments available</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Chart from "chart.js/auto";

export default {
  name: "DashboardView",

  data() {
    return {
      statusChart: null,
      categoryChart: null,
    };
  },

  computed: {
    ...mapGetters(["getUsers", "getPayments"]),

    users() {
      return this.getUsers || [];
    },

    payments() {
      return this.getPayments || [];
    },

    totalUsers() {
      return this.users.length;
    },

    totalPayments() {
      return this.payments.length;
    },

    completedPayments() {
      return this.payments.filter(p => p.status === "COMPLETED").length;
    },

    pendingPayments() {
      return this.payments.filter(p => p.status === "PENDING").length;
    },

    failedPayments() {
      return this.payments.filter(p => p.status === "FAILED").length;
    },

    recentPayments() {
      return this.payments.slice().reverse().slice(0, 5);
    },

    categoryCounts() {
      return this.payments.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {});
    },
  },

  mounted() {
    this.$store.dispatch("loadUsers");
    this.$store.dispatch("loadPayments");
  },

  watch: {
    payments: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!val || !val.length) return;
        this.$nextTick(this.renderCharts);
      },
    },
  },

  beforeUnmount() {
    this.statusChart?.destroy();
    this.categoryChart?.destroy();
  },

  methods: {
    goToUsers() {
      this.$router.push("/users");
    },

    goToPayments() {
      this.$router.push("/payments");
    },

    renderCharts() {
      const statusEl = this.$refs.statusCanvas;
      const categoryEl = this.$refs.categoryCanvas;
      if (!statusEl || !categoryEl) return;

      this.statusChart?.destroy();
      this.categoryChart?.destroy();

      this.statusChart = new Chart(statusEl, {
        type: "pie",
        data: {
          labels: ["COMPLETED", "PENDING", "FAILED"],
          datasets: [{
            data: [
              this.completedPayments,
              this.pendingPayments,
              this.failedPayments,
            ],
            backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      });

      const categories = Object.keys(this.categoryCounts);
      const data = categories.map(c => this.categoryCounts[c]);

      this.categoryChart = new Chart(categoryEl, {
        type: "bar",
        data: {
          labels: categories.length ? categories : ["No data"],
          datasets: [{
            label: "Payments",
            data: data.length ? data : [0],
            backgroundColor: "#3b82f6",
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          scales: {
            y: { beginAtZero: true, ticks: { precision: 0 } },
          },
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 24px;
  background: #f5f7fb;
  min-height: 100vh;
}

h1 {
  margin-bottom: 20px;
  color: #1e293b;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.card h3 {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 10px;
}

.card p {
  font-size: 26px;
  font-weight: 700;
  color: #1e293b;
}


.clickable {
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.card.completed p {
  color: #16a34a;
}

.card.pending p {
  color: #d97706;
}

.card.failed p {
  color: #dc2626;
}


.charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.chart-card {
  width: 100%;
  height: 300px;          
  padding: 16px;
  display: block;         
}

.chart-card h3 {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
  text-align: center;
}

.chart-card canvas {
  width: 100% !important;
  height: 220px !important;
  display: block;
}


.table-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.table-card h2 {
  margin-bottom: 14px;
  color: #1e293b;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #e0e7ff;
}

th,
td {
  padding: 12px;
  text-align: left;
}

td {
  border-top: 1px solid #e5e7eb;
}

.status {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status.completed {
  background: #dcfce7;
  color: #166534;
}

.status.pending {
  background: #fef3c7;
  color: #92400e;
}

.status.failed {
  background: #fee2e2;
  color: #991b1b;
}

.empty {
  text-align: center;
  padding: 20px;
  color: #6b7280;
}
</style>

