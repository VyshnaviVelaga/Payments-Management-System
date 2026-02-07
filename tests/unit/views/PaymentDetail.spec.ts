import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createRouter, createWebHistory } from "vue-router";
import PaymentDetail from "@/views/PaymentDetail.vue";

/**
 * Helper: create Vuex store
 */
function createVuexStore(payments: any[], loadPayments = jest.fn()) {
  return createStore({
    state: {
      payments,
    },
    getters: {
      getPayments: (state) => state.payments,
      getPaymentById: (state) => (id: string) =>
        state.payments.find((p: any) => String(p.id) === String(id)),
    },
    actions: {
      loadPayments,
    },
  });
}

/**
 * Helper: create router
 */
function createVueRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: "/payments/:id",
        component: PaymentDetail,
      },
    ],
  });
}

describe("PaymentDetail.vue", () => {
  const payment = {
    id: 1,
    amount: 500,
    status: "COMPLETED",
    category: "Food",
    userId: 101,
  };

  it("renders payment details when payment exists", async () => {
    const store = createVuexStore([payment]);
    const router = createVueRouter();

    router.push("/payments/1");
    await router.isReady();

    const wrapper = mount(PaymentDetail, {
      global: {
        plugins: [store, router],
        stubs: {
          "router-link": true, // ✅ avoids router-link warning
        },
      },
    });

    expect(wrapper.text()).toContain("Payment Details");
    expect(wrapper.text()).toContain("1");
    expect(wrapper.text()).toContain("500");
    expect(wrapper.text()).toContain("Food");
    expect(wrapper.text()).toContain("101");
    expect(wrapper.text()).toContain("COMPLETED");
  });

  it("shows payment not found when id does not exist", async () => {
    const store = createVuexStore([payment]);
    const router = createVueRouter();

    router.push("/payments/999");
    await router.isReady();

    const wrapper = mount(PaymentDetail, {
      global: {
        plugins: [store, router],
        stubs: {
          "router-link": true,
        },
      },
    });

    expect(wrapper.text()).toContain("Payment not found");
  });

  it("shows loading state when payments are empty", async () => {
    const store = createVuexStore([]);
    const router = createVueRouter();

    router.push("/payments/1");
    await router.isReady();

    const wrapper = mount(PaymentDetail, {
      global: {
        plugins: [store, router],
        stubs: {
          "router-link": true,
        },
      },
    });

    expect(wrapper.text()).toContain("Loading payment details");
  });

  it("dispatches loadPayments on mount", async () => {
    const loadPayments = jest.fn();
    const store = createVuexStore([payment], loadPayments);
    const router = createVueRouter();

    router.push("/payments/1");
    await router.isReady();

    mount(PaymentDetail, {
      global: {
        plugins: [store, router],
        stubs: {
          "router-link": true,
        },
      },
    });

    expect(loadPayments).toHaveBeenCalled();
  });

  it("applies correct status class", async () => {
    const store = createVuexStore([payment]);
    const router = createVueRouter();

    router.push("/payments/1");
    await router.isReady();

    const wrapper = mount(PaymentDetail, {
      global: {
        plugins: [store, router],
        stubs: {
          "router-link": true,
        },
      },
    });

    const statusEl = wrapper.find(".completed");
    expect(statusEl.exists()).toBe(true);
    expect(statusEl.text()).toBe("COMPLETED");
  });
});
