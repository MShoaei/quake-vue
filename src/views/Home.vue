<template>
  <div class="home">
    <CommandForm />
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import CommandForm from "@/components/CommandForm.vue";

export default {
  name: "home",
  components: {
    CommandForm
  }
};
</script>
