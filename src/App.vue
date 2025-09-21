<template>
  <div class="bg-gray-800 p-4 flex justify-between items-center">
    <div class="space-x-4">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Save
      </button>
      <button class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
        Edit
      </button>
      <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Delete
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ButtonBar',
}
</script>

<style scoped>
/* Optional: Add any additional styles here */
</style>