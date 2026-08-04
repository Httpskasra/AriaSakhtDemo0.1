<template><FavItems /></template>

<style scoped>
.fav-container {
  width: 100%;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-field);
  background-color: #ffff;
}

.no-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.no-items img {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
}

.no-items p {
  color: var(--color-text-muted);
  font-size: 1.1rem;
}

.fav-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

@media (max-width: 767px) {
  .fav-container {
    width: 100%;
    max-width: 100%;
    padding: 20px 10px;
    padding-top: 0;
    box-sizing: border-box;
  }
  .fav-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}
</style>
