const bc = new BroadcastChannel('am-channel')

bc.onmessage = (ev) => {
  if (document.hidden) {
    const message = ev.data
    if (message === 'reload-page') {
      window.location.reload()
    }
  }
}

export default bc
