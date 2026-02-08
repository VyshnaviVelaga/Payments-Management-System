# Payments Management System 

A frontend web application for managing users and payments, developed as part of a mini project using Vue 3 with Vuex and TypeScript.  
The application emphasizes clean architecture, efficient state management, and clear visualization of payment statuses and transaction details, providing a modular interface for creating, viewing, and managing users and payment transactions.


---

##  Problem Statement

A fintech startup requires a secure internal system to manage all payment flows with full traceability and reporting.

This project delivers a Vue.js frontend that:
- Manages users and payment records
- Visualizes payment statuses and categories
- Supports filtering and detailed payment views
- Includes unit tests for critical payment components

---

## Features

### User Management
- View all users
- Create new users

### Payment Management
- View all payments
- Filter payments by status
- View payment details by ID
- Create and update payment records

### Testing
- Unit tests implemented using Vue Test Utils and Jest
- Minimum of **two test cases per major payment component**

---

## Technology Stack

- **Vue.js 3**
- **Vue Router**
- **TypeScript**
- **JavaScript (Options API)**
- **Vue Test Utils**
- **Jest**


---

##  Project Structure
```text
pms/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   │   └── NavBar.vue
│   ├── models/
│   │   ├── Payment.ts
│   │   └── User.ts
│   ├── router/
│   │   └── index.ts
│   ├── store/
│   │   └── index.ts
│   ├── views/
│   │   ├── Dashboard.vue
│   │   ├── PaymentDetail.vue
│   │   ├── PaymentForm.vue
│   │   ├── PaymentList.vue
│   │   ├── UserForm.vue
│   │   └── UserList.vue
│   ├── App.vue
│   ├── main.ts
│   ├── shims-vue.d.ts
│   └── vue-shims.d.ts
├── tests/
│   └── unit/
│       └── views/
│           ├── PaymentDetail.spec.ts
│           ├── PaymentForm.spec.ts
│           └── PaymentList.spec.ts
├── .browserslistrc
├── .gitignore
├── babel.config.js
├── jest.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
├── vue.config.js
└── README.md
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

## Application Screenshots
### Dashboard
<img width="1509" height="770" alt="Dashboard3" src="https://github.com/user-attachments/assets/ecb704b6-a4bb-415b-bba3-9b0298130bfc" />
<img width="1505" height="410" alt="Dashboard1" src="https://github.com/user-attachments/assets/35f46adf-52ca-423b-bf3f-32c7272346db" />

### User Management
<img width="1509" height="797" alt="UserManagement1" src="https://github.com/user-attachments/assets/a45b9f6c-a823-4ece-b9d7-8464a0d74603" />

### Adding User
<img width="1509" height="843" alt="AddingUsers1" src="https://github.com/user-attachments/assets/fab9b738-18ca-42f7-8c81-ae4570a8fbf6" />

### Payment Management
<img width="1509" height="882" alt="PaymentManagemnet1" src="https://github.com/user-attachments/assets/4b564e06-a3ec-458a-8b0a-c6bfb7603eee" />

### Adding Payment
<img width="1509" height="928" alt="AddingPayment1" src="https://github.com/user-attachments/assets/9da97a34-e45f-4aed-8569-b6ef9cba6702" />

### Viewing Payment
<img width="1509" height="928" alt="Viewingpayment1" src="https://github.com/user-attachments/assets/56992fc5-0092-4107-9fa6-78e725f24fa7" />


### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```
### Unit Testing Status
<img width="789" height="311" alt="Testing" src="https://github.com/user-attachments/assets/dba2fdec-7c26-47ab-96a9-b072fbaa84a0" />

## Conclusion

This project demonstrates a structured approach to building a scalable frontend application using Vue 3, focusing on modular design, state management, and testability for a fintech-style use case.
