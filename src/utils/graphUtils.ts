/**
 * BFS para encontrar o menor caminho entre dois nodes em um grafo não direcionado
 */
export function findShortestPathBFS(
    fromId: string,
    toId: string,
    adjacencyMap: Map<string, Set<string>>
  ): string[] | null {
    if (!adjacencyMap.has(fromId) || !adjacencyMap.has(toId)) {
      return null;
    }
  
    const queue: string[] = [fromId];
    const visited = new Set<string>([fromId]);
    const prev: Record<string, string | null> = {};
  
    while (queue.length > 0) {
      const node = queue.shift()!;
      if (node === toId) break;
  
      for (const neighbor of adjacencyMap.get(node) || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          prev[neighbor] = node;
          queue.push(neighbor);
        }
      }
    }
  
    if (!visited.has(toId)) return null;
  
    // reconstruir caminho
    const path: string[] = [];
    let cur: string | undefined | null = toId;
  
    while (cur) {
      path.unshift(cur);
      if (cur === fromId) break;
      cur = prev[cur] || null;
    }
  
    return path;
  }
  