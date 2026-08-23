<template>
  <div class="panel-filter-bar" role="search"><slot /></div>
</template>

<style scoped>
.panel-filter-bar { display:flex; flex-wrap:wrap; align-items:center; gap:.75rem; margin-bottom:1rem; padding:.75rem; background:var(--color-bg-surface); border:1px solid var(--color-border); border-radius:var(--radius-card); }
@media (max-width:640px) { .panel-filter-bar { align-items:stretch; flex-direction:column; } .panel-filter-bar :deep(> *) { width:100%; } }
</style>
