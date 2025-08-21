<script setup lang="ts">
const { public: { apiBase } } = useRuntimeConfig()

// initial tree: roots + first level for fast paint
const { data: treeData, pending: treePending, error: treeError, refresh: refreshTree } =
    await useFetch(() => `${apiBase}/api/v1/filesystem/tree`, {
      query: { maxDepth: 1 }
    })

// selection state
const selectedId = ref<string | null>(null)

// right pane: direct children of selected folder
const { data: childrenData, pending: childrenPending, error: childrenError, refresh: refreshChildren } =
    await useFetch(() =>
            selectedId.value ? `${apiBase}/api/v1/filesystem/${selectedId.value}/files` : null
        , { immediate: false })

// when the user clicks a node in the tree
function onSelectFolder(id: string) {
  selectedId.value = id;
  refreshChildren();
}

// optional: expand a branch lazily (fetch deeper levels as needed)
async function expandBranch(id: string) {
  await $fetch(`${apiBase}/api/v1/filesystem/tree`, {
    query: { parentId: id, maxDepth: 1 }
  })
  await refreshTree();
}
</script>

<template>
  <main class="h-dvh grid grid-cols-[350px_1fr]">
    <!-- Left Pane: Tree -->
    <section class="border-r overflow-auto p-3">
      <header class="mb-2 text-sm font-medium text-gray-500">Folders</header>
      
      <div v-if="treePending" class="text-sm text-gray-500">Loading…</div>
      <div v-else-if="treeError" class="text-sm text-red-600">Failed to load tree</div>
      
      <nav
          v-else
          role="tree" aria-label="Folder tree"
          class="space-y-1"
      >
        <button
            v-for="n in treeData?.directories || []"
            :key="n.id"
            role="treeitem"
            class="block w-full text-left px-2 py-1 rounded hover:bg-gray-100"
            :class="n.id === selectedId ? 'bg-gray-100 font-medium' : ''"
            :style="{ paddingLeft: `${(n.depth ?? 0) * 16 + 8}px` }"
            @click="onSelectFolder(n.id)"
            @dblclick="expandBranch(n.id)"
        >
          {{ n.name }}
          <span class="ml-1 text-xs text-gray-400">▸</span>
        </button>
      </nav>
    </section>
    
    <section class="overflow-auto p-3">
      <header class="mb-2 text-sm font-medium text-gray-500">
        {{ selectedId ? 'Direct sub‑folders' : 'Select a folder on the left' }}
      </header>
      
      <div v-if="childrenPending" class="text-sm text-gray-500">Loading…</div>
      <div v-else-if="childrenError" class="text-sm text-red-600">Failed to load children</div>
      
      <ul v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <li v-for="c in childrenData?.files || []" :key="c.id"
            class="border rounded p-3 hover:shadow-sm transition">
          <div class="font-medium">{{ c.name }}</div>
          <div class="text-xs text-gray-500">ID: {{ c.id }}</div>
        </li>
      </ul>
    </section>
  </main>
</template>
