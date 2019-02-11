import { genId } from './general.js'

// Determine the size of text based on the font size.

const getTextDimensions = (textContent, fontSize) => {
  var div = document.createElement('div')
  div.style.position = 'absolute'
  div.style.visibility = 'hidden'
  div.style.height = 'auto'
  div.style.width = 'auto'
  div.style.whiteSpace = 'nowrap'
  div.style.fontFamily = 'Source Sans Pro'
  div.style.fontSize = `${fontSize}`
  div.style.border = "1px solid blue"; // for convenience when visible
  div.innerHTML = textContent
  document.body.appendChild(div)
  const { width, height } = div.getBoundingClientRect()
  document.body.removeChild(div);
  return { width, height: height - 9 /* Hack to account for baseline. Need to remove */  };
}

class Layout {
  constructor() {
    this.fontSize = 16
    this.nodePadding = 10
  }

  addNode({ nodes, edges }, { textContent = '', nodeX, nodeY }) {
    const textDimensions = getTextDimensions(textContent)
    nodes.push({
      id: genId(),
      box: {
        x: nodeX,
        y: nodeY,
        width: textDimensions.width + (this.nodePadding * 2),
        height: textDimensions.height + (this.nodePadding * 2)
      },
      text: {
        x: nodeX + this.nodePadding,
        y: nodeY + textDimensions.height + this.nodePadding,
        content: textContent
      },
      interactionState: null
    })

    return { nodes, edges }
  }
}

export default Layout
