import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createRouter, createWebHistory } from "vue-router";
import PaymentForm from "@/views/PaymentForm.vue";

describe("PaymentForm.vue", () => {
  let actions: any;
  let store: any;
  let router: any;

  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];

  beforeEach(async () => {
    actions = {
      loadUsers: jest.fn(),
      loadPaymentForEdit: jest.fn(),
      savePayment: jest.fn(),
    };

    store = createStore({
      actions,
      getters: {
        usersList: () => users,
        selectedPayment: () => null,
      },
    });

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: "/payments/new", component: PaymentForm },
        { path: "/payments/:id/edit", component: PaymentForm },
      ],
    });
  });

  const mountForm = async (path = "/payments/new") => {
    router.push(path);
    await router.isReady();

    return mount(PaymentForm, {
      global: {
        plugins: [store, router],
        stubs: { RouterLink: true },
      },
    });
  };

  it("renders create payment form", async () => {
    const wrapper = await mountForm();
    expect(wrapper.text()).toContain("Create Payment");
  });

  it("submits form and saves payment", async () => {
    const wrapper = await mountForm();

    const selects = wrapper.findAll("select");

    // Status select (2nd select)
    await selects[0]!.setValue("PENDING");

    // Method select (3rd select)
    await selects[1]!.setValue("UPI");

    // User select (last select)
    await selects[2]!.setValue("1");

    await wrapper
      .find('input[placeholder="e.g., Utilities"]')
      .setValue("Food");

    await wrapper.find('input[type="number"]').setValue(500);

    await wrapper.find("form").trigger("submit.prevent");

    expect(actions.savePayment).toHaveBeenCalled();
  });

  it("shows alert when selected user does not exist", async () => {
    window.alert = jest.fn();

    const wrapper = await mountForm();

    const selects = wrapper.findAll("select");
    await selects[0]!.setValue("COMPLETED");
    await selects[1]!.setValue("UPI");
    await selects[2]!.setValue("999"); // invalid user

    await wrapper.find('input[type="number"]').setValue(200);

    await wrapper.find("form").trigger("submit.prevent");

    expect(window.alert).toHaveBeenCalled();
    expect(actions.savePayment).not.toHaveBeenCalled();
  });

  it("enters edit mode when route param id exists", async () => {
    const wrapper = await mountForm("/payments/10/edit");

    expect(wrapper.text()).toContain("Edit Payment");
    expect(actions.loadPaymentForEdit).toHaveBeenCalled();
  });
});
