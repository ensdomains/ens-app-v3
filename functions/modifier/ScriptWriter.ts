export class ScriptWriter {
  private src: string

  constructor(src: string) {
    this.src = src
  }

  element(element: Element) {
    element.append(`<script src="${this.src}"></script>`, { html: true })
  }
}
