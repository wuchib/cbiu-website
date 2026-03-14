let content = ''
const listeners = new Set<() => void>()

export const articleStore = {
  setContent(newContent: string) {
    content = newContent
    listeners.forEach(l => l())
  },

  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },

  getSnapshot() {
    return content
  },

  getServerSnapshot() {
    return ''
  }
}

