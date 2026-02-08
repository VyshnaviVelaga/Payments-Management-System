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
<img width="1509" height="688" alt="Dashboard" src="https://github.com/user-attachments/assets/9ee8f2dc-9219-4d34-979c-c1fce801d14e" />
<img width="1505" height="410" alt="Dashboard1" src="https://github.com/user-attachments/assets/35f46adf-52ca-423b-bf3f-32c7272346db" />

### User Management
<img width="1507" height="762" alt="UserManagement" src="https://github.com/user-attachments/assets/2d92c091-bd3f-4814-b1cc-e4ec9e9a02fc" />

### Adding User
<img width="1504" height="761" alt="Adding User" src="https://github.com/user-attachments/assets/5dfc23a9-8fc0-47f0-8d27-4d8c20c51fba" />

### Payment Management
<img width="1512" height="775" alt="PaymentManagement" src="https://github.com/user-attachments/assets/a40cf376-e50c-46f7-a6c8-417bd48dc881" />

### Adding Payment
<img width="1505" height="783" alt="Creating Payment" src="https://github.com/user-attachments/assets/8ff1696c-43a1-454a-852b-17d3cdf24444" />

### Viewing Payment
<img width="1508" height="669" alt="Viewing Payment" src="https://github.com/user-attachments/assets/6f6c246e-a7fe-4cd5-811f-be209293b9e0" />


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
