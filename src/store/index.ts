import { createStore } from "vuex";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
}

export interface Payment {
  id: number;
  userId: string | number;
  amount: number;
  method: string;
  category: string;
  status: string;
  reference?: string;
  createdAt?: string;
}

const seedUsers: User[] = [
  { id: 101, name: "Alice Johnson", email: "alice@test.com", phone: "1234567890", role: "ADMIN", isActive: true },
  { id: 102, name: "Bob Smith", email: "bob@test.com", phone: "1234567891", role: "USER", isActive: false },
  { id: 103, name: "Carol Davis", email: "carol@test.com", phone: "1234567892", role: "USER", isActive: true },
  { id: 104, name: "Vyshnavi", email: "vyshnavi@test.com", phone: "1234567893", role: "USER", isActive: false },
];

const seedPayments: Payment[] = [
  { id: 1001, userId: "U9255", amount: 100, method: "Card", category: "Food", status: "COMPLETED" },
  { id: 1002, userId: "U2667", amount: 20000, method: "UPI", category: "Utility", status: "PENDING" },
  { id: 1003, userId: "U8410", amount: 2000, method: "Card", category: "Food", status: "FAILED" },
];

/* STORE */
export default createStore({
  state: {
    users: [] as User[],
    payments: [] as Payment[],
    selectedPayment: null as Payment | null,
  },

  /*  GETTERS  */
  getters: {
    getUsers: (state) => state.users,
    getPayments: (state) => state.payments,
    getPaymentById: (state) => (id: number | string) =>
      state.payments.find(p => String(p.id) === String(id)),
    getUserById: (state) => (id: number) =>
      state.users.find(u => u.id === id),
  },

  /*  MUTATIONS */
  mutations: {
    SET_USERS(state, users: User[]) {
      state.users = users;
    },

    ADD_USER(state, user: User) {
      state.users.push(user);
    },

    UPDATE_USER(state, user: User) {
      const idx = state.users.findIndex(u => u.id === user.id);
      if (idx !== -1) state.users[idx] = user;
    },

    DELETE_USER(state, id: number) {
      state.users = state.users.filter(u => u.id !== id);
    },

    SET_PAYMENTS(state, payments: Payment[]) {
      state.payments = payments;
    },

    ADD_PAYMENT(state, payment: Payment) {
      state.payments.push(payment);
    },

    UPDATE_PAYMENT(state, payment: Payment) {
      const idx = state.payments.findIndex(p => p.id === payment.id);
      if (idx !== -1) state.payments[idx] = payment;
    },

    DELETE_PAYMENT(state, id: number) {
      state.payments = state.payments.filter(p => p.id !== id);
    },

    SET_SELECTED_PAYMENT(state, payment: Payment | null) {
      state.selectedPayment = payment;
    },
  },

  /* ACTIONS  */
  actions: {
    /* USERS */
    loadUsers({ commit }) {
      const stored = JSON.parse(localStorage.getItem("users") || "[]");
      const users = stored.length ? stored : seedUsers;
      commit("SET_USERS", users);
      localStorage.setItem("users", JSON.stringify(users));
    },

    saveUser({ state, commit }, user: Partial<User>) {
      if (user.id) {
        commit("UPDATE_USER", user);
      } else {
        commit("ADD_USER", {
          id: Date.now(),
          ...user,
        } as User);
      }
      localStorage.setItem("users", JSON.stringify(state.users));
    },

    deleteUser({ state, commit }, id: number) {
      commit("DELETE_USER", id);
      localStorage.setItem("users", JSON.stringify(state.users));
    },

    /* PAYMENTS */
    loadPayments({ commit }) {
      const stored = JSON.parse(localStorage.getItem("payments") || "[]");
      const payments = stored.length ? stored : seedPayments;
      commit("SET_PAYMENTS", payments);
      localStorage.setItem("payments", JSON.stringify(payments));
    },

    savePayment({ state, commit }, payment: Partial<Payment>) {
      if (payment.id) {
        commit("UPDATE_PAYMENT", payment as Payment);
      } else {
        const ids = state.payments.map(p => p.id).concat([1000]);
        const nextId = Math.max(...ids) + 1;

        commit("ADD_PAYMENT", {
          id: nextId,
          ...payment,
        } as Payment);
      }
      localStorage.setItem("payments", JSON.stringify(state.payments));
    },

    deletePayment({ state, commit }, id: number) {
      commit("DELETE_PAYMENT", id);
      localStorage.setItem("payments", JSON.stringify(state.payments));
    },

    loadPaymentById({ commit, getters }, id: number | string) {
      const payment = getters.getPaymentById(id);
      commit("SET_SELECTED_PAYMENT", payment || null);
    },
  },
});
