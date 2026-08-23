<script setup lang="ts">
type Column = { key: string; label: string; class?: string };

const props = withDefaults(defineProps<{
  rows: any[];
  columns: Column[];
  rowKey?: string;
  minWidth?: string;
}>(), { rowKey: "id", minWidth: "42rem" });

const getKey = (row: Record<string, any>, index: number) => String(row[props.rowKey] ?? row._id ?? index);
</script>

<template>
  <div class="panel-data-table" role="region" aria-label="جدول اطلاعات" tabindex="0">
    <table :style="{ minWidth: props.minWidth }">
      <thead><tr><th v-for="column in columns" :key="column.key" :class="column.class" scope="col">{{ column.label }}</th></tr></thead>
      <tbody>
        <tr v-for="(row, index) in rows" :key="getKey(row, index)">
          <td v-for="column in columns" :key="column.key" :class="column.class">
            <slot :name="`${column.key}-data`" :row="row" :index="index">{{ row[column.key] ?? "—" }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.panel-data-table { overflow-x:auto; -webkit-overflow-scrolling:touch; background:var(--color-bg-surface); border:1px solid var(--color-border); border-radius:var(--radius-card); outline:none; }
.panel-data-table:focus-visible { box-shadow:var(--focus-ring); }
.panel-data-table table { width:100%; border-collapse:collapse; }
.panel-data-table th, .panel-data-table td { padding:.85rem 1rem; text-align:right; border-bottom:1px solid var(--color-border); white-space:nowrap; }
.panel-data-table th { position:sticky; top:0; z-index:1; color:var(--color-text-muted); background:var(--color-bg-light); font-size:.8rem; font-weight:700; }
.panel-data-table td { color:var(--color-text-body); font-size:.875rem; }
.panel-data-table tbody tr { transition:background-color .15s ease; }
.panel-data-table tbody tr:hover { background:var(--color-bg-light); }
.panel-data-table tbody tr:last-child td { border-bottom:0; }
</style>
