<template>
  <nav class="navbar">
    <div class="logo">
      <span class="app-title">Payments Management System</span>
    </div>

    <ul class="nav-links">
      <li>
        <router-link to="/">Dashboard</router-link>
      </li>
      <li>
        <router-link to="/users">Users</router-link>
      </li>
      <li>
        <router-link to="/payments">Payments</router-link>
      </li>
      
    </ul>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4338ca   /* indigo-700 */
;
  padding: 12px 24px;
  color: #ffffff;
}

.logo {
  font-weight: bold;
  padding: 40px;
  

}

.app-title {
  font-size: 30px;
  font-weight: 800;
  color: #ffffff;
}
.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.nav-links li a {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
}

.nav-links li a.router-link-active {
  border-bottom: 2px solid #38bdf8;
  padding-bottom: 4px;
}

.nav-links li a:hover {
  color: #38bdf8;
}
</style> 
