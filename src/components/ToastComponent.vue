<template>
  <Toast ref="toast" />
</template>

<script setup>
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const showToast = (severity, summary, detail, life = 3000) => {
  toast.add({ severity, summary, detail, life });
};

defineExpose({
  showToast
});
</script>
