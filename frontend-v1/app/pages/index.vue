<script setup lang="ts">
const { public: { apiBase } } = useRuntimeConfig()

const { data: treeData, pending: treePending, error: treeError, refresh: refreshTree } =
    await useFetch(() => `${apiBase}/api/v1/filesystem/tree`, {
      query: { maxDepth: 1 }
    })

let directoriesTree = reactive(treeData.value.directories);

const selectedId = ref<string | null>(null)

const { data: filesData, pending: filesPending, error: filesError, refresh: refreshFiles } =
    await useFetch(() => `${apiBase}/api/v1/filesystem/${selectedId.value}/files`, { immediate: false })

function onSelectFolder(id: string) {
  selectedId.value = id;
  refreshFiles();
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
  
  const idx = directoriesTree.findIndex(directory => directory.id === id);
  directoriesTree.splice(idx + 1, 0, ...directoriesMap);
}

async function collapseBranch(id: string) {
  for (let i = directoriesTree.length - 1; i >= 0; i--) {
    if (directoriesTree[i].parent_id === id) {
      directoriesTree.splice(i, 1);
    }
  }
}
</script>

<template>
  <main class="h-dvh grid grid-cols-[350px_1fr]">
    <section class="border-r overflow-auto p-3">
      <header class="mb-2 text-sm font-medium text-gray-500">Directories</header>
      
      <div v-if="treePending" class="text-sm text-gray-500">Loading…</div>
      <div v-else-if="treeError" class="text-sm text-red-600">Failed to get directory tree</div>
      
      <nav v-else role="tree" aria-label="Folder tree" class="space-y-1">
        <div class="flex flex-col">
          <div class="flex flex-row" v-for="n in directoriesTree || []" :key="n.id">
            <div>
              <button
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
              <button class="ml-1 text-xs text-gray-400" @click="collapseBranch(n.id)">Collapse</button>
            </div>
          </div>
        </div>
        
      </nav>
    </section>
    
    <section class="overflow-auto p-3">
      <header class="mb-2 text-sm font-medium text-gray-500">
        {{ selectedId ? 'Files' : 'Select directory' }}
      </header>
      
      <div v-if="filesPending" class="text-sm text-gray-500">Loading…</div>
      <div v-else-if="filesError" class="text-sm text-red-600">Failed to get files</div>
      
      <div v-else class="flex flex-col gap-2">
        <div v-for="file in filesData?.files || []" :key="file.id" class="border rounded p-3 hover:shadow-sm transition">
          <div class="font-medium">{{ file.name }}</div>
          <div class="text-xs text-gray-500">Mime: {{ file.mime_type }}</div>
          <div class="text-xs text-gray-500">File Size: {{ file.size_bytes }}</div>
          <div class="text-xs text-gray-500">ID: {{ file.id }}</div>
        </div>
      </div>
    </section>
  </main>
</template>
