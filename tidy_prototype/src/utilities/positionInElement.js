const positionInElement = (e) => {
  const { clientX, clientY, target } = e
  const { top, left } = target.getBoundingClientRect();
  return { x: clientX - left, y: clientY - top }
}

export default positionInElement
