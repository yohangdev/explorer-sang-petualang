<script setup lang="ts">
const { public: { apiBase } } = useRuntimeConfig()

const { data: treeData, pending: treePending, error: treeError, refresh: refreshTree } =
    await useFetch(() => `${apiBase}/api/v1/filesystem/tree`, {
      query: { maxDepth: 1 }
    })

let directoriesTree = reactive(treeData.value.directories);

const selectedId = ref<string | null>(null)

const { data: childrenData, pending: childrenPending, error: childrenError, refresh: refreshChildren } =
    await useFetch(() => `${apiBase}/api/v1/filesystem/${selectedId.value}/files`, { immediate: false })

function onSelectFolder(id: string) {
  selectedId.value = id;
  refreshChildren();
}

async function expandBranch(id: string, depth: number) {
  const { directories } = await $fetch(`${apiBase}/api/v1/filesystem/tree`, {
    query: { parentId: id, maxDepth: 0 }
  });
  
  if (directoriesTree.findIndex(directory => directory.parent_id === id) > 0) {
    return;
  }
  
  const directoriesMap = directories.map(directory => {
    directory.depth = depth + 1;
    return directory;
  })
  
  const idx = directoriesTree.findIndex(directory => directory.id === id);  // idx = 1
  directoriesTree.splice(idx + 1, 0, ...directoriesMap);
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
        <div class="flex flex-col">
          <div class="flex flex-row" v-for="n in directoriesTree || []" :key="n.id">
            <div>
              <button
                  role="treeitem"
                  class="block w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                  :class="n.id === selectedId ? 'bg-gray-100 font-medium' : ''"
                  :style="{ paddingLeft: `${(n.depth ?? 0) * 16 + 8}px` }"
                  @click="onSelectFolder(n.id)"
              >
                {{ n.name }}
              </button>
            </div>
            <div>
              <button class="ml-1 text-xs text-gray-400" @click="expandBranch(n.id, n.depth)">Expand</button>
            </div>
          </div>
        </div>
        
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
