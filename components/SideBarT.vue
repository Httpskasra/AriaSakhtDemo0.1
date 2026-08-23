<script setup lang="ts">
const emit = defineEmits<{ "update:isMenuOpen": [value: boolean] }>();
const { identity, navItems } = usePanelNavigation();
</script>

<SidebarPanel :items="navItems" :identity="identity" @navigate="emit('update:isMenuOpen', false)" />
