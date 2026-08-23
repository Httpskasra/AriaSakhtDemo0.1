<!-- Compatibility wrapper for the legacy admin layout. The panel has one
     permission-aware navigation source; this component must not define links. -->
<script setup lang="ts">
const emit = defineEmits<{ "update:isMenuOpen": [value: boolean] }>();
const { identity, navItems } = usePanelNavigation();
</script>

<SidebarPanel :items="navItems" :identity="identity" @navigate="emit('update:isMenuOpen', false)" />
