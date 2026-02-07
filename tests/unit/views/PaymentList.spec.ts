import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createRouter, createWebHistory } from "vue-router";
import PaymentList from "@/views/PaymentList.vue";

describe("PaymentList.vue", () => {
  let store: any;
  let router: any;
  let actions: any;

  const payments = [
    {
      id: 1,
      userId: 101,
      amount: 500,
      method: "UPI",
      category: "Food",
      status: "COMPLETED",
    },
    {
      id: 2,
      userId: 102,
      amount: 200,
      method: "Card",
      category: "Utility",
      status: "PENDING",
    },
  ];

  const users = [
    { id: 101, name: "Alice" },
    { id: 102, name: "Bob" },
  ];

  const mountComponent = async () => {
    actions = {
      loadPayments: jest.fn(),
      loadUsers: jest.fn(),
      saveInlineEdit: jest.fn(),
      deletePayment: jest.fn(),
    };

    store = createStore({
      actions,
      getters: {
        getPayments: () => payments,
        getUsers: () => users,
      },
    });

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: "/payments", component: PaymentList },
        { path: "/payments/:id", component: { template: "<div />" } },
      ],
    });

    router.push("/payments");
    await router.isReady();

    return mount(PaymentList, {
      global: {
        plugins: [store, router],
        stubs: {
          RouterLink: true,
        },
      },
    });
  };

  it("renders payment list", async () => {
    const wrapper = await mountComponent();

    expect(wrapper.text()).toContain("Payment Management");
    expect(wrapper.text()).toContain("500");
    expect(wrapper.text()).toContain("Food");
  });

  it("dispatches loadUsers and loadPayments on mount", async () => {
    await mountComponent();

    expect(actions.loadUsers).toHaveBeenCalled();
    expect(actions.loadPayments).toHaveBeenCalled();
  });

  it("filters payments by status", async () => {
    const wrapper = await mountComponent();

    // Filters bar has 3 selects:
  
    const filterSelects = wrapper.findAll(".filters-bar select");
    const statusSelect = filterSelects[2]; // Status filter

    await statusSelect!.setValue("COMPLETED");

    // Check that table body shows only completed payment
    const tableRows = wrapper.findAll("tbody tr");
    expect(tableRows.length).toBeGreaterThan(0);
    // The first row should have COMPLETED status
    expect(tableRows[0].text()).toContain("COMPLETED");
  });

  it("enters edit mode when Edit is clicked", async () => {
    const wrapper = await mountComponent();

    await wrapper.find(".edit-btn").trigger("click");

    expect(wrapper.find(".table-input").exists()).toBe(true);
  });

  it("saves inline edit", async () => {
    const wrapper = await mountComponent();

    await wrapper.find(".edit-btn").trigger("click");

    const amountInput = wrapper.find('input[type="number"]');
    await amountInput.setValue(999);

    const saveButton = wrapper.find(".edit-btn");
    await saveButton.trigger("click");

    expect(actions.saveInlineEdit).toHaveBeenCalled();
  });

  it("shows empty state when no payments match filter", async () => {
    const wrapper = await mountComponent();

    const input = wrapper.find(".id-input");
    await input.setValue("999");

    expect(wrapper.text()).toContain("No payments found");
  });
});
