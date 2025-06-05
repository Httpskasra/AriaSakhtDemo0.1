<template>
  <div>
    <div id="formafzar-container"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://formafzar.com/pages/formbuilder/ravesh-formbuilder.js";
  script.setAttribute("form-url", "https://formafzar.com/form/caqip");
  script.setAttribute("form-style", "inline");
  script.setAttribute("form-theme", "");

  document.getElementById("formafzar-container").appendChild(script);
});
</script>
