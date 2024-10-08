import type { Editor } from '@tiptap/core'

function printHtml(dom: Element) {
  const style: string = Array.from(document.querySelectorAll('style, link')).reduce(
    (str, style) => str + style.outerHTML,
    '',
  )

  const content: string = style + dom.outerHTML

  const iframe: HTMLIFrameElement = document.createElement('iframe')
  iframe.setAttribute('style', 'position: absolute; width: 0; height: 0; top: 0; left: 0;')
  document.body.appendChild(iframe)

  const frameWindow = iframe.contentWindow
  const doc: any = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document)

  // load style from CDN to iframe
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://cdn.jsdelivr.net/npm/reactjs-tiptap-editor/lib/style.css'
  doc.head.appendChild(link)

  if (doc) {
    doc.open()
    doc.write(content)
    doc.close()
  }

  if (frameWindow) {
    iframe.onload = function () {
      try {
        setTimeout(() => {
          frameWindow.focus()
          try {
            if (!frameWindow.document.execCommand('print', false)) {
              frameWindow.print()
            }
          }
          catch {
            frameWindow.print()
          }
          frameWindow.close()
        }, 10)
      }
      catch (err) {
        console.error(err)
      }

      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 100)
    }
  }
}

export function printEditorContent(view: Editor['view']) {
  const editorContent = view.dom.closest('.ProseMirror')

  if (editorContent) {
    printHtml(editorContent)
    return true
  }
  return false
}
