// cleanup old stored data
export const cleanup = () => {
    window.localStorage.removeItem('craigmcn-words-compress')
    window.localStorage.removeItem('craigmcn-words-icons-only')
}
