<template>
  <div class="panel-filter-bar" role="search"><slot /></div>
</template>

<style scoped>
.panel-filter-bar { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:.75rem; margin-bottom:1rem; padding:.75rem; direction:rtl; background:var(--color-bg-surface); border:1px solid var(--color-border); border-radius:var(--radius-card); }
.panel-filter-bar :deep(.filter-group) { display:flex; flex:1 1 auto; flex-wrap:wrap; align-items:center; justify-content:flex-start; gap:.65rem; min-width:0; direction:rtl; }
.panel-filter-bar :deep(input), .panel-filter-bar :deep(select) { max-width:100%; }
@media (max-width:640px) { .panel-filter-bar { align-items:stretch; flex-direction:column; } .panel-filter-bar :deep(> *), .panel-filter-bar :deep(.filter-group) { width:100%; } .panel-filter-bar :deep(.filter-group) { align-items:stretch; flex-direction:column; } }
</style>
